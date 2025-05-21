/**
 * 思维导图控制器 - 处理来自UI层的请求并调用用例
 * 控制器层是适配器的一部分，连接外部世界和应用的用例
 */

import { 
  createMindMapUseCase, 
  getMindMapUseCase,
  getUserMindMapsUseCase,
  getPublicMindMapsUseCase,
  updateMindMapInfoUseCase,
  addMindMapNodeUseCase,
  updateMindMapNodeUseCase,
  removeMindMapNodeUseCase,
  deleteMindMapUseCase,
  MindMapRepository
} from '../../use-cases/MindMapUseCases';
import { MindMap } from '../../entities/MindMap';

export class MindMapController {
  private repository: MindMapRepository;

  constructor(repository: MindMapRepository) {
    this.repository = repository;
  }

  // 创建新的思维导图
  async createMindMap(
    title: string,
    ownerId: string,
    rootText: string = "中心主题",
    isPublic: boolean = false,
    description?: string,
    tags?: string[]
  ): Promise<MindMap> {
    return await createMindMapUseCase(
      this.repository,
      title,
      ownerId,
      rootText,
      isPublic,
      description,
      tags
    );
  }

  // 获取思维导图详情
  async getMindMap(id: string): Promise<MindMap> {
    return await getMindMapUseCase(this.repository, id);
  }

  // 获取用户的所有思维导图
  async getUserMindMaps(ownerId: string): Promise<MindMap[]> {
    return await getUserMindMapsUseCase(this.repository, ownerId);
  }

  // 获取所有公开的思维导图
  async getPublicMindMaps(): Promise<MindMap[]> {
    return await getPublicMindMapsUseCase(this.repository);
  }

  // 更新思维导图基本信息
  async updateMindMapInfo(
    id: string,
    updates: {
      title?: string;
      description?: string;
      isPublic?: boolean;
      tags?: string[];
    }
  ): Promise<MindMap> {
    return await updateMindMapInfoUseCase(this.repository, id, updates);
  }

  // 添加新节点
  async addNode(
    mindMapId: string,
    parentNodeId: string,
    text: string
  ): Promise<MindMap> {
    return await addMindMapNodeUseCase(
      this.repository,
      mindMapId,
      parentNodeId,
      text
    );
  }

  // 更新节点
  async updateNode(
    mindMapId: string,
    nodeId: string,
    text: string
  ): Promise<MindMap> {
    return await updateMindMapNodeUseCase(
      this.repository,
      mindMapId,
      nodeId,
      text
    );
  }

  // 删除节点
  async removeNode(
    mindMapId: string,
    nodeId: string
  ): Promise<MindMap> {
    return await removeMindMapNodeUseCase(
      this.repository,
      mindMapId,
      nodeId
    );
  }

  // 删除思维导图
  async deleteMindMap(
    id: string,
    ownerId: string
  ): Promise<boolean> {
    return await deleteMindMapUseCase(
      this.repository,
      id,
      ownerId
    );
  }
} 