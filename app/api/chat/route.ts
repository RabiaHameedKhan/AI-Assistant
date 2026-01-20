import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Chat, ChatMessage } from "@/types/chat";

export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
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

    const assistantReply = completion.choices[0].message.content || "No response"; // ✅ fix null

    (async () => {
      try {
        const client = await clientPromise;
        const db = client.db("chatDB");
        const chatCollection = db.collection<Chat>("chats");

        const userMessage: ChatMessage = {
          role: "user",
          content: messages[messages.length - 1].content,
          timestamp: new Date().toISOString(),
        };

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: assistantReply,
          timestamp: new Date().toISOString(),
        };

        const newMessages: ChatMessage[] = [userMessage, assistantMessage];

        const chatDoc = await chatCollection.findOne({ userId });

        if (chatDoc) {
          await chatCollection.updateOne(
            { userId },
            { $push: { messages: { $each: newMessages } } }
          );
        } else {
          await chatCollection.insertOne({
            userId,
            messages: newMessages,
          });
        }
      } catch (err) {
        console.error("MongoDB save error:", err);
      }
    })();

    return NextResponse.json({ reply: assistantReply });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
