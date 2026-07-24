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
  const conversationIdRef = useRef(conversationId);
  const abortControllerRef = useRef<AbortController | null>(null);
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

  const stopStreaming = () => {
    abortControllerRef.current?.abort();
  };

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    const startedConversationId = conversationId;

    if (!trimmed || isStreaming) return;

    const userMessage: Message = { role: "user", content: trimmed };

    setMessages((previous) => [
      ...previous,
      userMessage,
      {
        role: "assistant",
        content: "",
      },
    ]);

    try {
      setIsStreaming(true);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await apiSendMessage(
        trimmed,
        conversationId!,
        interactionId,
        abortController.signal,
      );

      if (!response.body) {
        throw new Error("Response body is missing");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

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
          setMessages((previous) => {
            if (previous.length === 0) return previous;

            const next = [...previous];

            const last = next[next.length - 1];

            if (last.role !== "assistant") {
              return previous;
            }

            next[next.length - 1] = {
              role: "assistant",
              content: visibleText,
            };

            return next;
          });
        }

        if (markerIndex !== -1) {
          const newInteractionId = fullResponse
            .slice(markerIndex + marker.length)
            .trim();
          setInteractionId(newInteractionId);
        }
      }

      setIsStreaming(false);

      if (startedConversationId !== null) {
        queryClient.invalidateQueries({
          queryKey: ["conversation", startedConversationId],
        });

        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setMessages((previous) => {
          const last = previous[previous.length - 1];

          if (last?.role === "assistant" && last.content === "") {
            return previous.slice(0, -1);
          }

          return previous;
        });
        return;
      }

      console.error("Streaming error:", err);
    } finally {
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  return {
    messages,
    isLoading: isLoadingHistory,
    isStreaming,
    interactionId,
    sendMessage,
    stopStreaming,
    error,
  };
}
