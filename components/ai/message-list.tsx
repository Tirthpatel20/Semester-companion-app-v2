import { useEffect, useRef } from "react";
import { MessageItem } from "./message-item";
import { Sparkles } from "lucide-react";

interface MessageListProps {
  messages: { role: "user" | "assistant"; content: string }[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
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
            Ask about your subjects, attendance status, assessments or run simulations!
          </p>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}

      {isLoading && (
        <div className="flex items-start gap-4 mr-auto max-w-3xl w-full">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div className="flex-1 space-y-2 py-1 min-w-0">
            <div className="text-xs font-semibold text-primary">
              Semester Sync AI
            </div>
            <div className="flex items-center gap-1.5 py-2 px-4 bg-muted/20 border border-white/5 rounded-2xl rounded-tl-none w-fit">
              <span className="h-2 w-2 bg-primary/75 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 bg-primary/75 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 bg-primary/75 rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-2 shrink-0" />
    </div>
  );
}
