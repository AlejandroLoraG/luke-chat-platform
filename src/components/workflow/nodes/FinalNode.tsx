"use client";

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Flag } from 'lucide-react';

interface FinalNodeData {
  label: string;
  slug: string;
}

interface FinalNodeProps {
  data: FinalNodeData;
}

export const FinalNode = memo(({ data }: FinalNodeProps) => {
  return (
    <div className="relative">
      {/* Input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-red-600 border-2 border-white"
      />

      {/* Node body */}
      <div className="px-6 py-3 rounded-full bg-red-500 text-white shadow-lg border-2 border-red-600 flex items-center gap-2 min-w-[120px] justify-center">
        <Flag className="w-4 h-4" />
        <span className="font-semibold text-sm">{data.label}</span>
      </div>
    </div>
  );
});

FinalNode.displayName = 'FinalNode';
