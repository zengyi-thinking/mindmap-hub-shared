import { useState, useEffect, useRef } from 'react';
import { userFilesService } from '@/lib/storage';
import { findTagPath } from '@/components/material-search/utils/TagUtils';
import { tagHierarchy } from '@/data/tagHierarchy';

export const useMaterialSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [materialsData, setMaterialsData] = useState([]);
  const [selectedTagPath, setSelectedTagPath] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const tagHierarchyRef = useRef(tagHierarchy);

  // Initialize data
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    setIsLoading(true);
    // 模拟网络延迟，实际项目中可以移除这个延时
    setTimeout(() => {
      const approvedFiles = userFilesService.getApprovedFiles();
      setMaterialsData(approvedFiles);
      setIsLoading(false);
    }, 300); // 添加小延迟以显示加载状态
  };

  // Tag handling
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Search and filter
  const handleSearch = () => {
    setIsLoading(true);
    setSearchPerformed(true);

    // 模拟网络延迟，实际项目中可以移除这个延时
    setTimeout(() => {
      let filtered = materialsData;

      if (searchQuery || selectedTags.length > 0) {
        if (selectedTags.length > 0) {
          filtered = filtered.filter(material =>
            material.tags && selectedTags.some(tag => material.tags.includes(tag))
          );
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(material =>
            (material.title && material.title.toLowerCase().includes(query)) ||
            (material.description && material.description.toLowerCase().includes(query)) ||
            (material.file && material.file.name.toLowerCase().includes(query)) ||
            (material.tags && material.tags.some(tag => tag.toLowerCase().includes(query)))
          );
        }

        setMaterialsData(filtered);
      } else {
        loadMaterials();
      }

      if (selectedTags.length > 0) {
        const firstTag = selectedTags[0];
        const tagPath = findTagPath(tagHierarchyRef.current, firstTag);
        setSelectedTagPath(tagPath.length > 0 ? tagPath : [firstTag]);
      } else if (filtered.length > 0 && filtered[0]?.tags) {
        setSelectedTagPath([filtered[0].tags[0]]);
      }

      setIsLoading(false);
      return filtered;
    }, 500);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchPerformed,
    setSearchPerformed,
    selectedTags,
    setSelectedTags,
    materialsData,
    setMaterialsData,
    selectedTagPath,
    setSelectedTagPath,
    toggleTag,
    clearAllTags,
    handleSearch,
    loadMaterials,
    isLoading
  };
};
