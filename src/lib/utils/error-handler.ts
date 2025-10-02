/**
 * Shared error handling utilities
 */

import { APIError } from '../api-client';
import { APIErrorCode } from '../enums';

export interface ErrorMessages {
  networkError: string;
  timeout: string;
  serviceUnavailable: string;
  serverError: string;
  genericError: string;
  streamError?: string;
}

/**
 * Map API errors to user-friendly messages
 */
export function mapAPIErrorToMessage(
  error: unknown,
  messages: ErrorMessages
): string {
  if (!(error instanceof APIError)) {
    console.error('Unexpected error:', error);
    return messages.genericError;
  }

  switch (error.code) {
    case APIErrorCode.NETWORK_ERROR:
      return messages.networkError;

    case APIErrorCode.TIMEOUT:
      return messages.timeout;

    case APIErrorCode.HTTP_ERROR:
      if (error.status === 404) {
        return messages.serviceUnavailable;
      }
      if (error.status && error.status >= 500) {
        return messages.serverError;
      }
      return messages.genericError;

    case APIErrorCode.STREAM_ERROR:
    case APIErrorCode.STREAM_START_ERROR:
      return messages.streamError || messages.genericError;

    default:
      return error.message || messages.genericError;
  }
}

/**
 * Log error to console in development (should be replaced with error tracking service in production)
 */
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }

  // TODO: In production, send to error tracking service (e.g., Sentry)
  // if (process.env.NODE_ENV === 'production') {
  //   captureException(error, { context });
  // }
}
