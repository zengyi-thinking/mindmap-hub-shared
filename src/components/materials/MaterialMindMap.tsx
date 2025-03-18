import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactFlow, Background, Controls, BackgroundVariant, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <Card className="xl:col-span-3 h-[600px] flex flex-col shadow-lg border-blue-100 dark:border-blue-900/30">
      <CardHeader className="p-4 pb-2 border-b bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">资料导图</CardTitle>
            <CardDescription>点击节点浏览资料</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onInitReactFlow && onInitReactFlow.fitView?.()}
            className="text-xs flex items-center gap-1 border-primary/20 hover:bg-primary/10 hover:text-primary"
          >
            <Maximize className="h-3.5 w-3.5" />
            重置视图
          </Button>
        </div>
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
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: {
              strokeWidth: 2,
              stroke: '#3b82f6'
            }
          }}
        >
          <Background
            variant={"dots" as BackgroundVariant}
            gap={20}
            size={1}
            color="hsl(var(--muted-foreground) / 0.2)"
          />
          <Controls
            showInteractive={false}
            position="bottom-right"
            style={{
              borderRadius: '8px',
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '4px'
            }}
          />
          <Panel position="top-right" className="bg-background/90 backdrop-blur-sm p-2 rounded-md shadow-sm border text-xs">
            提示: 滚轮缩放 | 拖拽平移 | 点击展开
          </Panel>
        </ReactFlow>
      </CardContent>
    </Card>
  );
};

export default MaterialMindMap; 