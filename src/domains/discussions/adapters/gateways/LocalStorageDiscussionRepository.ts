import { Discussion, DiscussionProps } from "../../entities/Discussion";
import { Comment, CommentProps } from "../../entities/Comment";
import { DiscussionRepository } from "./DiscussionRepository";

/**
 * 本地存储讨论仓库实现
 * 使用浏览器的LocalStorage实现讨论和评论的持久化
 */
export class LocalStorageDiscussionRepository implements DiscussionRepository {
  private readonly DISCUSSIONS_KEY = "discussions";
  private readonly COMMENTS_KEY = "discussion_comments";

  /**
   * 保存讨论
   * @param discussion 讨论实体
   */
  async saveDiscussion(discussion: Discussion): Promise<void> {
    const discussions = this.getAllDiscussionsFromStorage();
    const existingIndex = discussions.findIndex(d => d.id === discussion.id);
    
    if (existingIndex >= 0) {
      // 更新现有讨论
      discussions[existingIndex] = this.discussionToProps(discussion);
    } else {
      // 添加新讨论
      discussions.push(this.discussionToProps(discussion));
    }
    
    localStorage.setItem(this.DISCUSSIONS_KEY, JSON.stringify(discussions));
  }

  /**
   * 根据ID查找讨论
   * @param id 讨论ID
   */
  async findDiscussionById(id: string): Promise<Discussion | null> {
    const discussions = this.getAllDiscussionsFromStorage();
    const discussionProps = discussions.find(d => d.id === id);
    
    return discussionProps ? new Discussion(discussionProps) : null;
  }

  /**
   * 查找所有讨论
   */
  async findAllDiscussions(): Promise<Discussion[]> {
    const discussions = this.getAllDiscussionsFromStorage();
    return discussions.map(props => new Discussion(props));
  }

  /**
   * 根据标签查找讨论
   * @param tags 标签数组
   */
  async findDiscussionsByTags(tags: string[]): Promise<Discussion[]> {
    const discussions = this.getAllDiscussionsFromStorage();
    const filteredDiscussions = discussions.filter(d => 
      tags.some(tag => d.tags.includes(tag))
    );
    
    return filteredDiscussions.map(props => new Discussion(props));
  }

  /**
   * 查找用户的所有讨论
   * @param authorId 用户ID
   */
  async findDiscussionsByAuthorId(authorId: string): Promise<Discussion[]> {
    const discussions = this.getAllDiscussionsFromStorage();
    const userDiscussions = discussions.filter(d => d.authorId === authorId);
    
    return userDiscussions.map(props => new Discussion(props));
  }

  /**
   * 根据ID删除讨论
   * @param id 讨论ID
   */
  async deleteDiscussionById(id: string): Promise<void> {
    const discussions = this.getAllDiscussionsFromStorage();
    const filteredDiscussions = discussions.filter(d => d.id !== id);
    
    localStorage.setItem(this.DISCUSSIONS_KEY, JSON.stringify(filteredDiscussions));
    
    // 删除相关评论
    const comments = this.getAllCommentsFromStorage();
    const filteredComments = comments.filter(c => c.discussionId !== id);
    
    localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(filteredComments));
  }

  /**
   * 根据标题搜索讨论
   * @param query 搜索关键词
   */
  async searchDiscussionsByTitle(query: string): Promise<Discussion[]> {
    const discussions = this.getAllDiscussionsFromStorage();
    const searchResults = discussions.filter(d => 
      d.title.toLowerCase().includes(query.toLowerCase())
    );
    
    return searchResults.map(props => new Discussion(props));
  }

  /**
   * 保存评论
   * @param comment 评论实体
   */
  async saveComment(comment: Comment): Promise<void> {
    const comments = this.getAllCommentsFromStorage();
    const existingIndex = comments.findIndex(c => c.id === comment.id);
    
    if (existingIndex >= 0) {
      // 更新现有评论
      comments[existingIndex] = this.commentToProps(comment);
    } else {
      // 添加新评论
      comments.push(this.commentToProps(comment));
      
      // 增加讨论的评论计数
      const discussion = await this.findDiscussionById(comment.discussionId);
      if (discussion) {
        discussion.incrementCommentCount();
        await this.saveDiscussion(discussion);
      }
    }
    
    localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(comments));
  }

  /**
   * 获取讨论的所有评论
   * @param discussionId 讨论ID
   */
  async findCommentsByDiscussionId(discussionId: string): Promise<Comment[]> {
    const comments = this.getAllCommentsFromStorage();
    const discussionComments = comments.filter(c => c.discussionId === discussionId);
    
    return discussionComments.map(props => new Comment(props));
  }
  
  /**
   * 根据ID删除评论
   * @param id 评论ID
   */
  async deleteCommentById(id: string): Promise<void> {
    const comments = this.getAllCommentsFromStorage();
    const commentToDelete = comments.find(c => c.id === id);
    
    if (commentToDelete) {
      const filteredComments = comments.filter(c => c.id !== id);
      localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(filteredComments));
      
      // 减少讨论的评论计数
      const discussion = await this.findDiscussionById(commentToDelete.discussionId);
      if (discussion && discussion.commentCount > 0) {
        // 这里需要自定义一个减少评论计数的方法，当前实体中没有
        // discussion.decrementCommentCount();
        await this.saveDiscussion(discussion);
      }
    }
  }

  // 私有辅助方法
  
  /**
   * 从本地存储获取所有讨论数据
   */
  private getAllDiscussionsFromStorage(): DiscussionProps[] {
    const data = localStorage.getItem(this.DISCUSSIONS_KEY);
    if (!data) return [];
    
    try {
      const parsedData = JSON.parse(data) as DiscussionProps[];
      
      // 确保日期字段是Date对象
      return parsedData.map(d => ({
        ...d,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt)
      }));
    } catch (error) {
      console.error('Error parsing discussions from localStorage:', error);
      return [];
    }
  }
  
  /**
   * 从本地存储获取所有评论数据
   */
  private getAllCommentsFromStorage(): CommentProps[] {
    const data = localStorage.getItem(this.COMMENTS_KEY);
    if (!data) return [];
    
    try {
      const parsedData = JSON.parse(data) as CommentProps[];
      
      // 确保日期字段是Date对象
      return parsedData.map(c => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      }));
    } catch (error) {
      console.error('Error parsing comments from localStorage:', error);
      return [];
    }
  }

  /**
   * 将讨论实体转换为可序列化的对象
   */
  private discussionToProps(discussion: Discussion): DiscussionProps {
    return {
      id: discussion.id,
      title: discussion.title,
      content: discussion.content,
      authorId: discussion.authorId,
      tags: discussion.tags,
      createdAt: discussion.createdAt,
      updatedAt: discussion.updatedAt,
      viewCount: discussion.viewCount,
      commentCount: discussion.commentCount,
      isLocked: discussion.isLocked
    };
  }
  
  /**
   * 将评论实体转换为可序列化的对象
   */
  private commentToProps(comment: Comment): CommentProps {
    return {
      id: comment.id,
      discussionId: comment.discussionId,
      content: comment.content,
      authorId: comment.authorId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      parentId: comment.parentId,
      likeCount: comment.likeCount,
      isEdited: comment.isEdited
    };
  }
} 