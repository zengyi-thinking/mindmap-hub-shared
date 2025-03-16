
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MindMap } from '@/types/mindmap';
import MindMapCard from './MindMapCard';

interface MindMapTabsProps {
  filteredMindMaps: MindMap[];
  recentMindMaps: MindMap[];
  starredMindMaps: MindMap[];
  onToggleStar: (id: number, e?: React.MouseEvent) => void;
  onToggleShared: (id: number, e?: React.MouseEvent) => void;
  onEditMindMap: (id: number) => void;
  onDeleteMindMap: (id: number, e?: React.MouseEvent) => void;
  onShareMindMap: (mindMap: MindMap, e?: React.MouseEvent) => void;
}

const MindMapTabs: React.FC<MindMapTabsProps> = ({
  filteredMindMaps,
  recentMindMaps,
  starredMindMaps,
  onToggleStar,
  onToggleShared,
  onEditMindMap,
  onDeleteMindMap,
  onShareMindMap
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
    >
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="tabUnderline">全部</TabsTrigger>
          <TabsTrigger value="recent" className="tabUnderline">最近</TabsTrigger>
          <TabsTrigger value="starred" className="tabUnderline">收藏</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 contentGrid"
          >
            {filteredMindMaps.map((mindMap) => (
              <MindMapCard 
                key={mindMap.id}
                mindMap={mindMap}
                onToggleStar={onToggleStar}
                onToggleShared={onToggleShared}
                onEdit={onEditMindMap}
                onDelete={onDeleteMindMap}
                onShare={onShareMindMap}
              />
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="recent">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 contentGrid"
          >
            {recentMindMaps.slice(0, 6).map((mindMap) => (
              <MindMapCard 
                key={mindMap.id}
                mindMap={mindMap}
                onToggleStar={onToggleStar}
                onToggleShared={onToggleShared}
                onEdit={onEditMindMap}
                onDelete={onDeleteMindMap}
                onShare={onShareMindMap}
              />
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="starred">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 contentGrid"
          >
            {starredMindMaps.map((mindMap) => (
              <MindMapCard 
                key={mindMap.id}
                mindMap={mindMap}
                onToggleStar={onToggleStar}
                onToggleShared={onToggleShared}
                onEdit={onEditMindMap}
                onDelete={onDeleteMindMap}
                onShare={onShareMindMap}
              />
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MindMapTabs;
