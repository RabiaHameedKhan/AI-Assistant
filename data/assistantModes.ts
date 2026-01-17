export type AssistantMode = {
  id: string;
  label: string;
  systemPrompt: string;
};

export const assistantModes: AssistantMode[] = [
  {
    id: "general",
    label: "General Assistant",
    systemPrompt: "You are a helpful AI assistant.",
  },
  {
    id: "business",
    label: "Business Support",
    systemPrompt:
      "You are a professional AI assistant helping business customers.",
  },
  {
    id: "portfolio",
    label: "Portfolio Assistant",
    systemPrompt:
      "You are an AI assistant answering questions about a developer's skills and projects.",
  },
];
