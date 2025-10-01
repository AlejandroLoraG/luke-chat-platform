export const en = {
  // Chat Page Header
  header: {
    title: 'AI Workflow Assistant',
    subtitle: 'Get help creating and managing your business workflows',
  },

  // Sidebar
  sidebar: {
    appTitle: 'AI Assistant',
    appSubtitle: 'Workflow Management',
    newChat: 'New Chat',
    tabs: {
      chats: 'Chats',
      workflows: 'Workflows',
    },
    emptyState: {
      title: 'No conversations yet',
      subtitle: 'Start a new chat to begin',
    },
    messageCount: {
      singular: 'message',
      plural: 'messages',
    },
    workflowsSection: {
      title: 'Available Templates',
      subtitle: 'Choose a template to get started',
      templateBadge: 'Template',
    },
    workflowTemplates: {
      documentApproval: {
        title: 'Document Approval',
        description: 'Standard document approval workflow for team collaboration',
      },
      incidentManagement: {
        title: 'Incident Management',
        description: 'IT incident tracking and resolution process',
      },
      taskManagement: {
        title: 'Task Management',
        description: 'Task assignment and tracking workflow',
      },
      requestHandling: {
        title: 'Request Handling',
        description: 'General request processing and approval',
      },
      documentReview: {
        title: 'Document Review',
        description: 'Multi-stage document review and publishing',
      },
    },
  },

  // Chat Input
  chatInput: {
    placeholder: 'Ask me about workflows, or describe a process you\'d like to create...',
    placeholderDefault: 'Type your message...',
    placeholderStreaming: 'AI is streaming...',
    placeholderLoading: 'AI is responding...',
    modes: {
      streaming: 'Streaming',
      standard: 'Standard',
      streamingDescription: 'Real-time AI responses',
      standardDescription: 'Complete responses',
    },
    status: {
      sending: 'Sending...',
      responding: 'AI is responding...',
    },
    keyboardHint: 'Press Enter to send, Shift + Enter for new line',
    stopStreaming: 'Stop streaming',
    sendMessage: 'Send message',
  },

  // Chat Messages
  chatMessages: {
    welcome: {
      title: 'Welcome! How can I help you today?',
      subtitle: 'I can help you create and manage workflows for your business. Try asking me:',
      suggestions: [
        'Create a document approval workflow',
        'How do I set up task assignments?',
        'Show me incident management templates',
        'Explain workflow automations',
      ],
    },
    assistant: 'AI Assistant',
  },

  // Error Messages
  errors: {
    networkError: 'Unable to connect to AI assistant. Please check your connection.',
    timeout: 'Request timed out. Please try again.',
    serviceUnavailable: 'AI assistant service not available.',
    serverError: 'AI assistant is temporarily unavailable.',
    genericError: 'Failed to send message. Please try again.',
    dismissError: 'Dismiss',
  },

  // Language Toggle
  language: {
    selectLanguage: 'Select language',
    english: 'EN',
    spanish: 'ES',
  },
} as const;

// Export type for TypeScript autocomplete
export type TranslationKeys = typeof en;
