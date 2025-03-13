
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, Trash2 } from 'lucide-react';
import { Material } from '@/types/materials';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NodeEditFormProps {
  nodeName: string;
  setNodeName: (name: string) => void;
  nodeNotes: string;
  setNodeNotes: (notes: string) => void;
  nodeColor: string;
  setNodeColor: (color: string) => void;
  materials?: Material[];
  onUpdate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const NodeEditForm: React.FC<NodeEditFormProps> = ({
  nodeName,
  setNodeName,
  nodeNotes,
  setNodeNotes,
  nodeColor,
  setNodeColor,
  materials = [],
  onUpdate,
  onDelete,
  onClose,
}) => {
  return (
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
        
        {/* Show attached materials if any */}
        {materials.length > 0 && (
          <div className="space-y-2">
            <Label>已附加资料</Label>
            <div className="text-sm space-y-1">
              {materials.map((material, i) => (
                <div key={i} className="flex items-center gap-2">
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  <span>{material.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
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
            onClick={onClose}
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
  );
};

export default NodeEditForm;
