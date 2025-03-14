
import React from 'react';
import styles from '@/pages/MaterialSearch.module.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Eye, Download, FileText, Clock, User } from 'lucide-react';
import { userFilesService } from '@/lib/storage';
import { motion } from 'framer-motion';

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
    <Card className="mb-8 border-primary/20 shadow-md">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-primary/10">
        <CardTitle className="text-lg text-primary flex items-center gap-2">
          <FileText className="h-5 w-5" />
          相关资料列表
        </CardTitle>
        <CardDescription>
          基于您选择的标签路径展示相关资料
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        <div className="flex items-center gap-2 text-sm p-2 rounded-md bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4 text-primary/70" />
            <span className="font-medium">标签路径:</span>
          </div>
          {selectedTagPath.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedTagPath.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-primary/5 border-primary/20">
                  {tag}
                  {index < selectedTagPath.length - 1 && (
                    <span className="mx-1 text-muted-foreground">›</span>
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">未选择标签路径</span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (i % 6) }}
              >
                <Card 
                  className={`${styles.glassCard} ${styles.cardShadow} cursor-pointer transition-all duration-200 border-primary/20 h-full flex flex-col ${styles.cardHover}`}
                  onClick={() => onMaterialSelect(material)}
                >
                  <CardHeader className="p-4 pb-2 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-primary/10">
                    <CardTitle className="text-base font-medium text-primary">{material.title || material.file?.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex-grow flex flex-col">
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-grow">
                      {material.description || "没有描述"}
                    </p>
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {material.tags && material.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs bg-primary/5 border-primary/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{material.username || '匿名用户'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(material.uploadTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 hover:bg-primary/10 hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            userFilesService.incrementViews(material.id);
                            onMaterialSelect(material);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          预览
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 hover:bg-primary/10 hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownload(material);
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-3 py-8 text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>没有找到相关资料</p>
              <p className="text-sm mt-1">请尝试选择不同的标签或搜索条件</p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialsList;
