import { config, endpoints } from './config';
import type { ChatRequest, ChatResponse, StreamingChatChunk } from '@/types/chat';

// API Error class for better error handling
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Simple HTTP client with proper error handling
class HTTPClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout = 30000) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
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

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof APIError) {
        throw error;
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

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }
}

// Chat API service
export class ChatAPIService {
  private client: HTTPClient;

  constructor() {
    this.client = new HTTPClient(config.api.baseUrl, config.api.timeout);
  }

  // Send a standard chat message
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      return await this.client.post<ChatResponse>(endpoints.chat, request);
    } catch (error) {
      // Add context to the error
      if (error instanceof APIError) {
        throw new APIError(
          `Failed to send message: ${error.message}`,
          error.status,
          error.code
        );
      }
      throw error;
    }
  }

  // Create a streaming connection for real-time chat
  async *streamMessage(request: ChatRequest): AsyncGenerator<StreamingChatChunk, void, unknown> {
    const url = `${config.api.baseUrl}${endpoints.chatStream}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new APIError(
          `Streaming request failed: ${errorText}`,
          response.status,
          'STREAM_ERROR'
        );
      }

      if (!response.body) {
        throw new APIError('No response body for streaming', 0, 'NO_STREAM_BODY');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          // Keep the last incomplete line in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;

            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                yield data as StreamingChatChunk;
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new APIError(
          `Streaming error: ${error.message}`,
          0,
          'STREAM_ERROR'
        );
      }

      throw new APIError('Unknown streaming error', 0, 'UNKNOWN_STREAM_ERROR');
    }
  }

  // Check backend health
  async checkHealth(): Promise<{ status: string; mcp_server_connected?: boolean }> {
    try {
      return await this.client.get(endpoints.health);
    } catch (error) {
      if (error instanceof APIError) {
        throw new APIError(
          `Health check failed: ${error.message}`,
          error.status,
          error.code
        );
      }
      throw error;
    }
  }
}

// Export singleton instance
export const chatAPI = new ChatAPIService();