
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ selectedFile, onFileChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="grid w-full gap-1.5">
      <Label>上传文件</Label>
      <div 
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="font-medium">
            {selectedFile ? selectedFile.name : "点击或拖拽文件到此处上传"}
          </p>
          <p className="text-xs text-muted-foreground">
            支持的文件类型: PDF, DOCX, PPTX, ZIP, RAR (最大50MB)
          </p>
          {selectedFile && (
            <Badge variant="outline" className="mt-2">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
