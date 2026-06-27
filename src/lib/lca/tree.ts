import type { ValueNode, ValueRow } from '@/types/app';

export function buildTree(rows: ValueRow[]): ValueNode {
  const map = new Map<string, ValueNode>();

  for (const row of rows) {
    map.set(row.id, {
      id: row.id,
      name: row.name,
      description: row.description,
      parentId: row.parent_id,
      level: row.level as 0 | 1 | 2,
      sortOrder: row.sort_order ?? 0,
      colorHex: row.color_hex,
      children: [],
    });
  }

  let root: ValueNode | null = null;

  for (const node of map.values()) {
    if (node.parentId === null) {
      root = node;
    } else {
      const parent = map.get(node.parentId);
      if (parent) parent.children.push(node);
    }
  }

  if (!root) throw new Error('Árvore sem nó raiz (parent_id = null)');

  const sortChildren = (n: ValueNode) => {
    n.children.sort((a, b) => a.sortOrder - b.sortOrder);
    n.children.forEach(sortChildren);
  };
  sortChildren(root);

  return root;
}

export function flattenTree(root: ValueNode): Map<string, ValueNode> {
  const map = new Map<string, ValueNode>();
  const visit = (node: ValueNode) => {
    map.set(node.id, node);
    node.children.forEach(visit);
  };
  visit(root);
  return map;
}

export function getAncestorPath(
  nodeId: string,
  nodeMap: Map<string, ValueNode>
): string[] {
  const path: string[] = [];
  let current = nodeMap.get(nodeId);
  while (current) {
    path.push(current.id);
    current = current.parentId ? nodeMap.get(current.parentId) : undefined;
  }
  return path;
}
