"use client";

import { Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

interface ChatBindingIndicatorProps {
  isLocked: boolean;
  workflowName?: string;
  onNewChat: () => void;
  onDismiss: () => void;
}

/**
 * Chat Binding Indicator
 * Displays when a chat is locked to a specific workflow
 * Suggests starting a new chat for creating different workflows
 */
export function ChatBindingIndicator({
  isLocked,
  workflowName,
  onNewChat,
  onDismiss
}: ChatBindingIndicatorProps) {
  const t = useTranslation();

  if (!isLocked) {
    return null;
  }

  const handleNewChat = () => {
    onNewChat();
    onDismiss();
  };

  return (
    <div className="flex-shrink-0 border-b border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Lock Status Message */}
        <div className="flex items-center gap-3 text-sm flex-1 min-w-0">
          <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-blue-900 dark:text-blue-100 font-medium">
              This chat is bound to a workflow
            </span>
            {workflowName && (
              <>
                <span className="hidden sm:inline text-blue-600 dark:text-blue-400">•</span>
                <span className="text-blue-700 dark:text-blue-300 font-semibold">
                  {workflowName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* New Chat Button */}
          <Button
            onClick={handleNewChat}
            variant="outline"
            size="sm"
            className="border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
          >
            {t.sidebar.newChat}
          </Button>

          {/* Close Button */}
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Helper Text */}
      <div className="px-6 pb-3 text-xs text-blue-600 dark:text-blue-400">
        To create a different workflow, please start a new chat using the button above.
      </div>
    </div>
  );
}
