// Application configuration
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
  timeout: 30000, // 30 seconds
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
    timeout: 30000, // 30 seconds
  },
  app: {
    env: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    name: 'AI Workflow Assistant',
  },
} as const;

// API endpoints
export const endpoints = {
  chat: '/api/v1/chat',
  chatStream: '/api/v1/chat/stream',
  health: '/api/v1/health',
  getWorkflow: (specId: string) => `/api/v1/workflows/${specId}`,
  createSession: '/api/v1/sessions',
  getSession: (sessionId: string) => `/api/v1/sessions/${sessionId}`,
  deleteSession: (sessionId: string) => `/api/v1/sessions/${sessionId}`,
  getChatBinding: (conversationId: string) => `/api/v1/chats/${conversationId}/binding`,
} as const;