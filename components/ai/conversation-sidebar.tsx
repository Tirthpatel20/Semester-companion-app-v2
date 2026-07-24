import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  createConversation,
  deleteConversation,
  renameConversation,
} from "@/services/ai";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MessageSquare,
  X,
  Loader2,
  Trash2,
  MoreVertical,
  Pencil,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationSidebarProps {
  activeId: number | null;
  onSelect: (id: number | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationSidebar({
  activeId,
  onSelect,
  isOpen,
  onClose,
}: ConversationSidebarProps) {
  const queryClient = useQueryClient();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deletingChat, setDeletingChat] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    data: conversations,
    isPending,
    isError,
  } = useQuery({
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

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      if (id === activeId) {
        onSelect(null);
      }
      setDeletingChat(null);
    },
    onError: () => {
      setDeletingChat(null);
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) =>
      renameConversation(id, title),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversation", variables.id],
      });
      setRenamingId(null);
    },
  });

  const handleSaveRename = (id: number) => {
    if (editTitle.trim()) {
      renameMutation.mutate({ id, title: editTitle.trim() });
    } else {
      setRenamingId(null);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {deletingChat && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !deleteMutation.isPending && setDeletingChat(null)}
        >
          <div
            className="bg-card border border-border rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  Delete Conversation
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                "{deletingChat.title}"
              </span>
              ?
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingChat(null)}
                disabled={deleteMutation.isPending}
                className="text-xs h-8 px-3"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(deletingChat.id)}
                disabled={deleteMutation.isPending}
                className="text-xs h-8 px-3 gap-1.5"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-72 border-r border-border bg-card/65 backdrop-blur-lg flex flex-col transition-transform duration-300 md:translate-x-0 h-full shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
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
              <div
                key={chat.id}
                className={cn(
                  "group relative flex items-center rounded-lg text-sm transition-all",
                  chat.id === activeId
                    ? "bg-secondary text-primary font-semibold border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30",
                )}
              >
                {renamingId === chat.id ? (
                  <div className="flex items-center gap-1.5 flex-1 px-2 py-1.5 min-w-0">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename(chat.id);
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      autoFocus
                      className="w-full bg-background border border-primary/50 rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={() => handleSaveRename(chat.id)}
                      disabled={renameMutation.isPending}
                      className="p-1.5 hover:bg-secondary rounded text-primary shrink-0"
                      title="Save"
                    >
                      {renameMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => setRenamingId(null)}
                      className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground shrink-0"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onSelect(chat.id);
                        onClose();
                      }}
                      className="flex-1 text-left flex items-center gap-3 px-3 py-2.5 min-w-0 focus:outline-none"
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="truncate flex-1">{chat.title}</span>
                    </button>

                    <div className="relative pr-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                        }}
                        className={cn(
                          "p-1.5 rounded-md hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-opacity",
                          openMenuId === chat.id
                            ? "opacity-100 bg-secondary"
                            : "opacity-0 group-hover:opacity-100",
                        )}
                        title="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === chat.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-full mt-1 z-50 w-36 py-1 bg-card border border-border rounded-lg shadow-lg text-xs animate-in fade-in zoom-in-95"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setRenamingId(chat.id);
                              setEditTitle(chat.title);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-foreground hover:bg-secondary/60 text-left transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Rename</span>
                          </button>

                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setDeletingChat({
                                id: chat.id,
                                title: chat.title,
                              });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 text-left transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
