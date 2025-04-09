import { useState, useCallback, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  FileArchive,
  FileImage,
  FileAudio,
  FileVideo,
  File,
  Calendar,
  Tag,
  Clock,
  ExternalLink,
  Download,
  BookOpen,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { zhCN } from 'date-fns/locale';

/**
 * 自定义钩子 - 处理材料预览
 * @param materials 所有材料数据
 */
export function useMaterialPreview(materials: any[]) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewList, setPreviewList] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [isTagList, setIsTagList] = useState(false);

  // 根据标签获取相关材料
  const getMaterialsByTag = useCallback(
    (tagName: string) => {
      return materials.filter((material) => 
        material.tags && material.tags.includes(tagName)
      );
    },
    [materials]
  );

  // 获取文件图标
  const getFileIcon = useCallback((fileType: string) => {
    const type = fileType?.toLowerCase() || '';
    if (type.includes('pdf') || type.includes('doc') || type.includes('txt')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (type.includes('zip') || type.includes('rar')) {
      return <FileArchive className="h-5 w-5 text-purple-500" />;
    } else if (type.includes('jpg') || type.includes('png') || type.includes('jpeg') || type.includes('gif')) {
      return <FileImage className="h-5 w-5 text-green-500" />;
    } else if (type.includes('mp3') || type.includes('wav')) {
      return <FileAudio className="h-5 w-5 text-yellow-500" />;
    } else if (type.includes('mp4') || type.includes('mov') || type.includes('avi')) {
      return <FileVideo className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  }, []);

  // 处理节点点击 - 适用于思维导图
  const onNodeClick = useCallback(
    (event: any, node: any) => {
      if (node.data.type === 'material' && node.data.material) {
        // 直接预览单个材料
        setPreviewList([]);
        setSelectedMaterial(node.data.material);
        setIsTagList(false);
        setPreviewOpen(true);
      } else if (node.data.type === 'tag') {
        // 获取标签相关材料
        const tagMaterials = getMaterialsByTag(node.data.tagName);
        
        if (tagMaterials.length === 1) {
          // 如果只有一个材料，直接预览
          setPreviewList([]);
          setSelectedMaterial(tagMaterials[0]);
          setIsTagList(false);
          setPreviewOpen(true);
        } else if (tagMaterials.length > 1) {
          // 如果有多个材料，显示列表
          setPreviewList(tagMaterials);
          setSelectedMaterial(null);
          setIsTagList(true);
          setPreviewOpen(true);
        }
      }
    },
    [getMaterialsByTag]
  );

  // 处理材料点击 - 在材料列表中
  const handleMaterialClick = useCallback((material: any) => {
    setSelectedMaterial(material);
    setIsTagList(false);
  }, []);

  // 关闭预览
  const handleClosePreview = useCallback(() => {
    setPreviewOpen(false);
    setSelectedMaterial(null);
    setPreviewList([]);
  }, []);

  // 打开文件
  const handleOpenFile = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  // 预览组件
  const MaterialPreviewDialog = (
    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        {isTagList && previewList.length > 0 ? (
          <>
            <DialogHeader>
              <DialogTitle>相关资料列表</DialogTitle>
              <DialogDescription>
                共找到 {previewList.length} 个相关资料
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                {previewList.map((material, index) => (
                  <Card
                    key={`material-${index}`}
                    className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
                    onClick={() => handleMaterialClick(material)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base line-clamp-1 flex items-center gap-2">
                        {getFileIcon(material.file?.type)}
                        {material.title || material.file?.name || '未命名资料'}
                      </CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {material.createdAt
                          ? formatDistanceToNow(new Date(material.createdAt), {
                              addSuffix: true,
                              locale: zhCN,
                            })
                          : '未知时间'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {material.tags && material.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {material.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <Badge
                              key={`tag-${tagIndex}`}
                              variant="secondary"
                              className="text-xs py-0 px-2"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {material.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs py-0 px-2"
                            >
                              +{material.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : selectedMaterial ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getFileIcon(selectedMaterial.file?.type)}
                {selectedMaterial.title || selectedMaterial.file?.name || '未命名资料'}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {selectedMaterial.createdAt
                    ? new Date(selectedMaterial.createdAt).toLocaleDateString()
                    : '未知日期'}
                </span>
                {selectedMaterial.file?.size && (
                  <span className="flex items-center gap-1">
                    <File className="h-3.5 w-3.5" />
                    {(selectedMaterial.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 pr-4">
              <div className="py-2">
                {selectedMaterial.description && (
                  <Card className="mb-4 shadow-sm border-primary/10">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">资料描述</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                      {selectedMaterial.description}
                    </CardContent>
                  </Card>
                )}

                {selectedMaterial.tags && selectedMaterial.tags.length > 0 && (
                  <Card className="mb-4 shadow-sm border-primary/10">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        标签分类
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMaterial.tags.map((tag: string, tagIndex: number) => (
                          <Badge
                            key={`detail-tag-${tagIndex}`}
                            className={cn(
                              "text-xs",
                              tagIndex % 4 === 0 && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                              tagIndex % 4 === 1 && "bg-green-100 text-green-800 hover:bg-green-200",
                              tagIndex % 4 === 2 && "bg-purple-100 text-purple-800 hover:bg-purple-200",
                              tagIndex % 4 === 3 && "bg-amber-100 text-amber-800 hover:bg-amber-200",
                            )}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 预览区 - 根据文件类型显示不同的预览 */}
                {selectedMaterial.file && (
                  <Card className="mb-4 shadow-sm border-primary/10">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        文件信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                      <p className="mb-2">
                        <span className="text-muted-foreground mr-2">文件名:</span>
                        {selectedMaterial.file.name}
                      </p>
                      {selectedMaterial.file.type && (
                        <p className="mb-2">
                          <span className="text-muted-foreground mr-2">文件类型:</span>
                          {selectedMaterial.file.type}
                        </p>
                      )}
                      {selectedMaterial.file.size && (
                        <p>
                          <span className="text-muted-foreground mr-2">文件大小:</span>
                          {(selectedMaterial.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 mt-4">
              {selectedMaterial.url && (
                <Button 
                  variant="outline" 
                  className="gap-1" 
                  onClick={() => handleOpenFile(selectedMaterial.url)}
                >
                  <BookOpen className="h-4 w-4" />
                  查看资料
                </Button>
              )}
              {previewList.length > 0 && (
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setSelectedMaterial(null);
                    setIsTagList(true);
                  }}
                >
                  返回列表
                </Button>
              )}
              <Button 
                variant="default" 
                className="gap-1" 
                onClick={handleClosePreview}
              >
                关闭预览
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-center">
              <p className="text-lg font-medium">没有找到相关资料</p>
              <p className="text-sm text-muted-foreground mt-1">
                选择思维导图上的标签节点可查看相关资料
              </p>
            </div>
            <Button 
              className="mt-4" 
              onClick={handleClosePreview}
            >
              关闭
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return {
    onNodeClick,
    showMaterialPreview: MaterialPreviewDialog as ReactNode,
  };
} 