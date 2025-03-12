
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MaterialListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materials: any[];
  tagName: string;
  onMaterialSelect: (material: any) => void;
}

const MaterialListDialog: React.FC<MaterialListDialogProps> = ({
  open,
  onOpenChange,
  materials,
  tagName,
  onMaterialSelect
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>标签"{tagName}"的相关资料</DialogTitle>
          <DialogDescription>
            以下是与该标签相关的所有资料，点击卡片查看详情
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {materials.map((material, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onMaterialSelect(material)}
            >
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base line-clamp-1">{material.title || material.file?.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {material.description || "没有描述"}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {material.tags && material.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {material.tags && material.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{material.tags.length - 3}</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="px-4 py-2 flex justify-between text-xs text-muted-foreground">
                <span>上传者: {material.username || "未知"}</span>
                <span>查看: {material.views || 0}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialListDialog;
