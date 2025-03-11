# 思维导图共享平台

## 项目简介

**思维导图共享平台**是一个专门为学习者设计的知识整理与分享平台。用户可以创建思维导图、上传学习资料、通过标签搜索内容，并与其他学习者交流讨论。

## 主要功能

- **思维导图创建与管理** - 轻松创建和管理思维导图，整理知识结构和思路
- **学习资料分享** - 上传和分享学习资料，添加标签便于分类和查找
- **标签化思维导图搜索** - 通过标签搜索学习资料，以思维导图形式呈现结果
- **讨论交流** - 就学习话题展开讨论，与其他用户交流经验和想法
- **社区互动** - 加入学习社区，结交志同道合的朋友，共同进步
- **用户角色管理** - 支持普通用户和管理员角色，管理员可管理平台资料和用户

## 技术栈

本项目使用以下技术开发：

- **Vite** - 前端构建工具
- **React** - 前端 UI 框架
- **TypeScript** - 静态类型检查
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Shadcn UI** - 组件库
- **React Router** - 路由管理
- **Framer Motion** - 动画效果
- **LocalStorage** - 本地数据存储

## 如何运行

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

## 部署信息

该项目已部署在 GitHub Pages 上，可通过以下链接访问：

**在线体验地址**: [https://zengyi-thinking.github.io/mindmap-hub-shared/](https://zengyi-thinking.github.io/mindmap-hub-shared/)

## 用户指南

### 普通用户账号

- 可以通过注册功能创建新账号
- 可以查看和创建思维导图、上传学习资料、参与讨论等

### 管理员账号

- 用户名: `admin`
- 密码: `000000`
- 拥有所有普通用户权限，并可以管理平台资料和用户
