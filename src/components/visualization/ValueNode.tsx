'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface ValueNodeData {
  label: string;
  level: number;
  color: string;
  isLCA: boolean;
  isCommon: boolean;
}

interface ValueNodeProps {
  data: ValueNodeData;
}

export const ValueNodeComponent = memo(function ValueNodeComponent({ data }: ValueNodeProps) {
  const { label, level, color, isLCA, isCommon } = data;

  const sizeClasses = {
    0: 'px-5 py-3 text-base font-extrabold min-w-[120px]',
    1: 'px-4 py-2.5 text-sm font-bold min-w-[100px]',
    2: 'px-3 py-2 text-xs font-medium min-w-[80px]',
  }[level] ?? 'px-3 py-2 text-xs';

  const bgColor = isLCA
    ? color
    : isCommon
    ? `${color}33`
    : '#f8fafc';

  const textColor = isLCA ? '#ffffff' : isCommon ? color : '#64748b';
  const borderColor = isCommon ? color : '#e2e8f0';
  const borderWidth = isLCA ? '3px' : isCommon ? '2px' : '1px';

  return (
    <div
      className="rounded-xl text-center transition-all duration-300 shadow-sm"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: `${borderWidth} solid ${borderColor}`,
        boxShadow: isLCA ? `0 0 20px ${color}66` : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: borderColor }} />
      <div className={sizeClasses}>
        {isLCA && <div className="text-[10px] text-white/80 mb-0.5">✦ TRONCO COMUM</div>}
        {label}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: borderColor }} />
    </div>
  );
});
