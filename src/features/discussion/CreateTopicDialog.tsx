import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

interface CreateTopicDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTopic: (title: string, content: string, tags: string[]) => void;
}

const CreateTopicDialog: React.FC<CreateTopicDialogProps> = ({
  open,
  onClose,
  onCreateTopic
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCreateTopic = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能创建话题",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "标题不能为空",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "内容不能为空",
        variant: "destructive"
      });
      return;
    }

    // 处理标签
    const tagsList = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onCreateTopic(title.trim(), content.trim(), tagsList);
    
    // 清空表单
    setTitle('');
    setContent('');
    setTags('');
  };

  const handleClose = () => {
    // 清空表单
    setTitle('');
    setContent('');
    setTags('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>创建新话题</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              标题
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入话题标题"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              标签
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="多个标签用逗号分隔，例如: 学习方法,思维导图"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              内容
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="详细描述您的问题或想法"
              className="col-span-3"
              rows={8}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleCreateTopic}>
            发布话题
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicDialog; 