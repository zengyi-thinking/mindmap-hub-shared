/**
 * 思维导图用例 - 定义应用层的业务逻辑
 * 该层调用实体层的方法，并与外部仓库接口交互
 */

import { MindMap, MindMapNode, createMindMap, addNode, updateNode, removeNode } from '../entities/MindMap';

// 思维导图存储库接口
export interface MindMapRepository {
  findById(id: string): Promise<MindMap | null>;
  findAll(): Promise<MindMap[]>;
  findByOwner(ownerId: string): Promise<MindMap[]>;
  findPublic(): Promise<MindMap[]>;
  save(mindMap: MindMap): Promise<MindMap>;
  delete(id: string): Promise<boolean>;
}

// 创建思维导图用例
export const createMindMapUseCase = async (
  repository: MindMapRepository,
  title: string,
  ownerId: string,
  rootText: string = "中心主题",
  isPublic: boolean = false,
  description?: string,
  tags?: string[]
): Promise<MindMap> => {
  const id = `mindmap-${Date.now()}`;
  const mindMap = createMindMap(id, title, rootText, ownerId, isPublic, description, tags);
  return await repository.save(mindMap);
};

// 获取思维导图用例
export const getMindMapUseCase = async (
  repository: MindMapRepository,
  id: string
): Promise<MindMap> => {
  const mindMap = await repository.findById(id);
  if (!mindMap) {
    throw new Error(`MindMap with id ${id} not found`);
  }
  return mindMap;
};

// 获取用户的所有思维导图
export const getUserMindMapsUseCase = async (
  repository: MindMapRepository,
  ownerId: string
): Promise<MindMap[]> => {
  return await repository.findByOwner(ownerId);
};

// 获取公开的思维导图
export const getPublicMindMapsUseCase = async (
  repository: MindMapRepository
): Promise<MindMap[]> => {
  return await repository.findPublic();
};

// 更新思维导图基本信息
export const updateMindMapInfoUseCase = async (
  repository: MindMapRepository,
  id: string,
  updates: {
    title?: string;
    description?: string;
    isPublic?: boolean;
    tags?: string[];
  }
): Promise<MindMap> => {
  const mindMap = await repository.findById(id);
  if (!mindMap) {
    throw new Error(`MindMap with id ${id} not found`);
  }

  const updatedMindMap: MindMap = {
    ...mindMap,
    ...updates,
    updatedAt: new Date()
  };

  return await repository.save(updatedMindMap);
};

// 添加思维导图节点
export const addMindMapNodeUseCase = async (
  repository: MindMapRepository,
  mindMapId: string,
  parentNodeId: string,
  text: string
): Promise<MindMap> => {
  const mindMap = await repository.findById(mindMapId);
  if (!mindMap) {
    throw new Error(`MindMap with id ${mindMapId} not found`);
  }

  const updatedMindMap = addNode(mindMap, parentNodeId, text);
  return await repository.save(updatedMindMap);
};

// 更新思维导图节点
export const updateMindMapNodeUseCase = async (
  repository: MindMapRepository,
  mindMapId: string,
  nodeId: string,
  text: string
): Promise<MindMap> => {
  const mindMap = await repository.findById(mindMapId);
  if (!mindMap) {
    throw new Error(`MindMap with id ${mindMapId} not found`);
  }

  const updatedMindMap = updateNode(mindMap, nodeId, text);
  return await repository.save(updatedMindMap);
};

// 删除思维导图节点
export const removeMindMapNodeUseCase = async (
  repository: MindMapRepository,
  mindMapId: string,
  nodeId: string
): Promise<MindMap> => {
  const mindMap = await repository.findById(mindMapId);
  if (!mindMap) {
    throw new Error(`MindMap with id ${mindMapId} not found`);
  }

  const updatedMindMap = removeNode(mindMap, nodeId);
  return await repository.save(updatedMindMap);
};

// 删除思维导图
export const deleteMindMapUseCase = async (
  repository: MindMapRepository,
  id: string,
  ownerId: string
): Promise<boolean> => {
  const mindMap = await repository.findById(id);
  if (!mindMap) {
    throw new Error(`MindMap with id ${id} not found`);
  }

  if (mindMap.ownerId !== ownerId) {
    throw new Error(`User ${ownerId} is not authorized to delete mindmap ${id}`);
  }

  return await repository.delete(id);
}; 