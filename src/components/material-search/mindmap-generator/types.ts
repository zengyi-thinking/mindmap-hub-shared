import { Node, Edge } from '@xyflow/react';
import { MaterialType } from '@/types/materials';

// 思维导图数据结构
export interface MindMapData {
  nodes: Node[];
  edges: Edge[];
}

// 节点类型
export type NodeType = 'central' | 'tag' | 'material';

// 节点层级
export type NodeLevel = 0 | 1 | 2 | 3;

// 标签层级结构
export interface TagsHierarchy {
  [category: string]: string[];
}

// 思维导图生成器选项
export interface MindMapGeneratorOptions {
  searchQuery?: string;
  selectedTags?: string[];
  materialsData?: MaterialType[];
  tagHierarchy?: TagsHierarchy;
} 