/**
 * 思维导图模块入口
 * 提供思维导图功能的主要访问点
 */

// 实体导出
export * from './entities/MindMap';

// 用例导出
export * from './use-cases/MindMapUseCases';

// 控制器导出
export { MindMapController } from './adapters/controllers/MindMapController';

// 仓库实现导出
export { MindMapLocalStorageRepository } from './adapters/gateways/MindMapLocalStorageRepository';

// 展示层导出
export { 
  MindMapPresenter,
  type MindMapViewModel,
  type MindMapNodeViewModel,
  type MindMapListItemViewModel
} from './adapters/presenters/MindMapPresenter';

// UI组件导出
export { MindMapComponent } from './external/ui/MindMapComponent';
export { CreateMindMapDialog } from './external/ui/CreateMindMapDialog';
export { default as MermaidMindMap } from './external/ui/components/MermaidMindMap';
export { MaterialMermaidMindMap } from './external/ui/components/MaterialSearchMindMap';

// 工具导出
export * from './external/utils/mermaidGenerator'; 

// UI Hooks导出
export * from './external/ui/hooks';

// MindMap生成器导出
export * from './external/utils/mindmap/MindMapGenerator';
