import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { userFilesService } from '@/lib/storage';

export const useMaterialPreview = () => {
  const { toast } = useToast();
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [materialsListByTag, setMaterialsListByTag] = useState<any[]>([]);
  const [materialListDialogOpen, setMaterialListDialogOpen] = useState(false);
  const [selectedTagForList, setSelectedTagForList] = useState('');
  
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
  
  // 处理节点点击
  const onNodeClick = (event, node, materialsData) => {
    if (node.type === 'materialNode') {
      if (node.data.type === 'tag') {
        // 如果是标签节点，打开标签相关的材料列表
        const materialsWithTag = materialsData.filter(m => 
          m.tags && m.tags.includes(node.data.label)
        );
        setMaterialsListByTag(materialsWithTag);
        setSelectedTagForList(node.data.label);
        setMaterialListDialogOpen(true);
      } else if (node.data.type === 'material') {
        // 如果是材料节点，打开材料预览
        const material = materialsData.find(m => m.id === node.data.id);
        if (material) {
          openPreview(material);
        }
      }
    }
  };
  
  // 处理材料选择
  const handleMaterialSelect = (material) => {
    openPreview(material);
    setMaterialListDialogOpen(false);
  };
  
  return {
    selectedMaterial,
    setSelectedMaterial,
    previewOpen,
    setPreviewOpen,
    openPreview,
    closePreview,
    downloadMaterial,
    materialsListByTag,
    setMaterialsListByTag,
    materialListDialogOpen,
    setMaterialListDialogOpen,
    selectedTagForList,
    setSelectedTagForList,
    onNodeClick,
    handleMaterialSelect
  };
}; 