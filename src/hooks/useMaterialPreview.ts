import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { userFilesService } from '@/lib/storage';

export const useMaterialPreview = () => {
  const { toast } = useToast();
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // 预览资料
  const openPreview = (material) => {
    setSelectedMaterial(material);
    setPreviewOpen(true);
    userFilesService.incrementViews(material.id);
  };
  
  // 关闭预览
  const closePreview = () => {
    setPreviewOpen(false);
  };
  
  // 下载资料
  const downloadMaterial = (material) => {
    if (!material || !material.file || !material.file.dataUrl) {
      toast({
        title: "下载失败",
        description: "文件数据不完整或不可用",
        variant: "destructive"
      });
      return;
    }
    
    const link = document.createElement('a');
    link.href = material.file.dataUrl;
    link.download = material.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    userFilesService.incrementDownloads(material.id);
    
    toast({
      title: "下载开始",
      description: `正在下载 ${material.title}`
    });
  };
  
  return {
    selectedMaterial,
    setSelectedMaterial,
    previewOpen,
    setPreviewOpen,
    openPreview,
    closePreview,
    downloadMaterial
  };
}; 