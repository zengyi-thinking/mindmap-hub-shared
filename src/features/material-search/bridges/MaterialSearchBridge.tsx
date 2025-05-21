/**
 * 材料搜索桥接组件
 * 
 * 该文件作为旧架构(features/material-search)到新架构(domains)的桥接层
 * 保持向后兼容性，同时允许项目结构逐步迁移
 */

// 由于material-search功能已经在features和components目录下实现，
// 这个桥接文件暂时只导出原有文件，未来会逐步迁移到domains/material-search目录

// 导出原有组件
export { default as MaterialSearchContainer } from '../MaterialSearchContainer';
export { default as MaterialMindMapGenerator } from '../MaterialMindMapGenerator';
export { default as MaterialMindMapViewer } from '../MaterialMindMapViewer';
export { default as MaterialPreviewDialog } from '../MaterialPreviewDialog';
export { default as MaterialSearchTabs } from '../MaterialSearchTabs';
export { default as MaterialSearchResults } from '../MaterialSearchResults';
export { default as MaterialSearchControls } from '../MaterialSearchControls';
export { default as MaterialUploadDialog } from '../MaterialUploadDialog';
export { default as PublicMindMapsGrid } from '../PublicMindMapsGrid';

// 导出原有工具和数据
export { default as MockData } from '../MockData';

/**
 * 以下注释描述了future/TODO：未来材料搜索功能迁移到domains架构的计划
 * 
 * 1. 创建实体
 *    - SearchQuery - 搜索查询实体
 *    - SearchResult - 搜索结果实体
 *    - MindMapNode - 思维导图节点实体
 * 
 * 2. 创建用例
 *    - SearchMaterialsUseCase - 搜索材料用例
 *    - GenerateMindMapUseCase - 生成思维导图用例
 * 
 * 3. 创建仓库接口和实现
 *    - MaterialSearchRepository - 材料搜索仓库接口
 *    - LocalStorageMaterialSearchRepository - 本地存储实现
 * 
 * 4. 创建控制器
 *    - MaterialSearchController - 处理搜索和思维导图生成请求
 * 
 * 5. 迁移UI组件到external/ui目录
 *    - 将现有UI组件重构为使用新架构的实体和用例
 */ 