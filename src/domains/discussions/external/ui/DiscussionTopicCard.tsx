import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Clock, Tag } from 'lucide-react';
import { Discussion } from '../../entities/Discussion';

interface DiscussionTopicCardProps {
  discussion: Discussion;
  onViewTopic: () => void;
  authorName: string;
  authorAvatar?: string;
}

/**
 * 讨论话题卡片组件
 * 展示单个讨论话题的卡片，包含作者、标签、点赞评论数等信息
 */
export const DiscussionTopicCard: React.FC<DiscussionTopicCardProps> = ({ 
  discussion, 
  onViewTopic,
  authorName,
  authorAvatar
}) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="hover:shadow-md transition-shadow duration-300 cursor-pointer"
        onClick={onViewTopic}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="line-clamp-2">{discussion.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="w-6 h-6">
              {authorAvatar ? (
                <AvatarImage src={authorAvatar} alt={authorName} />
              ) : (
                <AvatarFallback className={getRandomColor(authorName)}>
                  {getUserInitials(authorName)}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm text-gray-600">{authorName}</span>
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {discussion.createdAt.toLocaleDateString()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {discussion.content}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {discussion.tags.map(tag => (
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
                0 点赞
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                <MessageSquare className="w-3 h-3 mr-1" />
                {discussion.commentCount} 评论
              </span>
            </div>
            <Button size="sm" variant="ghost">
              查看详情
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 