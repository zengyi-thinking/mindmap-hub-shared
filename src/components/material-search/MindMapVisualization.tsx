import React from 'react';
import styles from '@/pages/MaterialSearch.module.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Circle, ZoomIn, ZoomOut, Maximize, Database, Tag, File, Share2 } from 'lucide-react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Node, 
  Edge, 
  BackgroundVariant,
  Panel
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
  statistics?: any;
}

const MindMapVisualization: React.FC<MindMapVisualizationProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onInitReactFlow,
  onSave,
  reactFlowInstance,
  statistics
}) => {
  return (
    <Card className={`overflow-hidden border border-primary/20 shadow-lg mb-8 ${styles.cardShadow}`}>
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
      <CardContent className="p-0">
        <div style={{ height: '70vh', width: '100%' }} className="bg-slate-50/50 dark:bg-slate-900/20">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onInit={onInitReactFlow}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-right"
            zoomOnScroll={true}
            panOnScroll={true}
            nodesDraggable={true}
            elementsSelectable={true}
            proOptions={{ hideAttribution: true }}
            className="react-flow-custom"
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
            
            {/* 提示面板 */}
            <Panel position="top-right" className="bg-background/90 backdrop-blur-sm p-2 rounded-md shadow-sm border text-xs">
              提示: 滚轮缩放 | 拖拽平移 | 点击展开
            </Panel>
            
            {/* 统计面板 */}
            {statistics && (
              <Panel position="bottom-left" className="bg-background/90 backdrop-blur-sm p-3 rounded-md shadow-md border max-w-xs">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Database className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  导图统计信息
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex items-center">
                    <span className="text-muted-foreground">总节点数:</span>
                    <span className="ml-1 font-medium">{statistics.totalNodes}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="text-muted-foreground">标签节点:</span>
                    <span className="ml-1 font-medium">{statistics.tagCount}</span>
                  </div>
                  <div className="flex items-center">
                    <File className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-muted-foreground">资料节点:</span>
                    <span className="ml-1 font-medium">{statistics.materialCount}</span>
                  </div>
                  <div className="flex items-center">
                    <Share2 className="h-3 w-3 mr-1 text-purple-500" />
                    <span className="text-muted-foreground">连接数:</span>
                    <span className="ml-1 font-medium">{statistics.connectionCount}</span>
                  </div>
                </div>
                {statistics.mostConnectedNode && (
                  <div className="mt-2 border-t border-dashed pt-2 text-xs">
                    <p className="text-muted-foreground">连接最多的节点:</p>
                    <p className="font-medium truncate">
                      {statistics.mostConnectedNode.label}
                      <span className="ml-1 text-primary">
                        ({statistics.mostConnectedNode.connections}个连接)
                      </span>
                    </p>
                  </div>
                )}
              </Panel>
            )}
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};

export default MindMapVisualization;
