import { useState, useEffect, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { tagHierarchy } from '@/data/tagHierarchy';
import { userFilesService } from '@/lib/storage';

export const useMaterialMindMap = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [folderMaterials, setFolderMaterials] = useState<any[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // 当路径变化时，获取当前文件夹的资料
  useEffect(() => {
    if (currentPath.length > 0) {
      const filesInFolder = userFilesService.getByDirectFolder(currentPath);
      setFolderMaterials(filesInFolder.filter(file => file.approved));
    } else {
      setFolderMaterials([]);
    }
  }, [currentPath]);

  // 导航到指定层级
  const navigateTo = (index: number) => {
    if (index < 0) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  // 处理节点点击
  const handleNodeClick = (event, node) => {
    // 如果节点有folderPath，设置当前路径
    if (node.data.folderPath && node.data.folderPath.length > 0) {
      setCurrentPath(node.data.folderPath);
    }
  };

  // 生成思维导图节点和边
  const generateMindMap = useCallback(() => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];
    
    // 添加根节点
    generatedNodes.push({
      id: 'root',
      type: 'materialNode',
      position: { x: 0, y: 0 },
      data: {
        label: '资料总览',
        icon: 'folder',
        color: '#4361ee',
        isRoot: true
      }
    });
    
    // 递归生成节点和边
    const generateNodesAndEdges = (
      categories: typeof tagHierarchy,
      parentId: string,
      level: number,
      parentX: number,
      parentY: number,
      index: number,
      totalSiblings: number
    ) => {
      // 计算每个级别的子节点间距和位置
      const xSpacing = level === 1 ? 250 : 200;
      const ySpacing = level === 1 ? 120 : 80;
      
      // 计算这个级别的总宽度
      const totalWidth = (totalSiblings - 1) * xSpacing;
      // 计算起始X位置，使子节点在父节点两侧均匀分布
      const startX = parentX - totalWidth / 2;
      
      categories.forEach((category, i) => {
        const nodeId = `${parentId}-${category.id}`;
        const x = startX + i * xSpacing;
        const y = parentY + (level === 1 ? 150 : 100);
        
        // 创建当前节点
        generatedNodes.push({
          id: nodeId,
          type: 'materialNode',
          position: { x, y },
          data: {
            label: category.name,
            icon: 'folder',
            color: level === 1 ? '#4cc9f0' : '#4895ef',
            folderPath: nodeId.split('-').slice(1).map(id => {
              // 查找对应的名称
              const findName = (categories: typeof tagHierarchy, id: string): string => {
                for (const cat of categories) {
                  if (cat.id === id) return cat.name;
                  if (cat.children) {
                    const found = findName(cat.children, id);
                    if (found) return found;
                  }
                }
                return id;
              };
              
              return findName(tagHierarchy, id);
            })
          }
        });
        
        // 创建连接到父节点的边
        generatedEdges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'smoothstep',
          style: { stroke: '#94a3b8' }
        });
        
        // 如果有子类别，递归处理
        if (category.children && category.children.length > 0) {
          generateNodesAndEdges(
            category.children,
            nodeId,
            level + 1,
            x,
            y,
            i,
            category.children.length
          );
        }
      });
    };
    
    // 从根节点开始生成思维导图
    generateNodesAndEdges(tagHierarchy, 'root', 1, 0, 0, 0, tagHierarchy.length);
    
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, []);

  // 初始化时生成导图
  useEffect(() => {
    generateMindMap();
  }, [generateMindMap]);

  // 初始化 ReactFlow
  const onInitReactFlow = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  return {
    nodes,
    edges,
    currentPath,
    setCurrentPath,
    folderMaterials,
    reactFlowInstance,
    navigateTo,
    handleNodeClick,
    onInitReactFlow
  };
}; 