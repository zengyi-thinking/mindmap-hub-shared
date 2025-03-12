import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { tagHierarchy } from '@/data/tagHierarchy';

// Import components
import MaterialSearchHeader from '@/components/material-search/MaterialSearchHeader';
import MaterialSearchControls from './MaterialSearchControls';
import MaterialSearchResults from './MaterialSearchResults';
import SaveMindMapDialog from '@/components/material-search/dialogs/SaveMindMapDialog';
import MaterialPreviewDialog from '@/components/material-search/dialogs/MaterialPreviewDialog';
import MaterialListDialog from '@/components/material-search/dialogs/MaterialListDialog';

// Import custom hooks
import { useMaterialSearch } from '@/hooks/useMaterialSearch';
import { useMindMap } from '@/hooks/useMindMap';
import { useMaterialPreview } from '@/hooks/useMaterialPreview';

/**
 * 材料搜索容器组件
 * 负责协调搜索控制、结果显示和对话框
 */
const MaterialSearchContainer: React.FC = () => {
  const { user } = useAuth();
  const tagHierarchyRef = useRef(tagHierarchy);
  
  // 初始化自定义钩子
  const materialSearch = useMaterialSearch();
  const {
    searchQuery,
    setSearchQuery,
    searchPerformed,
    selectedTags,
    materialsData,
    selectedTagPath,
    toggleTag,
    clearAllTags,
    handleSearch,
  } = materialSearch;
  
  const mindMap = useMindMap(materialsData, selectedTags, searchQuery, tagHierarchyRef.current);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    reactFlowInstance,
    setReactFlowInstance,
    saveDialogOpen,
    setSaveDialogOpen,
    mindMapTitle,
    setMindMapTitle,
    mindMapDescription,
    setMindMapDescription,
    createMindMap,
    saveMindMap
  } = mindMap;
  
  const materialPreview = useMaterialPreview();
  const {
    selectedMaterial,
    previewDialogOpen,
    setPreviewDialogOpen,
    materialsListByTag,
    materialListDialogOpen,
    setMaterialListDialogOpen,
    selectedTagForList,
    handleMaterialSelect,
    downloadMaterial
  } = materialPreview;

  // 统一搜索和创建思维导图
  const handleSearchAndCreateMindMap = () => {
    handleSearch();
    createMindMap();
  };

  // 过滤材料基于标签路径
  const filteredMaterials = materialsData.filter(material => {
    if (selectedTagPath.length === 0) return true;
    
    return material.tags && selectedTagPath.every(tag => material.tags.includes(tag));
  });

  // 处理节点点击
  const handleNodeClick = (event, node) => {
    materialPreview.onNodeClick(event, node, materialsData);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <MaterialSearchHeader 
        title="资料标签化导图搜索"
        description="通过关键词和标签，将资料以思维导图形式展现"
      />

      <MaterialSearchControls 
        materialSearch={materialSearch}
        onSearch={handleSearchAndCreateMindMap}
        tagHierarchy={tagHierarchyRef.current}
      />
      
      {searchPerformed && (
        <MaterialSearchResults 
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onInitReactFlow={setReactFlowInstance}
          reactFlowInstance={reactFlowInstance}
          onSave={() => setSaveDialogOpen(true)}
          selectedTagPath={selectedTagPath}
          filteredMaterials={filteredMaterials}
          onMaterialSelect={handleMaterialSelect}
          onDownload={downloadMaterial}
        />
      )}

      <SaveMindMapDialog 
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        mindMapTitle={mindMapTitle}
        setMindMapTitle={setMindMapTitle}
        mindMapDescription={mindMapDescription}
        setMindMapDescription={setMindMapDescription}
        selectedTags={selectedTags}
        onSave={saveMindMap}
      />

      <MaterialPreviewDialog 
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        material={selectedMaterial}
        onDownload={downloadMaterial}
        user={user}
      />

      <MaterialListDialog 
        open={materialListDialogOpen}
        onOpenChange={setMaterialListDialogOpen}
        materials={materialsListByTag}
        tagName={selectedTagForList}
        onMaterialSelect={handleMaterialSelect}
      />
    </div>
  );
};

export default MaterialSearchContainer; 