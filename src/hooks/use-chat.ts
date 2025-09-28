import { useState, useCallback, useRef } from 'react';
import { chatAPI, APIError } from '@/lib/api-client';
import type { ChatMessage, Conversation, ChatRequest } from '@/types/chat';

interface UseChatReturn {
  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  sendMessage: (message: string, conversationId?: string) => Promise<void>;
  clearError: () => void;
}

export function useChat(
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  currentConversationId: string | null
): UseChatReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use ref to prevent stale closure issues
  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(async (
    message: string,
    conversationId?: string
  ) => {
    if (!message.trim()) return;

    const targetConversationId = conversationId || currentConversationId;
    if (!targetConversationId) return;

    // Clear any previous errors
    setError(null);
    setIsLoading(true);

    // Create user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: message.trim(),
      role: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    try {
      // Optimistically update UI with user message
      setConversations(prev => prev.map(conv =>
        conv.id === targetConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              updatedAt: new Date(),
              title: conv.messages.length === 1
                ? message.slice(0, 50) + (message.length > 50 ? '...' : '')
                : conv.title
            }
          : conv
      ));

      // Prepare API request
      const chatRequest: ChatRequest = {
        message: message.trim(),
        conversation_id: targetConversationId,
      };

      // Send to backend
      const response = await chatAPI.sendMessage(chatRequest);

      // Create assistant message from response
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: response.response,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      };

      // Update conversation with assistant response
      setConversations(prev => prev.map(conv =>
        conv.id === targetConversationId
          ? {
              ...conv,
              messages: [...conv.messages, assistantMessage],
              updatedAt: new Date()
            }
          : conv
      ));

    } catch (err) {
      console.error('Chat error:', err);

      // Handle different error types
      let errorMessage = 'Failed to send message. Please try again.';

      if (err instanceof APIError) {
        switch (err.code) {
          case 'NETWORK_ERROR':
            errorMessage = 'Unable to connect to AI assistant. Please check your connection.';
            break;
          case 'TIMEOUT':
            errorMessage = 'Request timed out. Please try again.';
            break;
          case 'HTTP_ERROR':
            if (err.status === 404) {
              errorMessage = 'AI assistant service not available.';
            } else if (err.status >= 500) {
              errorMessage = 'AI assistant is temporarily unavailable.';
            }
            break;
          default:
            errorMessage = err.message;
        }
      }

      setError(errorMessage);

      // Mark user message as failed
      setConversations(prev => prev.map(conv =>
        conv.id === targetConversationId
          ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === userMessage.id
                  ? { ...msg, status: 'error' as const }
                  : msg
              )
            }
          : conv
      ));
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, setConversations]);

  return {
    isLoading,
    error,
    sendMessage,
    clearError,
  };
}