import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat/systemPrompt";
import {
  advanceQuoteFlow,
  createInitialQuoteFlowState,
  detectsQuoteIntent,
  getFieldPrompt,
  MAX_ATTEMPTS,
} from "@/lib/chat/quoteFlow";

const MODEL = "openai/gpt-oss-120b";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function submitQuote(request, collected, category) {
  const formData = new FormData();
  formData.append("fullName", collected.fullName);
  formData.append("email", collected.email);
  formData.append("phone", collected.phone);
  formData.append("facilityType", collected.facilityType);
  formData.append("zipCode", collected.zipCode);
  formData.append("category", category || "chatbot-general");

  const quoteUrl = new URL("/api/quote", request.url);
  const res = await fetch(quoteUrl, { method: "POST", body: formData });
  return res.ok;
}

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured." },
      { status: 500 },
    );
  }

  try {
    const { messages, quoteFlow, category } = await request.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages is required" },
        { status: 400 },
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    if (quoteFlow?.active) {
      const result = advanceQuoteFlow(quoteFlow, lastUserMessage);

      if (result.status === "invalid") {
        if (result.attempts >= MAX_ATTEMPTS) {
          return NextResponse.json({
            reply:
              "I wasn't able to get a valid answer for that, so I'll close this chat for now. Feel free to start over anytime, or give us a call!",
            quoteFlow: null,
          });
        }
        return NextResponse.json({
          reply: `That doesn't look quite right. ${result.examplePrompt}`,
          quoteFlow: {
            ...quoteFlow,
            attempts: {
              ...quoteFlow.attempts,
              [quoteFlow.field]: result.attempts,
            },
          },
        });
      }

      if (result.status === "advance") {
        return NextResponse.json({
          reply: getFieldPrompt(result.nextField),
          quoteFlow: {
            active: true,
            field: result.nextField,
            collected: result.collected,
            attempts: quoteFlow.attempts,
          },
        });
      }

      // result.status === "complete"
      const submitted = await submitQuote(request, result.collected, category);
      if (!submitted) {
        return NextResponse.json({
          reply:
            "Sorry, something went wrong submitting your quote request. Please try again in a moment or give us a call.",
          quoteFlow: null,
        });
      }
      return NextResponse.json({
        reply:
          "You're all set! Your quote request has been submitted and our team will be in touch shortly. Anything else I can help with?",
        quoteFlow: null,
      });
    }

    if (detectsQuoteIntent(lastUserMessage)) {
      const initialState = createInitialQuoteFlowState();
      return NextResponse.json({
        reply: getFieldPrompt(initialState.field),
        quoteFlow: initialState,
      });
    }

    const chatMessages = [
      { role: "system", content: buildSystemPrompt() },
      ...messages.map((m) => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: chatMessages,
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        stream: false,
      }),
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      console.log("Groq API error:", groqRes.status, errBody);
      return NextResponse.json(
        { error: "something went wrong" },
        { status: 502 },
      );
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      return NextResponse.json(
        { error: "something went wrong" },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
