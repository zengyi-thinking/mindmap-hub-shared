
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, FileUp, LayoutGrid, Save } from 'lucide-react';
import SearchBar from './SearchBar';
import CreateMindMapDialog from './CreateMindMapDialog';

// Interface for the MyMindMaps page
interface MindMapListHeaderProps {
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

// Interface for the MindMapEditor page
interface MindMapEditorHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  onAddNode: () => void;
  onAttachMaterial: () => void;
  onAutoLayout: () => void;
  onSave: () => void;
}

// Union type to support both usages
type MindMapHeaderProps = MindMapListHeaderProps | MindMapEditorHeaderProps;

// Type guard to check which type of props we're dealing with
function isEditorProps(props: MindMapHeaderProps): props is MindMapEditorHeaderProps {
  return 'title' in props;
}

const MindMapHeader: React.FC<MindMapHeaderProps> = (props) => {
  // Editor view header
  if (isEditorProps(props)) {
    const { title, setTitle, onAddNode, onAttachMaterial, onAutoLayout, onSave } = props;
    
    return (
      <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入思维导图标题..."
            className="text-3xl font-bold tracking-tight w-full bg-transparent border-none focus:outline-none focus:ring-0"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onAddNode}>
            <Plus className="mr-1 h-4 w-4" />
            添加节点
          </Button>
          <Button size="sm" variant="outline" onClick={onAttachMaterial}>
            <FileUp className="mr-1 h-4 w-4" />
            附件资料
          </Button>
          <Button size="sm" variant="outline" onClick={onAutoLayout}>
            <LayoutGrid className="mr-1 h-4 w-4" />
            自动布局
          </Button>
          <Button size="sm" variant="default" onClick={onSave}>
            <Save className="mr-1 h-4 w-4" />
            保存
          </Button>
        </div>
      </div>
    );
  }
  
  // Mind map list view header
  const {
    searchQuery,
    onSearchChange,
    createDialogOpen,
    setCreateDialogOpen,
    newMindMapName,
    setNewMindMapName,
    newMindMapDescription,
    setNewMindMapDescription,
    newMindMapTags,
    setNewMindMapTags,
    privacyOption,
    setPrivacyOption,
    onCreateMindMap
  } = props;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight mainTitle"
        >
          我的思维导图
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          className="text-muted-foreground subTitle"
        >
          创建、编辑和整理您的思维导图
        </motion.p>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        
        <CreateMindMapDialog
          isOpen={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreateMindMap={onCreateMindMap}
          newMindMapName={newMindMapName}
          setNewMindMapName={setNewMindMapName}
          newMindMapDescription={newMindMapDescription}
          setNewMindMapDescription={setNewMindMapDescription}
          newMindMapTags={newMindMapTags}
          setNewMindMapTags={setNewMindMapTags}
          privacyOption={privacyOption}
          setPrivacyOption={setPrivacyOption}
        />
      </div>
    </div>
  );
};

export default MindMapHeader;
