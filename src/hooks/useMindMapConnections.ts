import { useCallback, useState } from 'react';
import { Edge, Connection, MarkerType } from '@xyflow/react';

/**
 * 思维导图连接钩子
 * 处理节点之间的连接和关系创建
 */
export const useMindMapConnections = (
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) => {
  // 跟踪当前正在连接的节点ID
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  
  // 处理连接创建
  const onConnect = useCallback((params: Connection) => {
    // 防止自连接
    if (params.source === params.target) {
      return;
    }
    
    // 创建新边缘
    const newEdge: Edge = {
      id: `edge-${params.source}-${params.target}`,
      source: params.source!,
      target: params.target!,
      type: 'smoothstep',
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 }
    };
    
    // 添加到边集合
    setEdges(edges => [...edges, newEdge]);
  }, [setEdges]);
  
  /**
   * 开始从指定节点创建连接
   */
  const startConnecting = useCallback((nodeId: string) => {
    setConnectingNodeId(nodeId);
  }, []);
  
  /**
   * 创建节点之间的连接
   */
  const createConnection = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === targetId) {
      return false;
    }
    
    const newEdge: Edge = {
      id: `edge-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: 'smoothstep',
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 }
    };
    
    setEdges(edges => [...edges, newEdge]);
    return true;
  }, [setEdges]);
  
  return {
    connectingNodeId,
    setConnectingNodeId,
    onConnect,
    startConnecting,
    createConnection
  };
};

export default useMindMapConnections;
