
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { Loader2, Plus, Edit, Eye, Save, Lock, Unlock, Trash2, Download, Share2, Link, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mindMapStorage } from '@/lib/mindmapStorage';
import { Material } from '@/types/materials';
import MaterialNode from '@/components/mindmap/MaterialNode';
import NodeEditDialog from '@/components/mindmap/NodeEditDialog';
import AttachMaterialDialog from '@/components/mindmap/AttachMaterialDialog';
import MindMapHeader from '@/components/mindmap/MindMapHeader';
import MindMapTags from '@/components/mindmap/MindMapTags';

// Define the node and edge types
const nodeTypes = {
  materialNode: MaterialNode,
};

// Define the layout direction
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Define the node width and height
const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

// Helper function for layout
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  // Create a new graph
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  
  // Set the direction
  const isHorizontal = direction === 'LR';
  graph.setGraph({ rankdir: direction });
  
  // Add nodes to the graph
  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  
  // Add edges to the graph
  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });
  
  // Apply layout
  dagre.layout(graph);
  
  // Get the positions
  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = graph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - NODE_WIDTH / 2,
          y: nodeWithPosition.y - NODE_HEIGHT / 2,
        },
      };
    }),
    edges,
  };
};

const MindMapEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [mindMap, setMindMap] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeEditOpen, setNodeEditOpen] = useState(false);
  const [materialAttachOpen, setMaterialAttachOpen] = useState(false);
  const [autoLayout, setAutoLayout] = useState(true);
  const [layoutDirection, setLayoutDirection] = useState('TB');
  const [isSaving, setIsSaving] = useState(false);
  const [mapName, setMapName] = useState('');
  const [mapDescription, setMapDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState([]);

  // Load mind map data
  useEffect(() => {
    if (id) {
      const mapData = mindMapStorage.getMindMapById(id);
      if (mapData) {
        setMindMap(mapData);
        setMapName(mapData.name);
        setMapDescription(mapData.description || '');
        setIsPublic(mapData.isPublic || false);
        setTags(mapData.tags || []);
        
        // Set nodes and edges
        if (mapData.nodes && mapData.edges) {
          if (autoLayout) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
              mapData.nodes,
              mapData.edges,
              layoutDirection
            );
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
          } else {
            setNodes(mapData.nodes);
            setEdges(mapData.edges);
          }
        }
      } else {
        toast({
          title: "找不到思维导图",
          description: "指定的思维导图不存在",
          variant: "destructive",
        });
        navigate('/mindmaps');
      }
    }
    setLoading(false);
  }, [id, autoLayout, layoutDirection]);

  // Handle connection (edge) creation
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle node double click (navigate to materials)
  const onNodeDoubleClick = useCallback((event, node) => {
    if (node.data?.materials?.length > 0) {
      navigate(`/mindmap-materials/${id}/${node.id}`);
    }
  }, [id, navigate]);

  // Add a new node
  const addNode = useCallback(() => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'materialNode',
      data: { 
        label: '新节点', 
        description: '',
        materials: [],
        nodeColor: '#ffffff',
        textColor: '#000000',
        icon: 'Circle'
      },
      position: { x: 100, y: 100 }
    };
    
    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
    setNodeEditOpen(true);
  }, [setNodes]);

  // Save the mind map
  const saveMindMap = useCallback(() => {
    if (!mapName.trim()) {
      toast({
        title: "请输入思维导图名称",
        description: "思维导图名称不能为空",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    const updatedMap = {
      ...mindMap,
      id: mindMap?.id || `map-${Date.now()}`,
      name: mapName,
      description: mapDescription,
      nodes,
      edges,
      lastUpdated: new Date().toISOString(),
      isPublic,
      tags,
    };
    
    try {
      mindMapStorage.saveMindMap(updatedMap);
      setMindMap(updatedMap);
      toast({
        title: "保存成功",
        description: "思维导图已保存",
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: error.message || "保存思维导图时出错",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [mindMap, mapName, mapDescription, nodes, edges, isPublic, tags]);

  // Apply layout
  const applyLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      layoutDirection
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, layoutDirection, setNodes, setEdges]);

  // Handle node edit save
  const handleNodeEditSave = useCallback((editedNode) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === editedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...editedNode.data,
            },
          };
        }
        return node;
      })
    );
    setNodeEditOpen(false);
  }, [setNodes]);

  // Handle node delete
  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter(
        (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  // Handle material attach
  const handleMaterialAttach = useCallback((materials: Material[]) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            const existingMaterials = node.data.materials || [];
            const existingIds = new Set(existingMaterials.map(m => m.id));
            const newMaterials = materials.filter(m => !existingIds.has(m.id));
            
            return {
              ...node,
              data: {
                ...node.data,
                materials: [...existingMaterials, ...newMaterials],
              },
            };
          }
          return node;
        })
      );
      setMaterialAttachOpen(false);
    }
  }, [selectedNode, setNodes]);

  // Handle material detach
  const handleMaterialDetach = useCallback((materialId) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                materials: (node.data.materials || []).filter(m => m.id !== materialId),
              },
            };
          }
          return node;
        })
      );
    }
  }, [selectedNode, setNodes]);

  // Change layout direction
  const changeLayoutDirection = useCallback((direction) => {
    setLayoutDirection(direction);
    if (autoLayout) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    }
  }, [autoLayout, nodes, edges, setNodes, setEdges]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-xl">加载思维导图中...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <MindMapHeader 
        mapName={mapName}
        setMapName={setMapName}
        mapDescription={mapDescription}
        setMapDescription={setMapDescription}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        onSave={saveMindMap}
        isSaving={isSaving}
      />
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <ReactFlowProvider>
          <div className="flex-1 h-full relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onNodeDoubleClick={onNodeDoubleClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
              
              <Panel position="top-right" className="flex flex-col gap-2">
                <Button size="sm" onClick={addNode}>
                  <Plus className="h-4 w-4 mr-1" /> 添加节点
                </Button>
                <Button size="sm" onClick={applyLayout} variant="outline">
                  <Edit className="h-4 w-4 mr-1" /> 重新布局
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">布局方向</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => changeLayoutDirection('TB')}>
                      从上到下
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLayoutDirection('LR')}>
                      从左到右
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLayoutDirection('BT')}>
                      从下到上
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLayoutDirection('RL')}>
                      从右到左
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  size="sm" 
                  variant={autoLayout ? "default" : "outline"}
                  onClick={() => setAutoLayout(!autoLayout)}
                >
                  {autoLayout ? <Lock className="h-4 w-4 mr-1" /> : <Unlock className="h-4 w-4 mr-1" />}
                  自动布局{autoLayout ? "开" : "关"}
                </Button>
              </Panel>
            </ReactFlow>
          </div>
          
          {selectedNode && (
            <div className="w-full md:w-80 overflow-auto border-l">
              <Card className="border-0 rounded-none h-full">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{selectedNode.data.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedNode.data.description || '无描述'}
                  </p>
                  
                  <div className="flex gap-2 mb-4">
                    <Button size="sm" onClick={() => setNodeEditOpen(true)}>
                      <Edit className="h-4 w-4 mr-1" /> 编辑节点
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleDeleteNode}>
                      <Trash2 className="h-4 w-4 mr-1" /> 删除
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium">附加资料</h4>
                      <Button size="sm" variant="outline" onClick={() => setMaterialAttachOpen(true)}>
                        <Plus className="h-4 w-4 mr-1" /> 添加
                      </Button>
                    </div>
                    
                    {(!selectedNode.data.materials || selectedNode.data.materials.length === 0) ? (
                      <p className="text-sm text-muted-foreground">无附加资料</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedNode.data.materials.map((material) => (
                          <div key={material.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                            <div className="truncate">
                              <p className="text-sm font-medium">{material.title}</p>
                              <p className="text-xs text-muted-foreground">{material.fileType}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-7 w-7 text-destructive"
                                onClick={() => handleMaterialDetach(material.id)}
                              >
                                <Unlink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <NodeEditDialog 
            open={nodeEditOpen} 
            onOpenChange={setNodeEditOpen}
            node={selectedNode}
            onSave={handleNodeEditSave}
          />
          
          <AttachMaterialDialog
            open={materialAttachOpen}
            onOpenChange={setMaterialAttachOpen}
            onAttach={handleMaterialAttach}
          />
        </ReactFlowProvider>
      </div>
      
      <div className="p-4 border-t">
        <MindMapTags tags={tags} setTags={setTags} />
      </div>
    </div>
  );
};

export default MindMapEditor;
