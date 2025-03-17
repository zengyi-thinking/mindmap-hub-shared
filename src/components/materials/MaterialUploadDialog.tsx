import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import FileUploader from '@/components/materials/FileUploader';

interface MaterialUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string[];
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  uploadProgress: number;
  isUploading: boolean;
  handleUpload: () => void;
  closeUploadForm: () => void;
}

const MaterialUploadDialog: React.FC<MaterialUploadDialogProps> = ({
  open,
  onOpenChange,
  currentPath,
  title,
  setTitle,
  description,
  setDescription,
  selectedFile,
  setSelectedFile,
  uploadProgress,
  isUploading,
  handleUpload,
  closeUploadForm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default MaterialUploadDialog; 