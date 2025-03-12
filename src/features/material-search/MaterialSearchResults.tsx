import React from 'react';
import { motion } from 'framer-motion';
import MindMapVisualization from '@/components/material-search/MindMapVisualization';
import MaterialsList from '@/components/material-search/MaterialsList';

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
  onDownload
}) => {
  return (
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
        onInitReactFlow={onInitReactFlow}
        onSave={onSave}
        reactFlowInstance={reactFlowInstance}
      />
      
      <MaterialsList 
        selectedTagPath={selectedTagPath}
        filteredMaterials={filteredMaterials}
        onMaterialSelect={onMaterialSelect}
        onDownload={onDownload}
      />
    </motion.div>
  );
};

export default MaterialSearchResults; 