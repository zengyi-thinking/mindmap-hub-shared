import { Material, MaterialProps } from "../../entities/Material";
import { GetMaterialByIdUseCase } from "../../use-cases/GetMaterialByIdUseCase";

interface CreateMaterialRequest {
  title: string;
  description: string;
  content?: string;
  fileUrl?: string;
  tags: string[];
  authorId: string;
  isPublic: boolean;
}

/**
 * 材料控制器
 * 处理材料相关的API请求
 */
export class MaterialController {
  constructor(
    private readonly getMaterialByIdUseCase: GetMaterialByIdUseCase
  ) {}

  /**
   * 获取材料
   */
  async getMaterial(id: string): Promise<Material | null> {
    try {
      return await this.getMaterialByIdUseCase.execute(id);
    } catch (error) {
      console.error('Error getting material:', error);
      throw error;
    }
  }

  /**
   * 创建新材料
   */
  createMaterial(request: CreateMaterialRequest): MaterialProps {
    const now = new Date();
    
    return {
      id: this.generateId(),
      title: request.title,
      description: request.description,
      content: request.content,
      fileUrl: request.fileUrl,
      tags: request.tags,
      authorId: request.authorId,
      createdAt: now,
      updatedAt: now,
      isPublic: request.isPublic
    };
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
} 