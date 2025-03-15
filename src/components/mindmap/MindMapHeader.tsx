
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  Save, 
  Plus, 
  PaperclipIcon, 
  LayoutGrid,
  Globe,
  Lock,
  EyeIcon,
  EyeOffIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

interface MindMapHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  onAddNode: () => void;
  onAttachMaterial: () => void;
  onAutoLayout: () => void;
  onSave: () => void;
}

const MindMapHeader: React.FC<MindMapHeaderProps> = ({
  title,
  setTitle,
  isPublic,
  setIsPublic,
  onAddNode,
  onAttachMaterial,
  onAutoLayout,
  onSave
}) => {
  const navigate = useNavigate();

  return (
    <div className="border-b p-4 flex gap-4 items-center justify-between">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="思维导图标题"
          className="w-64 text-lg font-semibold border-none focus-visible:ring-0"
        />
      </div>
      
      <div className="flex items-center gap-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
                id="public-mode"
              />
              <Label htmlFor="public-mode" className="cursor-pointer flex items-center gap-1.5">
                {isPublic ? (
                  <>
                    <Globe className="h-4 w-4 text-green-500" />
                    <span className="text-sm">公开</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">私有</span>
                  </>
                )}
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPublic 
              ? "公开模式: 思维导图将在资料搜索页面对所有用户可见" 
              : "私有模式: 思维导图仅对您可见"}</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddNode}
            className="flex gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>添加节点</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onAttachMaterial}
            className="flex gap-1"
          >
            <PaperclipIcon className="h-4 w-4" />
            <span>附加资料</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onAutoLayout}
            className="flex gap-1"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>自动布局</span>
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            className="flex gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            <span>保存</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MindMapHeader;
