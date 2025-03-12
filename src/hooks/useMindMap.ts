
import { useState, useCallback, useRef } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  addEdge,
} from '@xyflow/react';
import { mindMapsService } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';
import { generateMindMap } from '@/components/material-search/MindMapGenerator';
import { useAuth } from '@/lib/auth';
import { TagCategory } from '@/types/materials';

export const useMindMap = (materialsData, selectedTags, searchQuery, tagHierarchy) => {
  const { user } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [mindMapTitle, setMindMapTitle] = useState('');
  const [mindMapDescription, setMindMapDescription] = useState('');
  
  // ReactFlow handlers
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Create mindmap
  const createMindMap = () => {
    const { nodes: newNodes, edges: newEdges } = generateMindMap({
      searchQuery,
      selectedTags,
      materialsData,
      tagHierarchy
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Save mindmap
  const saveMindMap = () => {
    if (!mindMapTitle.trim()) {
      toast({
        title: "请输入标题",
        description: "思维导图需要一个标题才能保存",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能保存思维导图",
        variant: "destructive"
      });
      return;
    }
    
    const mindMapData = {
      id: Date.now(),
      title: mindMapTitle,
      description: mindMapDescription,
      content: {
        nodes: nodes,
        edges: edges,
        version: "1.0"
      },
      tags: selectedTags,
      updatedAt: new Date().toISOString(),
      creator: user.username || 'Unknown',
      starred: false,
      shared: true
    };
    
    mindMapsService.add(mindMapData);
    
    toast({
      title: "保存成功",
      description: "思维导图已成功保存"
    });
    
    setSaveDialogOpen(false);
    setMindMapTitle('');
    setMindMapDescription('');
  };

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    reactFlowInstance,
    setReactFlowInstance,
    saveDialogOpen,
    setSaveDialogOpen,
    mindMapTitle,
    setMindMapTitle,
    mindMapDescription,
    setMindMapDescription,
    createMindMap,
    saveMindMap
  };
};
