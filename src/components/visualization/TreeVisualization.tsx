'use client';

import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { hierarchy, tree } from 'd3-hierarchy';
import type { ValueNode, LCAResult } from '@/types/app';
import { ValueNodeComponent } from './ValueNode';

const nodeTypes = { valueNode: ValueNodeComponent };

interface TreeVisualizationProps {
  treeRoot: ValueNode;
  lcaResult: LCAResult;
}

export function TreeVisualization({ treeRoot, lcaResult }: TreeVisualizationProps) {
  const { nodes, edges } = useMemo(
    () => buildFlowGraph(treeRoot, lcaResult),
    [treeRoot, lcaResult]
  );

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1} color="#e2e8f0" />
        <Controls />
        <MiniMap
          nodeColor={(n) => (n.data as { color?: string }).color ?? '#94a3b8'}
          maskColor="rgba(241,245,249,0.7)"
        />
      </ReactFlow>
    </div>
  );
}

interface D3Node {
  id: string;
  name: string;
  level: number;
  colorHex: string | null;
  children?: D3Node[];
}

function valueNodeToD3(node: ValueNode): D3Node {
  return {
    id: node.id,
    name: node.name,
    level: node.level,
    colorHex: node.colorHex,
    children: node.children.length > 0 ? node.children.map(valueNodeToD3) : undefined,
  };
}

function buildFlowGraph(
  treeRoot: ValueNode,
  lcaResult: LCAResult
): { nodes: Node[]; edges: Edge[] } {
  const commonSet = new Set(lcaResult.commonAncestorIds);
  const d3Root = hierarchy<D3Node>(valueNodeToD3(treeRoot));

  const treeLayout = tree<D3Node>().nodeSize([160, 200]);
  treeLayout(d3Root);

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  d3Root.each((d) => {
    const isLCA = d.data.id === lcaResult.lcaNode.id;
    const isCommon = commonSet.has(d.data.id);

    nodes.push({
      id: d.data.id,
      type: 'valueNode',
      position: { x: (d as { x: number }).x, y: (d as { y: number }).y },
      data: {
        label: d.data.name,
        level: d.data.level,
        color: d.data.colorHex ?? '#6366f1',
        isLCA,
        isCommon,
      },
    });

    if (d.parent) {
      edges.push({
        id: `e-${d.parent.data.id}-${d.data.id}`,
        source: d.parent.data.id,
        target: d.data.id,
        style: {
          stroke: isCommon ? (d.data.colorHex ?? '#6366f1') : '#e2e8f0',
          strokeWidth: isCommon ? 2 : 1,
        },
        animated: isLCA,
      });
    }
  });

  return { nodes, edges };
}
