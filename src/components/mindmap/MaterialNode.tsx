import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Material } from '@/types/materials';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface MaterialNodeProps {
  id: string;
  data: {
    label: string;
    notes?: string;
    materials?: Material[];
    icon?: string;
    url?: string;
    isRoot?: boolean;
  };
  selected: boolean;
}

const MaterialNode: React.FC<MaterialNodeProps> = ({ data, selected }) => {
  const { label, notes, materials = [], icon, url, isRoot } = data;
  const { darkMode } = useTheme();
  
  // Dynamically get icon component
  const IconComponent: LucideIcon | null = icon && (Icons as any)[icon] ? (Icons as any)[icon] : null;
  
  // 根节点、标准节点和叶节点的不同样式
  const getNodeStyle = () => {
    if (isRoot) {
      return {
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        color: 'white',
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)'
      };
    }
    
    if (materials && materials.length > 0) {
      return {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
      };
    }
    
    // 为普通节点添加暗色模式支持
    return darkMode ? {
      background: '#374151', // 深灰色背景
      color: '#e5e7eb',      // 浅色文字
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      border: '1px solid #4b5563',
      borderLeft: '5px solid #3b82f6'
    } : {
      background: 'white',
      color: '#1f2937',      // 确保文字颜色在亮色模式下明确定义
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      borderLeft: '5px solid #3b82f6'
    };
  };
  
  return (
    <div 
      className={`p-3 ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      style={{
        ...getNodeStyle(),
        minWidth: '140px',
        maxWidth: '200px',
        transition: 'all 0.2s ease'
      }}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          background: '#555', 
          width: 8, 
          height: 8, 
          borderRadius: '50%',
          border: '2px solid white'
        }}
      />
      
      <div className="flex flex-col items-center">
        {IconComponent && (
          <div className="flex justify-center mb-1">
            <IconComponent className={`h-6 w-6 ${isRoot ? 'text-white' : darkMode ? 'text-blue-300' : 'text-primary'}`} />
          </div>
        )}
        <div className="font-medium text-center" style={{ color: getNodeStyle().color }}>{label}</div>
      </div>
      
      {notes && (
        <div className="text-xs mt-1.5" style={{ color: isRoot ? 'rgba(255, 255, 255, 0.8)' : darkMode ? '#d1d5db' : '#6b7280' }}>
          {notes.length > 50 ? `${notes.substring(0, 50)}...` : notes}
        </div>
      )}
      
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {materials && materials.length > 0 && (
          <Badge variant="outline" className={`flex items-center gap-1 text-xs ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white/90'}`}>
            <FileText className="h-3 w-3" />
            {materials.length} 个资料
          </Badge>
        )}
        
        {url && (
          <Badge variant="outline" className={`flex items-center gap-1 text-xs ${darkMode ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-50 dark:bg-blue-950/20'}`}>
            <Link2 className="h-3 w-3" />
            外部链接
          </Badge>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#555', 
          width: 8, 
          height: 8, 
          borderRadius: '50%',
          border: '2px solid white'
        }}
      />
    </div>
  );
};

export default memo(MaterialNode);
