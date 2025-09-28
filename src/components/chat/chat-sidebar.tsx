"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageCircle, Workflow } from 'lucide-react';
import { Conversation } from '@/types/chat';

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
  const [activeTab, setActiveTab] = useState<'chats' | 'workflows'>('chats');

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-6 pb-4">
        {/* App Title */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">AI Assistant</h1>
          <p className="text-sm text-muted-foreground mt-1">Workflow Management</p>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={onNewChat}
          className="w-full justify-start h-11 mb-6"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-3" />
          New Chat
        </Button>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={activeTab === 'chats' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1 h-9"
            onClick={() => setActiveTab('chats')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chats
          </Button>
          <Button
            variant={activeTab === 'workflows' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1 h-9"
            onClick={() => setActiveTab('workflows')}
          >
            <Workflow className="w-4 h-4 mr-2" />
            Workflows
          </Button>
        </div>
      </div>

      <Separator className="mx-6" />

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-hidden px-2">
        <ScrollArea className="h-full w-full" type="always">
          <div className="px-4 py-4 pr-2">
            {activeTab === 'chats' ? (
              <div className="space-y-3">
                {conversations.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p className="text-sm font-medium mb-1">No conversations yet</p>
                    <p className="text-xs">Start a new chat to begin</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <Card
                      key={conversation.id}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-sm ${
                        currentConversationId === conversation.id
                          ? 'bg-accent border-primary shadow-sm'
                          : 'border-border hover:border-border/80'
                      }`}
                      onClick={() => onConversationSelect(conversation.id)}
                    >
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm leading-tight truncate">
                          {conversation.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {conversation.messages.length} messages
                          </span>
                          <span>
                            {conversation.updatedAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-1">Available Templates</h3>
                  <p className="text-xs text-muted-foreground">Choose a template to get started</p>
                </div>

                {/* Sample workflows with better spacing */}
                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm leading-tight">Document Approval</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Standard document approval workflow for team collaboration
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">Template</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm leading-tight">Incident Management</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          IT incident tracking and resolution process
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">Template</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm leading-tight">Task Management</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Task assignment and tracking workflow
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">Template</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm leading-tight">Request Handling</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          General request processing and approval
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">Template</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm leading-tight">Document Review</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Multi-stage document review and publishing
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">Template</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}