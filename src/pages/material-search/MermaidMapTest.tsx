import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, SettingsIcon } from 'lucide-react';
import { MaterialMermaidMindMap } from '@/domains/mindmap';
import { mockMaterials, mockCategories } from '@/features/material-search/MockData';

/**
 * MaterialMermaidMindMap组件测试页面
 * 用于独立测试基于Mermaid的资料思维导图组件
 */
const MermaidMapTest: React.FC = () => {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  // 处理节点点击
  const handleNodeClick = (classNames: string[]) => {
    setSelectedNode(classNames);
    console.log('节点点击:', classNames);
  };

  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };

  // 切换调试信息
  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="outline"
            className="mr-3"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-3xl font-bold">Mermaid思维导图测试</h1>
        </div>
        <Button 
          variant="secondary"
          onClick={toggleDebug}
        >
          <SettingsIcon className="w-4 h-4 mr-2" />
          {showDebug ? '隐藏调试信息' : '显示调试信息'}
        </Button>
      </div>

      {showDebug && (
        <Card className="p-4 mb-6 bg-slate-50">
          <h2 className="text-lg font-semibold mb-2">调试信息</h2>
          <div className="text-sm">
            <div className="font-medium">所选节点类名:</div>
            <pre className="bg-slate-100 p-3 rounded mt-2 overflow-auto max-h-40 text-xs">
              {selectedNode.length > 0 ? selectedNode.join('\n') : '尚未选择节点'}
            </pre>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800">
            提示: 点击思维导图中的节点查看节点信息
          </div>
        </Card>
      )}

      <Card className="h-[calc(100vh-200px)] min-h-[600px] overflow-hidden flex flex-col">
        <div className="p-3 border-b">
          <h2 className="text-lg font-medium">基于Mermaid的资料思维导图</h2>
        </div>
        
        <div className="flex-1 relative">
          <MaterialMermaidMindMap
            materials={mockMaterials}
            categories={mockCategories}
            onNodeClick={handleNodeClick}
          />
        </div>
      </Card>
    </div>
  );
};

export default MermaidMapTest; 