import type { ValueNode, ValueRow, LCAResult } from '@/types/app';
import { buildTree, flattenTree, getAncestorPath } from './tree';

export function computeLCA(
  allRows: ValueRow[],
  selections: Map<string, Set<string>>
): LCAResult {
  const root = buildTree(allRows);
  const nodeMap = flattenTree(root);

  if (selections.size === 0) {
    return {
      lcaNode: root,
      commonAncestorIds: [root.id],
      participantCount: 0,
      trunkNodes: [],
    };
  }

  const coverageSets: Set<string>[] = [];

  for (const valueIds of selections.values()) {
    const coverage = new Set<string>();
    for (const id of valueIds) {
      getAncestorPath(id, nodeMap).forEach(aid => coverage.add(aid));
    }
    coverageSets.push(coverage);
  }

  const intersection = new Set(coverageSets[0]);
  for (let i = 1; i < coverageSets.length; i++) {
    for (const id of intersection) {
      if (!coverageSets[i].has(id)) intersection.delete(id);
    }
  }

  let lca: ValueNode = root;
  for (const id of intersection) {
    const node = nodeMap.get(id);
    if (!node) continue;
    if (node.level > lca.level) lca = node;
    else if (node.level === lca.level && node.children.length >= lca.children.length && node.id !== lca.id) {
      lca = node;
    }
  }

  const trunkNodes: ValueNode[] = [];
  for (const id of intersection) {
    const node = nodeMap.get(id);
    if (node && node.level === 1) trunkNodes.push(node);
  }
  trunkNodes.sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    lcaNode: lca,
    commonAncestorIds: Array.from(intersection),
    participantCount: selections.size,
    trunkNodes,
  };
}
