import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { File, Tag, Folder, ExternalLink, Link2, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MindmapNodeProps {
  id: string;
  data: {
    label: string;
    type: 'central' | 'tag' | 'material';
    level: number;
    style?: React.CSSProperties;
    fullPath?: string[];
    isLastLevel?: boolean;
    materials?: any[];
    clickable?: boolean;
    tagName?: string;
    material?: any;
    materialsCount?: number;
    filesCount?: number;
    folderPath?: string;
  };
  selected: boolean;
  isConnectable: boolean;
}

// 处理可能的中文乱码问题
const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  try {
    // 确保文本是字符串类型
    const strText = String(text);
    
    // 使用正规化处理
    let normalized = strText
      .normalize('NFC')  // 标准等价合成
      .replace(/[\uFE30-\uFE4F]/g, '') // 移除中文特殊符号
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // 移除控制字符
    
    if (!normalized || normalized.length === 0) {
      return strText; // 如果标准化后为空，返回原始文本
    }
    
    return normalized;
  } catch (e) {
    console.error('Text normalization error:', e);
    // 如果解码失败，返回原始文本
    return String(text);
  }
};

// 检测是否为暗黑模式
const isDarkMode = () => {
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('dark');
  }
  return false;
};

// 在样式中增加字体设置
const textStyles = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "Heiti SC", "Noto Sans SC", sans-serif',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
};

export const MindmapNode: React.FC<MindmapNodeProps> = memo(({ 
  id, 
  data, 
  selected,
  isConnectable
}) => {
  const { 
    label, 
    type, 
    style = {}, 
    clickable = false,
    level = 0,
    materialsCount = 0,
    folderPath,
    filesCount = 0,
  } = data;

  // 处理标签文本，防止乱码
  const safeLabel = sanitizeText(label);
  
  // 根据节点类型和层级设置基础样式类
  const baseClass = cn(
    "px-4 py-3 rounded-xl transition-all duration-200 ease-in-out shadow-sm",
    selected && "ring-2 ring-primary ring-offset-2 shadow-lg transform scale-105",
    clickable && "cursor-pointer hover:shadow-lg hover:transform hover:scale-105",
    type === 'central' && "bg-gradient-to-r from-primary to-primary/80 text-white font-bold text-lg px-6 py-4 shadow-md",
    type === 'tag' && level === 1 && "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    type === 'tag' && level === 2 && "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white",
    type === 'tag' && level === 3 && "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    type === 'material' && "bg-gradient-to-r from-accent/90 to-accent text-accent-foreground text-sm border border-accent/20"
  );

  // 获取节点图标
  const getNodeIcon = () => {
    switch (type) {
      case 'central':
        return <Folder className="h-6 w-6 mb-2 drop-shadow-md" />;
      case 'tag':
        return isConnectable 
          ? <Folder className="h-5 w-5 mb-1 drop-shadow-sm" />
          : <Tag className="h-5 w-5 mb-1 drop-shadow-sm" />;
      case 'material':
        return <FileText className="h-5 w-5 mb-1 drop-shadow-sm" />;
      default:
        return null;
    }
  };

  // 计算最大宽度以避免节点内容重叠
  const getNodeWidth = () => {
    switch (type) {
      case 'central':
        return 180; // 增加中央节点宽度
      case 'tag':
        // 根据级别和文本长度调整宽度
        // 中文字符通常需要更宽的空间
        const isChinese = /[\u4e00-\u9fa5]/.test(safeLabel);
        const charWidth = isChinese ? 18 : 12; // 中文字符宽度更大
        return Math.max(160, Math.min(280, safeLabel.length * charWidth));
      case 'material':
        return 220; // 增加材料节点宽度
      default:
        return 180;
    }
  };

  // 截断过长的标签名称
  const getTruncatedLabel = () => {
    const maxLength = type === 'central' ? 12 : type === 'tag' ? 10 : 20;
    if (safeLabel.length > maxLength) {
      return safeLabel.substring(0, maxLength) + '...';
    }
    return safeLabel;
  };

  return (
    <div 
      className={baseClass} 
      style={{
        ...style,
        backdropFilter: 'blur(8px)',
        minWidth: getNodeWidth(),
        maxWidth: getNodeWidth() + 40,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "Heiti SC", "Noto Sans SC", sans-serif',
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflowWrap: 'break-word',
        wordBreak: 'keep-all',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
        border: '1px solid rgba(255,255,255,0.2)',
        textShadow: type === 'central' || type === 'tag' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
      }}
      data-clickable={clickable ? "true" : "false"}
      data-folder-path={folderPath || ''}
      data-node-type={type}
      data-node-level={level}
    >
      {/* 入口连接点 - 除了中心节点外的所有节点 */}
      {type !== 'central' && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{
            background: 'hsl(var(--primary))',
            width: 8,
            height: 8,
            borderRadius: '50%',
            border: '1px solid white',
            zIndex: 10,
          }}
        />
      )}
      
      <div className="flex flex-col items-center">
        {getNodeIcon()}
        <div className={cn(
          "text-center font-medium mindmap-node-label",
          type === 'material' && "truncate max-w-full"
        )}>
          {getTruncatedLabel()}
        </div>
        
        {type === 'tag' && (filesCount > 0 || materialsCount > 0) && (
          <Badge variant="secondary" className="mt-1.5 bg-slate-50/70 dark:bg-slate-950/70 text-xs text-slate-900 dark:text-slate-100">
            {filesCount > 0 ? `${filesCount} 个文件` : `${materialsCount} 个资料`}
          </Badge>
        )}
        
        {data.fullPath && data.fullPath.length > 0 && data.fullPath.length < 3 && (
          <div className="text-xs text-center opacity-80 mt-1 max-w-full truncate">
            {data.fullPath.map(p => sanitizeText(p)).join(' / ')}
          </div>
        )}
        
        {/* 仅对材料节点显示标签 */}
        {type === 'material' && data.material?.tags && data.material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 justify-center max-w-full">
            {data.material.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="text-xs bg-background/40 px-1.5 py-0.5 rounded-full truncate max-w-[70px]">
                {sanitizeText(tag)}
              </span>
            ))}
            {data.material.tags.length > 2 && (
              <span className="text-xs bg-background/40 px-1.5 py-0.5 rounded-full">
                +{data.material.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
      
      {clickable && (
        <Badge 
          variant={type === 'material' ? "secondary" : "outline"} 
          className="mt-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
          {type === 'tag' ? <Link2 className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
          {type === 'tag' ? '浏览文件夹' : '查看详情'}
        </Badge>
      )}
      
      {/* 出口连接点 - 除了材料节点外的所有节点 */}
      {type !== 'material' && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{
            background: 'hsl(var(--primary))',
            width: 8,
            height: 8,
            borderRadius: '50%',
            border: '1px solid white',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}); 