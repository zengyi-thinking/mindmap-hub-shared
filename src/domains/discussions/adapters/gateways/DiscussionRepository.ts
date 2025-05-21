import { Discussion } from "../../entities/Discussion";
import { Comment } from "../../entities/Comment";

/**
 * 讨论仓库接口
 * 定义对讨论实体的所有持久化操作
 */
export interface DiscussionRepository {
  /**
   * 保存讨论
   * @param discussion 讨论实体
   */
  saveDiscussion(discussion: Discussion): Promise<void>;

  /**
   * 根据ID查找讨论
   * @param id 讨论ID
   */
  findDiscussionById(id: string): Promise<Discussion | null>;

  /**
   * 查找所有讨论
   */
  findAllDiscussions(): Promise<Discussion[]>;

  /**
   * 根据标签查找讨论
   * @param tags 标签数组
   */
  findDiscussionsByTags(tags: string[]): Promise<Discussion[]>;

  /**
   * 查找用户的所有讨论
   * @param authorId 用户ID
   */
  findDiscussionsByAuthorId(authorId: string): Promise<Discussion[]>;

  /**
   * 根据ID删除讨论
   * @param id 讨论ID
   */
  deleteDiscussionById(id: string): Promise<void>;

  /**
   * 根据标题搜索讨论
   * @param query 搜索关键词
   */
  searchDiscussionsByTitle(query: string): Promise<Discussion[]>;

  /**
   * 保存评论
   * @param comment 评论实体
   */
  saveComment(comment: Comment): Promise<void>;

  /**
   * 获取讨论的所有评论
   * @param discussionId 讨论ID
   */
  findCommentsByDiscussionId(discussionId: string): Promise<Comment[]>;
  
  /**
   * 根据ID删除评论
   * @param id 评论ID
   */
  deleteCommentById(id: string): Promise<void>;
} 