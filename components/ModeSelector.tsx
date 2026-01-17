"use client";

import { AssistantMode, assistantModes } from "@/data/assistantModes";

type Props = {
  mode: AssistantMode;
  setMode: (mode: AssistantMode) => void;
};

export default function ModeSelector({ mode, setMode }: Props) {
  return (
    <div className="flex justify-center gap-3 p-4">
      {assistantModes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m)}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            mode.id === m.id
              ? "bg-indigo-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
