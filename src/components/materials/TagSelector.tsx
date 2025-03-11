
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TagCategory } from '@/types/materials';
import { tagHierarchy } from '@/data/tagHierarchy';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagsChange, disabled = false }) => {
  const [selectedLevel1, setSelectedLevel1] = React.useState<string | null>(null);
  const [selectedLevel2, setSelectedLevel2] = React.useState<string | null>(null);
  const [customTag, setCustomTag] = React.useState('');

  // Find all level1 tags
  const level1Tags = tagHierarchy.map(category => category.name);
  
  // Find level2 tags based on selected level1
  const getLevel2Tags = () => {
    if (!selectedLevel1) return [];
    const category = tagHierarchy.find(c => c.name === selectedLevel1);
    return category?.children?.map(child => child.name) || [];
  };
  
  // Find level3 tags based on selected level1 and level2
  const getLevel3Tags = () => {
    if (!selectedLevel1 || !selectedLevel2) return [];
    const category = tagHierarchy.find(c => c.name === selectedLevel1);
    const subcategory = category?.children?.find(c => c.name === selectedLevel2);
    return subcategory?.children?.map(child => child.name) || [];
  };
  
  // Helper to get the full tag path
  const getTagPath = (level3Tag: string) => {
    if (selectedLevel1 && selectedLevel2) {
      return `${selectedLevel1}-${selectedLevel2}-${level3Tag}`;
    }
    return level3Tag;
  };
  
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
  };
  
  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };
  
  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      onTagsChange([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  return (
    <div className="grid w-full gap-3">
      <Label className="mb-1">添加分级标签</Label>
      
      <div className={`border rounded-md p-4 space-y-4 ${disabled ? 'opacity-70' : ''}`}>
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">第一级标签</Label>
          <div className="flex flex-wrap gap-2">
            {level1Tags.map(tag => (
              <Badge
                key={tag}
                variant={selectedLevel1 === tag ? "default" : "outline"}
                className={`cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${disabled ? 'pointer-events-none' : ''}`}
                onClick={() => {
                  if (disabled) return;
                  setSelectedLevel1(selectedLevel1 === tag ? null : tag);
                  setSelectedLevel2(null);
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {selectedLevel1 && (
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">第二级标签</Label>
            <div className="flex flex-wrap gap-2">
              {getLevel2Tags().map(tag => (
                <Badge
                  key={tag}
                  variant={selectedLevel2 === tag ? "default" : "outline"}
                  className={`cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${disabled ? 'pointer-events-none' : ''}`}
                  onClick={() => {
                    if (disabled) return;
                    setSelectedLevel2(selectedLevel2 === tag ? null : tag);
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {selectedLevel1 && selectedLevel2 && (
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">第三级标签</Label>
            <div className="flex flex-wrap gap-2">
              {getLevel3Tags().map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(getTagPath(tag)) ? "default" : "outline"}
                  className={`cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${disabled ? 'pointer-events-none' : ''}`}
                  onClick={() => {
                    if (disabled) return;
                    const fullTag = getTagPath(tag);
                    if (selectedTags.includes(fullTag)) {
                      removeTag(fullTag);
                    } else {
                      addTag(fullTag);
                    }
                  }}
                >
                  {tag}
                  {selectedTags.includes(getTagPath(tag)) && !disabled && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">已选择的标签路径</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                {!disabled && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full hover:bg-accent p-0.5"
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            {selectedTags.length === 0 && (
              <span className="text-sm text-muted-foreground">未选择任何标签</span>
            )}
          </div>
        </div>
        
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">添加自定义标签</Label>
          <div className="flex gap-2">
            <Input
              placeholder="自定义标签"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTag();
                }
              }}
              disabled={disabled}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddCustomTag}
              disabled={disabled}
            >
              添加
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagSelector;
