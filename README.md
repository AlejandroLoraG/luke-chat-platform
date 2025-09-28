# 🚀 Luke Chat Platform

A modern, real-time AI chat application built with Next.js 15, featuring both standard and streaming communication modes with an AI Agent backend.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-black?style=flat-square)

## ✨ Features

### 🌊 **Dual-Mode Chat Experience**
- **Streaming Mode** ⚡ - Real-time AI responses with live typing effect
- **Standard Mode** 💬 - Traditional request-response communication
- **Stream Interruption** - Stop streaming responses anytime with instant feedback

### 🎨 **Modern UI/UX**
- **Fixed Sidebar Layout** - Persistent navigation with independent scrolling
- **Responsive Design** - Optimized for all screen sizes
- **Loading States** - Professional feedback during operations
- **Error Handling** - Comprehensive error display and recovery

### 🛠️ **Technical Highlights**
- **Server-Sent Events (SSE)** for real-time streaming
- **Custom React Hooks** for clean state management
- **TypeScript** throughout for type safety
- **Optimistic UI Updates** for immediate user feedback
- **AbortController** for clean stream cancellation

## 🚦 Quick Start

### Prerequisites
- **Node.js** 18.20.2 or higher
- **npm** or **yarn** package manager
- **AI Agent Backend** running on `localhost:8001`

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:AlejandroLoraG/luke-chat-platform.git
   cd luke-chat-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000/chat
   ```

## 🏗️ Project Structure

```
src/
├── app/
│   └── chat/
│       └── page.tsx          # Main chat page
├── components/
│   ├── chat/                 # Chat-specific components
│   │   ├── chat-layout.tsx   # Fixed sidebar layout
│   │   ├── chat-sidebar.tsx  # Conversation sidebar
│   │   ├── chat-messages.tsx # Message display area
│   │   ├── chat-message.tsx  # Individual message component
│   │   └── chat-input.tsx    # Dual-mode input with controls
│   └── ui/                   # Reusable UI components (shadcn/ui)
├── hooks/
│   ├── use-chat.ts           # Standard chat functionality
│   └── use-chat-stream.ts    # Streaming chat functionality
├── lib/
│   ├── api-client.ts         # API service with streaming support
│   ├── config.ts             # Application configuration
│   ├── mock-data.ts          # Development mock data
│   └── utils.ts              # Utility functions
└── types/
    └── chat.ts               # TypeScript type definitions
```

## 🔌 API Integration

### Backend Requirements
The application expects an AI Agent backend with these endpoints:

- **Standard Chat**: `POST /api/v1/chat`
- **Streaming Chat**: `POST /api/v1/chat/stream` (SSE)
- **Health Check**: `GET /api/v1/health`

### Request Format
```typescript
{
  message: string;
  conversation_id?: string;
  workflow_spec?: WorkflowSpec;
  workflow_id?: string;
}
```

### Streaming Events
```typescript
data: {"type": "start", "conversation_id": "uuid"}
data: {"type": "chunk", "content": "partial text"}
data: {"type": "complete", "conversation_id": "uuid"}
data: {"type": "error", "error": "error message"}
```

## 🎯 Development

### Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### Key Development Features

- **Hot Reload** - Instant updates during development
- **TypeScript** - Full type safety and IntelliSense
- **Turbopack** - Lightning-fast bundling
- **shadcn/ui** - High-quality, accessible components

## 🧩 Component Architecture

### Chat Hooks
- **`useChat`** - Manages standard chat operations
- **`useChatStream`** - Handles real-time streaming with abort control

### State Management
```typescript
// Standard chat state
{
  isLoading: boolean;
  error: string | null;
  sendMessage: Function;
  clearError: Function;
}

// Streaming chat state
{
  isStreaming: boolean;
  streamingError: string | null;
  sendStreamingMessage: Function;
  stopStreaming: Function;
  clearStreamingError: Function;
}
```

## 🎨 Styling

### Tailwind CSS v4
- **@theme** inline syntax for custom theming
- **Responsive design** with mobile-first approach
- **Dark mode ready** (shadcn/ui neutral theme)

### Component Library
- **shadcn/ui** components for consistent design
- **Lucide React** icons for modern iconography
- **Custom styling** with Tailwind utilities

## 🔧 Configuration

### Environment Variables
```env
# Required
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001

# Optional
NODE_ENV=development
```

### shadcn/ui Configuration
```json
// components.json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css"
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**Backend Connection Errors**
- Ensure AI Agent backend is running on `localhost:8001`
- Check CORS configuration if running on different domains
- Verify environment variables are correctly set

**Streaming Issues**
- Check browser support for Server-Sent Events
- Verify network connectivity during streaming
- Review browser console for detailed error messages

**Build Issues**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## 📚 Documentation

- **[Phase 1 Documentation](./PHASE1_DOCUMENTATION.md)** - Initial UI development
- **[Phase 2 Documentation](./PHASE2_STREAMING_DOCUMENTATION.md)** - Streaming integration
- **[Backend Documentation](./backend-documentation.md)** - API reference

## 🤝 Contributing

### Development Workflow
1. Create a feature branch from `main`
2. Make your changes following the existing code style
3. Test both standard and streaming modes
4. Submit a pull request with a clear description

### Code Style
- **TypeScript** for all new code
- **React Hooks** for state management
- **Tailwind CSS** for styling
- **shadcn/ui** components when possible

## 📄 License

This project is part of Luke's AI workflow platform.

---

## 🎉 What's Next?

### Phase 3 Potential Features
- **Workflow Visualization** - Real-time workflow creation display
- **MCP Tool Indicators** - Show which tools AI is using
- **Message Formatting** - Markdown rendering and syntax highlighting
- **Conversation Export** - Save and share conversations
- **Performance Analytics** - Streaming metrics and optimization

---

**Ready to build amazing AI experiences!** 🚀

For questions or support, reach out to the development team.
