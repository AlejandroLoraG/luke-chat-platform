/**
 * Application-wide constants
 */

// ID prefixes
export const ID_PREFIX = {
  CONVERSATION: 'conv-',
  MESSAGE: 'msg-',
  SAMPLE: 'sample-',
} as const;

// Storage keys
export const STORAGE_KEY = {
  LANGUAGE: 'chat-language',
} as const;

// User information (should be replaced with actual user data)
export const DEFAULT_USER = {
  NAME: 'Cotalker',
  DISPLAY_NAME: 'John Doe',
  INITIAL: 'C',
  ASSISTANT_INITIAL: 'C',
} as const;

// API Configuration
export const API_CONFIG = {
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Message Limits
export const MESSAGE_LIMITS = {
  TITLE_MAX_LENGTH: 50,
  CONTENT_MAX_LENGTH: 10000,
} as const;

// Animation Delays
export const ANIMATION = {
  SCROLL_DURATION: 300,
  DEBOUNCE_INPUT: 300,
} as const;
