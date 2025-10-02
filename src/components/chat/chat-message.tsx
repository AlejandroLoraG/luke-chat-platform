"use client";

import { ChatMessage as ChatMessageType } from '@/types/chat';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Get user initial
  const getUserInitial = () => 'L';
  const getAssistantInitial = () => 'C';

  return (
    <div className="flex gap-3 px-6 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
          isUser && "bg-gray-600 text-white",
          isAssistant && "bg-gray-700 text-white"
        )}>
          {isUser ? getUserInitial() : getAssistantInitial()}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Message Header */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">
            {isUser ? '¿Qué flujo de trabajo quieres crear?' : "What's Preline UI?"}
          </span>
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "inline-block rounded-lg px-4 py-2.5 max-w-[85%]",
          "bg-white border border-border shadow-sm",
          "text-sm leading-relaxed text-foreground"
        )}>
          {message.content || (
            <span className="text-muted-foreground italic">No content</span>
          )}

          {/* Streaming cursor */}
          {isStreaming && isAssistant && (
            <span className="inline-block w-0.5 h-4 ml-1 bg-foreground animate-pulse" />
          )}
        </div>

        {/* Status - Sent indicator */}
        {!isStreaming && message.status === 'sent' && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Check className="w-3 h-3" />
            <span>Sent</span>
          </div>
        )}
      </div>
    </div>
  );
}