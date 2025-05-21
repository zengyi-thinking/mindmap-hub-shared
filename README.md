# 🧠 思维导图共享平台

<p align="center">
  <img src="./public/paimon.svg" alt="思维导图共享平台Logo" width="120" height="120"/>
</p>

## 📖 项目简介

**思维导图共享平台**是一个专门为学习者设计的知识整理与分享平台。用户可以创建思维导图、上传学习资料、通过标签搜索内容，并与其他学习者交流讨论。

### 🎯 设计目标

- 为学习者提供一个直观的知识组织工具
- 促进知识的共享与交流
- 建立一个活跃的学习社区
- 通过可视化的方式展示知识结构，提高学习效率

## ✨ 主要功能

- 🗺️ **思维导图创建与管理** - 轻松创建和管理思维导图，整理知识结构和思路
- 📚 **学习资料分享** - 上传和分享学习资料，添加标签便于分类和查找
- 🔍 **标签化思维导图搜索** - 通过标签搜索学习资料，以思维导图形式呈现结果
- 💬 **讨论交流** - 就学习话题展开讨论，与其他用户交流经验和想法
- 👥 **社区互动** - 加入学习社区，结交志同道合的朋友，共同进步
- 👤 **用户角色管理** - 支持普通用户和管理员角色，管理员可管理平台资料和用户

## 🛠️ 技术栈

本项目使用以下技术开发：

- ⚡ **[Vite](https://vitejs.dev/)** (v4.x) - 现代前端构建工具，提供极速的开发体验
- ⚛️ **[React](https://reactjs.org/)** (v18.x) - 用于构建用户界面的 JavaScript 库
- 📘 **[TypeScript](https://www.typescriptlang.org/)** (v5.x) - JavaScript 的超集，提供类型检查
- 🎨 **[Tailwind CSS](https://tailwindcss.com/)** (v3.x) - 实用优先的 CSS 框架
- 🧩 **[Shadcn UI](https://ui.shadcn.com/)** - 高质量的 React 组件库
- 🧭 **[React Router](https://reactrouter.com/)** (v6.x) - React 应用的声明式路由
- 🎬 **[Framer Motion](https://www.framer.com/motion/)** - 强大的 React 动画库
- 💾 **LocalStorage** - 浏览器本地数据存储

## 📷 项目截图

<p align="center">
  <img src="./public/og-image.png" alt="思维导图共享平台截图" width="600"/>
</p>

## 🚀 如何运行

1. 克隆仓库

```sh
git clone https://github.com/zengyi-thinking/mindmap-hub-shared.git
```

2. 安装依赖

```sh
cd mindmap-hub-shared
npm install
```

3. 启动开发服务器

```sh
npm run dev
```

4. 访问本地开发服务器

```
http://localhost:8080
```

5. 构建项目并预览

```sh
npm run build
npm start
```

## 🌐 部署信息

该项目已部署在 GitHub Pages 上，可通过以下链接访问：

**🔗 在线体验地址**: [https://zengyi-thinking.github.io/mindmap-hub-shared/](https://zengyi-thinking.github.io/mindmap-hub-shared/)

### 📦 GitHub Pages 部署步骤

1. 构建项目

```sh
npm run build
```

2. 推送代码到 GitHub

```sh
git add .
git commit -m "Update build for GitHub Pages"
git push
```

3. GitHub Actions 会自动部署最新代码到 GitHub Pages
   - 部署工作流配置在 `.github/workflows/deploy.yml`
   - 构建后的文件会被部署到 `gh-pages` 分支

## ❓ 常见问题解决

### "npm start"脚本找不到

如果遇到 "Missing script: start" 错误，请确保 package.json 中包含了 start 脚本：

```json
"scripts": {
  "start": "vite preview --port 8080"
}
```

### 部署后资源路径错误

确保 vite.config.ts 中设置了正确的 base 路径：

```ts
base: '/mindmap-hub-shared/', // 替换为你的GitHub仓库名
```

## 👥 用户指南

### 普通用户账号

- 可以通过注册功能创建新账号
- 可以查看和创建思维导图、上传学习资料、参与讨论等

### 管理员账号

- 用户名: `admin`
- 密码: `000000`
- 拥有所有普通用户权限，并可以管理平台资料和用户

## 🤝 贡献指南

我们欢迎所有形式的贡献，无论是新功能、bug 修复还是文档改进。请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## AI 助手功能

思维导图中心集成了智能 AI 助手，帮助用户理解和创建思维导图。

### 主要功能

- **智能对话**: 用户可以与 AI 助手进行对话，获取关于思维导图的建议和帮助
- **多种 AI 服务支持**: 支持 OpenAI、DeepSeek、豆包等多种 AI 服务提供商，您可以自由选择
- **本地回复功能**: 无需 API 密钥也能获得基本的回复支持
- **API 密钥设置**: 支持用户设置自己的 API 密钥，确保数据安全和隐私
- **多种模型选择**: 针对不同提供商，支持选择不同的模型类型
- **多种交互方式**: 支持简单悬浮按钮和带预览气泡的两种交互方式
- **可拖拽定位**: AI 助手悬浮球可以拖拽到屏幕任意位置，并记住上次的位置
- **响应式设计**: 适配各种屏幕尺寸，确保最佳的用户体验

### 使用方法

1. 点击屏幕右下角的悬浮 AI 助手图标，打开对话界面
2. 输入你关于思维导图的问题或需求
3. AI 助手会提供相关的回答和建议
4. 点击设置图标，可以选择不同的 AI 服务提供商，并配置相应的 API 密钥

### 支持的 AI 服务提供商

- **本地模式**: 无需 API 密钥，使用预设回复
- **OpenAI**: 支持 GPT-3.5 Turbo、GPT-4、GPT-4 Turbo 等模型
- **DeepSeek**: 支持 DeepSeek Chat、DeepSeek Coder 等模型
- **豆包**: 支持豆包 Lite、豆包 Pro 等模型

### 技术实现

- 使用 React 和 TypeScript 构建前端界面
- 使用 Framer Motion 实现平滑的动画和拖拽效果
- 集成多种 AI API 服务，支持统一的对话接口
- 使用本地存储保存用户设置和位置信息，确保数据隐私

## 📂 项目结构

```
mindmap-hub-shared/
├── public/                      # 静态资源文件夹
│   ├── paimon.svg               # 项目logo
│   └── ...                      # 其他静态资源
├── src/                         # 源代码目录
│   ├── app/                     # 应用全局配置
│   ├── assets/                  # 项目资源文件
│   ├── components/              # 共享UI组件
│   │   ├── ai/                  # AI助手相关组件
│   │   ├── dashboard/           # 仪表盘相关组件
│   │   ├── global/              # 全局通用组件
│   │   ├── material-search/     # 资料搜索组件
│   │   ├── profile/             # 用户资料组件
│   │   ├── shared/              # 共享组件
│   │   ├── sidebar/             # 侧边栏组件
│   │   ├── theme/               # 主题相关组件
│   │   └── ui/                  # 基础UI组件
│   ├── config/                  # 配置文件
│   ├── contexts/                # React上下文(Context)
│   │   ├── SidebarContext.tsx   # 侧边栏状态管理
│   │   └── ThemeContext.tsx     # 主题状态管理
│   ├── data/                    # 数据及模拟数据
│   ├── domains/                 # 领域驱动设计实现
│   │   └── mindmap/             # 思维导图领域(Clean Architecture)
│   │       ├── adapters/        # 适配器层
│   │       ├── entities/        # 实体层
│   │       ├── external/        # 外部集成
│   │       └── use-cases/       # 用例层
│   ├── features/                # 功能模块
│   │   ├── ai-tools/            # AI工具功能
│   │   ├── discussions/         # 讨论功能
│   │   ├── material-search/     # 资料搜索功能
│   │   └── materials/           # 资料管理功能
│   ├── layouts/                 # 页面布局组件
│   ├── lib/                     # 第三方库集成
│   ├── modules/                 # 应用模块
│   │   ├── discussions/         # 讨论模块
│   │   ├── materials/           # 资料模块
│   │   └── mindmap/             # 思维导图模块
│   │       ├── bridges/         # 桥接组件(用于兼容性)
│   │       ├── components/      # 模块专用组件
│   │       └── hooks/           # 模块专用Hooks
│   ├── pages/                   # 页面组件
│   │   ├── admin/               # 管理员页面
│   │   ├── auth/                # 认证页面
│   │   ├── dashboard/           # 仪表盘页面
│   │   ├── discussions/         # 讨论页面
│   │   ├── error/               # 错误页面
│   │   ├── home/                # 首页
│   │   ├── material/            # 资料页面
│   │   ├── material-search/     # 资料搜索页面
│   │   ├── mindmap/             # 思维导图页面
│   │   └── profile/             # 用户资料页面
│   ├── services/                # 服务层
│   │   ├── api/                 # API服务
│   │   ├── file-upload.ts       # 文件上传服务
│   │   └── mindmap.ts           # 思维导图服务
│   ├── shared/                  # 共享资源和组件
│   ├── styles/                  # 样式文件
│   ├── types/                   # TypeScript类型定义
│   ├── utils/                   # 工具函数
│   ├── App.css                  # 应用全局样式
│   ├── App.tsx                  # 应用主组件
│   ├── index.css                # 全局样式
│   ├── main.tsx                 # 应用入口文件
│   └── vite-env.d.ts           # Vite环境类型定义
├── dist/                        # 构建输出目录
├── docs/                        # 项目文档
├── node_modules/                # 依赖包
├── .git/                        # Git版本控制目录
├── .github/                     # GitHub配置(CI/CD等)
├── components.json              # Shadcn UI组件配置
├── eslint.config.js             # ESLint配置
├── index.html                   # 应用HTML入口
├── package.json                 # 项目配置和依赖
├── package-lock.json            # 依赖锁定文件
├── postcss.config.js            # PostCSS配置
├── README.md                    # 项目说明文档(当前文件)
├── README-architecture.md       # 架构说明文档
├── tailwind.config.js           # Tailwind CSS配置
├── tailwind.config.ts           # Tailwind CSS TypeScript配置
├── tsconfig.app.json            # TypeScript应用配置
├── tsconfig.json                # TypeScript主配置
├── tsconfig.node.json           # TypeScript Node配置
└── vite.config.ts               # Vite构建配置
```

## 📝 架构说明

项目当前架构混合了以下几种模式:

### 1. 按功能划分 (Features-based)

位于 `src/features` 目录，根据功能模块拆分代码，如资料搜索、讨论等。

### 2. 按模块划分 (Module-based)

位于 `src/modules` 目录，包含思维导图、讨论、资料等主要模块。

### 3. 领域驱动设计 (Domain-driven Design)

位于 `src/domains` 目录，采用清洁架构(Clean Architecture)模式，目前思维导图功能已经迁移到该模式。

### 4. 传统 React 项目结构

包含 `components`, `pages`, `contexts`, `services` 等常见目录。

### 架构演进计划

根据 README-architecture.md 文档，项目正在逐步向领域驱动设计转型，计划将其他功能模块也逐步迁移到 `domains` 目录下，统一架构模式，提高代码的模块化和可维护性。

---

<p align="center">用思维导图，让学习更高效！</p>

# 领域驱动设计架构迁移工具

这个目录包含了一组脚本，用于将项目从旧的目录结构迁移到新的领域驱动设计 (DDD) 架构。

## 迁移背景

项目正在从传统分层架构转向领域驱动设计架构，以更好地支持业务需求和未来扩展。迁移的主要目标是：

1. 减少功能重复和冗余代码
2. 建立清晰的领域边界
3. 提高代码可维护性
4. 支持团队更好地协作开发

## 迁移内容

这套工具将执行以下迁移操作：

1. **目录合并**：

   - features/discussions 和 features/discussion → domains/discussions
   - features/materials 和 modules/materials → domains/materials
   - features/material-search 和 components/material-search → domains/material-search
   - components/shared → shared/components

2. **导入路径更新**：

   - 自动更新所有受影响文件中的导入路径

3. **验证迁移**：

   - 检查新目录结构
   - 确认关键文件已迁移
   - 验证导入路径更新

4. **清理冗余目录**：
   - 移除旧的、现已冗余的目录

## 使用指南

### 准备工作

1. **备份项目**：迁移前请务必备份整个项目
2. **保存当前工作**：确保所有更改已提交到版本控制系统

### 执行迁移

有两种执行迁移的方式：

#### 方式一：全自动迁移（推荐）

运行主迁移脚本：

```powershell
.\migrate-to-ddd.ps1
```

此脚本将引导您完成整个迁移过程，包括目录合并、导入路径更新、验证和清理。

#### 方式二：手动分步执行

如果您想控制迁移的每个步骤，可以按顺序手动执行以下脚本：

1. **合并目录**：

   ```powershell
   .\merge-directories.ps1
   ```

2. **更新导入路径**：

   ```powershell
   .\update-imports.ps1
   ```

3. **验证迁移**：

   ```powershell
   .\verify-migration.ps1
   ```

4. **清理冗余目录**（可选，仅在确认一切正常后执行）：
   ```powershell
   .\cleanup-directories.ps1
   ```

### 迁移后检查

迁移完成后，请执行以下检查：

1. 启动应用并测试所有功能
2. 检查控制台是否有错误报告
3. 浏览应用的各个页面和功能，确保一切正常

## 故障排除

如果在迁移过程中遇到问题：

1. 查看生成的日志文件（形如 `*_log_timestamp.txt`）
2. 如果发现导入路径问题，可能需要手动修复一些特殊案例
3. 如果验证失败，请查看失败详情并解决指出的问题

## 回滚方案

如果需要回滚迁移：

1. 使用之前创建的备份恢复项目
2. 或者使用版本控制系统恢复到迁移前的状态

## 文件说明

- `migrate-to-ddd.ps1`：主迁移脚本，执行完整迁移流程
- `merge-directories.ps1`：合并目录脚本
- `update-imports.ps1`：更新导入路径脚本
- `verify-migration.ps1`：验证迁移结果脚本
- `cleanup-directories.ps1`：清理冗余目录脚本

每个脚本都会生成详细的日志文件，记录执行过程和结果。
