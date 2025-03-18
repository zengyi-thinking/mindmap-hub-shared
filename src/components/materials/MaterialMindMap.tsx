import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface MaterialMindMapProps {
  nodes: any[];
  edges: any[];
  nodeTypes: any;
  handleNodeClick: (event: React.MouseEvent, node: any) => void;
  onInitReactFlow: (instance: any) => void;
}

const MaterialMindMap: React.FC<MaterialMindMapProps> = ({
  nodes,
  edges,
  nodeTypes,
  handleNodeClick,
  onInitReactFlow
}) => {
  return (
    <Card className="xl:col-span-3 h-[600px] flex flex-col">
      <CardHeader className="p-4 pb-2 border-b">
        <CardTitle className="text-lg">资料导图</CardTitle>
        <CardDescription>点击节点浏览资料</CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex-grow relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          attributionPosition="bottom-right"
          zoomOnScroll={true}
          panOnScroll={true}
          elementsSelectable={true}
          onInit={onInitReactFlow}
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
      </CardContent>
    </Card>
  );
};

export default MaterialMindMap; 