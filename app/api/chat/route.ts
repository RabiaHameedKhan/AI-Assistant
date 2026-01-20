import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // ✅ DO NOT BLOCK RESPONSE
    const userId = session?.user?.id || "guest";

    const body = await req.json();
    const { messages } = body;

    if (!messages || !messages[0]?.content) {
      return NextResponse.json(
        { error: "Message content missing" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    const assistantReply = completion.choices[0].message.content;

    // 🔹 Save in background
    (async () => {
      try {
        const client = await clientPromise;
        const db = client.db("chatDB");
        const chatCollection = db.collection("chats");

        const userMessage = {
          role: "user",
          content: messages[messages.length - 1].content,
          timestamp: new Date().toISOString(),
        };

        const assistantMessage = {
          role: "assistant",
          content: assistantReply,
          timestamp: new Date().toISOString(),
        };

        const chatDoc = await chatCollection.findOne({ userId });

        if (chatDoc) {
          await chatCollection.updateOne(
            { userId },
            { $push: { messages: { $each: [userMessage, assistantMessage] } } }
          );
        } else {
          await chatCollection.insertOne({
            userId,
            messages: [userMessage, assistantMessage],
          });
        }
      } catch (err) {
        console.error("MongoDB save error:", err);
      }
    })();

    // ✅ RESPONSE ALWAYS SENT
    return NextResponse.json({
      reply: assistantReply,
    });

  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
