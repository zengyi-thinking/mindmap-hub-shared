/**
 * 桥接文件 - 从新的Clean Architecture导出MindMapHeader组件
 * 这个文件作为桥接，将导入重定向到新的位置
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Search, Plus } from 'lucide-react';

interface MindMapHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  newMindMapName: string;
  setNewMindMapName: (name: string) => void;
  newMindMapDescription: string;
  setNewMindMapDescription: (desc: string) => void;
  newMindMapTags: string;
  setNewMindMapTags: (tags: string) => void;
  privacyOption: string;
  setPrivacyOption: (option: string) => void;
  onCreateMindMap: () => void;
}

// 重新实现MindMapHeader组件
const MindMapHeader: React.FC<MindMapHeaderProps> = ({
  searchQuery,
  onSearchChange,
  setCreateDialogOpen
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          思维导图管理
        </h1>
        <p className="text-muted-foreground mt-1">
          创建、编辑和管理您的思维导图
        </p>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索思维导图..."
            className="pl-9"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 flex-shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          创建思维导图
        </Button>
      </div>
    </div>
  );
};

export default MindMapHeader; 