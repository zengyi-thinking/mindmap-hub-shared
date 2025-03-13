
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Circle, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Node, 
  Edge, 
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface MindMapVisualizationProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onNodeClick: (event: any, node: any) => void;
  onInitReactFlow: (instance: any) => void;
  onSave: () => void;
  reactFlowInstance: any;
}

const MindMapVisualization: React.FC<MindMapVisualizationProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onInitReactFlow,
  onSave,
  reactFlowInstance
}) => {
  return (
    <Card className="overflow-hidden border border-primary/20 shadow-lg mb-8">
      <CardHeader className="p-4 pb-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-primary/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-primary">思维导图可视化</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => reactFlowInstance?.fitView()}
              className="border-primary/20 hover:bg-primary/10 hover:text-primary"
            >
              <Maximize className="h-3.5 w-3.5 mr-1" />
              重置视图
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSave}
              className="flex items-center gap-1 border-primary/20 hover:bg-primary/10 hover:text-primary"
            >
              <Save className="h-3.5 w-3.5" />
              保存
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs flex gap-2 items-center mt-1">
          <div className="flex items-center gap-1.5">
            <Circle className="h-2 w-2 fill-primary stroke-none" />
            点击最终标签节点可以查看相关资料
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="h-2 w-2 fill-accent stroke-none" />
            拖动可以移动思维导图
          </div>
        </CardDescription>
      </CardHeader>
      <div style={{ height: '70vh', width: '100%' }} className="bg-slate-50/50 dark:bg-slate-900/20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onInit={onInitReactFlow}
          fitView
          attributionPosition="bottom-right"
          zoomOnScroll={true}
          panOnScroll={true}
          nodesDraggable={true}
          elementsSelectable={true}
          proOptions={{ hideAttribution: true }}
          className="react-flow-custom"
        >
          <Background 
            variant={"dots" as BackgroundVariant}
            gap={20} 
            size={1} 
            color="hsl(var(--primary) / 0.2)"
          />
          <Controls 
            showInteractive={false}
            position="bottom-right"
            style={{
              borderRadius: '8px',
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--primary) / 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '4px'
            }}
          />
          <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-2 rounded-md shadow-md border border-primary/20 flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              onClick={() => reactFlowInstance?.zoomIn()}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              onClick={() => reactFlowInstance?.zoomOut()}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </ReactFlow>
      </div>
    </Card>
  );
};

export default MindMapVisualization;
