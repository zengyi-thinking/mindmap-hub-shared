// 实体
export { Material, type MaterialProps } from './entities/Material';

// 仓库接口
export { type MaterialRepository } from './adapters/gateways/MaterialRepository';
export { LocalStorageMaterialRepository } from './adapters/gateways/LocalStorageMaterialRepository';

// 用例
export { 
  type GetMaterialByIdUseCase,
  GetMaterialById
} from './use-cases/GetMaterialByIdUseCase';

// 控制器
export { MaterialController } from './adapters/controllers/MaterialController';

// UI组件
export { MaterialCard } from './external/ui/MaterialCard'; 