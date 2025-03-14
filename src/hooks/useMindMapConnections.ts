
import { useState, useCallback } from 'react';
import { Connection, addEdge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import { toast } from '@/components/ui/use-toast';

export function useMindMapConnections(setEdges: any) {
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds: any) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 }
    }, eds));
    setConnectingNodeId(null);
  }, [setEdges]);

  const startConnecting = useCallback((nodeId: string) => {
    setConnectingNodeId(nodeId);
    toast({
      title: "连接模式",
      description: "点击另一个节点来创建连接",
    });
  }, []);

  const createConnection = useCallback((source: string, target: string) => {
    if (source && target && source !== target) {
      const newEdge = {
        id: `e-${source}-${target}`,
        source,
        target,
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: 'hsl(var(--border))', strokeWidth: 2 }
      };
      setEdges((edges: any) => [...edges, newEdge]);
      return true;
    }
    return false;
  }, [setEdges]);

  return {
    connectingNodeId,
    setConnectingNodeId,
    onConnect,
    startConnecting,
    createConnection
  };
}
