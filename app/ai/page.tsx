"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [interactionId, setInteractionId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const message = input.trim();
    if (!message || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: message,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          previousInteractionId: interactionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      if (!response.body) {
        throw new Error("Response body is missing");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        fullResponse += decoder.decode(value, {
          stream: true,
        });

        const markerIndex = fullResponse.indexOf("\n__INTERACTION_ID__:");

        const visibleText =
          markerIndex === -1
            ? fullResponse
            : fullResponse.slice(0, markerIndex);

        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: visibleText,
          },
        ]);
      }

      const marker = "\n__INTERACTION_ID__:";

      const markerIndex = fullResponse.indexOf(marker);

      if (markerIndex !== -1) {
        const newInteractionId = fullResponse
          .slice(markerIndex + marker.length)
          .trim();

        setInteractionId(newInteractionId);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <p>{message.role === "user" ? "You" : "Semester Sync AI"}</p>

          <p>{message.content}</p>
        </div>
      ))}

      {isLoading && <p>Semester Sync AI is thinking...</p>}

      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Ask Semester Sync AI..."
        />

        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
