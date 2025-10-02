"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageCircle, Workflow, Sparkles, Clock } from 'lucide-react';
import { Conversation } from '@/types/chat';
import { useTranslation } from '@/hooks/use-translation';
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
  const [activeTab, setActiveTab] = useState<'chats' | 'workflows'>('chats');

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-card via-card to-muted/20">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-6 pb-4">
        {/* App Title with logo placeholder */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{t.sidebar.appTitle}</h1>
            </div>
          </div>
          <p className="text-xs text-muted-foreground ml-12">{t.sidebar.appSubtitle}</p>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={onNewChat}
          className="w-full justify-start h-11 mb-6 shadow-sm hover:shadow-md transition-all"
          variant="default"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="font-medium">{t.sidebar.newChat}</span>
        </Button>

        {/* Tabs - Segmented Control Style */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 h-9 gap-2 transition-all",
              activeTab === 'chats' && "bg-background shadow-sm"
            )}
            onClick={() => setActiveTab('chats')}
          >
            <MessageCircle className={cn(
              "w-4 h-4 transition-colors",
              activeTab === 'chats' ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs font-medium",
              activeTab === 'chats' && "text-foreground"
            )}>
              {t.sidebar.tabs.chats}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 h-9 gap-2 transition-all",
              activeTab === 'workflows' && "bg-background shadow-sm"
            )}
            onClick={() => setActiveTab('workflows')}
          >
            <Workflow className={cn(
              "w-4 h-4 transition-colors",
              activeTab === 'workflows' ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs font-medium",
              activeTab === 'workflows' && "text-foreground"
            )}>
              {t.sidebar.tabs.workflows}
            </span>
          </Button>
        </div>
      </div>

      <Separator className="mx-6 bg-border/50" />

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-hidden px-2">
        <ScrollArea className="h-full w-full" type="always">
          <div className="px-4 py-4 pr-2">
            {activeTab === 'chats' ? (
              <div className="space-y-2">
                {conversations.length === 0 ? (
                  <div className="text-center text-muted-foreground py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-semibold mb-1">{t.sidebar.emptyState.title}</p>
                    <p className="text-xs text-muted-foreground/60">{t.sidebar.emptyState.subtitle}</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => onConversationSelect(conversation.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl transition-all group",
                        "hover:bg-accent/50 active:scale-[0.98]",
                        currentConversationId === conversation.id
                          ? 'bg-primary/10 border-l-4 border-primary shadow-sm'
                          : 'hover:border-l-4 hover:border-primary/20'
                      )}
                    >
                      <div className="space-y-2">
                        <h3 className={cn(
                          "font-semibold text-sm leading-tight truncate",
                          currentConversationId === conversation.id
                            ? "text-foreground"
                            : "text-foreground/80 group-hover:text-foreground"
                        )}>
                          {conversation.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <MessageCircle className="w-3 h-3" />
                            <span className="font-medium">
                              {conversation.messages.length} {conversation.messages.length === 1 ? t.sidebar.messageCount.singular : t.sidebar.messageCount.plural}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground/60">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">
                              {conversation.updatedAt.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-primary" />
                    {t.sidebar.workflowsSection.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.sidebar.workflowsSection.subtitle}
                  </p>
                </div>

                {/* Workflow Templates */}
                <div className="space-y-2">
                  {[
                    { key: 'documentApproval', icon: '📄' },
                    { key: 'incidentManagement', icon: '🚨' },
                    { key: 'taskManagement', icon: '✓' },
                    { key: 'requestHandling', icon: '📮' },
                    { key: 'documentReview', icon: '👁' }
                  ].map(({ key, icon }) => (
                    <button
                      key={key}
                      className="w-full text-left p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-accent/30 transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm group-hover:bg-primary group-hover:scale-110 transition-all">
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-foreground/90 group-hover:text-foreground leading-tight">
                              {t.sidebar.workflowTemplates[key as keyof typeof t.sidebar.workflowTemplates].title}
                            </h4>
                            <Badge variant="secondary" className="text-xs flex-shrink-0 px-2 py-0">
                              {t.sidebar.workflowsSection.templateBadge}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {t.sidebar.workflowTemplates[key as keyof typeof t.sidebar.workflowTemplates].description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}