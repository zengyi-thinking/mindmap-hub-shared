
import { useState } from 'react';
import { userFilesService } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';

export const useMaterialPreview = () => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [materialsListByTag, setMaterialsListByTag] = useState([]);
  const [materialListDialogOpen, setMaterialListDialogOpen] = useState(false);
  const [selectedTagForList, setSelectedTagForList] = useState('');

  // Handle material selection for previewing
  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    setPreviewDialogOpen(true);
    setMaterialListDialogOpen(false);
    userFilesService.incrementViews(material.id);
  };

  // Download material
  const downloadMaterial = (material) => {
    if (!material || !material.file) return;
    
    userFilesService.incrementDownloads(material.id);
    
    const link = document.createElement('a');
    link.href = material.file.content || material.file.dataUrl;
    link.download = material.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "下载开始",
      description: `${material.file.name} 下载已开始`
    });
  };

  return {
    selectedMaterial,
    setSelectedMaterial,
    previewDialogOpen,
    setPreviewDialogOpen,
    materialsListByTag,
    setMaterialsListByTag,
    materialListDialogOpen,
    setMaterialListDialogOpen,
    selectedTagForList,
    setSelectedTagForList,
    handleMaterialSelect,
    downloadMaterial
  };
};
