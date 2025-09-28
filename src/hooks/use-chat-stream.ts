import { useState, useCallback, useRef } from 'react';
import { chatAPI, APIError } from '@/lib/api-client';
import type { ChatMessage, Conversation, ChatRequest, StreamingChatChunk } from '@/types/chat';

interface UseChatStreamReturn {
  // State
  isStreaming: boolean;
  streamingError: string | null;

  // Actions
  sendStreamingMessage: (message: string, conversationId?: string) => Promise<void>;
  stopStreaming: () => void;
  clearStreamingError: () => void;
}

export function useChatStream(
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  currentConversationId: string | null
): UseChatStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingError, setStreamingError] = useState<string | null>(null);

  // Track the current streaming operation
  const streamingControllerRef = useRef<AbortController | null>(null);
  const currentStreamingMessageRef = useRef<string | null>(null);

  const clearStreamingError = useCallback(() => {
    setStreamingError(null);
  }, []);

  const stopStreaming = useCallback(() => {
    if (streamingControllerRef.current) {
      streamingControllerRef.current.abort();
      streamingControllerRef.current = null;
    }
    setIsStreaming(false);
    currentStreamingMessageRef.current = null;
  }, []);

  const sendStreamingMessage = useCallback(async (
    message: string,
    conversationId?: string
  ) => {
    if (!message.trim()) return;

    const targetConversationId = conversationId || currentConversationId;
    if (!targetConversationId) return;

    // Clear any previous errors
    setStreamingError(null);
    setIsStreaming(true);

    // Create abort controller for this streaming operation
    const controller = new AbortController();
    streamingControllerRef.current = controller;

    // Create user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: message.trim(),
      role: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    // Create initial assistant message placeholder
    const assistantMessageId = `msg-${Date.now() + 1}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      status: 'sending'
    };

    currentStreamingMessageRef.current = assistantMessageId;

    try {
      // Optimistically update UI with user message and empty assistant message
      setConversations(prev => prev.map(conv =>
        conv.id === targetConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage, assistantMessage],
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

      // Start streaming
      let accumulatedContent = '';
      let hasStarted = false;

      for await (const chunk of chatAPI.streamMessage(chatRequest)) {
        // Check if streaming was aborted
        if (controller.signal.aborted) {
          break;
        }

        // Handle different chunk types
        switch (chunk.type) {
          case 'start':
            hasStarted = true;
            break;

          case 'chunk':
            if (chunk.content) {
              accumulatedContent += chunk.content;

              // Update the assistant message with accumulated content
              setConversations(prev => prev.map(conv =>
                conv.id === targetConversationId
                  ? {
                      ...conv,
                      messages: conv.messages.map(msg =>
                        msg.id === assistantMessageId
                          ? {
                              ...msg,
                              content: accumulatedContent,
                              status: 'sending' as const
                            }
                          : msg
                      ),
                      updatedAt: new Date()
                    }
                  : conv
              ));
            }
            break;

          case 'complete':
            // Mark the message as complete
            setConversations(prev => prev.map(conv =>
              conv.id === targetConversationId
                ? {
                    ...conv,
                    messages: conv.messages.map(msg =>
                      msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: accumulatedContent,
                            status: 'sent' as const
                          }
                        : msg
                    ),
                    updatedAt: new Date()
                  }
                : conv
            ));
            break;

          case 'error':
            throw new APIError(chunk.error || 'Streaming error occurred', 0, 'STREAM_ERROR');
        }
      }

      // If we never got a start event, treat as error
      if (!hasStarted && !controller.signal.aborted) {
        throw new APIError('Stream never started', 0, 'STREAM_START_ERROR');
      }

    } catch (err) {
      console.error('Streaming error:', err);

      // Handle different error types
      let errorMessage = 'Streaming failed. Please try again.';

      if (err instanceof APIError) {
        switch (err.code) {
          case 'NETWORK_ERROR':
            errorMessage = 'Connection lost during streaming. Please try again.';
            break;
          case 'TIMEOUT':
            errorMessage = 'Streaming timed out. Please try again.';
            break;
          case 'STREAM_ERROR':
            errorMessage = 'AI response was interrupted. Please try again.';
            break;
          default:
            errorMessage = err.message;
        }
      }

      // Only set error if not aborted by user
      if (!controller.signal.aborted) {
        setStreamingError(errorMessage);

        // Mark assistant message as failed
        setConversations(prev => prev.map(conv =>
          conv.id === targetConversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, status: 'error' as const }
                    : msg
                )
              }
            : conv
        ));
      }
    } finally {
      // Clean up
      if (streamingControllerRef.current === controller) {
        streamingControllerRef.current = null;
      }
      currentStreamingMessageRef.current = null;
      setIsStreaming(false);
    }
  }, [currentConversationId, setConversations]);

  return {
    isStreaming,
    streamingError,
    sendStreamingMessage,
    stopStreaming,
    clearStreamingError,
  };
}