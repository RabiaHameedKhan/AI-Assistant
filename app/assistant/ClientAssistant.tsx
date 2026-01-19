"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ClientAssistant() {
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = [
    { label: "Chat" },
    { label: "Code Helper" },
    { label: "Ideas" },
    { label: "Fun" },
  ];

  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  const quickRepliesMap: Record<string, string[]> = {
    Chat: ["Hello!", "How are you?", "Tell me a fact"],
    "Code Helper": ["Explain recursion", "Write a function in JS", "Debug this code"],
    Ideas: ["Startup idea", "App feature suggestion", "Creative story"],
    Fun: ["Tell a joke", "Riddle me", "Funny story"],
  };

  const quickReplies = quickRepliesMap[currentCategory.label] || [];

  const clearChat = () => {
    setMessages([]);
    setIsTyping(false);
    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "No response." },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! Something went wrong." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          categories={categories}
          currentCategory={currentCategory.label}
          setCurrentCategory={(cat) => setCurrentCategory(cat)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="flex-1 bg-black/60"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="w-64 bg-gray-900 border-l border-gray-700">
            <Sidebar
              categories={categories}
              currentCategory={currentCategory.label}
              setCurrentCategory={(cat) => {
                setCurrentCategory(cat);
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex flex-col flex-1 p-3 md:p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-cyan-400 text-2xl"
            >
              ☰
            </button>

            <h1 className="text-lg font-semibold text-cyan-400">
              {currentCategory.label}
            </h1>
          </div>

          <button
            onClick={clearChat}
            className="px-3 py-1 text-sm rounded-full border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition"
          >
            Clear
          </button>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 bg-gray-800 rounded-xl shadow-inner">
          {messages.map((msg, i) => (
  <div
    key={i}
    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`px-4 py-2 rounded-2xl max-w-[85%] md:max-w-xs break-words ${
        msg.role === "user"
          ? "bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 text-gray-900 shadow-md shadow-gray-400/40 border border-gray-300"
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
              <div className="flex gap-2 px-4 py-2 bg-cyan-500 text-black rounded-2xl">
                <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-150" />
                <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="flex flex-wrap gap-2 mt-3">
          {quickReplies.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="px-3 py-1 text-sm rounded-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded-2xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          />
          <button
            onClick={() => sendMessage(input)}
            className="bg-cyan-400 text-black px-5 py-2 rounded-2xl hover:bg-cyan-500 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
