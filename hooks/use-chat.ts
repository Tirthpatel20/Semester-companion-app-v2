"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConversation, sendMessage as apiSendMessage } from "@/services/ai";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export function useChat(conversationId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [interactionId, setInteractionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch conversation detail with history
  const { data: conversationData, isPending: isLoadingHistory, error } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId!),
    enabled: conversationId !== null,
    staleTime: 0,
  });

  // Sync state when loaded or when switching conversations
  useEffect(() => {
    if (conversationId === null) {
      setMessages([]);
      setInteractionId(null);
      return;
    }

    if (conversationData?.conversation) {
      const history = conversationData.conversation.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      setMessages(history);
      setInteractionId(conversationData.conversation.latestInteractionId);
    } else {
      // While it's pending loading, don't clear immediately to avoid flickers,
      // or clear if it is explicitly completed/empty.
      if (!isLoadingHistory) {
        setMessages([]);
        setInteractionId(null);
      }
    }
  }, [conversationId, conversationData, isLoadingHistory]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading || isStreaming) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];

    // Show user message and show initial loading state
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await apiSendMessage(trimmed, interactionId);

      setIsLoading(false);
      setIsStreaming(true);

      if (!response.body) {
        throw new Error("Response body is missing");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      // Add assistant placeholder
      setMessages([...updatedMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullResponse += decoder.decode(value, { stream: true });

        const marker = "\n__INTERACTION_ID__:";
        const markerIndex = fullResponse.indexOf(marker);
        const visibleText = markerIndex === -1 ? fullResponse : fullResponse.slice(0, markerIndex);

        setMessages([...updatedMessages, { role: "assistant", content: visibleText }]);

        if (markerIndex !== -1) {
          const newInteractionId = fullResponse.slice(markerIndex + marker.length).trim();
          setInteractionId(newInteractionId);
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return {
    messages,
    isLoading: isLoading || isLoadingHistory,
    isStreaming,
    interactionId,
    sendMessage,
    error,
  };
}
