import { Material, MaterialProps } from "../../entities/Material";
import { MaterialRepository } from "./MaterialRepository";

/**
 * 本地存储材料仓库实现
 * 使用浏览器的LocalStorage实现材料持久化
 */
export class LocalStorageMaterialRepository implements MaterialRepository {
  private readonly STORAGE_KEY = "materials";

  /**
   * 保存材料
   * @param material 材料实体
   */
  async save(material: Material): Promise<void> {
    const materials = this.getAllMaterialsFromStorage();
    const existingIndex = materials.findIndex(m => m.id === material.id);
    
    if (existingIndex >= 0) {
      // 更新现有材料
      materials[existingIndex] = this.materialToProps(material);
    } else {
      // 添加新材料
      materials.push(this.materialToProps(material));
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(materials));
  }

  /**
   * 根据ID查找材料
   * @param id 材料ID
   */
  async findById(id: string): Promise<Material | null> {
    const materials = this.getAllMaterialsFromStorage();
    const materialProps = materials.find(m => m.id === id);
    
    return materialProps ? new Material(materialProps) : null;
  }

  /**
   * 查找所有材料
   */
  async findAll(): Promise<Material[]> {
    const materials = this.getAllMaterialsFromStorage();
    return materials.map(props => new Material(props));
  }

  /**
   * 根据标签查找材料
   * @param tags 标签数组
   */
  async findByTags(tags: string[]): Promise<Material[]> {
    const materials = this.getAllMaterialsFromStorage();
    const filteredMaterials = materials.filter(m => 
      tags.some(tag => m.tags.includes(tag))
    );
    
    return filteredMaterials.map(props => new Material(props));
  }

  /**
   * 查找用户的所有材料
   * @param authorId 用户ID
   */
  async findByAuthorId(authorId: string): Promise<Material[]> {
    const materials = this.getAllMaterialsFromStorage();
    const userMaterials = materials.filter(m => m.authorId === authorId);
    
    return userMaterials.map(props => new Material(props));
  }

  /**
   * 根据ID删除材料
   * @param id 材料ID
   */
  async deleteById(id: string): Promise<void> {
    const materials = this.getAllMaterialsFromStorage();
    const filteredMaterials = materials.filter(m => m.id !== id);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredMaterials));
  }

  /**
   * 根据标题搜索材料
   * @param query 搜索关键词
   */
  async searchByTitle(query: string): Promise<Material[]> {
    const materials = this.getAllMaterialsFromStorage();
    const searchResults = materials.filter(m => 
      m.title.toLowerCase().includes(query.toLowerCase())
    );
    
    return searchResults.map(props => new Material(props));
  }

  /**
   * 从本地存储获取所有材料数据
   */
  private getAllMaterialsFromStorage(): MaterialProps[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    try {
      const parsedData = JSON.parse(data) as MaterialProps[];
      
      // 确保日期字段是Date对象
      return parsedData.map(m => ({
        ...m,
        createdAt: new Date(m.createdAt),
        updatedAt: new Date(m.updatedAt)
      }));
    } catch (error) {
      console.error('Error parsing materials from localStorage:', error);
      return [];
    }
  }

  /**
   * 将材料实体转换为可序列化的对象
   */
  private materialToProps(material: Material): MaterialProps {
    return {
      id: material.id,
      title: material.title,
      description: material.description,
      content: material.content,
      fileUrl: material.fileUrl,
      tags: material.tags,
      authorId: material.authorId,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
      isPublic: material.isPublic
    };
  }
} 