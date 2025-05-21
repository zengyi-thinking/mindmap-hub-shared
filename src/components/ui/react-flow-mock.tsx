import React, { useState, useCallback, useRef, useEffect } from 'react';

// 定义简单的模拟类型
export interface Node {
  id: string;
  position: { x: number; y: number };
  data: any;
  type?: string;
  style?: React.CSSProperties;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  markerEnd?: string;
}

export interface ReactFlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onNodeDragStop?: (event: React.MouseEvent, node: Node) => void;
  onConnect?: (params: any) => void;
  onNodeDoubleClick?: (event: React.MouseEvent, node: Node) => void;
  nodeTypes?: Record<string, React.ComponentType<any>>;
  edgeTypes?: Record<string, React.ComponentType<any>>;
  fitView?: boolean;
  defaultEdgeOptions?: any;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  nodesDraggable?: boolean;
  elementsSelectable?: boolean;
  zoomOnScroll?: boolean;
  panOnScroll?: boolean;
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  attributionPosition?: string;
}

// 模拟版本的ReactFlow组件
export const ReactFlow: React.FC<ReactFlowProps> = ({ 
  nodes, 
  edges,
  onNodeClick, 
  onNodeDoubleClick,
  className,
  children,
  style,
  fitView = false,
  minZoom = 0.2,
  maxZoom = 2,
  defaultZoom = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: defaultZoom });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // 计算节点的中心位置
  const getNodeCenter = (node: Node): { x: number, y: number } => {
    const nodeElement = document.getElementById(`node-${node.id}`);
    if (nodeElement) {
      const width = nodeElement.offsetWidth;
      const height = nodeElement.offsetHeight;
      return {
        x: node.position.x + width / 2,
        y: node.position.y + height / 2
      };
    }
    // 如果DOM元素不存在，使用估计值
    return {
      x: node.position.x + 60, // 假设节点宽度约为120px
      y: node.position.y + 25  // 假设节点高度约为50px
    };
  };
  
  // 根据节点ID查找节点
  const findNodeById = (id: string): Node | undefined => {
    return nodes.find(node => node.id === id);
  };
  
  // 自动适应视图(fitView)
  useEffect(() => {
    if (fitView && containerRef.current && nodes.length > 0) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // 计算节点边界
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      nodes.forEach(node => {
        const x = node.position.x;
        const y = node.position.y;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + 120); // 估计节点宽度
        maxY = Math.max(maxY, y + 50);  // 估计节点高度
      });
      
      // 添加边距
      const padding = 100;
      minX -= padding;
      minY -= padding;
      maxX += padding;
      maxY += padding;
      
      // 计算需要的缩放比例
      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;
      const scaleX = containerWidth / graphWidth;
      const scaleY = containerHeight / graphHeight;
      const scale = Math.min(scaleX, scaleY, 1); // 不要放大超过原始大小
      
      // 计算平移以居中
      const centerX = minX + graphWidth / 2;
      const centerY = minY + graphHeight / 2;
      const containerCenterX = containerWidth / 2;
      const containerCenterY = containerHeight / 2;
      
      setTransform({
        x: containerCenterX - centerX * scale,
        y: containerCenterY - centerY * scale,
        scale: scale
      });
    }
  }, [nodes, fitView]);
  
  // 处理鼠标按下事件 - 开始拖动
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button === 0) { // 主鼠标按钮
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  }, []);
  
  // 处理鼠标移动事件 - 拖动视图
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isDragging) {
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;
      
      setTransform(prev => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  }, [isDragging, dragStart]);
  
  // 处理鼠标释放事件 - 结束拖动
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // 处理鼠标离开事件 - 结束拖动
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // 处理鼠标滚轮事件 - 缩放视图
  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    
    // 获取鼠标在容器中的位置
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // 计算鼠标相对于转换后坐标系的位置
    const x = (mouseX - transform.x) / transform.scale;
    const y = (mouseY - transform.y) / transform.scale;
    
    // 计算新的缩放比例
    const delta = event.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(transform.scale * delta, minZoom), maxZoom);
    
    // 根据鼠标位置调整平移，使鼠标下的点保持不动
    const newX = mouseX - x * newScale;
    const newY = mouseY - y * newScale;
    
    setTransform({
      x: newX,
      y: newY,
      scale: newScale
    });
  }, [transform, minZoom, maxZoom]);
  
  // 内部缩放函数
  const zoomIn = () => {
    setTransform(prev => {
      const newScale = Math.min(prev.scale * 1.2, maxZoom);
      return {
        ...prev,
        scale: newScale
      };
    });
  };
  
  const zoomOut = () => {
    setTransform(prev => {
      const newScale = Math.max(prev.scale * 0.8, minZoom);
      return {
        ...prev,
        scale: newScale
      };
    });
  };
  
  const resetZoom = () => {
    setTransform(prev => ({
      ...prev,
      scale: defaultZoom
    }));
  };
  
  // 为ReactFlow组件实例提供方法
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__reactFlowInstance = {
        zoomIn,
        zoomOut,
        resetZoom,
        getTransform: () => transform
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__reactFlowInstance;
      }
    };
  }, [transform]);
  
  return (
    <div 
      ref={containerRef}
      className={`react-flow ${className || ''}`} 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        ...style
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
    >
      <div 
        className="react-flow-renderer" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%' 
        }}
      >
        <div 
          className="react-flow-viewport" 
          style={{ 
            position: 'relative', 
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            width: '100%',
            height: '100%'
          }}
        >
          {/* 绘制连接线 */}
          <div className="react-flow-edges">
            {edges.map(edge => {
              const sourceNode = findNodeById(edge.source);
              const targetNode = findNodeById(edge.target);
              
              if (!sourceNode || !targetNode) return null;
              
              // 计算连接线的起点和终点
              const sourceCenter = getNodeCenter(sourceNode);
              const targetCenter = getNodeCenter(targetNode);
              
              // 计算直线长度和角度
              const dx = targetCenter.x - sourceCenter.x;
              const dy = targetCenter.y - sourceCenter.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * 180 / Math.PI;
              
              // 控制点偏移量（用于创建曲线）
              const controlPointOffset = distance * 0.2;
              
              // 生成SVG路径
              let path = '';
              
              if (edge.type === 'smoothstep') {
                // 平滑曲线路径
                const sourceX = sourceCenter.x;
                const sourceY = sourceCenter.y;
                const targetX = targetCenter.x;
                const targetY = targetCenter.y;
                
                // 计算控制点
                const midX = (sourceX + targetX) / 2;
                const midY = (sourceY + targetY) / 2;
                
                path = `M ${sourceX} ${sourceY} 
                        Q ${midX} ${sourceY}, ${midX} ${midY} 
                        Q ${midX} ${targetY}, ${targetX} ${targetY}`;
              } else {
                // 默认使用简单曲线
                const sourceX = sourceCenter.x;
                const sourceY = sourceCenter.y;
                const targetX = targetCenter.x;
                const targetY = targetCenter.y;
                
                path = `M ${sourceX} ${sourceY} 
                        C ${sourceX + controlPointOffset} ${sourceY}, 
                          ${targetX - controlPointOffset} ${targetY}, 
                          ${targetX} ${targetY}`;
              }
              
              return (
                <div 
                  key={edge.id}
                  className="react-flow-edge"
                  style={{
                    position: 'absolute',
                    zIndex: 0,
                    pointerEvents: 'none',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0
                  }}
                >
                  <svg 
                    width="100%" 
                    height="100%" 
            style={{
              position: 'absolute',
                      top: 0, 
                      left: 0, 
                      overflow: 'visible',
                      pointerEvents: 'none'
                    }}
                  >
                    <defs>
                      <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                      </marker>
                    </defs>
                    <path 
                      d={path}
                      stroke={edge.style?.stroke || "#b1b1b7"}
                      strokeWidth={edge.style?.strokeWidth || 2}
                      strokeOpacity={edge.style?.opacity || 0.8}
                      fill="none"
                      markerEnd={edge.markerEnd || "url(#arrow)"}
                      className={edge.animated ? "react-flow-edge-animated" : ""}
                    />
                  </svg>
                </div>
              );
            })}
          </div>
          
          {/* 绘制节点 */}
          <div className="react-flow-nodes">
            {nodes.map(node => {
              // 默认节点样式
              const defaultStyle = {
                position: 'absolute',
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
                padding: '12px 16px',
                boxSizing: 'border-box',
                border: '1px solid #ddd',
                borderRadius: '8px',
              background: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: '120px',
                minHeight: '50px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#333',
                zIndex: 5,
                overflow: 'hidden',
              };
              
              // 合并默认样式和节点自定义样式
              const mergedStyle = { ...defaultStyle, ...node.style };
              
              return (
                <div 
                  id={`node-${node.id}`}  // 添加ID以便后续查找
                  key={node.id}
                  className={`react-flow-node ${node.type || 'default'}`}
                  style={mergedStyle}
            onClick={(e) => onNodeClick && onNodeClick(e, node)}
            onDoubleClick={(e) => onNodeDoubleClick && onNodeDoubleClick(e, node)}
          >
                  <div style={{ 
                    padding: '2px', 
                    textAlign: 'center', 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                  }}>
            {node.data.label || node.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="react-flow-panels">
      {children}
      </div>
    </div>
  );
};

// 背景组件
export const Background: React.FC<{
  variant?: string;
  gap?: number;
  size?: number;
  color?: string;
  className?: string;
}> = ({ 
  variant = 'dots', 
  gap = 15, 
  size = 1, 
  color = '#f8f8f8',
  className
}) => {
  const getDotBackground = () => {
    return `
      radial-gradient(circle at ${gap/2}px ${gap/2}px, ${color} ${size}px, transparent ${size}px)
    `;
  };
  
  const getLinesBackground = () => {
    return `
      linear-gradient(to right, ${color} ${size}px, transparent ${size}px),
      linear-gradient(to bottom, ${color} ${size}px, transparent ${size}px)
    `;
  };
  
  const getBackground = () => {
    if (variant === 'dots' || variant === 'BackgroundVariant.Dots') {
      return getDotBackground();
    }
    return getLinesBackground();
  };

  return (
    <div 
      className={`react-flow-background ${className || ''}`}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: getBackground(),
        backgroundSize: `${gap}px ${gap}px`,
      }}
    />
  );
};

// 控制组件
export const Controls: React.FC<{
  position?: string;
  style?: React.CSSProperties;
  showInteractive?: boolean;
  className?: string;
}> = ({ 
  position = 'bottom-right',
  style = {},
  showInteractive = true,
  className 
}) => {
  // 计算位置样式
  const getPositionStyle = () => {
    switch (position) {
      case 'top-right':
        return { top: 10, right: 10 };
      case 'bottom-left':
        return { bottom: 10, left: 10 };
      case 'top-left':
        return { top: 10, left: 10 };
      default: // bottom-right
        return { bottom: 10, right: 10 };
    }
  };
  
  // 处理缩放控制
  const handleZoomIn = () => {
    if (typeof window !== 'undefined' && (window as any).__reactFlowInstance) {
      (window as any).__reactFlowInstance.zoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (typeof window !== 'undefined' && (window as any).__reactFlowInstance) {
      (window as any).__reactFlowInstance.zoomOut();
    }
  };
  
  const handleResetZoom = () => {
    if (typeof window !== 'undefined' && (window as any).__reactFlowInstance) {
      (window as any).__reactFlowInstance.resetZoom();
    }
  };

  return (
    <div 
      className={`react-flow-controls ${className || ''}`}
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '5px',
        zIndex: 5,
        ...getPositionStyle(),
        ...style
      }}
    >
      <button 
        className="react-flow-button"
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={handleZoomIn}
      >
        +
      </button>
      <button 
        className="react-flow-button"
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={handleZoomOut}
      >
        -
      </button>
      <button 
        className="react-flow-button"
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={handleResetZoom}
      >
        ⟳
      </button>
    </div>
  );
};

// 类型定义导出
export enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross'
}

export enum MarkerType {
  Arrow = 'arrow',
  ArrowClosed = 'arrowclosed'
}

export type { Node, Edge };

// MiniMap 组件
export const MiniMap: React.FC<{
  className?: string;
  nodeColor?: string;
  maskColor?: string;
}> = ({ 
  className
}) => {
  return (
    <div 
      className={`react-flow-minimap ${className || ''}`}
      style={{ 
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: '120px',
        height: '80px',
        background: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '5px'
      }}
    >
      <div style={{ padding: '5px', fontSize: '9px' }}>MiniMap</div>
    </div>
  );
};

// Panel 组件
export const Panel: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  children?: React.ReactNode;
}> = ({ 
  position = 'top-left',
  className,
  children
}) => {
  // 计算位置样式
  const getPositionStyle = () => {
    switch (position) {
      case 'top-right':
        return { top: 10, right: 10 };
      case 'bottom-left':
        return { bottom: 10, left: 10 };
      case 'bottom-right':
        return { bottom: 10, right: 10 };
      default: // top-left
        return { top: 10, left: 10 };
    }
  };

  return (
    <div 
      className={`react-flow-panel ${className || ''}`}
      style={{ 
        position: 'absolute',
        zIndex: 5,
        ...getPositionStyle()
      }}
    >
      {children}
    </div>
  );
};

// 导出EdgeTypes类型
export type EdgeTypes = Record<string, React.ComponentType<any>>;

// 导出ReactFlowProvider (空实现)
export const ReactFlowProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  return <>{children}</>;
};

// Hook模拟
export const useReactFlow = () => {
  return {
    project: (position: {x: number, y: number}) => position,
    getZoom: () => {
      if (typeof window !== 'undefined' && (window as any).__reactFlowInstance) {
        return (window as any).__reactFlowInstance.getTransform().scale;
      }
      return 1;
    },
    getNodes: () => [],
    getEdges: () => [],
    getNode: (id: string) => null,
    getEdge: (id: string) => null,
    setNodes: (nodes: Node[]) => {},
    setEdges: (edges: Edge[]) => {},
    addNodes: (nodes: Node[]) => {},
    addEdges: (edges: Edge[]) => {},
    fitView: () => {},
    zoomIn: () => {
      if (typeof window !== 'undefined' && (window as any).__reactFlowInstance) {
        (window as any).__reactFlowInstance.zoomIn();
      }
    },
    zoomOut: () => {
      if (typeof window !== 'undefined' && (window as any).__reactFlowInstance) {
        (window as any).__reactFlowInstance.zoomOut();
      }
    },
    zoomTo: (zoom: number) => {},
  };
}; 