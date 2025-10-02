"use client";

import { Workflow } from 'lucide-react';

export function WorkflowPanel() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-sm">
        {/* Empty state icon */}
        <div className="mx-auto w-32 h-32 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
          <Workflow className="w-12 h-12 text-muted-foreground/40" />
        </div>

        {/* Empty state text */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          When we have enough information, your workflow will appear here.
        </p>
      </div>
    </div>
  );
}
