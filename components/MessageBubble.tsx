type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`max-w-[70%] p-3 rounded-xl ${
        isUser
          ? "ml-auto bg-indigo-600"
          : "bg-gray-700"
      }`}
    >
      {message.content}
    </div>
  );
}
