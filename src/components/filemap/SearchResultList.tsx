
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Calendar, Download, Star } from 'lucide-react';
import { Material } from '@/types/materials';

interface SearchResultListProps {
  materials: Material[];
  onSelect: (material: Material) => void;
}

const SearchResultList: React.FC<SearchResultListProps> = ({ materials, onSelect }) => {
  // Format date string
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  if (materials.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">没有找到匹配的资料</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {materials.map((material) => (
        <Card 
          key={material.id}
          className="cursor-pointer hover:border-primary/50 transition-colors" 
          onClick={() => onSelect(material)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-md">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1 truncate">{material.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                  {material.description || '无描述'}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {material.tags && material.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap text-xs text-muted-foreground gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {material.uploader || '未知用户'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(material.uploadTime)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {material.downloads || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {material.favorites || 0}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResultList;
