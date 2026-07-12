import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 max-w-3xl w-full",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
          isUser
            ? "bg-secondary border-border"
            : "bg-primary/10 border-primary/20 text-primary"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-foreground" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>

      {/* Bubble Container */}
      <div className="flex-1 space-y-1 min-w-0">
        <div
          className={cn(
            "text-xs font-semibold",
            isUser ? "text-right text-muted-foreground" : "text-primary"
          )}
        >
          {isUser ? "You" : "Semester Sync AI"}
        </div>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words",
            isUser
              ? "bg-primary text-primary-foreground font-medium rounded-tr-none ml-auto w-fit max-w-[85%]"
              : "glass-card border-white/5 rounded-tl-none text-foreground w-fit max-w-[85%]"
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
