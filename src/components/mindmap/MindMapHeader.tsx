
import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import CreateMindMapDialog from './CreateMindMapDialog';

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

const MindMapHeader: React.FC<MindMapHeaderProps> = ({
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
}) => {
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
