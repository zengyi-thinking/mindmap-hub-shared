import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { File, Tag, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  };
  selected: boolean;
}

// 根据节点级别返回适当的样式
const getNodeStyle = (level: number, type: string, selected: boolean): React.CSSProperties => {
  // 基础样式
  const baseStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: selected ? '0 0 0 2px hsl(var(--primary))' : '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    minWidth: '100px',
    maxWidth: '200px',
    transition: 'all 0.2s ease',
  };
  
  // 根据节点类型和级别定制样式
  if (type === 'central') {
    return {
      ...baseStyle,
      background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.8))',
      color: 'white',
      fontWeight: '700',
      fontSize: '16px',
      padding: '16px 20px',
      minWidth: '180px',
      boxShadow: '0 8px 16px rgba(var(--primary), 0.3)',
    };
  }
  
  if (type === 'tag') {
    const levelStyles = {
      1: {
        background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.9))',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(var(--primary), 0.3)',
      },
      2: {
        background: 'linear-gradient(135deg, hsl(var(--primary)/0.9), hsl(var(--primary)/0.8))',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(var(--primary), 0.25)',
      },
      3: {
        background: 'linear-gradient(135deg, hsl(var(--primary)/0.8), hsl(var(--primary)/0.7))',
        color: 'white',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(var(--primary), 0.2)',
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
      background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)/0.9))',
      color: 'hsl(var(--accent-foreground))',
      padding: '10px 14px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    };
  }
  
  // 默认样式
  return baseStyle;
};

const MindMapNode: React.FC<MindMapNodeProps> = ({ id, data, selected }) => {
  const { label, type, level, materials = [], style = {} } = data;
  
  // 合并默认样式和自定义样式
  const nodeStyle = {
    ...getNodeStyle(level, type, selected),
    ...style,
  };
  
  // 获取节点图标
  const getNodeIcon = () => {
    switch (type) {
      case 'central':
        return <Folder className="h-5 w-5 mb-2" />;
      case 'tag':
        return <Tag className="h-4 w-4 mb-1.5" />;
      case 'material':
        return <File className="h-4 w-4 mb-1.5" />;
      default:
        return null;
    }
  };
  
  return (
    <div style={nodeStyle}>
      {/* 入口连接点 - 除了中心节点外的所有节点 */}
      {type !== 'central' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: '#FF3366',
            width: 6,
            height: 6,
            borderRadius: '50%',
            border: '1px solid white',
          }}
        />
      )}
      
      <div className="flex flex-col items-center">
        {getNodeIcon()}
        <div>{label}</div>
      </div>
      
      {/* 显示相关材料数量 */}
      {type === 'tag' && materials && materials.length > 0 && (
        <Badge variant="secondary" className="mt-2 text-xs">
          相关材料: {materials.length}
        </Badge>
      )}
      
      {/* 出口连接点 - 除了材料节点外的所有节点 */}
      {type !== 'material' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: '#FF3366',
            width: 6,
            height: 6,
            borderRadius: '50%',
            border: '1px solid white',
          }}
        />
      )}
    </div>
  );
};

export default memo(MindMapNode); 