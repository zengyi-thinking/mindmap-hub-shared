
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Material } from '@/types/materials';
import { userFilesService } from '@/lib/storage';
import { MindMapNode, MindMapEdge } from '@/types/mindmap';
import AttachMaterialDialog from '@/components/mindmap/AttachMaterialDialog';
import NodeIconSelector from '@/components/mindmap/NodeIconSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import MindMapHeader from '@/components/mindmap/MindMapHeader';
import MindMapTags from '@/components/mindmap/MindMapTags';
import NodeEditDialog from '@/components/mindmap/NodeEditDialog';
import MindMapWorkspace from '@/components/mindmap/MindMapWorkspace';

import { useMindMapData } from '@/hooks/useMindMapData';
import { useMindMapNodes } from '@/hooks/useMindMapNodes';
import { useMindMapLayout } from '@/hooks/useMindMapLayout';
import { useMindMapNodeEdit } from '@/hooks/useMindMapNodeEdit';
import { useMindMapConnections } from '@/hooks/useMindMapConnections';

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
  
  const {
    selectedNode,
    setSelectedNode,
    editDialogOpen,
    setEditDialogOpen,
    nodeName,
    setNodeName,
    nodeNotes,
    setNodeNotes,
    nodeColor,
    setNodeColor,
    nodeIcon,
    setNodeIcon,
    nodeUrl,
    setNodeUrl,
    nodeIconDialogOpen,
    setNodeIconDialogOpen,
    attachDialogOpen,
    setAttachDialogOpen,
    attachedMaterials,
    selectNodeForEdit,
    setNodeIconAndClose,
    handleAttachMaterials
  } = useMindMapNodeEdit();
  
  const {
    connectingNodeId,
    onConnect,
    startConnecting,
    createConnection
  } = useMindMapConnections(setEdges);
  
  const [materials, setMaterials] = useState<Material[]>([]);
  
  const { addNode, deleteNode, updateNode, attachMaterials } = useMindMapNodes(setNodes, setEdges);
  const { autoLayout } = useMindMapLayout(setNodes);
  
  // Load mindmap data on initial render
  React.useEffect(() => {
    const content = loadMindMap();
    if (content) {
      setNodes(content.nodes || []);
      setEdges(content.edges || []);
    }
    
    const allMaterials = userFilesService.getApprovedFiles();
    setMaterials(allMaterials);
  }, [loadMindMap]);
  
  // Handle node click
  const onNodeClick = React.useCallback((event: React.MouseEvent, node: MindMapNode) => {
    if (connectingNodeId) {
      if (connectingNodeId !== node.id) {
        createConnection(connectingNodeId, node.id);
      }
      setConnectingNodeId(null);
    } else {
      selectNodeForEdit(node);
    }
  }, [connectingNodeId, createConnection, selectNodeForEdit]);
  
  // Add a new node
  const handleAddNode = React.useCallback(() => {
    if (!reactFlowInstance) return;
    
    const newNode = addNode(reactFlowInstance, reactFlowWrapper);
    
    if (newNode) {
      selectNodeForEdit(newNode);
    }
  }, [reactFlowInstance, addNode, selectNodeForEdit]);
  
  // Delete a node
  const handleDeleteNode = React.useCallback(() => {
    if (deleteNode(selectedNode)) {
      setEditDialogOpen(false);
      setSelectedNode(null);
    }
  }, [selectedNode, deleteNode, setEditDialogOpen, setSelectedNode]);
  
  // Update a node
  const handleUpdateNode = React.useCallback(() => {
    if (updateNode(selectedNode, nodeName, nodeNotes, nodeColor, nodeIcon, nodeUrl)) {
      setEditDialogOpen(false);
    }
  }, [selectedNode, nodeName, nodeNotes, nodeColor, nodeIcon, nodeUrl, updateNode, setEditDialogOpen]);
  
  // Attach materials to a node
  const handleAttachMaterialsToNode = React.useCallback((selectedMaterials: Material[]) => {
    if (selectedNode) {
      attachMaterials(selectedNode, selectedMaterials);
      handleAttachMaterials(selectedNode, selectedMaterials);
    }
  }, [selectedNode, attachMaterials, handleAttachMaterials]);
  
  // Open material attachment dialog
  const openAttachMaterialDialog = React.useCallback(() => {
    if (selectedNode) {
      setAttachDialogOpen(true);
    } else {
      toast({
        title: "请先选择节点",
        description: "您需要先选择一个节点才能附加资料",
        variant: "destructive"
      });
    }
  }, [selectedNode, setAttachDialogOpen]);
  
  // Handle save mindmap
  const handleSaveMindMap = React.useCallback(() => {
    saveMindMap(nodes, edges);
  }, [nodes, edges, saveMindMap]);
  
  // Handle auto layout
  const handleAutoLayout = React.useCallback(() => {
    autoLayout(nodes, edges, reactFlowInstance);
  }, [nodes, edges, reactFlowInstance, autoLayout]);
  
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
        <MindMapWorkspace
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          reactFlowInstance={reactFlowInstance}
          setReactFlowInstance={setReactFlowInstance}
        />
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
        onConfirm={handleAttachMaterialsToNode}
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
