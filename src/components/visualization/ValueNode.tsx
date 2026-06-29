'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface ValueNodeData {
  label: string;
  level: number;
  color: string;
  isLCA: boolean;
  isCommon: boolean;
  isTrunk: boolean;
}

interface ValueNodeProps {
  data: ValueNodeData;
}

export const ValueNodeComponent = memo(function ValueNodeComponent({ data }: ValueNodeProps) {
  const { label, level, color, isLCA, isCommon, isTrunk } = data;

  const sizeClasses = {
    0: 'px-5 py-3 text-base font-extrabold min-w-[120px]',
    1: 'px-4 py-2.5 text-sm font-bold min-w-[100px]',
    2: 'px-3 py-2 text-xs font-medium min-w-[80px]',
  }[level] ?? 'px-3 py-2 text-xs';

  const bgColor = isTrunk
    ? color
    : isCommon
    ? `${color}33`
    : '#f8fafc';

  const textColor = isTrunk ? '#ffffff' : isCommon ? color : '#64748b';
  const borderColor = isCommon ? color : '#e2e8f0';
  const borderWidth = isTrunk ? '3px' : isCommon ? '2px' : '1px';

  return (
    <div
      className="rounded-xl text-center transition-all duration-300 shadow-sm"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: `${borderWidth} solid ${borderColor}`,
        boxShadow: isTrunk ? `0 0 20px ${color}66` : undefined,
      }}
    >
      {/* tree is inverted: leaves on top, root at bottom — source goes up, target comes from below */}
      <Handle type="source" position={Position.Top} style={{ background: borderColor }} />
      <div className={sizeClasses}>
        {isTrunk && <div className="text-[10px] text-white/80 mb-0.5">✦ TRONCO COMUM</div>}
        {level === 0 && !isTrunk && <div className="text-[10px] text-slate-400 mb-0.5">⬇ OBJETIVO COMUM</div>}
        {label}
      </div>
      <Handle type="target" position={Position.Bottom} style={{ background: borderColor }} />
    </div>
  );
});
