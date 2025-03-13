
import React from 'react';
import { MindMapNode } from '@/types/mindmap';
import { Material } from '@/types/materials';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Trash2, Link2, Image } from 'lucide-react';

interface NodeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: MindMapNode | null;
  nodeName: string;
  setNodeName: (name: string) => void;
  nodeNotes: string;
  setNodeNotes: (notes: string) => void;
  nodeColor: string;
  setNodeColor: (color: string) => void;
  nodeIcon: string;
  setNodeIcon: (icon: string) => void;
  nodeUrl: string;
  setNodeUrl: (url: string) => void;
  onUpdate: () => void;
  onDelete: () => void;
  onOpenIconDialog: () => void;
  onOpenAttachDialog: () => void;
  onStartConnecting: () => void;
}

const NodeEditDialog: React.FC<NodeEditDialogProps> = ({
  open,
  onOpenChange,
  selectedNode,
  nodeName,
  setNodeName,
  nodeNotes,
  setNodeNotes,
  nodeColor,
  setNodeColor,
  nodeIcon,
  setNodeIcon,
  nodeUrl,
  setNodeUrl,
  onUpdate,
  onDelete,
  onOpenIconDialog,
  onOpenAttachDialog,
  onStartConnecting
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑节点</DialogTitle>
          <DialogDescription>
            修改节点内容和样式
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nodeName">名称</Label>
            <Input
              id="nodeName"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nodeNotes">备注</Label>
            <Textarea
              id="nodeNotes"
              value={nodeNotes}
              onChange={(e) => setNodeNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nodeColor">颜色</Label>
            <div className="flex items-center gap-2">
              <Input
                id="nodeColor"
                type="color"
                value={nodeColor}
                onChange={(e) => setNodeColor(e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                value={nodeColor}
                onChange={(e) => setNodeColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>图标</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenIconDialog}
                className="flex items-center gap-1"
              >
                <Image className="h-4 w-4" />
                {nodeIcon ? '更换图标' : '选择图标'}
              </Button>
              {nodeIcon && <span className="text-sm">{nodeIcon}</span>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nodeUrl">链接 URL (可选)</Label>
            <Input
              id="nodeUrl"
              placeholder="https://example.com"
              value={nodeUrl}
              onChange={(e) => setNodeUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">添加 URL 后双击节点将打开此链接</p>
          </div>
          
          {/* Show attached materials if any */}
          {selectedNode && selectedNode.data.materials && selectedNode.data.materials.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>已附加资料</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onOpenAttachDialog}
                  className="text-xs"
                >
                  管理资料
                </Button>
              </div>
              <div className="text-sm space-y-1">
                {selectedNode.data.materials.map((material: Material, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span>{material.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-full flex items-center justify-center gap-1"
              onClick={onStartConnecting}
            >
              <Link2 className="h-4 w-4" />
              连接到其他节点
            </Button>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button 
            variant="destructive" 
            size="sm"
            className="flex items-center gap-1"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            删除节点
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button 
              onClick={onUpdate}
            >
              更新
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeEditDialog;
