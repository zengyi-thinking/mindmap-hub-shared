import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Search, 
  Folder, 
  FolderOpen, 
  FileText, 
  Upload, 
  Download, 
  ArrowLeft,
  Info,
  User,
  Calendar,
  Eye
} from 'lucide-react';
import { ReactFlow, Background, Controls, BackgroundVariant, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useToast } from '@/components/ui/use-toast';
import { userFilesService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { tagHierarchy } from '@/data/tagHierarchy';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FileUploader from '@/components/materials/FileUploader';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FilePreview from '@/components/materials/FilePreview';
import MaterialNode from '@/components/mindmap/MaterialNode';

// 注册自定义节点类型
const nodeTypes = {
  materialNode: MaterialNode
};

const GlobalMaterialMap: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // 状态管理
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [folderMaterials, setFolderMaterials] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // 上传表单状态
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // 初始化时生成导图
  useEffect(() => {
    generateMindMap();
  }, []);
  
  // 当路径变化时，获取当前文件夹的资料
  useEffect(() => {
    if (currentPath.length > 0) {
      const filesInFolder = userFilesService.getByDirectFolder(currentPath);
      setFolderMaterials(filesInFolder.filter(file => file.approved));
    } else {
      setFolderMaterials([]);
    }
  }, [currentPath]);
  
  // 生成思维导图节点和边
  const generateMindMap = () => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];
    
    // 添加根节点
    generatedNodes.push({
      id: 'root',
      type: 'materialNode',
      position: { x: 0, y: 0 },
      data: {
        label: '资料总览',
        icon: 'folder',
        color: '#4361ee',
        isRoot: true
      }
    });
    
    // 递归生成节点和边
    const generateNodesAndEdges = (
      categories: typeof tagHierarchy,
      parentId: string,
      level: number,
      parentX: number,
      parentY: number,
      index: number,
      totalSiblings: number
    ) => {
      // 计算每个级别的子节点间距和位置
      const xSpacing = level === 1 ? 250 : 200;
      const ySpacing = level === 1 ? 120 : 80;
      
      // 计算这个级别的总宽度
      const totalWidth = (totalSiblings - 1) * xSpacing;
      // 计算起始X位置，使子节点在父节点两侧均匀分布
      const startX = parentX - totalWidth / 2;
      
      categories.forEach((category, i) => {
        const nodeId = `${parentId}-${category.id}`;
        const x = startX + i * xSpacing;
        const y = parentY + (level === 1 ? 150 : 100);
        
        // 创建当前节点
        generatedNodes.push({
          id: nodeId,
          type: 'materialNode',
          position: { x, y },
          data: {
            label: category.name,
            icon: 'folder',
            color: level === 1 ? '#4cc9f0' : '#4895ef',
            folderPath: nodeId.split('-').slice(1).map(id => {
              // 查找对应的名称
              const findName = (categories: typeof tagHierarchy, id: string): string => {
                for (const cat of categories) {
                  if (cat.id === id) return cat.name;
                  if (cat.children) {
                    const found = findName(cat.children, id);
                    if (found) return found;
                  }
                }
                return id;
              };
              
              return findName(tagHierarchy, id);
            })
          }
        });
        
        // 创建连接到父节点的边
        generatedEdges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'smoothstep',
          style: { stroke: '#94a3b8' }
        });
        
        // 如果有子类别，递归处理
        if (category.children && category.children.length > 0) {
          generateNodesAndEdges(
            category.children,
            nodeId,
            level + 1,
            x,
            y,
            i,
            category.children.length
          );
        }
      });
    };
    
    // 从根节点开始生成思维导图
    generateNodesAndEdges(tagHierarchy, 'root', 1, 0, 0, 0, tagHierarchy.length);
    
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  };
  
  // 处理节点点击
  const handleNodeClick = (event, node) => {
    // 如果节点有folderPath，设置当前路径
    if (node.data.folderPath && node.data.folderPath.length > 0) {
      setCurrentPath(node.data.folderPath);
    }
  };
  
  // 预览资料
  const openPreview = (material) => {
    setSelectedMaterial(material);
    setPreviewOpen(true);
    userFilesService.incrementViews(material.id);
  };
  
  // 关闭预览
  const closePreview = () => {
    setPreviewOpen(false);
  };
  
  // 下载资料
  const downloadMaterial = (material) => {
    if (!material || !material.file || !material.file.dataUrl) {
      toast({
        title: "下载失败",
        description: "文件数据不完整或不可用",
        variant: "destructive"
      });
      return;
    }
    
    const link = document.createElement('a');
    link.href = material.file.dataUrl;
    link.download = material.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    userFilesService.incrementDownloads(material.id);
    
    toast({
      title: "下载开始",
      description: `正在下载 ${material.title}`
    });
  };
  
  // 导航到指定层级
  const navigateTo = (index: number) => {
    if (index < 0) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };
  
  // 打开上传表单
  const handleOpenUploadForm = () => {
    if (currentPath.length === 0) {
      toast({
        title: "请先选择上传位置",
        description: "请先在导图中点击一个分类节点，或在左侧选择一个资料夹",
        variant: "destructive"
      });
      return;
    }
    
    setShowUploadForm(true);
  };
  
  // 关闭上传表单
  const closeUploadForm = () => {
    if (!isUploading) {
      setShowUploadForm(false);
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setUploadProgress(0);
    }
  };
  
  // 模拟上传进度
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  // 处理文件上传
  const handleUpload = () => {
    if (!title.trim()) {
      toast({
        title: "请输入资料标题",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedFile) {
      toast({
        title: "请选择要上传的文件",
        variant: "destructive"
      });
      return;
    }
    
    // 验证文件大小 (最大 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "上传文件大小不能超过50MB",
        variant: "destructive"
      });
      return;
    }
    
    // 模拟文件上传
    simulateUpload();
    
    // 将文件转换为Data URL以存储在localStorage
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const dataUrl = event.target.result.toString();
        
        // 创建要保存的文件对象
        const fileToSave = {
          file: {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            lastModified: selectedFile.lastModified,
            dataUrl: dataUrl
          },
          title: title,
          description: description || '',
          tags: currentPath, // 使用当前路径作为标签
          folderPath: currentPath, // 保存文件夹路径
          uploadTime: new Date().toISOString(),
          userId: user?.id || 0,
          username: user?.username || 'Guest',
          approved: user?.role === 'admin', // 如果是管理员上传，自动批准
          downloadCount: 0,
          viewCount: 0,
          likeCount: 0,
          favoriteCount: 0
        };
        
        // 保存到localStorage
        const savedFile = userFilesService.add(fileToSave);
        
        toast({
          title: "上传成功",
          description: user?.role === 'admin' 
            ? "您的资料已成功上传并发布" 
            : "您的资料已成功上传，正在等待审核",
        });
        
        // 关闭上传表单，重置表单
        setShowUploadForm(false);
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        
        // 刷新当前文件夹的资料
        const filesInFolder = userFilesService.getByDirectFolder(currentPath);
        setFolderMaterials(filesInFolder.filter(file => file.approved));
      }
    };
    
    reader.readAsDataURL(selectedFile);
  };
  
  // 初始化 ReactFlow
  const onInitReactFlow = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);
  
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/material-search')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">全平台资料导图</h1>
            <p className="text-muted-foreground">浏览、搜索和上传共享资料</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索资料..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleOpenUploadForm}
            className="bg-primary hover:bg-primary/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            上传资料
          </Button>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* 左侧导航区域 */}
        <Card className="xl:col-span-1 h-[600px] flex flex-col">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-lg">资料夹浏览</CardTitle>
            <CardDescription>按层级浏览资料分类</CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 flex-grow flex flex-col">
            {/* 面包屑导航 */}
            <div className="flex items-center flex-wrap gap-1 text-sm mb-4">
              <Badge 
                variant={currentPath.length === 0 ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => navigateTo(-1)}
              >
                <Folder className="h-3.5 w-3.5 mr-1" /> 
                根目录
              </Badge>
              
              {currentPath.map((folder, index) => (
                <React.Fragment key={index}>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <Badge
                    variant={index === currentPath.length - 1 ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => navigateTo(index)}
                  >
                    {folder}
                  </Badge>
                </React.Fragment>
              ))}
            </div>
            
            {/* 文件夹内容 */}
            <ScrollArea className="flex-grow">
              {currentPath.length === 0 ? (
                <div className="space-y-2">
                  {tagHierarchy.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-2 p-2 rounded-md border hover:bg-primary/5 cursor-pointer"
                      onClick={() => setCurrentPath([category.name])}
                    >
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm">{category.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 寻找当前路径的子文件夹 */}
                  {(() => {
                    let currentCategories = tagHierarchy;
                    let subFolders = [];
                    
                    // 查找当前路径对应的子文件夹
                    for (let i = 0; i < currentPath.length; i++) {
                      const folder = currentPath[i];
                      const found = currentCategories.find(cat => cat.name === folder);
                      
                      if (found && found.children) {
                        if (i === currentPath.length - 1) {
                          subFolders = found.children;
                        }
                        currentCategories = found.children;
                      } else {
                        break;
                      }
                    }
                    
                    return (
                      <>
                        {/* 子文件夹 */}
                        {subFolders.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">子分类</h3>
                            <div className="space-y-1">
                              {subFolders.map(folder => (
                                <div
                                  key={folder.id}
                                  className="flex items-center gap-2 p-2 rounded-md border hover:bg-primary/5 cursor-pointer"
                                  onClick={() => setCurrentPath([...currentPath, folder.name])}
                                >
                                  <FolderOpen className="h-4 w-4 text-primary" />
                                  <span className="text-sm">{folder.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* 当前文件夹内的资料 */}
                        {folderMaterials.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">资料</h3>
                            <div className="space-y-2">
                              {folderMaterials.map(material => (
                                <div
                                  key={material.id}
                                  className="flex items-center justify-between p-2 rounded-md border hover:bg-primary/5 cursor-pointer"
                                  onClick={() => openPreview(material)}
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="text-sm">{material.title}</span>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      downloadMaterial(material);
                                    }}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {subFolders.length === 0 && folderMaterials.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                            <p>此资料夹为空</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4"
                              onClick={handleOpenUploadForm}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              上传资料
                            </Button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* 右侧思维导图区域 */}
        <Card className="xl:col-span-3 h-[600px] flex flex-col">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-lg">资料导图</CardTitle>
            <CardDescription>点击节点浏览资料</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0 flex-grow relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodeClick={handleNodeClick}
              fitView
              attributionPosition="bottom-right"
              zoomOnScroll={true}
              panOnScroll={true}
              elementsSelectable={true}
              onInit={onInitReactFlow}
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
          </CardContent>
        </Card>
      </div>
      
      {/* 资料预览对话框 */}
      <Dialog open={previewOpen} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedMaterial && (
            <div className="mt-4">
              <div className="mb-4 space-y-2">
                <p className="text-muted-foreground">{selectedMaterial.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMaterial.tags && selectedMaterial.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">{tag}</Badge>
                  ))}
                </div>
                
                {selectedMaterial.folderPath && selectedMaterial.folderPath.length > 0 && (
                  <div className="flex items-center gap-1 text-sm mt-2">
                    <Folder className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {selectedMaterial.folderPath.join(' → ')}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(selectedMaterial.uploadTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{selectedMaterial.username}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{selectedMaterial.viewCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{selectedMaterial.downloadCount || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <FilePreview file={selectedMaterial.file} />
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={() => downloadMaterial(selectedMaterial)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载文件
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 上传表单对话框 */}
      <Dialog open={showUploadForm} onOpenChange={closeUploadForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>上传资料到「{currentPath.join(' → ')}」</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">资料标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入资料标题"
                disabled={isUploading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">资料描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简要描述资料内容和用途"
                rows={3}
                disabled={isUploading}
              />
            </div>
            
            <div className="space-y-2">
              <FileUploader
                selectedFile={selectedFile}
                onFileChange={setSelectedFile}
                disabled={isUploading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>上传位置</Label>
              <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-900 text-sm">
                {currentPath.join(' → ')}
              </div>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>上传进度</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={closeUploadForm}
              disabled={isUploading}
            >
              取消
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-primary hover:bg-primary/90"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <span>上传中</span>
                  <span>({uploadProgress}%)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>上传文件</span>
                </div>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobalMaterialMap; 