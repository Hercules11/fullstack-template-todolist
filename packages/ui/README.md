# @monorepo/ui

`@monorepo/ui` 是一个为本 Monorepo 项目量身打造的、可复用、可主题化的 React UI 组件库。它遵循**视图与逻辑分离**的设计原则，确保了组件的高度可定制性和可维护性。

## 目录

- [🌟 设计理念](#-设计理念)
- [✨ 功能特性](#-功能特性)
- [📦 安装](#-安装)
- [🚀 快速开始](#-快速开始)
- [📚 组件列表](#-组件列表)
- [🤝 贡献指南](#-贡献指南)
- [📄 许可证](#-许可证)

## 🌟 设计理念

本组件库的核心设计思想是**视图与逻辑分离**。

- **`src/components`**: 此目录存放无状态 (Stateless) 的纯视图组件。这些组件只负责 UI 的渲染，并通过 props 接收数据和事件处理器。它们不包含任何业务逻辑或状态管理。
- **`src/lib`**: (如果适用) 此目录可以存放与组件相关的 Hooks、工具函数或上下文 (Context)，用于封装复杂的逻辑、状态管理和副作用。

这种分离使得：
1.  **视图更纯粹**: 组件更易于测试、复用和进行可视化调试 (例如在 Storybook 中)。
2.  **逻辑更清晰**: 业务逻辑被集中管理，降低了代码的耦合度。
3.  **协作更高效**: UI/UX 开发者可以专注于组件的外观和感觉，而应用开发者可以专注于业务逻辑的实现。

## ✨ 功能特性

- **React & TypeScript**: 基于 React 和 TypeScript 构建，提供强大的类型安全和开发体验。
- **样式隔离**: 使用 CSS-in-JS (或 CSS Modules) 方案，避免全局样式污染。
- **Tree-shaking 友好**: 按需导入，有效减小最终应用程序的打包体积。
- **无障碍 (a11y)**: 致力于遵循 WAI-ARIA 标准，确保所有用户都能获得良好的体验。

## 📦 安装

在 monorepo 根目录下，使用您选择的包管理器将 `@monorepo/ui` 添加到目标应用 (例如 `packages/web-app`) 中。

```bash
# 使用 npm
npm install @monorepo/ui --workspace=web-app

# 使用 yarn
yarn workspace web-app add @monorepo/ui

# 使用 pnpm
pnpm add @monorepo/ui --filter web-app
```

## 🚀 快速开始

在您的 React 应用中直接导入并使用组件。

```jsx
import React from 'react';
import { Button, Input, Card } from '@monorepo/ui';

function MyComponent() {
  return (
    <Card>
      <h2>登录</h2>
      <Input placeholder="请输入用户名" />
      <Button onClick={() => alert('登录成功！')}>
        登录
      </Button>
    </Card>
  );
}

export default MyComponent;
```

## 📚 组件列表

以下是当前可用的组件列表：

-   `Alert-dialog`
-   `Button`
-   `Card`
-   `Checkbox`
-   `Dialog`
-   `Input`
-   `Label`
-   `Textarea`
-   ... (更多组件正在开发中)

每个组件都经过精心设计，以确保其在不同场景下的灵活性和一致性。

## 🤝 贡献指南

我们非常欢迎社区的贡献！如果您希望参与进来，请：

1.  **Fork** 本仓库。
2.  **创建** 您的特性分支 (`git checkout -b feature/NewAwesomeComponent`)。
3.  **实现** 您的改动。请确保遵循现有的代码风格和设计原则。
4.  **添加** 必要的测试用例。
5.  **提交** 您的更改 (`git commit -m 'feat: Add NewAwesomeComponent'`)。
6.  **推送** 到您的分支 (`git push origin feature/NewAwesomeComponent`)。
7.  **创建** 一个 Pull Request。

## 📄 许可证

本项目基于 [MIT](https://opensource.org/licenses/MIT) 许可证。