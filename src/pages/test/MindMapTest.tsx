import React, { useState } from 'react';
import { MaterialSearchMindMap } from '@/domains/mindmap';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactFlowProvider } from '@xyflow/react';

const testCategories = [
  {
    id: 'c1',
    name: '�������',
    children: [
      {
        id: 'c1-1',
        name: 'ǰ�˿���',
        children: [
          { id: 'c1-1-1', name: 'JavaScript' },
          { id: 'c1-1-2', name: 'TypeScript' },
          { id: 'c1-1-3', name: 'React���' }
        ]
      },
      {
        id: 'c1-2',
        name: '��˿���',
        children: [
          { id: 'c1-2-1', name: '���ݿ�' },
          { id: 'c1-2-2', name: '������' },
          { id: 'c1-2-3', name: 'API���' }
        ]
      }
    ]
  },
  {
    id: 'c2',
    name: '�����Դ',
    children: [
      {
        id: 'c2-1',
        name: 'UI���',
        children: [
          { id: 'c2-1-1', name: '��ƹ淶' },
          { id: 'c2-1-2', name: 'ͼ����Դ' }
        ]
      },
      {
        id: 'c2-2',
        name: 'UX���',
        children: [
          { id: 'c2-2-1', name: '�û��о�' },
          { id: 'c2-2-2', name: '�������' }
        ]
      }
    ]
  },
  {
    id: 'c3',
    name: 'ѧϰ����',
    children: [
      { id: 'c3-1', name: '������' },
      { id: 'c3-2', name: '��Ƶ�̳�' },
      { id: 'c3-3', name: '���߿γ�' }
    ]
  }
];

const testMaterials = [
  {
    id: '1',
    title: 'React���Ž̳�',
    description: 'React����֪ʶ��ʵ��',
    tags: ['�������', 'ǰ�˿���', 'React���'],
    createdAt: '2023-05-15'
  },
  {
    id: '2',
    title: 'TypeScript�߼�ָ��',
    description: '����TypeScript����ϵͳ',
    tags: ['�������', 'ǰ�˿���', 'TypeScript'],
    createdAt: '2023-06-22'
  },
  {
    id: '3',
    title: '�ִ�UI��ƹ淶',
    description: '���ϵͳ����������ָ��',
    tags: ['�����Դ', 'UI���', '��ƹ淶'],
    createdAt: '2023-07-10'
  }
];

const MindMapTest: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<'tree' | 'radial'>('tree');
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">˼ά��ͼ���Ĳ���</h1>
      
      <div className="mb-4">
        <Tabs value={layoutMode} onValueChange={(value) => setLayoutMode(value as 'tree' | 'radial')}>
          <TabsList>
            <TabsTrigger value="tree">��״����</TabsTrigger>
            <TabsTrigger value="radial">���䲼��</TabsTrigger>
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
              console.log('����ڵ�:', node);
            }}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default MindMapTest; 