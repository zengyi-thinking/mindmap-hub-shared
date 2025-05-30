# 架构迁移策略文档

## 总体目标

将项目从当前的混合架构（features/modules/domains）逐步迁移到统一的领域驱动设计(DDD)架构，提高代码的可维护性和可扩展性。

## 当前架构状态

目前项目包含三种不同的架构模式：

1. **按功能划分的架构**（`src/features`目录）
2. **按模块划分的架构**（`src/modules`目录）
3. **领域驱动设计架构**（`src/domains`目录）- 目前仅思维导图功能采用此架构

此外，项目还包含传统 React 项目的目录结构，如`components`、`pages`、`contexts`等。

## 迁移计划

### 阶段一：完成核心领域迁移 (已开始)

1. **思维导图领域** ✅ _已完成_
2. **材料领域** ⏳ _进行中_
   - 已创建基础实体和接口
   - 已实现本地存储仓库
   - 已创建桥接组件
3. **讨论领域** ⏳ _进行中_
   - 已创建基础实体
   - 待实现仓库和用例

### 阶段二：迁移其他功能

4. **AI 工具领域**

   - 创建`src/domains/ai-tools`目录及其子结构
   - 实现相关实体、用例和适配器
   - 创建桥接组件

5. **用户领域**
   - 创建`src/domains/users`目录及其子结构
   - 实现用户相关实体和仓库
   - 创建桥接组件

### 阶段三：统一 UI 组件和页面

1. 将`src/components`目录中的组件逐步迁移到对应领域的`external/ui`目录
2. 将`src/pages`目录中的页面重构为使用领域组件
3. 创建领域特定的 Context，替代全局 Context

### 阶段四：清理和优化

1. 移除冗余的`features`和`modules`目录
2. 统一命名约定和代码风格
3. 更新导入路径以使用新的领域结构
4. 删除未使用的代码和文件

## 架构规范

### 领域目录结构

每个领域目录应遵循以下结构：

```
src/domains/[domain-name]/
├── adapters/
│   ├── controllers/     # 处理外部请求的控制器
│   ├── gateways/        # 仓库接口和实现
│   └── presenters/      # 数据转换和展示逻辑
├── entities/            # 领域实体和值对象
├── use-cases/           # 业务用例实现
├── external/
│   ├── ui/              # 领域特定UI组件
│   ├── utils/           # 领域特定工具函数
│   └── frameworks/      # 外部框架集成
└── index.ts             # 导出公共API
```

### 领域间通信

- 领域之间应通过接口进行通信，不应直接依赖其他领域的实现细节
- 跨领域的共享代码应放在`shared`目录中

### 向后兼容性

- 为每个迁移的领域创建桥接文件，放置在原来的目录结构中
- 桥接文件导入新领域的功能并重新导出，保持对现有代码的兼容性
- 随着项目稳定，逐步更新导入路径，最终移除桥接文件

## 质量保证

- 每个迁移的领域应包含单元测试
- 进行 code review 确保遵循架构规范
- 定期进行端到端测试，确保功能正常

## 迁移进度跟踪

| 领域     | 阶段   | 进度 | 负责人 |
| -------- | ------ | ---- | ------ |
| 思维导图 | 完成   | 100% | -      |
| 材料     | 实现中 | 40%  | -      |
| 讨论     | 实现中 | 20%  | -      |
| AI 工具  | 计划中 | 0%   | -      |
| 用户     | 计划中 | 0%   | -      |

## 结论

通过遵循本文档中的迁移策略，我们将逐步将项目转变为一个结构清晰、模块化的领域驱动设计架构。这将提高代码可维护性，简化开发流程，并为未来的功能扩展提供坚实基础。
