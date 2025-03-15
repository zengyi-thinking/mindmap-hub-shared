
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Filter, Heart, MessageSquare } from 'lucide-react';
import styles from './DiscussionCenter.module.css';

// 假数据
const discussionTopics = [
  {
    id: 1,
    title: '如何有效利用思维导图进行期末复习？',
    author: '学习达人',
    date: '2023-06-12',
    content: '最近期末考试临近，想听听大家使用思维导图复习的经验和方法，有什么好的工具或技巧推荐吗？',
    tags: ['学习方法', '思维导图', '期末复习'],
    likes: 24,
    comments: 0
  },
  {
    id: 2,
    title: '关于多学科知识整合的思维导图分享',
    author: '知识整合者',
    date: '2023-06-10',
    content: '我最近尝试将不同学科的知识点通过思维导图连接起来，发现这种方法对知识理解非常有帮助，特别是对于交叉学科的内容。',
    tags: ['跨学科学习', '思维导图', '知识整合'],
    likes: 36,
    comments: 5
  },
  {
    id: 3,
    title: '思维导图在项目管理中的应用经验',
    author: '项目管理专家',
    date: '2023-06-08',
    content: '作为一名项目经理，我经常使用思维导图来规划项目流程和任务分配。想和大家分享一些实际应用经验和工具推荐。',
    tags: ['项目管理', '思维导图', '效率工具'],
    likes: 42,
    comments: 8
  }
];

const DiscussionCenter = () => {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">讨论交流中心</h1>
          <p className="text-muted-foreground">与其他用户交流学习心得和想法</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <Tabs defaultValue="topics" className="w-auto">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="topics" className={styles.tabUnderline}>讨论话题</TabsTrigger>
              <TabsTrigger value="resources" className={styles.tabUnderline}>资料广场</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            发起新话题
          </Button>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="搜索话题..." 
                className="pl-10 bg-background border-border"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                全部
              </Button>
              <Button variant="ghost" className="flex gap-2">
                关注
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {discussionTopics.map(topic => (
            <div key={topic.id} className={`rounded-xl border p-6 shadow-sm bg-card ${styles.cardHoverEffect}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {topic.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{topic.author}</div>
                  <div className="text-sm text-muted-foreground">{topic.date}</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
              <p className="text-muted-foreground mb-4">{topic.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {topic.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="flex gap-1 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    {topic.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex gap-1 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    {topic.comments}
                  </Button>
                </div>
                <Button variant="outline" size="sm">查看详情</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionCenter;
