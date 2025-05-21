/**
 * 桥接文件 - MindMapEditor组件
 * 此文件作为桥接，提供简单的实现
 */

import React from 'react';
import { MindMapComponent } from '@/domains/mindmap';

// 简单的MindMapEditor桥接组件
const MindMapEditor = (props: any) => {
  return (
    <div className="h-full w-full bg-background border rounded-md overflow-hidden p-4">
      <h3 className="text-lg font-medium mb-4">思维导图编辑器</h3>
      <div className="h-[calc(100%-3rem)] w-full">
        <MindMapComponent {...props} />
      </div>
    </div>
  );
};

export default MindMapEditor; 