/**
 * 材料模块桥接组件
 * 
 * 该文件作为旧架构(modules/features)到新架构(domains)的桥接层
 * 保持向后兼容性，同时允许项目结构逐步迁移
 */

import React from 'react';
import { 
  Material, 
  MaterialProps, 
  MaterialCard,
  LocalStorageMaterialRepository,
  GetMaterialById,
  MaterialController
} from '../../../domains/materials';

// 导出材料实体和相关类型
export { Material, type MaterialProps } from '../../../domains/materials';

// 实例化仓库、用例和控制器
const materialRepository = new LocalStorageMaterialRepository();
const getMaterialByIdUseCase = new GetMaterialById(materialRepository);
const materialController = new MaterialController(getMaterialByIdUseCase);

// 导出桥接Hook和函数

/**
 * 获取材料列表的Hook
 */
export const useMaterials = () => {
  const [materials, setMaterials] = React.useState<Material[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const result = await materialRepository.findAll();
        setMaterials(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return { materials, loading, error };
};

/**
 * 获取单个材料的Hook
 */
export const useMaterial = (id: string) => {
  const [material, setMaterial] = React.useState<Material | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const result = await materialController.getMaterial(id);
        setMaterial(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  return { material, loading, error };
};

/**
 * 保存材料
 */
export const saveMaterial = async (material: Material): Promise<void> => {
  await materialRepository.save(material);
};

/**
 * 创建新材料
 */
export const createMaterial = (data: Omit<MaterialProps, 'id' | 'createdAt' | 'updatedAt'>): Material => {
  const props = materialController.createMaterial(data as any);
  return new Material(props);
};

// 导出UI组件
export { MaterialCard } from '../../../domains/materials'; 