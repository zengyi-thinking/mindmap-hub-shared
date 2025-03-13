
import { MindMap } from '../types/mindmap';

// 本地存储键名
const STORAGE_KEY = 'mindmap_hub_mindmaps';

// 思维导图存储服务
export const mindmapService = {
  // 获取所有思维导图
  getAll: (): MindMap[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  // 通过ID获取单个思维导图
  getById: (id: number): MindMap | undefined => {
    const mindmaps = mindmapService.getAll();
    return mindmaps.find(mindmap => mindmap.id === id);
  },
  
  // 添加新思维导图
  add: (mindmap: Partial<MindMap>): MindMap => {
    const mindmaps = mindmapService.getAll();
    const newId = mindmaps.length > 0 
      ? Math.max(...mindmaps.map(m => m.id)) + 1 
      : 1;
    
    const newMindMap: MindMap = {
      ...mindmap as any,
      id: newId,
      updatedAt: mindmap.updatedAt || new Date().toISOString().split('T')[0],
      starred: mindmap.starred || false,
      shared: mindmap.shared || false,
      viewCount: 0,
    } as MindMap;
    
    mindmaps.push(newMindMap);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mindmaps));
    
    return newMindMap;
  },
  
  // 更新思维导图
  update: (id: number, updates: Partial<MindMap>): MindMap | null => {
    const mindmaps = mindmapService.getAll();
    const index = mindmaps.findIndex(mindmap => mindmap.id === id);
    
    if (index === -1) return null;
    
    // 更新修改时间
    if (!updates.updatedAt) {
      updates.updatedAt = new Date().toISOString().split('T')[0];
    }
    
    const updatedMindMap = { ...mindmaps[index], ...updates };
    mindmaps[index] = updatedMindMap;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mindmaps));
    return updatedMindMap;
  },
  
  // 删除思维导图
  delete: (id: number): boolean => {
    const mindmaps = mindmapService.getAll();
    const filteredMindMaps = mindmaps.filter(mindmap => mindmap.id !== id);
    
    if (filteredMindMaps.length === mindmaps.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMindMaps));
    return true;
  },
  
  // 切换收藏状态
  toggleStarred: (id: number): MindMap | null => {
    const mindmap = mindmapService.getById(id);
    if (!mindmap) return null;
    
    return mindmapService.update(id, { starred: !mindmap.starred });
  },
  
  // 切换共享状态
  toggleShared: (id: number): MindMap | null => {
    const mindmap = mindmapService.getById(id);
    if (!mindmap) return null;
    
    return mindmapService.update(id, { shared: !mindmap.shared });
  },
  
  // 获取收藏的思维导图
  getStarred: (): MindMap[] => {
    const mindmaps = mindmapService.getAll();
    return mindmaps.filter(mindmap => mindmap.starred);
  },
  
  // 获取共享的思维导图
  getShared: (): MindMap[] => {
    const mindmaps = mindmapService.getAll();
    return mindmaps.filter(mindmap => mindmap.shared);
  },
  
  // 获取最近的思维导图
  getRecent: (limit: number = 5): MindMap[] => {
    const mindmaps = mindmapService.getAll();
    return [...mindmaps].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ).slice(0, limit);
  },
  
  // 搜索思维导图
  search: (query: string): MindMap[] => {
    if (!query.trim()) return mindmapService.getAll();
    
    const mindmaps = mindmapService.getAll();
    const lowerQuery = query.toLowerCase();
    
    return mindmaps.filter(mindmap =>
      mindmap.title.toLowerCase().includes(lowerQuery) ||
      (mindmap.description && mindmap.description.toLowerCase().includes(lowerQuery)) ||
      (mindmap.tags && mindmap.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  },
  
  // 增加查看次数
  incrementViews: (id: number): MindMap | null => {
    const mindmap = mindmapService.getById(id);
    if (!mindmap) return null;
    
    return mindmapService.update(id, { 
      viewCount: (mindmap.viewCount || 0) + 1 
    });
  }
};

// 初始化思维导图存储
export const initializeMindMapStorage = () => {
  // 如果本地存储中没有思维导图数据，则初始化为空数组
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};
