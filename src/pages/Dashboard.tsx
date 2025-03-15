import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  InfoIcon,
} from "lucide-react";
import { mindmapService } from "@/lib/mindmapStorage";
import { userFilesService } from "@/lib/storage";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import UsageReport from "@/components/dashboard/UsageReport";

interface ContentItem {
  id: number;
  title: string;
  type: string;
  date: string;
  starred: boolean;
}

const loadUserFavorites = (userId) => {
  if (!userId) return [];

  const userFavorites = userFilesService.getUserFavorites(userId);

  return userFavorites.map((item) => {
    const favoriteRecord = item.favoriteByUsers?.find(
      (record) => record.userId === userId
    );
    return {
      ...item,
      favoriteTime: favoriteRecord?.favoriteTime,
      favoriteNote: favoriteRecord?.favoriteNote,
    };
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("recent");
  const [activeSection, setActiveSection] = useState<"overview" | "usage">("overview");
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [starredItems, setStarredItems] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [activeDataCard, setActiveDataCard] = useState<number | null>(null);

  useEffect(() => {
    const loadRecentContent = () => {
      const recentMindmaps = mindmapService.getRecent(3).map((mindmap) => ({
        id: mindmap.id,
        title: mindmap.title,
        type: "思维导图",
        date: mindmap.updatedAt,
        starred: mindmap.starred,
      }));

      const recentMaterials = userFilesService.getRecent(3).map((material) => ({
        id: material.id,
        title: material.title,
        type: "学习资料",
        date: material.uploadDate,
        starred: material.starred,
      }));

      const combined = [...recentMindmaps, ...recentMaterials]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentContent(combined);
    };

    loadRecentContent();
  }, []);

  const mindmapCount = mindmapService.getAll().length;
  const materialCount = userFilesService.getApprovedFiles().length;
  const starredCount =
    mindmapService.getStarred().length +
    userFilesService.getStarredFiles().length;

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const toggleStarred = (item: ContentItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (item.type === "思维导图") {
      const updatedMindMap = mindmapService.toggleStarred(item.id);
      if (updatedMindMap) {
        setRecentContent((prev) =>
          prev.map((content) =>
            content.id === item.id && content.type === "思维导图"
              ? { ...content, starred: updatedMindMap.starred }
              : content
          )
        );

        toast({
          title: updatedMindMap.starred ? "已收藏" : "已取消收藏",
          description: `思维导图「${updatedMindMap.title}」${
            updatedMindMap.starred ? "已添加到收藏" : "已从收藏中移除"
          }`,
        });
      }
    } else if (item.type === "学习资料") {
      const updatedMaterial = userFilesService.toggleStarred(item.id);
      if (updatedMaterial) {
        setRecentContent((prev) =>
          prev.map((content) =>
            content.id === item.id && content.type === "学习资料"
              ? { ...content, starred: updatedMaterial.starred }
              : content
          )
        );

        toast({
          title: updatedMaterial.starred ? "已收藏" : "已取消收藏",
          description: `学习资料「${updatedMaterial.title}」${
            updatedMaterial.starred ? "已添加到收藏" : "已从收藏中移除"
          }`,
        });
      }
    }
  };

  const createMindMap = () => {
    navigate("/mindmap-editor/new");
  };

  const uploadMaterial = () => {
    navigate("/upload");
  };

  const renderContentItems = (items: ContentItem[]) => {
    return items.map((item) => (
      <motion.div
        key={`${item.type}-${item.id}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => {
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
                <Star
                  className={`h-4 w-4 ${
                    item.starred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ));
  };

  const stats = [
    {
      title: "思维导图",
      icon: Brain,
      value: String(mindmapCount),
      description: "个人创建",
      color: "bg-blue-500",
      onClick: () => navigate("/mindmaps"),
    },
    {
      title: "学习资料",
      icon: FileText,
      value: String(materialCount),
      description: "已上传",
      color: "bg-emerald-500",
      onClick: () => navigate("/search"),
    },
    {
      title: "收藏内容",
      icon: Star,
      value: String(starredCount),
      description: "思维导图和资料",
      color: "bg-amber-500",
      onClick: () => navigate("/search?filter=starred"),
    },
    {
      title: "讨论参与",
      icon: MessageSquare,
      value: "24",
      description: "话题和回复",
      color: "bg-purple-500",
      onClick: () => navigate("/discussion"),
    },
  ];

  const starredContent = recentContent.filter((item) => item.starred);

  useEffect(() => {
    if (user) {
      const starredMindmaps = mindmapService.getStarred().map((item) => ({
        ...item,
        type: "mindmap",
      }));

      const starredMaterials = loadUserFavorites(user.id).map((item) => ({
        ...item,
        type: "material",
      }));

      setStarredItems(
        [...starredMindmaps, ...starredMaterials].sort((a, b) => {
          const timeA = a.favoriteTime || a.updatedAt;
          const timeB = b.favoriteTime || b.updatedAt;
          return new Date(timeB).getTime() - new Date(timeA).getTime();
        })
      );
    }
  }, [user]);

  const renderStarredItem = (item) => {
    const isMindmap = item.type === "mindmap";
    const formattedDate = isMindmap
      ? new Date(item.updatedAt).toLocaleDateString()
      : new Date(item.favoriteTime || item.uploadTime).toLocaleDateString();

    return (
      <Card key={`${item.type}-${item.id}`} className="overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription className="text-xs">
                {isMindmap ? "思维导图" : "学习资料"}
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
            {item.tags &&
              item.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
          </div>
          <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {isMindmap ? "更新于：" : "收藏于："} {formattedDate}
            </div>

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

  const handleViewItem = (item) => {
    if (item.type === "mindmap") {
      navigate(`/mindmap-view/${item.id}`);
    } else {
      navigate(`/material/${item.id}`);
    }
  };

  const handleToggleFavorite = (item) => {
    try {
      if (item.type === "mindmap") {
        const updatedMindMap = mindmapService.toggleStarred(item.id);

        setStarredItems((prevItems) =>
          prevItems.filter((i) => !(i.type === "mindmap" && i.id === item.id))
        );

        toast({
          title: "已取消收藏",
        });
      } else {
        const updatedMaterial = userFilesService.removeFavorite(
          item.id,
          user?.id
        );

        setStarredItems((prevItems) =>
          prevItems.filter((i) => !(i.type === "material" && i.id === item.id))
        );

        toast({
          title: "已取消收藏",
        });
      }
    } catch (error) {
      console.error("收藏操作出错:", error);
      toast({
        title: "操作失败",
        description: "收藏操作失败，请稍后再试",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative"
      >
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-primary"
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
        <div className="flex gap-3 relative z-10">
          <div className="relative">
            <Tabs defaultValue={activeSection} onValueChange={(value) => setActiveSection(value as "overview" | "usage")} className="w-auto">
              <TabsList className="grid w-[250px] grid-cols-2">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="usage">使用报告</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="relative group">
            <Button 
              variant="outline" 
              className="gap-2 btn-effect overflow-hidden relative group-hover:border-primary/50 transition-all duration-300" 
              onClick={createMindMap}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-primary transition-opacity duration-300"></div>
              <Plus className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              创建思维导图
            </Button>
          </div>
          <div className="relative">
            <Button 
              className="gap-2 btn-effect relative overflow-hidden bg-gradient-primary hover:shadow-lg hover:shadow-primary/20 border-0"
              onClick={uploadMaterial}
            >
              <FileText className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              上传学习资料
            </Button>
          </div>
          <div className="absolute -z-10 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl -top-10 -right-10 animate-pulse"></div>
        </div>
      </motion.div>

      {activeSection === "overview" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => {
                  setActiveDataCard(activeDataCard === index ? null : index);
                  stat.onClick();
                }}
                className="cursor-pointer"
              >
                <Card className={`glass-card data-card overflow-hidden ${activeDataCard === index ? 'ring-2 ring-primary/50' : ''}`}>
                  <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start relative z-10">
                      <div className="data-preview">
                        <p className="text-sm font-medium tracking-wide">{stat.title}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <p className="text-3xl font-bold">{stat.value}</p>
                          <div className="text-xs text-primary/80 font-medium px-1.5 py-0.5 rounded-full bg-primary/10">
                            {index === 0 ? '+2' : index === 1 ? '+5' : index === 2 ? '+3' : '+8'} 今日
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                      </div>
                      <div className="relative">
                        <svg className="progress-ring w-12 h-12" viewBox="0 0 40 40" data-value={index * 25}>
                          <circle 
                            className="progress" 
                            cx="20" 
                            cy="20" 
                            r="15" 
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="94.2"
                            strokeDashoffset={94.2 - (94.2 * (index + 1) * 20) / 100}
                            style={{ color: `var(--${stat.color.replace('bg-', '')})` }}
                          />
                          <circle 
                            cx="20" 
                            cy="20" 
                            r="15" 
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeOpacity="0.2"
                            style={{ color: `var(--${stat.color.replace('bg-', '')})` }}
                          />
                        </svg>
                        <div className={`absolute inset-0 flex items-center justify-center ${stat.color} text-white rounded-full scale-75`}>
                          <stat.icon className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent flow-highlight"></div>
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
              className="lg:col-span-2 space-y-4 relative"
            >
              <Card className="glass-card overflow-hidden relative">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-primary/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-semibold tracking-tight">最近内容</CardTitle>
                      <CardDescription>您最近使用的思维导图和学习资料</CardDescription>
                    </div>
                    <Tabs defaultValue={activeTab} className="w-auto">
                      <TabsList className="grid w-full grid-cols-3 h-8">
                        <TabsTrigger value="recent" onClick={() => setActiveTab('recent')} className="text-xs px-2">最近</TabsTrigger>
                        <TabsTrigger value="mindmaps" onClick={() => setActiveTab('mindmaps')} className="text-xs px-2">思维导图</TabsTrigger>
                        <TabsTrigger value="materials" onClick={() => setActiveTab('materials')} className="text-xs px-2">学习资料</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  {recentContent.length > 0 ? (
                    renderContentItems(recentContent)
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <FileText className="h-16 w-16 mx-auto opacity-20 absolute inset-0" />
                        <div className="absolute inset-0 bg-blue-500/5 animate-pulse rounded-full blur-xl"></div>
                      </div>
                      <p>暂无最近内容</p>
                      <p className="text-sm mt-1">尝试创建思维导图或上传学习资料</p>
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-2 btn-effect" 
                          onClick={createMindMap}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          立即创建
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10 border-t border-primary/10">
                  <Button 
                    variant="ghost" 
                    className="w-full gap-1 btn-effect"
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
              <Card className="glass-card overflow-hidden relative">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-primary/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-semibold tracking-tight">收藏内容</CardTitle>
                      <CardDescription>您标记为收藏的内容</CardDescription>
                    </div>
                    {starredItems.length > 0 && (
                      <Button variant="link" size="sm" className="text-xs h-6 px-0 btn-effect">
                        查看全部 <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  {starredItems.length > 0 ? (
                    <div className="grid gap-3">
                      {starredItems.slice(0, 3).map(renderStarredItem)}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="relative w-20 h-20 mx-auto mb-3">
                        <Star className="h-16 w-16 mx-auto stroke-muted-foreground/50 absolute inset-0" />
                        <div className="absolute inset-0 bg-amber-500/5 animate-pulse rounded-full blur-xl"></div>
                      </div>
                      <p>没有收藏的内容</p>
                      <p className="text-sm mt-1">点击星标图标添加收藏</p>
                    </div>
                  )}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500/5 rounded-full blur-xl"></div>
                </CardContent>
              </Card>

              <Card className="glass-card overflow-hidden relative">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-primary/10">
                  <CardTitle className="text-xl font-semibold tracking-tight">快速访问</CardTitle>
                  <CardDescription>常用功能入口</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 relative">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 btn-effect group"
                    onClick={() => navigate('/mindmaps')}
                  >
                    <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-300">
                      <Brain className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="font-medium">我的思维导图</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 btn-effect group"
                    onClick={() => navigate('/search')}
                  >
                    <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="font-medium">资料搜索</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 btn-effect group"
                    onClick={() => navigate('/profile')}
                  >
                    <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-300">
                      <UserCircle2 className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="font-medium">个人中心</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 btn-effect group"
                    onClick={() => navigate('/discussion')}
                  >
                    <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="font-medium">讨论交流</span>
                  </Button>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      ) : (
        <UsageReport />
      )}
    </div>
  );
};

export default Dashboard;
