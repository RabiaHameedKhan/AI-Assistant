// types/chat.d.ts
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Chat {
  userId: string;
  messages: ChatMessage[];
}
