# 类型定义说明

## 类型定义迁移说明

本项目正在将类型定义从全局 src/types 目录迁移至各个领域目录的 	ypes.ts 文件中。

### 迁移原则

1. 领域特定的类型应位于各自的领域目录下的 	ypes.ts 文件中
2. 跨领域共享的类型可以保留在全局 src/types 目录中
3. 迁移过程中会逐步更新导入路径

### 领域类型文件位置

- 思维导图领域: src/domains/mindmap/types.ts
- 材料领域: src/domains/materials/types.ts
- 讨论领域: src/domains/discussions/types.ts
- 用户领域: src/domains/users/types.ts
- 认证领域: src/domains/auth/types.ts
- 材料搜索领域: src/domains/material-search/types.ts

### 迁移进度

- [ ] 思维导图类型
- [ ] 材料类型
- [ ] 讨论类型
- [ ] 用户类型
- [ ] 认证类型
- [ ] 材料搜索类型

