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
import { MessageRole, MessageStatus } from '@/lib/enums';
import { generateConversationId, generateMessageId } from '@/lib/utils/ids';
import { useSession } from '@/hooks/use-session';
import { ChatBindingIndicator } from '@/components/chat/chat-binding-indicator';

function ChatPageContent() {
  const t = useTranslation();
  const { sessionId, isInitializing, error: sessionError } = useSession();

  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    mockConversations[0]?.id || null
  );
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [isChatLocked, setIsChatLocked] = useState<boolean>(false);
  const [dismissedBindingIndicators, setDismissedBindingIndicators] = useState<Set<string>>(new Set());

  // Use both chat hooks for standard and streaming
  const { isLoading, error, sendMessage, clearError } = useChat(
    conversations,
    setConversations,
    currentConversationId,
    sessionId
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
    currentConversationId,
    sessionId
  );

  // Get current conversation
  const currentConversation = conversations.find(
    conv => conv.id === currentConversationId
  );

  // Handle creating a new conversation
  const handleNewChat = useCallback(() => {
    // Create welcome message with current language
    const welcomeMessage: ChatMessage = {
      id: generateMessageId(),
      content: t.chatMessages.welcome.greeting,
      role: MessageRole.ASSISTANT,
      timestamp: new Date(),
      status: MessageStatus.SENT
    };

    const newConversation: Conversation = {
      id: generateConversationId(),
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

  // Handle dismissing the binding indicator
  const handleDismissBindingIndicator = useCallback(() => {
    if (currentConversationId) {
      setDismissedBindingIndicators(prev => new Set([...prev, currentConversationId]));
    }
  }, [currentConversationId]);

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
    const response = await sendMessage(message, currentConversationId);

    // Extract workflow_id and chat locked status from response if present
    console.log('Chat response:', response);
    if (response?.workflow_bound_id) {
      console.log('Setting workflow ID:', response.workflow_bound_id);
      setCurrentWorkflowId(response.workflow_bound_id);
    }
    if (response?.is_chat_locked !== undefined) {
      setIsChatLocked(response.is_chat_locked);
    }
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
    const finalChunk = await sendStreamingMessage(message, currentConversationId);

    // Extract workflow_id and chat locked status from final chunk if present
    console.log('Streaming final chunk:', finalChunk);

    // TEMPORARY: Check if workflow was created via MCP tools
    // Backend will eventually return workflow_bound_id directly
    const workflowCreated = finalChunk?.mcp_tools_used?.includes('create_workflow_from_description');

    if (finalChunk?.workflow_bound_id) {
      console.log('Setting workflow ID from stream:', finalChunk.workflow_bound_id);
      setCurrentWorkflowId(finalChunk.workflow_bound_id);
    } else if (workflowCreated) {
      // TEMPORARY WORKAROUND: Extract from conversation_id or use a placeholder
      console.warn('Backend did not return workflow_bound_id. Using conversation_id as fallback.');
      console.log('Available workflows in backend:', ['wf_incidentes', 'wf_approval', 'wf_tasks', 'wf_hiring_workflow']);
      // For now, you'll need to manually check which workflow was created
      // OR we can fetch the latest workflow from a list endpoint
    }

    if (finalChunk?.is_chat_locked !== undefined) {
      setIsChatLocked(finalChunk.is_chat_locked);
    }
  }, [currentConversationId, sendStreamingMessage, error, clearError, streamingError, clearStreamingError]);

  // Show loading screen while session initializes
  if (isInitializing || !sessionId) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">
            {sessionError ? 'Session error. Retrying...' : 'Initializing session...'}
          </p>
        </div>
      </div>
    );
  }

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
      workflowPanel={<WorkflowPanel workflowId={currentWorkflowId} />}
    >
      {/* Chat Binding Indicator */}
      <ChatBindingIndicator
        isLocked={isChatLocked && !dismissedBindingIndicators.has(currentConversationId || '')}
        workflowName={currentConversation?.title}
        onNewChat={handleNewChat}
        onDismiss={handleDismissBindingIndicator}
      />

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