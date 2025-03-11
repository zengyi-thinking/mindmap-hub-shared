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
  Search
} from 'lucide-react';

// Define proper interface for content items
interface ContentItem {
  id: number;
  title: string;
  type: string;
  date: string;
  starred: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recent');
  
  // 模拟数据 - 在实际应用中，这些数据应该从API或状态管理中获取
  const recentContent: ContentItem[] = [
    {
      id: 1,
      title: "数据结构与算法基础",
      type: "思维导图",
      date: "2023-06-15",
      starred: true
    },
    {
      id: 2,
      title: "计算机网络知识框架",
      type: "学习资料",
      date: "2023-06-10",
      starred: false
    },
    {
      id: 3,
      title: "操作系统原理导图",
      type: "思维导图",
      date: "2023-06-05",
      starred: true
    }
  ];
  
  const starredContent = recentContent.filter(item => item.starred);

  // 功能：导航到不同页面
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  // 功能：切换收藏状态
  const toggleStarred = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发父元素的点击事件
    // 在实际应用中，这里应该调用API来更新收藏状态
    console.log(`切换收藏状态：${id}`);
  };

  // 功能：打开创建思维导图对话框或页面
  const createMindMap = () => {
    navigate('/mindmaps', { state: { openCreateDialog: true } });
  };

  // 功能：上传学习资料
  const uploadMaterial = () => {
    navigate('/upload');
  };
  
  // 功能：渲染内容列表
  const renderContentItems = (items: ContentItem[]) => {
    return items.map(item => (
      <motion.div
        key={item.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => {
          // 根据内容类型导航到不同页面
          if (item.type === "思维导图") {
            navigateTo('/mindmaps');
          } else if (item.type === "学习资料") {
            navigateTo('/search');
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
                onClick={(e) => toggleStarred(item.id, e)} 
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
      value: "12",
      description: "个人创建",
      color: "bg-blue-500"
    },
    {
      title: "学习资料",
      icon: FileText,
      value: "36",
      description: "已上传",
      color: "bg-emerald-500"
    },
    {
      title: "收藏内容",
      icon: Star,
      value: "18",
      description: "思维导图和资料",
      color: "bg-amber-500"
    },
    {
      title: "讨论参与",
      icon: MessageSquare,
      value: "24",
      description: "话题和回复",
      color: "bg-purple-500"
    }
  ];

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
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            创建思维导图
          </Button>
          <Button className="gap-2">
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
          >
            <Card>
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
              {renderContentItems(recentContent)}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full gap-1">
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
              <div className="flex justify-between items-center">
                <CardTitle>收藏内容</CardTitle>
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
              <CardDescription>您标记为收藏的内容</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {starredContent.length > 0 ? (
                renderContentItems(starredContent)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto opacity-20 mb-3" />
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
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Brain className="h-5 w-5 text-blue-500" />
                我的思维导图
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                资料搜索
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <UserCircle2 className="h-5 w-5 text-purple-500" />
                个人中心
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
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
