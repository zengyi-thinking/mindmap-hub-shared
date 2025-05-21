/**
 * ai-tools 领域模块
 * 
 * 这是一个基于领域驱动设计的领域模块，包含：
 * - 实体（entities）: 领域内的核心数据结构和业务规则
 * - 用例（use-cases）: 领域内的业务逻辑实现
 * - 适配器（adapters）: 连接领域与外部系统的接口
 * - 外部接口（external）: 与外部系统交互的具体实现
 */

// 导出领域实体
export * from './entities';

// 导出领域用例
export * from './use-cases';

// 导出领域类型
export * from './types';

// 导出UI组件
export * from './external/ui';

// 导出API接口
export * from './external/api';

// 导出工具函数
export * from './external/utils';
