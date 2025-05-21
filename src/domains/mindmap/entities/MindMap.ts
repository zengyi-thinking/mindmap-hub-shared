/**
 * MindMap实体 - 定义思维导图的核心数据结构
 * 这是领域层的核心实体，不依赖于任何外部框架或库
 */

export interface MindMapNode {
  id: string;
  text: string;
  parentId?: string;
  children?: MindMapNode[];
  attributes?: Record<string, any>;
}

export interface MindMap {
  id: string;
  title: string;
  description?: string;
  rootNode: MindMapNode;
  nodes: MindMapNode[];
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isPublic: boolean;
  ownerId: string;
}

// 实体工厂函数
export const createMindMap = (
  id: string,
  title: string,
  rootText: string = "中心主题",
  ownerId: string,
  isPublic: boolean = false,
  description?: string,
  tags?: string[]
): MindMap => {
  const rootNode: MindMapNode = {
    id: `node-${Date.now()}`,
    text: rootText,
  };

  return {
    id,
    title,
    description,
    rootNode,
    nodes: [rootNode],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: tags || [],
    isPublic,
    ownerId,
  };
};

// 添加节点
export const addNode = (mindMap: MindMap, parentId: string, text: string): MindMap => {
  const newNode: MindMapNode = {
    id: `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    text,
    parentId
  };

  // 找到父节点并添加子节点
  const updatedNodes = mindMap.nodes.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode]
      };
    }
    return node;
  });

  return {
    ...mindMap,
    nodes: [...updatedNodes, newNode],
    updatedAt: new Date()
  };
};

// 更新节点
export const updateNode = (mindMap: MindMap, nodeId: string, text: string): MindMap => {
  const updatedNodes = mindMap.nodes.map(node => 
    node.id === nodeId ? { ...node, text } : node
  );
  
  return {
    ...mindMap,
    nodes: updatedNodes,
    updatedAt: new Date()
  };
};

// 删除节点及其子节点
export const removeNode = (mindMap: MindMap, nodeId: string): MindMap => {
  // 不允许删除根节点
  if (nodeId === mindMap.rootNode.id) {
    throw new Error("Cannot remove root node");
  }
  
  // 获取要删除的所有节点ID（包括子节点）
  const getNodeIdsToRemove = (nodeId: string): string[] => {
    const node = mindMap.nodes.find(n => n.id === nodeId);
    if (!node) return [nodeId];
    
    const childIds = node.children?.flatMap(child => 
      getNodeIdsToRemove(child.id)
    ) || [];
    
    return [nodeId, ...childIds];
  };
  
  const idsToRemove = getNodeIdsToRemove(nodeId);
  
  // 过滤掉要删除的节点
  const filteredNodes = mindMap.nodes.filter(node => 
    !idsToRemove.includes(node.id)
  );
  
  // 更新父节点的子节点引用
  const updatedNodes = filteredNodes.map(node => {
    if (node.children) {
      return {
        ...node,
        children: node.children.filter(child => !idsToRemove.includes(child.id))
      };
    }
    return node;
  });
  
  return {
    ...mindMap,
    nodes: updatedNodes,
    updatedAt: new Date()
  };
}; 