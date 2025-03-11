
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Brain, Clock, FileText, Star, Plus, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const recentItems = [
    { id: 1, title: '期末复习计划', type: 'mindmap', date: '2023-06-10', starred: true },
    { id: 2, title: '项目开发思路', type: 'mindmap', date: '2023-06-08', starred: false },
    { id: 3, title: '电子工程学习资料', type: 'material', date: '2023-06-05', starred: true },
    { id: 4, title: '软件工程讨论', type: 'discussion', date: '2023-06-03', starred: false },
  ];

  const favoriteItems = [
    { id: 1, title: '期末复习计划', type: 'mindmap', date: '2023-06-10', starred: true },
    { id: 3, title: '电子工程学习资料', type: 'material', date: '2023-06-05', starred: true },
    { id: 5, title: '计算机网络概念图', type: 'mindmap', date: '2023-05-20', starred: true },
  ];

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'mindmap':
        return <Brain className="h-4 w-4" />;
      case 'material':
        return <FileText className="h-4 w-4" />;
      case 'discussion':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
            查看您的最近活动和收藏的内容
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            创建思维导图
          </Button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="col-span-1 glass-card subtle-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              思维导图
            </CardTitle>
            <CardDescription>创建和管理您的思维导图</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">已创建的导图</p>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                查看全部
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 glass-card subtle-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              学习资料
            </CardTitle>
            <CardDescription>上传和查看学习资料</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">已上传的资料</p>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                查看全部
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 glass-card subtle-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              讨论话题
            </CardTitle>
            <CardDescription>参与讨论与交流</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">活跃话题</p>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                查看全部
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
      >
        <Tabs defaultValue="recent">
          <TabsList className="mb-4">
            <TabsTrigger value="recent">最近访问</TabsTrigger>
            <TabsTrigger value="favorite">收藏</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>最近访问的内容</CardTitle>
                <CardDescription>您最近查看或编辑的内容</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.ul 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  {recentItems.map((item) => (
                    <motion.li 
                      key={item.id}
                      variants={item}
                      className="p-3 rounded-lg border hover:bg-accent/50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        {item.starred ? (
                          <Star className="h-4 w-4 fill-primary text-primary" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorite">
            <Card>
              <CardHeader>
                <CardTitle>收藏内容</CardTitle>
                <CardDescription>您收藏的内容</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.ul 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  {favoriteItems.map((item) => (
                    <motion.li 
                      key={item.id}
                      variants={item}
                      className="p-3 rounded-lg border hover:bg-accent/50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                      </Button>
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Dashboard;
