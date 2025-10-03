import type { Node, Edge } from '@xyflow/react';
import type { WorkflowSpec, WorkflowState, WorkflowAction } from '@/types/chat';

export interface TransformedWorkflow {
  nodes: Node[];
  edges: Edge[];
}

// Calculate node position for vertical layout
function calculatePosition(index: number): { x: number; y: number } {
  const spacing = 150; // Vertical spacing between nodes
  const xCenter = 250; // Center X position

  return {
    x: xCenter,
    y: index * spacing + 50,
  };
}

// Transform WorkflowSpec to React Flow nodes
function transformStates(states: WorkflowState[]): Node[] {
  // Sort states: initial first, final last, intermediate in between
  const sortedStates = [...states].sort((a, b) => {
    if (a.type === 'initial') return -1;
    if (b.type === 'initial') return 1;
    if (a.type === 'final') return 1;
    if (b.type === 'final') return -1;
    return 0;
  });

  return sortedStates.map((state, index) => ({
    id: state.slug,
    type: state.type, // 'initial' | 'intermediate' | 'final'
    data: {
      label: state.name,
      slug: state.slug,
    },
    position: calculatePosition(index),
  }));
}

// Transform WorkflowActions to React Flow edges
function transformActions(actions: WorkflowAction[]): Edge[] {
  return actions.map((action, index) => ({
    id: `e-${action.from}-${action.to}-${index}`,
    source: action.from,
    target: action.to,
    type: 'smoothstep',
    animated: true,
    label: action.slug,
    style: { stroke: '#9ca3af', strokeWidth: 2 },
    labelStyle: { fontSize: 12, fill: '#6b7280' },
  }));
}

// Main transformer function
export function transformWorkflowToFlow(spec: WorkflowSpec): TransformedWorkflow {
  const nodes = transformStates(spec.states);
  const edges = transformActions(spec.actions);

  return {
    nodes,
    edges,
  };
}

// Helper to check if a workflow spec is valid
export function isValidWorkflowSpec(spec: WorkflowSpec | null | undefined): spec is WorkflowSpec {
  return (
    spec !== null &&
    spec !== undefined &&
    Array.isArray(spec.states) &&
    spec.states.length > 0
  );
}
