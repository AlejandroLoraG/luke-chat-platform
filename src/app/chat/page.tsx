"use client";

import { useState, useCallback } from 'react';
import { ChatLayout } from '@/components/chat/chat-layout';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { WorkflowPanel } from '@/components/workflow/workflow-panel';
import { ErrorAlert } from '@/components/ui/error-alert';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { Conversation, ChatMessage } from '@/types/chat';
import { mockConversations } from '@/lib/mock-data';
import { useChat } from '@/hooks/use-chat';
import { useChatStream } from '@/hooks/use-chat-stream';
import { LanguageProvider } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';

function ChatPageContent() {
  const t = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    mockConversations[0]?.id || null
  );

  // Use both chat hooks for standard and streaming
  const { isLoading, error, sendMessage, clearError } = useChat(
    conversations,
    setConversations,
    currentConversationId
  );

  const {
    isStreaming,
    streamingError,
    sendStreamingMessage,
    stopStreaming,
    clearStreamingError
  } = useChatStream(
    conversations,
    setConversations,
    currentConversationId
  );

  // Get current conversation
  const currentConversation = conversations.find(
    conv => conv.id === currentConversationId
  );

  // Handle creating a new conversation
  const handleNewChat = useCallback(() => {
    // Create welcome message with current language
    const welcomeMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: t.chatMessages.welcome.greeting,
      role: 'assistant',
      timestamp: new Date(),
      status: 'sent'
    };

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: t.header.title,
      messages: [welcomeMessage],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  }, [t]);

  // Handle selecting a conversation
  const handleConversationSelect = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
  }, []);

  // Handle sending a standard message
  const handleSendMessage = useCallback(async (message: string) => {
    if (!currentConversationId) return;

    // Clear any previous errors when sending a new message
    if (error) {
      clearError();
    }
    if (streamingError) {
      clearStreamingError();
    }

    // Use the hook's sendMessage function
    await sendMessage(message, currentConversationId);
  }, [currentConversationId, sendMessage, error, clearError, streamingError, clearStreamingError]);

  // Handle sending a streaming message
  const handleSendStreamingMessage = useCallback(async (message: string) => {
    if (!currentConversationId) return;

    // Clear any previous errors when sending a new message
    if (error) {
      clearError();
    }
    if (streamingError) {
      clearStreamingError();
    }

    // Use the streaming hook's sendStreamingMessage function
    await sendStreamingMessage(message, currentConversationId);
  }, [currentConversationId, sendStreamingMessage, error, clearError, streamingError, clearStreamingError]);

  return (
    <ChatLayout
      sidebar={
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={handleConversationSelect}
          onNewChat={handleNewChat}
        />
      }
      workflowPanel={<WorkflowPanel />}
    >
      {/* Chat Header - Breadcrumbs + Action Buttons */}
      <div className="flex-shrink-0 border-b border-border/50 bg-background">
        <div className="px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Breadcrumbs + Edit Icon */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <nav className="flex items-center gap-2 text-sm">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                {t.actions.myWorkflows}
              </button>
              <span className="text-muted-foreground">/</span>
              <button className="text-foreground font-medium hover:text-primary transition-colors truncate max-w-xs">
                {currentConversation?.title || "Nuevo workflow"}
              </button>
            </nav>
            <button className="p-1 hover:bg-muted rounded">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          {/* Right: Action Buttons + Language Toggle */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>{t.actions.share}</span>
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
              {t.actions.publish}
            </button>
            <div className="ml-2">
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ChatMessages
        messages={currentConversation?.messages || []}
        isStreaming={isStreaming}
        streamingMessageId={currentConversation?.messages[currentConversation.messages.length - 1]?.id}
      />

      {/* Error Display */}
      {(error || streamingError) && (
        <div className="flex-shrink-0 border-t border-border bg-background p-4">
          <div className="max-w-4xl mx-auto space-y-2">
            {error && (
              <ErrorAlert
                error={error}
                onDismiss={clearError}
              />
            )}
            {streamingError && (
              <ErrorAlert
                error={streamingError}
                onDismiss={clearStreamingError}
              />
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendStreamingMessage={handleSendStreamingMessage}
        isLoading={isLoading}
        isStreaming={isStreaming}
        onStopStreaming={stopStreaming}
      />
    </ChatLayout>
  );
}

export default function ChatPage() {
  return (
    <LanguageProvider>
      <ChatPageContent />
    </LanguageProvider>
  );
}