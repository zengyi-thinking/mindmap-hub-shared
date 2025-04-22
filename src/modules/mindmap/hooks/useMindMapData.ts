import { useState, useCallback } from "react";
import { mindMapsService } from '@/lib/storage';

export interface MindMapData {
  id: number;
  title: string;
  description: string;
  content: {
    nodes: any[];
    edges: any[];
    version: string;
  };
  tags: string[];
  updatedAt: string;
  creator: string;
  starred: boolean;
  shared: boolean;
}

// 用于思维导图数据操作的钩子
export const useMindMapData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 加载思维导图数据
  const loadMindMap = useCallback(async (id: number): Promise<MindMapData | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mindMap = await mindMapsService.getById(id);
      return mindMap;
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载思维导图失败');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 保存思维导图数据
  const saveMindMap = useCallback(async (mindMapData: MindMapData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 使用当前时间更新时间戳
      const updatedMindMap = {
        ...mindMapData,
        updatedAt: new Date().toISOString()
      };
      
      // 如果是新思维导图 (没有ID)，添加一个新项目
      if (!mindMapData.id) {
        const newId = Date.now();
        await mindMapsService.add({
          ...updatedMindMap,
          id: newId
        });
      } else {
        // 否则，更新现有思维导图
        await mindMapsService.update(mindMapData.id, updatedMindMap);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存思维导图失败');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 导出思维导图数据为JSON
  const exportMindMap = useCallback((mindMapData: MindMapData): string => {
    try {
      return JSON.stringify(mindMapData, null, 2);
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出思维导图失败');
      return '';
    }
  }, []);
  
  // 从JSON导入思维导图数据
  const importMindMap = useCallback((jsonData: string): MindMapData | null => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      // 基本验证确保数据格式正确
      if (!parsedData.content || !Array.isArray(parsedData.content.nodes) || !Array.isArray(parsedData.content.edges)) {
        throw new Error('无效的思维导图数据格式');
      }
      
      return parsedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入思维导图失败');
      return null;
    }
  }, []);
  
  return {
    isLoading,
    error,
    loadMindMap,
    saveMindMap,
    exportMindMap,
    importMindMap
  };
};
