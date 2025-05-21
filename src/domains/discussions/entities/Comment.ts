/**
 * 评论实体
 * 表示讨论中的评论
 */
export interface CommentProps {
  id: string;
  discussionId: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string; // 父评论ID，用于嵌套回复
  likeCount: number;
  isEdited: boolean;
}

/**
 * 评论实体类
 */
export class Comment {
  private props: CommentProps;

  constructor(props: CommentProps) {
    this.props = props;
  }

  // 访问器
  get id(): string {
    return this.props.id;
  }

  get discussionId(): string {
    return this.props.discussionId;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get parentId(): string | undefined {
    return this.props.parentId;
  }

  get likeCount(): number {
    return this.props.likeCount;
  }

  get isEdited(): boolean {
    return this.props.isEdited;
  }

  // 修改器
  updateContent(content: string): void {
    this.props.content = content;
    this.props.updatedAt = new Date();
    this.props.isEdited = true;
  }

  incrementLikeCount(): void {
    this.props.likeCount += 1;
  }

  decrementLikeCount(): void {
    if (this.props.likeCount > 0) {
      this.props.likeCount -= 1;
    }
  }

  isReply(): boolean {
    return !!this.props.parentId;
  }
} 