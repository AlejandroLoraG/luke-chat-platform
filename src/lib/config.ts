// Application configuration
export const config = {
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
} as const;