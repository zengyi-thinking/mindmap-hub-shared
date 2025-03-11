
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import TagSelector from './TagSelector';
import FileUploader from './FileUploader';

const MaterialUploadForm: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
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
        return prev + 10;
      });
    }, 300);
  };
  
  const handleUpload = () => {
    if (!title.trim()) {
      toast({
        title: "请输入资料标题",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedTags.length === 0) {
      toast({
        title: "请至少选择一个标签",
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
    
    // Simulate file upload
    simulateUpload();
    
    // Here we would handle the actual upload
    setTimeout(() => {
      toast({
        title: "上传成功",
        description: "您的资料已成功上传，正在等待审核",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedTags([]);
      setSelectedFile(null);
    }, 3500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>上传新资料</CardTitle>
        <CardDescription>
          请填写资料信息并添加标签，让其他用户更容易找到您分享的内容
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="title">资料标题</Label>
          <Input
            id="title"
            placeholder="输入资料标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="grid w-full gap-1.5">
          <Label htmlFor="description">资料描述</Label>
          <Textarea
            id="description"
            placeholder="简要描述此资料的内容和用途"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        
        <TagSelector 
          selectedTags={selectedTags} 
          onTagsChange={setSelectedTags} 
        />
        
        <FileUploader 
          selectedFile={selectedFile} 
          onFileChange={setSelectedFile} 
        />
        
        {isUploading && (
          <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          className="flex items-center gap-2"
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
      </CardFooter>
    </Card>
  );
};

export default MaterialUploadForm;
