"use client";

import { Workflow, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkflow } from '@/hooks/use-workflow';
import { WorkflowDiagram } from './WorkflowDiagram';
import { isValidWorkflowSpec } from '@/lib/utils/workflow-transformer';

interface WorkflowPanelProps {
  workflowId?: string | null;
}

export function WorkflowPanel({ workflowId }: WorkflowPanelProps) {
  const { workflowSpec, isLoading, error, loadWorkflow, clearError } = useWorkflow();

  const handleLoadWorkflow = () => {
    if (workflowId) {
      loadWorkflow(workflowId);
    }
  };

  const handleRetry = () => {
    clearError();
    handleLoadWorkflow();
  };

  // State 1: No workflow ID (empty state)
  if (!workflowId) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-sm">
          <div className="mx-auto w-32 h-32 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
            <Workflow className="w-12 h-12 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When we have enough information, your workflow will appear here.
          </p>
        </div>
      </div>
    );
  }

  // State 2: Has workflow ID but not loaded yet
  if (!workflowSpec && !isLoading && !error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 border-b border-border bg-background">
          <Button
            onClick={handleLoadWorkflow}
            variant="default"
            size="sm"
            className="w-full"
          >
            <Workflow className="w-4 h-4 mr-2" />
            Load Workflow
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-sm">
            <div className="mx-auto w-24 h-24 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
              <Workflow className="w-10 h-10 text-primary/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              Click the button above to visualize your workflow.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // State 3: Loading
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 border-b border-border bg-background">
          <Button
            disabled
            variant="default"
            size="sm"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading workflow...</p>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Error
  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 border-b border-border bg-background">
          <Button
            onClick={handleRetry}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-sm">
            <div className="mx-auto w-24 h-24 rounded-xl border-2 border-destructive/30 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-destructive/70" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-destructive">Failed to load workflow</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 5: Workflow loaded successfully
  if (isValidWorkflowSpec(workflowSpec)) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 border-b border-border bg-background">
          <Button
            onClick={handleLoadWorkflow}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Workflow
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <WorkflowDiagram spec={workflowSpec} />
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-sm">
        <div className="mx-auto w-32 h-32 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
          <Workflow className="w-12 h-12 text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          No workflow data available.
        </p>
      </div>
    </div>
  );
}
