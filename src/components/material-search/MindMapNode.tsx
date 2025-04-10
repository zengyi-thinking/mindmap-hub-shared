import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { File, Tag, Folder, FileText, Image, Video, Brain, AlertCircle, FileSearch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MindMapNodeProps {
  id: string;
  data: {
    label: string;
    type: 'central' | 'tag' | 'material';
    level: number;
    style?: React.CSSProperties;
    fullPath?: string[];
    isLastLevel?: boolean;
    materials?: any[];
    material?: any;
    materialId?: string;
  };
  selected: boolean;
}

// 根据节点级别返回适当的样式
const getNodeStyle = (level: number, type: string, selected: boolean, nodeId?: string): React.CSSProperties => {
  // 基础样式
  const baseStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '10px',
    boxShadow: selected 
      ? '0 0 0 3px hsl(var(--primary)), 0 4px 8px rgba(0, 0, 0, 0.2)' 
      : '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    minWidth: '120px',
    maxWidth: '220px',
    transition: 'all 0.3s ease',
    position: 'relative',
    border: selected ? '2px solid hsl(var(--primary))' : '1px solid rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  // 根据节点类型和级别定制样式
  if (type === 'central') {
    return {
      ...baseStyle,
      background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.8))',
      color: 'white',
      fontWeight: '700',
      fontSize: '16px',
      padding: '14px 18px',
      minWidth: '150px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
      zIndex: 10,
    };
  }
  
  // 为信息节点定制特殊样式
  if (nodeId?.startsWith('info-')) {
    return {
      ...baseStyle,
      background: 'linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted)/0.8))',
      color: 'hsl(var(--muted-foreground))',
      fontWeight: '500',
      fontSize: '14px',
      padding: '12px 16px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderStyle: 'dashed',
      borderWidth: '2px',
    };
  }
  
  if (type === 'tag') {
    const levelStyles = {
      1: {
        background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.9))',
        color: 'white',
        fontWeight: '600',
        fontSize: '15px',
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.15)',
      },
      2: {
        background: 'linear-gradient(135deg, hsl(var(--primary)/0.9), hsl(var(--primary)/0.8))',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
      },
      3: {
        background: 'linear-gradient(135deg, hsl(var(--primary)/0.8), hsl(var(--primary)/0.7))',
        color: 'white',
        fontWeight: '500',
        fontSize: '13px',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
      },
    };
    
    const levelStyle = levelStyles[level as keyof typeof levelStyles] || levelStyles[1];
    
    return {
      ...baseStyle,
      ...levelStyle,
    };
  }
  
  if (type === 'material') {
    // 不同级别的材料节点样式
    const materialLevelStyles = {
      1: { // 当材料节点是一级节点时 (直接连接到中心)
        background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--secondary)/0.8))',
        color: 'hsl(var(--secondary-foreground))',
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.15)',
        fontSize: '14px',
        fontWeight: '600',
      },
      2: { // 标准材料节点 (二级)
        background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)/0.8))',
        color: 'hsl(var(--accent-foreground))',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
        fontSize: '13px',
      },
      3: { // 相关材料节点 (三级)
        background: 'linear-gradient(135deg, hsl(var(--accent)/0.8), hsl(var(--accent)/0.7))',
        color: 'hsl(var(--accent-foreground))',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
        fontSize: '12px',
      },
    };
    
    const materialStyle = materialLevelStyles[level as keyof typeof materialLevelStyles] || materialLevelStyles[2];
    
    return {
      ...baseStyle,
      ...materialStyle,
      padding: level === 3 ? '8px 12px' : '10px 14px',
      fontWeight: '500',
      cursor: 'pointer',
      width: '100%',
    };
  }
  
  // 默认样式
  return baseStyle;
};

const MindMapNode: React.FC<MindMapNodeProps> = ({ id, data, selected }) => {
  const { label, type, level, materials = [], style = {} } = data;
  
  // 合并默认样式和自定义样式
  const nodeStyle = {
    ...getNodeStyle(level, type, selected, id),
    ...style,
  };
  
  // 获取节点图标
  const getNodeIcon = () => {
    // 特殊节点的图标
    if (id.startsWith('info-')) {
      return <AlertCircle className="h-4 w-4 mb-1.5 opacity-90" />;
    }
    
    switch (type) {
      case 'central':
        return <Brain className="h-5 w-5 mb-2 opacity-90" />;
      case 'tag':
        return <Tag className="h-4 w-4 mb-1.5 opacity-80" />;
      case 'material': {
        // 如果节点是直接连接到中心节点的材料
        if (level === 1) {
          return <FileSearch className="h-4 w-4 mb-1.5 opacity-80" />;
        }
        
        // 根据材料类型显示不同的图标
        if (data.material && data.material.file) {
          const fileType = data.material.file.type || '';
          if (fileType.startsWith('image/')) {
            return <Image className="h-4 w-4 mb-1.5 opacity-80" />;
          } else if (fileType.startsWith('video/')) {
            return <Video className="h-4 w-4 mb-1.5 opacity-80" />;
          } else if (fileType.startsWith('application/pdf') || fileType.startsWith('text/')) {
            return <FileText className="h-4 w-4 mb-1.5 opacity-80" />;
          }
        }
        return <File className="h-4 w-4 mb-1.5 opacity-80" />;
      }
      default:
        return null;
    }
  };
  
  // 计算连接点位置
  const getHandleStyle = (isSource: boolean) => {
    return {
      background: '#FF3366',
      width: isSource ? 8 : 6, // 增加连接点大小以提高可见性
      height: isSource ? 8 : 6,
      borderRadius: '50%',
      border: '2px solid white',
      top: '50%', // 放置在节点的垂直中点
      zIndex: 1,
      boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)',
    };
  };
  
  // 判断标签是否需要截断和添加提示
  const shouldTruncate = label.length > (level === 3 ? 12 : 15);
  const truncatedLabel = shouldTruncate 
    ? `${label.substring(0, level === 3 ? 12 : 15)}...` 
    : label;
  
  return (
    <div style={nodeStyle} className={`rounded-lg ${selected ? 'ring-2 ring-blue-400' : ''}`}>
      {/* 入口连接点 - 除了中心节点外的所有节点 */}
      {type !== 'central' && (
        <Handle
          id="left"
          type="target"
          position={Position.Left}
          style={getHandleStyle(false)}
        />
      )}
      
      <div className="flex flex-col items-center justify-center w-full">
        {getNodeIcon()}
        
        {shouldTruncate ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate w-full font-medium text-center">{truncatedLabel}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="truncate w-full font-medium text-center">{label}</span>
        )}
      </div>
      
      {/* 显示相关材料数量（只在有关联材料时显示） */}
      {type === 'tag' && materials && materials.length > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 text-xs py-0.5 px-2 bg-white text-primary border border-primary-100 shadow-sm"
        >
          {materials.length}
        </Badge>
      )}
      
      {/* 出口连接点 - 根据节点类型和级别决定是否需要 */}
      {(type !== 'material' || (type === 'material' && level === 1)) && (
        <Handle
          id="right"
          type="source"
          position={Position.Right}
          style={getHandleStyle(true)}
        />
      )}
    </div>
  );
};

export default memo(MindMapNode); 