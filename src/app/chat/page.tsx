"use client";

import { useState, useCallback } from 'react';
import { ChatLayout } from '@/components/chat/chat-layout';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Conversation, ChatMessage } from '@/types/chat';
import { mockConversations, sampleMessages } from '@/lib/mock-data';
import { useChat } from '@/hooks/use-chat';
import { useChatStream } from '@/hooks/use-chat-stream';

export default function ChatPage() {
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
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      messages: [...sampleMessages],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  }, []);

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
      <div className="border-b border-border bg-card p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-semibold">
            {currentConversation?.title || 'AI Workflow Assistant'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Get help creating and managing your business workflows
          </p>
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
        placeholder="Ask me about workflows, or describe a process you'd like to create..."
      />
    </ChatLayout>
  );
}