import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Brain, Eye, FileText, Download, Upload, Plus } from 'lucide-react';
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { mindmapService } from '@/lib/mindmapStorage';
import { userFilesService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { MindMap } from '@/modules/mindmap/types/mindmap';
import MaterialNode from '@/modules/mindmap/components/MaterialNode';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Material } from '@/modules/materials/types/materials';
import NodeUploadForm from '@/modules/mindmap/components/NodeUploadForm';
import { toast } from '@/components/ui/use-toast';

// Register custom node types
const nodeTypes = {
  materialNode: MaterialNode
};

const MindMapView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mindMap, setMindMap] = useState<MindMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [selectedNodeMaterials, setSelectedNodeMaterials] = useState<Material[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    if (id) {
      const mindmap = mindmapService.getById(parseInt(id));
      
      if (mindmap) {
        setMindMap(mindmap);
        
        // Update view count (in a real app, this would be done server-side)
        mindmapService.update(parseInt(id), {
          viewCount: (mindmap.viewCount || 0) + 1
        });
      }
      
      setLoading(false);
    }
  }, [id]);
  
  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    
    // 获取节点关联的资料
    const materials = node.data.materials || [];
    
    // 如果思维导图节点有材料ID，但不包含完整材料数据，则从存储中获取材料
    if (materials.length > 0 && typeof materials[0] === 'number') {
      const materialObjects = materials.map(materialId => {
        return userFilesService.getById(materialId);
      }).filter(m => m !== null);
      
      setSelectedNodeMaterials(materialObjects);
    } else {
      // 已经是完整的材料对象
      setSelectedNodeMaterials(materials);
    }
  };
  
  const handleNodeDoubleClick = (event, node) => {
    if (node.data.materials && node.data.materials.length > 0) {
      navigate(`/mindmap-materials/${id}/${node.id}`);
    }
  };
  
  const handleDownload = (material: Material) => {
    // 如果有文件数据URL，直接下载
    if (material.file && material.file.dataUrl) {
      const link = document.createElement('a');
      link.href = material.file.dataUrl;
      link.download = material.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 增加下载计数
      userFilesService.incrementDownloads(material.id);
      
      toast({
        title: "下载开始",
        description: `正在下载 ${material.title}`
      });
    } 
    // 如果有文件URL，在新标签页打开
    else if (material.fileUrl) {
      window.open(material.fileUrl, '_blank');
    } else {
      toast({
        title: "下载失败",
        description: "文件数据不完整或不可用",
        variant: "destructive"
      });
    }
  };
  
  const handleUploadToNode = () => {
    if (!selectedNode) {
      toast({
        title: "请先选择节点",
        description: "请先点击左侧思维导图中的一个节点",
        variant: "destructive"
      });
      return;
    }
    
    setShowUploadForm(true);
  };
  
  const closeUploadForm = () => {
    setShowUploadForm(false);
  };
  
  // 处理上传成功，将文件ID添加到思维导图节点的materials数组中
  const handleUploadSuccess = (materialId: number) => {
    if (!mindMap || !selectedNode || !id) return;
    
    // 获取当前思维导图
    const currentMindMap = { ...mindMap };
    
    // 获取并更新节点
    if (currentMindMap.content && currentMindMap.content.nodes) {
      const nodeIndex = currentMindMap.content.nodes.findIndex(node => node.id === selectedNode.id);
      
      if (nodeIndex !== -1) {
        // 确保node.data.materials是数组
        if (!currentMindMap.content.nodes[nodeIndex].data.materials) {
          currentMindMap.content.nodes[nodeIndex].data.materials = [];
        }
        
        // 添加材料ID到数组
        currentMindMap.content.nodes[nodeIndex].data.materials.push(materialId);
        
        // 更新思维导图
        mindmapService.update(parseInt(id), {
          content: currentMindMap.content
        });
        
        // 更新状态
        setMindMap(currentMindMap);
        
        // 刷新节点材料
        const material = userFilesService.getById(materialId);
        if (material) {
          setSelectedNodeMaterials([...selectedNodeMaterials, material]);
        }
        
        toast({
          title: "上传成功",
          description: "文件已成功上传并关联到节点"
        });
      }
    }
  };
  
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    );
  }
  
  if (!mindMap) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
        <div className="text-center py-16">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-muted mb-4">
            <Brain className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">思维导图不存在</h2>
          <p className="text-muted-foreground">
            您查找的思维导图不存在或已被删除
          </p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/material-search')}
          >
            返回资料搜索
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/material-search')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{mindMap.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>更新于 {mindMap.updatedAt}</span>
              <Eye className="h-4 w-4 ml-2" />
              <span>{mindMap.viewCount || 0} 次查看</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user && (
            <Button 
              variant="default" 
              onClick={() => navigate(`/mindmap/${id}/edit`)}
              className="mr-2"
            >
              编辑思维导图
            </Button>
          )}
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {mindMap.creator?.substring(0, 2) || 'UN'}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div>{mindMap.creator || '未知用户'}</div>
            <div className="text-xs text-muted-foreground">创建者</div>
          </div>
        </div>
      </div>
      
      {mindMap.description && (
        <div className="text-muted-foreground text-sm">
          {mindMap.description}
        </div>
      )}
      
      {mindMap.tags && mindMap.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {mindMap.tags.map((tag, i) => (
            <Badge key={i} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px] border rounded-lg overflow-hidden">
          {mindMap.content && mindMap.content.nodes && mindMap.content.edges ? (
            <ReactFlow
              nodes={mindMap.content.nodes}
              edges={mindMap.content.edges}
              nodeTypes={nodeTypes}
              onNodeClick={handleNodeClick}
              onNodeDoubleClick={handleNodeDoubleClick}
              fitView
              attributionPosition="bottom-right"
              zoomOnScroll={true}
              panOnScroll={true}
              nodesDraggable={false}
              elementsSelectable={true}
            >
              <Background 
                variant={"dots" as BackgroundVariant}
                gap={20} 
                size={1} 
                color="hsl(var(--muted-foreground) / 0.3)"
              />
              <Controls 
                showInteractive={false}
                position="bottom-right"
                style={{
                  borderRadius: '8px',
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))'
                }}
              />
            </ReactFlow>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">该思维导图没有内容</p>
            </div>
          )}
        </div>
        
        <div className="h-[500px] border rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-medium">
                  {selectedNode ? selectedNode.data.label : '节点资料'} 
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedNode ? '查看该节点关联的资料' : '点击左侧节点查看关联资料'}
                </p>
              </div>
              
              {user && selectedNode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleUploadToNode}
                  className="flex items-center gap-1"
                >
                  <Upload className="h-3 w-3" />
                  上传
                </Button>
              )}
            </div>
            
            <ScrollArea className="flex-1">
              {selectedNode ? (
                selectedNodeMaterials.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {selectedNodeMaterials.map((material) => (
                      <Card key={material.id} className="overflow-hidden">
                        <CardHeader className="p-3 pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            {material.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            {material.file && material.file.type && `${material.file.type.split('/')[1]} · `}
                            {material.file && material.file.size && `${(material.file.size / 1024 / 1024).toFixed(2)} MB`}
                            {material.fileType && !material.file && `${material.fileType} · `}
                            {material.fileSize && !material.file && `${(material.fileSize / 1024 / 1024).toFixed(2)} MB`}
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleDownload(material)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            下载
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-4 text-center">
                    <div>
                      <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground">该节点没有关联资料</p>
                      {user && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleUploadToNode}
                          className="mt-4 flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          上传文件
                        </Button>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center p-4 text-center">
                  <div>
                    <Brain className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-muted-foreground">点击左侧思维导图的节点查看关联资料</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
      
      {/* 节点上传表单对话框 */}
      {showUploadForm && selectedNode && (
        <NodeUploadForm 
          open={showUploadForm}
          onClose={closeUploadForm}
          nodeId={selectedNode.id}
          nodeName={selectedNode.data.label}
          folderPath={selectedNode.data.folderPath || []}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default MindMapView;

