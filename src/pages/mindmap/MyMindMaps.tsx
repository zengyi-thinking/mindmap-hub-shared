import React, { useState } from 'react';
import { useMyMindMaps } from '@/modules/mindmap/bridges/hooks';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Star, 
  StarOff, 
  Share2, 
  Lock, 
  Edit3, 
  Trash2, 
  Calendar, 
  Eye, 
  Brain, 
  FileText,
  Sparkles,
  Clock,
  Grid
} from 'lucide-react';

// 使用从types导入的接口
import { SharedMindMap } from '@/modules/mindmap/bridges/types';

const MyMindMaps = () => {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newMindMapTitle, setNewMindMapTitle] = useState('');
  const [newMindMapDescription, setNewMindMapDescription] = useState('');
  const [newMindMapTags, setNewMindMapTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    filteredMindMaps,
    starredMindMaps,
    recentMindMaps,
    handleCreateMindMap,
    toggleStarred,
    toggleShared,
    handleDeleteMindMap,
    handleEditMindMap
  } = useMyMindMaps();
  
  // 模拟的共享思维导图数据（在实际应用中应该从API获取）
  const [sharedMindMaps] = React.useState<SharedMindMap[]>([
    { id: 101, title: '机器学习概念图谱', creator: '张三', createdAt: '2023-06-12', likes: 45, views: 128, tags: ['AI', '机器学习'] },
    { id: 102, title: '前端开发技术栈', creator: '李四', createdAt: '2023-06-09', likes: 32, views: 96, tags: ['前端', 'Web开发'] },
    { id: 103, title: '英语学习路线图', creator: '王五', createdAt: '2023-06-07', likes: 28, views: 87, tags: ['语言学习', '英语'] },
    { id: 104, title: '高等数学知识梳理', creator: '赵六', createdAt: '2023-06-04', likes: 39, views: 112, tags: ['数学', '学习方法'] },
  ]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const createNewMindMap = () => {
    if (!newMindMapTitle.trim()) return;
    
    // 设置思维导图创建参数
    const newMindMapData = {
      title: newMindMapTitle,
      description: newMindMapDescription,
      tags: newMindMapTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      shared: isPublic
    };
    
    // 调用 hook 方法创建思维导图
    handleCreateMindMap(newMindMapData);
    setCreateDialogOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setNewMindMapTitle('');
    setNewMindMapDescription('');
    setNewMindMapTags('');
    setIsPublic(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-8">
      {/* 页面标题和操作栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            思维导图管理
          </h1>
          <p className="text-muted-foreground mt-1">
            创建、编辑和管理您的思维导图
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索思维导图..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 flex-shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            创建思维导图
          </Button>
        </div>
      </div>
      
      {/* 思维导图标签页 */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Grid className="h-4 w-4" />
            <span>所有思维导图</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>最近访问</span>
          </TabsTrigger>
          <TabsTrigger value="starred" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>已收藏</span>
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>社区分享</span>
          </TabsTrigger>
        </TabsList>
        
        {/* 所有思维导图 */}
        <TabsContent value="all" className="mt-6">
          {filteredMindMaps && filteredMindMaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMindMaps.map((mindMap) => (
                <Card key={mindMap.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b pb-4">
                    <div className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={mindMap.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}
                        onClick={() => toggleStarred(mindMap.id)}
                      >
                        {mindMap.starred ? <Star className="h-5 w-5 fill-yellow-500" /> : <StarOff className="h-5 w-5" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={mindMap.shared ? 'text-green-500' : 'text-gray-400'}
                        onClick={() => toggleShared(mindMap.id)}
                      >
                        {mindMap.shared ? <Share2 className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                      </Button>
                    </div>
                    <CardTitle className="mt-2 text-xl cursor-pointer hover:text-primary transition-colors" 
                      onClick={() => navigate(`/mindmap/${mindMap.id}/view`)}
                    >
                      {mindMap.title}
                    </CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-3">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(mindMap.updatedAt)}
                      </span>
                      {mindMap.viewCount && (
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {mindMap.viewCount} 次查看
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-4">
                    <CardDescription className="line-clamp-2 h-10">
                      {mindMap.description || '暂无描述信息'}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {mindMap.tags && mindMap.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(!mindMap.tags || mindMap.tags.length === 0) && (
                        <span className="text-xs text-muted-foreground">无标签</span>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-1"
                      onClick={() => handleEditMindMap(mindMap.id)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMindMap(mindMap.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      删除
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">还没有思维导图</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                创建您的第一个思维导图，开始组织和可视化您的想法和知识
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                创建思维导图
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* 最近思维导图 */}
        <TabsContent value="recent" className="mt-6">
          {recentMindMaps && recentMindMaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 内容与'all'标签页相同，只是数据源不同 */}
              {recentMindMaps.map((mindMap) => (
                <Card key={mindMap.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b pb-4">
                    <div className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={mindMap.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}
                        onClick={() => toggleStarred(mindMap.id)}
                      >
                        {mindMap.starred ? <Star className="h-5 w-5 fill-yellow-500" /> : <StarOff className="h-5 w-5" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={mindMap.shared ? 'text-green-500' : 'text-gray-400'}
                        onClick={() => toggleShared(mindMap.id)}
                      >
                        {mindMap.shared ? <Share2 className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                      </Button>
                    </div>
                    <CardTitle className="mt-2 text-xl cursor-pointer hover:text-primary transition-colors" 
                      onClick={() => navigate(`/mindmap/${mindMap.id}/view`)}
                    >
                      {mindMap.title}
                    </CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-3">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(mindMap.updatedAt)}
                      </span>
                      {mindMap.viewCount && (
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {mindMap.viewCount} 次查看
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-4">
                    <CardDescription className="line-clamp-2 h-10">
                      {mindMap.description || '暂无描述信息'}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {mindMap.tags && mindMap.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(!mindMap.tags || mindMap.tags.length === 0) && (
                        <span className="text-xs text-muted-foreground">无标签</span>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-1"
                      onClick={() => handleEditMindMap(mindMap.id)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMindMap(mindMap.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      删除
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">没有最近访问的思维导图</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                访问或编辑思维导图后，它们将显示在这里
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* 收藏的思维导图 */}
        <TabsContent value="starred" className="mt-6">
          {starredMindMaps && starredMindMaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 内容与'all'标签页相同，只是数据源不同 */}
              {starredMindMaps.map((mindMap) => (
                <Card key={mindMap.id} className="overflow-hidden hover:shadow-md transition-shadow border-yellow-200">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 border-b pb-4">
                    <div className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-yellow-500"
                        onClick={() => toggleStarred(mindMap.id)}
                      >
                        <Star className="h-5 w-5 fill-yellow-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={mindMap.shared ? 'text-green-500' : 'text-gray-400'}
                        onClick={() => toggleShared(mindMap.id)}
                      >
                        {mindMap.shared ? <Share2 className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                      </Button>
                    </div>
                    <CardTitle className="mt-2 text-xl cursor-pointer hover:text-primary transition-colors" 
                      onClick={() => navigate(`/mindmap/${mindMap.id}/view`)}
                    >
                      {mindMap.title}
                    </CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-3">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(mindMap.updatedAt)}
                      </span>
                      {mindMap.viewCount && (
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {mindMap.viewCount} 次查看
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-4">
                    <CardDescription className="line-clamp-2 h-10">
                      {mindMap.description || '暂无描述信息'}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {mindMap.tags && mindMap.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(!mindMap.tags || mindMap.tags.length === 0) && (
                        <span className="text-xs text-muted-foreground">无标签</span>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-1"
                      onClick={() => handleEditMindMap(mindMap.id)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMindMap(mindMap.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      删除
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">没有收藏的思维导图</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                点击思维导图卡片上的星星图标，将其添加到收藏夹
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* 社区共享的思维导图 */}
        <TabsContent value="shared" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedMindMaps.map((mindMap) => (
              <Card key={mindMap.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border-b pb-4">
                  <CardTitle className="mt-2 text-xl cursor-pointer hover:text-primary transition-colors">
                    {mindMap.title}
                  </CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground mt-1 gap-3">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {mindMap.createdAt}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {mindMap.views} 次查看
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-primary/10 text-primary font-medium text-xs px-2 py-1 rounded-full">
                      {mindMap.creator}
                    </div>
                    <div className="flex items-center text-yellow-500 text-xs font-medium">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 mr-1" />
                      {mindMap.likes}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {mindMap.tags && mindMap.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button size="sm" className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    查看
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-3.5 w-3.5" />
                    分享
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* 创建思维导图对话框 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              创建新的思维导图
            </DialogTitle>
            <DialogDescription>
              请输入新思维导图的名称和描述。创建后您可以立即开始编辑。
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">思维导图名称</Label>
              <Input
                id="title"
                type="text"
                value={newMindMapTitle}
                onChange={(e) => setNewMindMapTitle(e.target.value)}
                placeholder="例如：项目计划、学习笔记..."
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={newMindMapDescription}
                onChange={(e) => setNewMindMapDescription(e.target.value)}
                placeholder="简要描述思维导图的内容和用途..."
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">标签</Label>
              <Input
                id="tags"
                type="text"
                value={newMindMapTags}
                onChange={(e) => setNewMindMapTags(e.target.value)}
                placeholder="使用逗号分隔多个标签，如：学习,笔记,计划"
              />
              <p className="text-xs text-muted-foreground">
                标签可以帮助您更好地组织和查找思维导图
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="privacy"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="privacy">公开此思维导图</Label>
              <p className="text-xs text-muted-foreground ml-2">
                {isPublic ? '所有人都可以查看此思维导图' : '只有您能查看此思维导图'}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={createNewMindMap}
              disabled={!newMindMapTitle.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              创建思维导图
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyMindMaps;


