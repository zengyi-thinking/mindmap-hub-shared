import React, { useState, useCallback, useEffect } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  Node, 
  Edge,
  ReactFlowInstance
} from '@xyflow/react';
import { generateMindMap } from './MindMapGenerator';
import MindMapVisualization from './MindMapVisualization';
import { useMaterialPreview } from '@/modules/materials/hooks/useMaterialPreview';
import { useToast } from '@/components/ui/use-toast';

interface TagMindMapProps {
  searchQuery: string;
  selectedTags: string[];
  materials: any[];
  tagHierarchy: any[];
}

const TagMindMap: React.FC<TagMindMapProps> = ({
  searchQuery,
  selectedTags,
  materials,
  tagHierarchy
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const { toast } = useToast();
  
  // 使用自定义Hook处理节点点击预览功能
  const { onNodeClick, showMaterialPreview } = useMaterialPreview(materials);

  // 生成思维导图
  const generateMap = useCallback(() => {
    if (!materials || !tagHierarchy) return;

    // 使用MindMapGenerator生成节点和边
    const { nodes: newNodes, edges: newEdges } = generateMindMap({
      searchQuery,
      selectedTags,
      materialsData: materials,
      tagHierarchy
    });

    // 设置节点和边
    setNodes(newNodes);
    setEdges(newEdges);
    
    // 计算统计信息
    const tagCount = newNodes.filter(node => node.data.type === 'tag').length;
    const materialCount = newNodes.filter(node => node.data.type === 'material').length;
    
    // 找出连接最多的节点
    const nodeConnections = newNodes.map(node => {
      const connections = newEdges.filter(
        edge => edge.source === node.id || edge.target === node.id
      ).length;
      return { id: node.id, label: node.data.label, connections };
    });
    
    const mostConnectedNode = nodeConnections.reduce(
      (prev, current) => (prev.connections > current.connections ? prev : current),
      { id: '', label: '', connections: 0 }
    );
    
    setStatistics({
      totalNodes: newNodes.length,
      tagCount,
      materialCount,
      connectionCount: newEdges.length,
      mostConnectedNode: mostConnectedNode.connections > 0 ? mostConnectedNode : null
    });
    
  }, [searchQuery, selectedTags, materials, tagHierarchy, setNodes, setEdges]);

  // 初始化或条件变化时重新生成
  useEffect(() => {
    generateMap();
  }, [generateMap]);

  // 初始化ReactFlow实例
  const onInitReactFlow = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
    setTimeout(() => {
      instance.fitView({ padding: 0.2 });
    }, 100);
  }, []);

  // 保存思维导图为图片
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const dataUrl = reactFlowInstance.toImage({
        quality: 1,
        width: 1920,
        height: 1080,
        backgroundColor: '#f8fafc'
      });
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `思维导图-${searchQuery || '全部资料'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "思维导图已保存",
        description: "图片已成功保存到您的下载文件夹",
        variant: "default",
      });
    }
  }, [reactFlowInstance, searchQuery, toast]);

  return (
    <div className="w-full">
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
      {showMaterialPreview}
    </div>
  );
};

export default TagMindMap; 
