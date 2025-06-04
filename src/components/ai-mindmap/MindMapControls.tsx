import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  FileDown, 
  Save, 
  Share2, 
  LayoutTemplate,
  Network,
  GitBranch,
  MindMapping
} from 'lucide-react';
import { MindMapLayout } from '@/types/mindmap';

interface MindMapControlsProps {
  layout: MindMapLayout;
  nodeCount: number;
  hasData: boolean;
  onLayoutChange: (layout: MindMapLayout) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onExportSvg: () => void;
  onSave: () => void;
  onShare: () => void;
}

/**
 * 思维导图控制面板组件
 */
const MindMapControls: React.FC<MindMapControlsProps> = ({
  layout,
  nodeCount,
  hasData,
  onLayoutChange,
  onZoomIn,
  onZoomOut,
  onResetView,
  onExportSvg,
  onSave,
  onShare
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-4 bg-card">
      <h3 className="font-medium flex items-center justify-between">
        <span>思维导图控制</span>
        {nodeCount > 0 && (
          <span className="text-xs text-muted-foreground">{nodeCount}个节点</span>
        )}
      </h3>
      
      {/* 布局选择 */}
      <div className="space-y-2">
        <label className="text-sm">布局类型</label>
        <Tabs value={layout} onValueChange={(value) => onLayoutChange(value as MindMapLayout)} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="radial" className="flex flex-col items-center text-xs py-2 px-1">
              <Network className="h-4 w-4 mb-1" />
              <span>放射状</span>
            </TabsTrigger>
            <TabsTrigger value="tree" className="flex flex-col items-center text-xs py-2 px-1">
              <LayoutTemplate className="h-4 w-4 mb-1" />
              <span>树状</span>
            </TabsTrigger>
            <TabsTrigger value="mindmap" className="flex flex-col items-center text-xs py-2 px-1">
              <MindMapping className="h-4 w-4 mb-1" />
              <span>思维导图</span>
            </TabsTrigger>
            <TabsTrigger value="force" className="flex flex-col items-center text-xs py-2 px-1">
              <GitBranch className="h-4 w-4 mb-1" />
              <span>力导向</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 缩放控制 */}
      <div className="space-y-2">
        <label className="text-sm">视图控制</label>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onZoomIn}
            disabled={!hasData}
            title="放大"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onZoomOut}
            disabled={!hasData}
            title="缩小"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onResetView}
            disabled={!hasData}
            title="重置视图"
            className="flex-1"
          >
            <Maximize className="h-4 w-4" />
            <span className="ml-1 text-xs">重置视图</span>
          </Button>
        </div>
      </div>
      
      {/* 导出和分享选项 */}
      <div className="space-y-2">
        <label className="text-sm">导出和分享</label>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExportSvg}
            disabled={!hasData}
            className="flex items-center justify-center"
          >
            <FileDown className="h-4 w-4 mr-1" />
            <span className="text-xs">导出SVG</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSave}
            disabled={!hasData}
            className="flex items-center justify-center"
          >
            <Save className="h-4 w-4 mr-1" />
            <span className="text-xs">保存</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShare}
            disabled={!hasData}
            className="flex items-center justify-center"
          >
            <Share2 className="h-4 w-4 mr-1" />
            <span className="text-xs">分享</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MindMapControls; 