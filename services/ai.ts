export interface Conversation {
  id: number;
  userId: string;
  title: string;
  latestInteractionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch("/api/ai/conversations", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return response.json();
}

export async function getConversation(
  id: number,
): Promise<{ conversation: ConversationDetail | null }> {
  const response = await fetch(`/api/ai/conversations/${id}`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch conversation");
  }

  return result;
}

export async function createConversation(): Promise<{
  success: boolean;
  conversation: Conversation;
}> {
  const response = await fetch("/api/ai/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create conversation");
  }

  return result;
}

export async function sendMessage(
  message: string,
  conversationId: number,
  previousInteractionId: string | null,
): Promise<Response> {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      previousInteractionId,
      conversationId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to send message to AI");
  }

  return response;
}

export async function deleteConversation(conversationId: number) {
  const response = await fetch(`/api/ai/conversations/${conversationId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to delete conversation");
  }

  return result;
}
