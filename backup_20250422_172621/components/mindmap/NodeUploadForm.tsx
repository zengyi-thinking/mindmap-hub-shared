import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FileUploader from '@/modules/materials/components/FileUploader';
import { userFilesService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';
import { Upload, Check } from 'lucide-react';

interface NodeUploadFormProps {
  open: boolean;
  onClose: () => void;
  nodeId: string;
  nodeName: string;
  folderPath: string[];
  onSuccess: (materialId: number) => void;
}

const NodeUploadForm: React.FC<NodeUploadFormProps> = ({
  open,
  onClose,
  nodeId,
  nodeName,
  folderPath,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  
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
        
        // 将思维导图节点的名称添加到标签中
        const tags = [nodeName];
        
        // 将文件夹路径添加到标签中
        if (folderPath && folderPath.length > 0) {
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
          folderPath: folderPath || [],
          nodeId: nodeId,
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
        
        // 通知父组件上传成功
        if (savedFile && savedFile.id) {
          onSuccess(savedFile.id);
        }
        
        // 关闭对话框
        onClose();
      }
    };
    
    reader.readAsDataURL(selectedFile);
  };
  
  const handleClose = () => {
    if (!isUploading) {
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>上传文件到「{nodeName}」</DialogTitle>
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
          
          {folderPath && folderPath.length > 0 && (
            <div className="space-y-2">
              <Label>文件夹位置</Label>
              <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-900 text-sm">
                {folderPath.join(' → ')}
              </div>
            </div>
          )}
          
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
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isUploading}
          >
            取消
          </Button>
          <Button 
            type="submit" 
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeUploadForm; 
