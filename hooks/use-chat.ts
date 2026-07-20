"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const conversationIdRef = useRef(conversationId);
  const queryClient = useQueryClient();

  const {
    data: conversationData,
    isPending: isLoadingHistory,
    error,
  } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId!),
    enabled: conversationId !== null,
    staleTime: 0,
  });

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

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
      if (!isLoadingHistory) {
        setMessages([]);
        setInteractionId(null);
      }
    }
  }, [conversationId, conversationData, isLoadingHistory]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    const startedConversationId = conversationId;

    if (!trimmed || isLoading || isStreaming) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await apiSendMessage(
        trimmed,
        conversationId!,
        interactionId,
      );

      setIsLoading(false);
      setIsStreaming(true);

      if (!response.body) {
        throw new Error("Response body is missing");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (conversationIdRef.current === startedConversationId) {
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: "",
          },
        ]);
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullResponse += decoder.decode(value, { stream: true });

        const marker = "\n__INTERACTION_ID__:";
        const markerIndex = fullResponse.indexOf(marker);
        const visibleText =
          markerIndex === -1
            ? fullResponse
            : fullResponse.slice(0, markerIndex);

        if (conversationIdRef.current === startedConversationId) {
          setMessages([
            ...updatedMessages,
            {
              role: "assistant",
              content: visibleText,
            },
          ]);
        }

        if (markerIndex !== -1) {
          const newInteractionId = fullResponse
            .slice(markerIndex + marker.length)
            .trim();
          setInteractionId(newInteractionId);
        }
      }

      if (startedConversationId !== null) {
        await queryClient.invalidateQueries({
          queryKey: ["conversation", startedConversationId],
        });

        await queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
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
 