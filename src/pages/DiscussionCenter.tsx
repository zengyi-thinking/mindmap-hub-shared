import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

interface DiscussionTopic {
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
  comments?: Comment[];
}

interface Comment {
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

const DiscussionCenter = () => {
  const [activeTab, setActiveTab] = useState('topics');
  const [topics, setTopics] = useState<DiscussionTopic[]>([
    {
      id: 1,
      title: '如何有效利用思维导图进行期末复习？',
      content: '最近期末考试临近，想听听大家使用思维导图复习的经验和方法，有什么好的工具或技巧推荐吗？',
      authorName: '学习达人',
      authorAvatar: '',
      createdAt: '2023-06-12',
      tags: ['学习方法', '思维导图', '期末复习'],
      commentsCount: 8,
      likesCount: 24,
      followed: true,
      comments: [
        {
          id: 1,
          authorName: '思维导图专家',
          authorAvatar: '',
          content: '我推荐使用XMind进行复习，可以先梳理知识框架，然后逐步细化知识点，最后添加具体例题。',
          createdAt: '2023-06-12 14:30',
          likesCount: 5,
          liked: false
        },
        {
          id: 2,
          authorName: '高分学霸',
          authorAvatar: '',
          content: '我发现将课程内容按照"概念-原理-应用-例题"的结构来组织思维导图特别有效。',
          createdAt: '2023-06-12 15:42',
          likesCount: 7,
          liked: true
        }
      ]
    },
    {
      id: 2,
      title: '数据结构学习资料分享',
      content: '想和大家分享一些我收集的数据结构学习资料，包括了常见数据结构的实现和应用案例，希望对大家有帮助。',
      authorName: '编程爱好者',
      authorAvatar: '',
      createdAt: '2023-06-10',
      tags: ['数据结构', '编程', '学习资料'],
      commentsCount: 12,
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
      commentsCount: 6,
      likesCount: 18,
      followed: false
    }
  ]);
  
  const [materials, setMaterials] = useState<MaterialItem[]>([
    {
      id: 1,
      title: '数据结构与算法基础教程',
      description: '这是一份系统介绍数据结构与算法基础的教程，包含常见数据结构的实现和算法分析。',
      authorName: '算法专家',
      authorAvatar: '',
      uploadedAt: '2023-06-15',
      tags: ['数据结构', '算法', '编程基础'],
      likes: 45,
      downloads: 124,
      commentsCount: 12,
      liked: true
    },
    {
      id: 2,
      title: '操作系统概念图解',
      description: '通过图解的方式介绍操作系统的核心概念，让复杂的理论变得易于理解。',
      authorName: '系统大师',
      authorAvatar: '',
      uploadedAt: '2023-06-12',
      tags: ['操作系统', '图解', '计算机基础'],
      likes: 38,
      downloads: 97,
      commentsCount: 8,
      liked: false
    },
    {
      id: 3,
      title: '高等数学思维导图合集',
      description: '覆盖高等数学主要章节的思维导图合集，帮助快速理解和记忆知识点。',
      authorName: '数学爱好者',
      authorAvatar: '',
      uploadedAt: '2023-06-10',
      tags: ['高等数学', '思维导图', '学习辅助'],
      likes: 56,
      downloads: 152,
      commentsCount: 15,
      liked: false
    }
  ]);
  
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicTags, setNewTopicTags] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<DiscussionTopic | null>(null);
  const [newComment, setNewComment] = useState('');
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  
  // 创建新话题
  const handleCreateTopic = () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;
    
    const newTopic: DiscussionTopic = {
      id: Math.max(...topics.map(t => t.id), 0) + 1,
      title: newTopicTitle,
      content: newTopicContent,
      authorName: '当前用户',
      authorAvatar: '',
      createdAt: new Date().toISOString().split('T')[0],
      tags: newTopicTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      commentsCount: 0,
      likesCount: 0,
      followed: false
    };
    
    setTopics([newTopic, ...topics]);
    setNewTopicTitle('');
    setNewTopicContent('');
    setNewTopicTags('');
    setCreateDialogOpen(false);
  };
  
  // 查看话题详情
  const handleViewTopic = (topic: DiscussionTopic) => {
    setSelectedTopic(topic);
    setTopicDialogOpen(true);
  };
  
  // 发表评论
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTopic) return;
    
    const newCommentObj: Comment = {
      id: Math.random(),
      authorName: '当前用户',
      authorAvatar: '',
      content: newComment,
      createdAt: new Date().toLocaleString(),
      likesCount: 0,
      liked: false
    };
    
    const updatedTopic = {
      ...selectedTopic,
      commentsCount: selectedTopic.commentsCount + 1,
      comments: [...(selectedTopic.comments || []), newCommentObj]
    };
    
    setTopics(topics.map(t => t.id === selectedTopic.id ? updatedTopic : t));
    setSelectedTopic(updatedTopic);
    setNewComment('');
  };
  
  // 点赞话题
  const handleLikeTopic = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setTopics(topics.map(topic => {
      if (topic.id === id) {
        const liked = topics.find(t => t.id === id)?.followed || false;
        return {
          ...topic,
          likesCount: liked ? topic.likesCount - 1 : topic.likesCount + 1,
          followed: !liked
        };
      }
      return topic;
    }));
    
    if (selectedTopic?.id === id) {
      setSelectedTopic({
        ...selectedTopic,
        likesCount: selectedTopic.followed ? selectedTopic.likesCount - 1 : selectedTopic.likesCount + 1,
        followed: !selectedTopic.followed
      });
    }
  };
  
  // 点赞材料
  const handleLikeMaterial = (id: number) => {
    setMaterials(materials.map(material => {
      if (material.id === id) {
        return {
          ...material,
          likes: material.liked ? material.likes - 1 : material.likes + 1,
          liked: !material.liked
        };
      }
      return material;
    }));
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
            
            <Input 
              placeholder="搜索话题..." 
              className="max-w-sm"
            />
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
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewTopic(topic)}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
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
                        <Heart className={`h-5 w-5 ${topic.followed ? "fill-red-500" : ""}`} />
                      </Button>
                    </div>
                    <CardTitle className="mt-2 text-xl">{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-muted-foreground">{topic.content}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {topic.tags.map(tag => (
                        <span key={tag}>
                          <Badge variant="secondary">{tag}</Badge>
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
              <div className="mb-2">
                {selectedTopic.tags.map(tag => (
                  <span key={tag}>
                    <Badge variant="secondary" className="mr-2 mb-2">{tag}</Badge>
                  </span>
                ))}
              </div>
              <p className="whitespace-pre-line">{selectedTopic.content}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">评论 ({selectedTopic.commentsCount})</h3>
              
              <div className="space-y-4 mb-6">
                {selectedTopic.comments && selectedTopic.comments.length > 0 ? (
                  selectedTopic.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <span className="text-xs text-muted-foreground ml-2">{comment.createdAt}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ThumbsUp className="h-3 w-3 mr-1" />
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
                  <AvatarFallback>U</AvatarFallback>
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
