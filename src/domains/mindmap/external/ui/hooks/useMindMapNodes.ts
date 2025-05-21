import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MindMapNode, MindMapEdge } from '@/modules/mindmap/bridges/types';
import { Material } from '@/modules/materials/types/materials';

/**
 * 思维导图节点操作Hook
 * 提供添加、删除、更新和管理节点的方法
 */
export function useMindMapNodes(
  setNodes: React.Dispatch<React.SetStateAction<MindMapNode[]>>,
  setEdges: React.Dispatch<React.SetStateAction<MindMapEdge[]>>
) {
  /**
   * 添加新节点
   */
  const addNode = useCallback(
    (
      reactFlowInstance: any,
      reactFlowWrapper: React.RefObject<HTMLDivElement>,
      parent: MindMapNode | null
    ) => {
      if (!reactFlowInstance) return null;

      const center = reactFlowInstance.project({
        x: (reactFlowWrapper.current?.getBoundingClientRect().width || 500) / 2,
        y: (reactFlowWrapper.current?.getBoundingClientRect().height || 400) / 2,
      });

      // 生成唯一ID
      const id = `node-${uuidv4()}`;

      // 创建新节点
      const newNode: MindMapNode = {
        id,
        position: { x: center.x, y: center.y },
        type: 'mindMapNode',
        data: { label: '新节点' },
        style: { background: '#ffffff' },
      };

      // 更新状态添加新节点
      setNodes((nodes) => [...nodes, newNode]);

      // 如果有父节点，创建连接线
      if (parent) {
        const newEdge: MindMapEdge = {
          id: `edge-${uuidv4()}`,
          source: parent.id,
          target: id,
          type: 'smoothstep',
          animated: false,
        };

        setEdges((edges) => [...edges, newEdge]);
      }

      return newNode;
    },
    [setNodes, setEdges]
  );

  /**
   * 删除节点及其连接的边
   */
  const deleteNode = useCallback(
    (node: MindMapNode | null) => {
      if (!node) return false;

      setNodes((nodes) => nodes.filter((n) => n.id !== node.id));
      setEdges((edges) =>
        edges.filter((e) => e.source !== node.id && e.target !== node.id)
      );

      return true;
    },
    [setNodes, setEdges]
  );

  /**
   * 更新节点属性
   */
  const updateNode = useCallback(
    (
      node: MindMapNode | null,
      name: string,
      notes: string,
      color: string,
      icon: string,
      url: string
    ) => {
      if (!node) return false;

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: {
                ...n.data,
                label: name,
                notes,
                icon,
                url,
              },
              style: {
                ...n.style,
                background: color,
              },
            };
          }
          return n;
        })
      );

      return true;
    },
    [setNodes]
  );

  /**
   * 附加资料到节点
   */
  const attachMaterials = useCallback(
    (node: MindMapNode | null, materials: Material[]) => {
      if (!node) return false;

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: {
                ...n.data,
                materials: materials,
              },
            };
          }
          return n;
        })
      );

      return true;
    },
    [setNodes]
  );

  return {
    addNode,
    deleteNode,
    updateNode,
    attachMaterials,
  };
} 