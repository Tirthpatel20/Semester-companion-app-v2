import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Square } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onStopStreaming: () => void;
  isLoading: boolean;
  isStreaming: boolean;
}

export function ChatInput({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  isLoading,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || isLoading || isStreaming) return;

    onSendMessage(message);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-end max-w-3xl mx-auto w-full"
    >
      <div className="flex-1 relative flex items-center bg-secondary/40 border border-border rounded-xl focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Semester Sync AI..."
          rows={1}
          disabled={isStreaming || isLoading}
          className="w-full bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none max-h-40 min-h-[40px] align-middle"
        />
      </div>
      <Button
        type={isStreaming ? "button" : "submit"}
        onClick={isStreaming ? onStopStreaming : undefined}
        disabled={isLoading || (!isStreaming && !input.trim())}
        size="icon"
        className="cursor-pointer h-10 w-10 rounded-xl shrink-0 transition-transform active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isStreaming ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <ArrowUp className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
}
