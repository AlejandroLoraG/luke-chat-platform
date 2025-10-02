"use client";

import { useState, useCallback } from 'react';
import { ChatLayout } from '@/components/chat/chat-layout';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
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
    >
      {/* Chat Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-background via-background to-muted/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg truncate">
              {currentConversation?.title || t.header.title}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              {t.header.subtitle}
            </p>
          </div>
          <LanguageToggle />
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
        <div className="border-t border-border bg-background p-4">
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