/**
 * 桥接文件 - MindMapEdge组件
 * 此文件作为桥接，提供简单的实现
 */

import React from 'react';
import { EdgeProps, BaseEdge, getBezierPath } from '@xyflow/react';

// 简单的MindMapEdge组件
const MindMapEdge: React.FC<EdgeProps> = (props) => {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {} } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge 
      path={edgePath} 
      style={{
        stroke: 'hsl(var(--primary))',
        strokeWidth: 2,
        ...style
      }}
      {...props}
    />
  );
};

export default MindMapEdge; 