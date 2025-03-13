
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Material } from '@/types/materials';

interface MaterialNodeProps {
  id: string;
  data: {
    label: string;
    notes?: string;
    materials?: Material[];
  };
  selected: boolean;
}

const MaterialNode: React.FC<MaterialNodeProps> = ({ data, selected }) => {
  const { label, notes, materials = [] } = data;
  
  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#555', width: 8, height: 4, borderRadius: 0 }}
      />
      
      <div className="p-2">
        <div className="font-medium text-center">{label}</div>
        
        {notes && (
          <div className="text-xs mt-1 text-muted-foreground">
            {notes.length > 50 ? `${notes.substring(0, 50)}...` : notes}
          </div>
        )}
        
        {materials && materials.length > 0 && (
          <div className="mt-2 flex justify-center">
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <FileText className="h-3 w-3" />
              {materials.length} 个资料
            </Badge>
          </div>
        )}
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
