# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern, real-time AI chat application built with Next.js 15 that features both standard request-response and real-time streaming communication modes with an AI Agent backend. The platform is designed to help users create and manage business workflows through conversational AI.

## Common Commands

### Development
```bash
npm run dev          # Start dev server with Turbopack at localhost:3000
npm run build        # Build for production with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint
```

### Prerequisites
- **Backend**: AI Agent backend must be running on `localhost:8001`
- **Node**: v18.20.2 or higher
- **Environment**: Copy `.env.example` to `.env.local` and configure `NEXT_PUBLIC_API_BASE_URL`

## Architecture

### Dual-Mode Chat System

The application implements two distinct communication patterns managed through custom React hooks:

**Standard Mode** (`useChat` hook in `src/hooks/use-chat.ts`):
- Traditional request-response pattern via `POST /api/v1/chat`
- Uses `HTTPClient` class for timeout management and error handling
- Optimistic UI updates add user message immediately, then append assistant response

**Streaming Mode** (`useChatStream` hook in `src/hooks/use-chat-stream.ts`):
- Real-time Server-Sent Events (SSE) via `POST /api/v1/chat/stream`
- Uses `AbortController` for stream interruption
- Accumulates content chunks and progressively updates assistant message
- Handles four event types: `start`, `chunk`, `complete`, `error`

Both hooks share the same conversation state (`Conversation[]`) and update it through a single `setConversations` dispatcher passed from the parent page component.

### API Client Architecture

**HTTPClient** (`src/lib/api-client.ts`):
- Singleton pattern with configurable timeout (30s default)
- Throws typed `APIError` with status codes and error categories:
  - `HTTP_ERROR`: Non-2xx responses
  - `TIMEOUT`: Request timeout via AbortController
  - `NETWORK_ERROR`: Fetch failures
  - `STREAM_ERROR`: Streaming-specific errors

**ChatAPIService**:
- `sendMessage()`: Standard POST requests
- `streamMessage()`: Async generator that yields `StreamingChatChunk` objects
- `checkHealth()`: Backend health check

### State Management Pattern

The application uses a centralized state model in `src/app/chat/page.tsx`:
- Single source of truth: `conversations` array containing all `Conversation` objects
- Each conversation contains: `id`, `title`, `messages[]`, `createdAt`, `updatedAt`
- Current conversation selected via `currentConversationId`
- Both hooks receive and mutate the same state through callbacks

### Component Hierarchy

```
ChatPage (src/app/chat/page.tsx)
├── State: conversations, currentConversationId
├── Hooks: useChat, useChatStream
└── Layout
    ├── ChatSidebar - Conversation list and selection
    ├── ChatMessages - Message display with streaming indicator
    ├── ErrorAlert - Unified error display for both modes
    └── ChatInput - Dual-mode input with mode toggle
```

### Type System

All types defined in `src/types/chat.ts`:
- **ChatMessage**: Message status (`sending`, `sent`, `error`) tracks lifecycle
- **ChatRequest/ChatResponse**: Backend API contracts
- **StreamingChatChunk**: Discriminated union based on `type` field
- **WorkflowSpec**: Complex workflow definitions (states, actions, permissions, automations)

## Backend Integration

### API Endpoints
- **Standard Chat**: `POST /api/v1/chat`
- **Streaming Chat**: `POST /api/v1/chat/stream` (SSE)
- **Health**: `GET /api/v1/health`

### Request Format
```typescript
{
  message: string;
  conversation_id?: string;
  workflow_spec?: WorkflowSpec;  // Optional workflow context
  workflow_id?: string;
}
```

### Streaming Event Protocol
Server sends SSE events prefixed with `data: `:
```typescript
data: {"type": "start", "conversation_id": "uuid"}
data: {"type": "chunk", "content": "partial text"}
data: {"type": "complete", "conversation_id": "uuid"}
data: {"type": "error", "error": "message"}
```

## Key Implementation Details

### Error Handling
- Errors are handled at multiple layers: HTTP client, API service, and hooks
- User-facing error messages are context-specific (network, timeout, server errors)
- Streaming errors differentiate between user-initiated abort and actual failures
- Message status field (`error`) provides visual feedback in UI

### Stream Interruption
- `stopStreaming()` calls `AbortController.abort()`
- Hook checks `controller.signal.aborted` in the streaming loop
- Interrupted streams do not set error state (intentional user action)
- Controller reference is cleared in `finally` block to prevent memory leaks

### Optimistic UI Updates
- User messages appear immediately before API calls
- Standard mode: User message → API call → Assistant message added
- Streaming mode: User + empty assistant message → Progressive updates → Final status
- Failed messages are marked with `status: 'error'` for retry or inspection

### Configuration
- Environment variables accessed via `process.env.NEXT_PUBLIC_*`
- Configuration centralized in `src/lib/config.ts`
- API base URL defaults to `http://localhost:8001`

## Tech Stack Specifics

### Next.js 15 with Turbopack
- Uses App Router (all pages in `src/app/`)
- Client components marked with `"use client"` directive (required for hooks)
- Turbopack enabled for both dev and build via `--turbopack` flag

### TypeScript
- Strict mode enabled
- Path alias `@/*` maps to `src/*`
- All components and utilities are fully typed

### Styling
- **Tailwind CSS v4** with `@theme` inline syntax
- **shadcn/ui** components (New York style, RSC enabled)
- Component library: Avatar, ScrollArea, Separator, Slot, Button, etc.
- Icons via Lucide React

### shadcn/ui Integration
- Configured in `components.json`
- Components in `src/components/ui/`
- Uses `class-variance-authority` for variant management
- Tailwind utilities via `tailwind-merge` and `clsx`

## Development Guidelines

### Adding New Features
- For new API endpoints: Add to `endpoints` object in `src/lib/config.ts`
- For new message types: Extend discriminated unions in `src/types/chat.ts`
- For new UI states: Follow the status field pattern (`sending`, `sent`, `error`)

### Testing Communication Modes
- Test both standard and streaming modes independently
- Verify error states: network failures, timeouts, backend errors
- Test stream interruption by clicking Stop button during streaming
- Check conversation persistence across mode switches

### Common Pitfall: Stale Closures
The hooks use `useRef` to maintain current conversation state references and avoid stale closure issues with async operations. Follow this pattern when extending hook functionality.
