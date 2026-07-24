import { getSession } from "@/lib/session";
import AIChatClient from "./ai-chat-client";
import { redirect } from "next/navigation";

export default async function AIPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  return <AIChatClient />;
}
