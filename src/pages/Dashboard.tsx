import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Star, 
  FileText, 
  ChevronRight, 
  Plus, 
  Brain, 
  BarChart3, 
  UserCircle2, 
  Users, 
  MessageSquare, 
  BookOpen,
  Search,
  Calendar,
  InfoIcon
} from 'lucide-react';
import { mindmapService } from '@/lib/mindmapStorage';
import { userFilesService } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';

// Define proper interface for content items
interface ContentItem {
  id: number;
  title: string;
  type: string;
  date: string;
  starred: boolean;
}

// 获取用户收藏资料的函数
const loadUserFavorites = (userId) => {
  if (!userId) return [];
  
  const userFavorites = userFilesService.getUserFavorites(userId);
  
  // 为每个收藏的资料添加收藏记录信息
  return userFavorites.map(item => {
    const favoriteRecord = item.favoriteByUsers?.find(record => record.userId === userId);
    return {
      ...item,
      favoriteTime: favoriteRecord?.favoriteTime,
      favoriteNote: favoriteRecord?.favoriteNote
    };
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 获取用户信息
  const [activeTab, setActiveTab] = useState('recent');
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [starredItems, setStarredItems] = useState<any[]>([]);
  
  useEffect(() => {
    // Load recent mindmaps and materials
    const loadRecentContent = () => {
      const recentMindmaps = mindmapService.getRecent(3).map(mindmap => ({
        id: mindmap.id,
        title: mindmap.title,
        type: "思维导图",
        date: mindmap.updatedAt,
        starred: mindmap.starred
      }));
      
      const recentMaterials = userFilesService.getRecent(3).map(material => ({
        id: material.id,
        title: material.title,
        type: "学习资料",
        date: material.uploadDate,
        starred: material.starred
      }));
      
      // Combine and sort by date
      const combined = [...recentMindmaps, ...recentMaterials]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      
      setRecentContent(combined);
    };
    
    loadRecentContent();
  }, []);
  
  // Calculate stats
  const mindmapCount = mindmapService.getAll().length;
  const materialCount = userFilesService.getApprovedFiles().length;
  const starredCount = mindmapService.getStarred().length + userFilesService.getStarredFiles().length;
  
  // 功能：导航到不同页面
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  // 功能：切换收藏状态
  const toggleStarred = (item: ContentItem, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发父元素的点击事件
    
    if (item.type === "思维导图") {
      const updatedMindMap = mindmapService.toggleStarred(item.id);
      if (updatedMindMap) {
        setRecentContent(prev => 
          prev.map(content => 
            content.id === item.id && content.type === "思维导图" 
              ? { ...content, starred: updatedMindMap.starred } 
              : content
          )
        );
        
        toast({
          title: updatedMindMap.starred ? "已收藏" : "已取消收藏",
          description: `思维导图「${updatedMindMap.title}」${updatedMindMap.starred ? "已添加到收藏" : "已从收藏中移除"}`,
        });
      }
    } else if (item.type === "学习资料") {
      const updatedMaterial = userFilesService.toggleStarred(item.id);
      if (updatedMaterial) {
        setRecentContent(prev => 
          prev.map(content => 
            content.id === item.id && content.type === "学习资料" 
              ? { ...content, starred: updatedMaterial.starred } 
              : content
          )
        );
        
        toast({
          title: updatedMaterial.starred ? "已收藏" : "已取消收藏",
          description: `学习资料「${updatedMaterial.title}」${updatedMaterial.starred ? "已添加到收藏" : "已从收藏中移除"}`,
        });
      }
    }
  };

  // 功能：打开创建思维导图对话框或页面
  const createMindMap = () => {
    navigate('/mindmap-editor/new');
  };

  // 功能：上传学习资料
  const uploadMaterial = () => {
    navigate('/upload');
  };
  
  // 功能：渲染内容列表
  const renderContentItems = (items: ContentItem[]) => {
    return items.map(item => (
      <motion.div
        key={`${item.type}-${item.id}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => {
          // 根据内容类型导航到不同页面
          if (item.type === "思维导图") {
            navigate(`/mindmap-editor/${item.id}`);
          } else if (item.type === "学习资料") {
            navigate(`/material/${item.id}`);
          }
        }}
      >
        <Card className="mb-3 hover:border-primary/50 transition-colors">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                {item.type === "思维导图" ? (
                  <Brain className="h-5 w-5 text-primary" />
                ) : (
                  <FileText className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {item.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => toggleStarred(item, e)} 
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <Star className={`h-4 w-4 ${item.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              </button>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ));
  };

  // Stats data for the quick stats cards
  const stats = [
    {
      title: "思维导图",
      icon: Brain,
      value: String(mindmapCount),
      description: "个人创建",
      color: "bg-blue-500",
      onClick: () => navigate('/mindmaps')
    },
    {
      title: "学习资料",
      icon: FileText,
      value: String(materialCount),
      description: "已上传",
      color: "bg-emerald-500",
      onClick: () => navigate('/search')
    },
    {
      title: "收藏内容",
      icon: Star,
      value: String(starredCount),
      description: "思维导图和资料",
      color: "bg-amber-500",
      onClick: () => navigate('/search?filter=starred')
    },
    {
      title: "讨论参与",
      icon: MessageSquare,
      value: "24",
      description: "话题和回复",
      color: "bg-purple-500",
      onClick: () => navigate('/discussion')
    }
  ];

  // Filter the starredContent
  const starredContent = recentContent.filter(item => item.starred);

  // 加载收藏内容
  useEffect(() => {
    if (user) {
      // 加载收藏的思维导图
      const starredMindmaps = mindmapService.getStarred().map(item => ({
        ...item,
        type: 'mindmap'
      }));
      
      // 加载收藏的资料
      const starredMaterials = loadUserFavorites(user.id).map(item => ({
        ...item,
        type: 'material'
      }));
      
      // 合并并按收藏时间排序
      setStarredItems([...starredMindmaps, ...starredMaterials].sort((a, b) => {
        const timeA = a.favoriteTime || a.updatedAt;
        const timeB = b.favoriteTime || b.updatedAt;
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      }));
    }
  }, [user]);
  
  // 收藏卡片渲染
  const renderStarredItem = (item) => {
    const isMindmap = item.type === 'mindmap';
    const formattedDate = isMindmap
      ? new Date(item.updatedAt).toLocaleDateString()
      : new Date(item.favoriteTime || item.uploadTime).toLocaleDateString();
      
    return (
      <Card key={`${item.type}-${item.id}`} className="overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">
                {item.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {isMindmap ? '思维导图' : '学习资料'}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleToggleFavorite(item)}
            >
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags && item.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {isMindmap ? '更新于：' : '收藏于：'} {formattedDate}
            </div>
            
            {/* 收藏备注提示 */}
            {!isMindmap && item.favoriteNote && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{item.favoriteNote}</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => handleViewItem(item)}
            >
              查看
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 处理查看收藏项目
  const handleViewItem = (item) => {
    if (item.type === 'mindmap') {
      navigate(`/mindmap-view/${item.id}`);
    } else {
      navigate(`/material/${item.id}`);
    }
  };
  
  // 处理切换收藏状态
  const handleToggleFavorite = (item) => {
    try {
      if (item.type === 'mindmap') {
        // 切换思维导图的收藏状态
        const updatedMindMap = mindmapService.toggleStarred(item.id);
        
        // 更新列表中的项目
        setStarredItems(prevItems => 
          prevItems.filter(i => !(i.type === 'mindmap' && i.id === item.id))
        );
        
        toast({
          title: "已取消收藏",
        });
      } else {
        // 切换资料的收藏状态
        const updatedMaterial = userFilesService.removeFavorite(item.id, user?.id);
        
        // 更新列表中的项目
        setStarredItems(prevItems => 
          prevItems.filter(i => !(i.type === 'material' && i.id === item.id))
        );
        
        toast({
          title: "已取消收藏",
        });
      }
    } catch (error) {
      console.error('收藏操作出错:', error);
      toast({
        title: "操作失败",
        description: "收藏操作失败，请稍后再试",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight"
          >
            仪表盘
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="text-muted-foreground"
          >
            欢迎回来！这里是您的学习活动概况
          </motion.p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={createMindMap}
          >
            <Plus className="h-4 w-4" />
            创建思维导图
          </Button>
          <Button 
            className="gap-2"
            onClick={uploadMaterial}
          >
            <FileText className="h-4 w-4" />
            上传学习资料
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={stat.onClick}
            className="cursor-pointer"
          >
            <Card className="hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className={`${stat.color} text-white p-2 rounded-lg`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 space-y-4"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>最近内容</CardTitle>
              <CardDescription>您最近使用的思维导图和学习资料</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentContent.length > 0 ? (
                renderContentItems(recentContent)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto opacity-20 mb-3" />
                  <p>暂无最近内容</p>
                  <p className="text-sm">尝试创建思维导图或上传学习资料</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="w-full gap-1"
                onClick={() => navigate('/search')}
              >
                查看全部历史记录
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>收藏内容</CardTitle>
              <div className="flex justify-between items-center">
                <CardDescription>您标记为收藏的内容</CardDescription>
                {starredItems.length > 0 && (
                  <Button variant="link" size="sm" className="text-xs h-6 px-0">
                    查看全部 <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {starredItems.length > 0 ? (
                <div className="grid gap-3">
                  {starredItems.slice(0, 3).map(renderStarredItem)}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-3 stroke-muted-foreground/50" />
                  <p>没有收藏的内容</p>
                  <p className="text-sm">点击星标图标添加收藏</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>快速访问</CardTitle>
              <CardDescription>常用功能入口</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3"
                onClick={() => navigate('/mindmaps')}
              >
                <Brain className="h-5 w-5 text-blue-500" />
                我的思维导图
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3"
                onClick={() => navigate('/search')}
              >
                <BookOpen className="h-5 w-5 text-emerald-500" />
                资料搜索
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3"
                onClick={() => navigate('/profile')}
              >
                <UserCircle2 className="h-5 w-5 text-purple-500" />
                个人中心
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3"
                onClick={() => navigate('/discussion')}
              >
                <Users className="h-5 w-5 text-amber-500" />
                讨论交流
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
