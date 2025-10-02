"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageCircle, Users, ChevronDown } from 'lucide-react';
import { Conversation } from '@/types/chat';
import { useTranslation } from '@/hooks/use-translation';
import { LukeLogo } from '@/components/ui/luke-logo';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onConversationSelect,
  onNewChat
}: ChatSidebarProps) {
  const t = useTranslation();
  const [builderOpen, setBuilderOpen] = useState(true);

  return (
    <div className="flex flex-col h-full bg-muted">
      {/* Header with Logo */}
      <div className="flex-shrink-0 p-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <LukeLogo className="w-10 h-10 flex-shrink-0" />
          <div>
            <h1 className="text-base font-bold text-foreground">Luke</h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {/* Builder Section */}
          <div className="mb-4">
            <button
              onClick={() => setBuilderOpen(!builderOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-primary hover:bg-accent/50 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Builder
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  builderOpen && "rotate-180"
                )}
              />
            </button>

            {builderOpen && (
              <div className="mt-2 space-y-1">
                {/* New Workflow Button */}
                <Button
                  onClick={onNewChat}
                  variant="ghost"
                  className="w-full justify-start h-9 px-3 text-sm font-normal hover:bg-accent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t.sidebar.newChat}
                </Button>
              </div>
            )}
          </div>

          {/* Drafts Section */}
          {builderOpen && conversations.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                DRAFTS
              </div>
              <div className="space-y-0.5">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => onConversationSelect(conversation.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                      currentConversationId === conversation.id
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-foreground/80 hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <div className="truncate">{conversation.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* People Section */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start h-9 px-3 text-sm font-normal text-foreground/80 hover:bg-accent"
            >
              <Users className="w-4 h-4 mr-2" />
              People
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom User Profile */}
      <div className="flex-shrink-0 border-t border-border/50 p-3">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
            C
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-medium text-foreground truncate">Cotalker</div>
            <div className="text-xs text-muted-foreground truncate">John Doe</div>
          </div>
          <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}