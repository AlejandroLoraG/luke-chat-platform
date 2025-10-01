"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Square, Zap, MessageSquare } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendStreamingMessage?: (message: string) => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  onStopStreaming?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  onSendStreamingMessage,
  isLoading = false,
  isStreaming = false,
  onStopStreaming,
  placeholder = "Type your message...",
  disabled = false
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [useStreaming, setUseStreaming] = useState(true); // Default to streaming
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

    // Use streaming or standard based on toggle
    if (useStreaming && onSendStreamingMessage) {
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

  const handleStop = () => {
    if (onStopStreaming) {
      onStopStreaming();
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Streaming Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={useStreaming ? "default" : "outline"}
              size="sm"
              onClick={() => setUseStreaming(true)}
              disabled={isLoading || isStreaming}
              className="flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3" />
              <span className="text-xs">Streaming</span>
            </Button>
            <Button
              type="button"
              variant={!useStreaming ? "default" : "outline"}
              size="sm"
              onClick={() => setUseStreaming(false)}
              disabled={isLoading || isStreaming}
              className="flex items-center gap-1.5"
            >
              <MessageSquare className="w-3 h-3" />
              <span className="text-xs">Standard</span>
            </Button>
          </div>

          {/* Mode Description */}
          <div className="text-xs text-muted-foreground">
            {useStreaming ? "Real-time AI responses" : "Complete responses"}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isStreaming ? "AI is streaming..." :
                isLoading ? "AI is responding..." :
                placeholder
              }
              disabled={isLoading || disabled || isStreaming}
              className="pr-12"
            />

            {/* Character count (optional) */}
            {message.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {message.length}
              </div>
            )}
          </div>

          {/* Send/Stop Button */}
          {isStreaming ? (
            <Button
              type="button"
              onClick={handleStop}
              variant="destructive"
              size="default"
              className="px-4"
            >
              <Square className="w-4 h-4" />
              <span className="sr-only">Stop streaming</span>
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              size="default"
              className="px-4"
            >
              {useStreaming ? <Zap className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span className="sr-only">Send message</span>
            </Button>
          )}
        </form>

        {/* Status indicators */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {isLoading && !isStreaming && (
              <span className="flex items-center gap-1">
                <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                Sending...
              </span>
            )}
            {isStreaming && (
              <span className="flex items-center gap-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                AI is responding...
              </span>
            )}
          </div>

          <div className="text-right">
            <span>Press Enter to send, Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}