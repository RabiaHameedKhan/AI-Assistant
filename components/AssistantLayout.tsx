"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";
import ModeSelector from "./ModeSelector";
import { assistantModes, AssistantMode } from "@/data/assistantModes";

export default function AssistantLayout() {
  const [mode, setMode] = useState<AssistantMode>(assistantModes[0]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800">

      {/* Header */}
      <header className="p-6 border-b border-gray-700 text-center">
        <h1 className="text-3xl font-bold">AssistAI</h1>
        <p className="text-gray-400 text-sm">
          Smart Multi-Purpose AI Assistant
        </p>
      </header>

      {/* Mode Selector */}
      <ModeSelector mode={mode} setMode={setMode} />

      {/* Chat */}
      <ChatWindow mode={mode} />
    </div>
  );
}
