"use client";

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { Sparkles, Zap, MessageSquare, Workflow } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isStreaming?: boolean;
  streamingMessageId?: string;
}

export function ChatMessages({
  messages,
  isStreaming = false,
  streamingMessageId
}: ChatMessagesProps) {
  const t = useTranslation();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="text-center space-y-6 max-w-2xl">
        {/* Icon with gradient background */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl blur-xl" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Welcome text */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t.chatMessages.welcome.title}
          </h3>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            {t.chatMessages.welcome.subtitle}
          </p>
        </div>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          {t.chatMessages.welcome.suggestions.slice(0, 4).map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto py-4 px-4 text-left justify-start hover:bg-accent hover:border-primary/20 transition-all group"
            >
              <div className="flex items-start gap-3 w-full">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0">
                  {index === 0 && <Zap className="w-4 h-4" />}
                  {index === 1 && <MessageSquare className="w-4 h-4" />}
                  {index === 2 && <Workflow className="w-4 h-4" />}
                  {index === 3 && <Sparkles className="w-4 h-4" />}
                </div>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground flex-1">
                  {suggestion}
                </span>
              </div>
            </Button>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>Real-time streaming</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Workflow className="w-3.5 h-3.5 text-primary" />
              <span>Workflow automation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollArea className="flex-1 bg-gradient-to-b from-background to-muted/10" ref={scrollAreaRef}>
      <div className="py-6 space-y-0.5">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={isStreaming && streamingMessageId === message.id}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={bottomRef} className="h-1" />
      </div>
    </ScrollArea>
  );
}