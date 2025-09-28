"use client";

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { User, Bot, Clock, CheckCircle, XCircle } from 'lucide-react';
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
      return <Clock className="w-3 h-3 animate-spin" />;
    }

    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-muted-foreground" />;
      case 'sent':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'error':
        return <XCircle className="w-3 h-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex gap-3 max-w-4xl mx-auto w-full px-4 py-4",
      isUser && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={cn(
          isUser && "bg-primary text-primary-foreground",
          isAssistant && "bg-secondary text-secondary-foreground"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex-1 space-y-2",
        isUser && "text-right"
      )}>
        {/* Message Header */}
        <div className={cn(
          "flex items-center gap-2 text-sm",
          isUser && "justify-end"
        )}>
          <span className="font-medium">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-muted-foreground text-xs">
            {message.timestamp.toLocaleTimeString()}
          </span>
          {getStatusIcon()}
        </div>

        {/* Message Bubble */}
        <Card className={cn(
          "p-4 max-w-[80%]",
          isUser && "ml-auto bg-primary text-primary-foreground",
          isAssistant && "bg-card"
        )}>
          <div className="prose prose-sm max-w-none">
            {/* Simple markdown-like formatting */}
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
        </Card>

        {/* Streaming indicator for assistant messages */}
        {isStreaming && isAssistant && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            </div>
            <span>AI is thinking...</span>
          </div>
        )}

        {/* Tools used indicator */}
        {isAssistant && message.content && !isStreaming && (
          <div className="flex flex-wrap gap-1">
            {/* Sample MCP tools - in real implementation, this would come from the message data */}
            <Badge variant="outline" className="text-xs">
              <Bot className="w-3 h-3 mr-1" />
              Workflow Tools
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}