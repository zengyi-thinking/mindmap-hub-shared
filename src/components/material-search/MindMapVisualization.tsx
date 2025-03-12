
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Circle } from 'lucide-react';
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
    <Card className="overflow-hidden border mb-8">
      <CardHeader className="p-4 pb-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">思维导图可视化</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => reactFlowInstance?.fitView()}
            >
              重置视图
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSave}
              className="flex items-center gap-1"
            >
              <Save className="h-3.5 w-3.5" />
              保存
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs flex gap-2 items-center mt-1">
          <Circle className="h-2 w-2 fill-primary stroke-none" />
          点击最终标签节点可以查看相关资料
          <Circle className="h-2 w-2 fill-accent stroke-none ml-2" />
          拖动可以移动思维导图
        </CardDescription>
      </CardHeader>
      <div style={{ height: '60vh', width: '100%' }}>
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
        >
          <Background 
            variant={"dots" as BackgroundVariant}
            gap={20} 
            size={1} 
            color="hsl(var(--muted-foreground) / 0.3)"
          />
          <Controls 
            showInteractive={false}
            position="bottom-right"
            style={{
              borderRadius: '8px',
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))'
            }}
          />
        </ReactFlow>
      </div>
    </Card>
  );
};

export default MindMapVisualization;
