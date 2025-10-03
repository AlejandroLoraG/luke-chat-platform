import { useState, useCallback } from 'react';
import { workflowAPI } from '@/lib/workflow-api';
import type { WorkflowSpec } from '@/types/chat';
import { useLanguage } from '@/contexts/language-context';
import { mapAPIErrorToMessage } from '@/lib/utils/error-handler';

interface UseWorkflowReturn {
  workflowSpec: WorkflowSpec | null;
  isLoading: boolean;
  error: string | null;
  loadWorkflow: (specId: string) => Promise<void>;
  clearError: () => void;
}

export function useWorkflow(): UseWorkflowReturn {
  const { t } = useLanguage();
  const [workflowSpec, setWorkflowSpec] = useState<WorkflowSpec | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadWorkflow = useCallback(async (specId: string) => {
    if (!specId || !specId.trim()) {
      setError('Invalid workflow ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const spec = await workflowAPI.getWorkflow(specId.trim());
      setWorkflowSpec(spec);
    } catch (err) {
      console.error('Failed to load workflow:', err);
      const errorMessage = mapAPIErrorToMessage(err, t.errors);
      setError(errorMessage);
      setWorkflowSpec(null);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  return {
    workflowSpec,
    isLoading,
    error,
    loadWorkflow,
    clearError,
  };
}
