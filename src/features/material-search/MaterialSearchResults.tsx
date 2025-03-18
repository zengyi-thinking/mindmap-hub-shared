import React from 'react';
import { motion } from 'framer-motion';
import MindMapVisualization from '@/components/material-search/MindMapVisualization';
import MaterialsList from '@/components/material-search/MaterialsList';
import { Button } from '@/components/ui/button';
import { Search, RefreshCcw } from 'lucide-react';

interface MaterialSearchResultsProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onNodeClick: (event: any, node: any) => void;
  onInitReactFlow: (instance: any) => void;
  reactFlowInstance: any;
  onSave: () => void;
  selectedTagPath: string[];
  filteredMaterials: any[];
  onMaterialSelect: (material: any) => void;
  onDownload: (material: any) => void;
  statistics?: any;
}

/**
 * 材料搜索结果组件
 * 负责显示思维导图和材料列表
 */
const MaterialSearchResults: React.FC<MaterialSearchResultsProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onInitReactFlow,
  reactFlowInstance,
  onSave,
  selectedTagPath,
  filteredMaterials,
  onMaterialSelect,
  onDownload,
  statistics
}) => {
  const hasNoResults = nodes.length === 0 || (nodes.length === 1 && nodes[0].data.label === '搜索结果');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-6"
    >
      {hasNoResults ? (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center justify-center my-8">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">未找到匹配结果</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            没有找到与您搜索条件匹配的资料。请尝试使用更广泛的关键词或减少标签筛选条件。
          </p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            重置搜索
          </Button>
        </div>
      ) : (
        <>
          <MindMapVisualization 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onInitReactFlow={onInitReactFlow}
            onSave={onSave}
            reactFlowInstance={reactFlowInstance}
            statistics={statistics}
          />
          
          <MaterialsList 
            selectedTagPath={selectedTagPath}
            filteredMaterials={filteredMaterials}
            onMaterialSelect={onMaterialSelect}
            onDownload={onDownload}
          />
        </>
      )}
    </motion.div>
  );
};

export default MaterialSearchResults; 