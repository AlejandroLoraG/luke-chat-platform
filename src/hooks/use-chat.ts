import { useState, useCallback, useRef } from 'react';
import { chatAPI } from '@/lib/api-client';
import type { ChatMessage, Conversation, ChatRequest, ChatResponse } from '@/types/chat';
import { useLanguage } from '@/contexts/language-context';
import { MessageRole, MessageStatus } from '@/lib/enums';
import { generateMessageId } from '@/lib/utils/ids';
import { mapAPIErrorToMessage } from '@/lib/utils/error-handler';

interface UseChatReturn {
  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  sendMessage: (message: string, conversationId?: string) => Promise<ChatResponse | null>;
  clearError: () => void;
}

export function useChat(
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  currentConversationId: string | null,
  sessionId: string | null
): UseChatReturn {
  const { language, t } = useLanguage();
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
  ): Promise<ChatResponse | null> => {
    if (!message.trim()) return null;

    const targetConversationId = conversationId || currentConversationId;
    if (!targetConversationId) return null;

    // Clear any previous errors
    setError(null);
    setIsLoading(true);

    // Create user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      content: message.trim(),
      role: MessageRole.USER,
      timestamp: new Date(),
      status: MessageStatus.SENT
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
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const chatRequest: ChatRequest = {
        message: message.trim(),
        session_id: sessionId,
        conversation_id: targetConversationId,
        language: language,
      };

      // Send to backend
      const response = await chatAPI.sendMessage(chatRequest);

      // Create assistant message from response
      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        content: response.response,
        role: MessageRole.ASSISTANT,
        timestamp: new Date(),
        status: MessageStatus.SENT
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

      return response;

    } catch (err) {
      console.error('Chat error:', err);

      // Check if error is session-related
      const errorText = err instanceof Error ? err.message : String(err);
      const isSessionError = errorText.includes('Session') && errorText.includes('not found');

      if (isSessionError) {
        // Session is invalid, suggest page reload
        setError('Session expired. Please refresh the page to create a new session.');
      } else {
        // Handle different error types with translations
        const errorMessage = mapAPIErrorToMessage(err, t.errors);
        setError(errorMessage);
      }

      // Mark user message as failed
      setConversations(prev => prev.map(conv =>
        conv.id === targetConversationId
          ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === userMessage.id
                  ? { ...msg, status: MessageStatus.ERROR }
                  : msg
              )
            }
          : conv
      ));

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, setConversations, language, t, sessionId]);

  return {
    isLoading,
    error,
    sendMessage,
    clearError,
  };
}