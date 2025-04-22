import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Node, Edge, ReactFlow, Controls, Background, ReactFlowProvider } from '@xyflow/react';
import { FolderOpen, Folder, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tagHierarchy } from '@/data/tagHierarchy';
import { userFilesService } from '@/lib/storage';
import MaterialNode from '@/modules/mindmap/components/MaterialNode';
import { ScrollArea } from '@/components/ui/scroll-area';

// 注册自定义节点类型
const nodeTypes = {
  materialNode: MaterialNode
};

interface MaterialMindMapGeneratorProps {
  onSelectMaterial: (material: any) => void;
}

const MaterialMindMapGenerator: React.FC<MaterialMindMapGeneratorProps> = ({
  onSelectMaterial
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [folderMaterials, setFolderMaterials] = useState<any[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // 生成思维导图
  const generateMindMap = useCallback(() => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];
    
    // 添加根节点 - 横向布局，放在左侧中间
    generatedNodes.push({
      id: 'root',
      type: 'materialNode',
      position: { x: 50, y: 300 },
      data: {
        label: '资料总览',
        icon: 'Database',
        isRoot: true
      }
    });
    
    // 递归生成节点和边 - 横向布局
    const generateNodesAndEdges = (
      categories: typeof tagHierarchy,
      parentId: string,
      level: number,
      parentX: number,
      parentY: number,
      totalSiblings: number
    ) => {
      // 横向布局参数调整
      const xSpacing = 250; // 水平间距
      const levelHeight = 200; // 每个级别的子节点垂直分布高度
      
      // 计算子节点总高度
      const totalHeight = categories.length <= 1 
        ? 0 
        : levelHeight * (categories.length - 1);
      
      // 计算垂直起始位置，使子节点围绕父节点垂直居中
      const startY = parentY - totalHeight / 2;
      
      categories.forEach((category, i) => {
        const nodeId = `${parentId}-${category.id}`;
        const x = parentX + xSpacing; // 水平位置向右递增
        const y = categories.length <= 1 
          ? parentY // 只有一个子节点时居中
          : startY + i * levelHeight; // 多个子节点时垂直分布
        
        // 创建当前节点
        generatedNodes.push({
          id: nodeId,
          type: 'materialNode',
          position: { x, y },
          data: {
            label: category.name,
            icon: 'Folder',
            folderPath: nodeId.split('-').slice(1).map(id => {
              // 查找对应的名称
              const findName = (categories: typeof tagHierarchy, id: string): string => {
                for (const cat of categories) {
                  if (cat.id === id) return cat.name;
                  if (cat.children) {
                    const found = findName(cat.children, id);
                    if (found) return found;
                  }
                }
                return id;
              };
              
              return findName(tagHierarchy, id);
            })
          }
        });
        
        // 创建连接到父节点的边
        generatedEdges.push({
          id: `e-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'default',
          animated: false
        });
        
        // 递归处理子节点
        if (category.children && category.children.length > 0) {
          generateNodesAndEdges(
            category.children,
            nodeId,
            level + 1,
            x,
            y,
            category.children.length
          );
        }
      });
    };
    
    // 从根节点开始递归生成
    generateNodesAndEdges(
      tagHierarchy,
      'root',
      0,
      50,
      300,
      tagHierarchy.length
    );
    
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, []);
  
  // 初始化思维导图
  useEffect(() => {
    generateMindMap();
  }, [generateMindMap]);
  
  // 当路径变化时，获取当前文件夹的资料
  useEffect(() => {
    if (currentPath.length > 0) {
      const filesInFolder = userFilesService.getByDirectFolder(currentPath);
      setFolderMaterials(filesInFolder.filter(file => file.approved));
    } else {
      setFolderMaterials([]);
    }
  }, [currentPath]);
  
  // 处理节点点击
  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (node.id === 'root') {
      // 点击根节点，清空当前路径
      setCurrentPath([]);
      return;
    }
    
    // 从节点ID中提取路径
    const nodePath = node.id.split('-').slice(1);
    setCurrentPath(nodePath);
  };
  
  // 返回上一级
  const goBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };
  
  // 搜索处理
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // 过滤当前文件夹的资料
  const filteredMaterials = folderMaterials.filter(material => 
    searchQuery === '' || 
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goBack}
          disabled={currentPath.length === 0}
          className="shrink-0"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回上级
        </Button>
        
        <div className="flex-1">
          <Input
            placeholder="搜索当前文件夹资料..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex-1 flex border rounded-md overflow-hidden">
        <ReactFlowProvider>
          <div className="w-2/3 h-full relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onInit={setReactFlowInstance}
              onNodeClick={handleNodeClick}
              fitView
              attributionPosition="bottom-right"
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
          
          <div className="w-1/3 border-l p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FolderOpen className="w-5 h-5 mr-2" />
              {currentPath.length > 0 
                ? currentPath[currentPath.length - 1] 
                : '所有资料'}
            </h3>
            
            <ScrollArea className="h-[calc(100%-40px)]">
              {filteredMaterials.length > 0 ? (
                <div className="space-y-3">
                  {filteredMaterials.map(material => (
                    <div
                      key={material.id}
                      className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                      onClick={() => onSelectMaterial(material)}
                    >
                      <h4 className="font-medium">{material.title}</h4>
                      {material.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {material.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(material.uploadDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {material.filename.split('.').pop()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Folder className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  {searchQuery ? '没有找到匹配的资料' : '当前文件夹为空'}
                </div>
              )}
            </ScrollArea>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default MaterialMindMapGenerator; 
