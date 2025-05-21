/**
 * 桥接文件 - MindMapControls组件
 * 此文件作为桥接，提供简单的实现
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ZoomIn, ZoomOut, Download, Save } from 'lucide-react';

// 简单的MindMapControls组件
interface MindMapControlsProps {
  onAddNode?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  className?: string;
}

const MindMapControls: React.FC<MindMapControlsProps> = ({
  onAddNode,
  onZoomIn,
  onZoomOut,
  onSave,
  onExport,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button size="sm" variant="outline" onClick={onAddNode}>
        <PlusCircle className="h-4 w-4 mr-1" />
        添加节点
      </Button>
      <Button size="sm" variant="outline" onClick={onZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={onZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={onSave}>
        <Save className="h-4 w-4 mr-1" />
        保存
      </Button>
      <Button size="sm" variant="outline" onClick={onExport}>
        <Download className="h-4 w-4 mr-1" />
        导出
      </Button>
    </div>
  );
};

export default MindMapControls; 