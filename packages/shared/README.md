# @monorepo/shared

该包是 monorepo 项目的共享工具库，包含一系列通用的工具函数和 React Hooks，旨在提高代码复用性、统一性和开发效率。

## 目录

- [✨ 功能特性](#-功能特性)
- [📦 安装](#-安装)
- [🚀 使用方法](#-使用方法)
  - [formatTime](#formattime)
  - [guid](#guid)
- [🤝 贡献指南](#-贡献指南)
- [📄 许可证](#-许可证)

## ✨ 功能特性

- **TypeScript 支持**: 使用 TypeScript 编写，提供完整的类型定义。
- **树摇优化 (Tree-shaking)**: 只打包您实际使用的代码，减小生产环境下的打包体积。
- **通用工具函数**: 提供日期格式化、唯一 ID 生成等常用函数。
- **自定义 Hooks**: (如果将来添加) 提供可复用的 React Hooks 以简化组件逻辑。

## 📦 安装

在 monorepo 根目录下，使用以下命令将此共享包作为依赖项添加到您的目标子包 (例如 `packages/app`) 中。

```bash
# 使用 npm
npm install @monorepo/shared --workspace=app

# 使用 yarn
yarn workspace app add @monorepo/shared

# 使用 pnpm
pnpm add @monorepo/shared --filter app
```

## 🚀 使用方法

您可以从 `@monorepo/shared` 中导入所需的工具函数。

### formatTime

用于格式化时间戳或 Date 对象。

**示例:**

```typescript
import { formatTime } from '@monorepo/shared';

const timestamp = 1678886400000; // 2023-03-15 16:00:00

// 默认格式：YYYY-MM-DD HH:mm:ss
console.log(formatTime(timestamp)); // 输出: 2023-03-15 16:00:00

// 自定义格式
console.log(formatTime(timestamp, 'YYYY-MM-DD')); // 输出: 2023-03-15

const date = new Date();
console.log(formatTime(date, 'HH:mm')); // 输出: 当前时间 (例如: 14:25)
```

### guid

生成一个全局唯一标识符 (GUID/UUID)。

**示例:**

```typescript
import { guid } from '@monorepo/shared';

const uniqueId = guid();
console.log(uniqueId); // 输出: 类似于 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' 的字符串
```

## 🤝 贡献指南

我们欢迎所有形式的贡献。如果您希望为这个项目做出贡献，请遵循以下步骤：

1.  **Fork** 此仓库。
2.  **创建** 您的特性分支 (`git checkout -b feature/AmazingFeature`)。
3.  **提交** 您的更改 (`git commit -m 'Add some AmazingFeature'`)。
4.  **推送** 到分支 (`git push origin feature/AmazingFeature`)。
5.  **打开** 一个 Pull Request。

在提交代码之前，请确保您的代码符合项目的编码规范，并通过所有的测试。

## 📄 许可证

该项目采用 [MIT](https://opensource.org/licenses/MIT) 许可证。