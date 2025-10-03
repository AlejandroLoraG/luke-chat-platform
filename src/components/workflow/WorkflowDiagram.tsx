"use client";

import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import type { WorkflowSpec } from '@/types/chat';
import { transformWorkflowToFlow } from '@/lib/utils/workflow-transformer';
import { InitialNode } from './nodes/InitialNode';
import { StateNode } from './nodes/StateNode';
import { FinalNode } from './nodes/FinalNode';

// Register custom node types
const nodeTypes: NodeTypes = {
  initial: InitialNode,
  intermediate: StateNode,
  final: FinalNode,
};

interface WorkflowDiagramProps {
  spec: WorkflowSpec;
}

export function WorkflowDiagram({ spec }: WorkflowDiagramProps) {
  // Transform workflow spec to React Flow format
  const { nodes: initialNodes, edges: initialEdges } = transformWorkflowToFlow(spec);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Fit view on mount
  const onInit = useCallback(() => {
    // Auto-fit view with padding
    setTimeout(() => {
      const reactFlowWrapper = document.querySelector('.react-flow');
      if (reactFlowWrapper) {
        const { width, height } = reactFlowWrapper.getBoundingClientRect();
        if (width > 0 && height > 0) {
          // View is ready
        }
      }
    }, 100);
  }, []);

  return (
    <div className="h-full w-full bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background
          color="#9ca3af"
          gap={16}
          size={1}
          className="bg-muted/30"
        />
        <Controls
          showZoom
          showFitView
          showInteractive={false}
          className="bg-background border border-border shadow-md rounded-lg"
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'initial') return '#10b981';
            if (node.type === 'final') return '#ef4444';
            return '#e5e7eb';
          }}
          className="bg-background border border-border shadow-md rounded-lg"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
