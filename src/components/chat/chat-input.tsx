"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendStreamingMessage?: (message: string) => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  onStopStreaming?: () => void;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  onSendStreamingMessage,
  isLoading = false,
  isStreaming = false,
  disabled = false
}: ChatInputProps) {
  const t = useTranslation();
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !isStreaming) {
      inputRef.current?.focus();
    }
  }, [isLoading, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading || disabled || isStreaming) {
      return;
    }

    // Default to streaming
    if (onSendStreamingMessage) {
      onSendStreamingMessage(message.trim());
    } else {
      onSendMessage(message.trim());
    }

    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-border/50 bg-background">
      <div className="px-6 py-4">
        {/* User Profile + Input Form */}
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-semibold">
              C
            </div>
          </div>

          {/* User Info + More button */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <div className="text-left">
              <div className="text-sm font-medium text-foreground">Cotalker</div>
              <div className="text-xs text-muted-foreground">John Doe</div>
            </div>
            <button className="p-1 hover:bg-muted rounded">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-3">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chatInput.placeholder}
              disabled={isLoading || disabled || isStreaming}
              className="flex-1 h-11 bg-background border-border"
            />

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              size="default"
              className="h-11 px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">{t.chatInput.sendMessage}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}