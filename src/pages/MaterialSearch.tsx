
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { userFilesService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { tagHierarchy } from '@/data/tagHierarchy';

// Import components
import MaterialSearchHeader from '@/components/material-search/MaterialSearchHeader';
import SearchForm from '@/components/material-search/SearchForm';
import MindMapVisualization from '@/components/material-search/MindMapVisualization';
import MaterialsList from '@/components/material-search/MaterialsList';
import SaveMindMapDialog from '@/components/material-search/dialogs/SaveMindMapDialog';
import MaterialPreviewDialog from '@/components/material-search/dialogs/MaterialPreviewDialog';
import MaterialListDialog from '@/components/material-search/dialogs/MaterialListDialog';

// Import utilities
import { flattenTags, findTagPath } from '@/components/material-search/utils/TagUtils';

// Import custom hooks
import { useMaterialSearch } from '@/hooks/useMaterialSearch';
import { useMindMap } from '@/hooks/useMindMap';
import { useMaterialPreview } from '@/hooks/useMaterialPreview';

const MaterialSearch = () => {
  const { user } = useAuth();
  const [filterVisible, setFilterVisible] = useState(false);
  const tagHierarchyRef = useRef(tagHierarchy);
  
  // Initialize custom hooks
  const {
    searchQuery,
    setSearchQuery,
    searchPerformed,
    setSearchPerformed,
    selectedTags,
    setSelectedTags,
    materialsData,
    setMaterialsData,
    selectedTagPath,
    setSelectedTagPath,
    toggleTag,
    clearAllTags,
    handleSearch,
    loadMaterials
  } = useMaterialSearch();
  
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
  } = useMindMap(materialsData, selectedTags, searchQuery, tagHierarchyRef.current);
  
  const {
    selectedMaterial,
    setSelectedMaterial,
    previewDialogOpen,
    setPreviewDialogOpen,
    materialsListByTag,
    setMaterialsListByTag,
    materialListDialogOpen,
    setMaterialListDialogOpen,
    selectedTagForList,
    setSelectedTagForList,
    handleMaterialSelect,
    downloadMaterial
  } = useMaterialPreview();

  const popularTags = flattenTags(tagHierarchyRef.current);

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  // Filter materials based on tag path
  const filteredMaterials = materialsData.filter(material => {
    if (selectedTagPath.length === 0) return true;
    
    return material.tags && selectedTagPath.every(tag => material.tags.includes(tag));
  });

  // Unified search function
  const handleSearchAndCreateMindMap = () => {
    handleSearch();
    createMindMap();
  };

  // Node click handler
  const onNodeClick = (event, node) => {
    if (node.id.startsWith('material-') && node.data.materialId) {
      const material = materialsData.find(m => m.id === node.data.materialId);
      if (material) {
        setSelectedMaterial(material);
        setPreviewDialogOpen(true);
        userFilesService.incrementViews(material.id);
      }
    } else if (node.data.isLastLevel && node.data.tagName) {
      const tagName = node.data.tagName;
      
      const taggedMaterials = materialsData.filter(m => 
        m.tags && m.tags.includes(tagName)
      );
      
      if (taggedMaterials.length === 1) {
        setSelectedMaterial(taggedMaterials[0]);
        setPreviewDialogOpen(true);
        userFilesService.incrementViews(taggedMaterials[0].id);
      } else if (taggedMaterials.length > 1) {
        setMaterialsListByTag(taggedMaterials);
        setSelectedTagForList(tagName);
        setMaterialListDialogOpen(true);
      } else {
        toast({
          title: "没有找到相关资料",
          description: `没有找到标签为 "${tagName}" 的资料`,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <MaterialSearchHeader 
        title="资料标签化导图搜索"
        description="通过关键词和标签，将资料以思维导图形式展现"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <SearchForm 
          onSearch={handleSearchAndCreateMindMap}
          onFilterToggle={toggleFilter}
          onTagToggle={toggleTag}
          onClearTags={clearAllTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterVisible={filterVisible}
          selectedTags={selectedTags}
          popularTags={popularTags}
        />
        
        {searchPerformed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <MindMapVisualization 
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onInitReactFlow={setReactFlowInstance}
              onSave={() => setSaveDialogOpen(true)}
              reactFlowInstance={reactFlowInstance}
            />
            
            <MaterialsList 
              selectedTagPath={selectedTagPath}
              filteredMaterials={filteredMaterials}
              onMaterialSelect={handleMaterialSelect}
              onDownload={downloadMaterial}
            />
          </motion.div>
        )}
      </motion.div>

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

export default MaterialSearch;
