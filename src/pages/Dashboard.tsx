
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FolderTree, Pencil, Eye, XCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MainDashboard } from '@/components/layouts/dashboard';
import { useToast } from '@/components/ui/use-toast';
import { userFilesService } from '@/lib/storage';
import { formatDate, formatFileSize } from '@/lib/utils';
import FileType from '@/components/file-upload/file-type';
import { Material } from '@/types/materials';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [recentItems, setRecentItems] = useState<Material[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<Material[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load recent files
    const recent = userFilesService.getRecentFiles(5);
    setRecentItems(recent);

    // Load favorite files
    const favorites = userFilesService.getFavoriteFiles();
    setFavoriteItems(favorites);
  }, []);

  const handlePreview = (item: Material) => {
    if (item.fileUrl) {
      window.open(item.fileUrl, '_blank');
    } else {
      toast({
        title: "无法预览",
        description: "该文件没有提供预览链接",
      });
    }
  };

  const handleRemoveFavorite = (id: string | number) => {
    userFilesService.removeFavoriteFile(id);
    setFavoriteItems(userFilesService.getFavoriteFiles());
    toast({
      title: "已取消收藏",
      description: "该文件已从您的收藏列表中移除",
    });
  };

  // Define proper motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MainDashboard>
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight"
        >
          仪表盘
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          className="text-muted-foreground"
        >
          查看最近上传和收藏的资料
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* Recent Uploads */}
          <section className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold tracking-tight"
            >
              最近上传
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              className="text-muted-foreground"
            >
              您最近上传的资料
            </motion.p>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recentItems.map((item) => (
                <motion.div key={item.id} variants={itemVariant}>
                  <Card className="overflow-hidden border hover:border-primary/50 transition-all duration-300">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base flex items-center gap-2 truncate">
                        <FileType fileType={item.fileType || ''} />
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 pb-1 text-sm text-muted-foreground">
                      <div className="line-clamp-2 h-10">
                        {item.description}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tags && item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-1">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags && item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 flex justify-between items-center">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{formatFileSize(item.fileSize || 0)}</span>
                        <span className="mx-2">•</span>
                        <span>{item.fileType}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="gap-1 h-8" onClick={() => handlePreview(item)}>
                        <Eye className="h-3.5 w-3.5" />
                        查看
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Favorite Materials */}
          <section className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold tracking-tight"
            >
              收藏资料
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              className="text-muted-foreground"
            >
              您收藏的资料
            </motion.p>
            
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {favoriteItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  variants={itemVariant}
                  className="relative group"
                >
                  <Card className="overflow-hidden border hover:border-primary/50 transition-all duration-300">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base flex items-center gap-2 truncate">
                        <FileType fileType={item.fileType || ''} />
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 pb-1 text-sm text-muted-foreground">
                      <div className="line-clamp-2 h-10">
                        {item.description}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tags && item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-1">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags && item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Add favorite information */}
                      {item.favoriteInfo && (
                        <div className="mt-2 text-xs border-t pt-2 border-dashed">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>收藏于: {formatDate(item.favoriteInfo.timestamp)}</span>
                          </div>
                          {item.favoriteInfo.path && item.favoriteInfo.path.length > 0 && (
                            <div className="mt-1 flex items-start gap-1">
                              <FolderTree className="h-3 w-3 mt-0.5 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                路径: <span className="text-foreground/80">{item.favoriteInfo.path.join(' > ')}</span>
                              </span>
                            </div>
                          )}
                          {item.favoriteInfo.note && (
                            <div className="mt-1 flex items-start gap-1">
                              <Pencil className="h-3 w-3 mt-0.5 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                备注: <span className="text-foreground/80">{item.favoriteInfo.note}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-3 flex justify-between items-center">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{formatFileSize(item.fileSize || 0)}</span>
                        <span className="mx-2">•</span>
                        <span>{item.fileType}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="gap-1 h-8" onClick={() => handlePreview(item)}>
                        <Eye className="h-3.5 w-3.5" />
                        查看
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Button
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(item.id);
                    }}
                  >
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      </div>
    </MainDashboard>
  );
};

export default Dashboard;
