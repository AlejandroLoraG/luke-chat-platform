"use client";

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { User, Bot, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const getStatusIcon = () => {
    if (isStreaming) {
      return (
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
        </div>
      );
    }

    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-muted-foreground animate-spin" />;
      case 'sent':
        return <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "group flex gap-3 max-w-4xl mx-auto w-full px-4 py-3 hover:bg-accent/5 transition-colors",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <Avatar className={cn(
        "w-9 h-9 flex-shrink-0 ring-2 ring-offset-2",
        isUser && "ring-primary/20 ring-offset-background",
        isAssistant && "ring-primary/10 ring-offset-background"
      )}>
        <AvatarFallback className={cn(
          "transition-colors",
          isUser && "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
          isAssistant && "bg-gradient-to-br from-secondary via-secondary to-muted text-secondary-foreground"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex-1 space-y-2 min-w-0",
        isUser && "flex flex-col items-end"
      )}>
        {/* Message Header */}
        <div className={cn(
          "flex items-center gap-2 text-sm",
          isUser && "flex-row-reverse"
        )}>
          <span className="font-semibold text-foreground">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-muted-foreground text-xs font-medium">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {getStatusIcon()}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "relative rounded-2xl px-4 py-3 shadow-sm",
          "transition-all duration-200",
          "max-w-[85%] sm:max-w-[80%]",
          isUser && [
            "bg-gradient-to-br from-primary to-primary/90",
            "text-primary-foreground",
            "ml-auto",
            "rounded-tr-sm"
          ],
          isAssistant && [
            "bg-card border border-border",
            "text-card-foreground",
            "rounded-tl-sm",
            "hover:border-primary/20 hover:shadow-md"
          ],
          message.status === 'error' && "border-destructive/50 bg-destructive/5"
        )}>
          {/* Content */}
          <div className={cn(
            "text-sm leading-relaxed whitespace-pre-wrap break-words",
            isUser && "text-primary-foreground",
            isAssistant && "text-foreground"
          )}>
            {message.content || (
              <span className="text-muted-foreground italic">No content</span>
            )}
          </div>

          {/* Streaming cursor effect */}
          {isStreaming && isAssistant && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse" />
          )}
        </div>

        {/* Streaming indicator for assistant messages */}
        {isStreaming && isAssistant && (
          <div className={cn(
            "flex items-center gap-2 text-xs text-muted-foreground",
            "animate-in fade-in-50 duration-300"
          )}>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
            </div>
            <span className="font-medium">AI is responding...</span>
          </div>
        )}

        {/* Error message indicator */}
        {message.status === 'error' && (
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="w-3 h-3" />
            <span className="font-medium">Failed to send</span>
          </div>
        )}
      </div>
    </div>
  );
}