import type { TranslationKeys } from './en';

export const es: TranslationKeys = {
  // Chat Page Header
  header: {
    title: 'Asistente de Flujos de Trabajo IA',
    subtitle: 'Obtén ayuda para crear y gestionar tus flujos de trabajo empresariales',
  },

  // Sidebar
  sidebar: {
    appTitle: 'Asistente IA',
    appSubtitle: 'Gestión de Flujos de Trabajo',
    newChat: 'Nueva Conversación',
    tabs: {
      chats: 'Conversaciones',
      workflows: 'Flujos',
    },
    emptyState: {
      title: 'Aún no hay conversaciones',
      subtitle: 'Inicia una nueva conversación para comenzar',
    },
    messageCount: {
      singular: 'mensaje',
      plural: 'mensajes',
    },
    workflowsSection: {
      title: 'Plantillas Disponibles',
      subtitle: 'Elige una plantilla para comenzar',
      templateBadge: 'Plantilla',
    },
    workflowTemplates: {
      documentApproval: {
        title: 'Aprobación de Documentos',
        description: 'Flujo estándar de aprobación de documentos para colaboración en equipo',
      },
      incidentManagement: {
        title: 'Gestión de Incidentes',
        description: 'Seguimiento y resolución de incidentes de TI',
      },
      taskManagement: {
        title: 'Gestión de Tareas',
        description: 'Asignación y seguimiento de tareas',
      },
      requestHandling: {
        title: 'Manejo de Solicitudes',
        description: 'Procesamiento y aprobación general de solicitudes',
      },
      documentReview: {
        title: 'Revisión de Documentos',
        description: 'Revisión y publicación de documentos en múltiples etapas',
      },
    },
  },

  // Chat Input
  chatInput: {
    placeholder: 'Pregúntame sobre flujos de trabajo, o describe un proceso que te gustaría crear...',
    placeholderDefault: 'Escribe tu mensaje...',
    placeholderStreaming: 'La IA está transmitiendo...',
    placeholderLoading: 'La IA está respondiendo...',
    modes: {
      streaming: 'Transmisión',
      standard: 'Estándar',
      streamingDescription: 'Respuestas en tiempo real',
      standardDescription: 'Respuestas completas',
    },
    status: {
      sending: 'Enviando...',
      responding: 'La IA está respondiendo...',
    },
    keyboardHint: 'Presiona Enter para enviar, Shift + Enter para nueva línea',
    stopStreaming: 'Detener transmisión',
    sendMessage: 'Enviar mensaje',
  },

  // Chat Messages
  chatMessages: {
    welcome: {
      title: '¡Bienvenido! ¿Cómo puedo ayudarte hoy?',
      subtitle: 'Puedo ayudarte a crear y gestionar flujos de trabajo para tu negocio. Prueba preguntarme:',
      suggestions: [
        'Crear un flujo de aprobación de documentos',
        '¿Cómo configuro asignaciones de tareas?',
        'Muéstrame plantillas de gestión de incidentes',
        'Explica las automatizaciones de flujos de trabajo',
      ],
      greeting: '¡Hola! Soy tu asistente de flujos de trabajo con IA. Puedo ayudarte a crear, modificar y gestionar flujos de trabajo empresariales. ¿En qué te gustaría trabajar hoy?',
    },
    assistant: 'Asistente IA',
  },

  // Error Messages
  errors: {
    networkError: 'No se puede conectar al asistente IA. Por favor verifica tu conexión.',
    timeout: 'Se agotó el tiempo de espera. Por favor intenta de nuevo.',
    serviceUnavailable: 'El servicio del asistente IA no está disponible.',
    serverError: 'El asistente IA no está disponible temporalmente.',
    genericError: 'Error al enviar el mensaje. Por favor intenta de nuevo.',
    dismissError: 'Descartar',
  },

  // Language Toggle
  language: {
    selectLanguage: 'Seleccionar idioma',
    english: 'EN',
    spanish: 'ES',
  },
} as const;
