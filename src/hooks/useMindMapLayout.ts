
import { useCallback } from 'react';
import dagre from 'dagre';
import { MindMapNode, MindMapEdge } from '@/types/mindmap';

export function useMindMapLayout() {
  // Auto layout function for organizing nodes
  const autoLayout = useCallback((nodes: MindMapNode[], edges: MindMapEdge[], reactFlowInstance: any) => {
    if (!nodes.length) return;

    const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 100 });

    // Add nodes to the graph
    nodes.forEach((node) => {
      g.setNode(node.id, { 
        width: node.style?.width || 150, 
        height: node.style?.height || 80 
      });
    });

    // Add edges to the graph
    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    // Calculate the layout
    dagre.layout(g);

    // Retrieve the positions from the layout
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = g.node(node.id);
      
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - (nodeWithPosition.width / 2),
          y: nodeWithPosition.y - (nodeWithPosition.height / 2)
        }
      };
    });

    // Apply the layout and fit the view
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({
          padding: 0.2,
          includeHiddenNodes: false,
        });
      }, 100);
    }

    return layoutedNodes;
  }, []);

  return { autoLayout };
}
