import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Chat from "@/lib/models/Chat";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    const chat = await Chat.findOne({
      userId: session.user.id,
    });

    return NextResponse.json({
      messages: chat?.messages || [],
    });
  } catch (error) {
    console.error("Fetch Chat Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
