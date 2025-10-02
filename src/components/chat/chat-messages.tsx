"use client";

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { ChatMessage as ChatMessageType } from '@/types/chat';

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  return (
    <ScrollArea className="flex-1 bg-background" ref={scrollAreaRef}>
      <div className="min-h-full">
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