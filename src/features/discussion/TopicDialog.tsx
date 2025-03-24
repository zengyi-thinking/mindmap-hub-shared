import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThumbsUp, Tag, Send, MessageCircle, Calendar, Eye } from 'lucide-react';
import { UIDiscussionTopic } from './TopicsList';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

export interface UIComment {
  id: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
  liked: boolean;
}

interface TopicDialogProps {
  open: boolean;
  onClose: () => void;
  topic: UIDiscussionTopic | null;
  comments: UIComment[];
  onAddComment: (content: string) => void;
  onLikeTopic: () => void;
}

const TopicDialog: React.FC<TopicDialogProps> = ({
  open,
  onClose,
  topic,
  comments,
  onAddComment,
  onLikeTopic
}) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

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

  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能发表评论",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "评论内容不能为空",
        variant: "destructive"
      });
      return;
    }

    onAddComment(newComment.trim());
    setNewComment('');
  };

  if (!topic) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{topic.title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="w-8 h-8">
              {topic.authorAvatar ? (
                <AvatarImage src={topic.authorAvatar} alt={topic.authorName} />
              ) : (
                <AvatarFallback className={getRandomColor(topic.authorName)}>
                  {getUserInitials(topic.authorName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="text-sm font-medium">{topic.authorName}</div>
              <div className="text-xs text-gray-500 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {topic.createdAt}
              </div>
            </div>
          </div>

          <div className="my-4 border-l-2 border-primary pl-3 py-1">
            <p className="text-gray-700 whitespace-pre-line">{topic.content}</p>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {topic.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4 border-t border-b py-2">
            <Button 
              variant={topic.followed ? "default" : "outline"} 
              size="sm"
              onClick={onLikeTopic}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="w-4 h-4" />
              {topic.followed ? '已点赞' : '点赞'} ({topic.likesCount})
            </Button>
            <span className="text-sm text-gray-500 flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {comments.length} 条评论
            </span>
            {topic.views !== undefined && (
              <span className="text-sm text-gray-500 flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {topic.views} 次浏览
              </span>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">评论</h3>
            <div className="space-y-4 mb-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        {comment.authorAvatar ? (
                          <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                        ) : (
                          <AvatarFallback className={getRandomColor(comment.authorName)}>
                            {getUserInitials(comment.authorName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-sm font-medium">{comment.authorName}</span>
                      <span className="text-xs text-gray-500">{comment.createdAt}</span>
                    </div>
                    <p className="text-sm mt-2 pl-8">{comment.content}</p>
                    <div className="flex justify-end mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center gap-1 text-xs h-6"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {comment.likesCount}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>暂无评论，成为第一个评论的人</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="添加评论..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                className="flex-1"
              />
              <Button onClick={handleSubmitComment} className="flex items-center gap-1">
                <Send className="w-4 h-4" />
                发送
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopicDialog; 