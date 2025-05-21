# 项目优化工具集

本目录包含了一系列用于项目结构优化、代码重构和架构改进的工具脚本。这些脚本主要采用 PowerShell 编写，旨在帮助开发团队实现代码质量提升和架构演进。

## 工具脚本目录结构

- **cleanup/** - 清理和归档相关工具
- **migration/** - 代码迁移与重构相关工具
- **utils/** - 通用工具和辅助脚本

## 主要工具脚本

### 组织与优化脚本

- **organize-project.ps1** - 主入口脚本，用于执行所有优化操作
  - 使用方法: `.\organize-project.ps1 [参数]`
  - 支持跳过特定操作的参数，详情可使用 `.\organize-project.ps1 -?` 查看

### 清理工具 (cleanup/)

- **cleanup-backups.ps1** - 处理项目备份目录
  - 支持两种模式: 归档(默认)和删除
  - 使用方法: `.\scripts\cleanup\cleanup-backups.ps1 [-archiveMode|-deleteMode]`

### 迁移工具 (migration/)

- **create-domain-structure.ps1** - 创建领域驱动设计的目录结构

  - 为每个领域创建完整的 DDD 目录结构及初始文件
  - 使用方法: `.\scripts\migration\create-domain-structure.ps1`

- **merge-directories.ps1** - 合并重复目录到领域目录

  - 将旧目录结构中的功能代码合并到新的领域目录
  - 使用方法: `.\scripts\migration\merge-directories.ps1`

- **update-imports.ps1** - 更新导入路径以适应新目录结构
  - 扫描项目代码并更新 import 语句
  - 使用方法: `.\scripts\migration\update-imports.ps1`

### 工具脚本 (utils/)

- **organize-scripts.ps1** - 整理脚本文件

  - 将脚本文件分类整理到对应目录
  - 使用方法: `.\scripts\utils\organize-scripts.ps1`

- **organize-types.ps1** - 类型定义优化

  - 按领域重新组织 TypeScript 类型定义
  - 使用方法: `.\scripts\utils\organize-types.ps1`

- **initialize-domains-types.ps1** - 初始化领域类型定义

  - 为领域目录创建初始类型定义文件
  - 使用方法: `.\scripts\utils\initialize-domains-types.ps1`

- **organize-assets.ps1** - 资源文件组织

  - 按类型整理 src/assets 目录中的资源文件
  - 使用方法: `.\scripts\utils\organize-assets.ps1`

- **organize-configs.ps1** - 配置文件整合
  - 整合项目配置文件并移至专用目录
  - 使用方法: `.\scripts\utils\organize-configs.ps1`

## 使用建议

### 执行优先级

建议按以下顺序执行优化脚本:

1. 备份项目代码
2. 执行脚本组织 (`organize-scripts.ps1`)
3. 执行备份清理 (`cleanup-backups.ps1`)
4. 创建领域目录结构 (`create-domain-structure.ps1`)
5. 初始化领域类型 (`initialize-domains-types.ps1`)
6. 组织资源和配置文件 (`organize-assets.ps1`, `organize-configs.ps1`)
7. 执行目录合并 (`merge-directories.ps1`)
8. 更新导入路径 (`update-imports.ps1`)

或者，您可以直接使用主脚本执行所有步骤:

```powershell
.\organize-project.ps1
```

### 日志记录

所有脚本执行过程都会生成时间戳日志文件，便于追踪操作过程和问题排查。日志文件保存在项目根目录下，命名格式为`*_log_YYYYMMDD_HHMMSS.txt`。

### 安全保障

- 所有脚本在执行破坏性操作前都会要求确认
- 使用`-forceExecution`参数可跳过确认步骤
- 大多数脚本会创建备份文件，以防止数据丢失

## 架构优化路线图

完整的架构优化路线图详见 [架构实施路线图](../docs/architecture-roadmap.md)。
