/**
 * 思维导图本地存储仓库 - 使用浏览器的localStorage实现数据持久化
 * 这是适配器层的一部分，实现了领域层定义的仓库接口
 */

import { MindMap } from '../../entities/MindMap';
import { MindMapRepository } from '../../use-cases/MindMapUseCases';

export class MindMapLocalStorageRepository implements MindMapRepository {
  private readonly storageKey = 'mindmap_hub_data';

  // 获取所有存储的思维导图
  private getAllMindMaps(): MindMap[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      
      // 恢复Date对象
      return parsed.map((mindMap: any) => ({
        ...mindMap,
        createdAt: new Date(mindMap.createdAt),
        updatedAt: new Date(mindMap.updatedAt)
      }));
    } catch (error) {
      console.error('Failed to load mind maps from local storage:', error);
      return [];
    }
  }

  // 保存所有思维导图到本地存储
  private saveMindMaps(mindMaps: MindMap[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(mindMaps));
    } catch (error) {
      console.error('Failed to save mind maps to local storage:', error);
      throw new Error('Failed to save mind maps');
    }
  }

  // 通过ID查找思维导图
  async findById(id: string): Promise<MindMap | null> {
    const mindMaps = this.getAllMindMaps();
    return mindMaps.find(mindMap => mindMap.id === id) || null;
  }

  // 获取所有思维导图
  async findAll(): Promise<MindMap[]> {
    return this.getAllMindMaps();
  }

  // 获取指定用户的思维导图
  async findByOwner(ownerId: string): Promise<MindMap[]> {
    const mindMaps = this.getAllMindMaps();
    return mindMaps.filter(mindMap => mindMap.ownerId === ownerId);
  }

  // 获取所有公开的思维导图
  async findPublic(): Promise<MindMap[]> {
    const mindMaps = this.getAllMindMaps();
    return mindMaps.filter(mindMap => mindMap.isPublic);
  }

  // 保存思维导图
  async save(mindMap: MindMap): Promise<MindMap> {
    const mindMaps = this.getAllMindMaps();
    const existingIndex = mindMaps.findIndex(m => m.id === mindMap.id);
    
    if (existingIndex >= 0) {
      // 更新现有的思维导图
      mindMaps[existingIndex] = {
        ...mindMap,
        updatedAt: new Date()
      };
    } else {
      // 添加新的思维导图
      mindMaps.push({
        ...mindMap,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    this.saveMindMaps(mindMaps);
    return mindMap;
  }

  // 删除思维导图
  async delete(id: string): Promise<boolean> {
    const mindMaps = this.getAllMindMaps();
    const initialLength = mindMaps.length;
    
    const filteredMindMaps = mindMaps.filter(mindMap => mindMap.id !== id);
    
    if (filteredMindMaps.length === initialLength) {
      return false; // 没有找到要删除的思维导图
    }
    
    this.saveMindMaps(filteredMindMaps);
    return true;
  }
} 