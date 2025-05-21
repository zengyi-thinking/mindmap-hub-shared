/**
 * 桥接文件 - MindMapTags组件
 * 此文件重定向到Clean Architecture中的实现
 */

import React from 'react';

// MindMapTags组件
interface MindMapTagsProps {
  tags?: string[];
  selectedTags?: string[];
  onTagToggle?: (tag: string) => void;
  onClearAll?: () => void;
  className?: string;
}

// 简单的MindMapTags组件
const MindMapTags: React.FC<MindMapTagsProps> = ({
  tags = [],
  selectedTags = [],
  onTagToggle,
  onClearAll,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <button
          key={index}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            selectedTags.includes(tag)
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background hover:bg-muted border-input'
          }`}
          onClick={() => onTagToggle && onTagToggle(tag)}
        >
          {tag}
        </button>
      ))}
      
      {selectedTags.length > 0 && (
        <button
          className="px-3 py-1 text-xs rounded-full text-muted-foreground hover:text-foreground"
          onClick={onClearAll}
        >
          清除全部
        </button>
      )}
    </div>
  );
};

export default MindMapTags; 