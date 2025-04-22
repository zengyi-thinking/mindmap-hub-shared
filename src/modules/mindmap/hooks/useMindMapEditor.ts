import { useCallback, useRef, useState } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { toast } from '@/components/ui/use-toast';
import { Material } from '@/modules/materials/types/materials';
import { userFilesService } from '@/lib/storage';
import { MindMapNode, MindMapEdge } from '@/modules/mindmap/types/mindmap';
import { useMindMapData } from '@/modules/mindmap/hooks/useMindMapData';
import { useMindMapNodes } from '@/modules/mindmap/hooks/useMindMapNodes';
import { useMindMapLayout } from '@/modules/mindmap/hooks/useMindMapLayout';
import { useMindMapNodeEdit } from '@/modules/mindmap/hooks/useMindMapNodeEdit';
import { useMindMapConnections } from '@/modules/mindmap/hooks/useMindMapConnections';

export function useMindMapEditor(mindMapId?: number) {
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
  const [materials, setMaterials] = useState<Material[]>([]);
  
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
    setConnectingNodeId,
    onConnect,
    startConnecting,
    createConnection
  } = useMindMapConnections(setEdges);
  
  const { addNode, deleteNode, updateNode, attachMaterials } = useMindMapNodes(setNodes, setEdges);
  const { autoLayout } = useMindMapLayout();
  
  // Load mindmap data on initial render
  const initializeMindMap = useCallback(() => {
    const content = loadMindMap();
    if (content) {
      setNodes(content.nodes || []);
      setEdges(content.edges || []);
    }
    
    const allMaterials = userFilesService.getApprovedFiles();
    setMaterials(allMaterials);
  }, [loadMindMap, setNodes, setEdges]);
  
  // Handle node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: MindMapNode) => {
    if (event.detail === 2) {
      return;
    }
    
    if (connectingNodeId) {
      if (connectingNodeId !== node.id) {
        createConnection(connectingNodeId, node.id);
      }
      setConnectingNodeId(null);
    } else {
      selectNodeForEdit(node);
    }
  }, [connectingNodeId, createConnection, selectNodeForEdit, setConnectingNodeId]);
  
  // Add a new node
  const handleAddNode = useCallback(() => {
    if (!reactFlowInstance) {
      toast({
        title: "操作失败",
        description: "无法访问思维导图实例",
        variant: "destructive"
      });
      return;
    }
    
    // 确保reactFlowInstance是有效的
    console.log("Adding new node...", reactFlowInstance);
    
    try {
      const newNode = addNode(reactFlowInstance, reactFlowWrapper, selectedNode);
      
      if (newNode) {
        selectNodeForEdit(newNode);
      }
    } catch (error) {
      console.error("添加节点时出错:", error);
      toast({
        title: "添加节点失败",
        description: "发生了一个错误，请重试",
        variant: "destructive"
      });
    }
  }, [reactFlowInstance, addNode, selectNodeForEdit, selectedNode, reactFlowWrapper]);
  
  // Delete a node
  const handleDeleteNode = useCallback(() => {
    if (deleteNode(selectedNode)) {
      setEditDialogOpen(false);
      setSelectedNode(null);
    }
  }, [selectedNode, deleteNode, setEditDialogOpen, setSelectedNode]);
  
  // Update a node
  const handleUpdateNode = useCallback(() => {
    if (updateNode(selectedNode, nodeName, nodeNotes, nodeColor, nodeIcon, nodeUrl)) {
      setEditDialogOpen(false);
    }
  }, [selectedNode, nodeName, nodeNotes, nodeColor, nodeIcon, nodeUrl, updateNode, setEditDialogOpen]);
  
  // Attach materials to a node
  const handleAttachMaterialsToNode = useCallback((selectedMaterials: Material[]) => {
    if (!selectedNode) {
      toast({
        title: "选择节点错误",
        description: "请先选择一个节点再附加资料",
        variant: "destructive"
      });
      return;
    }
    
    console.log("附加资料到节点:", { 
      nodeId: selectedNode.id, 
      materialCount: selectedMaterials.length,
      materials: selectedMaterials
    });
    
    try {
      // 确保附加资料到节点
      const result = attachMaterials(selectedNode, selectedMaterials);
      
      if (result) {
        // 显示成功消息
        toast({
          title: "资料已附加",
          description: `已成功将 ${selectedMaterials.length} 个资料附加到节点`,
        });
        
        // 更新节点编辑状态中的材料
        handleAttachMaterials(selectedNode, selectedMaterials);
        
        // 关闭对话框
        setAttachDialogOpen(false);
      } else {
        throw new Error("附加资料失败");
      }
    } catch (error) {
      console.error("附加资料错误:", error);
      toast({
        title: "附加资料失败",
        description: "无法将资料附加到节点，请重试",
        variant: "destructive"
      });
    }
  }, [selectedNode, attachMaterials, handleAttachMaterials, setAttachDialogOpen]);
  
  // Open material attachment dialog
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
  }, [selectedNode, setAttachDialogOpen]);
  
  // Handle save mindmap
  const handleSaveMindMap = useCallback(() => {
    const success = saveMindMap(nodes, edges);
    
    if (success) {
      toast({
        title: "保存成功",
        description: "思维导图已成功保存"
      });
    } else {
      toast({
        title: "保存失败",
        description: "保存思维导图时发生错误",
        variant: "destructive"
      });
    }
  }, [nodes, edges, saveMindMap]);
  
  // Handle auto layout
  const handleAutoLayout = useCallback(() => {
    autoLayout(nodes, edges, reactFlowInstance);
    
    toast({
      title: "自动布局完成",
      description: "思维导图已重新排列"
    });
  }, [nodes, edges, reactFlowInstance, autoLayout]);

  return {
    // Refs
    reactFlowWrapper,
    
    // State
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
    
    // Node editing
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
    
    // Event handlers
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
  };
}

