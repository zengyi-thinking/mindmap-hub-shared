import React, { useState, useEffect } from 'react';
import styles from './MyMindMaps.module.css';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, MoreVertical, Calendar, Brain, Edit, Trash2, Star, Share2, Users, Lock, Globe, FileText, Save } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mindmapService } from '@/lib/mindmapStorage';
import { useToast } from '@/components/ui/use-toast';

// 使用从types导入的接口
import { MindMap, SharedMindMap } from '@/types/mindmap';

const MyMindMaps = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const { toast } = useToast();
  
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
    // 从localStorage加载思维导图数据
    const loadMindMaps = () => {
      const storedMindMaps = mindmapService.getAll();
      setMindMaps(storedMindMaps);
    };
    
    loadMindMaps();
    
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
    
    const newMindMapData = {
      title: newMindMapName,
      updatedAt: new Date().toISOString().split('T')[0],
      starred: false,
      shared: privacyOption === 'public',
      description: newMindMapDescription,
      tags: newMindMapTags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    // 使用mindmapService添加新思维导图
    const newMindMap = mindmapService.add(newMindMapData);
    
    // 更新状态
    setMindMaps([newMindMap, ...mindMaps]);
    setNewMindMapName('');
    setNewMindMapDescription('');
    setNewMindMapTags('');
    setPrivacyOption('private');
    setCreateDialogOpen(false);
    
    // 显示成功提示
    toast({
      title: "创建成功",
      description: `思维导图「${newMindMap.title}」已创建`,
    });
    
    // 在实际应用中，这里应该导航到思维导图编辑器
    // navigate(`/mindmap-editor/${newMindMap.id}`);
  };

  
  const toggleStarred = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // 使用mindmapService切换收藏状态
    const updatedMindMap = mindmapService.toggleStarred(id);
    
    if (updatedMindMap) {
      setMindMaps(
        mindMaps.map(mindMap => 
          mindMap.id === id ? updatedMindMap : mindMap
        )
      );
      
      toast({
        title: updatedMindMap.starred ? "已收藏" : "已取消收藏",
        description: `思维导图「${updatedMindMap.title}」${updatedMindMap.starred ? "已添加到收藏" : "已从收藏中移除"}`,
      });
    }
  };
  
  const toggleShared = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // 使用mindmapService切换共享状态
    const updatedMindMap = mindmapService.toggleShared(id);
    
    if (updatedMindMap) {
      setMindMaps(
        mindMaps.map(mindMap => 
          mindMap.id === id ? updatedMindMap : mindMap
        )
      );
      
      toast({
        title: updatedMindMap.shared ? "已共享" : "已取消共享",
        description: `思维导图「${updatedMindMap.title}」${updatedMindMap.shared ? "现在可以被其他用户查看" : "已设为私密"}`
      });
    }
  };

  
  const handleDeleteMindMap = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (window.confirm('确定要删除这个思维导图吗？此操作不可撤销。')) {
      // 使用mindmapService删除思维导图
      const success = mindmapService.delete(id);
      
      if (success) {
        setMindMaps(mindMaps.filter(mindMap => mindMap.id !== id));
        
        toast({
          title: "删除成功",
          description: "思维导图已永久删除",
        });
      }
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
            className={`text-3xl font-bold tracking-tight ${styles.mainTitle}`}
          >
            我的思维导图
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className={`text-muted-foreground ${styles.subTitle}`}
          >
            创建、编辑和整理您的思维导图
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 w-full md:w-auto"
        >
          <div className={`relative w-full md:w-64 ${styles.searchFocus}`}>
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
              <Button className={`flex items-center gap-2 ${styles.createButton} ${styles.buttonRadius}`}>
                <Plus className="h-4 w-4" />
                <span className={styles.buttonText}>创建导图</span>
              </Button>
            </DialogTrigger>
            <DialogContent className={`${styles.cardRadius} ${styles.cardShadow}`}>
              <DialogHeader className={styles.navGradient}>
                <DialogTitle className={styles.mainTitle}>创建新的思维导图</DialogTitle>
                <DialogDescription>
                  请输入新思维导图的名称和描述。创建后您可以立即开始编辑。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className={styles.mainTitle}>思维导图名称</Label>
                  <Input
                    id="name"
                    placeholder="例如：项目计划、学习笔记..."
                    value={newMindMapName}
                    onChange={(e) => setNewMindMapName(e.target.value)}
                    className={styles.hoverTransition}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className={styles.mainTitle}>描述</Label>
                  <Textarea
                    id="description"
                    placeholder="简要描述思维导图的内容和用途..."
                    value={newMindMapDescription}
                    onChange={(e) => setNewMindMapDescription(e.target.value)}
                    className={styles.hoverTransition}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags" className={styles.mainTitle}>标签</Label>
                  <Input
                    id="tags"
                    placeholder="使用逗号分隔多个标签，如：学习,笔记,计划"
                    value={newMindMapTags}
                    onChange={(e) => setNewMindMapTags(e.target.value)}
                    className={styles.hoverTransition}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="privacy" className={styles.mainTitle}>隐私设置</Label>
                  <Select value={privacyOption} onValueChange={setPrivacyOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择隐私设置" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className={`h-4 w-4 ${styles.lineIcon}`} />
                          <span>私密</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className={`h-4 w-4 ${styles.lineIcon}`} />
                          <span>公开</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateMindMap} className={`${styles.createButton} ${styles.buttonRadius}`}>
                  <Save className="h-4 w-4 mr-2" />
                  <span className={styles.buttonText}>创建</span>
                </Button>
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
            <TabsTrigger value="all" className={styles.tabUnderline}>全部</TabsTrigger>
            <TabsTrigger value="recent" className={styles.tabUnderline}>最近</TabsTrigger>
            <TabsTrigger value="starred" className={styles.tabUnderline}>收藏</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${styles.contentGrid}`}
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
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${styles.contentGrid}`}
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
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${styles.contentGrid}`}
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
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className={styles.cardEntrance}>
      <Card className={`overflow-hidden h-full ${styles.mindmapCard} ${styles.cardShadow}`}>
        <CardHeader className={`p-4 pb-0 flex flex-row items-start justify-between space-y-0 ${styles.cardHeader}`}>
          <CardTitle className="text-lg font-semibold truncate">{mindMap.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className={`h-4 w-4 ${styles.lineIcon}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onToggleStar}>
                {mindMap.starred ? (
                  <>
                    <Star className={`mr-2 h-4 w-4 fill-primary text-primary ${styles.fillIcon}`} />
                    取消收藏
                  </>
                ) : (
                  <>
                    <Star className={`mr-2 h-4 w-4 ${styles.lineIcon}`} />
                    收藏
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className={`mr-2 h-4 w-4 ${styles.lineIcon}`} />
                分享
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className={`mr-2 h-4 w-4 ${styles.lineIcon}`} />
                重命名
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className={`mr-2 h-4 w-4 ${styles.lineIcon}`} />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 pt-3">
          <div className={`w-full h-32 rounded-md flex items-center justify-center mb-2 ${styles.mindmapPreview}`}>
            <Brain className={`h-12 w-12 text-primary/60 ${styles.mindmapIcon}`} />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className={`mr-1 h-4 w-4 ${styles.lineIcon}`} />
            {mindMap.updatedAt}
          </div>
          <Button size="sm" className={styles.editButton}>编辑</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MyMindMaps;
