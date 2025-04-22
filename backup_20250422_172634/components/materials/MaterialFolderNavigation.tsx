import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Upload,
  Download,
  Info
} from 'lucide-react';
import { tagHierarchy } from '@/data/tagHierarchy';

interface MaterialFolderNavigationProps {
  currentPath: string[];
  folderMaterials: any[];
  navigateTo: (index: number) => void;
  setCurrentPath: (path: string[]) => void;
  openPreview: (material: any) => void;
  downloadMaterial: (material: any) => void;
  handleOpenUploadForm: () => void;
}

const MaterialFolderNavigation: React.FC<MaterialFolderNavigationProps> = ({
  currentPath,
  folderMaterials,
  navigateTo,
  setCurrentPath,
  openPreview,
  downloadMaterial,
  handleOpenUploadForm
}) => {
  return (
    <Card className="xl:col-span-1 h-[600px] flex flex-col">
      <CardHeader className="p-4 pb-2 border-b">
        <CardTitle className="text-lg">资料夹浏览</CardTitle>
        <CardDescription>按层级浏览资料分类</CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        {/* 面包屑导航 */}
        <div className="flex items-center flex-wrap gap-1 text-sm mb-4">
          <Badge 
            variant={currentPath.length === 0 ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() => navigateTo(-1)}
          >
            <Folder className="h-3.5 w-3.5 mr-1" /> 
            根目录
          </Badge>
          
          {currentPath.map((folder, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <Badge
                variant={index === currentPath.length - 1 ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => navigateTo(index)}
              >
                {folder}
              </Badge>
            </React.Fragment>
          ))}
        </div>
        
        {/* 文件夹内容 */}
        <ScrollArea className="flex-grow">
          {currentPath.length === 0 ? (
            <div className="space-y-2">
              {tagHierarchy.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 p-2 rounded-md border hover:bg-primary/5 cursor-pointer"
                  onClick={() => setCurrentPath([category.name])}
                >
                  <FolderOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* 寻找当前路径的子文件夹 */}
              {(() => {
                let currentCategories = tagHierarchy;
                let subFolders = [];
                
                // 查找当前路径对应的子文件夹
                for (let i = 0; i < currentPath.length; i++) {
                  const folder = currentPath[i];
                  const found = currentCategories.find(cat => cat.name === folder);
                  
                  if (found && found.children) {
                    if (i === currentPath.length - 1) {
                      subFolders = found.children;
                    }
                    currentCategories = found.children;
                  } else {
                    break;
                  }
                }
                
                return (
                  <>
                    {/* 子文件夹 */}
                    {subFolders.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">子分类</h3>
                        <div className="space-y-1">
                          {subFolders.map(folder => (
                            <div
                              key={folder.id}
                              className="flex items-center gap-2 p-2 rounded-md border hover:bg-primary/5 cursor-pointer"
                              onClick={() => setCurrentPath([...currentPath, folder.name])}
                            >
                              <FolderOpen className="h-4 w-4 text-primary" />
                              <span className="text-sm">{folder.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 当前文件夹内的资料 */}
                    {folderMaterials.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">资料</h3>
                        <div className="space-y-2">
                          {folderMaterials.map(material => (
                            <div
                              key={material.id}
                              className="flex items-center justify-between p-2 rounded-md border hover:bg-primary/5 cursor-pointer"
                              onClick={() => openPreview(material)}
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-sm">{material.title}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadMaterial(material);
                                }}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {subFolders.length === 0 && folderMaterials.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p>此资料夹为空</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={handleOpenUploadForm}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          上传资料
                        </Button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MaterialFolderNavigation;