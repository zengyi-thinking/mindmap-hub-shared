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

// ������ܵ�������������
const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  try {
    // ȷ���ı����ַ�������
    const strText = String(text);
    
    // ʹ�����滯����
    let normalized = strText
      .normalize('NFC')  // ��׼�ȼۺϳ�
      .replace(/[\uFE30-\uFE4F]/g, '') // �Ƴ������������
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // �Ƴ������ַ�
    
    if (!normalized || normalized.length === 0) {
      return strText; // �����׼����Ϊ�գ�����ԭʼ�ı�
    }
    
    return normalized;
  } catch (e) {
    console.error('Text normalization error:', e);
    // �������ʧ�ܣ�����ԭʼ�ı�
    return String(text);
  }
};

// ����Ƿ�Ϊ����ģʽ
const isDarkMode = () => {
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('dark');
  }
  return false;
};

// ����ʽ��������������
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

  // �����ǩ�ı�����ֹ����
  const safeLabel = sanitizeText(label);
  
  // ���ݽڵ����ͺͲ㼶���û�����ʽ��
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

  // ��ȡ�ڵ�ͼ��
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

  // ����������Ա���ڵ������ص�
  const getNodeWidth = () => {
    switch (type) {
      case 'central':
        return 180; // ��������ڵ���
      case 'tag':
        // ���ݼ�����ı����ȵ������
        // �����ַ�ͨ����Ҫ����Ŀռ�
        const isChinese = /[\u4e00-\u9fa5]/.test(safeLabel);
        const charWidth = isChinese ? 18 : 12; // �����ַ���ȸ���
        return Math.max(160, Math.min(280, safeLabel.length * charWidth));
      case 'material':
        return 220; // ���Ӳ��Ͻڵ���
      default:
        return 180;
    }
  };

  // �ضϹ����ı�ǩ����
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
      {/* ������ӵ� - �������Ľڵ�������нڵ� */}
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
            {filesCount > 0 ? `${filesCount} ���ļ�` : `${materialsCount} ������`}
          </Badge>
        )}
        
        {data.fullPath && data.fullPath.length > 0 && data.fullPath.length < 3 && (
          <div className="text-xs text-center opacity-80 mt-1 max-w-full truncate">
            {data.fullPath.map(p => sanitizeText(p)).join(' / ')}
          </div>
        )}
        
        {/* ���Բ��Ͻڵ���ʾ��ǩ */}
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
          {type === 'tag' ? '����ļ���' : '�鿴����'}
        </Badge>
      )}
      
      {/* �������ӵ� - ���˲��Ͻڵ�������нڵ� */}
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