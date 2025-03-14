import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  BackgroundVariant,
  NodeTypes,
  Connection,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Material } from '@/types/materials';
import { userFilesService } from '@/lib/storage';
import MaterialNode from '@/components/mindmap/MaterialNode';
import { MindMapNode, MindMapEdge } from '@/types/mindmap';
import AttachMaterialDialog from '@/components/mindmap/AttachMaterialDialog';
import NodeIconSelector from '@/components/mindmap/NodeIconSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import MindMapHeader from '@/components/mindmap/MindMapHeader';
import MindMapTags from '@/components/mindmap/MindMapTags';
import NodeEditDialog from '@/components/mindmap/NodeEditDialog';

import { useMindMapData } from '@/hooks/useMindMapData';
import { useMindMapNodes } from '@/hooks/useMindMapNodes';
import { useMindMapLayout } from '@/hooks/useMindMapLayout';

const nodeTypes: NodeTypes = {
  materialNode: MaterialNode
};

const navigate = useNavigate();

const MindMapEditor: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  const {
    isNew,
    title,
    setTitle,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    tags,
    tagInput,
    setTagInput,
    addTag,
    removeTag,
    saveMindMap,
    loadMindMap
  } = useMindMapData();
  
  const [nodes, setNodes, onNodesChange] = useNodesState<MindMapNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<MindMapEdge>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeNotes, setNodeNotes] = useState('');
  const [nodeColor, setNodeColor] = useState('#ffffff');
  const [nodeIcon, setNodeIcon] = useState('');
  const [nodeUrl, setNodeUrl] = useState('');
  const [nodeIconDialogOpen, setNodeIconDialogOpen] = useState(false);
  
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [attachedMaterials, setAttachedMaterials] = useState<Record<string, Material[]>>({});
  
  const { addNode, deleteNode, updateNode, attachMaterials, createConnection } = useMindMapNodes(setNodes, setEdges);
  const { autoLayout } = useMindMapLayout();
  
  useEffect(() => {
    const content = loadMindMap();
    if (content) {
      setNodes(content.nodes || []);
      setEdges(content.edges || []);
    }
    
    const allMaterials = userFilesService.getApprovedFiles();
    setMaterials(allMaterials);
  }, [loadMindMap]);
  
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
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
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: MindMapNode) => {
    if (connectingNodeId) {
      if (connectingNodeId !== node.id) {
        createConnection(connectingNodeId, node.id);
      }
      setConnectingNodeId(null);
    } else {
      setSelectedNode(node);
      setNodeName(node.data.label);
      setNodeNotes(node.data.notes || '');
      setNodeColor(node.style?.background || '#ffffff');
      setNodeIcon(node.data.icon || '');
      setNodeUrl(node.data.url || '');
      setEditDialogOpen(true);
    }
  }, [connectingNodeId, createConnection]);
  
  const startConnecting = useCallback((nodeId: string) => {
    setConnectingNodeId(nodeId);
    setEditDialogOpen(false);
    toast({
      title: "连接模式",
      description: "点击另一个节点来创建连接",
    });
  }, []);
  
  const handleAddNode = useCallback(() => {
    if (!reactFlowInstance) return;
    
    const newNode = addNode(reactFlowInstance, reactFlowWrapper);
    
    if (newNode) {
      setSelectedNode(newNode);
      setNodeName(newNode.data.label);
      setNodeNotes('');
      setNodeColor('#ffffff');
      setNodeIcon('');
      setNodeUrl('');
      setEditDialogOpen(true);
    }
  }, [reactFlowInstance, addNode]);
  
  const handleDeleteNode = useCallback(() => {
    if (deleteNode(selectedNode)) {
      setEditDialogOpen(false);
      setSelectedNode(null);
    }
  }, [selectedNode, deleteNode]);
  
  const handleUpdateNode = useCallback(() => {
    if (updateNode(selectedNode, nodeName, nodeNotes, nodeColor, nodeIcon, nodeUrl)) {
      setEditDialogOpen(false);
    }
  }, [selectedNode, nodeName, nodeNotes, nodeColor, nodeIcon, nodeUrl, updateNode]);
  
  const handleAttachMaterials = useCallback((selectedMaterials: Material[]) => {
    if (selectedNode) {
      attachMaterials(selectedNode, selectedMaterials);
      
      setAttachedMaterials({
        ...attachedMaterials,
        [selectedNode.id]: selectedMaterials
      });
      
      setAttachDialogOpen(false);
    }
  }, [selectedNode, attachMaterials, attachedMaterials]);
  
  const openAttachMaterialDialog = useCallback(() => {
    if (selectedNode) {
      setAttachDialogOpen(true);
    } else {
      toast({
        title: "请先选择节点",
        description: "您需要先选择一个节点才能附加资料",
        variant: "destructive"
      });
    }
  }, [selectedNode]);
  
  const handleSaveMindMap = useCallback(() => {
    saveMindMap(nodes, edges);
  }, [nodes, edges, saveMindMap]);
  
  const handleAutoLayout = useCallback(() => {
    const layoutedNodes = autoLayout(nodes, edges, reactFlowInstance);
    if (layoutedNodes) {
      setNodes(layoutedNodes);
    }
  }, [nodes, edges, reactFlowInstance, autoLayout, setNodes]);
  
  const setNodeIconAndClose = useCallback((icon: string) => {
    setNodeIcon(icon);
    setNodeIconDialogOpen(false);
  }, []);
  
  return (
    <div className="w-full h-screen flex flex-col">
      <MindMapHeader
        title={title}
        setTitle={setTitle}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        onAddNode={handleAddNode}
        onAttachMaterial={openAttachMaterialDialog}
        onAutoLayout={handleAutoLayout}
        onSave={handleSaveMindMap}
      />
      
      <MindMapTags
        tags={tags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        onAddTag={addTag}
        onRemoveTag={removeTag}
      />
      
      <div className="px-4 py-2 border-b">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="思维导图描述（可选）"
          className="resize-none border-0 p-0 focus-visible:ring-0 bg-transparent text-sm"
          rows={1}
        />
      </div>
      
      <div className="flex-1 w-full h-full" ref={reactFlowWrapper}>
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
            
            if (node.data.materials && node.data.materials.length > 0) {
              navigate(`/mindmap-materials/${isNew ? 'new' : useParams().id}/${node.id}`);
            }
          }}
          onInit={setReactFlowInstance}
          fitView
          nodeTypes={nodeTypes}
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Control"
        >
          <Background 
            variant={"dots" as BackgroundVariant}
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
      
      <NodeEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        selectedNode={selectedNode}
        nodeName={nodeName}
        setNodeName={setNodeName}
        nodeNotes={nodeNotes}
        setNodeNotes={setNodeNotes}
        nodeColor={nodeColor}
        setNodeColor={setNodeColor}
        nodeIcon={nodeIcon}
        setNodeIcon={setNodeIcon}
        nodeUrl={nodeUrl}
        setNodeUrl={setNodeUrl}
        onUpdate={handleUpdateNode}
        onDelete={handleDeleteNode}
        onOpenIconDialog={() => setNodeIconDialogOpen(true)}
        onOpenAttachDialog={openAttachMaterialDialog}
        onStartConnecting={() => selectedNode && startConnecting(selectedNode.id)}
      />
      
      <AttachMaterialDialog
        open={attachDialogOpen}
        onOpenChange={setAttachDialogOpen}
        materials={materials}
        selectedMaterials={selectedNode?.data.materials || []}
        onConfirm={handleAttachMaterials}
      />
      
      <Dialog open={nodeIconDialogOpen} onOpenChange={setNodeIconDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>选择节点图标</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px]">
            <NodeIconSelector onSelect={setNodeIconAndClose} />
          </ScrollArea>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setNodeIconDialogOpen(false)}
            >
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MindMapEditor;
