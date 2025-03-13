
// 思维导图接口定义
export interface MindMap {
  id: number;
  title: string;
  updatedAt: string;
  starred: boolean;
  shared: boolean;
  creator?: string;
  description?: string;
  tags?: string[];
  content?: MindMapContent;
  viewCount: number;
}

// 思维导图内容接口
export interface MindMapContent {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  version: string;
}

// 思维导图节点接口
export interface MindMapNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    notes?: string;
    color?: string;
    icon?: string;
    materials?: any[];
    url?: string;
  };
  style?: {
    background?: string;
    border?: string;
    borderRadius?: string;
    fontSize?: string;
    padding?: string;
    boxShadow?: string;
    borderColor?: string;
    borderWidth?: number;
    width?: number;
    height?: number;
    color?: string;
    fontWeight?: string;
  };
}

// 思维导图连线接口
export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  style?: {
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  };
  animated?: boolean;
  markerEnd?: {
    type: MarkerType;
    width?: number;
    height?: number;
    color?: string;
  };
}

// 引入 MarkerType 类型
import { MarkerType } from '@xyflow/react';

// 共享思维导图接口
export interface SharedMindMap {
  id: number;
  title: string;
  creator: string;
  createdAt: string;
  likes: number;
  views: number;
  tags: string[];
  description?: string;
  previewImage?: string;
}

// 思维导图评论接口
export interface MindMapComment {
  id: number;
  mindMapId: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}
