import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchForm from '@/components/material-search/SearchForm';
import { flattenTags } from '@/components/material-search/utils/TagUtils';

interface MaterialSearchControlsProps {
  materialSearch: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedTags: string[];
    toggleTag: (tag: string) => void;
    clearAllTags: () => void;
  };
  onSearch: () => void;
  tagHierarchy: any;
}

/**
 * 材料搜索控制组件
 * 负责搜索表单和标签选择
 */
const MaterialSearchControls: React.FC<MaterialSearchControlsProps> = ({
  materialSearch,
  onSearch,
  tagHierarchy
}) => {
  const [filterVisible, setFilterVisible] = useState(false);
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedTags, 
    toggleTag, 
    clearAllTags 
  } = materialSearch;

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  // 获取所有标签的扁平列表
  const popularTags = flattenTags(tagHierarchy);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      <SearchForm 
        onSearch={onSearch}
        onFilterToggle={toggleFilter}
        onTagToggle={toggleTag}
        onClearTags={clearAllTags}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterVisible={filterVisible}
        selectedTags={selectedTags}
        popularTags={popularTags}
      />
    </motion.div>
  );
};

export default MaterialSearchControls; 