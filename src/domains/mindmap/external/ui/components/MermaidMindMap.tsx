/**
 * 通用Mermaid思维导图组件
 * 这是外部UI层的基础组件，用于渲染Mermaid格式的思维导图
 */

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// 初始化Mermaid配置
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    htmlLabels: true,
    curve: 'basis'
  },
  fontSize: 14
});

interface MermaidMindMapProps {
  /**
   * Mermaid 图表定义
   */
  definition: string;
  /**
   * 思维导图容器的CSS类名
   */
  className?: string;
  /**
   * 思维导图的唯一ID
   */
  id?: string;
  /**
   * 点击节点时的回调
   */
  onNodeClick?: (nodeId: string, nodeText: string) => void;
  /**
   * 缩放比例，百分比
   */
  zoom?: number;
  /**
   * 图表高度
   */
  height?: string;
  /**
   * 容器宽度
   */
  width?: string;
}

/**
 * 基于 Mermaid 的思维导图组件
 */
const MermaidMindMap: React.FC<MermaidMindMapProps> = ({
  definition,
  className = '',
  id = 'mermaid-diagram',
  onNodeClick,
  zoom = 100,
  height = "auto",
  width = '100%'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  
  // 使用useRef保存渲染是否完成的状态
  const renderingDone = useRef(false);

  useEffect(() => {
    renderingDone.current = false;
    
    // 初始化Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: false, // 允许流程图充分利用宽度
        htmlLabels: true,
        curve: 'basis', // 使用平滑曲线
      },
      fontFamily: 'system-ui, sans-serif',
    });

    try {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        mermaid.render('mermaid-diagram', definition).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            
            // 添加节点点击事件
            setTimeout(() => {
              setupNodeClickHandlers();
              renderingDone.current = true;
              
              // 修复SVG中的stroke和path，确保连接线正确显示
              enhanceMermaidSvg();
            }, 100);
          }
        });
      }
    } catch (err) {
      console.error('思维导图渲染出错:', err);
      setError('渲染思维导图时出错');
    }
  }, [definition]);
  
  // 修复Mermaid生成的SVG
  const enhanceMermaidSvg = () => {
    if (!containerRef.current) return;
    
    // 获取所有的边线元素(path)
    const paths = containerRef.current.querySelectorAll('path:not(.node)');
    const edgeLines = containerRef.current.querySelectorAll('.edge');
    
    // 增强连接线的可见性
    paths.forEach(path => {
      // 确保path有stroke属性
      if (!path.hasAttribute('stroke') || path.getAttribute('stroke') === 'none') {
        path.setAttribute('stroke', '#999');
      }
      // 设置线宽
      path.setAttribute('stroke-width', '1.5');
      // 确保线条可见
      path.setAttribute('opacity', '1');
    });
    
    // 增强边线元素
    edgeLines.forEach(edge => {
      // 确保边线可见
      edge.setAttribute('opacity', '1');
    });
    
    // 修复文本对齐
    const texts = containerRef.current.querySelectorAll('text');
    texts.forEach(text => {
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('text-anchor', 'middle');
    });
  };
  
  // 设置节点点击事件
  const setupNodeClickHandlers = () => {
    if (!containerRef.current || !onNodeClick) return;

    // 获取所有节点元素
    const nodes = containerRef.current.querySelectorAll('.node');
    
    nodes.forEach(node => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // 获取节点ID
        const nodeId = node.id || '';
        
        // 获取节点文本内容
        let nodeText = '';
        const textElement = node.querySelector('span.nodeLabel');
        if (textElement) {
          nodeText = textElement.textContent || '';
        }
        
        // 调用回调
        onNodeClick(nodeId, nodeText);
      });
    });
  };
  
  // 处理平移开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // 左键
      setIsPanning(true);
      setStartPan({ x: e.clientX, y: e.clientY });
    }
  };
  
  // 处理平移移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - startPan.x;
      const dy = e.clientY - startPan.y;
      setPanPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      setStartPan({ x: e.clientX, y: e.clientY });
    }
  };
  
  // 处理平移结束
  const handleMouseUp = () => {
    setIsPanning(false);
  };
  
  // 处理鼠标离开
  const handleMouseLeave = () => {
    setIsPanning(false);
  };
  
  // 添加样式，确保连接线正确显示
  const mermaidStyles = `
    .mindmap-container .node polygon,
    .mindmap-container .node rect,
    .mindmap-container .node circle,
    .mindmap-container .node ellipse {
      fill-opacity: 1 !important;
      stroke-width: 1.5px !important;
    }
    
    .mindmap-container .edge path,
    .mindmap-container .edge polygon {
      stroke-width: 1.5px !important;
      stroke-opacity: 1 !important;
      fill-opacity: 1 !important;
    }
    
    .mindmap-container .edgePath {
      stroke-width: 1.5px !important;
      opacity: 1 !important;
    }
    
    .mindmap-container .node:hover {
      opacity: 0.8;
      cursor: pointer;
    }
    
    .mindmap-container .edge:hover path {
      stroke-width: 2.5px !important;
    }
    
    /* 添加额外的连接线样式 */
    .mindmap-container line {
      stroke: #999 !important;
      stroke-width: 1.5px !important;
      opacity: 1 !important;
    }
    
    /* 确保箭头可见 */
    .mindmap-container marker path {
      fill: #999 !important;
      stroke: none !important;
    }
    
    /* 改进节点标签可读性 */
    .mindmap-container .nodeLabel {
      font-family: system-ui, sans-serif;
      font-size: 14px;
      font-weight: 400;
      fill: #333;
      white-space: nowrap;
    }
  `;

  return (
    <div style={{ position: 'relative', height: height, overflow: 'hidden' }}>
      <style>{mermaidStyles}</style>
      <div 
        style={{ 
          cursor: isPanning ? 'grabbing' : 'grab',
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'auto'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          style={{
            transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom / 100})`,
            transformOrigin: 'center',
            transition: 'transform 0.05s linear',
            display: 'inline-block'
          }}
        >
          <div 
            ref={containerRef} 
            className="mindmap-container" 
            style={{ 
              display: 'inline-block',
              minWidth: '300px',
              minHeight: '200px',
              textAlign: 'center'
            }}
          />
        </div>
      </div>
      {error && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.8)',
            color: 'red',
            padding: '20px'
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default MermaidMindMap; 