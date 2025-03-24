import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Clock, Tag } from 'lucide-react';

export interface UIDiscussionTopic {
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
  views?: number;
}

interface TopicsListProps {
  topics: UIDiscussionTopic[];
  onViewTopic: (topic: UIDiscussionTopic) => void;
}

const TopicsList: React.FC<TopicsListProps> = ({ topics, onViewTopic }) => {
  // 获取用户头像的辅助函数
  const getUserInitials = (name: string): string => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // 获取随机色彩为头像
  const getRandomColor = (name: string): string => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  if (topics.length === 0) {
    return (
      <div className="text-center p-8">
        <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">暂无讨论话题</h3>
        <p className="text-gray-500 mb-4">成为第一个发起讨论的用户</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topics.map((topic, index) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card 
            className="hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => onViewTopic(topic)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="line-clamp-2">{topic.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="w-6 h-6">
                  {topic.authorAvatar ? (
                    <AvatarImage src={topic.authorAvatar} alt={topic.authorName} />
                  ) : (
                    <AvatarFallback className={getRandomColor(topic.authorName)}>
                      {getUserInitials(topic.authorName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm text-gray-600">{topic.authorName}</span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {topic.createdAt}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {topic.content}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {topic.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="text-xs text-gray-500 flex items-center">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {topic.likesCount} 点赞
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {topic.commentsCount} 评论
                  </span>
                </div>
                <Button size="sm" variant="ghost">
                  查看详情
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TopicsList; 