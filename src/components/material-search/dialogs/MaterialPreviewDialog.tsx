
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface MaterialPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: any;
  onDownload: (material: any) => void;
  user: any;
}

const MaterialPreviewDialog: React.FC<MaterialPreviewDialogProps> = ({
  open,
  onOpenChange,
  material,
  onDownload,
  user
}) => {
  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{material.title || material.file?.name}</DialogTitle>
          <DialogDescription>
            上传者: {material.uploaderName || user?.username || 'Unknown'} · 
            上传时间: {new Date(material.uploadTime).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-muted/30">
            <p>{material.description || "没有描述"}</p>
          </div>
          
          <div className="flex flex-wrap gap-1">
            <div className="text-sm font-medium mr-2">标签:</div>
            {material.tags && material.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center p-3 border rounded-md">
              <p className="text-muted-foreground">文件大小</p>
              <p className="font-medium">{(material.file?.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-md">
              <p className="text-muted-foreground">查看次数</p>
              <p className="font-medium">{material.views || 0}</p>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-md">
              <p className="text-muted-foreground">下载次数</p>
              <p className="font-medium">{material.downloads || 0}</p>
            </div>
          </div>
          
          {material.file && material.file.type?.startsWith('image/') && (
            <div className="border rounded-md p-2 overflow-hidden">
              <img 
                src={material.file.content || material.file.dataUrl} 
                alt={material.title || material.file.name}
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>
          )}
          
          {material.file && material.file.type === 'application/pdf' && (
            <div className="border rounded-md p-2 flex justify-center">
              <object
                data={material.file.content || material.file.dataUrl}
                type="application/pdf"
                width="100%"
                height="500px"
              >
                <p>您的浏览器无法预览PDF文件</p>
              </object>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>关闭</Button>
          <Button onClick={() => onDownload(material)}>
            <Download className="mr-2 h-4 w-4" />
            下载
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialPreviewDialog;
