/**
 * 思维导图展示层 - 将领域模型转换为UI友好的数据格式
 * 这是适配器层的一部分，负责数据格式转换
 */

import { MindMap, MindMapNode } from '../../entities/MindMap';

// UI层思维导图数据结构
export interface MindMapViewModel {
  id: string;
  title: string;
  description: string;
  rootNode: MindMapNodeViewModel;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPublic: boolean;
  ownerId: string;
}

// UI层节点数据结构
export interface MindMapNodeViewModel {
  id: string;
  text: string;
  parentId?: string;
  children: MindMapNodeViewModel[];
  attributes?: Record<string, any>;
}

// 思维导图列表项
export interface MindMapListItemViewModel {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  tags: string[];
  isPublic: boolean;
  ownerId: string;
}

export class MindMapPresenter {
  // 将领域模型转换为视图模型
  static toViewModel(mindMap: MindMap): MindMapViewModel {
    const rootNodeVM = this.convertNodeToViewModel(mindMap.rootNode, mindMap.nodes);
    
    return {
      id: mindMap.id,
      title: mindMap.title,
      description: mindMap.description || '',
      rootNode: rootNodeVM,
      createdAt: mindMap.createdAt.toISOString(),
      updatedAt: mindMap.updatedAt.toISOString(),
      tags: mindMap.tags || [],
      isPublic: mindMap.isPublic,
      ownerId: mindMap.ownerId
    };
  }

  // 将思维导图转换为列表项视图模型
  static toListItemViewModel(mindMap: MindMap): MindMapListItemViewModel {
    return {
      id: mindMap.id,
      title: mindMap.title,
      description: mindMap.description || '',
      createdAt: mindMap.createdAt.toISOString(),
      updatedAt: mindMap.updatedAt.toISOString(),
      nodeCount: mindMap.nodes.length,
      tags: mindMap.tags || [],
      isPublic: mindMap.isPublic,
      ownerId: mindMap.ownerId
    };
  }

  // 将多个思维导图转换为列表项视图模型
  static toListViewModel(mindMaps: MindMap[]): MindMapListItemViewModel[] {
    return mindMaps.map(mindMap => this.toListItemViewModel(mindMap));
  }

  // 递归构建节点视图模型结构
  private static convertNodeToViewModel(
    node: MindMapNode, 
    allNodes: MindMapNode[]
  ): MindMapNodeViewModel {
    // 找出当前节点的所有直接子节点
    const children = allNodes.filter(n => n.parentId === node.id);
    
    // 递归转换每个子节点
    const childrenViewModels = children.map(child => 
      this.convertNodeToViewModel(child, allNodes)
    );
    
    return {
      id: node.id,
      text: node.text,
      parentId: node.parentId,
      children: childrenViewModels,
      attributes: node.attributes
    };
  }

  // 将思维导图转换为Mermaid格式
  static toMermaidFormat(mindMap: MindMap): string {
    let mermaidText = 'mindmap\n';
    
    // 添加根节点
    mermaidText += `  root((${this.escapeMermaidText(mindMap.rootNode.text)}))\n`;
    
    // 递归添加子节点
    const addChildNodes = (parentNode: MindMapNode, depth: number) => {
      const indent = '  '.repeat(depth + 1);
      const childNodes = mindMap.nodes.filter(node => node.parentId === parentNode.id);
      
      for (const childNode of childNodes) {
        mermaidText += `${indent}${this.escapeMermaidText(childNode.text)}\n`;
        addChildNodes(childNode, depth + 1);
      }
    };
    
    addChildNodes(mindMap.rootNode, 1);
    
    return mermaidText;
  }
  
  // 处理Mermaid语法中的特殊字符
  private static escapeMermaidText(text: string): string {
    if (!text) return '';
    
    // 转义Mermaid语法中的特殊字符
    return text
      .replace(/:/g, '&#58;')
      .replace(/\(/g, '&#40;')
      .replace(/\)/g, '&#41;')
      .replace(/\[/g, '&#91;')
      .replace(/\]/g, '&#93;')
      .replace(/"/g, '&quot;');
  }
} 