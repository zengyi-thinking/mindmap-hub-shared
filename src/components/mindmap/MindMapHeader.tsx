
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, FileText, Layout, Save } from 'lucide-react';
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
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/mindmaps')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="思维导图标题"
            className="text-xl font-bold border-0 p-0 h-auto focus-visible:ring-0 bg-transparent"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-4">
          <Switch 
            id="public" 
            checked={isPublic} 
            onCheckedChange={setIsPublic} 
          />
          <Label htmlFor="public" className="cursor-pointer">
            {isPublic ? '公开' : '私有'}
          </Label>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={onAttachMaterial}
        >
          <FileText className="h-4 w-4" />
          附加资料
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={onAddNode}
        >
          <Plus className="h-4 w-4" />
          添加节点
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={onAutoLayout}
        >
          <Layout className="h-4 w-4" />
          自动排列
        </Button>
        <Button 
          variant="default" 
          size="sm"
          className="flex items-center gap-1"
          onClick={onSave}
        >
          <Save className="h-4 w-4" />
          保存
        </Button>
      </div>
    </div>
  );
};

export default MindMapHeader;
