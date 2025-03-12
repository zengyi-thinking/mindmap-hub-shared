
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SaveMindMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mindMapTitle: string;
  setMindMapTitle: (title: string) => void;
  mindMapDescription: string;
  setMindMapDescription: (description: string) => void;
  selectedTags: string[];
  onSave: () => void;
}

const SaveMindMapDialog: React.FC<SaveMindMapDialogProps> = ({
  open,
  onOpenChange,
  mindMapTitle,
  setMindMapTitle,
  mindMapDescription,
  setMindMapDescription,
  selectedTags,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>保存思维导图</DialogTitle>
          <DialogDescription>
            填写以下信息保存您的思维导图，方便后续查看和分享
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="mindmap-title">标题 *</Label>
            <Input 
              id="mindmap-title" 
              placeholder="输入思维导图标题..." 
              value={mindMapTitle}
              onChange={(e) => setMindMapTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mindmap-desc">描述</Label>
            <Textarea 
              id="mindmap-desc" 
              placeholder="输入描述信息..."
              rows={3}
              value={mindMapDescription}
              onChange={(e) => setMindMapDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {selectedTags.length === 0 && (
                <span className="text-xs text-muted-foreground">未选择标签</span>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={onSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveMindMapDialog;
