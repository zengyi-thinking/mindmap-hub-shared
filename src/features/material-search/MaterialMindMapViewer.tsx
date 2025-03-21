import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  NodeTypes,
  NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Edit, ZoomIn } from 'lucide-react';
import styles from '@/pages/MaterialSearch.module.css';
import { tagHierarchy } from '@/data/tagHierarchy';
import { mindmapService } from '@/lib/mindmapStorage';
import { useToast } from '@/components/ui/use-toast';
import { TagCategory } from '@/types/materials';
import { MindMap, MindMapNode, MindMapEdge } from '@/types/mindmap';

// 扩展TagCategory类型
interface EnhancedTagCategory extends TagCategory {
  materialCount?: number;
}

// 自定义MindMap类型，与我们的实现相匹配
interface CustomMindMap {
  id: string;
  title: string;
  description: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  nodes: Node[];
  edges: Edge[];
  isPublic: boolean;
  tags: string[];
  viewCount: number;
}

// 注册节点类型
const nodeTypes: NodeTypes = {
  materialNode: ({ id, data }: { id: string, data: any }) => {
    // 检测当前主题模式
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // 在暗黑模式下添加特殊的背景样式
    const darkModeStyle = isDarkMode ? {
      background: 'linear-gradient(135deg, rgba(30, 32, 40, 0.95) 0%, rgba(25, 27, 35, 0.95) 100%)',
    } : {};
    
    return (
      <div 
        className={`${styles.materialCard} rounded-lg p-3 min-w-[180px] border cursor-pointer`}
        onClick={() => data.onNodeClick && data.onNodeClick(id, data)}
        style={darkModeStyle}
      >
        <div className={`${styles.materialNodeContent}`}>
          <div 
            className="font-bold text-primary dark:text-white mb-1" 
            style={{
              textShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.9)' : 'none',
              letterSpacing: '0.01em'
            }}
          >
            {data.label}
          </div>
          {data.count !== undefined && (
            <div className="text-xs bg-primary/15 dark:bg-primary/30 text-primary-foreground dark:text-white dark:font-medium px-2 py-1 rounded-full inline-block" style={{
              textShadow: isDarkMode ? '0 1px 2px rgba(0,0,0,0.7)' : 'none'
            }}>
              {data.count} 项
            </div>
          )}
        </div>
      </div>
    );
  },
};

interface MaterialMindMapViewerProps {
  onNodeClick?: (nodeId: string, nodeData: any) => void;
  initialMindMap?: CustomMindMap | null;
}

export const MaterialMindMapViewer: React.FC<MaterialMindMapViewerProps> = ({
  onNodeClick,
  initialMindMap = null,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mindMap, setMindMap] = useState<CustomMindMap | null>(initialMindMap);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // 根据标签层次结构生成节点和边
  const generateNodesAndEdges = useCallback(() => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];

    // 生成根节点
    generatedNodes.push({
      id: 'root',
      position: { x: 0, y: 0 },
      data: { label: '全部资料' },
      type: 'materialNode',
    });

    // 计算第一层节点的位置和连接
    const categories = tagHierarchy as EnhancedTagCategory[];
    const radius = 250; // 第一层半径
    const angleStep = (2 * Math.PI) / categories.length;

    categories.forEach((category, index) => {
      const angle = index * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      generatedNodes.push({
        id: category.id,
        position: { x, y },
        data: { 
          label: category.name,
          count: category.materialCount || '?',
          type: 'category' 
        },
        type: 'materialNode',
      });

      generatedEdges.push({
        id: `e-root-${category.id}`,
        source: 'root',
        target: category.id,
        type: ConnectionLineType.SmoothStep,
        animated: true,
      });

      // 如果有子类别，添加子节点
      if (category.children && category.children.length > 0) {
        const childRadius = 150; // 第二层半径
        const childAngleStep = (Math.PI / 2) / (category.children.length + 1);
        const baseAngle = angle - Math.PI / 4;

        (category.children as EnhancedTagCategory[]).forEach((child, childIndex) => {
          const childAngle = baseAngle + (childIndex + 1) * childAngleStep;
          const childX = x + childRadius * Math.cos(childAngle);
          const childY = y + childRadius * Math.sin(childAngle);

          generatedNodes.push({
            id: child.id,
            position: { x: childX, y: childY },
            data: { 
              label: child.name,
              count: child.materialCount || '?',
              type: 'subcategory' 
            },
            type: 'materialNode',
          });

          generatedEdges.push({
            id: `e-${category.id}-${child.id}`,
            source: category.id,
            target: child.id,
            type: ConnectionLineType.SmoothStep,
            animated: false,
          });
        });
      }
    });

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [setNodes, setEdges]);

  // 初始化思维导图
  useEffect(() => {
    if (initialMindMap) {
      try {
        if (initialMindMap.nodes && initialMindMap.edges) {
          setNodes(initialMindMap.nodes);
          setEdges(initialMindMap.edges);
        } else {
          generateNodesAndEdges();
        }
      } catch (error) {
        console.error('加载思维导图失败', error);
        generateNodesAndEdges();
      }
    } else {
      generateNodesAndEdges();
    }
  }, [initialMindMap, generateNodesAndEdges, setNodes, setEdges]);

  // 处理节点点击事件
  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node.id, node.data);
    }
  };

  // 初始化 ReactFlow
  const onInit = useCallback((instance: any) => {
    setReactFlowInstance(instance);
  }, []);

  // 处理编辑思维导图
  const handleEditMindMap = () => {
    // 保存当前思维导图状态
    const currentMap: CustomMindMap = {
      id: mindMap?.id || 'temp-' + Date.now().toString(),
      title: mindMap?.title || '未命名思维导图',
      description: mindMap?.description || '',
      creator: mindMap?.creator || '当前用户',
      createdAt: mindMap?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: nodes,
      edges: edges,
      isPublic: mindMap?.isPublic || false,
      tags: mindMap?.tags || [],
      viewCount: mindMap?.viewCount || 0
    };

    // 保存到本地存储
    try {
      // 将我们的CustomMindMap转换为存储需要的格式
      const mindMapToSave: Partial<MindMap> = {
        id: Number(currentMap.id) || Date.now(),
        title: currentMap.title,
        updatedAt: currentMap.updatedAt,
        starred: false,
        shared: currentMap.isPublic,
        creator: currentMap.creator,
        description: currentMap.description,
        tags: currentMap.tags,
        content: {
          nodes: nodes.map(node => ({
            id: node.id,
            type: node.type || 'materialNode',
            position: node.position,
            data: node.data,
            style: node.style,
          })) as MindMapNode[],
          edges: edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            animated: edge.animated,
            style: edge.style,
          })) as MindMapEdge[],
          version: "1.0"
        },
        viewCount: currentMap.viewCount
      };

      const savedMap = mindmapService.add(mindMapToSave);
      // 导航到思维导图编辑页面
      navigate(`/mindmap/${savedMap.id}/edit`);
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存当前思维导图状态",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        attributionPosition="bottom-right"
        zoomOnScroll={true}
        panOnScroll={true}
        elementsSelectable={true}
        onInit={onInit}
      >
        <Background 
          variant={"dots" as BackgroundVariant}
          gap={20} 
          size={1} 
          color="hsl(var(--muted-foreground) / 0.3)"
        />
        <Controls 
          showInteractive={false}
          position="bottom-right"
          style={{
            borderRadius: '8px',
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))'
          }}
        />
      </ReactFlow>

      {/* 编辑按钮 */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={() => reactFlowInstance?.fitView()}
        >
          <ZoomIn className="h-4 w-4 mr-1" />
          适应视图
        </Button>
        <Button 
          size="sm" 
          className="bg-primary hover:bg-primary/90"
          onClick={handleEditMindMap}
        >
          <Edit className="h-4 w-4 mr-1" />
          编辑导图
        </Button>
      </div>
    </div>
  );
};

export default MaterialMindMapViewer; 