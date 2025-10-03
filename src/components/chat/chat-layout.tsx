"use client";

import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PanelGroup, Panel, PanelResizeHandle } from '@/components/ui/resizable';

interface ChatLayoutProps {
  sidebar: ReactNode;
  workflowPanel: ReactNode;
  children: ReactNode;
}

export function ChatLayout({ sidebar, workflowPanel, children }: ChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-background overflow-hidden flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Shows as overlay on small screens */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-72 z-50
          border-r border-border bg-muted
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile close button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {sidebar}
      </aside>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="h-10 w-10 p-0 bg-background shadow-md border-border"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </div>

      {/* Desktop Layout - Resizable Panels (hidden on mobile) */}
      <div className="hidden lg:flex h-full w-full">
        <PanelGroup direction="horizontal" autoSaveId="chat-layout">
          {/* Left Sidebar Panel */}
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={30}
            className="bg-muted border-r border-border"
          >
            {sidebar}
          </Panel>

          {/* Resize Handle between Sidebar and Chat */}
          <PanelResizeHandle />

          {/* Center Chat Panel */}
          <Panel
            defaultSize={55}
            minSize={40}
            className="bg-background flex flex-col min-w-0 overflow-hidden"
          >
            {children}
          </Panel>

          {/* Resize Handle between Chat and Preview (only on XL screens) */}
          <PanelResizeHandle className="hidden xl:flex" />

          {/* Right Preview Panel (only on XL screens) */}
          <Panel
            defaultSize={35}
            minSize={25}
            maxSize={50}
            className="hidden xl:block bg-background border-l border-border"
          >
            {workflowPanel}
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}