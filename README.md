# TodoList FullStack Template: 全栈项目模板

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md) [![TypeScript](https://img.shields.io/badge/--typescript-3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/--react-61DAFB?logo=react&logoColor=000000)](https://reactjs.org/) [![NestJS](https://img.shields.io/badge/--nestjs-E0234E?logo=nestjs&logoColor=ffffff)](https://nestjs.com/) [![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

**TodoList FullStack Template** 不仅仅是一个简单的待办事项应用。它是一个**生产级、功能完备、跨平台（Web、Mobile、Server）** 的项目模板，旨在展示如何使用业界领先的技术栈构建现代化、可扩展且高内聚的应用程序。

本项目是您启动下一个全栈项目的**理想脚手架**，也是深入学习 Monorepo 架构、TypeScript 前后端实践以及 AI 辅助编程的绝佳范例。

## ✨ 核心理念与架构

我们采用 **PNPM Workspaces** 驱动的 **Monorepo** 架构，将整个项目视为一个统一的、多包的代码库。这种策略带来了无与伦比的优势：

-   **极致的代码复用**: 在 `packages` 目录中沉淀通用逻辑，如 `ui` 组件库、`datasource` 数据源定义和 `shared` 工具函数，供所有应用 (`apps`) 消费。
-   **一致的开发体验**: 单一的构建、测试和 linting 流程，简化的依赖管理，以及跨项目的原子性提交。
-   **清晰的权责边界**: `apps` 专注于特定平台的应用实现，而 `packages` 专注于提供高内聚的、可复用的功能模块。

### 项目结构概览

```
.
├── apps
│   ├── mobile         # React Native (Expo) 移动端应用
│   ├── server         # NestJS 后端服务
│   └── web            # React (Vite) Web 应用
│
├── packages
│   ├── datasource     # 数据源层 (e.g., TypeORM 实体, DTOs)
│   ├── shared         # 跨端通用工具库 (e.g., 格式化, 常量)
│   └── ui             # 共享 React UI 组件库
│
├── .vscode            # VSCode 调试与任务配置
├── package.json       # Monorepo 根配置
├── pnpm-workspace.yaml # PNPM 工作区定义
└── tsconfig.base.json # 全局 TypeScript 基础配置
```

## 🛠️ 技术栈一览

| 分类             | 技术                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| **工作区管理**   | [PNPM Workspaces](https://pnpm.io/workspaces)                        |
| **语言**         | [TypeScript](https://www.typescriptlang.org/)                        |
| **Web 前端**     | [React](https://react.dev/), [Vite](https://vitejs.dev/), [Zustand](https://github.com/pmndrs/zustand) |
| **移动端**       | [React Native](https://reactnative.dev/), [Expo](https://expo.dev/)    |
| **后端**         | [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/)          |
| **数据库**       | [PostgreSQL](https://www.postgresql.org/)                            |
| **开发工具**     | [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [VS Code](https://code.visualstudio.com/) |

## 🚀 快速开始

在开始之前，请确保您的开发环境已安装以下软件：

### 先决条件

-   **Node.js**: `v18.0` 或更高版本
-   **PNPM**: `v8.0` 或更高版本
-   **PostgreSQL**: 运行中的本地或远程实例

### 安装与配置

1.  **克隆仓库**
    ```bash
    git clone https://github.com/Hercules11/fullstack-template-todolist.git
    cd fullstack-template-todolist
    ```

2.  **安装依赖**
    在项目根目录执行，PNPM 将自动处理所有工作区的依赖关系。
    ```bash
    pnpm install
    ```

3.  **配置环境变量**
    后端服务需要数据库连接信息。
    ```bash
    # 进入 server 应用目录
    cd apps/server

    # 复制环境变量模板文件
    cp .env.example .env
    ```
    然后，编辑新创建的 `.env` 文件，填入您的 PostgreSQL 数据库信息。

4.  **启动开发环境**
    我们已配置好任务，让您一键启动所有应用。
    ```bash
    # 返回根目录
    cd ../..

    # 该命令将同时启动 web, server 和 mobile 应用的开发服务器
    pnpm dev
    ```

    您也可以单独启动某个应用：
    ```bash
    # 仅启动 Web 应用
    pnpm --filter @todo-monorepo/web dev

    # 仅启动后端服务
    pnpm --filter nest-typescript-starter start:dev
    ```

## 📜 可用脚本

在根目录可以运行以下核心脚本：

-   `pnpm dev`: 并行启动所有 `apps` 的开发模式。
-   `pnpm build`: 构建所有 `packages` 和 `apps` 以用于生产。
-   `pnpm lint`: 对整个工作区进行代码风格检查和修复。
-   `pnpm test`: 运行所有测试。

## 🤝 贡献指南

我们热烈欢迎任何形式的贡献，无论是新功能、Bug 修复还是文档改进。请参考我们的 [贡献指南](CONTRIBUTING.md) 了解详细流程。

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 发布。