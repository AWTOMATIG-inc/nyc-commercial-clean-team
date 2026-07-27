import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat/systemPrompt";

const MODEL = "openai/gpt-oss-120b";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured." },
      { status: 500 },
    );
  }

  try {
    const { messages } = await request.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages is required" },
        { status: 400 },
      );
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
