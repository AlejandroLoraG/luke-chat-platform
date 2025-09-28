"use client";

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { MessageCircle, Sparkles } from 'lucide-react';

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

  const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Start a conversation</h3>
          <p className="text-muted-foreground text-sm">
            Ask me anything about workflows, business processes, or get help creating and managing your workflows.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="p-3 bg-muted rounded-lg text-left">
            <p className="font-medium">Example questions:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• "Create a document approval workflow"</li>
              <li>• "How do I set up an incident management process?"</li>
              <li>• "Show me workflow templates"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="py-4 space-y-1">
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