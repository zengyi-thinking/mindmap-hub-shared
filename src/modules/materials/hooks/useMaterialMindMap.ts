import { useCallback, useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { generateMindMap } from '@/modules/mindmap/utils/MindMapGenerator';
import { useMaterialSearch } from './useMaterialSearch';
import { TagCategory } from '@/modules/materials/types/materials';

// 材料思维导图钩子，处理材料和思维导图之间的交互
export const useMaterialMindMap = (
  initialMaterials: any[] = [],
  tagHierarchy: TagCategory[] = []
) => {
  // 使用材料搜索钩子获取基础搜索功能
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredMaterials, 
    selectedTags, 
    setSelectedTags, 
    isLoading, 
    setFilteredMaterials
  } = useMaterialSearch(initialMaterials);
  
  // 存储思维导图数据
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 生成思维导图
  const generateMaterialMindMap = useCallback(() => {
    setIsGenerating(true);
    
    try {
      // 使用我们的MindMapGenerator生成节点和边
      const { nodes: newNodes, edges: newEdges } = generateMindMap({
        searchQuery,
        selectedTags,
        materialsData: filteredMaterials,
        tagHierarchy
      });
      
      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error('生成思维导图时出错:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [searchQuery, selectedTags, filteredMaterials, tagHierarchy]);
  
  // 根据点击的节点更新材料过滤
  const handleNodeClick = useCallback((node: Node) => {
    if (node.data.type === 'tag' && Array.isArray(node.data.fullPath)) {
      // 更新所选标签以进行过滤
      setSelectedTags(node.data.fullPath);
    } else if (node.data.type === 'material' && node.data.material) {
      // 处理材料节点点击 - 可以在这里触发预览或详情查看
      console.log('查看材料:', node.data.material);
      // 可以添加导航或打开详情弹窗的逻辑
    }
  }, [setSelectedTags]);
  
  // 清除思维导图
  const clearMindMap = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, []);
  
  // 重置所有过滤器和思维导图
  const resetAll = useCallback(() => {
    setSearchQuery('');
    setSelectedTags([]);
    setFilteredMaterials(initialMaterials);
    clearMindMap();
  }, [setSearchQuery, setSelectedTags, setFilteredMaterials, initialMaterials, clearMindMap]);
  
  return {
    // 材料相关
    searchQuery,
    setSearchQuery,
    filteredMaterials,
    selectedTags,
    setSelectedTags,
    isLoading,
    
    // 思维导图相关
    nodes,
    edges,
    isGenerating,
    generateMaterialMindMap,
    handleNodeClick,
    clearMindMap,
    resetAll
  };
}; 
