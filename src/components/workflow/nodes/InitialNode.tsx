"use client";

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Rocket } from 'lucide-react';

interface InitialNodeData {
  label: string;
  slug: string;
}

interface InitialNodeProps {
  data: InitialNodeData;
}

export const InitialNode = memo(({ data }: InitialNodeProps) => {
  return (
    <div className="relative">
      {/* Node body */}
      <div className="px-6 py-3 rounded-full bg-emerald-500 text-white shadow-lg border-2 border-emerald-600 flex items-center gap-2 min-w-[120px] justify-center">
        <Rocket className="w-4 h-4" />
        <span className="font-semibold text-sm">{data.label}</span>
      </div>

      {/* Output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-emerald-600 border-2 border-white"
      />
    </div>
  );
});

InitialNode.displayName = 'InitialNode';
