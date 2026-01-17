"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { AssistantMode } from "@/data/assistantModes";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  mode: AssistantMode;
};

export default function ChatWindow({ mode }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          systemPrompt: mode.systemPrompt,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask AssistAI anything..."
          className="flex-1 p-3 rounded-lg bg-gray-800 outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}
