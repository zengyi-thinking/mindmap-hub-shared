import { Discussion, DiscussionProps } from "../../entities/Discussion";
import { Comment, CommentProps } from "../../entities/Comment";
import { GetDiscussionByIdUseCase } from "../../use-cases/GetDiscussionByIdUseCase";
import { DiscussionRepository } from "../gateways/DiscussionRepository";

interface CreateDiscussionRequest {
  title: string;
  content: string;
  authorId: string;
  tags: string[];
}

interface CreateCommentRequest {
  discussionId: string;
  content: string;
  authorId: string;
  parentId?: string;
}

/**
 * 讨论控制器
 * 处理讨论相关的API请求
 */
export class DiscussionController {
  constructor(
    private readonly getDiscussionByIdUseCase: GetDiscussionByIdUseCase,
    private readonly discussionRepository: DiscussionRepository
  ) {}

  /**
   * 获取讨论
   * @param id 讨论ID
   */
  async getDiscussion(id: string): Promise<Discussion | null> {
    try {
      const discussion = await this.getDiscussionByIdUseCase.execute(id);
      if (discussion) {
        discussion.incrementViewCount();
        await this.discussionRepository.saveDiscussion(discussion);
      }
      return discussion;
    } catch (error) {
      console.error('Error getting discussion:', error);
      throw error;
    }
  }

  /**
   * 获取所有讨论
   */
  async getAllDiscussions(): Promise<Discussion[]> {
    try {
      return await this.discussionRepository.findAllDiscussions();
    } catch (error) {
      console.error('Error getting all discussions:', error);
      throw error;
    }
  }

  /**
   * 创建新讨论
   * @param request 创建讨论请求
   */
  async createDiscussion(request: CreateDiscussionRequest): Promise<Discussion> {
    const now = new Date();
    
    const discussionProps: DiscussionProps = {
      id: this.generateId(),
      title: request.title,
      content: request.content,
      authorId: request.authorId,
      tags: request.tags,
      createdAt: now,
      updatedAt: now,
      viewCount: 0,
      commentCount: 0,
      isLocked: false
    };

    const discussion = new Discussion(discussionProps);
    await this.discussionRepository.saveDiscussion(discussion);
    return discussion;
  }

  /**
   * 创建评论
   * @param request 创建评论请求
   */
  async createComment(request: CreateCommentRequest): Promise<Comment> {
    const now = new Date();
    
    const commentProps: CommentProps = {
      id: this.generateId(),
      discussionId: request.discussionId,
      content: request.content,
      authorId: request.authorId,
      createdAt: now,
      updatedAt: now,
      parentId: request.parentId,
      likeCount: 0,
      isEdited: false
    };

    const comment = new Comment(commentProps);
    await this.discussionRepository.saveComment(comment);
    return comment;
  }

  /**
   * 获取讨论的评论
   * @param discussionId 讨论ID
   */
  async getCommentsByDiscussionId(discussionId: string): Promise<Comment[]> {
    try {
      return await this.discussionRepository.findCommentsByDiscussionId(discussionId);
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
} 