export interface DiscussionTopic {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: number;
  createdAt: string;
  updatedAt?: string;
  views: number;
  likes: number;
  tags: string[];
}

export interface DiscussionComment {
  id: number;
  topicId: number;
  content: string;
  author: string;
  authorId: number;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  parentId?: number; // 回复其他评论时使用
} 