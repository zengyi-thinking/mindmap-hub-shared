import { Node, Edge } from 'reactflow';

export type LayoutType = 'radial' | 'tree' | 'fishbone';

interface LayoutOptions {
  type: LayoutType;
  direction?: 'horizontal' | 'vertical';
  spacing?: {
    x: number;
    y: number;
  };
}

const defaultOptions: LayoutOptions = {
  type: 'radial',
  direction: 'horizontal',
  spacing: {
    x: 200,
    y: 100,
  },
};

export const applyLayout = (
  nodes: Node[],
  edges: Edge[],
  options: Partial<LayoutOptions> = {}
): Node[] => {
  const config = { ...defaultOptions, ...options };
  const rootNode = nodes.find((node) => !edges.some((edge) => edge.target === node.id));
  
  if (!rootNode) return nodes;

  switch (config.type) {
    case 'radial':
      return applyRadialLayout(nodes, edges, rootNode, config);
    case 'tree':
      return applyTreeLayout(nodes, edges, rootNode, config);
    case 'fishbone':
      return applyFishboneLayout(nodes, edges, rootNode, config);
    default:
      return nodes;
  }
};

const applyRadialLayout = (
  nodes: Node[],
  edges: Edge[],
  rootNode: Node,
  options: LayoutOptions
): Node[] => {
  const updatedNodes = [...nodes];
  const rootIndex = updatedNodes.findIndex((node) => node.id === rootNode.id);
  
  if (rootIndex === -1) return nodes;

  // 设置根节点位置
  updatedNodes[rootIndex] = {
    ...rootNode,
    position: { x: 0, y: 0 },
  };

  // 获取所有子节点
  const childEdges = edges.filter((edge) => edge.source === rootNode.id);
  const childNodes = childEdges.map((edge) =>
    nodes.find((node) => node.id === edge.target)
  ).filter(Boolean) as Node[];

  // 计算子节点位置
  const angleStep = (2 * Math.PI) / childNodes.length;
  childNodes.forEach((node, index) => {
    const angle = index * angleStep;
    const nodeIndex = updatedNodes.findIndex((n) => n.id === node.id);
    
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...node,
        position: {
          x: Math.cos(angle) * options.spacing!.x,
          y: Math.sin(angle) * options.spacing!.y,
        },
      };
    }
  });

  return updatedNodes;
};

const applyTreeLayout = (
  nodes: Node[],
  edges: Edge[],
  rootNode: Node,
  options: LayoutOptions
): Node[] => {
  const updatedNodes = [...nodes];
  const rootIndex = updatedNodes.findIndex((node) => node.id === rootNode.id);
  
  if (rootIndex === -1) return nodes;

  // 设置根节点位置
  updatedNodes[rootIndex] = {
    ...rootNode,
    position: { x: 0, y: 0 },
  };

  // 递归设置子节点位置
  const setChildPositions = (
    parentId: string,
    level: number,
    startX: number,
    endX: number
  ) => {
    const childEdges = edges.filter((edge) => edge.source === parentId);
    const childNodes = childEdges.map((edge) =>
      nodes.find((node) => node.id === edge.target)
    ).filter(Boolean) as Node[];

    if (childNodes.length === 0) return;

    const step = (endX - startX) / (childNodes.length + 1);
    childNodes.forEach((node, index) => {
      const x = startX + step * (index + 1);
      const y = level * options.spacing!.y;
      
      const nodeIndex = updatedNodes.findIndex((n) => n.id === node.id);
      if (nodeIndex !== -1) {
        updatedNodes[nodeIndex] = {
          ...node,
          position: { x, y },
        };
      }

      // 递归设置子节点的子节点
      setChildPositions(
        node.id,
        level + 1,
        x - step / 2,
        x + step / 2
      );
    });
  };

  setChildPositions(
    rootNode.id,
    1,
    -options.spacing!.x * 2,
    options.spacing!.x * 2
  );

  return updatedNodes;
};

const applyFishboneLayout = (
  nodes: Node[],
  edges: Edge[],
  rootNode: Node,
  options: LayoutOptions
): Node[] => {
  const updatedNodes = [...nodes];
  const rootIndex = updatedNodes.findIndex((node) => node.id === rootNode.id);
  
  if (rootIndex === -1) return nodes;

  // 设置根节点位置
  updatedNodes[rootIndex] = {
    ...rootNode,
    position: { x: 0, y: 0 },
  };

  // 获取所有子节点
  const childEdges = edges.filter((edge) => edge.source === rootNode.id);
  const childNodes = childEdges.map((edge) =>
    nodes.find((node) => node.id === edge.target)
  ).filter(Boolean) as Node[];

  // 将子节点分为左右两组
  const leftNodes = childNodes.slice(0, Math.ceil(childNodes.length / 2));
  const rightNodes = childNodes.slice(Math.ceil(childNodes.length / 2));

  // 设置左侧节点位置
  leftNodes.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex((n) => n.id === node.id);
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...node,
        position: {
          x: -options.spacing!.x,
          y: -options.spacing!.y * (index + 1),
        },
      };
    }
  });

  // 设置右侧节点位置
  rightNodes.forEach((node, index) => {
    const nodeIndex = updatedNodes.findIndex((n) => n.id === node.id);
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...node,
        position: {
          x: options.spacing!.x,
          y: -options.spacing!.y * (index + 1),
        },
      };
    }
  });

  return updatedNodes;
}; 