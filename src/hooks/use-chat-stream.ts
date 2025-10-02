import { useState, useCallback, useRef } from 'react';
import { chatAPI } from '@/lib/api-client';
import type { ChatMessage, Conversation, ChatRequest } from '@/types/chat';
import { useLanguage } from '@/contexts/language-context';
import { MessageRole, MessageStatus, StreamingEventType } from '@/lib/enums';
import { generateMessageId } from '@/lib/utils/ids';
import { mapAPIErrorToMessage } from '@/lib/utils/error-handler';

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
  const { language, t } = useLanguage();
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
      id: generateMessageId(),
      content: message.trim(),
      role: MessageRole.USER,
      timestamp: new Date(),
      status: MessageStatus.SENT
    };

    // Create initial assistant message placeholder
    const assistantMessageId = generateMessageId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      content: '',
      role: MessageRole.ASSISTANT,
      timestamp: new Date(),
      status: MessageStatus.SENDING
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
        language: language,
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
          case StreamingEventType.START:
            hasStarted = true;
            break;

          case StreamingEventType.CHUNK:
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
                              status: MessageStatus.SENDING
                            }
                          : msg
                      ),
                      updatedAt: new Date()
                    }
                  : conv
              ));
            }
            break;

          case StreamingEventType.COMPLETE:
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
                            status: MessageStatus.SENT
                          }
                        : msg
                    ),
                    updatedAt: new Date()
                  }
                : conv
            ));
            break;

          case StreamingEventType.ERROR:
            throw new Error(chunk.error || 'Streaming error occurred');
        }
      }

      // If we never got a start event, treat as error
      if (!hasStarted && !controller.signal.aborted) {
        throw new Error('Stream never started');
      }

    } catch (err) {
      console.error('Streaming error:', err);

      // Only set error if not aborted by user
      if (!controller.signal.aborted) {
        const errorMessage = mapAPIErrorToMessage(err, t.errors);
        setStreamingError(errorMessage);

        // Mark assistant message as failed
        setConversations(prev => prev.map(conv =>
          conv.id === targetConversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, status: MessageStatus.ERROR }
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
  }, [currentConversationId, setConversations, language, t]);

  return {
    isStreaming,
    streamingError,
    sendStreamingMessage,
    stopStreaming,
    clearStreamingError,
  };
}