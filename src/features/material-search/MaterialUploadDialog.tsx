import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import FileUploader from '@/components/materials/FileUploader';
import { useAuth } from '@/lib/auth';
import { userFilesService } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

interface MaterialUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

const MaterialUploadDialog: React.FC<MaterialUploadDialogProps> = ({
  open,
  onClose,
  onUploadSuccess
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    const totalSteps = 10;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setUploadProgress((currentStep / totalSteps) * 100);

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        // 上传成功后的处理
        handleUploadComplete();
      }
    }, 300);
  };

  const handleUploadComplete = () => {
    if (!selectedFile || !title.trim()) return;

    // 添加文件到存储
    userFilesService.add({
      filename: selectedFile.name,
      title: title.trim(),
      description: description.trim(),
      tags: [],
      uploadedBy: user?.id || 0,
      uploadedByName: user?.username || '匿名用户',
      mimeType: selectedFile.type,
      size: selectedFile.size,
      uploadDate: new Date().toISOString(),
      status: 'pending',
      approved: true,
      views: 0,
      downloads: 0,
      likes: 0
    });

    toast({
      title: "上传成功",
      description: "您的资料已成功上传，将在审核通过后显示。",
    });

    // 清空表单
    setTitle('');
    setDescription('');
    setSelectedFile(null);

    // 关闭对话框
    onClose();

    // 如果提供了上传成功回调，则调用
    if (onUploadSuccess) {
      onUploadSuccess();
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "请选择文件",
        description: "您需要选择一个文件进行上传",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "请输入标题",
        description: "资料标题不能为空",
        variant: "destructive"
      });
      return;
    }

    // 开始模拟上传过程
    simulateUpload();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>上传新资料</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">资料标题</Label>
            <Input
              id="title"
              placeholder="输入资料标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">资料描述</Label>
            <Textarea
              id="description"
              placeholder="简要描述该资料的内容和用途"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>上传文件</Label>
            <FileUploader onFileSelect={handleFileSelect} />
            {selectedFile && (
              <p className="text-sm text-muted-foreground mt-2">
                已选择: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-center mt-1">上传中 {uploadProgress.toFixed(0)}%</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            取消
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "上传中..." : "上传"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialUploadDialog;
