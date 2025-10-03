import { APIError } from './api-client';
import { config, endpoints } from './config';
import type { WorkflowSpec } from '@/types/chat';

// Workflow API response type
interface WorkflowResponse {
  success: boolean;
  operation: string;
  service: string;
  spec_id: string;
  workflow_spec: WorkflowSpec;
}

// Workflow API service
export class WorkflowAPIService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl.replace(/\/$/, '');
    this.timeout = config.api.timeout;
  }

  // Get a workflow by spec_id
  async getWorkflow(specId: string): Promise<WorkflowSpec> {
    const url = `${this.baseUrl}${endpoints.getWorkflow(specId)}`;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      // Handle non-ok responses
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new APIError(
          `API request failed: ${errorText}`,
          response.status,
          'HTTP_ERROR'
        );
      }

      const data: WorkflowResponse = await response.json();
      return data.workflow_spec;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof APIError) {
        throw new APIError(
          `Failed to get workflow: ${error.message}`,
          error.status,
          error.code
        );
      }

      // Handle network/timeout errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new APIError('Request timeout', 408, 'TIMEOUT');
        }
        throw new APIError(`Network error: ${error.message}`, 0, 'NETWORK_ERROR');
      }

      throw new APIError('Unknown error occurred', 0, 'UNKNOWN_ERROR');
    }
  }
}

// Export singleton instance
export const workflowAPI = new WorkflowAPIService();
