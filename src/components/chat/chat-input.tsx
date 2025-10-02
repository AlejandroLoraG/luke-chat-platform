"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Square, Zap, MessageSquare } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

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
  onStopStreaming,
  disabled = false
}: ChatInputProps) {
  const t = useTranslation();
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
    <div className="border-t border-border/50 bg-gradient-to-b from-background to-muted/5 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Streaming Mode Toggle */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex items-center rounded-lg bg-muted/50 p-1 gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUseStreaming(true)}
              disabled={isLoading || isStreaming}
              className={cn(
                "h-8 px-3 gap-1.5 transition-all",
                useStreaming && "bg-background shadow-sm"
              )}
            >
              <Zap className={cn(
                "w-3.5 h-3.5 transition-colors",
                useStreaming ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-xs font-medium">{t.chatInput.modes.streaming}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUseStreaming(false)}
              disabled={isLoading || isStreaming}
              className={cn(
                "h-8 px-3 gap-1.5 transition-all",
                !useStreaming && "bg-background shadow-sm"
              )}
            >
              <MessageSquare className={cn(
                "w-3.5 h-3.5 transition-colors",
                !useStreaming ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-xs font-medium">{t.chatInput.modes.standard}</span>
            </Button>
          </div>

          {/* Mode Description - hidden on mobile */}
          <div className="hidden sm:block text-xs text-muted-foreground font-medium">
            {useStreaming ? t.chatInput.modes.streamingDescription : t.chatInput.modes.standardDescription}
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
                isStreaming ? t.chatInput.placeholderStreaming :
                isLoading ? t.chatInput.placeholderLoading :
                t.chatInput.placeholder
              }
              disabled={isLoading || disabled || isStreaming}
              className={cn(
                "h-12 px-4 pr-16 text-base rounded-xl",
                "border-border/50 bg-background",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                "placeholder:text-muted-foreground/60",
                "transition-all duration-200",
                "shadow-sm hover:shadow-md focus:shadow-lg"
              )}
            />

            {/* Character count */}
            {message.length > 0 && (
              <div className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2",
                "text-xs font-medium tabular-nums",
                message.length > 500 ? "text-destructive" : "text-muted-foreground"
              )}>
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
              size="lg"
              className="h-12 w-12 rounded-xl shadow-md hover:shadow-lg transition-all p-0"
            >
              <Square className="w-5 h-5" fill="currentColor" />
              <span className="sr-only">{t.chatInput.stopStreaming}</span>
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              size="lg"
              className={cn(
                "h-12 w-12 rounded-xl shadow-md transition-all p-0",
                !message.trim() || isLoading || disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg hover:scale-105 active:scale-95"
              )}
            >
              {useStreaming ? (
                <Zap className="w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="sr-only">{t.chatInput.sendMessage}</span>
            </Button>
          )}
        </form>

        {/* Status indicators */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {isLoading && !isStreaming && (
              <span className="flex items-center gap-2 text-muted-foreground font-medium animate-in fade-in-50">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                </div>
                <span>{t.chatInput.status.sending}</span>
              </span>
            )}
            {isStreaming && (
              <span className="flex items-center gap-2 text-primary font-medium animate-in fade-in-50">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse [animation-delay:-0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse [animation-delay:-0.4s]"></div>
                </div>
                <span>{t.chatInput.status.responding}</span>
              </span>
            )}
          </div>

          <div className="text-muted-foreground/60 font-medium hidden sm:block">
            <kbd className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono border border-border/50">
              Enter
            </kbd>
            <span className="ml-1">{t.chatInput.keyboardHint}</span>
          </div>
        </div>
      </div>
    </div>
  );
}