import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, MoreVertical, Calendar, Brain, Edit, Trash2, Star, Share2, Users, Lock, Globe, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// 思维导图接口
interface MindMap {
  id: number;
  title: string;
  updatedAt: string;
  starred: boolean;
  shared?: boolean;
  creator?: string;
  description?: string;
  tags?: string[];
}

// 共享思维导图接口
interface SharedMindMap {
  id: number;
  title: string;
  creator: string;
  createdAt: string;
  likes: number;
  views: number;
  tags: string[];
}

const MyMindMaps = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mindMaps, setMindMaps] = useState<MindMap[]>([
    { id: 1, title: '期末复习计划', updatedAt: '2023-06-10', starred: true, shared: true, tags: ['学习', '考试'] },
    { id: 2, title: '项目开发思路', updatedAt: '2023-06-08', starred: false, shared: false, tags: ['编程', '项目管理'] },
    { id: 3, title: '数据结构与算法复习', updatedAt: '2023-06-05', starred: true, shared: true, tags: ['计算机科学', '算法'] },
    { id: 4, title: '产品设计灵感', updatedAt: '2023-06-01', starred: false, shared: false, tags: ['设计', '创意'] },
    { id: 5, title: '计算机网络概念图', updatedAt: '2023-05-20', starred: true, shared: true, tags: ['计算机科学', '网络'] },
    { id: 6, title: '个人职业规划', updatedAt: '2023-05-15', starred: false, shared: false, tags: ['职业', '规划'] },
  ]);
  
  const [sharedMindMaps, setSharedMindMaps] = useState<SharedMindMap[]>([
    { id: 101, title: '机器学习概念图谱', creator: '张三', createdAt: '2023-06-12', likes: 45, views: 128, tags: ['AI', '机器学习'] },
    { id: 102, title: '前端开发技术栈', creator: '李四', createdAt: '2023-06-09', likes: 32, views: 96, tags: ['前端', 'Web开发'] },
    { id: 103, title: '英语学习路线图', creator: '王五', createdAt: '2023-06-07', likes: 28, views: 87, tags: ['语言学习', '英语'] },
    { id: 104, title: '高等数学知识梳理', creator: '赵六', createdAt: '2023-06-04', likes: 39, views: 112, tags: ['数学', '学习方法'] },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newMindMapName, setNewMindMapName] = useState('');
  const [newMindMapDescription, setNewMindMapDescription] = useState('');
  const [newMindMapTags, setNewMindMapTags] = useState('');
  const [privacyOption, setPrivacyOption] = useState('private');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedMindMap, setSelectedMindMap] = useState<MindMap | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  
  useEffect(() => {
    // 检查是否需要打开创建对话框（从仪表盘跳转过来）
    if (location.state && location.state.openCreateDialog) {
      setCreateDialogOpen(true);
      // 清除状态，防止再次渲染时重新打开对话框
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  
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
    
    const newMindMap: MindMap = {
      id: Math.max(...mindMaps.map(m => m.id), 0) + 1,
      title: newMindMapName,
      updatedAt: new Date().toISOString().split('T')[0],
      starred: false,
      shared: privacyOption === 'public',
      description: newMindMapDescription,
      tags: newMindMapTags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    setMindMaps([newMindMap, ...mindMaps]);
    setNewMindMapName('');
    setNewMindMapDescription('');
    setNewMindMapTags('');
    setPrivacyOption('private');
    setCreateDialogOpen(false);
    
    // 模拟跳转到思维导图编辑页面
    console.log(`创建新思维导图: ${newMindMapName}，准备跳转到编辑页面`);
    
    // 在实际应用中，这里应该导航到思维导图编辑器
    // navigate(`/mindmap-editor/${newMindMap.id}`);
  };
  
  const toggleStarred = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setMindMaps(
      mindMaps.map(mindMap => 
        mindMap.id === id 
          ? { ...mindMap, starred: !mindMap.starred } 
          : mindMap
      )
    );
  };
  
  const toggleShared = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setMindMaps(
      mindMaps.map(mindMap => 
        mindMap.id === id 
          ? { ...mindMap, shared: !mindMap.shared } 
          : mindMap
      )
    );
  };
  
  const handleDeleteMindMap = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (window.confirm('确定要删除这个思维导图吗？此操作不可撤销。')) {
      setMindMaps(mindMaps.filter(mindMap => mindMap.id !== id));
    }
  };
  
  const handleShareMindMap = (mindMap: MindMap, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedMindMap(mindMap);
    setShareDialogOpen(true);
  };
  
  const handleEditMindMap = (id: number) => {
    console.log(`编辑思维导图: ${id}`);
    // 在实际应用中，这里应该导航到思维导图编辑器
    // navigate(`/mindmap-editor/${id}`);
  };
  
  const handleViewSharedMindMap = (id: number) => {
    console.log(`查看共享思维导图: ${id}`);
    // 在实际应用中，这里应该导航到思维导图查看页面
    // navigate(`/shared-mindmap/${id}`);
  };
  
  const filteredMindMaps = mindMaps.filter(mindMap => 
    mindMap.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredByTabMindMaps = currentTab === 'all' 
    ? filteredMindMaps 
    : currentTab === 'recent' 
      ? [...filteredMindMaps].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5)
      : filteredMindMaps.filter(mindMap => mindMap.starred);
  
  const filteredSharedMindMaps = sharedMindMaps.filter(
    mindMap => mindMap.title.toLowerCase().includes(searchQuery.toLowerCase())
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
