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
    
    // 添加根节点 - 横向布局，放在左侧中间
    generatedNodes.push({
      id: 'root',
      type: 'materialNode',
      position: { x: 50, y: 300 },
      data: {
        label: '资料总览',
        icon: 'Database',
        isRoot: true
      }
    });
    
    // 递归生成节点和边 - 横向布局
    const generateNodesAndEdges = (
      categories: typeof tagHierarchy,
      parentId: string,
      level: number,
      parentX: number,
      parentY: number,
      totalSiblings: number
    ) => {
      // 横向布局参数调整
      const xSpacing = 250; // 水平间距
      const levelHeight = 200; // 每个级别的子节点垂直分布高度
      
      // 计算子节点总高度
      const totalHeight = categories.length <= 1 
        ? 0 
        : levelHeight * (categories.length - 1);
      
      // 计算垂直起始位置，使子节点围绕父节点垂直居中
      const startY = parentY - totalHeight / 2;
      
      // 为每个子节点创建节点和边
      categories.forEach((category, i) => {
        const nodeId = `${parentId}-${category.id}`;
        const x = parentX + xSpacing; // 水平位置向右递增
        const y = categories.length <= 1 
          ? parentY // 只有一个子节点时居中
          : startY + i * levelHeight; // 多个子节点时垂直分布
        
        // 创建当前节点
        generatedNodes.push({
          id: nodeId,
          type: 'materialNode',
          position: { x, y },
          data: {
            label: category.name,
            icon: 'Folder',
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
        
        // 创建连接到父节点的边 - 使用曲线类型提高可视性
        generatedEdges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'smoothstep',
          animated: level === 1, // 第一级动画效果更明显
          style: { 
            stroke: '#3b82f6',
            strokeWidth: level === 1 ? 2 : 1.5,
          }
        });
        
        // 如果有子类别，递归处理
        if (category.children && category.children.length > 0) {
          generateNodesAndEdges(
            category.children,
            nodeId,
            level + 1,
            x,
            y,
            category.children.length
          );
        }
      });
    };
    
    // 从根节点开始生成思维导图
    generateNodesAndEdges(tagHierarchy, 'root', 1, 50, 300, tagHierarchy.length);
    
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
    // 适应视图
    setTimeout(() => {
      instance.fitView({ padding: 0.2 });
    }, 100);
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