
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Eye, Download, FileText } from 'lucide-react';
import { userFilesService } from '@/lib/storage';

interface MaterialsListProps {
  selectedTagPath: string[];
  filteredMaterials: any[];
  onMaterialSelect: (material: any) => void;
  onDownload: (material: any) => void;
}

const MaterialsList: React.FC<MaterialsListProps> = ({
  selectedTagPath,
  filteredMaterials,
  onMaterialSelect,
  onDownload
}) => {
  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">相关资料列表</CardTitle>
        <CardDescription>
          基于您选择的标签路径展示相关资料
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            标签路径:
          </div>
          {selectedTagPath.length > 0 ? (
            selectedTagPath.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">未选择标签路径</span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material, i) => (
              <Card 
                key={i} 
                className="glass-card subtle-hover cursor-pointer transition-all duration-200 hover:shadow-md"
                onClick={() => onMaterialSelect(material)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{material.title || material.file?.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {material.description || "没有描述"}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {material.tags && material.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          userFilesService.incrementViews(material.id);
                          onMaterialSelect(material);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(material);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>没有找到相关资料</p>
              <p className="text-sm mt-1">请尝试选择不同的标签或搜索条件</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialsList;
