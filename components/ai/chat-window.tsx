import { useQuery } from "@tanstack/react-query";
import { getConversation } from "@/services/ai";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { Menu, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  activeId: number | null;
  messages: any[];
  isLoading: boolean;
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
  onOpenSidebar: () => void;
  onStopStreaming: () => void;
}

export function ChatWindow({
  activeId,
  messages,
  isLoading,
  isStreaming,
  onSendMessage,
  onOpenSidebar,
  onStopStreaming,
}: ChatWindowProps) {
  const { data } = useQuery({
    queryKey: ["conversation", activeId],
    queryFn: () => getConversation(activeId!),
    enabled: activeId !== null,
  });

  const chatTitle = data?.conversation?.title || "New Chat";
  if (!activeId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-background/50">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-6 border border-border">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Start a new conversation
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
          Ask questions, get help with your courses, plan your study schedules,
          or simulate grades with Semester Sync AI.
        </p>
        <div className="md:hidden">
          <Button
            onClick={onOpenSidebar}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Menu className="w-4 h-4" />
            View Chats
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      <header className="h-16 border-b border-border px-6 flex items-center justify-between shrink-0 glass-nav">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenSidebar}
            className="md:hidden text-muted-foreground hover:text-foreground shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare className="w-4 h-4 text-primary shrink-0" />
            <h1 className="font-semibold text-sm text-foreground truncate">
              {chatTitle}
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative">
        <MessageList messages={messages} isLoading={isLoading} isStreaming={isStreaming} />
      </div>

      <div className="p-4 border-t border-border shrink-0 bg-background/55 backdrop-blur-sm">
        <ChatInput
          onSendMessage={onSendMessage}
          onStopStreaming={onStopStreaming}
          isLoading={isLoading}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
