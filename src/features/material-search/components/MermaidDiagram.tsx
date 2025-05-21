import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Box, IconButton, Typography, Tooltip } from '@mui/material';
import mermaid from 'mermaid';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface MermaidDiagramProps {
  chartDefinition: string;
  onNodeClick?: (nodeId: string) => void;
  className?: string;
}

/**
 * Mermaid图表组件
 * 用于渲染mermaid图表，包括思维导图
 */
const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chartDefinition,
  onNodeClick,
  className = ''
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!chartDefinition) return;
    
    try {
      // 初始化mermaid配置
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'sans-serif'
      });
      
      // 清空容器
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        
        // 生成图表
        mermaid.render('mermaid-diagram', chartDefinition).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            
            // 添加节点点击事件处理
            if (onNodeClick) {
              const nodes = containerRef.current.querySelectorAll('.node');
              nodes.forEach(node => {
                node.addEventListener('click', (event) => {
                  const nodeId = node.id || '';
                  onNodeClick(nodeId);
                  event.stopPropagation();
                });
              });
            }
          }
        }).catch(err => {
          console.error('Mermaid渲染错误:', err);
          setError(`图表渲染错误: ${err.message || String(err)}`);
        });
      }
    } catch (err: any) {
      console.error('Mermaid初始化错误:', err);
      setError(`图表初始化错误: ${err.message || String(err)}`);
    }
  }, [chartDefinition, onNodeClick]);
  
  // 放大图表
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  // 缩小图表
  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // 重置缩放
  const resetZoom = () => {
    setZoom(1);
  };
  
  // 复制图表定义
  const copyDefinition = () => {
    navigator.clipboard.writeText(chartDefinition)
      .then(() => {
        alert('已复制图表定义');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };
  
  return (
    <Card className={className}>
      <CardContent sx={{ position: 'relative', padding: 2 }}>
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
          <Tooltip title="放大">
            <IconButton size="small" onClick={zoomIn}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="缩小">
            <IconButton size="small" onClick={zoomOut}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="重置缩放">
            <IconButton size="small" onClick={resetZoom}>
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="复制图表定义">
            <IconButton size="small" onClick={copyDefinition}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </div>
        
        {error ? (
          <Box sx={{ 
            p: 2, 
            bgcolor: 'error.light', 
            color: 'error.contrastText', 
            borderRadius: 1 
          }}>
            <Typography variant="body2">{error}</Typography>
            <Typography variant="caption">图表定义可能有语法错误，请检查。</Typography>
          </Box>
        ) : (
          <div 
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.3s ease',
              marginTop: '30px'
            }}
          >
            <div 
              ref={containerRef} 
              className="mermaid-container"
              style={{ 
                minHeight: '300px',
                display: 'flex',
                justifyContent: 'center'
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MermaidDiagram; 