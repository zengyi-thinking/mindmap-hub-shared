import { Material } from "../../entities/Material";

/**
 * 材料仓库接口
 * 定义对材料实体的所有持久化操作
 */
export interface MaterialRepository {
  /**
   * 保存材料
   * @param material 材料实体
   */
  save(material: Material): Promise<void>;

  /**
   * 根据ID查找材料
   * @param id 材料ID
   */
  findById(id: string): Promise<Material | null>;

  /**
   * 查找所有材料
   */
  findAll(): Promise<Material[]>;

  /**
   * 根据标签查找材料
   * @param tags 标签数组
   */
  findByTags(tags: string[]): Promise<Material[]>;

  /**
   * 查找用户的所有材料
   * @param authorId 用户ID
   */
  findByAuthorId(authorId: string): Promise<Material[]>;

  /**
   * 根据ID删除材料
   * @param id 材料ID
   */
  deleteById(id: string): Promise<void>;

  /**
   * 根据标题搜索材料
   * @param query 搜索关键词
   */
  searchByTitle(query: string): Promise<Material[]>;
} 