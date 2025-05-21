/**
 * 思维导图创建对话框 - 提供用户界面用于创建新的思维导图
 * 这是外部层的UI组件，调用控制器操作领域模型
 */

import React, { useState } from 'react';
import { MindMapController } from '../../adapters/controllers/MindMapController';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Tag, AlertCircle } from "lucide-react";

interface CreateMindMapDialogProps {
  /**
   * 思维导图控制器
   */
  controller: MindMapController;
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 对话框是否打开
   */
  isOpen: boolean;
  /**
   * 控制对话框开关的回调
   */
  onOpenChange: (open: boolean) => void;
  /**
   * 创建成功后的回调
   */
  onSuccess?: (mindMapId: string) => void;
}

export const CreateMindMapDialog: React.FC<CreateMindMapDialogProps> = ({
  controller,
  userId,
  isOpen,
  onOpenChange,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rootText, setRootText] = useState('中心主题');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('请输入思维导图名称');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 处理标签，将逗号分隔的字符串转换为数组
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      const mindMap = await controller.createMindMap(
        title,
        userId,
        rootText,
        isPublic,
        description,
        tagArray
      );
      
      // 重置表单
      setTitle('');
      setDescription('');
      setRootText('中心主题');
      setTags('');
      setIsPublic(false);
      
      // 关闭对话框
      onOpenChange(false);
      
      // 调用成功回调
      if (onSuccess) {
        onSuccess(mindMap.id);
      }
    } catch (err) {
      setError('创建思维导图失败');
      console.error('Failed to create mind map:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            创建新的思维导图
          </DialogTitle>
          <DialogDescription>
            请输入新思维导图的名称和描述。创建后您可以立即开始编辑。
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">思维导图名称</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：项目计划、学习笔记..."
                required
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简要描述思维导图的内容和用途..."
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="rootText">中心主题文本</Label>
              <Input
                id="rootText"
                type="text"
                value={rootText}
                onChange={(e) => setRootText(e.target.value)}
                placeholder="中心主题的文本内容"
                className="font-medium"
              />
              <p className="text-xs text-muted-foreground">
                这将是您思维导图的核心节点
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags" className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                标签
              </Label>
              <Input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="使用逗号分隔多个标签，如：学习,笔记,计划"
              />
              <p className="text-xs text-muted-foreground">
                标签可以帮助您更好地组织和查找思维导图
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="privacy"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="privacy">公开此思维导图</Label>
              <p className="text-xs text-muted-foreground ml-2">
                {isPublic ? '所有人都可以查看此思维导图' : '只有您能查看此思维导图'}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !title.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? '创建中...' : '创建思维导图'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 