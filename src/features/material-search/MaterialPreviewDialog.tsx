import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, User, Eye, ThumbsUp } from 'lucide-react';
import FilePreview from '@/components/materials/FilePreview';
import { useNavigate } from 'react-router-dom';
import { userFilesService } from '@/lib/storage';

interface MaterialPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  material: any | null;
}

const MaterialPreviewDialog: React.FC<MaterialPreviewDialogProps> = ({
  open,
  onClose,
  material
}) => {
  const navigate = useNavigate();
  
  if (!material) {
    return null;
  }
  
  const handleDownload = () => {
    if (material) {
      // 增加下载次数
      userFilesService.incrementDownloads(material.id);
      
      // 模拟下载文件（在实际应用中，这将是一个文件下载）
      const link = document.createElement('a');
      link.href = `#download-${material.id}`;
      link.download = material.filename;
      link.click();
    }
  };
  
  const viewMaterialDetail = () => {
    if (material) {
      navigate(`/material/${material.id}`);
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{material.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {material.uploadedByName || '匿名用户'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(material.uploadDate).toLocaleDateString()}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {material.views || 0}次浏览
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            {material.likes || 0}人点赞
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {material.downloads || 0}次下载
          </Badge>
        </div>
        
        {material.description && (
          <p className="mt-4 text-sm text-gray-600 border-l-2 border-primary pl-3 py-1">
            {material.description}
          </p>
        )}
        
        <div className="mt-6 min-h-[300px] border rounded-md overflow-hidden">
          <FilePreview fileData={material} />
        </div>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            关闭
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleDownload}
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              下载资料
            </Button>
            
            <Button 
              onClick={viewMaterialDetail}
              className="flex items-center gap-1"
            >
              查看详情
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialPreviewDialog; 