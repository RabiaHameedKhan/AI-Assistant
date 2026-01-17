import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// ✅ FORCE NODE RUNTIME
export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message, systemPrompt } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("GROQ ERROR 👉", error);

    return NextResponse.json(
      { error: "AI failed to respond" },
      { status: 500 }
    );
  }
}
