import { useEffect, useRef } from "react";
import { MessageItem } from "./message-item";
import { Sparkles } from "lucide-react";

interface MessageListProps {
  messages: { role: "user" | "assistant"; content: string }[];
  isLoading: boolean;
  isStreaming: boolean;
}

export function MessageList({
  messages,
  isLoading,
  isStreaming,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="h-full overflow-y-auto px-6 py-6 space-y-6 flex flex-col">
      {messages.length === 0 && !isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-primary/75" />
          </div>
          <p className="text-sm font-medium text-foreground">
            How can I help you today?
          </p>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            Ask about your subjects, attendance status, assessments or run
            simulations!
          </p>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          isStreaming={
            isStreaming &&
            index === messages.length - 1 &&
            message.role === "assistant"
          }
        />
      ))}

      <div ref={bottomRef} className="h-2 shrink-0" />
    </div>
  );
}
