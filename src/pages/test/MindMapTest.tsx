import React, { useState } from 'react';
import { MaterialSearchMindMap } from '@/domains/mindmap';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactFlowProvider } from '@xyflow/react';

const testCategories = [
  {
    id: 'c1',
    name: '编程语言',
    children: [
      {
        id: 'c1-1',
        name: '前端开发',
        children: [
          { id: 'c1-1-1', name: 'JavaScript' },
          { id: 'c1-1-2', name: 'TypeScript' },
          { id: 'c1-1-3', name: 'React框架' }
        ]
      },
      {
        id: 'c1-2',
        name: '后端开发',
        children: [
          { id: 'c1-2-1', name: '数据库' },
          { id: 'c1-2-2', name: '服务器' },
          { id: 'c1-2-3', name: 'API设计' }
        ]
      }
    ]
  },
  {
    id: 'c2',
    name: '设计资源',
    children: [
      {
        id: 'c2-1',
        name: 'UI设计',
        children: [
          { id: 'c2-1-1', name: '设计规范' },
          { id: 'c2-1-2', name: '图标资源' }
        ]
      },
      {
        id: 'c2-2',
        name: 'UX设计',
        children: [
          { id: 'c2-2-1', name: '用户研究' },
          { id: 'c2-2-2', name: '交互设计' }
        ]
      }
    ]
  },
  {
    id: 'c3',
    name: '学习资料',
    children: [
      { id: 'c3-1', name: '电子书' },
      { id: 'c3-2', name: '视频教程' },
      { id: 'c3-3', name: '在线课程' }
    ]
  }
];

const testMaterials = [
  {
    id: '1',
    title: 'React入门教程',
    description: 'React基础知识与实践',
    tags: ['编程语言', '前端开发', 'React框架'],
    createdAt: '2023-05-15'
  },
  {
    id: '2',
    title: 'TypeScript高级指南',
    description: '深入TypeScript类型系统',
    tags: ['编程语言', '前端开发', 'TypeScript'],
    createdAt: '2023-06-22'
  },
  {
    id: '3',
    title: '现代UI设计规范',
    description: '设计系统与组件库设计指南',
    tags: ['设计资源', 'UI设计', '设计规范'],
    createdAt: '2023-07-10'
  }
];

const MindMapTest: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<'tree' | 'radial'>('tree');
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">思维导图中文测试</h1>
      
      <div className="mb-4">
        <Tabs value={layoutMode} onValueChange={(value) => setLayoutMode(value as 'tree' | 'radial')}>
          <TabsList>
            <TabsTrigger value="tree">树状布局</TabsTrigger>
            <TabsTrigger value="radial">放射布局</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="border rounded-lg h-[600px] bg-card">
        <ReactFlowProvider>
          <MaterialSearchMindMap
            categories={testCategories}
            materials={testMaterials}
            layoutMode={layoutMode}
            onNodeClick={(event, node) => {
              console.log('点击节点:', node);
            }}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default MindMapTest; 