
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface MindMapTagsProps {
  tags: string[];
  tagInput: string;
  setTagInput: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

const MindMapTags: React.FC<MindMapTagsProps> = ({
  tags,
  tagInput,
  setTagInput,
  onAddTag,
  onRemoveTag
}) => {
  return (
    <div className="px-4 py-2 border-b bg-muted/20">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">标签:</div>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onRemoveTag(tag)} 
              />
            </Badge>
          ))}
        </div>
        <div className="flex items-center">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="添加标签..."
            className="h-7 text-xs w-32"
            onKeyDown={(e) => e.key === 'Enter' && onAddTag()}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2" 
            onClick={onAddTag}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MindMapTags;
