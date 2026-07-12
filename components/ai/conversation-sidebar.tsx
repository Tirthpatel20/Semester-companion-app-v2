import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversations, createConversation } from "@/services/ai";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationSidebarProps {
  activeId: number | null;
  onSelect: (id: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationSidebar({ activeId, onSelect, isOpen, onClose }: ConversationSidebarProps) {
  const queryClient = useQueryClient();

  const { data: conversations, isPending, isError } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  const createMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      onSelect(data.conversation.id);
      onClose();
    },
  });

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-72 border-r border-border bg-card/65 backdrop-blur-lg flex flex-col transition-transform duration-300 md:translate-x-0 h-full shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Conversations
          </h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-5 text-sm font-medium transition-all"
            variant="default"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            New Chat
          </Button>
        </div>

        {/* List of Chats */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
          {isPending ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-10 w-full rounded-lg bg-muted/40 animate-pulse mb-2"
              />
            ))
          ) : isError ? (
            <p className="text-xs text-destructive text-center py-4">
              Error loading chats
            </p>
          ) : !conversations || conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              No chat history yet.
            </div>
          ) : (
            conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  onSelect(chat.id);
                  onClose();
                }}
                className={cn(
                  "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary",
                  chat.id === activeId
                    ? "bg-secondary text-primary font-semibold border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                )}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate flex-1">{chat.title}</span>
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
