
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Material } from '@/types/materials';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface MaterialNodeProps {
  id: string;
  data: {
    label: string;
    notes?: string;
    materials?: Material[];
    icon?: string;
    url?: string;
  };
  selected: boolean;
}

const MaterialNode: React.FC<MaterialNodeProps> = ({ data, selected }) => {
  const { label, notes, materials = [], icon, url } = data;
  
  // Dynamically get icon component
  const IconComponent: LucideIcon | null = icon && (Icons as any)[icon] ? (Icons as any)[icon] : null;
  
  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#555', width: 8, height: 4, borderRadius: 0 }}
      />
      
      <div className="p-2">
        <div className="flex flex-col items-center">
          {IconComponent && (
            <div className="flex justify-center mb-1">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="font-medium text-center">{label}</div>
        </div>
        
        {notes && (
          <div className="text-xs mt-1 text-muted-foreground">
            {notes.length > 50 ? `${notes.substring(0, 50)}...` : notes}
          </div>
        )}
        
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {materials && materials.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <FileText className="h-3 w-3" />
              {materials.length} 个资料
            </Badge>
          )}
          
          {url && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-950/20">
              <Link2 className="h-3 w-3" />
              外部链接
            </Badge>
          )}
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#555', width: 8, height: 4, borderRadius: 0 }}
      />
    </>
  );
};

export default memo(MaterialNode);
