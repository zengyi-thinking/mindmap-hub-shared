
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import TagSelector from './TagSelector';
import FileUploader from './FileUploader';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MaterialUploadForm: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<{
    id: number;
    title: string;
    date: string;
    tags: string[];
  }[]>([]);
  
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
    
    // Here we would handle the actual upload
    setTimeout(() => {
      // 95% chance of success, 5% chance of failure (for demo purposes)
      if (Math.random() > 0.05) {
        toast({
          title: "上传成功",
          description: "您的资料已成功上传，正在等待审核",
        });
        
        // Add to recent uploads
        const newUpload = {
          id: Date.now(),
          title: title,
          date: new Date().toISOString().split('T')[0],
          tags: selectedTags
        };
        
        setRecentUploads(prev => [newUpload, ...prev]);
        
        // Reset form
        setTitle('');
        setDescription('');
        setSelectedTags([]);
        setSelectedFile(null);
      } else {
        setUploadError("网络错误，请稍后重试");
        setUploadSuccess(false);
        toast({
          title: "上传失败",
          description: "网络错误，请稍后重试",
          variant: "destructive"
        });
      }
    }, 3500);
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedTags([]);
    setSelectedFile(null);
    setUploadSuccess(false);
    setUploadError(null);
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
        {uploadSuccess && (
          <Alert className="border-green-500 text-green-500">
            <Check className="h-4 w-4" />
            <AlertTitle>上传成功</AlertTitle>
            <AlertDescription>
              您的资料已成功上传，正在等待审核通过
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
          <Label htmlFor="title">资料标题</Label>
          <Input
            id="title"
            placeholder="输入资料标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
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
            disabled={isUploading}
          />
        </div>
        
        <TagSelector 
          selectedTags={selectedTags} 
          onTagsChange={setSelectedTags}
          disabled={isUploading}
        />
        
        <FileUploader 
          selectedFile={selectedFile} 
          onFileChange={setSelectedFile} 
          disabled={isUploading}
        />
        
        {isUploading && (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span>上传中...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </>
        )}
        
        {recentUploads.length > 0 && !isUploading && !uploadSuccess && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">最近上传记录</h3>
            <div className="border rounded-md divide-y">
              {recentUploads.slice(0, 3).map((upload) => (
                <div key={upload.id} className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{upload.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{upload.date}</span>
                      <div className="flex gap-1">
                        {upload.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {upload.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{upload.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge>已上传</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {uploadSuccess ? (
          <Button 
            onClick={resetForm} 
            variant="outline"
          >
            上传新资料
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={resetForm}
              disabled={isUploading}
            >
              重置表单
            </Button>
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
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MaterialUploadForm;
