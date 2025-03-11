
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileType, File as FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  selectedFile, 
  onFileChange,
  disabled = false 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileChange(file);
      
      // Generate preview if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const removeFile = () => {
    if (disabled) return;
    onFileChange(null);
    setPreviewUrl(null);
  };

  const getFileTypeIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <FileType className="h-10 w-10 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileType className="h-10 w-10 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileType className="h-10 w-10 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FileType className="h-10 w-10 text-orange-500" />;
      case 'zip':
      case 'rar':
        return <FileType className="h-10 w-10 text-purple-500" />;
      default:
        return <FileIcon className="h-10 w-10 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className={`grid w-full gap-1.5 ${disabled ? 'opacity-70' : ''}`}>
      <Label>上传文件</Label>
      
      {selectedFile ? (
        <div className="border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded" />
              ) : (
                getFileTypeIcon(selectedFile)
              )}
              
              <div>
                <p className="font-medium truncate max-w-[200px] sm:max-w-[300px] md:max-w-full">
                  {selectedFile.name}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline">
                    {formatFileSize(selectedFile.size)}
                  </Badge>
                  <Badge variant="outline">
                    {selectedFile.type || '未知类型'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive"
              disabled={disabled}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${!disabled ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''}`}
          onClick={() => !disabled && document.getElementById('file-upload')?.click()}
        >
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
            disabled={disabled}
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">
              {disabled ? '上传功能已禁用' : '点击或拖拽文件到此处上传'}
            </p>
            <p className="text-xs text-muted-foreground">
              支持的文件类型: PDF, DOCX, PPTX, ZIP, RAR, JPG, PNG (最大50MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
