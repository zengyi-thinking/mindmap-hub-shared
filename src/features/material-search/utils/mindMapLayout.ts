import { Node, Edge, Position, MarkerType } from '@xyflow/react';
import { TagCategory } from '@/modules/materials/types/materials';

interface LayoutOptions {
  startX?: number;
  startY?: number;
  levelSpacing?: number;
  nodeSpacing?: number;
}

/**
 * 生成思维导图树状布局
 * @param hierarchy 标签层次结构
 * @param options 布局选项
 * @returns 节点和连线集合
 */
export function generateMindMapLayout(
  hierarchy: TagCategory[],
  options: LayoutOptions = {}
): { nodes: Node[]; edges: Edge[] } {
  const {
    startX = 100,
    startY = 300,
    levelSpacing = 250,
    nodeSpacing = 100
  } = options;
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 添加根节点
  nodes.push({
    id: 'root',
    type: 'material-node',
    position: { x: startX, y: startY },
    data: {
      label: '资料总览',
      isRoot: true,
      level: 0
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  });
  
  // 递归生成节点和边布局
  function generateTreeLayout(
    categories: TagCategory[],
    parentId: string,
    level: number,
    currentX: number,
    currentY: number
  ) {
    // 计算本层级所有节点的总高度
    const totalHeight = (categories.length - 1) * nodeSpacing;
    
    // 起始Y坐标(使这层节点在父节点周围垂直居中)
    let posY = currentY - totalHeight / 2;
    
    // 当前X坐标(同级节点在同一竖直线上)
    const posX = currentX + levelSpacing;
    
    // 为每个类别创建节点
    categories.forEach(category => {
      const nodeId = `${parentId}-${category.id}`;
      
      // 创建当前节点
      nodes.push({
        id: nodeId,
        type: 'material-node',
        position: { x: posX, y: posY },
        data: {
          label: category.name,
          level: level,
          icon: level === 1 ? 'FolderOpen' : null
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      });
      
      // 创建连接线
      edges.push({
        id: `e-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'straight',
        animated: false,
        style: { 
          stroke: level === 1 ? '#5552e9' : '#6b7280', 
          strokeWidth: level === 1 ? 2 : 1.5
        },
        markerEnd: {
          type: MarkerType.Arrow,
          color: level === 1 ? '#5552e9' : '#6b7280',
        }
      });
      
      // 如果有子节点，递归处理
      if (category.children && category.children.length > 0) {
        generateTreeLayout(
          category.children,
          nodeId,
          level + 1,
          posX,
          posY
        );
      }
      
      // 更新Y坐标为下一个节点位置
      posY += nodeSpacing;
    });
  }
  
  // 从根节点开始生成树
  generateTreeLayout(
    hierarchy,
    'root',
    1,
    startX,
    startY
  );
  
  return { nodes, edges };
}

/**
 * 查找标签层次结构中的节点名称
 * @param categories 标签层次结构
 * @param nodeId 节点ID
 * @returns 节点名称
 */
export function findNodeName(categories: TagCategory[], nodeId: string): string {
  for (const cat of categories) {
    if (cat.id === nodeId) return cat.name;
    if (cat.children && cat.children.length > 0) {
      const found = findNodeName(cat.children, nodeId);
      if (found) return found;
    }
  }
  return nodeId;
}

/**
 * 提取节点路径名称
 * @param nodeId 节点ID (如 'root-cs-development-frontend')
 * @param hierarchy 标签层次结构
 * @returns 路径名称数组
 */
export function extractPathFromNodeId(nodeId: string, hierarchy: TagCategory[]): string[] {
  const nodePath = nodeId.split('-').slice(1);
  return nodePath.map(id => findNodeName(hierarchy, id));
} 