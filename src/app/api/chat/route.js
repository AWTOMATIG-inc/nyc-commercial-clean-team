import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat/systemPrompt";
import { isRateLimited } from "@/lib/chat/rateLimiter";
import { guardReply } from "@/lib/chat/replyGuard";
import {
  advanceQuoteFlow,
  createInitialQuoteFlowState,
  detectsQuoteIntent,
  getFieldPrompt,
  MAX_ATTEMPTS,
  parseQuoteFlow,
  RETRY_SUBMIT_FIELD,
} from "@/lib/chat/quoteFlow";

const MODEL = "openai/gpt-oss-120b";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES = 60; // Same cap as ChatWidget.jsx.
// The widget trims history at 7,000 characters but always keeps the last pair,
// and one bot reply can be long. This leaves room for that.
const MAX_TOTAL_CHARACTERS = 12000;
const CHAT_ROLES = ["user", "assistant"];
const DEFAULT_CATEGORY = "chatbot-general";

// nginx must overwrite X-Real-IP with $remote_addr, which a client can't fake.
// The first X-Forwarded-For value is whatever the client sent. The last one is
// the only value a proxy appends, so it's the fallback.
function getClientIp(request) {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",").pop().trim() || "unknown";
}

// Only role and content reach the model, and only user/assistant roles, so a
// caller can't add a system message.
function parseMessages(messages) {
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES
  ) {
    return null;
  }
  const isValid = messages.every(
    (m) => CHAT_ROLES.includes(m?.role) && typeof m.content === "string",
  );
  if (!isValid || messages[messages.length - 1].role !== "user") {
    return null;
  }
  return messages.map(({ role, content }) => ({ role, content }));
}

function parseCategory(category) {
  return typeof category === "string" && /^[a-z0-9-]{1,100}$/i.test(category)
    ? category
    : DEFAULT_CATEGORY;
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

// Closes only when the whole message is a closing, so "thanks, one more
// question..." still gets answered. See 00-ARCHITECTURE.md's "Session closing"
// section. Only checked outside an active quote flow so it can't misfire on a
// field answer that happens to contain "thanks".
const CLOSING_PHRASE =
  "(?:(?:thanks|thank you|thank u|thx|ty)(?: (?:a lot|so much|very much))?(?: for (?:the|your|all your) (?:help|info))?|that['’]?s all|that is all|no more questions|nothing else|good ?bye|bye)";
const CLOSING_INTENT_PATTERN = new RegExp(
  `^(?:(?:ok|okay|great|perfect|cool|awesome|no)[\\s,.!]+)?${CLOSING_PHRASE}(?:[\\s,.!]+${CLOSING_PHRASE})*[\\s.!]*$`,
  "i",
);

function detectsClosingIntent(message) {
  return CLOSING_INTENT_PATTERN.test((message || "").trim());
}

async function submitQuote(request, collected, category) {
  const formData = new FormData();
  formData.append("fullName", collected.fullName);
  formData.append("email", collected.email);
  formData.append("phone", collected.phone);
  formData.append("facilityType", collected.facilityType);
  formData.append("zipCode", collected.zipCode);
  formData.append("category", category);

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
    const body = await request.json();
    const messages = parseMessages(body?.messages);
    if (!messages) {
      return NextResponse.json(
        { error: "messages is required" },
        { status: 400 },
      );
    }

    const lastUserMessage = messages[messages.length - 1].content;

    if (lastUserMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({
        reply:
          "That message is a bit long — could you shorten it to under 500 characters?",
      });
    }

    const totalCharacters = messages.reduce(
      (sum, m) => sum + m.content.length,
      0,
    );
    if (totalCharacters > MAX_TOTAL_CHARACTERS) {
      return NextResponse.json(
        { error: "conversation is too long" },
        { status: 400 },
      );
    }

    const parsedFlow = parseQuoteFlow(body.quoteFlow);
    if (!parsedFlow.valid) {
      return NextResponse.json({
        reply:
          "Sorry, something went wrong with that quote request. Just ask for a quote again and we'll start over.",
        quoteFlow: null,
      });
    }
    const quoteFlow = parsedFlow.state;
    const category = parseCategory(body.category);

    if (quoteFlow) {
      if (quoteFlow.field === RETRY_SUBMIT_FIELD) {
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
            field: RETRY_SUBMIT_FIELD,
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
      ...messages,
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

    return NextResponse.json({ reply: guardReply(reply) });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
