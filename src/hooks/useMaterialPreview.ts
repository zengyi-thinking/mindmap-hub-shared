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

  // Handle material download
  const downloadMaterial = (material) => {
    if (!material || !material.file || !material.file.dataUrl) {
      toast({
        title: "下载失败",
        description: "文件数据不完整或不可用",
        variant: "destructive"
      });
      return;
    }

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = material.file.dataUrl;
    link.download = material.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Increment download count
    userFilesService.incrementDownloads(material.id);

    toast({
      title: "下载开始",
      description: `正在下载 ${material.title || material.file.name}`
    });
  };

  // Node click handler for mind map
  const onNodeClick = (event, node, materialsData) => {
    if (node.id.startsWith('material-') && node.data.materialId) {
      const material = materialsData.find(m => m.id === node.data.materialId);
      if (material) {
        setSelectedMaterial(material);
        setPreviewDialogOpen(true);
        userFilesService.incrementViews(material.id);
      }
    } else if (node.data.isLastLevel && node.data.tagName) {
      const tagName = node.data.tagName;
      
      const taggedMaterials = materialsData.filter(m => 
        m.tags && m.tags.includes(tagName)
      );
      
      if (taggedMaterials.length === 1) {
        setSelectedMaterial(taggedMaterials[0]);
        setPreviewDialogOpen(true);
        userFilesService.incrementViews(taggedMaterials[0].id);
      } else if (taggedMaterials.length > 1) {
        setMaterialsListByTag(taggedMaterials);
        setSelectedTagForList(tagName);
        setMaterialListDialogOpen(true);
      } else {
        toast({
          title: "没有找到相关资料",
          description: `没有找到标签为 "${tagName}" 的资料`,
          variant: "destructive"
        });
      }
    }
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
    downloadMaterial,
    onNodeClick
  };
};
