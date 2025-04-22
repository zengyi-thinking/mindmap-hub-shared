import { Node, Edge } from 'reactflow';

export interface MindMapData {
  nodes: Node[];
  edges: Edge[];
}

export const generateMindMap = async (query: string): Promise<MindMapData> => {
  // 模拟API调用，实际项目中应该调用后端API
  return new Promise((resolve) => {
    setTimeout(() => {
      const centerNode: Node = {
        id: '1',
        type: 'mindmapNode',
        position: { x: 0, y: 0 },
        data: { label: query, level: 0 },
      };

      const firstLevelNodes: Node[] = [
        {
          id: '2',
          type: 'mindmapNode',
          position: { x: -200, y: -100 },
          data: { label: '概念', level: 1 },
        },
        {
          id: '3',
          type: 'mindmapNode',
          position: { x: 200, y: -100 },
          data: { label: '应用', level: 1 },
        },
        {
          id: '4',
          type: 'mindmapNode',
          position: { x: -200, y: 100 },
          data: { label: '历史', level: 1 },
        },
        {
          id: '5',
          type: 'mindmapNode',
          position: { x: 200, y: 100 },
          data: { label: '未来', level: 1 },
        },
      ];

      const edges: Edge[] = firstLevelNodes.map((node) => ({
        id: `e1-${node.id}`,
        source: '1',
        target: node.id,
        type: 'smoothstep',
        animated: true,
      }));

      resolve({
        nodes: [centerNode, ...firstLevelNodes],
        edges,
      });
    }, 1000);
  });
};

export const addNode = (
  parentId: string,
  label: string,
  existingNodes: Node[],
  existingEdges: Edge[]
): { nodes: Node[]; edges: Edge[] } => {
  const parentNode = existingNodes.find((node) => node.id === parentId);
  if (!parentNode) return { nodes: existingNodes, edges: existingEdges };

  const level = parentNode.data.level + 1;
  const newNodeId = `${Date.now()}`;
  const newNode: Node = {
    id: newNodeId,
    type: 'mindmapNode',
    position: {
      x: parentNode.position.x + (Math.random() > 0.5 ? 200 : -200),
      y: parentNode.position.y + (Math.random() > 0.5 ? 100 : -100),
    },
    data: { label, level },
  };

  const newEdge: Edge = {
    id: `e${parentId}-${newNodeId}`,
    source: parentId,
    target: newNodeId,
    type: 'smoothstep',
  };

  return {
    nodes: [...existingNodes, newNode],
    edges: [...existingEdges, newEdge],
  };
};

export const deleteNode = (
  nodeId: string,
  existingNodes: Node[],
  existingEdges: Edge[]
): { nodes: Node[]; edges: Edge[] } => {
  const getChildNodes = (id: string): string[] => {
    const childEdges = existingEdges.filter((edge) => edge.source === id);
    const childNodeIds = childEdges.map((edge) => edge.target);
    return [
      ...childNodeIds,
      ...childNodeIds.flatMap((childId) => getChildNodes(childId)),
    ];
  };

  const nodesToDelete = new Set([nodeId, ...getChildNodes(nodeId)]);
  const edgesToDelete = new Set(
    existingEdges
      .filter(
        (edge) =>
          nodesToDelete.has(edge.source) || nodesToDelete.has(edge.target)
      )
      .map((edge) => edge.id)
  );

  return {
    nodes: existingNodes.filter((node) => !nodesToDelete.has(node.id)),
    edges: existingEdges.filter((edge) => !edgesToDelete.has(edge.id)),
  };
};

export const updateNode = (
  nodeId: string,
  label: string,
  existingNodes: Node[]
): Node[] => {
  return existingNodes.map((node) =>
    node.id === nodeId ? { ...node, data: { ...node.data, label } } : node
  );
}; 