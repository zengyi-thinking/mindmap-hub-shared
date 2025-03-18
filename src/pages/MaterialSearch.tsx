import React, { useState, useEffect, useCallback } from 'react';
import MaterialSearchContainer from '@/features/material-search/MaterialSearchContainer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Search, 
  FileText, 
  TrendingUp, 
  Users, 
  Globe, 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  Upload, 
  Download, 
  ArrowLeft,
  Info,
  User,
  Calendar,
  Eye
} from 'lucide-react';
import styles from './MaterialSearch.module.css';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { mindmapService } from '@/lib/mindmapStorage';
import { MindMap } from '@/types/mindmap';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
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

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode | ((props: { error: string }) => React.ReactNode);
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean, errorMessage: string }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error?.message || '未知错误' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("错误边界捕获到错误:", error);
    console.error("错误堆栈信息:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 检查fallback是否是函数，如果是，传递错误信息
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({ error: this.state.errorMessage });
      }
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// 错误回退UI
interface ErrorFallbackProps {
  error?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-red-500 mb-4">页面加载出错</h2>
    <p className="mb-2 text-gray-600">很抱歉，加载资料搜索页面时出现了问题。</p>
    {error && (
      <p className="text-sm text-red-500 mb-4 p-2 bg-red-50 rounded">
        错误信息: {error}
      </p>
    )}
    <Button 
      onClick={() => window.location.reload()}
      className="bg-primary hover:bg-primary/90"
    >
      刷新页面
    </Button>
  </div>
);

/**
 * 材料搜索页面
 * 包含资料标签化导图搜索和全平台资料导图浏览
 */
const MaterialSearch: React.FC = () => {
  // 从URL参数获取初始tab
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tabFromUrl = params.get('tab');
  
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || 'search');
  const [publicMindMaps, setPublicMindMaps] = useState<MindMap[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // 资料导图相关状态
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
  
  // 加载公开的思维导图
  useEffect(() => {
    if (activeTab === 'mindmaps') {
      const sharedMindMaps = mindmapService.getShared();
      setPublicMindMaps(sharedMindMaps);
    }
  }, [activeTab]);
  
  // 当切换到资料导图标签时，生成导图
  useEffect(() => {
    if (activeTab === 'mindmaps') {
      generateMindMap();
    }
  }, [activeTab]);
  
  // 当路径变化时，获取当前文件夹的资料
  useEffect(() => {
    if (currentPath.length > 0) {
      const filesInFolder = userFilesService.getByDirectFolder(currentPath);
      setFolderMaterials(filesInFolder.filter(file => file.approved));
    } else {
      setFolderMaterials([]);
    }
  }, [currentPath]);
  
  // 查看思维导图
  const viewMindMap = (id: number) => {
    navigate(`/mindmap-view/${id}`);
  };
  
  // 切换tab时更新URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/search?tab=${value}`, { replace: true });
  };
  
  // 生成思维导图节点和边
  const generateMindMap = () => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];
    
    // 添加根节点 - 横向布局，放在左侧中间
    generatedNodes.push({
      id: 'root',
      type: 'materialNode',
      position: { x: 50, y: 300 },
      data: {
        label: '资料总览',
        icon: 'Database',
        isRoot: true
      }
    });
    
    // 递归生成节点和边 - 横向布局
    const generateNodesAndEdges = (
      categories: typeof tagHierarchy,
      parentId: string,
      level: number,
      parentX: number,
      parentY: number,
      totalSiblings: number
    ) => {
      // 横向布局参数调整
      const xSpacing = 250; // 水平间距
      const levelHeight = 200; // 每个级别的子节点垂直分布高度
      
      // 计算子节点总高度
      const totalHeight = categories.length <= 1 
        ? 0 
        : levelHeight * (categories.length - 1);
      
      // 计算垂直起始位置，使子节点围绕父节点垂直居中
      const startY = parentY - totalHeight / 2;
      
      categories.forEach((category, i) => {
        const nodeId = `${parentId}-${category.id}`;
        const x = parentX + xSpacing; // 水平位置向右递增
        const y = categories.length <= 1 
          ? parentY // 只有一个子节点时居中
          : startY + i * levelHeight; // 多个子节点时垂直分布
        
        // 创建当前节点
        generatedNodes.push({
          id: nodeId,
          type: 'materialNode',
          position: { x, y },
          data: {
            label: category.name,
            icon: 'Folder',
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
        
        // 创建连接到父节点的边 - 使用曲线类型提高可视性
        generatedEdges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'smoothstep',
          animated: level === 1, // 第一级动画效果更明显
          style: { 
            stroke: '#3b82f6',
            strokeWidth: level === 1 ? 2 : 1.5,
          }
        });
        
        // 如果有子类别，递归处理
        if (category.children && category.children.length > 0) {
          generateNodesAndEdges(
            category.children,
            nodeId,
            level + 1,
            x,
            y,
            category.children.length
          );
        }
      });
    };
    
    // 从根节点开始生成思维导图
    generateNodesAndEdges(tagHierarchy, 'root', 1, 50, 300, tagHierarchy.length);
    
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
    <div className="w-full">
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={handleTabChange}>
        <div className={`container mx-auto mb-6 ${styles.navGradient} p-4 rounded-lg shadow-md`}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-transparent">
            <TabsTrigger 
              value="search" 
              className={`flex items-center gap-2 ${styles.tabUnderline} ${activeTab === 'search' ? styles.activeTab : ''}`}
            >
              <Search className={`h-4 w-4 ${styles.dynamicIcon} ${styles.dualColorIcon}`} />
              <span className={styles.buttonText}>资料标签化导图搜索</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mindmaps" 
              className={`flex items-center gap-2 ${styles.tabUnderline} ${activeTab === 'mindmaps' ? styles.activeTab : ''}`}
            >
              <Brain className={`h-4 w-4 ${styles.dynamicIcon} ${styles.dualColorIcon}`} />
              <span className={styles.buttonText}>全平台资料导图</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="search">
          <div className={styles.emptyStateContainer}>
            <ParticleBackground 
              className={styles.particleBackground} 
              particleCount={60} 
              colorScheme="mixed" 
              density="high" 
              speed="fast"
            />
            <div className={styles.emptyStateContent}>
              <ErrorBoundary fallback={<ErrorFallback error="无法加载资料标签化导图搜索组件" />}>
              <MaterialSearchContainer />
              </ErrorBoundary>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mindmaps">
          <ErrorBoundary fallback={<ErrorFallback error="无法加载全平台资料导图组件" />}>
          <div className="w-full max-w-6xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
              <h1 className={`text-3xl ${styles.mainTitle} text-primary`}>全平台资料导图</h1>
              <p className={`text-muted-foreground ${styles.hintText}`}>
                浏览其他用户创建并公开分享的思维导图，探索更多学习资源
              </p>
                </div>
                
                <div className="flex items-center gap-2">
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
            </motion.div>
            
              {/* 显示用户分享的思维导图 */}
              {publicMindMaps.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">公开思维导图</h2>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {publicMindMaps.map((mindMap, index) => (
                  <motion.div
                    key={mindMap.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index % 3) }}
                  >
                    <Card className={`overflow-hidden border-primary/20 h-full flex flex-col ${styles.cardHoverEffect}`}>
                      <CardHeader className="p-4 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-primary/10">
                        <CardTitle className="text-lg font-semibold text-primary">{mindMap.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 pb-0 flex-grow">
                        <div className="w-full h-32 rounded-md bg-primary/5 flex items-center justify-center mb-2 border border-primary/10">
                          <Brain className="h-10 w-10 text-primary/50" />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {mindMap.description || '无描述'}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span>{mindMap.viewCount || 0} 次浏览</span>
                        </div>
                        {mindMap.tags && mindMap.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {mindMap.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className={`text-xs bg-primary/5 hover:bg-primary/10 border-primary/10 ${styles.tagPulse}`}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-t border-primary/10 mt-auto">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 bg-primary/10">
                            <AvatarFallback className="text-xs text-primary">
                              {mindMap.creator?.substring(0, 2) || 'UN'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {mindMap.creator || '未知用户'}
                          </span>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => viewMindMap(mindMap.id)}>
                          查看
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
                </div>
              )}
              
              {/* 资料导图浏览区域 */}
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
            </div>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
      
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

export default MaterialSearch;
