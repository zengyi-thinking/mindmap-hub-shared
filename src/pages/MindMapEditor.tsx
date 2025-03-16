
import React, { useEffect } from 'react';
import '@xyflow/react/dist/style.css';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from 'react-router-dom';
import MindMapHeader from '@/components/mindmap/MindMapHeader';
import MindMapTags from '@/components/mindmap/MindMapTags';
import NodeEditDialog from '@/components/mindmap/NodeEditDialog';
import MindMapWorkspace from '@/components/mindmap/MindMapWorkspace';
import AttachMaterialDialog from '@/components/mindmap/AttachMaterialDialog';
import NodeIconDialog from '@/components/mindmap/NodeIconDialog';
import { useMindMapEditor } from '@/hooks/useMindMapEditor';

const MindMapEditor: React.FC = () => {
  const { id: mindMapIdParam } = useParams<{ id: string }>();
  const mindMapId = mindMapIdParam ? parseInt(mindMapIdParam) : undefined;
  
  const {
    reactFlowWrapper,
    title,
    setTitle,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    tags,
    tagInput,
    setTagInput,
    nodes,
    edges,
    reactFlowInstance,
    setReactFlowInstance,
    materials,
    selectedNode,
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
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    addTag,
    removeTag,
    initializeMindMap,
    handleAddNode,
    handleDeleteNode,
    handleUpdateNode,
    handleAttachMaterialsToNode,
    openAttachMaterialDialog,
    handleSaveMindMap,
    handleAutoLayout,
    setNodeIconAndClose,
    startConnecting
  } = useMindMapEditor(mindMapId);
  
  // Load data on component mount
  useEffect(() => {
    initializeMindMap();
  }, [initializeMindMap]);
  
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
          mindMapId={mindMapId}
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
      
      <NodeIconDialog
        open={nodeIconDialogOpen}
        onOpenChange={setNodeIconDialogOpen}
        onSelectIcon={setNodeIconAndClose}
      />
    </div>
  );
};

export default MindMapEditor;
