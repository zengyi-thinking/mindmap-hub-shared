
import React, { useState, useEffect } from 'react';
import MaterialSearchContainer from '@/features/material-search/MaterialSearchContainer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Search, FileText, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { mindmapService } from '@/lib/mindmapStorage';
import { MindMap } from '@/types/mindmap';
import { motion } from 'framer-motion';

/**
 * 材料搜索页面
 * 包含资料标签化导图搜索和全平台资料导图浏览
 */
const MaterialSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('search');
  const [publicMindMaps, setPublicMindMaps] = useState<MindMap[]>([]);
  const navigate = useNavigate();
  
  // 加载公开的思维导图
  useEffect(() => {
    if (activeTab === 'mindmaps') {
      const sharedMindMaps = mindmapService.getShared();
      setPublicMindMaps(sharedMindMaps);
    }
  }, [activeTab]);
  
  // 查看思维导图
  const viewMindMap = (id: number) => {
    navigate(`/mindmap-view/${id}`);
  };
  
  return (
    <div className="w-full">
      <Tabs defaultValue="search" className="w-full" onValueChange={setActiveTab}>
        <div className="container mx-auto mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              资料标签化导图搜索
            </TabsTrigger>
            <TabsTrigger value="mindmaps" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              全平台资料导图
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="search">
          <MaterialSearchContainer />
        </TabsContent>
        
        <TabsContent value="mindmaps">
          <div className="w-full max-w-6xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold tracking-tight text-primary">全平台资料导图</h1>
              <p className="text-muted-foreground">
                浏览其他用户创建并公开分享的思维导图，探索更多学习资源
              </p>
            </motion.div>
            
            {publicMindMaps.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {publicMindMaps.map((mindMap, index) => (
                  <motion.div
                    key={mindMap.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index % 3) }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow border-primary/20 h-full flex flex-col">
                      <CardHeader className="p-4 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-primary/10">
                        <CardTitle className="text-lg font-semibold text-primary">{mindMap.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 pb-0 flex-grow">
                        <div className="w-full h-32 rounded-md bg-primary/5 flex items-center justify-center mb-2 border border-primary/10">
                          <Brain className="h-10 w-10 text-primary/50" />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {mindMap.description || '无描述'}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span>{mindMap.viewCount || 0} 次浏览</span>
                        </div>
                        {mindMap.tags && mindMap.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {mindMap.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-primary/5 hover:bg-primary/10 border-primary/10">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-t border-primary/10 mt-auto">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 bg-primary/10">
                            <AvatarFallback className="text-xs text-primary">
                              {mindMap.creator?.substring(0, 2) || 'UN'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {mindMap.creator || '未知用户'}
                          </span>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => viewMindMap(mindMap.id)}>
                          查看
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center py-16"
              >
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Brain className="h-8 w-8 text-primary/70" />
                </div>
                <h2 className="text-xl font-semibold mb-2">暂无公开的思维导图</h2>
                <p className="text-muted-foreground">
                  目前还没有用户公开分享思维导图
                </p>
                <Button 
                  className="mt-4 bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/mindmap-editor/new')}
                >
                  创建思维导图
                </Button>
              </motion.div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaterialSearch;
