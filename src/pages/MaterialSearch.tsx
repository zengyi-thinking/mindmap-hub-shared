
import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { userFilesService, materialsService, mindMapsService } from '@/lib/storage';
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
import { generateMindMap } from '@/components/material-search/MindMapGenerator';

const MaterialSearch = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTagPath, setSelectedTagPath] = useState<string[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [mindMapTitle, setMindMapTitle] = useState('');
  const [mindMapDescription, setMindMapDescription] = useState('');
  const [materialsData, setMaterialsData] = useState([]);
  const [materialsListByTag, setMaterialsListByTag] = useState([]);
  const [materialListDialogOpen, setMaterialListDialogOpen] = useState(false);
  const [selectedTagForList, setSelectedTagForList] = useState('');

  // Initialize data
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    const approvedFiles = userFilesService.getApprovedFiles();
    setMaterialsData(approvedFiles);
  };

  const popularTags = flattenTags(tagHierarchy);

  // Tag handling
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // ReactFlow handlers
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Create mindmap
  const createMindMap = () => {
    const { nodes: newNodes, edges: newEdges } = generateMindMap({
      searchQuery,
      selectedTags,
      materialsData,
      tagHierarchy
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Search and filter
  const handleSearch = () => {
    setSearchPerformed(true);
    
    if (searchQuery || selectedTags.length > 0) {
      let filtered = materialsData;
      
      if (selectedTags.length > 0) {
        filtered = filtered.filter(material => 
          material.tags && selectedTags.some(tag => material.tags.includes(tag))
        );
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(material => 
          (material.title && material.title.toLowerCase().includes(query)) ||
          (material.description && material.description.toLowerCase().includes(query)) ||
          (material.file && material.file.name.toLowerCase().includes(query)) ||
          (material.tags && material.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }
      
      setMaterialsData(filtered);
    } else {
      loadMaterials();
    }
    
    createMindMap();
    
    if (selectedTags.length > 0) {
      const firstTag = selectedTags[0];
      const tagPath = findTagPath(tagHierarchy, firstTag);
      setSelectedTagPath(tagPath.length > 0 ? tagPath : [firstTag]);
    } else if (materialsData.length > 0 && materialsData[0]?.tags) {
      setSelectedTagPath([materialsData[0].tags[0]]);
    }
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  // Filter materials based on tag path
  const filteredMaterials = materialsData.filter(material => {
    if (selectedTagPath.length === 0) return true;
    
    return material.tags && selectedTagPath.every(tag => material.tags.includes(tag));
  });

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

  // Save mindmap
  const saveMindMap = () => {
    if (!mindMapTitle.trim()) {
      toast({
        title: "请输入标题",
        description: "思维导图需要一个标题才能保存",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能保存思维导图",
        variant: "destructive"
      });
      return;
    }
    
    const mindMapData = {
      id: Date.now(),
      title: mindMapTitle,
      description: mindMapDescription,
      content: {
        nodes: nodes,
        edges: edges,
        version: "1.0"
      },
      tags: selectedTags,
      updatedAt: new Date().toISOString(),
      creator: user.username || 'Unknown',
      starred: false,
      shared: true
    };
    
    mindMapsService.add(mindMapData);
    
    toast({
      title: "保存成功",
      description: "思维导图已成功保存"
    });
    
    setSaveDialogOpen(false);
    setMindMapTitle('');
    setMindMapDescription('');
  };

  // Download material
  const downloadMaterial = (material) => {
    if (!material || !material.file) return;
    
    userFilesService.incrementDownloads(material.id);
    
    const link = document.createElement('a');
    link.href = material.file.content || material.file.dataUrl;
    link.download = material.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "下载开始",
      description: `${material.file.name} 下载已开始`
    });
  };

  // Handle material selection for previewing
  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    setPreviewDialogOpen(true);
    setMaterialListDialogOpen(false);
    userFilesService.incrementViews(material.id);
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
          onSearch={handleSearch}
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
