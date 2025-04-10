import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { File, Tag, Folder, Star, BookOpen, PenTool, Hash, Paperclip } from 'lucide-react';
import { Badge, Tooltip } from 'antd';

interface MindMapNodeData {
  label: string;
  type?: 'central' | 'tag' | 'material';
  level?: number;
  materials?: any[];
  isLastLevel?: boolean;
  material?: any;
}

// 根据节点级别返回适当的样式
const getNodeStyle = (level: number, type: string, selected: boolean): React.CSSProperties => {
  // 基础样式
  const baseStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: selected ? '0 0 0 3px hsl(var(--primary)), 0 8px 20px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    minWidth: '100px',
    maxWidth: '220px',
    transition: 'all 0.3s ease',
    transform: selected ? 'scale(1.05)' : 'scale(1)',
    zIndex: selected ? 10 : 1,
  };
  
  // 根据节点类型和级别定制样式
  if (type === 'central') {
    return {
      ...baseStyle,
      background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.8))',
      color: 'white',
      fontWeight: '700',
      fontSize: '18px',
      padding: '20px 24px',
      minWidth: '200px',
      boxShadow: selected 
        ? '0 0 0 3px hsl(var(--primary)), 0 12px 24px rgba(0, 0, 0, 0.25)' 
        : '0 10px 20px rgba(0, 0, 0, 0.2)',
    };
  }
  
  if (type === 'tag') {
    const levelStyles = {
      1: {
        background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
        color: 'white',
        fontWeight: '600',
        fontSize: '15px',
        boxShadow: selected 
          ? '0 0 0 3px #4F46E5, 0 8px 20px rgba(79, 70, 229, 0.3)' 
          : '0 6px 16px rgba(79, 70, 229, 0.2)',
      },
      2: {
        background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
        boxShadow: selected 
          ? '0 0 0 3px #7C3AED, 0 8px 20px rgba(124, 58, 237, 0.3)' 
          : '0 6px 16px rgba(124, 58, 237, 0.2)',
      },
      3: {
        background: 'linear-gradient(135deg, #EC4899, #DB2777)',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        boxShadow: selected 
          ? '0 0 0 3px #DB2777, 0 8px 20px rgba(219, 39, 119, 0.3)' 
          : '0 6px 16px rgba(219, 39, 119, 0.2)',
      },
      4: {
        background: 'linear-gradient(135deg, #10B981, #059669)',
        color: 'white',
        fontWeight: '500',
        fontSize: '13px',
        boxShadow: selected 
          ? '0 0 0 3px #059669, 0 8px 20px rgba(5, 150, 105, 0.3)' 
          : '0 6px 16px rgba(5, 150, 105, 0.2)',
      },
    };
    
    const levelStyle = levelStyles[level as keyof typeof levelStyles] || levelStyles[1];
    
    return {
      ...baseStyle,
      ...levelStyle,
    };
  }
  
  if (type === 'material') {
    return {
      ...baseStyle,
      background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
      color: '#065F46',
      padding: '10px 14px',
      fontSize: '13px',
      fontWeight: '500',
      border: '1px solid #10B981',
      cursor: 'pointer',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      boxShadow: selected 
        ? '0 0 0 2px #10B981, 0 6px 16px rgba(16, 185, 129, 0.25)' 
        : '0 4px 8px rgba(16, 185, 129, 0.15)',
    };
  }
  
  // 默认样式
  return baseStyle;
};

// 获取节点图标
const getNodeIcon = (type: string, level: number) => {
  if (type === 'central') {
    return <Star className="h-6 w-6 mb-2" />;
  }
  
  if (type === 'tag') {
    // 不同级别的标签使用不同的图标
    switch (level) {
      case 1:
        return <Folder className="h-5 w-5 mb-1.5" />;
      case 2:
        return <BookOpen className="h-4 w-4 mb-1.5" />;
      case 3:
        return <PenTool className="h-4 w-4 mb-1.5" />;
      case 4:
        return <Hash className="h-4 w-4 mb-1.5" />;
      default:
        return <Tag className="h-4 w-4 mb-1.5" />;
    }
  }
  
  if (type === 'material') {
    return <File className="h-4 w-4 mb-1.5" />;
  }
  
  return null;
};

const MindMapNode = ({ data, selected }: NodeProps<MindMapNodeData>) => {
  const { label, type = 'tag', level = 1, materials = [], isLastLevel } = data;
  
  // 合并默认样式和自定义样式
  const nodeStyle = {
    ...getNodeStyle(level, type, selected),
  };
  
  // 获取节点图标
  const icon = getNodeIcon(type, level);
  
  // 处理长标签名，避免节点过大
  const displayLabel = label.length > 10 && type !== 'central' 
    ? `${label.substring(0, 10)}...` 
    : label;
  
  // 鼠标悬停时显示完整标签
  const titleAttr = label.length > 10 ? label : '';
  
  // 相关材料数量
  const hasMaterials = materials && materials.length > 0;
  
  // 计算材料数量徽章的样式
  const getBadgeStyle = () => {
    if (type !== 'tag' || !materials || materials.length === 0) return {};
    
    return {
      position: 'absolute' as const,
      top: '-8px',
      right: '-8px',
      zIndex: 10,
    };
  };
  
  return (
    <Tooltip title={label} placement="top">
      <div style={nodeStyle} title={titleAttr} className="relative flex flex-col items-center">
        {/* 入口连接点 - 除了中心节点外的所有节点 */}
        {type !== 'central' && (
          <Handle
            type="target"
            position={Position.Left}
            style={{
              background: type === 'material' ? '#10B981' : '#FF3366',
              width: 8,
              height: 8,
              borderRadius: '50%',
              border: '2px solid white',
              left: -4,
            }}
          />
        )}
        
        {/* 显示材料数量徽章 */}
        {type === 'tag' && hasMaterials && (
          <div style={getBadgeStyle()}>
            <Badge 
              count={materials.length}
              style={{
                backgroundColor: '#ff4d4f',
                border: '1px solid rgba(255, 255, 255, 0.5)',
              }}
            />
          </div>
        )}
        
        <div className="flex flex-col items-center">
          {icon}
          <div className="font-medium">{displayLabel}</div>
        </div>
        
        {/* 出口连接点 - 除了材料节点外的所有节点 */}
        {type !== 'material' && (
          <Handle
            type="source"
            position={Position.Right}
            style={{
              background: '#FF3366',
              width: 8,
              height: 8,
              borderRadius: '50%',
              border: '2px solid white',
              right: -4,
            }}
          />
        )}
      </div>
    </Tooltip>
  );
};

export default memo(MindMapNode); 