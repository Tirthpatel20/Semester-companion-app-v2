"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { ConversationSidebar } from "@/components/ai/conversation-sidebar";
import { ChatWindow } from "@/components/ai/chat-window";
import { useChat } from "@/hooks/use-chat";

export default function AIChatPage() {
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { messages, isLoading, isStreaming, sendMessage, stopStreaming } = useChat(activeConversationId);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Navigation />

      <div className="flex-1 flex overflow-hidden relative">
        <ConversationSidebar
          activeId={activeConversationId}
          onSelect={setActiveConversationId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <ChatWindow
          activeId={activeConversationId}
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          onSendMessage={sendMessage}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onStopStreaming={stopStreaming}
        />
      </div>
    </div>
  );
}
