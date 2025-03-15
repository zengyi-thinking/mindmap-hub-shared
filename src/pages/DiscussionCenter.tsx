import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './DiscussionCenter.module.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Heart, 
  PlusCircle, 
  Send, 
  ThumbsUp, 
  MessageCircle, 
  Clock, 
  Tag,
  Filter,
  BookOpen,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { topicsService, commentsService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

interface UIDiscussionTopic {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  tags: string[];
  commentsCount: number;
  likesCount: number;
  followed: boolean;
  comments?: UIComment[];
  views?: number;
}

interface UIComment {
  id: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
  liked: boolean;
}

interface MaterialItem {
  id: number;
  title: string;
  description: string;
  authorName: string;
  authorAvatar: string;
  uploadedAt: string;
  tags: string[];
  likes: number;
  downloads: number;
  commentsCount: number;
  liked: boolean;
}

// 获取用户头像的辅助函数
const getUserAvatar = (username: string) => {
  // 尝试从localStorage获取用户头像
  const userProfiles = JSON.parse(localStorage.getItem('user_profiles') || '{}');
  if (userProfiles[username] && userProfiles[username].avatar) {
    return userProfiles[username].avatar;
  }
  // 返回默认头像或生成一个基于用户名的颜色头像
  return '';
};

const DiscussionCenter = () => {
  const [activeTab, setActiveTab] = useState('topics');
  const [topics, setTopics] = useState<UIDiscussionTopic[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const { user } = useAuth();
  
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicTags, setNewTopicTags] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<UIDiscussionTopic | null>(null);
  const [newComment, setNewComment] = useState('');
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const { toast } = useToast();
  
  // 在组件挂载时从localStorage加载数据
  useEffect(() => {
    loadData();
    
    // 添加事件监听器，在页面卸载前保存数据
    window.addEventListener('beforeunload', saveAllData);
    
    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('beforeunload', saveAllData);
    };
  }, []);
  
  // 保存所有数据到localStorage
  const saveAllData = () => {
    // 保存当前状态的话题和评论
    topics.forEach(topic => {
      topicsService.update(topic.id, {
        title: topic.title,
        content: topic.content,
        author: topic.authorName,
        tags: topic.tags,
        likes: topic.likesCount,
        createdAt: topic.createdAt
      });
    });
    
    // 如果有选中的话题，保存其评论
    if (selectedTopic && selectedTopic.comments) {
      selectedTopic.comments.forEach(comment => {
        commentsService.update(comment.id, {
          topicId: selectedTopic.id,
          content: comment.content,
          author: comment.authorName,
          authorId: user?.id || 1,
          createdAt: comment.createdAt,
          likes: comment.likesCount
        });
      });
    }
    
    // 保存材料数据
    localStorage.setItem('materials_data', JSON.stringify(materials));
  };
  
  // 加载数据
  const loadData = () => {
    // 加载讨论主题
    const storedTopics = topicsService.getAll();
    if (storedTopics.length > 0) {
      // 转换存储的主题格式以匹配UI需要的格式
      const formattedTopics = storedTopics.map(topic => {
        // 获取该主题的评论
        const topicComments = commentsService.getByTopicId(topic.id);
        
        // 获取用户的点赞状态
        const userLikedTopics = JSON.parse(localStorage.getItem('user_liked_topics') || '[]');
        const isFollowed = userLikedTopics.includes(topic.id);
        
        return {
          ...topic,
          authorAvatar: getUserAvatar(topic.author),
          authorName: topic.author,
          commentsCount: topicComments.length,
          likesCount: topic.likes,
          followed: isFollowed,
          comments: topicComments.map(comment => {
            // 获取用户对评论的点赞状态
            const userLikedComments = JSON.parse(localStorage.getItem('user_liked_comments') || '[]');
            const isLiked = userLikedComments.includes(comment.id);
            
            return {
              id: comment.id,
              authorName: comment.author,
              authorAvatar: getUserAvatar(comment.author),
              content: comment.content,
              createdAt: comment.createdAt,
              likesCount: comment.likes,
              liked: isLiked
            };
          })
        };
      });
      
      setTopics(formattedTopics);
    } else {
      // 如果没有存储的主题，使用示例数据并保存到localStorage
      const initialTopics = [
        {
          id: 1,
          title: '如何有效利用思维导图进行期末复习？',
          content: '最近期末考试临近，想听听大家使用思维导图复习的经验和方法，有什么好的工具或技巧推荐吗？',
          authorName: '学习达人',
          authorAvatar: '',
          createdAt: '2023-06-12',
          tags: ['学习方法', '思维导图', '期末复习'],
          commentsCount: 2,
          likesCount: 24,
          followed: true
        },
        {
          id: 2,
          title: '数据结构学习资料分享',
          content: '想和大家分享一些我收集的数据结构学习资料，包括了常见数据结构的实现和应用案例，希望对大家有帮助。',
          authorName: '编程爱好者',
          authorAvatar: '',
          createdAt: '2023-06-10',
          tags: ['数据结构', '编程', '学习资料'],
          commentsCount: 0,
          likesCount: 36,
          followed: false
        },
        {
          id: 3,
          title: '关于创建计算机网络知识体系的讨论',
          content: '我正在尝试建立一个完整的计算机网络知识体系，想听听大家的建议，如何组织这些知识点才能更加清晰？',
          authorName: '网络爱好者',
          authorAvatar: '',
          createdAt: '2023-06-08',
          tags: ['计算机网络', '知识体系', '学习方法'],
          commentsCount: 0,
          likesCount: 18,
          followed: false
        }
      ];
      
      // 保存到localStorage
      initialTopics.forEach(topic => topicsService.add({
        title: topic.title,
        content: topic.content,
        author: topic.authorName,
        authorId: user?.id || 0,
        views: 0,
        likes: topic.likesCount,
        tags: topic.tags,
        createdAt: topic.createdAt
      }));
      
      // 同时保存第一个主题的评论
      if (initialTopics[0]) {
        const initialComments = [
          {
            topicId: 1,
            content: '我推荐使用XMind进行复习，可以先梳理知识框架，然后逐步细化知识点，最后添加具体例题。',
            author: '思维导图专家',
            authorId: 1,
            createdAt: '2023-06-12 14:30',
            likes: 5
          },
          {
            topicId: 1,
            content: '我发现将课程内容按照"概念-原理-应用-例题"的结构来组织思维导图特别有效。',
            author: '高分学霸',
            authorId: 2,
            createdAt: '2023-06-12 15:42',
            likes: 7
          }
        ];
        
        initialComments.forEach(comment => commentsService.add(comment));
      }
      
      setTopics(initialTopics);
    }
    
    // 加载材料数据
    const storedMaterials = localStorage.getItem('materials_data');
    if (storedMaterials) {
      setMaterials(JSON.parse(storedMaterials));
    } else {
      // 如果没有存储的材料数据，使用示例数据
      const initialMaterials = [
        {
          id: 1,
          title: '计算机网络思维导图',
          description: '涵盖计算机网络各层协议的完整思维导图，包括物理层、数据链路层、网络层、传输层和应用层。',
          authorName: '网络专家',
          authorAvatar: '',
          uploadedAt: '2023-06-15',
          tags: ['计算机网络', '思维导图', '学习资料'],
          likes: 42,
          downloads: 128,
          commentsCount: 5,
          liked: false
        },
        {
          id: 2,
          title: '数据结构与算法总结',
          description: '整理了常见数据结构和算法的知识点，包括时间复杂度分析、实现方式和应用场景。',
          authorName: '算法爱好者',
          authorAvatar: '',
          uploadedAt: '2023-06-10',
          tags: ['数据结构', '算法', '编程'],
          likes: 36,
          downloads: 95,
          commentsCount: 3,
          liked: false
        },
        {
          id: 3,
          title: '高等数学公式大全',
          description: '收集了高等数学中常用的公式和定理，按照章节整理，方便查阅和记忆。',
          authorName: '数学达人',
          authorAvatar: '',
          uploadedAt: '2023-06-05',
          tags: ['高等数学', '公式', '学习资料'],
          likes: 28,
          downloads: 76,
          commentsCount: 2,
          liked: false
        }
      ];
      
      setMaterials(initialMaterials);
      localStorage.setItem('materials_data', JSON.stringify(initialMaterials));
    }
  };

  // 初始化评论数据
  const initializeComments = () => {
    if (commentsService.getAll().length === 0) {
      const initialComments = [
        {
          topicId: 1,
          content: '这个思维导图制作软件真的很好用，推荐给大家！',
          author: '思维导图爱好者',
          authorId: 1,
          createdAt: '2023-06-15 10:30',
          likes: 12
        },
        {
          topicId: 1,
          content: '"的结构来组织思维导图特别有效。',
          author: '高分学霸',
          authorId: 2,
          createdAt: '2023-06-12 15:42',
          likes: 7
        }
      ];
      
      initialComments.forEach(comment => commentsService.add(comment));
    }
  };
  
  // 创建新话题
  const handleCreateTopic = () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;
    
    const newTopicData = {
      title: newTopicTitle,
      content: newTopicContent,
      author: user?.username || '访客用户',
      authorId: user?.id || 0,
      tags: newTopicTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // 保存到localStorage
    const savedTopic = topicsService.add(newTopicData);
    
    // 转换为UI需要的格式
    const uiTopic: UIDiscussionTopic = {
      id: savedTopic.id,
      title: savedTopic.title,
      content: savedTopic.content,
      authorName: savedTopic.author,
      authorAvatar: getUserAvatar(savedTopic.author),
      createdAt: savedTopic.createdAt,
      tags: savedTopic.tags,
      commentsCount: 0,
      likesCount: savedTopic.likes,
      followed: false,
      views: savedTopic.views
    };
    
    // 更新状态
    setTopics([uiTopic, ...topics]);
    setNewTopicTitle('');
    setNewTopicContent('');
    setNewTopicTags('');
    setCreateDialogOpen(false);
  };
  
  // 查看话题详情
  const handleViewTopic = (topic: UIDiscussionTopic) => {
    // 加载评论
    const topicComments = commentsService.getByTopicId(topic.id);
    
    // 获取用户对评论的点赞状态
    const userLikedComments = JSON.parse(localStorage.getItem('user_liked_comments') || '[]');
    
    const topicWithComments = {
      ...topic,
      comments: topicComments.map(comment => ({
        id: comment.id,
        authorName: comment.author,
        authorAvatar: getUserAvatar(comment.author),
        content: comment.content,
        createdAt: comment.createdAt,
        likesCount: comment.likes,
        liked: userLikedComments.includes(comment.id)
      }))
    };
    
    // 更新话题的浏览次数
    topicsService.update(topic.id, {
      views: (topic.views || 0) + 1
    });
    
    setSelectedTopic(topicWithComments);
    setTopicDialogOpen(true);
  };
  
  // 发表评论
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTopic) return;
    
    // 创建新评论
    const commentData = {
      topicId: selectedTopic.id,
      content: newComment,
      author: user?.username || '访客用户',
      authorId: user?.id || 0,
      createdAt: new Date().toLocaleString(),
      likes: 0
    };
    
    // 保存到localStorage
    const savedComment = commentsService.add(commentData);
    
    // 转换为UI需要的格式
    const newCommentObj = {
      id: savedComment.id,
      authorName: savedComment.author,
      authorAvatar: getUserAvatar(savedComment.author),
      content: savedComment.content,
      createdAt: savedComment.createdAt,
      likesCount: savedComment.likes,
      liked: false
    };
    
    // 更新话题的评论计数和评论列表
    const updatedTopic = {...selectedTopic};
    updatedTopic.commentsCount = (updatedTopic.commentsCount || 0) + 1;
    updatedTopic.comments = [...(updatedTopic.comments || []), newCommentObj];
    
    // 增加commentsCount计数
    topicsService.update(selectedTopic.id, {
      views: selectedTopic.views
    });
    
    // 更新UI状态
    setTopics(topics.map(t => t.id === selectedTopic.id ? {
      ...t,
      commentsCount: (t.commentsCount || 0) + 1
    } : t));
    
    setSelectedTopic(updatedTopic);
    setNewComment('');
    
    toast({
      title: "评论已发布",
      description: "您的评论已成功添加到讨论中"
    });
  };
  
  // 点赞话题
  const handleLikeTopic = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const topic = topics.find(t => t.id === id);
    if (!topic) return;
    
    const liked = topic.followed || false;
    const newLikesCount = liked ? topic.likesCount - 1 : topic.likesCount + 1;
    
    // 更新localStorage中的话题数据
    const updatedTopic = topicsService.update(id, {
      likes: newLikesCount
    });
    
    // 更新用户点赞状态
    const userLikedTopics = JSON.parse(localStorage.getItem('user_liked_topics') || '[]');
    if (liked) {
      // 取消点赞
      const updatedLikedTopics = userLikedTopics.filter((topicId: number) => topicId !== id);
      localStorage.setItem('user_liked_topics', JSON.stringify(updatedLikedTopics));
    } else {
      // 添加点赞
      userLikedTopics.push(id);
      localStorage.setItem('user_liked_topics', JSON.stringify(userLikedTopics));
    }
    
    if (updatedTopic) {
      // 更新UI状态
      setTopics(topics.map(t => t.id === id ? {
        ...t,
        likesCount: newLikesCount,
        followed: !liked
      } : t));
      
      if (selectedTopic?.id === id) {
        setSelectedTopic({
          ...selectedTopic,
          likesCount: newLikesCount,
          followed: !liked
        });
      }
      
      toast({
        title: liked ? "已取消关注" : "已关注话题",
        description: liked ? "您已取消对该话题的关注" : "您已成功关注该话题"
      });
    }
  };
  
  // 点赞材料
  const handleLikeMaterial = (id: number) => {
    const material = materials.find(m => m.id === id);
    if (!material) return;
    
    const liked = material.liked || false;
    const newLikesCount = liked ? material.likes - 1 : material.likes + 1;
    
    // 更新材料数据
    const updatedMaterials = materials.map(m => {
      if (m.id === id) {
        return {
          ...m,
          likes: newLikesCount,
          liked: !liked
        };
      }
      return m;
    });
    
    // 更新状态和本地存储
    setMaterials(updatedMaterials);
    localStorage.setItem('materials_data', JSON.stringify(updatedMaterials));
    
    // 更新用户点赞状态
    const userLikedMaterials = JSON.parse(localStorage.getItem('user_liked_materials') || '[]');
    if (liked) {
      // 取消点赞
      const updatedLikedMaterials = userLikedMaterials.filter((materialId: number) => materialId !== id);
      localStorage.setItem('user_liked_materials', JSON.stringify(updatedLikedMaterials));
    } else {
      // 添加点赞
      userLikedMaterials.push(id);
      localStorage.setItem('user_liked_materials', JSON.stringify(userLikedMaterials));
    }
    
    toast({
      title: liked ? "已取消点赞" : "已点赞",
      description: liked ? "您已取消对该材料的点赞" : "您已成功点赞该材料"
    });
  };
  
  // 过滤话题
  const filteredTopics = filterCategory === 'all' 
    ? topics 
    : filterCategory === 'followed'
    ? topics.filter(topic => topic.followed)
    : topics.filter(topic => topic.tags.includes(filterCategory));
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">讨论交流中心</h1>
        <p className="text-muted-foreground">与其他用户交流学习心得和想法</p>
      </div>
      
        {activeTab === 'topics' && (
          <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            发起新话题
          </Button>
        )}
      </motion.div>
      
      <Tabs defaultValue="topics" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="topics">讨论话题</TabsTrigger>
          <TabsTrigger value="resources">资料广场</TabsTrigger>
        </TabsList>
        
        <TabsContent value="topics" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className={styles['filter-menu']}>
              <Select defaultValue="all" onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="筛选话题" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部话题</SelectItem>
                  <SelectItem value="followed">我关注的</SelectItem>
                  <SelectItem value="思维导图">思维导图</SelectItem>
                  <SelectItem value="学习方法">学习方法</SelectItem>
                  <SelectItem value="编程">编程</SelectItem>
                  <SelectItem value="数学">数学</SelectItem>
                </SelectContent>
              </Select>
              <div className={`${styles['filter-item']} ${filterCategory === 'all' ? styles['active'] : ''}`} onClick={() => setFilterCategory('all')}>
                <Filter className="h-4 w-4" />
                <span>全部</span>
              </div>
              <div className={`${styles['filter-item']} ${filterCategory === 'followed' ? styles['active'] : ''}`} onClick={() => setFilterCategory('followed')}>
                <Heart className="h-4 w-4" />
                <span>关注</span>
              </div>
            </div>
            
            <div className={styles['smart-search']}>
              <Input 
                placeholder="搜索话题..." 
                className="max-w-sm"
              />
              <div className={styles['search-suggestions']}>
                <div className={styles['suggest-item']}>热门：思维导图</div>
                <div className={styles['suggest-item']}>近期：学习方法</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredTopics.map(topic => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`cursor-pointer ${styles['topic-card']} ${styles['cardHoverEffect']}`} onClick={() => handleViewTopic(topic)}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={topic.authorAvatar} alt={topic.authorName} />
                          <AvatarFallback>{topic.authorName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{topic.authorName}</p>
                          <p className="text-xs text-muted-foreground">{topic.createdAt}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={topic.followed ? "text-red-500" : ""}
                        onClick={(e) => handleLikeTopic(topic.id, e)}
                      >
                        <Heart className={`h-5 w-5 ${styles['like-icon']} ${topic.followed ? "fill-red-500" : ""}`} />
                      </Button>
                    </div>
                    <CardTitle className={`mt-2 text-xl ${styles['topic-title']}`}>{topic.title}</CardTitle>
        </CardHeader>
        <CardContent>
                    <p className="line-clamp-2 text-muted-foreground">{topic.content}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {topic.tags.map(tag => (
                        <span key={tag}>
                          <Badge variant="secondary" className={styles['topic-tag']}>{tag}</Badge>
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="text-muted-foreground text-sm flex gap-4">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" /> {topic.commentsCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" /> {topic.likesCount}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map(material => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={material.authorAvatar} alt={material.authorName} />
                          <AvatarFallback>{material.authorName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{material.authorName}</p>
                          <p className="text-xs text-muted-foreground">{material.uploadedAt}</p>
                        </div>
                      </div>
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardTitle className="mt-2 text-lg line-clamp-1">{material.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="line-clamp-3 text-sm text-muted-foreground">{material.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {material.tags.map(tag => (
                        <span key={tag}>
                          <Badge variant="outline" className="text-xs">{tag}</Badge>
                        </span>
                      ))}
                    </div>
        </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" /> {material.commentsCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" /> {material.downloads}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={material.liked ? "text-red-500" : ""}
                      onClick={() => handleLikeMaterial(material.id)}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${material.liked ? "fill-red-500" : ""}`} />
                      {material.likes}
                    </Button>
                  </CardFooter>
      </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* 创建话题对话框 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>发起新话题</DialogTitle>
            <DialogDescription>分享您的想法，寻求他人的建议或讨论</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="topic-title">话题标题</Label>
              <Input 
                id="topic-title" 
                placeholder="输入话题标题..." 
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topic-content">话题内容</Label>
              <Textarea 
                id="topic-content" 
                placeholder="详细描述您的话题..." 
                rows={5}
                value={newTopicContent}
                onChange={(e) => setNewTopicContent(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topic-tags">标签</Label>
              <Input 
                id="topic-tags" 
                placeholder="输入标签，用逗号分隔..." 
                value={newTopicTags}
                onChange={(e) => setNewTopicTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">例如：思维导图,学习方法,经验分享</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>取消</Button>
            <Button onClick={handleCreateTopic}>发布话题</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 话题详情对话框 */}
      {selectedTopic && (
        <Dialog open={topicDialogOpen} onOpenChange={setTopicDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle>{selectedTopic.title}</DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedTopic.authorAvatar} alt={selectedTopic.authorName} />
                      <AvatarFallback>{selectedTopic.authorName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{selectedTopic.authorName}</span>
                    <span className="text-xs text-muted-foreground">{selectedTopic.createdAt}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`gap-1 ${selectedTopic.followed ? "text-red-500" : ""}`}
                  onClick={() => handleLikeTopic(selectedTopic.id)}
                >
                  <Heart className={`h-4 w-4 ${selectedTopic.followed ? "fill-red-500" : ""}`} />
                  {selectedTopic.followed ? "已关注" : "关注话题"}
                </Button>
              </div>
            </DialogHeader>
            
            <div className="py-4">
              <div className={`mb-2 ${styles['tag-cloud']}`}>
                {selectedTopic.tags.map(tag => (
                  <span key={tag}>
                    <Badge variant="secondary" className={`mr-2 mb-2 ${styles['topic-tag']} ${styles['tagPulse']}`}>{tag}</Badge>
                  </span>
                ))}
              </div>
              <p className="whitespace-pre-line">{selectedTopic.content}</p>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">评论 ({selectedTopic.commentsCount})</h3>
                <div className={styles['metric-box']}>
                  <div className={styles['metric-item']}>
                    <MessageCircle className="h-4 w-4" /> 
                    <span>{selectedTopic.commentsCount} 评论</span>
                  </div>
                  <div className={styles['metric-item']}>
                    <ThumbsUp className="h-4 w-4" /> 
                    <span>{selectedTopic.likesCount} 点赞</span>
                  </div>
                  {selectedTopic.views !== undefined && (
                    <div className={styles['metric-item']}>
                      <BookOpen className="h-4 w-4" /> 
                      <span>{selectedTopic.views} 浏览</span>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedTopic.comments && selectedTopic.comments.length === 0 && (
                <div className={styles['comment-guide']}>
                  <span>🗣️ 成为首个评论者...</span>
                  <button className={styles['micro-btn']} onClick={() => (document.querySelector('input[placeholder="添加评论..."]') as HTMLInputElement)?.focus()}>立即发言</button>
                </div>
              )}
              <div className="space-y-4 mb-6">
                {selectedTopic.comments && selectedTopic.comments.length > 0 ? (
                  selectedTopic.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                        <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <span className="text-xs text-muted-foreground ml-2">{comment.createdAt}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-6 px-2 ${comment.liked ? "text-blue-500" : ""}`}
                            onClick={() => {
                              // 处理评论点赞
                              const newLiked = !comment.liked;
                              const newLikesCount = newLiked ? comment.likesCount + 1 : comment.likesCount - 1;
                              
                              // 更新评论点赞状态
                              const userLikedComments = JSON.parse(localStorage.getItem('user_liked_comments') || '[]');
                              if (newLiked) {
                                userLikedComments.push(comment.id);
                              } else {
                                const index = userLikedComments.indexOf(comment.id);
                                if (index > -1) userLikedComments.splice(index, 1);
                              }
                              localStorage.setItem('user_liked_comments', JSON.stringify(userLikedComments));
                              
                              // 更新评论数据
                              commentsService.update(comment.id, { likes: newLikesCount });
                              
                              // 更新UI
                              if (selectedTopic && selectedTopic.comments) {
                                const updatedComments = selectedTopic.comments.map(c => 
                                  c.id === comment.id ? {...c, likesCount: newLikesCount, liked: newLiked} : c
                                );
                                setSelectedTopic({...selectedTopic, comments: updatedComments});
                              }
                            }}
                          >
                            <ThumbsUp className={`h-3 w-3 mr-1 ${comment.liked ? "fill-blue-500" : ""}`} />
                            <span className="text-xs">{comment.likesCount}</span>
                          </Button>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">暂无评论</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getUserAvatar(user?.username || '访客用户')} alt={user?.username || '访客用户'} />
                  <AvatarFallback>{(user?.username || '访客')[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input 
                    placeholder="添加评论..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button size="sm" onClick={handleAddComment}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DiscussionCenter;
