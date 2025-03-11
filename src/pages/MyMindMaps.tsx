
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, MoreVertical, Calendar, Brain, Edit, Trash2, Star, Share2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const MyMindMaps = () => {
  const [mindMaps, setMindMaps] = useState([
    { id: 1, title: '期末复习计划', updatedAt: '2023-06-10', starred: true },
    { id: 2, title: '项目开发思路', updatedAt: '2023-06-08', starred: false },
    { id: 3, title: '数据结构与算法复习', updatedAt: '2023-06-05', starred: true },
    { id: 4, title: '产品设计灵感', updatedAt: '2023-06-01', starred: false },
    { id: 5, title: '计算机网络概念图', updatedAt: '2023-05-20', starred: true },
    { id: 6, title: '个人职业规划', updatedAt: '2023-05-15', starred: false },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newMindMapName, setNewMindMapName] = useState('');
  
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
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCreateMindMap = () => {
    if (!newMindMapName.trim()) return;
    
    const newMindMap = {
      id: mindMaps.length + 1,
      title: newMindMapName,
      updatedAt: new Date().toISOString().split('T')[0],
      starred: false
    };
    
    setMindMaps([newMindMap, ...mindMaps]);
    setNewMindMapName('');
  };
  
  const toggleStarred = (id: number) => {
    setMindMaps(
      mindMaps.map(mindMap => 
        mindMap.id === id 
          ? { ...mindMap, starred: !mindMap.starred } 
          : mindMap
      )
    );
  };
  
  const filteredMindMaps = mindMaps.filter(mindMap => 
    mindMap.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const starredMindMaps = filteredMindMaps.filter(mindMap => mindMap.starred);
  const recentMindMaps = filteredMindMaps.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight"
          >
            我的思维导图
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="text-muted-foreground"
          >
            创建、编辑和整理您的思维导图
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 w-full md:w-auto"
        >
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索思维导图..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                创建导图
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新的思维导图</DialogTitle>
                <DialogDescription>
                  请输入新思维导图的名称。创建后您可以立即开始编辑。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">思维导图名称</Label>
                  <Input
                    id="name"
                    placeholder="例如：项目计划、学习笔记..."
                    value={newMindMapName}
                    onChange={(e) => setNewMindMapName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateMindMap}>创建</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
      >
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="recent">最近</TabsTrigger>
            <TabsTrigger value="starred">收藏</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMindMaps.map((mindMap) => (
                <MindMapCard 
                  key={mindMap.id}
                  mindMap={mindMap}
                  onToggleStar={() => toggleStarred(mindMap.id)}
                />
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="recent">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recentMindMaps.slice(0, 6).map((mindMap) => (
                <MindMapCard 
                  key={mindMap.id}
                  mindMap={mindMap}
                  onToggleStar={() => toggleStarred(mindMap.id)}
                />
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="starred">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {starredMindMaps.map((mindMap) => (
                <MindMapCard 
                  key={mindMap.id}
                  mindMap={mindMap}
                  onToggleStar={() => toggleStarred(mindMap.id)}
                />
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

interface MindMapCardProps {
  mindMap: {
    id: number;
    title: string;
    updatedAt: string;
    starred: boolean;
  };
  onToggleStar: () => void;
}

const MindMapCard: React.FC<MindMapCardProps> = ({ mindMap, onToggleStar }) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <Card className="overflow-hidden h-full glass-card subtle-hover border transition-all duration-300">
        <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
          <CardTitle className="text-lg font-semibold truncate">{mindMap.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onToggleStar}>
                {mindMap.starred ? (
                  <>
                    <Star className="mr-2 h-4 w-4 fill-primary text-primary" />
                    取消收藏
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    收藏
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                分享
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                重命名
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 pt-3">
          <div className="w-full h-32 rounded-md bg-primary/10 flex items-center justify-center mb-2">
            <Brain className="h-12 w-12 text-primary/60" />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {mindMap.updatedAt}
          </div>
          <Button size="sm">编辑</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MyMindMaps;
