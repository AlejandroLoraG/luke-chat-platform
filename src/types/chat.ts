// Chat message types
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

// Conversation types
export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Backend API types based on backend documentation
export interface ChatRequest {
  message: string;
  workflow_spec?: WorkflowSpec;
  workflow_id?: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  prompt_count: number;
  mcp_tools_used: string[];
  workflow_source?: string;
}

export interface StreamingChatChunk {
  type: 'start' | 'chunk' | 'complete' | 'error';
  content?: string;
  conversation_id?: string;
  prompt_count?: number;
  mcp_tools_used?: string[];
  workflow_source?: string;
  error?: string;
  sequence_id?: string;
  chunk_count?: number;
  timestamp?: number;
  streaming_metrics?: {
    total_chunks: number;
    unique_sequences: number;
    response_length: number;
    duration_ms: number;
  };
}

// Workflow types (based on backend documentation)
export interface WorkflowState {
  slug: string;
  name: string;
  type: 'initial' | 'intermediate' | 'final';
}

export interface WorkflowAction {
  slug: string;
  from: string;
  to: string;
  requiresForm: boolean;
  permission: string;
  form?: WorkflowForm;
}

export interface WorkflowPermission {
  slug: string;
  description?: string;
}

export interface WorkflowAutomation {
  // Define based on your needs
  id: string;
  trigger: string;
  action: string;
}

export interface WorkflowForm {
  // Define based on your form requirements
  fields: FormField[];
}

export interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
}

export interface WorkflowSpec {
  specId: string;
  specVersion: number;
  tenantId: string;
  name: string;
  slug: string;
  states: WorkflowState[];
  actions: WorkflowAction[];
  permissions: WorkflowPermission[];
  automations: WorkflowAutomation[];
}

// UI state types
export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
}