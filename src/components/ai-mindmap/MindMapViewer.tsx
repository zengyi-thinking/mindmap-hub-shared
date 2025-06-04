import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  Panel,
  NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MindMapNode, MindMapLayout } from '@/types/mindmap';

// 自定义节点组件
const MindmapNode: React.FC<{
  data: {
    label: string;
    type?: string;
    level?: number;
    style?: React.CSSProperties;
    clickable?: boolean;
  };
  selected?: boolean;
  id: string;
}> = ({ data, selected, id }) => {
  // 检查文本是否包含中文字符
  const containsChinese = (text: string): boolean => {
    return /[\u4e00-\u9fa5]/.test(text);
  };
  
  const hasChineseChars = containsChinese(data.label);
  
  // 根据文本长度和是否包含中文字符调整节点宽度
  const getNodeWidth = (): string => {
    const baseWidth = data.level === 0 ? 160 : 120;
    const textLength = data.label.length;
    
    if (hasChineseChars) {
      // 中文字符通常需要更宽的空间
      return `${Math.max(baseWidth, textLength * 16)}px`;
    } else {
      return `${Math.max(baseWidth, textLength * 8)}px`;
    }
  };
  
  // 节点样式合并默认样式和传入的自定义样式
  const nodeStyle: React.CSSProperties = {
    padding: '10px 15px',
    borderRadius: '10px',
    background: data.type === 'central' 
      ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.8))' 
      : 'hsl(var(--card))',
    color: data.type === 'central' ? 'white' : 'hsl(var(--foreground))',
    border: selected ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
    fontSize: data.level === 0 ? '16px' : '14px',
    fontWeight: data.level === 0 ? 600 : 400,
    boxShadow: selected 
      ? '0 0 0 2px hsl(var(--primary)), 0 4px 8px rgba(0, 0, 0, 0.15)' 
      : '0 2px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    minWidth: getNodeWidth(),
    textAlign: 'center',
    cursor: data.clickable ? 'pointer' : 'default',
    wordWrap: 'break-word',
    maxWidth: '300px',
    lineHeight: '1.4',
    textShadow: data.type === 'central' ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none',
    ...data.style
  };

  return (
    <div style={nodeStyle}>
      {data.label}
    </div>
  );
};

// 注册自定义节点类型
const nodeTypes: NodeTypes = {
  mindmapNode: MindmapNode,
};

interface MindMapViewerProps {
  data: MindMapNode | null;
  layout?: MindMapLayout;
  isDarkMode?: boolean;
  onNodeClick?: (node: MindMapNode) => void;
  options?: {
    allowZoom?: boolean;
    allowPan?: boolean;
    allowNodeClick?: boolean;
    allowNodeHover?: boolean;
    animationDuration?: number;
  };
}

// 递归将MindMapNode转换为ReactFlow节点和边
const convertToReactFlowElements = (
  mindMapNode: MindMapNode | null,
  layout: MindMapLayout = 'radial',
  parentId?: string,
  level: number = 0,
  angle: number = 0,
  radius: number = 0,
  angleSpan: number = 2 * Math.PI,
  parentX: number = 0,
  parentY: number = 0
): { nodes: Node[], edges: Edge[] } => {
  if (!mindMapNode) {
    return { nodes: [], edges: [] };
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 节点ID
  const nodeId = mindMapNode.id || `node-${Math.random().toString(36).substring(2, 11)}`;
  
  // 检查文本是否包含中文字符
  const containsChinese = (text: string): boolean => {
    return /[\u4e00-\u9fa5]/.test(text);
  };
  
  const hasChineseChars = containsChinese(mindMapNode.name);
  
  // 节点位置
  let x = 0;
  let y = 0;
  
  // 根据布局算法确定位置
  if (layout === 'tree') {
    // 树状布局（水平）- 增加节点间距
    x = level * 300; // 增加层级间距
    y = 0;
  } else if (layout === 'radial' && level > 0) {
    // 放射状布局 - 增加半径
    const radiusMultiplier = hasChineseChars ? 1.2 : 1.0; // 中文需要更大的间距
    x = parentX + Math.cos(angle) * radius * radiusMultiplier;
    y = parentY + Math.sin(angle) * radius * radiusMultiplier;
  } else if (layout === 'force') {
    // 力导向布局（随机初始位置）
    x = Math.random() * 500 - 250;
    y = Math.random() * 500 - 250;
  } else if (layout === 'mindmap') {
    // 标准思维导图布局（水平展开）- 增加节点间距
    x = level * 350; // 增加水平间距
    y = 0;
  }
  
  // 创建当前节点
  const node: Node = {
    id: nodeId,
    type: 'mindmapNode',
    position: { x, y },
    data: { 
      label: mindMapNode.name,
      type: level === 0 ? 'central' : 'normal',
      level,
      clickable: true,
      style: mindMapNode.color ? { 
        background: mindMapNode.color,
        color: isLightColor(mindMapNode.color) ? 'black' : 'white' 
      } : undefined
    }
  };
  
  nodes.push(node);
  
  // 创建父节点到当前节点的边
  if (parentId) {
    const edgeType = layout === 'mindmap' ? 'smoothstep' : 'default';
    
    const edge: Edge = {
      id: `edge-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      type: edgeType,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: Math.max(3 - level * 0.5, 1) },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: 'hsl(var(--primary))',
      }
    };
    
    edges.push(edge);
  }
  
  // 处理子节点
  if (mindMapNode.children && mindMapNode.children.length > 0) {
    const childCount = mindMapNode.children.length;
    
    // 基于不同布局计算子节点位置
    mindMapNode.children.forEach((childNode, index) => {
      let childAngle = angle;
      let childRadius = radius;
      let childAngleSpan = angleSpan;
      let childParentX = x;
      let childParentY = y;
      
      if (layout === 'tree') {
        // 树状布局，子节点均匀分布 - 增加垂直间距
        const verticalSpacing = 220; // 增加垂直间距
        const totalHeight = (childCount - 1) * verticalSpacing;
        const startY = y - totalHeight / 2;
        childParentY = startY + index * verticalSpacing;
      } else if (layout === 'radial') {
        // 放射状布局，子节点在圆周上均匀分布 - 增加半径
        childAngleSpan = angleSpan / childCount;
        childAngle = angle - angleSpan / 2 + childAngleSpan * (index + 0.5);
        childRadius = 250; // 增加半径
      } else if (layout === 'mindmap') {
        // 思维导图布局，子节点上下均匀分布 - 增加垂直间距
        const verticalSpacing = 130; // 增加垂直间距
        const totalHeight = (childCount - 1) * verticalSpacing;
        const startY = y - totalHeight / 2;
        childParentY = startY + index * verticalSpacing;
      }
      
      // 递归处理子节点
      const childElements = convertToReactFlowElements(
        childNode, 
        layout, 
        nodeId, 
        level + 1,
        childAngle,
        childRadius,
        childAngleSpan,
        childParentX,
        childParentY
      );
      
      nodes.push(...childElements.nodes);
      edges.push(...childElements.edges);
    });
  }
  
  return { nodes, edges };
};

// 判断颜色是否为浅色
const isLightColor = (color: string): boolean => {
  // 如果是十六进制颜色
  if (color.startsWith('#')) {
    const hex = color.substring(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }
  
  // 如果是RGB颜色
  if (color.startsWith('rgb')) {
    const rgbValues = color.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
      const r = parseInt(rgbValues[0]);
      const g = parseInt(rgbValues[1]);
      const b = parseInt(rgbValues[2]);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128;
    }
  }
  
  return false;
};

// 思维导图查看器主组件
const MindMapViewerInner: React.FC<MindMapViewerProps> = ({ 
  data, 
  layout = 'radial',
  isDarkMode = false, 
  onNodeClick,
  options = {}
}) => {
  console.log("MindMapViewerInner 渲染中, 数据:", data ? "有数据" : "无数据");
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();
  const [error, setError] = useState<string | null>(null);
  
  // 公开视图控制函数供父组件使用
  const viewerRef = useRef<{ zoomIn?: () => void, zoomOut?: () => void, resetView?: () => void }>();
  
  if (viewerRef.current) {
    viewerRef.current.zoomIn = zoomIn;
    viewerRef.current.zoomOut = zoomOut;
    viewerRef.current.resetView = fitView;
  }
  
  // 转换数据
  useEffect(() => {
    try {
      if (data) {
        console.log("转换思维导图数据为ReactFlow格式");
        const elements = convertToReactFlowElements(data, layout);
        
        if (!elements || (!elements.nodes.length && !elements.edges.length)) {
          console.error("无法转换数据，节点或边为空");
          setError("数据转换错误");
          return;
        }
        
        console.log(`转换完成: ${elements.nodes.length}个节点, ${elements.edges.length}条边`);
        setNodes(elements.nodes);
        setEdges(elements.edges);
        setError(null);
        
        // 设置视图 - 增加填充和持续时间
        setTimeout(() => {
          try {
            console.log("适配视图大小");
            fitView({ 
              padding: 0.5,  // 增加填充
              duration: options.animationDuration || 800,  // 增加动画持续时间
              minZoom: 0.5,  // 设置最小缩放级别
              maxZoom: 1.5   // 设置最大缩放级别
            });
          } catch (viewError) {
            console.error("适配视图失败:", viewError);
          }
        }, 100);
      } else {
        console.log("无数据，清空节点和边");
        setNodes([]);
        setEdges([]);
      }
    } catch (e) {
      console.error("处理思维导图数据时出错:", e);
      setError("渲染错误");
      setNodes([]);
      setEdges([]);
    }
  }, [data, layout, setNodes, setEdges, fitView, options.animationDuration]);
  
  // 处理节点点击
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (!options.allowNodeClick) return;
    
    try {
      // 找到对应的思维导图节点
      const findMindMapNode = (root: MindMapNode | null, id: string): MindMapNode | null => {
        if (!root) return null;
        if (root.id === id) return root;
        
        if (root.children) {
          for (const child of root.children) {
            const found = findMindMapNode(child, id);
            if (found) return found;
          }
        }
        
        return null;
      };
      
      const mindMapNode = findMindMapNode(data, node.id);
      if (mindMapNode && onNodeClick) {
        onNodeClick(mindMapNode);
      }
    } catch (e) {
      console.error("处理节点点击时出错:", e);
    }
  }, [data, onNodeClick, options.allowNodeClick]);
  
  // 应用深色模式
  useEffect(() => {
    const container = document.querySelector('.react-flow__container');
    if (container) {
      if (isDarkMode) {
        container.classList.add('dark-mode');
      } else {
        container.classList.remove('dark-mode');
      }
    }
  }, [isDarkMode]);
  
  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 text-red-500 p-4">
        <div className="text-center">
          <p className="text-lg font-medium">思维导图加载失败</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }
  
  // 如果没有数据，显示提示信息
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 p-4">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">请生成思维导图</p>
          <p className="text-sm mt-2">输入文本内容并点击"生成思维导图"按钮</p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={options.allowNodeClick ?? true}
        panOnScroll={options.allowPan ?? true}
        zoomOnScroll={options.allowZoom ?? true}
        onViewportChange={(viewport) => {
          console.log("视图变化:", viewport.zoom);
          // 可以在这里处理视图变化事件
        }}
      >
        <Background color={isDarkMode ? '#444' : '#f0f0f0'} gap={16} />
        <Controls showInteractive={false} />
        <Panel position="bottom-right" className="bg-background p-2 rounded-md shadow-sm border text-xs text-muted-foreground">
          使用鼠标滚轮缩放 | 拖动画布移动
        </Panel>
      </ReactFlow>
    </div>
  );
};

// 包装组件以提供ReactFlow上下文
const MindMapViewer: React.FC<MindMapViewerProps> = (props) => {
  return (
    <ReactFlowProvider>
      <MindMapViewerInner {...props} />
    </ReactFlowProvider>
  );
};

export default MindMapViewer; 