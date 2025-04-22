import { useCallback } from 'react';
import { Edge, Connection, addEdge } from '@xyflow/react';

// 此钩子专门处理思维导图中的连接逻辑
export const useMindMapConnections = (
  edges: Edge[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  onEdgeUpdate?: (oldEdge: Edge, newConnection: Connection) => void
) => {
  // 添加新连接
  const onConnect = useCallback(
    (params: Connection) => {
      // 检查是否已存在相同的连接
      const connectionExists = edges.some(
        edge => edge.source === params.source && edge.target === params.target
      );

      if (!connectionExists) {
        // 可以在这里添加连接样式
        const newEdge = {
          ...params,
          type: 'smoothstep', // 使用平滑曲线
          animated: false,
          style: {
            stroke: '#FF3366',
            strokeWidth: 2,
          },
        };
        
        setEdges(eds => addEdge(newEdge, eds));
      }
    },
    [edges, setEdges]
  );

  // 更新现有连接
  const handleEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      // 允许自定义处理更新
      if (onEdgeUpdate) {
        onEdgeUpdate(oldEdge, newConnection);
        return;
      }

      // 默认更新逻辑
      setEdges(prevEdges => {
        const updatedEdges = prevEdges.filter(e => e.id !== oldEdge.id);
        const newEdge = {
          ...oldEdge,
          source: newConnection.source || oldEdge.source,
          target: newConnection.target || oldEdge.target,
          sourceHandle: newConnection.sourceHandle,
          targetHandle: newConnection.targetHandle,
        };
        
        return [...updatedEdges, newEdge];
      });
    },
    [setEdges, onEdgeUpdate]
  );

  // 删除连接
  const onEdgeDelete = useCallback(
    (edgeId: string) => {
      setEdges(eds => eds.filter(edge => edge.id !== edgeId));
    },
    [setEdges]
  );

  // 通过源节点和目标节点删除连接
  const deleteConnectionByNodes = useCallback(
    (sourceId: string, targetId: string) => {
      setEdges(eds => 
        eds.filter(edge => !(edge.source === sourceId && edge.target === targetId))
      );
    },
    [setEdges]
  );

  // 获取与指定节点相关的所有连接
  const getNodeConnections = useCallback(
    (nodeId: string) => {
      return edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
    },
    [edges]
  );

  return {
    onConnect,
    handleEdgeUpdate,
    onEdgeDelete,
    deleteConnectionByNodes,
    getNodeConnections,
  };
}; 