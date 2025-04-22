import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Reply, ThumbsUp, Send } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { commentsService } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';

interface MaterialComment {
  id: number;
  materialId: number;
  parentId?: number;
  content: string;
  author: string;
  authorId: number;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  liked?: boolean;
  replies?: MaterialComment[];
}

interface MaterialCommentsProps {
  comments: MaterialComment[];
  setComments: React.Dispatch<React.SetStateAction<MaterialComment[]>>;
  materialId: number;
}

const MaterialComments: React.FC<MaterialCommentsProps> = ({ 
  comments, 
  setComments,
  materialId 
}) => {
  return (
    <div className="space-y-6">
      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          暂无评论，快来发表第一条评论吧！
        </div>
      ) : (
        comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            comments={comments}
            setComments={setComments}
            materialId={materialId}
            isReply={false}
          />
        ))
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: MaterialComment;
  comments: MaterialComment[];
  setComments: React.Dispatch<React.SetStateAction<MaterialComment[]>>;
  materialId: number;
  isReply: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  comments, 
  setComments,
  materialId,
  isReply 
}) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  // 处理点赞评论
  const handleLikeComment = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能点赞评论",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // 获取用户点赞过的评论
      const likedComments = JSON.parse(localStorage.getItem('user_liked_comments') || '[]');
      
      if (comment.liked) {
        // 取消点赞
        const updatedLikedComments = likedComments.filter((id: number) => id !== comment.id);
        localStorage.setItem('user_liked_comments', JSON.stringify(updatedLikedComments));
        
        // 更新评论点赞数
        commentsService.update(comment.id, {
          likes: Math.max(0, comment.likes - 1)
        });
        
        // 更新UI
        updateCommentInState({
          ...comment,
          liked: false,
          likes: Math.max(0, comment.likes - 1)
        });
      } else {
        // 添加点赞
        likedComments.push(comment.id);
        localStorage.setItem('user_liked_comments', JSON.stringify(likedComments));
        
        // 更新评论点赞数
        commentsService.update(comment.id, {
          likes: comment.likes + 1
        });
        
        // 更新UI
        updateCommentInState({
          ...comment,
          liked: true,
          likes: comment.likes + 1
        });
      }
    } catch (error) {
      console.error("处理评论点赞出错:", error);
      toast({
        title: "操作失败",
        description: "点赞操作失败，请稍后再试",
        variant: "destructive"
      });
    }
  };
  
  // 处理回复评论
  const handleReply = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能回复评论",
        variant: "destructive"
      });
      return;
    }
    
    if (!replyContent.trim()) {
      toast({
        title: "回复内容不能为空",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const replyData = {
        materialId,
        parentId: comment.id,
        content: replyContent.trim(),
        author: user.username,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      
      // 保存回复
      const savedReply = commentsService.add(replyData);
      
      // 转换为UI格式
      const newReply: MaterialComment = {
        ...savedReply,
        liked: false
      };
      
      // 更新UI
      if (!comment.replies) {
        comment.replies = [];
      }
      
      updateCommentInState({
        ...comment,
        replies: [...comment.replies, newReply]
      });
      
      // 重置表单
      setReplyContent('');
      setShowReplyForm(false);
      
      toast({
        title: "回复成功",
        description: "您的回复已发布"
      });
    } catch (error) {
      console.error("回复评论出错:", error);
      toast({
        title: "回复失败",
        description: "发布回复时发生错误",
        variant: "destructive"
      });
    }
  };
  
  // 更新评论在状态中
  const updateCommentInState = (updatedComment: MaterialComment) => {
    if (isReply) {
      // 这是一个回复，需要找到父评论并更新其中的回复
      const updatedComments = comments.map(c => {
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => 
              r.id === updatedComment.id ? updatedComment : r
            )
          };
        }
        return c;
      });
      setComments(updatedComments);
    } else {
      // 这是一个顶级评论
      setComments(comments.map(c => 
        c.id === updatedComment.id ? updatedComment : c
      ));
    }
  };
  
  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className={`${isReply ? 'pl-8 mt-4' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.authorAvatar} alt={comment.author} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-sm">{comment.author}</div>
              <div className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                className={`h-8 w-8 ${comment.liked ? 'text-blue-500' : ''}`}
                onClick={handleLikeComment}
              >
                <ThumbsUp className={`h-4 w-4 ${comment.liked ? 'fill-blue-500' : ''}`} />
              </Button>
              <span className="text-sm">{comment.likes}</span>
            </div>
          </div>
          <div className="mt-2 text-sm">{comment.content}</div>
          <div className="mt-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className="h-3 w-3" />
              回复
            </Button>
          </div>
          
          {showReplyForm && (
            <div className="mt-3 flex gap-2">
              <Textarea 
                placeholder={`回复 ${comment.author}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm"
                  className="px-2"
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className="px-2"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                >
                  取消
                </Button>
              </div>
            </div>
          )}
          
          {/* 显示回复 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  comments={comments}
                  setComments={setComments}
                  materialId={materialId}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {!isReply && <Separator className="mt-4" />}
    </div>
  );
};

export default MaterialComments; 