import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { userFilesService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { 
  Search, 
  Tag, 
  Clock, 
  ThumbsUp, 
  Download, 
  Eye, 
  Filter, 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  ArrowLeft,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FilePreview from './FilePreview';
import { useToast } from '@/components/ui/use-toast';

const MaterialBrowser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [materials, setMaterials] = useState<any[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentFolderPath, setCurrentFolderPath] = useState<string[]>([]);
  const [subFolders, setSubFolders] = useState<string[]>([]);
  const [folderMaterials, setFolderMaterials] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    loadMaterials();
  }, []);
  
  const loadMaterials = () => {
    const allFiles = userFilesService.getAll();
    const approvedFiles = allFiles.filter(file => file.approved);
    setMaterials(approvedFiles);
    setFilteredMaterials(approvedFiles);
  };
  
  // 根据当前文件夹路径获取子文件夹和文件
  useEffect(() => {
    if (activeTab === 'folders') {
      const subFolderList = userFilesService.getSubFolders(currentFolderPath);
      setSubFolders(Array.isArray(subFolderList) ? subFolderList as string[] : []);
      
      const filesInFolder = userFilesService.getByDirectFolder(currentFolderPath);
      setFolderMaterials(filesInFolder.filter(file => file.approved));
    }
  }, [activeTab, currentFolderPath]);
  
  const navigateToFolder = (folder: string) => {
    const newPath = [...currentFolderPath, folder];
    setCurrentFolderPath(newPath);
  };
  
  const navigateUp = () => {
    if (currentFolderPath.length > 0) {
      setCurrentFolderPath(currentFolderPath.slice(0, -1));
    }
  };
  
  const navigateTo = (index: number) => {
    if (index < 0) {
      setCurrentFolderPath([]);
    } else {
      setCurrentFolderPath(currentFolderPath.slice(0, index + 1));
    }
  };
  
  // 当搜索查询或活动标签更改时筛选材料
  useEffect(() => {
    if (activeTab === 'folders') return;
    
    let filtered = [...materials];
    
    // 应用搜索查询
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(query) || 
        material.description.toLowerCase().includes(query) ||
        (material.tags && material.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // 应用标签筛选
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'recent':
          filtered = [...filtered].sort((a, b) => 
            new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
          );
          break;
        case 'popular':
          filtered = [...filtered].sort((a, b) => 
            (b.downloads || 0) - (a.downloads || 0)
          );
          break;
        case 'mine':
          filtered = filtered.filter(material => material.userId === user?.id);
          break;
        default:
          break;
      }
    }
    
    setFilteredMaterials(filtered);
  }, [searchQuery, activeTab, materials, user]);
  
  const openPreview = (material) => {
    setSelectedMaterial(material);
    setPreviewOpen(true);
    userFilesService.incrementViews(material.id);
  };
  
  const closePreview = () => {
    setPreviewOpen(false);
  };
  
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
  
  const renderFolderBrowser = () => {
    return (
      <div className="space-y-4">
        {/* 面包屑导航 */}
        <div className="flex items-center flex-wrap gap-1 text-sm">
          <Badge 
            variant={currentFolderPath.length === 0 ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() => navigateTo(-1)}
          >
            <Folder className="h-3.5 w-3.5 mr-1" /> 
            根目录
          </Badge>
          
          {currentFolderPath.map((folder, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <Badge
                variant={index === currentFolderPath.length - 1 ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => navigateTo(index)}
              >
                {folder}
              </Badge>
            </React.Fragment>
          ))}
        </div>
        
        {/* 子文件夹 */}
        {subFolders.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">文件夹</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {subFolders.map(folder => (
                <div
                  key={folder}
                  className="flex items-center gap-2 p-2 rounded-md border hover:bg-primary/5 cursor-pointer"
                  onClick={() => navigateToFolder(folder)}
                >
                  <FolderOpen className="h-4 w-4 text-primary" />
                  <span className="truncate text-sm">{folder}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 当前文件夹中的文件 */}
        {folderMaterials.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">文件</h3>
            <div className="grid gap-3">
              {folderMaterials.map(material => (
                <MaterialCard 
                  key={material.id} 
                  material={material} 
                  onPreview={openPreview} 
                  onDownload={downloadMaterial} 
                />
              ))}
            </div>
          </div>
        ) : (
          currentFolderPath.length > 0 && subFolders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              此文件夹为空
            </div>
          )
        )}
        
        {currentFolderPath.length === 0 && subFolders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            没有找到任何文件夹
          </div>
        )}
      </div>
    );
  };
  
  // 呈现资料列表
  const renderMaterialsList = () => {
    return filteredMaterials.length > 0 ? (
      <div className="grid gap-3">
        {filteredMaterials.map(material => (
          <MaterialCard 
            key={material.id} 
            material={material} 
            onPreview={openPreview} 
            onDownload={downloadMaterial} 
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-16 text-muted-foreground">
        {searchQuery ? `没有找到匹配 "${searchQuery}" 的资料` : '没有可用的资料'}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card shadow-lg border-primary/20">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-t-lg border-b border-primary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <FileText className="h-5 w-5" />
            浏览资料
          </CardTitle>
          <CardDescription>
            搜索和浏览全平台共享的资料
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
                placeholder="搜索资料..."
          value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
        />
      </div>
            <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">全部资料</TabsTrigger>
              <TabsTrigger value="recent">最新上传</TabsTrigger>
              <TabsTrigger value="popular">热门下载</TabsTrigger>
              <TabsTrigger value="folders">文件夹浏览</TabsTrigger>
              {user && <TabsTrigger value="mine">我的上传</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="all">
              {renderMaterialsList()}
            </TabsContent>
            
            <TabsContent value="recent">
              {renderMaterialsList()}
            </TabsContent>
            
            <TabsContent value="popular">
              {renderMaterialsList()}
            </TabsContent>
            
            <TabsContent value="folders">
              {renderFolderBrowser()}
            </TabsContent>
            
            <TabsContent value="mine">
              {renderMaterialsList()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
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
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(selectedMaterial.uploadTime).toLocaleDateString()}</span>
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
    </motion.div>
  );
};

// 材料卡片组件
const MaterialCard = ({ material, onPreview, onDownload }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-[120px] h-24 sm:h-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-b sm:border-b-0 sm:border-r">
          <FileIcon type={material.file?.type} />
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="font-medium line-clamp-1">{material.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
            </div>
            
            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
              <Badge variant="outline" className="text-xs">
                {formatFileSize(material.file?.size || 0)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(material.uploadTime).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {material.tags && material.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {material.tags && material.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{material.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{material.viewCount || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{material.downloadCount || 0}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onPreview(material)}>
                预览
              </Button>
              <Button variant="default" size="sm" onClick={() => onDownload(material)}>
                下载
              </Button>
            </div>
        </div>
        </div>
    </div>
    </Card>
  );
};

// 根据文件类型显示图标
const FileIcon = ({ type }) => {
  if (!type) return <FileText className="h-10 w-10 text-muted-foreground" />;
  
  if (type.includes('image/')) {
    return <img src="/icons/image.svg" alt="图片" className="h-10 w-10" />;
  } else if (type.includes('application/pdf')) {
    return <img src="/icons/pdf.svg" alt="PDF" className="h-10 w-10" />;
  } else if (type.includes('application/msword') || type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml')) {
    return <img src="/icons/doc.svg" alt="文档" className="h-10 w-10" />;
  } else if (type.includes('application/vnd.ms-excel') || type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml')) {
    return <img src="/icons/xls.svg" alt="表格" className="h-10 w-10" />;
  } else if (type.includes('application/vnd.ms-powerpoint') || type.includes('application/vnd.openxmlformats-officedocument.presentationml')) {
    return <img src="/icons/ppt.svg" alt="演示文稿" className="h-10 w-10" />;
  } else if (type.includes('audio/')) {
    return <img src="/icons/audio.svg" alt="音频" className="h-10 w-10" />;
  } else if (type.includes('video/')) {
    return <img src="/icons/video.svg" alt="视频" className="h-10 w-10" />;
  } else if (type.includes('application/zip') || type.includes('application/x-rar')) {
    return <img src="/icons/archive.svg" alt="压缩文件" className="h-10 w-10" />;
  } else {
    return <FileText className="h-10 w-10 text-muted-foreground" />;
  }
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default MaterialBrowser;
