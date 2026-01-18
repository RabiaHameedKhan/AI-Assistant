"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const categories = [
    { label: "Chat" },
    { label: "Code Helper" },
    { label: "Ideas" },
    { label: "Fun" },
  ];

  const clearChat = () => {
  setMessages([]);
  setIsTyping(false);
  setInput("");
};

  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  const quickRepliesMap: Record<string, string[]> = {
    Chat: ["Hello!", "How are you?", "Tell me a fact"],
    "Code Helper": ["Explain recursion", "Write a function in JS", "Debug this code"],
    Ideas: ["Startup idea", "App feature suggestion", "Creative story"],
    Fun: ["Tell a joke", "Riddle me", "Funny story"],
  };

  const quickReplies = quickRepliesMap[currentCategory.label] || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: "user", content: text };

    // Update UI immediately
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages, // ✅ Send full chat history
        }),
      });

      const data = await res.json();

      console.log("API RESPONSE:", data);

      const aiMessage: Message = {
        role: "assistant",
        content: data.reply || "No response.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        currentCategory={currentCategory.label}
        setCurrentCategory={(cat) => setCurrentCategory(cat)}
      />

      {/* Chat Area */}
      <div className="flex flex-col flex-1 p-4">
        {/* Chat Window */}

        {/* Header */}
<div className="flex justify-between items-center mb-3">
  <h1 className="text-lg font-semibold text-cyan-400">
    {currentCategory.label}
  </h1>

  <button
    onClick={clearChat}
    className="px-4 py-1 rounded-full border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition"
  >
    Clear Chat
  </button>
</div>
 
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 rounded-xl shadow-inner">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                  msg.role === "user"
                    ? "bg-violet-500 text-white shadow-[0_0_10px_#8c5eff]"
                    : "bg-cyan-500 text-black shadow-[0_0_10px_#00ffff]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black rounded-2xl shadow-[0_0_10px_#00ffff]">
                <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickReplies.map((q, i) => (
            <button
              key={i}
              className="px-4 py-2 rounded-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition shadow"
              onClick={() => sendMessage(q)}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="mt-4 flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded-2xl shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-700 text-white"
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          />

          <button
            className="bg-cyan-400 text-black px-6 py-2 rounded-2xl shadow hover:bg-cyan-500 transition"
            onClick={() => sendMessage(input)}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}