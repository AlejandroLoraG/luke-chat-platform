"use client";

import { ReactNode } from 'react';

interface ChatLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function ChatLayout({ sidebar, children }: ChatLayoutProps) {
  return (
    <div className="h-screen bg-background">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 w-72 h-full border-r border-border bg-card overflow-hidden z-10">
        {sidebar}
      </div>

      {/* Main chat area with left margin for sidebar */}
      <div className="ml-72 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}