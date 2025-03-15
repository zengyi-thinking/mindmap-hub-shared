
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Tag, FileText, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

import { userFilesService } from '@/lib/storage';
import { tagHierarchy } from '@/data/tagHierarchy';
import { flattenTags } from '@/components/material-search/utils/TagUtils';

import FileMapVisualizer from '@/components/filemap/FileMapVisualizer';
import SearchResultList from '@/components/filemap/SearchResultList';
import { generateFileMap } from '@/components/filemap/FileMapGenerator';
import { Material } from '@/types/materials';

const FileMapSearch: React.FC = () => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Mind map state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Load materials and tags on mount
  useEffect(() => {
    const allMaterials = userFilesService.getApprovedFiles();
    setMaterials(allMaterials);
    
    const tags = flattenTags(tagHierarchy);
    setAvailableTags(tags);
  }, []);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle search
  const handleSearch = () => {
    let results = [...materials];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(material => 
        material.title.toLowerCase().includes(query) || 
        (material.description && material.description.toLowerCase().includes(query))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      results = results.filter(material => 
        material.tags && selectedTags.some(tag => material.tags.includes(tag))
      );
    }
    
    setFilteredMaterials(results);
    setSearchPerformed(true);
    
    // Generate mind map
    const { nodes: newNodes, edges: newEdges } = generateFileMap({
      materials: results,
      selectedTags,
      searchQuery
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
    
    if (results.length === 0) {
      toast({
        title: "未找到匹配的资料",
        description: "请尝试不同的搜索词或标签",
        variant: "destructive"
      });
    } else {
      toast({
        title: `找到 ${results.length} 个资料`,
        description: "生成资料地图完成"
      });
    }
  };

  // Handle file selection
  const handleFileSelect = (file: Material) => {
    // Navigate to file detail or preview
    console.log("Selected file:", file);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-center mb-2">FileMap</h1>
        <p className="text-muted-foreground text-center mb-6">
          本站已收录245篇资料，标签187个分类
        </p>
      </motion.div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between">
            <span>搜索</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索自动化专业..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>搜索</Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
            <Badge 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => setShowTagSelector(!showTagSelector)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {showTagSelector ? "收起标签" : "选择标签"}
            </Badge>
          </div>

          {showTagSelector && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border rounded-md p-3 mt-2 bg-muted/20"
            >
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {searchPerformed && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">资料地图</h2>
            <FileMapVisualizer 
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onInit={setReactFlowInstance}
              reactFlowInstance={reactFlowInstance}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">搜索结果</h2>
            <SearchResultList 
              materials={filteredMaterials} 
              onSelect={handleFileSelect} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FileMapSearch;
