/**
 * 讨论模块桥接组件
 * 
 * 该文件作为旧架构(modules/features)到新架构(domains)的桥接层
 * 保持向后兼容性，同时允许项目结构逐步迁移
 */

import React from 'react';
import { 
  Discussion, 
  DiscussionProps, 
  Comment,
  CommentProps,
  LocalStorageDiscussionRepository,
  GetDiscussionById,
  DiscussionController,
  DiscussionTopicCard,
  DiscussionTopicsList
} from '../../../domains/discussions';

// 导出讨论实体和相关类型
export { 
  Discussion, 
  type DiscussionProps,
  Comment,
  type CommentProps
} from '../../../domains/discussions';

// 导出UI组件
export { 
  DiscussionTopicCard,
  DiscussionTopicsList
} from '../../../domains/discussions';

// 实例化仓库、用例和控制器
const discussionRepository = new LocalStorageDiscussionRepository();
const getDiscussionByIdUseCase = new GetDiscussionById(discussionRepository);
const discussionController = new DiscussionController(getDiscussionByIdUseCase, discussionRepository);

// 导出兼容旧版代码的类型定义
export interface UIDiscussionTopic {
  id: number | string;
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

// 导出桥接Hook和函数

/**
 * 获取所有讨论的Hook
 */
export const useDiscussions = () => {
  const [discussions, setDiscussions] = React.useState<Discussion[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        const result = await discussionController.getAllDiscussions();
        setDiscussions(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  return { discussions, loading, error };
};

/**
 * 获取单个讨论的Hook
 */
export const useDiscussion = (id: string) => {
  const [discussion, setDiscussion] = React.useState<Discussion | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        setLoading(true);
        const discussionResult = await discussionController.getDiscussion(id);
        setDiscussion(discussionResult);
        
        if (discussionResult) {
          const commentsResult = await discussionController.getCommentsByDiscussionId(id);
          setComments(commentsResult);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussion();
  }, [id]);

  return { discussion, comments, loading, error };
};

/**
 * 创建新讨论
 */
export const createDiscussion = async (title: string, content: string, authorId: string, tags: string[]): Promise<Discussion> => {
  return discussionController.createDiscussion({
    title,
    content,
    authorId,
    tags
  });
};

/**
 * 创建新评论
 */
export const createComment = async (discussionId: string, content: string, authorId: string, parentId?: string): Promise<Comment> => {
  return discussionController.createComment({
    discussionId,
    content,
    authorId,
    parentId
  });
};

/**
 * 将UI讨论话题转换为领域讨论实体
 */
export const convertUITopicToDiscussion = (uiTopic: UIDiscussionTopic): Discussion => {
  const discussionProps: DiscussionProps = {
    id: uiTopic.id.toString(),
    title: uiTopic.title,
    content: uiTopic.content,
    authorId: uiTopic.authorName, // 警告：此处简化处理，实际应使用真实用户ID
    tags: uiTopic.tags,
    createdAt: new Date(uiTopic.createdAt),
    updatedAt: new Date(uiTopic.createdAt),
    viewCount: uiTopic.views || 0,
    commentCount: uiTopic.commentsCount,
    isLocked: false
  };
  
  return new Discussion(discussionProps);
};

/**
 * 将领域讨论实体转换为UI讨论话题
 */
export const convertDiscussionToUITopic = (discussion: Discussion, authorName: string, authorAvatar: string = ''): UIDiscussionTopic => {
  return {
    id: discussion.id,
    title: discussion.title,
    content: discussion.content,
    authorName: authorName,
    authorAvatar: authorAvatar,
    createdAt: discussion.createdAt.toLocaleString(),
    tags: discussion.tags,
    commentsCount: discussion.commentCount,
    likesCount: 0,
    followed: false,
    views: discussion.viewCount
  };
}; 