
import React from 'react';
import styles from './MyMindMaps.module.css';
import { useMyMindMaps } from '@/hooks/useMyMindMaps';
import MindMapHeader from '@/components/mindmap/MindMapHeader';
import MindMapTabs from '@/components/mindmap/MindMapTabs';

// 使用从types导入的接口
import { SharedMindMap } from '@/types/mindmap';

const MyMindMaps = () => {
  const {
    filteredMindMaps,
    starredMindMaps,
    recentMindMaps,
    searchQuery,
    newMindMapName,
    setNewMindMapName,
    newMindMapDescription,
    setNewMindMapDescription,
    newMindMapTags,
    setNewMindMapTags,
    privacyOption,
    setPrivacyOption,
    createDialogOpen,
    setCreateDialogOpen,
    handleSearch,
    handleCreateMindMap,
    toggleStarred,
    toggleShared,
    handleDeleteMindMap,
    handleShareMindMap,
    handleEditMindMap
  } = useMyMindMaps();
  
  // 模拟的共享思维导图数据（在实际应用中应该从API获取）
  const [sharedMindMaps] = React.useState<SharedMindMap[]>([
    { id: 101, title: '机器学习概念图谱', creator: '张三', createdAt: '2023-06-12', likes: 45, views: 128, tags: ['AI', '机器学习'] },
    { id: 102, title: '前端开发技术栈', creator: '李四', createdAt: '2023-06-09', likes: 32, views: 96, tags: ['前端', 'Web开发'] },
    { id: 103, title: '英语学习路线图', creator: '王五', createdAt: '2023-06-07', likes: 28, views: 87, tags: ['语言学习', '英语'] },
    { id: 104, title: '高等数学知识梳理', creator: '赵六', createdAt: '2023-06-04', likes: 39, views: 112, tags: ['数学', '学习方法'] },
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <MindMapHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        newMindMapName={newMindMapName}
        setNewMindMapName={setNewMindMapName}
        newMindMapDescription={newMindMapDescription}
        setNewMindMapDescription={setNewMindMapDescription}
        newMindMapTags={newMindMapTags}
        setNewMindMapTags={setNewMindMapTags}
        privacyOption={privacyOption}
        setPrivacyOption={setPrivacyOption}
        onCreateMindMap={handleCreateMindMap}
      />

      <MindMapTabs 
        filteredMindMaps={filteredMindMaps}
        recentMindMaps={recentMindMaps}
        starredMindMaps={starredMindMaps}
        onToggleStar={toggleStarred}
        onToggleShared={toggleShared}
        onEditMindMap={handleEditMindMap}
        onDeleteMindMap={handleDeleteMindMap}
        onShareMindMap={handleShareMindMap}
      />
    </div>
  );
};

export default MyMindMaps;
