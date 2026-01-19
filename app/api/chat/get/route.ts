import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId"); // get userId from query

    if (!userId) {
      return NextResponse.json(
        { error: "User ID missing" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("chatDB");
    const chatCollection = db.collection("chats");

    const chatDoc = await chatCollection.findOne({ userId });

    return NextResponse.json({
      messages: chatDoc?.messages || [],
    });
  } catch (err) {
    console.error("Fetch chats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
