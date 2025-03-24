import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './DiscussionCenter.module.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, PlusCircle, Filter } from 'lucide-react';
import { topicsService, commentsService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

// 导入拆分后的组件
import TopicsList, { UIDiscussionTopic } from '@/features/discussion/TopicsList';
import TopicDialog, { UIComment } from '@/features/discussion/TopicDialog';
import CreateTopicDialog from '@/features/discussion/CreateTopicDialog';

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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<UIDiscussionTopic | null>(null);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const { user } = useAuth();
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
            createdAt: '2023-06-12 16:45',
            likes: 3
          }
        ];
        
        initialComments.forEach(comment => commentsService.add(comment));
      }
      
      setTopics(initialTopics as UIDiscussionTopic[]);
    }
  };
  
  // 处理创建新话题
  const handleCreateTopic = (title: string, content: string, tags: string[]) => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能创建话题",
        variant: "destructive"
      });
      return;
    }
    
    // 创建新话题
    const newTopic = {
      title,
      content,
      author: user.username,
      authorId: user.id,
      tags,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0
    };
    
    // 添加到数据库
    const savedTopic = topicsService.add(newTopic);
    
    // 添加到UI
    const uiTopic: UIDiscussionTopic = {
      ...savedTopic,
      id: savedTopic.id,
      authorName: savedTopic.author,
      authorAvatar: getUserAvatar(savedTopic.author),
      commentsCount: 0,
      likesCount: 0,
      followed: false,
    };
    
    setTopics([uiTopic, ...topics]);
    setCreateDialogOpen(false);
    
    toast({
      title: "创建成功",
      description: "您的话题已成功发布"
    });
  };
  
  // 查看话题详情
  const handleViewTopic = (topic: UIDiscussionTopic) => {
    // 获取最新评论
    const topicComments = commentsService.getByTopicId(topic.id);
    
    // 获取用户对评论的点赞状态
    const userLikedComments = JSON.parse(localStorage.getItem('user_liked_comments') || '[]');
    
    // 格式化评论
    const formattedComments = topicComments.map(comment => ({
      id: comment.id,
      authorName: comment.author,
      authorAvatar: getUserAvatar(comment.author),
      content: comment.content,
      createdAt: comment.createdAt,
      likesCount: comment.likes,
      liked: userLikedComments.includes(comment.id)
    }));
    
    // 增加浏览次数
    const updatedTopic = { ...topic, views: (topic.views || 0) + 1 };
    topicsService.update(topic.id, { views: updatedTopic.views });
    
    // 更新选中的话题和评论
    const updatedTopicWithComments = {
      ...updatedTopic,
      comments: formattedComments
    };
    
    setSelectedTopic(updatedTopicWithComments);
    setTopicDialogOpen(true);
  };
  
  // 添加评论
  const handleAddComment = (content: string) => {
    if (!selectedTopic || !user) return;
    
    // 创建新评论
    const newComment = {
      topicId: selectedTopic.id,
      content,
      author: user.username,
      authorId: user.id,
      createdAt: new Date().toLocaleString(),
      likes: 0
    };
    
    // 添加到数据库
    const savedComment = commentsService.add(newComment);
    
    // 创建UI评论对象
    const uiComment: UIComment = {
      id: savedComment.id,
      authorName: savedComment.author,
      authorAvatar: getUserAvatar(savedComment.author),
      content: savedComment.content,
      createdAt: savedComment.createdAt,
      likesCount: 0,
      liked: false
    };
    
    // 更新选中话题的评论
    const updatedComments = selectedTopic.comments ? [uiComment, ...selectedTopic.comments] : [uiComment];
    const updatedTopic = {
      ...selectedTopic,
      comments: updatedComments,
      commentsCount: (selectedTopic.commentsCount || 0) + 1
    };
    
    setSelectedTopic(updatedTopic);
    
    // 同时更新话题列表中的评论计数
    const updatedTopics = topics.map(topic =>
      topic.id === selectedTopic.id
        ? { ...topic, commentsCount: (topic.commentsCount || 0) + 1 }
        : topic
    );
    
    setTopics(updatedTopics);
    
    toast({
      title: "评论成功",
      description: "您的评论已成功发布"
    });
  };
  
  // 处理点赞话题
  const handleLikeTopic = () => {
    if (!selectedTopic || !user) return;
    
    // 获取用户点赞过的话题
    const userLikedTopics = JSON.parse(localStorage.getItem('user_liked_topics') || '[]');
    const isLiked = userLikedTopics.includes(selectedTopic.id);
    
    // 更新点赞状态
    if (isLiked) {
      // 取消点赞
      const filteredLikes = userLikedTopics.filter((id: number) => id !== selectedTopic.id);
      localStorage.setItem('user_liked_topics', JSON.stringify(filteredLikes));
      
      // 减少点赞数
      const newLikesCount = Math.max(0, selectedTopic.likesCount - 1);
      
      // 更新数据库
      topicsService.update(selectedTopic.id, { likes: newLikesCount });
      
      // 更新UI
      const updatedTopic = {
        ...selectedTopic,
        likesCount: newLikesCount,
        followed: false
      };
      
      setSelectedTopic(updatedTopic);
      
      // 同时更新话题列表
      const updatedTopics = topics.map(topic =>
        topic.id === selectedTopic.id
          ? { ...topic, likesCount: newLikesCount, followed: false }
          : topic
      );
      
      setTopics(updatedTopics);
    } else {
      // 添加点赞
      userLikedTopics.push(selectedTopic.id);
      localStorage.setItem('user_liked_topics', JSON.stringify(userLikedTopics));
      
      // 增加点赞数
      const newLikesCount = selectedTopic.likesCount + 1;
      
      // 更新数据库
      topicsService.update(selectedTopic.id, { likes: newLikesCount });
      
      // 更新UI
      const updatedTopic = {
        ...selectedTopic,
        likesCount: newLikesCount,
        followed: true
      };
      
      setSelectedTopic(updatedTopic);
      
      // 同时更新话题列表
      const updatedTopics = topics.map(topic =>
        topic.id === selectedTopic.id
          ? { ...topic, likesCount: newLikesCount, followed: true }
          : topic
      );
      
      setTopics(updatedTopics);
    }
  };
  
  // 过滤话题
  const getFilteredTopics = () => {
    if (filterCategory === 'all') {
      return topics;
    }
    
    return topics.filter(topic => 
      topic.tags.some(tag => tag.toLowerCase().includes(filterCategory.toLowerCase()))
    );
  };
  
  const filteredTopics = getFilteredTopics();
  
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>讨论中心</h1>
        <p className={styles.subtitle}>分享您的想法，寻找志同道合的伙伴</p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className={styles.tabs}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="topics" className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              讨论话题
            </TabsTrigger>
          </TabsList>
          
          <Button onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-1" />
            创建话题
          </Button>
        </div>
        
        <TabsContent value="topics" className="mt-0">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">话题列表</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="筛选分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分类</SelectItem>
                      <SelectItem value="思维导图">思维导图</SelectItem>
                      <SelectItem value="学习方法">学习方法</SelectItem>
                      <SelectItem value="知识体系">知识体系</SelectItem>
                      <SelectItem value="编程">编程</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TopicsList 
                topics={filteredTopics}
                onViewTopic={handleViewTopic}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 创建话题对话框 */}
      <CreateTopicDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreateTopic={handleCreateTopic}
      />
      
      {/* 话题详情对话框 */}
      <TopicDialog
        open={topicDialogOpen}
        onClose={() => setTopicDialogOpen(false)}
        topic={selectedTopic}
        comments={selectedTopic?.comments || []}
        onAddComment={handleAddComment}
        onLikeTopic={handleLikeTopic}
      />
    </motion.div>
  );
};

export default DiscussionCenter; 