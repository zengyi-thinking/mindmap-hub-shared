import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Check, AlertCircle, FileText, Tag, Clock, User, Folder } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import TagSelector from './TagSelector';
import FileUploader from './FileUploader';
import FolderSelector from './FolderSelector';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { userFilesService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MaterialUploadForm: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFolderPath, setSelectedFolderPath] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'tags' | 'folder'>('tags');
  const [recentUploads, setRecentUploads] = useState<{
    id: number;
    title: string;
    date: string;
    tags: string[];
    folderPath?: string[];
  }[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    // 加载最近上传记录
    const allFiles = userFilesService.getAll();
    const userFiles = allFiles.filter(file => file.userId === user?.id);
    const recentFiles = userFiles.slice(0, 3).map(file => ({
      id: file.id || Date.now(),
      title: file.title,
      date: new Date(file.uploadTime).toLocaleDateString(),
      tags: file.tags || [],
      folderPath: file.folderPath || []
    }));
    setRecentUploads(recentFiles);
  }, [user?.id]);
  
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadError(null);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  const handleUpload = () => {
    if (!title.trim()) {
      toast({
        title: "请输入资料标题",
        variant: "destructive"
      });
      return;
    }
    
    if (uploadMethod === 'tags' && selectedTags.length === 0) {
      toast({
        title: "请至少选择一个标签",
        variant: "destructive"
      });
      return;
    }
    
    if (uploadMethod === 'folder' && selectedFolderPath.length === 0) {
      toast({
        title: "请选择上传文件夹",
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
    
    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "上传文件大小不能超过50MB",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate file upload
    simulateUpload();
    
    // 将文件转换为Data URL以存储在localStorage
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const dataUrl = event.target.result.toString();
        
        // 根据上传方法设置标签和文件夹路径
        const tags = uploadMethod === 'tags' ? selectedTags : [];
        const folderPath = uploadMethod === 'folder' ? selectedFolderPath : [];
        
        // 如果使用文件夹上传，将文件夹路径也添加到标签中，以便搜索
        if (uploadMethod === 'folder' && folderPath.length > 0) {
          // 将文件夹路径的每个部分也作为标签
          folderPath.forEach(folder => {
            if (!tags.includes(folder)) {
              tags.push(folder);
            }
          });
        }
        
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
          tags: tags,
          folderPath: folderPath,
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
        userFilesService.add(fileToSave);
        
        // 添加到recent uploads
        const newUpload = {
          id: Date.now(),
          title: title,
          date: new Date().toISOString().split('T')[0],
          tags: tags,
          folderPath: folderPath
        };
        
        setRecentUploads(prev => [newUpload, ...prev]);
        
        toast({
          title: "上传成功",
          description: user?.role === 'admin' 
            ? "您的资料已成功上传并发布" 
            : "您的资料已成功上传，正在等待审核",
        });
        
        // Reset form
        setTitle('');
        setDescription('');
        setSelectedTags([]);
        setSelectedFolderPath([]);
        setSelectedFile(null);
        setUploadSuccess(true);
      }
    };
    
    reader.readAsDataURL(selectedFile);
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedTags([]);
    setSelectedFolderPath([]);
    setSelectedFile(null);
    setUploadSuccess(false);
    setUploadError(null);
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
            <Upload className="h-5 w-5" />
            上传新资料
          </CardTitle>
          <CardDescription>
            请填写资料信息并添加标签，让其他用户更容易找到您分享的内容
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {uploadSuccess && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300">
              <Check className="h-4 w-4" />
              <AlertTitle>上传成功</AlertTitle>
              <AlertDescription>
                您的资料已成功上传，{user?.role === 'admin' ? '已发布' : '正在等待审核通过'}
              </AlertDescription>
            </Alert>
          )}
          
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>上传失败</AlertTitle>
              <AlertDescription>
                {uploadError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="title" className="text-sm font-medium">资料标题</Label>
            <Input
              id="title"
              placeholder="输入资料标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              className="focus-visible:ring-primary"
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description" className="text-sm font-medium">资料描述</Label>
            <Textarea
              id="description"
              placeholder="简要描述此资料的内容和用途"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={isUploading}
              className="focus-visible:ring-primary resize-none"
            />
          </div>
          
          <FileUploader 
            selectedFile={selectedFile} 
            onFileChange={setSelectedFile} 
            disabled={isUploading}
          />
          
          <div className="space-y-3">
            <Label className="text-sm font-medium">上传方式</Label>
            <Tabs 
              defaultValue="tags" 
              value={uploadMethod} 
              onValueChange={(val) => setUploadMethod(val as 'tags' | 'folder')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="tags" className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  使用标签上传
                </TabsTrigger>
                <TabsTrigger value="folder" className="flex items-center gap-1.5">
                  <Folder className="h-4 w-4" />
                  上传到文件夹
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tags">
                <TagSelector 
                  selectedTags={selectedTags} 
                  onTagsChange={setSelectedTags}
                  disabled={isUploading}
                />
              </TabsContent>
              
              <TabsContent value="folder">
                <FolderSelector 
                  selectedFolderPath={selectedFolderPath}
                  onFolderPathChange={setSelectedFolderPath}
                  disabled={isUploading}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          {isUploading && (
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-primary">上传中...</span>
                <span className="font-bold text-primary">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {recentUploads.length > 0 && !isUploading && !uploadSuccess && (
            <div className="mt-6 bg-slate-50 dark:bg-slate-900/60 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                最近上传记录
              </h3>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentUploads.map(upload => (
                  <div key={upload.id} className="py-2 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{upload.title}</div>
                      <div className="text-xs text-muted-foreground">{upload.date}</div>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {upload.tags && upload.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {upload.tags && upload.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{upload.tags.length - 3}
                        </Badge>
                      )}
                      
                      {upload.folderPath && upload.folderPath.length > 0 && (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <Folder className="h-3 w-3" />
                          {upload.folderPath.length > 2 
                            ? `${upload.folderPath[0]} → ... → ${upload.folderPath[upload.folderPath.length-1]}`
                            : upload.folderPath.join(' → ')
                          }
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-b-lg border-t border-primary/10 py-4">
          {uploadSuccess ? (
            <Button 
              onClick={resetForm} 
              variant="outline"
              className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary"
            >
              上传新资料
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={resetForm}
                disabled={isUploading}
                className="border-primary/20 hover:bg-primary/10 hover:text-primary"
              >
                重置表单
              </Button>
              <Button 
                onClick={handleUpload} 
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>上传中...({uploadProgress}%)</>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    上传资料
                  </>
                )}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MaterialUploadForm;
