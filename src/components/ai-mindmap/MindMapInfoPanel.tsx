import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MindMapNode } from '@/types/mindmap';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Info, Link, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MindMapInfoPanelProps {
  /**
   * 选中的节点
   */
  selectedNode: MindMapNode | null;
  /**
   * 思维导图标题
   */
  title?: string;
  /**
   * 思维导图关键词
   */
  keyword: string;
  /**
   * 思维导图节点总数
   */
  totalNodes: number;
  /**
   * 关闭信息面板
   */
  onClose?: () => void;
  className?: string;
}

/**
 * 思维导图信息面板组件
 * 显示选中节点的详细信息
 */
const MindMapInfoPanel: React.FC<MindMapInfoPanelProps> = ({
  selectedNode,
  keyword,
  totalNodes,
  className
}) => {
  // 生成一些相关的关键词（示例实现）
  const generateRelatedKeywords = (nodeName: string) => {
    const keywords = [];
    
    // 基于节点名称生成一些关键词
    const name = nodeName.toLowerCase();
    
    if (name.includes('技术') || name.includes('方法')) {
      keywords.push('实施方案', '最佳实践', '技术原理');
    }
    
    if (name.includes('应用') || name.includes('案例')) {
      keywords.push('成功案例', '行业应用', '实践经验');
    }
    
    if (name.includes('概念') || name.includes('定义')) {
      keywords.push('理论基础', '学术研究', '核心原理');
    }
    
    // 添加一些通用的关键词
    keywords.push('相关资料', '学习资源', '深入探讨');
    
    return keywords;
  };
  
  // 如果没有选中节点，显示思维导图总体信息
  if (!selectedNode) {
    // 如果没有生成思维导图，显示提示信息
    if (!keyword || totalNodes === 0) {
      return (
        <div className={cn("border rounded-lg p-4 bg-card", className)}>
          <h3 className="font-medium mb-2">思维导图信息</h3>
          <p className="text-sm text-muted-foreground">
            生成思维导图后，点击节点查看详细信息
          </p>
        </div>
      );
    }
    
    return (
      <div className={cn("border rounded-lg p-4 bg-card", className)}>
        <h3 className="font-medium mb-2">思维导图信息</h3>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">主题:</span>
            <span className="font-medium">{keyword}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">节点数量:</span>
            <span>{totalNodes}个</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">生成时间:</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  
  // 显示选中节点的详细信息
  return (
    <div className={cn("border rounded-lg p-4 bg-card", className)}>
      <h3 className="font-medium mb-3">{selectedNode.name}</h3>
      
      <div className="space-y-4">
        {/* 节点类型标识（根节点或子节点） */}
        <div className="flex items-center gap-2">
          <Badge variant={selectedNode.name === keyword ? "default" : "outline"}>
            {selectedNode.name === keyword ? '中心主题' : '子主题'}
          </Badge>
          
          {selectedNode.url && (
            <Button variant="outline" size="sm" className="h-6 text-xs" asChild>
              <a href={selectedNode.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                查看链接
              </a>
            </Button>
          )}
        </div>
        
        <Separator />
        
        {/* 相关关键词标签 */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">相关关键词:</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {generateRelatedKeywords(selectedNode.name).map((kw, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* 附加资料按钮 */}
        <div className="pt-1">
          <Button variant="outline" size="sm" className="w-full text-xs h-8">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            查找相关资料
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MindMapInfoPanel; 