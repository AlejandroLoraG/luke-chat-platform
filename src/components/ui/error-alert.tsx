"use client";

import { AlertCircle, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ErrorAlertProps {
  error: string | null;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorAlert({ error, onDismiss, className }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg",
      className
    )}>
      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-destructive leading-relaxed">
          {error}
        </p>
      </div>

      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="flex-shrink-0 h-auto p-1 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Dismiss error</span>
        </Button>
      )}
    </div>
  );
}