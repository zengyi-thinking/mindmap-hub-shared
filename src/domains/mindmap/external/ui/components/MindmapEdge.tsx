import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath, getStraightPath, EdgeLabelRenderer } from '@xyflow/react';

// 扩展边的数据类型
interface EdgeData {
  label?: string;
  sourceType?: 'central' | 'tag' | 'material';
  targetType?: 'central' | 'tag' | 'material';
  level?: number;
  isTreeLayout?: boolean;
  [key: string]: any;
}

export const MindmapEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  source,
  target,
}: EdgeProps) => {
  // 检查是否使用树状布局
  const isTreeLayout = data?.isTreeLayout || false;
  const level = data?.level || 0;
  
  // 根据是否为树状布局，使用不同的路径计算
  let edgePath = '';
  let labelX = 0;
  let labelY = 0;
  
  if (isTreeLayout) {
    // 为树状布局使用直线路径，但增加了偏移，使其看起来像阶梯式连接
    // 计算中间点以形成阶梯
    const midY = sourceY + (targetY - sourceY) / 2;
    
    // 创建直角连接线
    edgePath = `M${sourceX},${sourceY} L${sourceX},${midY} L${targetX},${midY} L${targetX},${targetY}`;
    
    // 计算标签位置
    labelX = (sourceX + targetX) / 2;
    labelY = midY;
  } else {
    // 使用默认的贝塞尔曲线
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature: 0.4, // 增加曲率，使曲线更加平滑
    });
  }

  // 根据节点级别或类型设置边的样式
  const getEdgeStyle = () => {
    // 默认样式
    let edgeStyle = {
      strokeWidth: 2,
      stroke: 'hsl(var(--primary))',
      opacity: 0.8,
      ...style,
    };

    // 如果有数据，根据级别设置不同颜色
    if (data) {
      // 根据级别设置不同的颜色
      if (data.sourceType === 'central') {
        edgeStyle.stroke = 'hsl(var(--primary))';
        edgeStyle.strokeWidth = 3;
        edgeStyle.opacity = 0.9;
      } else if (level === 1 || data.sourceType === 'tag' && data.targetType === 'tag') {
        edgeStyle.stroke = 'hsl(217, 91%, 60%)'; // blue-500
        edgeStyle.strokeWidth = 2.5;
      } else if (level === 2 || data.sourceType === 'tag' && data.targetType === 'material') {
        edgeStyle.stroke = 'hsl(244, 63%, 50%)'; // indigo-500
        edgeStyle.strokeWidth = 2;
      } else {
        edgeStyle.stroke = 'hsl(var(--primary))';
        edgeStyle.opacity = 0.7;
      }
      
      // 树状布局的线条样式
      if (isTreeLayout) {
        edgeStyle.strokeDasharray = level === 1 ? '' : '3,3';
      }
    }

    return edgeStyle;
  };

  // 自定义边标签
  const renderLabel = () => {
    if (!data?.label) return null;

    return (
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
            backgroundColor: 'white',
            padding: '4px 8px',
            borderRadius: 12,
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif'
          }}
          className="nodrag nopan"
        >
          {String(data.label)}
        </div>
      </EdgeLabelRenderer>
    );
  };

  // 构建类名，包括树状布局的特殊样式
  const className = [
    'animated-edge',
    isTreeLayout ? 'tree-edge' : '',
    `level-${level}`
  ].filter(Boolean).join(' ');

  return (
    <>
      <path
        id={id}
        d={edgePath}
        style={getEdgeStyle()}
        markerEnd={markerEnd}
        className={className}
        strokeLinecap="round"
        fill="none"
      />
      {/* 如果有标签，则渲染标签 */}
      {data?.label && renderLabel()}
    </>
  );
}; 