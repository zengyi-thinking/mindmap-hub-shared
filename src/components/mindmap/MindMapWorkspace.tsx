
import React from 'react';
import { 
  ReactFlow,
  Background,
  Controls,
  Panel,
  BackgroundVariant,
  NodeTypes,
  Connection
} from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MindMapNode, MindMapEdge } from '@/types/mindmap';
import MaterialNode from '@/components/mindmap/MaterialNode';
import { useNavigate } from 'react-router-dom';

const nodeTypes: NodeTypes = {
  materialNode: MaterialNode
};

interface MindMapWorkspaceProps {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (params: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: MindMapNode) => void;
  onNodeDoubleClick?: (event: React.MouseEvent, node: MindMapNode) => void;
  reactFlowInstance: any;
  setReactFlowInstance: (instance: any) => void;
  mindMapId?: number; // 思维导图ID，用于跳转
  readOnly?: boolean; // 是否只读模式
}

const MindMapWorkspace: React.FC<MindMapWorkspaceProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onNodeDoubleClick,
  reactFlowInstance,
  setReactFlowInstance,
  mindMapId,
  readOnly = false
}) => {
  const navigate = useNavigate();

  // 处理节点双击
  const handleNodeDoubleClick = (event: React.MouseEvent, node: MindMapNode) => {
    // 如果提供了自定义的双击处理函数，使用它
    if (onNodeDoubleClick) {
      onNodeDoubleClick(event, node);
      return;
    }
    
    // 如果节点有URL，优先打开URL
    if (node.data.url) {
      window.open(node.data.url, '_blank');
      return;
    }
    
    // 如果节点有附加资料，导航到资料页面
    if (node.data.materials && node.data.materials.length > 0 && mindMapId) {
      navigate(`/mindmap-materials/${mindMapId}/${node.id}`);
      return;
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onNodeDoubleClick={handleNodeDoubleClick}
      onInit={setReactFlowInstance}
      fitView
      nodeTypes={nodeTypes}
      deleteKeyCode="Delete"
      multiSelectionKeyCode="Control"
      nodesDraggable={!readOnly}
      nodesConnectable={!readOnly}
      elementsSelectable={!readOnly}
    >
      <Background 
        variant={BackgroundVariant.Dots}
        gap={20} 
        size={1} 
        color="hsl(var(--muted-foreground) / 0.3)"
      />
      <Controls 
        position="bottom-right"
        style={{
          borderRadius: '8px',
          backgroundColor: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))'
        }}
      />
      <Panel position="top-right">
        <div className="flex gap-2 bg-background border border-border p-2 rounded-md shadow-sm">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => reactFlowInstance?.zoomIn()}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => reactFlowInstance?.zoomOut()}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => reactFlowInstance?.fitView()}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </Panel>
    </ReactFlow>
  );
};

export default MindMapWorkspace;
