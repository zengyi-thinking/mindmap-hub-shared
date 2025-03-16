
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import NodeIconSelector from '@/components/mindmap/NodeIconSelector';

interface NodeIconDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectIcon: (icon: string) => void;
}

const NodeIconDialog: React.FC<NodeIconDialogProps> = ({
  open,
  onOpenChange,
  onSelectIcon
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>选择节点图标</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px]">
          <NodeIconSelector onSelect={onSelectIcon} />
        </ScrollArea>
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeIconDialog;
