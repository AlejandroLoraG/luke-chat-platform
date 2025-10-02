/**
 * ID generation utilities
 * Uses crypto.randomUUID() for better uniqueness and security
 */

import { ID_PREFIX } from '../constants';

/**
 * Generate a unique conversation ID
 */
export function generateConversationId(): string {
  return `${ID_PREFIX.CONVERSATION}${crypto.randomUUID()}`;
}

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `${ID_PREFIX.MESSAGE}${crypto.randomUUID()}`;
}

/**
 * Generate a unique sample message ID
 */
export function generateSampleId(): string {
  return `${ID_PREFIX.SAMPLE}${crypto.randomUUID()}`;
}

/**
 * Check if an ID is a conversation ID
 */
export function isConversationId(id: string): boolean {
  return id.startsWith(ID_PREFIX.CONVERSATION);
}

/**
 * Check if an ID is a message ID
 */
export function isMessageId(id: string): boolean {
  return id.startsWith(ID_PREFIX.MESSAGE);
}
