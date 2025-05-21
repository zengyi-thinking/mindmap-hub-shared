import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// 初始化mermaid配置
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  mindmap: {
    padding: 50,     // 内边距
    useMaxWidth: false, // 允许图表扩展到最大宽度
  },
  logLevel: 'debug', // 增加日志级别
});

// 记录mermaid版本初始化情况
console.log('Mermaid已初始化');

interface MermaidMindMapProps {
  /**
   * Mermaid 图表定义语法
   */
  definition: string;
  /**
   * 点击节点时的回调函数
   * @param nodeId 节点的ID
   * @param nodeText 节点的文本内容
   */
  onNodeClick?: (nodeId: string, nodeText: string) => void;
  /**
   * 自定义CSS类名
   */
  className?: string;
  /**
   * 图表最大宽度
   */
  maxWidth?: string | number;
  /**
   * 图表最大高度
   */
  maxHeight?: string | number;
}

/**
 * Mermaid思维导图组件
 * 用于渲染基于Mermaid语法的思维导图
 */
const MermaidMindMap: React.FC<MermaidMindMapProps> = ({
  definition,
  onNodeClick,
  className = '',
  maxWidth = '100%',
  maxHeight = '100%'
}) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  // 存储节点事件监听器的引用
  const clickListenersRef = useRef<Map<Element, (e: Event) => void>>(new Map());

  // 记录组件状态的调试函数
  const logComponentState = () => {
    console.log('MermaidMindMap组件状态:', {
      hasSvg: !!svg,
      hasError: !!error,
      definitionLength: definition?.length || 0,
      listenerCount: clickListenersRef.current.size,
      mermaidRefExists: !!mermaidRef.current,
    });
  };

  useEffect(() => {
    console.log('MermaidMindMap - definition改变，开始渲染...');
    
    const renderMermaid = async () => {
      if (!definition) {
        console.warn('MermaidMindMap - 没有提供definition，跳过渲染');
        return;
      }
      
      try {
        setError(null);
        console.log('MermaidMindMap - 处理的definition:', definition.substring(0, 100) + (definition.length > 100 ? '...' : ''));
        
        // 确保定义以mindmap开头
        const validDefinition = definition.trim().startsWith('mindmap') 
          ? definition 
          : `mindmap\n${definition}`;
        
        console.log('MermaidMindMap - 开始渲染...');
        
        try {
          // 一个唯一的ID，确保不会与页面上的其他元素冲突
          const uniqueDiagramId = `mermaid-diagram-${Math.random().toString(36).substring(2, 11)}`;
          
          // 使用mermaid API渲染图表
          const { svg } = await mermaid.render(uniqueDiagramId, validDefinition);
          console.log('MermaidMindMap - 渲染成功, SVG长度:', svg.length);
          setSvg(svg);
        } catch (renderErr) {
          console.error('MermaidMindMap - 渲染失败:', renderErr);
          throw renderErr;
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : '渲染思维导图时出错');
      }
    };

    // 先清理之前的事件监听器
    clearNodeListeners();
    
    // 开始渲染
    renderMermaid();
    
    // 组件卸载时清理所有事件监听器
    return () => {
      console.log('MermaidMindMap - 组件卸载，清理监听器...');
      clearNodeListeners();
    };
  }, [definition]);
  
  // 清理所有节点事件监听器的函数
  const clearNodeListeners = () => {
    console.log(`MermaidMindMap - 清理事件监听器，数量: ${clickListenersRef.current.size}`);
    
    // 移除之前存储的所有事件监听器
    if (clickListenersRef.current.size > 0) {
      clickListenersRef.current.forEach((listener, node) => {
        try {
          node.removeEventListener('click', listener);
        } catch (err) {
          console.error('移除事件监听器失败:', err, node);
        }
      });
      // 清空Map
      clickListenersRef.current.clear();
      console.log('MermaidMindMap - 所有事件监听器已清理');
    }
  };

  useEffect(() => {
    // 如果有SVG并且需要处理节点点击
    if (svg && onNodeClick && mermaidRef.current) {
      console.log('MermaidMindMap - SVG已生成，准备添加点击事件...');
      const containerEl = mermaidRef.current;
      
      // 为所有节点添加点击事件
      const nodes = containerEl.querySelectorAll('.node');
      console.log(`MermaidMindMap - 找到${nodes.length}个节点，添加点击事件`);
      
      nodes.forEach((node) => {
        // 创建事件监听器函数
        const clickHandler = (e: Event) => {
          e.stopPropagation();
          
          // 安全地获取节点ID和文本
          try {
            const element = e.currentTarget as Element;
            const nodeId = element.id || '';
            const nodeText = element.querySelector('text')?.textContent || '';
            
            console.log(`MermaidMindMap - 节点点击: ${nodeId} - ${nodeText}`);
            
            // 调用点击回调
            if (onNodeClick) {
              onNodeClick(nodeId, nodeText);
            }
          } catch (err) {
            console.error('处理节点点击事件出错:', err);
          }
        };
        
        // 保存监听器引用，以便之后移除
        clickListenersRef.current.set(node, clickHandler);
        
        // 添加事件监听器
        try {
          node.addEventListener('click', clickHandler);
        } catch (err) {
          console.error('添加节点点击事件失败:', err, node);
        }
      });
    }
  }, [svg, onNodeClick]);
  
  // 组件渲染完成后记录状态
  useEffect(() => {
    logComponentState();
  });

  return (
    <div className={`mermaid-container ${className}`} data-testid="mermaid-container">
      {error && (
        <div className="error-message p-4 bg-red-50 text-red-600 rounded border border-red-200">
          <p className="font-semibold">渲染错误</p>
          <p className="text-sm">{error}</p>
          <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-40">
            {definition}
          </pre>
        </div>
      )}
      
      {!error && (
        <div
          ref={mermaidRef}
          className="mermaid-diagram"
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
      )}
    </div>
  );
};

export default MermaidMindMap; 