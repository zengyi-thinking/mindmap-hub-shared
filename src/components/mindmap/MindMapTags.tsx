
import React from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MindMapTagsProps {
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
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
    <div className="px-4 py-2 border-b flex items-center flex-wrap gap-2">
      <div className="flex-1 flex flex-wrap gap-2 items-center">
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="group flex items-center gap-1 px-2 py-1"
            >
              {tag}
              <button
                onClick={() => onRemoveTag(tag)}
                className="ml-1 h-3.5 w-3.5 rounded-full bg-muted-foreground/30 flex items-center justify-center hover:bg-destructive/50"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">添加标签以便分类</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddTag()}
          placeholder="添加标签..."
          className="w-32 h-8 text-sm"
        />
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 px-2" 
          onClick={onAddTag}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MindMapTags;
