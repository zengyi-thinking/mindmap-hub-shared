/**
 * 桥接文件 - 从新的Clean Architecture导出MindMap类型
 * 这个文件作为桥接，将导入重定向到新的位置，并提供向后兼容的类型
 */

import { MindMap as DomainMindMap } from '@/domains/mindmap/entities/MindMap';

// 导出领域实体的类型，以便未来迁移
export type { MindMapNode } from '@/domains/mindmap/entities/MindMap';

// 定义遗留系统兼容的思维导图类型
export interface MindMap {
  id: number; // 使用数字ID以兼容遗留代码
  title: string;
  description?: string;
  content?: any; // 存储节点和连接信息
  updatedAt: string;
  starred?: boolean;
  shared?: boolean;
  viewCount?: number;
  creator?: string;
  tags?: string[];
}

// 定义共享思维导图接口
export interface SharedMindMap {
  id: number;
  title: string;
  creator: string;
  createdAt: string;
  likes: number;
  views: number;
  tags: string[];
} 