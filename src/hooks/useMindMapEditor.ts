
import { useCallback, useRef, useState } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { toast } from '@/components/ui/use-toast';
import { Material } from '@/types/materials';
import { userFilesService } from '@/lib/storage';
import { MindMapNode, MindMapEdge } from '@/types/mindmap';
import { useMindMapData } from '@/hooks/useMindMapData';
import { useMindMapNodes } from '@/hooks/useMindMapNodes';
import { useMindMapLayout } from '@/hooks/useMindMapLayout';
import { useMindMapNodeEdit } from '@/hooks/useMindMapNodeEdit';
import { useMindMapConnections } from '@/hooks/useMindMapConnections';

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
  const { autoLayout } = useMindMapLayout(setNodes);
  
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
    if (!reactFlowInstance) return;
    
    const newNode = addNode(reactFlowInstance, reactFlowWrapper);
    
    if (newNode) {
      selectNodeForEdit(newNode);
    }
  }, [reactFlowInstance, addNode, selectNodeForEdit]);
  
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
    if (selectedNode) {
      attachMaterials(selectedNode, selectedMaterials);
      handleAttachMaterials(selectedNode, selectedMaterials);
    }
  }, [selectedNode, attachMaterials, handleAttachMaterials]);
  
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
    saveMindMap(nodes, edges);
  }, [nodes, edges, saveMindMap]);
  
  // Handle auto layout
  const handleAutoLayout = useCallback(() => {
    autoLayout(nodes, edges, reactFlowInstance);
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
