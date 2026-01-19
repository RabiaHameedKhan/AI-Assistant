// app/assistant/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ClientAssistant from "./ClientAssistant";

export default async function AssistantPage() {
  // Server-side session check
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin"); // redirect unauthorized users
  }

  // If session exists, render client component
  return <ClientAssistant />;
}
