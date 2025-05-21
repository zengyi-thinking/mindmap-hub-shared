import React from 'react';
import { Folder } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Material {
  id: string;
  title: string;
  description?: string;
  uploadDate?: string;
  uploadTime?: string;
  filename?: string;
  file?: {
    name?: string;
  };
}

interface MaterialFileListProps {
  materials: Material[];
  searchQuery: string;
  onSelectMaterial: (material: Material) => void;
}

/**
 * 资料文件列表组件
 * 展示文件夹中的资料列表，支持搜索过滤
 */
const MaterialFileList: React.FC<MaterialFileListProps> = ({
  materials,
  searchQuery,
  onSelectMaterial
}) => {
  // 过滤资料
  const filteredMaterials = materials.filter(material => 
    searchQuery === '' || 
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className="h-[calc(100%-40px)]">
      {filteredMaterials.length > 0 ? (
        <div className="space-y-3">
          {filteredMaterials.map(material => (
            <div
              key={material.id}
              className="border rounded-md p-3 hover:bg-muted cursor-pointer"
              onClick={() => onSelectMaterial(material)}
            >
              <h4 className="font-medium">{material.title}</h4>
              {material.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {material.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(material.uploadDate || material.uploadTime).toLocaleDateString()}
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {material.filename?.split('.').pop() || material.file?.name?.split('.').pop() || '文件'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Folder className="w-10 h-10 mx-auto mb-2 opacity-30" />
          {searchQuery ? '没有找到匹配的资料' : '当前文件夹为空'}
        </div>
      )}
    </ScrollArea>
  );
};

export default MaterialFileList; 