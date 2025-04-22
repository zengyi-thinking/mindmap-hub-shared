import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { userFilesService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';

export const useMaterialUpload = (currentPath: string[], onSuccess?: () => void) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // 上传表单状态
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
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
        
        // 调用成功回调
        if (onSuccess) {
          onSuccess();
        }
      }
    };
    
    reader.readAsDataURL(selectedFile);
  };
  
  return {
    title,
    setTitle,
    description,
    setDescription,
    selectedFile,
    setSelectedFile,
    uploadProgress,
    isUploading,
    showUploadForm,
    setShowUploadForm,
    handleOpenUploadForm,
    closeUploadForm,
    handleUpload
  };
}; 
