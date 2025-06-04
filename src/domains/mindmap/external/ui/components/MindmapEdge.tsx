import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath, getStraightPath, EdgeLabelRenderer } from '@xyflow/react';

// ��չ�ߵ���������
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
  // ����Ƿ�ʹ����״����
  const isTreeLayout = data?.isTreeLayout || false;
  const level = data?.level || 0;
  
  // �����Ƿ�Ϊ��״���֣�ʹ�ò�ͬ��·������
  let edgePath = '';
  let labelX = 0;
  let labelY = 0;
  
  if (isTreeLayout) {
    // Ϊ��״����ʹ��ֱ��·������������ƫ�ƣ�ʹ�俴���������ʽ����
    // �����м�����γɽ���
    const midY = sourceY + (targetY - sourceY) / 2;
    
    // ����ֱ��������
    edgePath = `M${sourceX},${sourceY} L${sourceX},${midY} L${targetX},${midY} L${targetX},${targetY}`;
    
    // �����ǩλ��
    labelX = (sourceX + targetX) / 2;
    labelY = midY;
  } else {
    // ʹ��Ĭ�ϵı���������
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature: 0.4, // �������ʣ�ʹ���߸���ƽ��
    });
  }

  // ���ݽڵ㼶����������ñߵ���ʽ
  const getEdgeStyle = () => {
    // Ĭ����ʽ
    let edgeStyle = {
      strokeWidth: 2,
      stroke: 'hsl(var(--primary))',
      opacity: 0.8,
      ...style,
    };

    // ��������ݣ����ݼ������ò�ͬ��ɫ
    if (data) {
      // ���ݼ������ò�ͬ����ɫ
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
      
      // ��״���ֵ�������ʽ
      if (isTreeLayout) {
        edgeStyle.strokeDasharray = level === 1 ? '' : '3,3';
      }
    }

    return edgeStyle;
  };

  // �Զ���߱�ǩ
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

  // ����������������״���ֵ�������ʽ
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
      {/* ����б�ǩ������Ⱦ��ǩ */}
      {data?.label && renderLabel()}
    </>
  );
}; 