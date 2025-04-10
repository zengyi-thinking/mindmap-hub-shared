import { Edge, MarkerType } from '@xyflow/react';

/**
 * 创建连接边
 * @param source 源节点ID
 * @param target 目标节点ID
 * @param isAnimated 是否有动画
 * @param isCentral 是否为中心连接
 * @param level 边的层级
 * @returns 连接边
 */
export const createEdge = (
  source: string, 
  target: string, 
  isAnimated: boolean = false,
  isCentral: boolean = false,
  level: number = 1
): Edge => {
  // 根据层级和类型设置不同的边样式
  const getEdgeStyle = () => {
    const baseStyle = {
      stroke: '#FF3366',    // 保持鲜明的红色
      strokeWidth: 5,       // 增加线宽以提高可见性
      opacity: 0.9,         // 提高不透明度
    };
    
    if (isCentral) {
      return {
        ...baseStyle,
        strokeWidth: 6,     // 中心连接更粗
        opacity: 1,
      };
    }
    
    // 层级越深，线条略微细一点，但保持足够可见
    return {
      ...baseStyle,
      strokeWidth: Math.max(3, 5 - (level - 1) * 0.8),
      opacity: Math.max(0.7, 0.9 - (level - 1) * 0.1),
    };
  };
  
  return {
    id: `edge-${source}-${target}`,
    source,
    target,
    animated: isAnimated,
    type: 'smoothstep',     // 使用smoothstep以保持流畅曲线
    style: getEdgeStyle(),
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#FF3366',
      width: 10,             // 更大的箭头
      height: 10,
    },
    // 添加连接线配置，使树结构更清晰
    sourceHandle: 'right',
    targetHandle: 'left',
    // 调整曲线控制点，使连接线更规整
    pathOptions: {
      offset: 20,           // 增加控制点偏移量
      curvature: 0.4        // 增加曲线弯曲程度
    }
  };
};

/**
 * 创建中心节点到一级节点的边
 */
export function createPrimaryEdge(
  sourceId: string,
  targetId: string,
): Edge {
  return {
    id: `${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    type: 'mindmap',
    style: {
      stroke: '#FF3366',
      strokeWidth: 3,
    },
    animated: false,
  };
}

/**
 * 创建一级节点到二级节点的边
 */
export function createSecondaryEdge(
  sourceId: string,
  targetId: string,
): Edge {
  return {
    id: `${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    type: 'mindmap',
    style: {
      stroke: '#3388FF',
      strokeWidth: 2,
    },
    animated: false,
  };
}

/**
 * 根据层级创建边
 */
export function createEdgeByLevel(source: string, target: string, level: number): Edge {
  switch(level) {
    case 0: // 中心到第一级
      return createEdge(source, target, true, true, 1);
    case 1: // 第一级到第二级
      return createEdge(source, target, false, false, 2);
    case 2: // 第二级到第三级
      return createEdge(source, target, false, false, 3);
    default:
      return createEdge(source, target, false, false, level);
  }
} 