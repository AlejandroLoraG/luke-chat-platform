import { config, endpoints } from './config';

// Session API response types
export interface SessionResponse {
  session_id: string;
  user_identifier: string;
  created_at: string;
}

export interface SessionData {
  session_id: string;
  user_identifier: string;
  created_at: string;
  conversations: Array<{
    conversation_id: string;
    workflow_bound_id: string | null;
    is_chat_locked: boolean;
  }>;
}

export interface BindingInfo {
  conversation_id: string;
  workflow_bound_id: string | null;
  is_chat_locked: boolean;
}

/**
 * Session API Service
 * Manages session lifecycle and chat binding status
 */
export class SessionAPIService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl?: string, timeout: number = 30000) {
    this.baseUrl = baseUrl || config.apiBaseUrl;
    this.timeout = timeout;
  }

  /**
   * Create a new session
   * @param userIdentifier - Unique identifier for the user (IP, browser fingerprint, etc.)
   */
  async createSession(userIdentifier: string): Promise<SessionResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseUrl}${endpoints.createSession}?user_identifier=${encodeURIComponent(userIdentifier)}`;

      const response = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create session: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Session creation timed out');
      }
      throw err;
    }
  }

  /**
   * Get session data including all conversations
   * @param sessionId - Session ID
   */
  async getSession(sessionId: string): Promise<SessionData> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseUrl}${endpoints.getSession(sessionId)}`;

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to get session: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Get session timed out');
      }
      throw err;
    }
  }

  /**
   * Delete a session and all its conversations
   * @param sessionId - Session ID
   */
  async deleteSession(sessionId: string): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseUrl}${endpoints.deleteSession(sessionId)}`;

      const response = await fetch(url, {
        method: 'DELETE',
        signal: controller.signal,
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to delete session: ${response.status}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Delete session timed out');
      }
      throw err;
    }
  }

  /**
   * Get chat binding status
   * @param conversationId - Conversation ID
   */
  async getChatBinding(conversationId: string): Promise<BindingInfo> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseUrl}${endpoints.getChatBinding(conversationId)}`;

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to get chat binding: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Get chat binding timed out');
      }
      throw err;
    }
  }
}

// Export singleton instance
export const sessionAPI = new SessionAPIService();
