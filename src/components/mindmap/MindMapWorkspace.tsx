
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
  reactFlowInstance: any;
  setReactFlowInstance: (instance: any) => void;
}

const MindMapWorkspace: React.FC<MindMapWorkspaceProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  reactFlowInstance,
  setReactFlowInstance
}) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onNodeDoubleClick={(_, node) => {
        if (node.data.url) {
          window.open(node.data.url, '_blank');
          return;
        }
      }}
      onInit={setReactFlowInstance}
      fitView
      nodeTypes={nodeTypes}
      deleteKeyCode="Delete"
      multiSelectionKeyCode="Control"
    >
      <Background 
        variant={BackgroundVariant.DOTS}
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
