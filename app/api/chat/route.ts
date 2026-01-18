import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    // 🔒 SAFETY CHECK
    if (!messages || !messages[0]?.content) {
      return NextResponse.json(
        { error: "Message content missing" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
