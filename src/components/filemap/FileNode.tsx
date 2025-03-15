
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FileNodeProps {
  id: string;
  data: {
    label: string;
    type: 'file' | 'tag' | 'central';
    tags?: string[];
    fileCount?: number;
    icon?: React.ReactNode;
  };
  selected: boolean;
}

const FileNode = memo(({ data, selected }: FileNodeProps) => {
  const { label, type, tags, fileCount, icon } = data;
  
  // Different styles based on node type
  const getNodeStyle = () => {
    switch(type) {
      case 'central':
        return 'bg-primary text-primary-foreground font-bold p-3 min-w-[120px] flex flex-col items-center justify-center rounded-full';
      case 'tag':
        return 'bg-blue-100 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-900 text-foreground p-2 min-w-[100px] rounded-md';
      case 'file':
        return 'bg-background border border-border shadow-sm p-2 min-w-[120px] rounded-md';
      default:
        return 'bg-background border border-border p-2 rounded-md';
    }
  };
  
  return (
    <div className={`${getNodeStyle()} ${selected ? 'ring-2 ring-primary' : ''}`}>
      {type === 'central' && (
        <>
          <div className="text-center">{label}</div>
          <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
        </>
      )}
      
      {type === 'tag' && (
        <>
          <Handle type="target" position={Position.Top} className="w-2 h-2" />
          <div className="flex items-center justify-center gap-1 font-medium">
            <Tag className="h-3 w-3" />
            {label}
          </div>
          {fileCount !== undefined && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {fileCount} 个文件
            </Badge>
          )}
          <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
        </>
      )}
      
      {type === 'file' && (
        <>
          <Handle type="target" position={Position.Top} className="w-2 h-2" />
          <div className="flex items-center justify-center gap-1 mb-1">
            <FileText className="h-3 w-3 text-primary" />
            <div className="font-medium text-sm truncate max-w-[100px]">{label}</div>
          </div>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {tags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs px-1">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
});

FileNode.displayName = 'FileNode';

export default FileNode;
