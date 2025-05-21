import { Node, Edge } from '@xyflow/react';
import { useCallback } from 'react';
import * as dagre from 'dagre';

// 节点的默认宽度和高度
const NODE_WIDTH = 180;
const NODE_HEIGHT = 120;

/**
 * 自动布局钩子，负责使用dagre库实现思维导图的自动布局功能
 */
export function useMindMapLayout() {
  /**
   * 自动布局函数，安排节点位置
   */
  const autoLayout = useCallback((nodes: Node[], edges: Edge[], reactFlowInstance: any) => {
    if (!nodes.length) return;

    // 创建新的dagre图实例
    const g = new dagre.graphlib.Graph();
    
    // 设置图布局方向为LR (从左到右)
    g.setGraph({ rankdir: 'LR', nodesep: 80, ranksep: 100 });
    
    // 默认设置边
    g.setDefaultEdgeLabel(() => ({}));

    // 添加节点到图
    nodes.forEach(node => {
      g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    // 添加边到图
    edges.forEach(edge => {
      g.setEdge(edge.source, edge.target);
    });

    // 执行布局算法
    dagre.layout(g);

    // 更新节点位置
    const layoutedNodes = nodes.map(node => {
      const dagreNode = g.node(node.id);
      
      // 如果是根节点，保持在左侧
      if (node.data.isRoot) {
        return {
          ...node,
          position: {
            x: 50,
            y: dagreNode.y - NODE_HEIGHT / 2
          }
        };
      }
      
      // 对于其他节点，使用dagre计算的位置
      return {
        ...node,
        position: {
          x: dagreNode.x - NODE_WIDTH / 2,
          y: dagreNode.y - NODE_HEIGHT / 2
        }
      };
    });
    
    // 如果存在React Flow实例，更新节点并适应视图
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.setNodes(layoutedNodes);
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 50);
    }

    return layoutedNodes;
  }, []);

  /**
   * 布局子树，从给定节点开始递归布局子节点
   */
  const layoutSubtree = useCallback((
    rootNodeId: string, 
    nodes: Node[], 
    edges: Edge[], 
    horizontalSpacing = 150, 
    verticalSpacing = 100
  ) => {
    // 找到根节点
    const rootNode = nodes.find(node => node.id === rootNodeId);
    if (!rootNode) return nodes;

    // 找到所有连接到根节点的边
    const childEdges = edges.filter(edge => edge.source === rootNodeId);
    
    // 没有子节点，直接返回
    if (childEdges.length === 0) return nodes;

    // 找到子节点
    const childNodeIds = childEdges.map(edge => edge.target);
    const childNodes = nodes.filter(node => childNodeIds.includes(node.id));

    // 计算子树总高度
    const totalHeight = (childNodes.length - 1) * verticalSpacing;
    
    // 计算起始Y位置，使子节点垂直居中排列
    const startY = rootNode.position.y - totalHeight / 2;

    // 新的节点位置
    const newNodes = [...nodes];
    
    // 为每个子节点分配位置
    childNodes.forEach((childNode, index) => {
      const childY = startY + index * verticalSpacing;
      const childX = rootNode.position.x + horizontalSpacing;

      // 更新子节点位置
      const childNodeIndex = newNodes.findIndex(n => n.id === childNode.id);
      if (childNodeIndex >= 0) {
        newNodes[childNodeIndex] = {
          ...newNodes[childNodeIndex],
          position: { x: childX, y: childY }
        };
        
        // 递归布局子节点的子树
        layoutSubtree(childNode.id, newNodes, edges, horizontalSpacing, verticalSpacing);
      }
    });

    return newNodes;
  }, []);

  return {
    autoLayout,
    layoutSubtree
  };
}

