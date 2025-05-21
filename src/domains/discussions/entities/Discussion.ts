/**
 * 讨论实体
 * 表示系统中的讨论主题
 */
export interface DiscussionProps {
  id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  commentCount: number;
  isLocked: boolean;
}

/**
 * 讨论实体类
 */
export class Discussion {
  private props: DiscussionProps;

  constructor(props: DiscussionProps) {
    this.props = props;
  }

  // 访问器
  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get tags(): string[] {
    return [...this.props.tags];
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get viewCount(): number {
    return this.props.viewCount;
  }

  get commentCount(): number {
    return this.props.commentCount;
  }

  get isLocked(): boolean {
    return this.props.isLocked;
  }

  // 修改器
  updateTitle(title: string): void {
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  updateContent(content: string): void {
    this.props.content = content;
    this.props.updatedAt = new Date();
  }

  updateTags(tags: string[]): void {
    this.props.tags = [...tags];
    this.props.updatedAt = new Date();
  }

  incrementViewCount(): void {
    this.props.viewCount += 1;
  }

  incrementCommentCount(): void {
    this.props.commentCount += 1;
  }

  lock(): void {
    this.props.isLocked = true;
    this.props.updatedAt = new Date();
  }

  unlock(): void {
    this.props.isLocked = false;
    this.props.updatedAt = new Date();
  }
} 