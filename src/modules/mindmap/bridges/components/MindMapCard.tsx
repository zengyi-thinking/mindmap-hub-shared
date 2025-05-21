/**
 * 桥接文件 - MindMapCard组件
 * 此文件作为桥接，提供简单的实现
 */

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Edit, Trash, Share, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 简单的MindMapCard组件
interface MindMapCardProps {
  mindMap: any;
  onEdit?: (id: number) => void;
  onDelete?: (id: number, e?: React.MouseEvent) => void;
  onShare?: (mindMap: any, e?: React.MouseEvent) => void;
  onToggleStar?: (id: number) => void;
  onToggleShared?: (id: number) => void;
}

const MindMapCard: React.FC<MindMapCardProps> = ({
  mindMap,
  onEdit,
  onDelete,
  onShare,
  onToggleStar,
  onToggleShared
}) => {
  if (!mindMap) return null;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <h3 className="font-medium text-lg">{mindMap.title}</h3>
        {mindMap.description && (
          <p className="text-sm text-muted-foreground mt-1">{mindMap.description}</p>
        )}
        
        {mindMap.tags && mindMap.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {mindMap.tags.map((tag: string) => (
              <span 
                key={tag} 
                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-muted/50 p-2 flex justify-between">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit && onEdit(mindMap.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => onDelete && onDelete(mindMap.id, e)}
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onToggleStar && onToggleStar(mindMap.id)}
            className={mindMap.starred ? "text-yellow-500" : ""}
          >
            <Star className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => onShare && onShare(mindMap, e)}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MindMapCard; 