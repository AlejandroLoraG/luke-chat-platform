/**
 * Application-wide enumerations for type safety
 */

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  ERROR = 'error',
}

export enum APIErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  HTTP_ERROR = 'HTTP_ERROR',
  STREAM_ERROR = 'STREAM_ERROR',
  STREAM_START_ERROR = 'STREAM_START_ERROR',
  NO_STREAM_BODY = 'NO_STREAM_BODY',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  UNKNOWN_STREAM_ERROR = 'UNKNOWN_STREAM_ERROR',
}

export enum StreamingEventType {
  START = 'start',
  CHUNK = 'chunk',
  COMPLETE = 'complete',
  ERROR = 'error',
}
