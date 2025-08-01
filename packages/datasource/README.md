# Datasource

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

这个包是 `fullstack-template-todolist` 的核心组成部分，用于提供统一的数据结构定义、类型以及数据库模式。通过集中管理这些类型，我们确保了在整个 monorepo 中的各个包和应用之间数据的一致性和可靠性。

## 前言

在大型项目中，数据的一致性至关重要。`datasource` 包旨在成为整个项目中所有共享数据类型的“单一事实来源” (Single Source of Truth)。这包括但不限于：

*   **TypeScript 类型定义**: 为项目中的核心实体（如 `Todo`, `Alert`, `Dialog` 等）提供静态类型检查，增强代码的健壮性和可维护性。
*   **数据库模式**: （如果适用）定义与数据库表结构相对应的数据模型。
*   **状态管理**: 为应用程序的全局状态提供统一的结构定义。

## 安装

作为 monorepo 的一部分，这个包通常不需要单独安装。它会通过根目录的 `package.json` 和 `workspaces` 配置被自动链接。

如果您需要在 monorepo 的其他包中使用此包，请在该包的 `package.json` 中添加依赖：

```json
"dependencies": {
  "@your-org/datasource": "workspace:*"
}
```

然后，在您的包中运行 `npm install` 或 `yarn install`。

## 使用方法

您可以直接从这个包中导入所需的类型。

```typescript
import { Todo, Alert } from '@your-org/datasource/types';

function displayAlert(alert: Alert): void {
  console.log(alert.message);
}

function processTodo(todo: Todo): void {
  if (todo.completed) {
    // ...
  }
}
```

### 导出的类型

*   `alert.ts`: 定义了与警报和通知相关的类型。
*   `dialog.ts`: 定义了对话框和模态框所需的数据结构。
*   `state.ts`: 定义了应用全局状态的结构。
*   `todo.ts`: 定义了待办事项（Todo）的数据模型。
*   `index.ts`: 汇总并导出了所有可用的类型，作为包的统一入口。

## 贡献

我们欢迎对这个核心包的任何贡献。如果您希望添加新的共享类型或修改现有类型，请遵循以下步骤：

1.  **Fork** 本仓库。
2.  创建一个新的分支 (`git checkout -b feature/add-new-type`)。
3.  在 `src/types` 目录下添加或修改相应的 `.ts` 文件。
4.  请确保在 `src/types/index.ts` 文件中导出了您的新类型。
5.  提交您的更改 (`git commit -m 'feat: Add new type for X'`)。
6.  **Push** 到您的分支 (`git push origin feature/add-new-type`)。
7.  创建一个 **Pull Request**。

请确保您的代码遵循项目现有的编码风格和约定。

## 许可证

此项目采用 [MIT](https://opensource.org/licenses/MIT) 许可证。