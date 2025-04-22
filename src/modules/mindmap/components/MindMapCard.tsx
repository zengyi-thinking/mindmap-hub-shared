
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Calendar, Brain, Edit, Trash2, Star, Share2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MindMap } from '@/modules/mindmap/types/mindmap';

interface MindMapCardProps {
  mindMap: MindMap;
  onToggleStar: (id: number, e?: React.MouseEvent) => void;
  onToggleShared: (id: number, e?: React.MouseEvent) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, e?: React.MouseEvent) => void;
  onShare: (mindMap: MindMap, e?: React.MouseEvent) => void;
}

const MindMapCard: React.FC<MindMapCardProps> = ({ 
  mindMap, 
  onToggleStar, 
  onToggleShared,
  onEdit,
  onDelete,
  onShare
}) => {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} 
      className="cardEntrance"
    >
      <Card className="overflow-hidden h-full mindmapCard cardShadow">
        <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0 cardHeader">
          <CardTitle className="text-lg font-semibold truncate">{mindMap.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 lineIcon" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => onToggleStar(mindMap.id, e)}>
                {mindMap.starred ? (
                  <>
                    <Star className="mr-2 h-4 w-4 fill-primary text-primary fillIcon" />
                    取消收藏
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4 lineIcon" />
                    收藏
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onToggleShared(mindMap.id, e)}>
                <Share2 className="mr-2 h-4 w-4 lineIcon" />
                {mindMap.shared ? '取消共享' : '共享'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(mindMap.id)}>
                <Edit className="mr-2 h-4 w-4 lineIcon" />
                重命名
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive" 
                onClick={(e) => onDelete(mindMap.id, e)}
              >
                <Trash2 className="mr-2 h-4 w-4 lineIcon" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 pt-3">
          <div className="w-full h-32 rounded-md flex items-center justify-center mb-2 mindmapPreview">
            <Brain className="h-12 w-12 text-primary/60 mindmapIcon" />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4 lineIcon" />
            {mindMap.updatedAt}
          </div>
          <Button size="sm" className="editButton" onClick={() => onEdit(mindMap.id)}>编辑</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MindMapCard;

