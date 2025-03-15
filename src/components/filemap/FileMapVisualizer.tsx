
import React from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls,
  Panel,
  BackgroundVariant,
  NodeTypes 
} from '@xyflow/react';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileNode from './FileNode';

// Define custom node types
const nodeTypes: NodeTypes = {
  fileNode: FileNode
};

interface FileMapVisualizerProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onInit: (instance: any) => void;
  reactFlowInstance: any;
}

const FileMapVisualizer: React.FC<FileMapVisualizerProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onInit,
  reactFlowInstance
}) => {
  return (
    <div className="h-[500px] border rounded-lg overflow-hidden bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
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
    </div>
  );
};

export default FileMapVisualizer;
