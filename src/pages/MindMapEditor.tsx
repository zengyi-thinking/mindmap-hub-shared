import React, { useEffect, useRef } from 'react';
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
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

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
    console.log("思维导图编辑器已初始化");
  }, [initializeMindMap]);
  
  // 确保添加节点功能正常工作
  const handleAddNodeClick = () => {
    console.log("点击添加节点按钮");
    if (reactFlowInstance) {
      handleAddNode();
    } else {
      console.error("ReactFlow实例不可用");
      toast({
        title: "操作失败",
        description: "无法添加节点，请刷新页面后重试",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="w-full h-screen flex flex-col">
      <MindMapHeader
        title={title}
        setTitle={setTitle}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        onAddNode={handleAddNodeClick}
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
          onAddNode={handleAddNodeClick}
          onAutoLayout={handleAutoLayout}
          onSave={handleSaveMindMap}
          reactFlowWrapper={reactFlowWrapper}
          setReactFlowInstance={setReactFlowInstance}
        />
      </div>
      
      {nodes.length === 0 && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   flex flex-col items-center justify-center p-8 bg-white/80 dark:bg-gray-800/80 
                   rounded-xl shadow-lg backdrop-blur-sm z-10"
        >
          <p className="text-lg font-medium mb-4">思维导图还是空的</p>
          <p className="text-sm text-muted-foreground mb-6">点击下方按钮添加第一个节点开始创建</p>
          <Button 
            onClick={handleAddNodeClick}
            size="lg"
            className="flex items-center gap-2 px-6 py-6 text-base"
          >
            <PlusCircle className="h-5 w-5" />
            添加根节点
          </Button>
        </div>
      )}
      
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
