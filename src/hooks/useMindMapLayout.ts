
import { useCallback } from 'react';
import { MindMapNode, MindMapEdge } from '@/types/mindmap';

export function useMindMapLayout(setNodes: any) {
  // Auto layout function
  const autoLayout = useCallback((
    nodes: MindMapNode[], 
    edges: MindMapEdge[], 
    reactFlowInstance: any
  ) => {
    // Simple auto layout (horizontal tree layout)
    if (nodes.length === 0) return;
    
    // Find the root node (assuming it's the first node)
    const rootNode = nodes[0];
    const rootId = rootNode.id;
    
    // Calculate levels for each node based on distance from root
    const nodeLevels: Record<string, number> = {};
    nodeLevels[rootId] = 0;
    
    // Calculate levels using BFS
    const queue = [rootId];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const childEdges = edges.filter(edge => edge.source === currentId);
      
      childEdges.forEach(edge => {
        const targetId = edge.target;
        if (nodeLevels[targetId] === undefined) {
          nodeLevels[targetId] = nodeLevels[currentId] + 1;
          queue.push(targetId);
        }
      });
    }
    
    // Get max level
    const maxLevel = Math.max(...Object.values(nodeLevels));
    
    // Count nodes at each level
    const nodesPerLevel: Record<number, number> = {};
    Object.values(nodeLevels).forEach(level => {
      nodesPerLevel[level] = (nodesPerLevel[level] || 0) + 1;
    });
    
    // Set positions based on levels
    const levelWidth = 250;
    const levelHeight = 150;
    const newNodes = nodes.map(node => {
      const level = nodeLevels[node.id] || 0;
      const nodesInThisLevel = nodesPerLevel[level] || 1;
      
      // Find position of this node within its level
      const nodesAtSameLevel = Object.entries(nodeLevels)
        .filter(([_, l]) => l === level)
        .map(([id]) => id);
      
      const positionInLevel = nodesAtSameLevel.indexOf(node.id);
      const levelStartY = 300 - (nodesInThisLevel * levelHeight / 2);
      
      return {
        ...node,
        position: {
          x: 400 + (level - maxLevel / 2) * levelWidth,
          y: levelStartY + positionInLevel * levelHeight
        }
      };
    });
    
    setNodes(newNodes);
    
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView();
      }, 100);
    }
  }, [setNodes]);

  return { autoLayout };
}
