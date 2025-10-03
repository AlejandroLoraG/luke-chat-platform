"use client";

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface StateNodeData {
  label: string;
  slug: string;
}

interface StateNodeProps {
  data: StateNodeData;
}

export const StateNode = memo(({ data }: StateNodeProps) => {
  return (
    <div className="relative">
      {/* Input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />

      {/* Node body */}
      <div className="px-6 py-4 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-md min-w-[140px]">
        <div className="text-center">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {data.slug}
          </div>
          <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {data.label}
          </div>
        </div>
      </div>

      {/* Output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
});

StateNode.displayName = 'StateNode';
