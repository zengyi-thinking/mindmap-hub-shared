import React, { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Label } from './label';
import { Slider } from './slider';
import { toast } from './use-toast';
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string;
  username: string;
  onAvatarChange: (dataUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar, username, onAvatarChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB限制
        toast({
          title: "文件过大",
          description: "请选择小于5MB的图片文件",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "文件类型错误",
          description: "请选择图片文件",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setIsDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 打开文件选择对话框
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 重置编辑状态
  const resetEditor = () => {
    setZoom(1);
    setRotation(0);
  };
  
  // 旋转图片
  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };
  
  // 保存头像
  const saveAvatar = useCallback(() => {
    if (!imageRef.current || !previewUrl) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置画布大小为正方形
    const size = 200; // 输出头像大小
    canvas.width = size;
    canvas.height = size;
    
    // 绘制图像
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // 移动到画布中心
    ctx.translate(size / 2, size / 2);
    
    // 应用旋转
    ctx.rotate((rotation * Math.PI) / 180);
    
    // 应用缩放
    ctx.scale(zoom, zoom);
    
    // 绘制图像，居中
    const img = imageRef.current;
    const imgSize = Math.min(img.naturalWidth, img.naturalHeight);
    ctx.drawImage(
      img,
      (img.naturalWidth - imgSize) / 2,
      (img.naturalHeight - imgSize) / 2,
      imgSize,
      imgSize,
      -size / 2 / zoom,
      -size / 2 / zoom,
      size / zoom,
      size / zoom
    );
    
    ctx.restore();
    
    // 转换为dataURL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onAvatarChange(dataUrl);
    
    // 关闭对话框
    setIsDialogOpen(false);
    
    toast({
      title: "头像已更新",
      description: "您的个人头像已成功更新"
    });
  }, [previewUrl, zoom, rotation, onAvatarChange]);
  
  return (
    <div className="space-y-2">
      <Label>头像</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-border">
          {currentAvatar ? (
            <AvatarImage src={currentAvatar} alt={username} />
          ) : (
            <AvatarFallback className="text-xl">{username[0]}</AvatarFallback>
          )}
        </Avatar>
        <Button variant="outline" onClick={openFileSelector} className="gap-2">
          <Upload className="h-4 w-4" />
          更换头像
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑头像</DialogTitle>
            <DialogDescription>
              调整、缩放和裁剪您的个人头像
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative w-64 h-64 overflow-hidden rounded-full border-2 border-border bg-grid-pattern">
              {previewUrl && (
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="头像预览"
                  className="absolute left-1/2 top-1/2 max-w-none"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${zoom})`,
                  }}
                />
              )}
            </div>
            
            <div className="w-full space-y-4">
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[zoom]}
                  min={0.5}
                  max={2}
                  step={0.01}
                  onValueChange={(value) => setZoom(value[0])}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="icon" onClick={rotateImage}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={resetEditor}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveAvatar} className="gap-2">
              <Check className="h-4 w-4" />
              保存头像
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { AvatarUpload };