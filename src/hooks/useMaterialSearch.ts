
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
  const tagHierarchyRef = useRef(tagHierarchy);

  // Initialize data
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    const approvedFiles = userFilesService.getApprovedFiles();
    setMaterialsData(approvedFiles);
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
    setSearchPerformed(true);
    
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

    return filtered;
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
    loadMaterials
  };
};
