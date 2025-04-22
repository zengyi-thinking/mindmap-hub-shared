import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import FileUploader from '@/modules/materials/components/FileUploader';
import { useAuth } from '@/lib/auth';
import { userFilesService } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';
import { tagHierarchy } from '@/data/tagHierarchy';

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearchText, setTagSearchText] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  // 扁平化标签层次结构用于搜索
  const flattenTags = (categories) => {
    let tags: string[] = [];
    categories.forEach(category => {
      tags.push(category.name);
      if (category.children) {
        tags = [...tags, ...flattenTags(category.children)];
      }
    });
    return tags;
  };

  const allTags = flattenTags(tagHierarchy);

  // 筛选标签
  const filteredTags = allTags
    .filter(tag => 
      tag.toLowerCase().includes(tagSearchText.toLowerCase()) && 
      !selectedTags.includes(tag)
    )
    .slice(0, 10); // 限制显示数量

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagSearchText('');
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
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

    // 添加文件到存储，现在包含标签
    userFilesService.add({
      filename: selectedFile.name,
      title: title.trim(),
      description: description.trim(),
      tags: selectedTags, // 保存选择的标签
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
    setSelectedTags([]);
    setTagSearchText('');

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

    if (selectedTags.length === 0) {
      toast({
        title: "请添加标签",
        description: "至少需要添加一个标签以便于资料分类和查找",
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

          {/* 标签选择区域 */}
          <div className="space-y-2">
            <Label htmlFor="tags">资料标签</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="tags"
                placeholder="搜索或添加标签"
                value={tagSearchText}
                onChange={(e) => setTagSearchText(e.target.value)}
              />
              <Button 
                type="button" 
                size="icon" 
                variant="outline"
                onClick={() => tagSearchText && addTag(tagSearchText)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* 标签搜索结果 */}
            {tagSearchText && filteredTags.length > 0 && (
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                {filteredTags.map(tag => (
                  <div 
                    key={tag}
                    className="px-2 py-1 hover:bg-primary/10 rounded cursor-pointer flex items-center"
                    onClick={() => addTag(tag)}
                  >
                    <TagIcon className="h-3 w-3 mr-2 text-muted-foreground" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
            
            {/* 已选标签 */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-primary/20 p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-1">
              添加标签有助于其他用户更容易找到您的资料，也便于生成标签思维导图
            </p>
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

