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
└── LanguageProvider (wraps entire page)
    └── ChatPageContent
        ├── State: conversations, currentConversationId
        ├── Hooks: useChat, useChatStream, useTranslation
        └── ChatLayout
            ├── ChatSidebar - Conversation list and selection
            ├── Header
            │   ├── Title & Subtitle (translated)
            │   └── LanguageToggle (EN | ES)
            ├── ChatMessages - Message display with streaming indicator
            ├── ErrorAlert - Unified error display for both modes
            └── ChatInput - Dual-mode input with mode toggle
```

**Important**: The `LanguageProvider` must wrap all components that use translations. It provides the `language`, `setLanguage`, and `t` (translations) via React Context.

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
  language?: 'en' | 'es';  // Language for AI responses
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

## Multilingual Support

The application supports English and Spanish with a simple, lightweight i18n implementation.

### Architecture

**Language Context** (`src/contexts/language-context.tsx`):
- React Context providing global language state
- Persists user preference to `localStorage` with key `chat-language`
- Auto-detects browser language on first visit (fallback to English)
- Provides `language` state, `setLanguage` function, and `t` translation object

**Translation Files** (`src/locales/`):
- `en.ts`: English translations (TypeScript object)
- `es.ts`: Spanish translations (strictly typed to match English structure)
- All UI strings centralized in these files

**Translation Hook** (`src/hooks/use-translation.ts`):
- Simple wrapper that returns `t` object from context
- Provides TypeScript autocomplete for translation keys
- Usage: `const t = useTranslation(); return <h1>{t.header.title}</h1>`

### Language Toggle UI

**LanguageToggle Component** (`src/components/ui/language-toggle.tsx`):
- Uses shadcn `ToggleGroup` with `type="single"`
- Displays "EN | ES" buttons
- Located in top-right of chat header
- Instant UI language switching with no page reload

### Backend Integration

Both chat hooks (`useChat` and `useChatStream`) automatically include the current language in API requests:
- Get language from `useLanguage()` hook
- Add `language` field to `ChatRequest` payload
- Backend responds in the specified language

### User Experience Flow

1. **First Visit**: Language auto-detected from `navigator.language`
2. **Language Switch**: User clicks EN/ES toggle → UI updates instantly
3. **Persistence**: Choice saved to localStorage, survives page reloads
4. **AI Responses**: Backend receives language parameter, responds accordingly

### Adding New Languages

To add a new language (e.g., French):

1. Update language type in `src/contexts/language-context.tsx`:
   ```typescript
   export type Language = 'en' | 'es' | 'fr';
   ```

2. Create translation file `src/locales/fr.ts`:
   ```typescript
   import type { TranslationKeys } from './en';
   export const fr: TranslationKeys = { /* French translations */ };
   ```

3. Add to translations dictionary in context:
   ```typescript
   const translations = { en, es, fr };
   ```

4. Update LanguageToggle component to include FR button

5. Update backend `ChatRequest` type if needed

### Translation Keys Structure

Translations are organized by feature area:
- `header`: Page header (title, subtitle)
- `sidebar`: Sidebar UI (app title, tabs, empty states, templates)
- `chatInput`: Input component (placeholders, modes, status messages)
- `chatMessages`: Message display (welcome message, suggestions)
- `errors`: Error messages (network, timeout, service unavailable)
- `language`: Language toggle labels

### Best Practices

- All user-facing strings must be in translation files
- No hardcoded strings in components
- Use translation keys with clear hierarchy (e.g., `t.sidebar.emptyState.title`)
- Error messages are translated for better UX
- TypeScript ensures all translation keys exist in all languages

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

**Components Used**:
- `Button` - Primary UI actions
- `Input` - Text input fields
- `Card` - Container components
- `ScrollArea` - Scrollable content areas
- `Separator` - Visual dividers
- `Badge` - Status indicators
- `Avatar` - User/AI avatars
- `ToggleGroup` - Language selector (EN/ES toggle)

### Dependencies Added for Multilingual Support
```json
{
  "@radix-ui/react-toggle": "^1.1.10",
  "@radix-ui/react-toggle-group": "^1.1.11"
}
```

### localStorage Keys Used
- `chat-language`: User's selected language (`'en'` or `'es'`)
  - Set by `LanguageProvider`
  - Persists across sessions
  - Falls back to browser language detection if not set

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

Example from `use-chat.ts`:
```typescript
// Use ref to prevent stale closure issues
const conversationsRef = useRef(conversations);
conversationsRef.current = conversations;
```

This ensures async operations always access the latest state, even if the component has re-rendered.

### Pattern: Client-Side Hydration Safety
The `LanguageProvider` uses a pattern to avoid hydration mismatches:

```typescript
const [isInitialized, setIsInitialized] = useState(false);

useEffect(() => {
  const initialLanguage = loadLanguage(); // Uses localStorage/browser detection
  setLanguageState(initialLanguage);
  setIsInitialized(true);
}, []);

if (!isInitialized) {
  return null; // Don't render until client-side initialization is complete
}
```

This is **critical** because:
- Server-side rendering can't access `localStorage` or `navigator.language`
- Rendering before initialization would cause hydration mismatch errors
- The component waits for client-side data before rendering

### Pattern: Translation Type Safety
Spanish translations import the type from English to ensure structural consistency:

```typescript
// en.ts
export const en = { /* translations */ } as const;
export type TranslationKeys = typeof en;

// es.ts
import type { TranslationKeys } from './en';
export const es: TranslationKeys = { /* Spanish translations */ };
```

This ensures:
- TypeScript enforces identical structure between languages
- Autocomplete works for all translation keys
- Missing translations are caught at compile time
