import { Material } from "../entities/Material";
import { MaterialRepository } from "../adapters/gateways/MaterialRepository";

/**
 * 获取材料用例接口
 */
export interface GetMaterialByIdUseCase {
  execute(id: string): Promise<Material | null>;
}

/**
 * 获取材料用例实现
 */
export class GetMaterialById implements GetMaterialByIdUseCase {
  constructor(private readonly materialRepository: MaterialRepository) {}

  /**
   * 执行获取材料用例
   * @param id 材料ID
   * @returns 材料实体或null(如果不存在)
   */
  async execute(id: string): Promise<Material | null> {
    return this.materialRepository.findById(id);
  }
} 