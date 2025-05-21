/**
 * 桥接文件 - MindMapWorkspace组件
 * 此文件作为桥接，提供简单的实现
 */

import React, { useState } from 'react';
import { MindMapComponent } from '@/domains/mindmap';

// 简单的MindMapWorkspace组件
const MindMapWorkspace = (props: any) => {
  return (
    <div className="h-full w-full bg-background border rounded-md overflow-hidden">
      <div className="h-full w-full relative">
        <MindMapComponent {...props} />
      </div>
    </div>
  );
};

export default MindMapWorkspace; 