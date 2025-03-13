
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
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
  updateEdge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Save, 
  Share2, 
  ArrowLeft, 
  Plus, 
  Edit2, 
  FileText, 
  Trash2, 
  X, 
  Image,
  Link2,
  Layout,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { mindmapService } from '@/lib/mindmapStorage';
import { userFilesService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import MaterialNode from '@/components/mindmap/MaterialNode';
import NodeEditForm from '@/components/mindmap/NodeEditForm';
import { MindMap, MindMapNode } from '@/types/mindmap';
import { Material } from '@/types/materials';
import AttachMaterialDialog from '@/components/mindmap/AttachMaterialDialog';
import NodeIconSelector from '@/components/mindmap/NodeIconSelector';
import { ScrollArea } from '@/components/ui/scroll-area';

// Register custom node types
const nodeTypes: NodeTypes = {
  materialNode: MaterialNode
};

const MindMapEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = id === 'new';
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // State for the mindmap
  const [nodes, setNodes, onNodesChange] = useNodesState<MindMapNode['data']>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // State for the node edit
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeNotes, setNodeNotes] = useState('');
  const [nodeColor, setNodeColor] = useState('#ffffff');
  const [nodeIcon, setNodeIcon] = useState('');
  const [nodeUrl, setNodeUrl] = useState('');
  const [nodeIconDialogOpen, setNodeIconDialogOpen] = useState(false);
  
  // State for the mindmap metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // State for attaching materials
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [attachedMaterials, setAttachedMaterials] = useState<Record<string, Material[]>>({});
  
  // State for connecting nodes
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  
  // Load existing mindmap if editing
  useEffect(() => {
    if (!isNew && id) {
      const mindmap = mindmapService.getById(parseInt(id));
      if (mindmap) {
        setTitle(mindmap.title);
        setDescription(mindmap.description || '');
        setIsPublic(mindmap.shared);
        setTags(mindmap.tags || []);
        
        if (mindmap.content) {
          setNodes(mindmap.content.nodes || []);
          setEdges(mindmap.content.edges || []);
        }
      } else {
        toast({
          title: "未找到思维导图",
          description: "请创建新的思维导图",
          variant: "destructive"
        });
        navigate('/mindmaps');
      }
    } else {
      // Initialize new mindmap with a root node
      const initialNode = {
        id: '1',
        type: 'materialNode',
        data: { 
          label: '中心主题',
          icon: 'Brain',
          materials: []
        },
        position: { x: 400, y: 300 },
        style: {
          background: '#f0f4ff',
          borderColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary))',
          borderWidth: 2,
          width: 150,
          height: 80,
          padding: '10px',
          borderRadius: '8px',
          fontWeight: 'bold',
        }
      };
      setNodes([initialNode]);
    }
    
    // Load materials
    const allMaterials = userFilesService.getApprovedFiles();
    setMaterials(allMaterials);
  }, [id, isNew, navigate]);
  
  // Handle connections between nodes
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
  
  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    if (connectingNodeId) {
      // If we're connecting nodes, create an edge
      if (connectingNodeId !== node.id) {
        const newEdge = {
          id: `e-${connectingNodeId}-${node.id}`,
          source: connectingNodeId,
          target: node.id,
          type: 'smoothstep',
          animated: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: 'hsl(var(--border))', strokeWidth: 2 }
        };
        setEdges(edges => [...edges, newEdge]);
      }
      setConnectingNodeId(null);
    } else {
      // Normal node selection
      setSelectedNode(node);
      setNodeName(node.data.label);
      setNodeNotes(node.data.notes || '');
      setNodeColor(node.style?.background || '#ffffff');
      setNodeIcon(node.data.icon || '');
      setNodeUrl(node.data.url || '');
      setEditDialogOpen(true);
    }
  }, [connectingNodeId, setEdges]);
  
  // Start connecting nodes
  const startConnecting = (nodeId: string) => {
    setConnectingNodeId(nodeId);
    toast({
      title: "连接模式",
      description: "点击另一个节点来创建连接",
    });
  };
  
  // Add a new node
  const addNode = useCallback(() => {
    if (!reactFlowInstance) return;
    
    const id = `node_${Date.now()}`;
    const position = reactFlowInstance.project({
      x: reactFlowWrapper.current ? reactFlowWrapper.current.offsetWidth / 2 : 400,
      y: reactFlowWrapper.current ? reactFlowWrapper.current.offsetHeight / 2 : 300
    });

    const newNode = {
      id,
      type: 'materialNode',
      data: { 
        label: '新节点',
        materials: []
      },
      position,
      style: {
        background: '#ffffff',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        width: 120,
        height: 60,
        padding: '8px',
        borderRadius: '8px',
      }
    };
    
    setNodes(nds => [...nds, newNode]);
    
    // Auto-select the new node for editing
    setSelectedNode(newNode);
    setNodeName(newNode.data.label);
    setNodeNotes('');
    setNodeColor('#ffffff');
    setNodeIcon('');
    setNodeUrl('');
    setEditDialogOpen(true);
  }, [reactFlowInstance, setNodes]);
  
  // Handle node movement to ensure it stays centered with child nodes
  const onNodeDragStop = useCallback((event, node) => {
    // This is where you could add logic to adjust child nodes
    // if you want them to move with their parent
  }, []);
  
  // Delete the selected node
  const deleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes(nds => nds.filter(node => node.id !== selectedNode.id));
      setEdges(eds => eds.filter(edge => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setEditDialogOpen(false);
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);
  
  // Update node after editing
  const updateNode = useCallback(() => {
    if (selectedNode) {
      setNodes(nds => 
        nds.map(node => {
          if (node.id === selectedNode.id) {
            const updatedNode = {
              ...node,
              data: { 
                ...node.data, 
                label: nodeName,
                notes: nodeNotes,
                icon: nodeIcon,
                url: nodeUrl
              },
              style: {
                ...node.style,
                background: nodeColor
              }
            };
            return updatedNode;
          }
          return node;
        })
      );
      setEditDialogOpen(false);
    }
  }, [selectedNode, nodeName, nodeNotes, nodeColor, nodeIcon, nodeUrl, setNodes]);
  
  // Add a tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // Remove a tag
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // Attach materials to the selected node
  const attachMaterials = (selectedMaterials: Material[]) => {
    if (selectedNode) {
      // Update the node data with the selected materials
      setNodes(nds => 
        nds.map(node => {
          if (node.id === selectedNode.id) {
            const updatedNode = {
              ...node,
              data: { 
                ...node.data, 
                materials: selectedMaterials
              }
            };
            return updatedNode;
          }
          return node;
        })
      );
      
      // Keep track of attached materials
      setAttachedMaterials({
        ...attachedMaterials,
        [selectedNode.id]: selectedMaterials
      });
      
      setAttachDialogOpen(false);
    }
  };
  
  // Set node icon
  const setNodeIconAndClose = (icon: string) => {
    setNodeIcon(icon);
    setNodeIconDialogOpen(false);
  };
  
  // Save the mindmap
  const saveMindMap = () => {
    if (!title.trim()) {
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
    
    const mindMapData: Partial<MindMap> = {
      title,
      description,
      content: {
        nodes,
        edges,
        version: "1.0"
      },
      tags,
      updatedAt: new Date().toISOString(),
      creator: user.username || 'Unknown',
      starred: false,
      shared: isPublic,
      viewCount: 0
    };
    
    if (isNew) {
      const newMindMap = mindmapService.add(mindMapData);
      toast({
        title: "保存成功",
        description: "思维导图已成功创建"
      });
      // Navigate to edit the newly created mindmap
      navigate(`/mindmap-editor/${newMindMap.id}`);
    } else {
      mindmapService.update(parseInt(id!), mindMapData);
      toast({
        title: "保存成功",
        description: "思维导图已成功更新"
      });
    }
  };
  
  // Open attach material dialog
  const openAttachMaterialDialog = () => {
    if (selectedNode) {
      setAttachDialogOpen(true);
    } else {
      toast({
        title: "请先选择节点",
        description: "您需要先选择一个节点才能附加资料",
        variant: "destructive"
      });
    }
  };
  
  // Auto layout function
  const autoLayout = () => {
    // Simple auto layout (horizontal tree layout)
    // In a real application, you'd use a more sophisticated algorithm
    if (nodes.length === 0) return;
    
    // Find the root node (assuming it's the first node)
    const rootNode = nodes[0];
    const rootId = rootNode.id;
    
    // Calculate levels for each node based on distance from root
    const nodeLevels: Record<string, number> = {};
    nodeLevels[rootId] = 0;
    
    // Calculate levels using BFS
    const queue = [rootId];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const childEdges = edges.filter(edge => edge.source === currentId);
      
      childEdges.forEach(edge => {
        const targetId = edge.target;
        if (nodeLevels[targetId] === undefined) {
          nodeLevels[targetId] = nodeLevels[currentId] + 1;
          queue.push(targetId);
        }
      });
    }
    
    // Get max level
    const maxLevel = Math.max(...Object.values(nodeLevels));
    
    // Count nodes at each level
    const nodesPerLevel: Record<number, number> = {};
    Object.values(nodeLevels).forEach(level => {
      nodesPerLevel[level] = (nodesPerLevel[level] || 0) + 1;
    });
    
    // Set positions based on levels
    const levelWidth = 250;
    const levelHeight = 150;
    const newNodes = nodes.map(node => {
      const level = nodeLevels[node.id] || 0;
      const nodesInThisLevel = nodesPerLevel[level] || 1;
      
      // Find position of this node within its level
      const nodesAtSameLevel = Object.entries(nodeLevels)
        .filter(([_, l]) => l === level)
        .map(([id]) => id);
      
      const positionInLevel = nodesAtSameLevel.indexOf(node.id);
      const levelStartY = 300 - (nodesInThisLevel * levelHeight / 2);
      
      return {
        ...node,
        position: {
          x: 400 + (level - maxLevel / 2) * levelWidth,
          y: levelStartY + positionInLevel * levelHeight
        }
      };
    });
    
    setNodes(newNodes);
    
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView();
      }, 100);
    }
  };
  
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/mindmaps')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="思维导图标题"
              className="text-xl font-bold border-0 p-0 h-auto focus-visible:ring-0 bg-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Switch 
              id="public" 
              checked={isPublic} 
              onCheckedChange={setIsPublic} 
            />
            <Label htmlFor="public" className="cursor-pointer">
              {isPublic ? '公开' : '私有'}
            </Label>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={openAttachMaterialDialog}
          >
            <FileText className="h-4 w-4" />
            附加资料
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={addNode}
          >
            <Plus className="h-4 w-4" />
            添加节点
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={autoLayout}
          >
            <Layout className="h-4 w-4" />
            自动排列
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="flex items-center gap-1"
            onClick={saveMindMap}
          >
            <Save className="h-4 w-4" />
            保存
          </Button>
        </div>
      </div>
      
      {/* Tags */}
      <div className="px-4 py-2 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">标签:</div>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTag(tag)} 
                />
              </Badge>
            ))}
          </div>
          <div className="flex items-center">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="添加标签..."
              className="h-7 text-xs w-32"
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2" 
              onClick={addTag}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="px-4 py-2 border-b">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="思维导图描述（可选）"
          className="resize-none border-0 p-0 focus-visible:ring-0 bg-transparent text-sm"
          rows={1}
        />
      </div>
      
      {/* Mindmap Canvas */}
      <div className="flex-1 w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onNodeDoubleClick={(_, node) => {
            // If node has URL, open it
            if (node.data.url) {
              window.open(node.data.url, '_blank');
              return;
            }
            
            // Navigate to materials view if the node has materials
            if (node.data.materials && node.data.materials.length > 0) {
              navigate(`/mindmap-materials/${id}/${node.id}`);
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
      
      {/* Node Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑节点</DialogTitle>
            <DialogDescription>
              修改节点内容和样式
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nodeName">名称</Label>
              <Input
                id="nodeName"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nodeNotes">备注</Label>
              <Textarea
                id="nodeNotes"
                value={nodeNotes}
                onChange={(e) => setNodeNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nodeColor">颜色</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="nodeColor"
                  type="color"
                  value={nodeColor}
                  onChange={(e) => setNodeColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={nodeColor}
                  onChange={(e) => setNodeColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>图标</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNodeIconDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Image className="h-4 w-4" />
                  {nodeIcon ? '更换图标' : '选择图标'}
                </Button>
                {nodeIcon && <span className="text-sm">{nodeIcon}</span>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nodeUrl">链接 URL (可选)</Label>
              <Input
                id="nodeUrl"
                placeholder="https://example.com"
                value={nodeUrl}
                onChange={(e) => setNodeUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">添加 URL 后双击节点将打开此链接</p>
            </div>
            
            {/* Show attached materials if any */}
            {selectedNode && selectedNode.data.materials && selectedNode.data.materials.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>已附加资料</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={openAttachMaterialDialog}
                    className="text-xs"
                  >
                    管理资料
                  </Button>
                </div>
                <div className="text-sm space-y-1">
                  {selectedNode.data.materials.map((material: Material, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span>{material.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full flex items-center justify-center gap-1"
                onClick={() => {
                  setEditDialogOpen(false);
                  if (selectedNode) {
                    startConnecting(selectedNode.id);
                  }
                }}
              >
                <Link2 className="h-4 w-4" />
                连接到其他节点
              </Button>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              size="sm"
              className="flex items-center gap-1"
              onClick={deleteNode}
            >
              <Trash2 className="h-4 w-4" />
              删除节点
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                取消
              </Button>
              <Button 
                onClick={updateNode}
              >
                更新
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Attach Material Dialog */}
      <AttachMaterialDialog
        open={attachDialogOpen}
        onOpenChange={setAttachDialogOpen}
        materials={materials}
        selectedMaterials={selectedNode?.data.materials || []}
        onConfirm={attachMaterials}
      />
      
      {/* Node Icon Dialog */}
      <Dialog open={nodeIconDialogOpen} onOpenChange={setNodeIconDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>选择节点图标</DialogTitle>
            <DialogDescription>
              从下面的选项中选择一个图标
            </DialogDescription>
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
