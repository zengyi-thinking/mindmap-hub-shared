import { Node } from '@xyflow/react';
import { NodeLevel, NodeType } from './types';

/**
 * 创建中心节点
 */
export function createCentralNode(
  id: string, 
  label: string,
  position: { x: number; y: number },
  width: number,
  height: number
): Node {
  return {
    id,
    data: { 
      label,
      type: 'central' as NodeType,
      level: 0 as NodeLevel 
    },
    position,
    style: {
      width,
      height,
    },
    type: 'mindmap',
  };
}

/**
 * 创建标签节点
 */
export function createTagNode(
  id: string,
  label: string,
  position: { x: number; y: number },
  level: NodeLevel,
  width: number,
  height: number
): Node {
  return {
    id,
    data: { 
      label,
      type: 'tag' as NodeType,
      level 
    },
    position,
    style: {
      width,
      height,
    },
    type: 'mindmap',
  };
}

/**
 * 创建材料节点
 */
export function createMaterialNode(
  id: string,
  label: string,
  materialId: string,
  position: { x: number; y: number },
  level: NodeLevel,
  width: number,
  height: number
): Node {
  return {
    id,
    data: { 
      label,
      type: 'material' as NodeType,
      level,
      materialId 
    },
    position,
    style: {
      width,
      height,
    },
    type: 'mindmap',
  };
} 