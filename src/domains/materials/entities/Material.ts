/**
 * 材料实体
 * 表示系统中的学习材料
 */
export interface MaterialProps {
  id: string;
  title: string;
  description: string;
  content?: string;
  fileUrl?: string;
  tags: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export class Material {
  private props: MaterialProps;

  constructor(props: MaterialProps) {
    this.props = props;
  }

  // 访问器
  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get content(): string | undefined {
    return this.props.content;
  }

  get fileUrl(): string | undefined {
    return this.props.fileUrl;
  }

  get tags(): string[] {
    return [...this.props.tags];
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

  get isPublic(): boolean {
    return this.props.isPublic;
  }

  // 修改器
  updateTitle(title: string): void {
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.props.description = description;
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

  setPublicStatus(isPublic: boolean): void {
    this.props.isPublic = isPublic;
    this.props.updatedAt = new Date();
  }
} 