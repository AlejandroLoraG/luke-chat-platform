import { Conversation } from '@/types/chat';

// Mock conversations for testing
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Document Approval Workflow',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T14:30:00Z'),
    messages: [
      {
        id: 'msg-1',
        content: 'I need to create a document approval workflow for our team. Can you help me set this up?',
        role: 'user',
        timestamp: new Date('2024-01-15T10:00:00Z'),
        status: 'sent'
      },
      {
        id: 'msg-2',
        content: "I'd be happy to help you create a document approval workflow! Let me guide you through setting up a process that will work well for your team.\n\nA typical document approval workflow includes these stages:\n\n**Draft Stage** - Where documents are initially created\n**Review Stage** - Documents are reviewed by designated reviewers\n**Approval Stage** - Final approval by authorized personnel\n**Published Stage** - Approved documents are made available\n\nWould you like me to create this workflow for you? I can customize it based on your specific requirements. What type of documents will you be approving, and who should be involved in the process?",
        role: 'assistant',
        timestamp: new Date('2024-01-15T10:01:00Z'),
        status: 'sent'
      },
      {
        id: 'msg-3',
        content: 'Yes, please create it! We need to approve marketing materials, and the process should involve our content team and marketing manager.',
        role: 'user',
        timestamp: new Date('2024-01-15T14:25:00Z'),
        status: 'sent'
      },
      {
        id: 'msg-4',
        content: "Perfect! I've created a marketing material approval workflow for you. Here's what I've set up:\n\n**Workflow: Marketing Material Approval**\n\n**Stages:**\n1. **Draft** - Content team creates initial materials\n2. **Content Review** - Content team reviews for accuracy and brand compliance\n3. **Manager Approval** - Marketing manager provides final approval\n4. **Approved** - Materials are ready for publication\n\n**Actions Available:**\n- Submit for Review (Draft → Content Review)\n- Approve Content (Content Review → Manager Approval)\n- Request Changes (Content Review → Draft)\n- Final Approval (Manager Approval → Approved)\n- Reject (Manager Approval → Draft)\n\nThe workflow is now ready to use! Your team can start submitting marketing materials for approval through this process.",
        role: 'assistant',
        timestamp: new Date('2024-01-15T14:30:00Z'),
        status: 'sent'
      }
    ]
  },
  {
    id: 'conv-2',
    title: 'Incident Management Process',
    createdAt: new Date('2024-01-16T09:00:00Z'),
    updatedAt: new Date('2024-01-16T11:45:00Z'),
    messages: [
      {
        id: 'msg-5',
        content: 'How can I set up an incident management workflow for our IT team?',
        role: 'user',
        timestamp: new Date('2024-01-16T09:00:00Z'),
        status: 'sent'
      },
      {
        id: 'msg-6',
        content: "Great question! An effective incident management workflow helps your IT team respond quickly and systematically to issues. Let me create a comprehensive process for you.\n\n**Incident Management Workflow**\n\n**Key Stages:**\n1. **Reported** - New incidents are logged\n2. **Triaged** - Priority and assignment determined\n3. **In Progress** - Technical team working on resolution\n4. **Resolved** - Issue fixed, awaiting verification\n5. **Closed** - Incident confirmed resolved\n\n**Priority Levels:**\n- Critical (System down)\n- High (Major functionality affected)\n- Medium (Some users affected)\n- Low (Minor issues)\n\nWould you like me to customize this further? I can add specific team roles, escalation procedures, or SLA requirements.",
        role: 'assistant',
        timestamp: new Date('2024-01-16T09:02:00Z'),
        status: 'sent'
      }
    ]
  },
  {
    id: 'conv-3',
    title: 'Task Management Workflow',
    createdAt: new Date('2024-01-17T16:20:00Z'),
    updatedAt: new Date('2024-01-17T16:20:00Z'),
    messages: [
      {
        id: 'msg-7',
        content: 'Show me available workflow templates',
        role: 'user',
        timestamp: new Date('2024-01-17T16:20:00Z'),
        status: 'sent'
      }
    ]
  },
  {
    id: 'conv-4',
    title: 'Employee Onboarding Process',
    createdAt: new Date('2024-01-18T10:00:00Z'),
    updatedAt: new Date('2024-01-18T10:30:00Z'),
    messages: [
      {
        id: 'msg-8',
        content: 'I need to create an employee onboarding workflow',
        role: 'user',
        timestamp: new Date('2024-01-18T10:00:00Z'),
        status: 'sent'
      }
    ]
  },
  {
    id: 'conv-5',
    title: 'Budget Approval Workflow',
    createdAt: new Date('2024-01-19T14:00:00Z'),
    updatedAt: new Date('2024-01-19T14:15:00Z'),
    messages: [
      {
        id: 'msg-9',
        content: 'How can I set up a budget approval process?',
        role: 'user',
        timestamp: new Date('2024-01-19T14:00:00Z'),
        status: 'sent'
      }
    ]
  },
  {
    id: 'conv-6',
    title: 'Purchase Request Management',
    createdAt: new Date('2024-01-20T09:00:00Z'),
    updatedAt: new Date('2024-01-20T09:20:00Z'),
    messages: [
      {
        id: 'msg-10',
        content: 'Create a purchase request workflow for our company',
        role: 'user',
        timestamp: new Date('2024-01-20T09:00:00Z'),
        status: 'sent'
      }
    ]
  },
  {
    id: 'conv-7',
    title: 'Customer Support Ticket System',
    createdAt: new Date('2024-01-21T11:00:00Z'),
    updatedAt: new Date('2024-01-21T11:45:00Z'),
    messages: [
      {
        id: 'msg-11',
        content: 'Help me design a customer support ticket workflow',
        role: 'user',
        timestamp: new Date('2024-01-21T11:00:00Z'),
        status: 'sent'
      }
    ]
  },
  {
    id: 'conv-8',
    title: 'Project Approval Process',
    createdAt: new Date('2024-01-22T13:00:00Z'),
    updatedAt: new Date('2024-01-22T13:30:00Z'),
    messages: [
      {
        id: 'msg-12',
        content: 'I want to streamline our project approval process',
        role: 'user',
        timestamp: new Date('2024-01-22T13:00:00Z'),
        status: 'sent'
      }
    ]
  }
];

// Workflow templates
export const workflowTemplates = [
  {
    id: 'approval',
    name: 'Document Approval',
    description: 'Standard approval process for documents',
    states: ['Submitted', 'Under Review', 'Approved'],
    actions: ['Submit for Review', 'Approve Request', 'Request Changes'],
    useCases: ['Document approval', 'Request approval', 'Budget approval']
  },
  {
    id: 'incident',
    name: 'Incident Management',
    description: 'IT incident tracking and resolution',
    states: ['Reported', 'Triaged', 'In Progress', 'Resolved', 'Closed'],
    actions: ['Triage', 'Assign', 'Resolve', 'Close', 'Escalate'],
    useCases: ['IT incidents', 'Bug tracking', 'Support tickets']
  },
  {
    id: 'task',
    name: 'Task Management',
    description: 'General task assignment and tracking',
    states: ['To Do', 'In Progress', 'Review', 'Done'],
    actions: ['Start Task', 'Complete', 'Submit for Review', 'Approve'],
    useCases: ['Project tasks', 'Team assignments', 'Personal todos']
  },
  {
    id: 'document_review',
    name: 'Document Review',
    description: 'Multi-stage document review process',
    states: ['Draft', 'Peer Review', 'Expert Review', 'Final Review', 'Published'],
    actions: ['Submit for Peer Review', 'Submit for Expert Review', 'Approve', 'Publish'],
    useCases: ['Academic papers', 'Technical documentation', 'Policy documents']
  },
  {
    id: 'request_handling',
    name: 'Request Handling',
    description: 'General request processing workflow',
    states: ['Submitted', 'Under Review', 'Approved', 'Fulfilled', 'Closed'],
    actions: ['Review Request', 'Approve', 'Fulfill', 'Close', 'Reject'],
    useCases: ['Purchase requests', 'Access requests', 'Service requests']
  }
];