import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import clientPromise from "../../../lib/mongodb";

export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
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
      messages: messages,
    });

    const assistantReply = completion.choices[0].message.content;

    // ---------------------------
    // 1️⃣ Save chat to MongoDB in background (non-blocking)
    // ---------------------------
    (async () => {
      try {
        const client = await clientPromise;
        const db = client.db("chatDB");

        // Use a fixed userId for now or get from your auth
        const userId = body.userId; // get userId from frontend

        const chatCollection = db.collection("chats");

        // User message
        const userMessage = {
          role: "user",
          content: messages[messages.length - 1].content,
          timestamp: new Date().toISOString(),
        };

        // Assistant message
        const assistantMessage = {
          role: "assistant",
          content: assistantReply,
          timestamp: new Date().toISOString(),
        };

        // Save user + assistant messages
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

    // ---------------------------
    // 2️⃣ Return AI response (unchanged!)
    // ---------------------------
    return NextResponse.json({
      reply: assistantReply,
    });

  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
