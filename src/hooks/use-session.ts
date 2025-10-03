import { useState, useEffect, useCallback } from 'react';
import { sessionAPI } from '@/lib/session-api';

interface UseSessionReturn {
  sessionId: string | null;
  isInitializing: boolean;
  error: string | null;
  createNewSession: () => Promise<void>;
  clearSession: () => void;
}

const SESSION_STORAGE_KEY = 'chat-session-id';

/**
 * Generate a browser fingerprint for user identification
 * Uses a combination of user agent, screen resolution, and timezone
 */
function generateUserIdentifier(): string {
  const ua = navigator.userAgent;
  const screen = `${window.screen.width}x${window.screen.height}`;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timestamp = Date.now();

  // Create a semi-unique identifier
  const rawId = `${ua}-${screen}-${tz}-${timestamp}`;

  // Simple hash function to create a shorter identifier
  let hash = 0;
  for (let i = 0; i < rawId.length; i++) {
    const char = rawId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `user_${Math.abs(hash)}_${timestamp}`;
}

/**
 * Session Management Hook
 * Handles session lifecycle: creation, persistence, and cleanup
 */
export function useSession(): UseSessionReturn {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new session with the backend
   */
  const createNewSession = useCallback(async () => {
    try {
      setError(null);
      const userIdentifier = generateUserIdentifier();
      const response = await sessionAPI.createSession(userIdentifier);

      setSessionId(response.session_id);
      localStorage.setItem(SESSION_STORAGE_KEY, response.session_id);
    } catch (err) {
      console.error('Failed to create session:', err);
      setError(err instanceof Error ? err.message : 'Failed to create session');
    }
  }, []);

  /**
   * Clear the current session
   */
  const clearSession = useCallback(() => {
    setSessionId(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  /**
   * Initialize session on mount
   * - Check localStorage for existing session
   * - Validate it with backend (GET /api/v1/sessions/{id})
   * - If not found or invalid, create new session
   */
  useEffect(() => {
    const initializeSession = async () => {
      setIsInitializing(true);

      try {
        // Check for stored session ID
        const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);

        if (storedSessionId) {
          // Validate session with backend
          try {
            await sessionAPI.getSession(storedSessionId);
            // Session is valid, use it
            setSessionId(storedSessionId);
            console.log('Session restored from localStorage:', storedSessionId);
          } catch (validationErr) {
            // Session is invalid (404 or other error)
            console.warn('Stored session is invalid, creating new session:', validationErr);
            localStorage.removeItem(SESSION_STORAGE_KEY);
            await createNewSession();
          }
        } else {
          // No stored session, create new one
          await createNewSession();
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        setError(err instanceof Error ? err.message : 'Session initialization failed');

        // Last resort: try to create a new session
        try {
          localStorage.removeItem(SESSION_STORAGE_KEY);
          await createNewSession();
        } catch (createErr) {
          console.error('Failed to create fallback session:', createErr);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, [createNewSession]);

  return {
    sessionId,
    isInitializing,
    error,
    createNewSession,
    clearSession,
  };
}
