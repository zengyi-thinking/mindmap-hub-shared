import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { FolderOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tagHierarchy } from '@/data/tagHierarchy';
import { userFilesService } from '@/lib/storage';
import MaterialFileList from './components/MaterialFileList';
import { MaterialMermaidMindMap } from '@/domains/mindmap';
import { TagCategory } from '@/modules/materials/types/materials';

interface MaterialMindMapGeneratorProps {
  onSelectMaterial: (material: any) => void;
}

/**
 * 资料思维导图生成器组件
 * 基于Mermaid.js实现思维导图展示，提供导航和搜索功能
 */
const MaterialMindMapGenerator: React.FC<MaterialMindMapGeneratorProps> = ({
  onSelectMaterial
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [folderMaterials, setFolderMaterials] = useState<any[]>([]);
  const [allMaterials, setAllMaterials] = useState<any[]>([]);
  const [categories, setCategories] = useState<TagCategory[]>([]);

  // 从标签层次结构转换为TagCategory类型
  const convertToTagCategories = useCallback((tags: any[]): TagCategory[] => {
    return tags.map((tag: any, index: number) => ({
      id: `tag-${index}`,
      name: tag.name,
      children: tag.children ? convertToTagCategories(tag.children) : undefined
    }));
  }, []);

  // 初始化分类数据和所有文件
  useEffect(() => {
    const categories = convertToTagCategories(tagHierarchy);
    setCategories(categories);
    
    // 获取所有文件
    const allFiles = userFilesService.getAll();
    setAllMaterials(allFiles.filter(file => file.approved));
  }, [convertToTagCategories]);
  
  // 当路径变化时，获取当前文件夹的资料
  useEffect(() => {
    if (currentPath.length > 0) {
      const filesInFolder = userFilesService.getByDirectFolder(currentPath);
      setFolderMaterials(filesInFolder.filter(file => file.approved));
    } else {
      setFolderMaterials([]);
    }
  }, [currentPath]);
  
  // 处理思维导图节点点击
  const handleNodeClick = (nodeData: string[]) => {
    if (nodeData && nodeData.length > 0) {
      const nodeName = nodeData[nodeData.length - 1];
      // 设置当前路径
      setCurrentPath(prev => [...prev, nodeName]);
    }
  };
  
  // 返回上一级
  const goBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };
  
  // 搜索处理
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goBack}
          disabled={currentPath.length === 0}
          className="shrink-0"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回上级
        </Button>
        
        <div className="flex-1">
          <Input
            placeholder="搜索当前文件夹资料..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex-1 flex border rounded-md overflow-hidden">
        <div className="w-2/3 h-full relative bg-white">
          <MaterialMermaidMindMap 
            materials={allMaterials}
            categories={categories}
            onNodeClick={handleNodeClick}
            className="w-full h-full"
          />
        </div>
        
        <div className="w-1/3 border-l p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FolderOpen className="w-5 h-5 mr-2" />
            {currentPath.length > 0 
              ? currentPath[currentPath.length - 1] 
              : '所有资料'}
          </h3>
          
          <MaterialFileList 
            materials={folderMaterials}
            searchQuery={searchQuery}
            onSelectMaterial={onSelectMaterial}
          />
        </div>
      </div>
    </div>
  );
};

export default MaterialMindMapGenerator;
