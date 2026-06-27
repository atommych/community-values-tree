export interface ValueNode {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  level: 0 | 1 | 2;
  sortOrder: number;
  colorHex: string | null;
  children: ValueNode[];
}

export interface Session {
  id: string;
  code: string;
  name: string;
  facilitatorId: string;
  createdAt: string;
  isActive: boolean;
}

export interface Participant {
  sessionId: string;
  userId: string;
  displayName: string;
  submittedAt: string | null;
}

export interface LCAResult {
  lcaNode: ValueNode;
  commonAncestorIds: string[];
  participantCount: number;
}

export interface UserValueRow {
  id: string;
  sessionId: string;
  userId: string;
  valueId: string;
}

export interface ValueRow {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  level: number;
  sort_order: number;
  color_hex: string | null;
}
