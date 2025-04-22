import React, { CSSProperties } from 'react';
import { 
  EdgeProps, 
  getSmoothStepPath, 
  EdgeLabelRenderer,
  BaseEdge
} from '@xyflow/react';
import { useTheme } from '@/contexts/ThemeContext';

const MindMapEdge: React.FC<EdgeProps> = ({ 
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  data
}) => {
  const { darkMode } = useTheme();
  
  // 为不同类型的连接设置不同样式
  let edgeStyle: CSSProperties = {
    strokeWidth: selected ? 3 : 2,
    stroke: selected 
      ? darkMode ? '#60a5fa' : '#3b82f6' 
      : darkMode ? '#6b7280' : '#9ca3af',
    transition: 'stroke 0.3s, stroke-width 0.3s',
    ...style,
  };
  
  let labelBg = darkMode ? '#374151' : 'white';
  let labelColor = darkMode ? '#e5e7eb' : '#1f2937';

  // 如果提供了自定义颜色，使用它
  if (data?.color) {
    edgeStyle.stroke = data.color;
  }
  
  // 获取平滑路径
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16, // 圆角程度
  });

  return (
    <>
      <BaseEdge 
        id={id}
        path={edgePath} 
        style={edgeStyle} 
        markerEnd={markerEnd}
        className={selected ? 'animated-dash' : ''}
      />
      
      {/* 如果有标签，显示它 */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              background: labelBg,
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: 12,
              fontWeight: 500,
              color: labelColor,
              border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              zIndex: 10
            }}
            className="nodrag nopan transition-all duration-300 hover:shadow-md"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default MindMapEdge; 