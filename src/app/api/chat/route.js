import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat/systemPrompt";
import { isRateLimited } from "@/lib/chat/rateLimiter";
import {
  advanceQuoteFlow,
  createInitialQuoteFlowState,
  detectsQuoteIntent,
  getFieldPrompt,
  MAX_ATTEMPTS,
} from "@/lib/chat/quoteFlow";

const MODEL = "openai/gpt-oss-120b";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_MESSAGE_LENGTH = 500;

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

// Simple keyword check for "wants to book" intent — distinct from
// detectsQuoteIntent's keywords (quote/estimate/pricing/price/proposal/how
// much), so the two rarely collide. Checked before quote intent: on the
// genuinely ambiguous overlap ("how much to book weekly cleaning"), a low-
// friction "Book Now" link is a safer default than kicking off the 5-field
// quote flow the customer may not have wanted.
const BOOKING_INTENT_PATTERN =
  /\b(book|booking|schedule|scheduling|reserve|reservation|appointment)\b/i;

function detectsBookingIntent(message) {
  return BOOKING_INTENT_PATTERN.test(message || "");
}

// Simple, non-exhaustive keyword check for gratitude/closing phrases — see
// 00-ARCHITECTURE.md's "Session closing" section. Only checked outside an
// active quote flow so it can't misfire on a field answer that happens to
// contain "thanks".
const CLOSING_INTENT_PATTERN =
  /\b(thanks|thank you|thank u|thx|ty|that'?s all|that is all|no more questions|nothing else|goodbye|good ?bye|bye)\b/i;

function detectsClosingIntent(message) {
  return CLOSING_INTENT_PATTERN.test(message || "");
}

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

  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json({
      reply: "You're sending messages a bit fast — give me a moment!",
    });
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

    if (lastUserMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({
        reply:
          "That message is a bit long — could you shorten it to under 500 characters?",
      });
    }

    if (quoteFlow?.active) {
      if (quoteFlow.field === "__retry_submit__") {
        const submitted = await submitQuote(request, quoteFlow.collected, category);
        if (!submitted) {
          return NextResponse.json({
            reply:
              "Still couldn't submit your quote request. Send any message and I'll try again, or give us a call and we'll take it from there.",
            quoteFlow,
          });
        }
        return NextResponse.json({
          reply:
            "You're all set! Your quote request has been submitted and our team will be in touch shortly. Anything else I can help with?",
          quoteFlow: null,
        });
      }

      const result = advanceQuoteFlow(quoteFlow, lastUserMessage);

      if (result.status === "invalid") {
        if (result.attempts >= MAX_ATTEMPTS) {
          return NextResponse.json({
            reply:
              "I wasn't able to get a valid answer for that, so I'll close this chat for now. Feel free to start over anytime, or give us a call!",
            quoteFlow: null,
            close: true,
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
            "Sorry, something went wrong submitting your quote request. Send any message and I'll try again, or give us a call.",
          quoteFlow: {
            active: true,
            field: "__retry_submit__",
            collected: result.collected,
            attempts: quoteFlow.attempts,
          },
        });
      }
      return NextResponse.json({
        reply:
          "You're all set! Your quote request has been submitted and our team will be in touch shortly. Anything else I can help with?",
        quoteFlow: null,
      });
    }

    if (detectsClosingIntent(lastUserMessage)) {
      return NextResponse.json({
        reply: "Great, glad I could help! Closing this chat now.",
        close: true,
      });
    }

    if (detectsBookingIntent(lastUserMessage)) {
      return NextResponse.json({
        reply: "You can book directly here:",
        booking: true,
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
