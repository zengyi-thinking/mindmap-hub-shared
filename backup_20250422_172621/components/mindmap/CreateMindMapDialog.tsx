
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Lock, Globe, Save } from 'lucide-react';

interface CreateMindMapDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateMindMap: () => void;
  newMindMapName: string;
  setNewMindMapName: (name: string) => void;
  newMindMapDescription: string;
  setNewMindMapDescription: (desc: string) => void;
  newMindMapTags: string;
  setNewMindMapTags: (tags: string) => void;
  privacyOption: string;
  setPrivacyOption: (option: string) => void;
}

const CreateMindMapDialog: React.FC<CreateMindMapDialogProps> = ({
  isOpen,
  onOpenChange,
  onCreateMindMap,
  newMindMapName,
  setNewMindMapName,
  newMindMapDescription,
  setNewMindMapDescription,
  newMindMapTags,
  setNewMindMapTags,
  privacyOption,
  setPrivacyOption
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 createButton buttonRadius">
          <Plus className="h-4 w-4" />
          <span className="buttonText">创建导图</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="cardRadius cardShadow">
        <DialogHeader className="navGradient">
          <DialogTitle className="mainTitle">创建新的思维导图</DialogTitle>
          <DialogDescription>
            请输入新思维导图的名称和描述。创建后您可以立即开始编辑。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="mainTitle">思维导图名称</Label>
            <Input
              id="name"
              placeholder="例如：项目计划、学习笔记..."
              value={newMindMapName}
              onChange={(e) => setNewMindMapName(e.target.value)}
              className="hoverTransition"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="mainTitle">描述</Label>
            <Textarea
              id="description"
              placeholder="简要描述思维导图的内容和用途..."
              value={newMindMapDescription}
              onChange={(e) => setNewMindMapDescription(e.target.value)}
              className="hoverTransition"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags" className="mainTitle">标签</Label>
            <Input
              id="tags"
              placeholder="使用逗号分隔多个标签，如：学习,笔记,计划"
              value={newMindMapTags}
              onChange={(e) => setNewMindMapTags(e.target.value)}
              className="hoverTransition"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="privacy" className="mainTitle">隐私设置</Label>
            <Select value={privacyOption} onValueChange={setPrivacyOption}>
              <SelectTrigger>
                <SelectValue placeholder="选择隐私设置" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 lineIcon" />
                    <span>私密</span>
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 lineIcon" />
                    <span>公开</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onCreateMindMap} className="createButton buttonRadius">
            <Save className="h-4 w-4 mr-2" />
            <span className="buttonText">创建</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMindMapDialog;
