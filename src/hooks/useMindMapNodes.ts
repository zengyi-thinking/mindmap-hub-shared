
import { useCallback } from 'react';
import { MindMapNode, MindMapEdge } from '@/types/mindmap';
import { MarkerType } from '@xyflow/react';

export function useMindMapNodes(setNodes: any, setEdges: any) {
  // Add a new node
  const addNode = useCallback((reactFlowInstance: any, reactFlowWrapper: React.RefObject<HTMLDivElement>) => {
    if (!reactFlowInstance) return;
    
    const id = `node_${Date.now()}`;
    const position = reactFlowInstance.project({
      x: reactFlowWrapper.current ? reactFlowWrapper.current.offsetWidth / 2 : 400,
      y: reactFlowWrapper.current ? reactFlowWrapper.current.offsetHeight / 2 : 300
    });

    const newNode: MindMapNode = {
      id,
      type: 'materialNode',
      data: { 
        label: '新节点',
        materials: []
      },
      position,
      style: {
        background: '#ffffff',
        border: '1px solid hsl(var(--border))',
        width: 120,
        height: 60,
        padding: '8px',
        borderRadius: '8px',
      }
    };
    
    setNodes((nds: MindMapNode[]) => [...nds, newNode]);
    
    return newNode;
  }, [setNodes]);

  // Delete the selected node
  const deleteNode = useCallback((selectedNode: MindMapNode | null) => {
    if (selectedNode) {
      setNodes((nds: MindMapNode[]) => nds.filter(node => node.id !== selectedNode.id));
      setEdges((eds: MindMapEdge[]) => eds.filter(edge => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      return true;
    }
    return false;
  }, [setNodes, setEdges]);

  // Update node after editing
  const updateNode = useCallback((
    selectedNode: MindMapNode | null, 
    nodeName: string, 
    nodeNotes: string, 
    nodeColor: string, 
    nodeIcon: string,
    nodeUrl: string
  ) => {
    if (selectedNode) {
      setNodes((nds: MindMapNode[]) => 
        nds.map(node => {
          if (node.id === selectedNode.id) {
            const updatedNode = {
              ...node,
              data: { 
                ...node.data, 
                label: nodeName,
                notes: nodeNotes,
                icon: nodeIcon,
                url: nodeUrl
              },
              style: {
                ...node.style,
                background: nodeColor
              }
            };
            return updatedNode;
          }
          return node;
        })
      );
      return true;
    }
    return false;
  }, [setNodes]);

  // Attach materials to a node
  const attachMaterials = useCallback((selectedNode: MindMapNode | null, selectedMaterials: any[]) => {
    if (selectedNode) {
      setNodes((nds: MindMapNode[]) => 
        nds.map(node => {
          if (node.id === selectedNode.id) {
            const updatedNode = {
              ...node,
              data: { 
                ...node.data, 
                materials: selectedMaterials
              }
            };
            return updatedNode;
          }
          return node;
        })
      );
      return true;
    }
    return false;
  }, [setNodes]);

  // Start connecting nodes
  const createConnection = useCallback((source: string, target: string) => {
    if (source && target && source !== target) {
      const newEdge = {
        id: `e-${source}-${target}`,
        source,
        target,
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: 'hsl(var(--border))', strokeWidth: 2 }
      };
      setEdges((edges: MindMapEdge[]) => [...edges, newEdge]);
      return true;
    }
    return false;
  }, [setEdges]);

  return {
    addNode,
    deleteNode,
    updateNode,
    attachMaterials,
    createConnection
  };
}
