import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Search, 
  RefreshCw, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Brain 
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Slider
} from "@/components/ui/slider";
import {
  Switch
} from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { GenerateMindMapRequest } from '@/types/mindmap';

interface MindMapGenerationFormProps {
  /**
   * 是否处于加载状态
   */
  loading: boolean;
  /**
   * 当前关键词
   */
  keyword: string;
  /**
   * 关键词变化回调
   */
  onKeywordChange: (keyword: string) => void;
  /**
   * 生成思维导图回调
   */
  onGenerate: (params: GenerateMindMapRequest) => void;
}

/**
 * 思维导图生成表单组件
 */
const MindMapGenerationForm: React.FC<MindMapGenerationFormProps> = ({
  loading,
  keyword,
  onKeywordChange,
  onGenerate
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [depth, setDepth] = useState(2); // 默认深度
  const [maxNodesPerLevel, setMaxNodesPerLevel] = useState(5); // 每层最大节点数
  const [includeLinks, setIncludeLinks] = useState(true); // 是否包含链接

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) return;
    
    const params: GenerateMindMapRequest = {
      keyword: keyword.trim(),
      depth,
      maxNodesPerLevel,
      includeLinks
    };
    
    onGenerate(params);
  };
  
  // 更新深度值
  const handleDepthChange = (value: number[]) => {
    setDepth(value[0]);
  };
  
  // 更新节点数量
  const handleNodesPerLevelChange = (value: number[]) => {
    setMaxNodesPerLevel(value[0]);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI思维导图生成
        </CardTitle>
        <CardDescription>
          输入关键词，AI将自动生成相关的思维导图结构
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="输入关键词，例如：人工智能、Web开发..."
              className="pl-9"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center justify-between w-full p-0 h-8"
              >
                <div className="flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">高级设置</span>
                </div>
                {isAdvancedOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="depth" className="text-sm">思维导图深度</Label>
                  <span className="text-sm font-medium">{depth}</span>
                </div>
                <Slider
                  id="depth"
                  min={1}
                  max={4}
                  step={1}
                  value={[depth]}
                  onValueChange={handleDepthChange}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  控制思维导图层级深度，越深内容越详细
                </p>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="nodes" className="text-sm">每层最大节点数</Label>
                  <span className="text-sm font-medium">{maxNodesPerLevel}</span>
                </div>
                <Slider
                  id="nodes"
                  min={3}
                  max={8}
                  step={1}
                  value={[maxNodesPerLevel]}
                  onValueChange={handleNodesPerLevelChange}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  控制每层最多显示的节点数量
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="links" className="text-sm">包含外部链接</Label>
                  <p className="text-xs text-muted-foreground">
                    为节点添加相关的网络资源链接
                  </p>
                </div>
                <Switch
                  id="links"
                  checked={includeLinks}
                  onCheckedChange={setIncludeLinks}
                  disabled={loading}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </form>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={handleSubmit}
          disabled={loading || !keyword.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              生成思维导图
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MindMapGenerationForm; 