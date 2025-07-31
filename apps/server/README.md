# Nest.js 项目启动模板

这是一个基于 Nest.js 和 TypeScript 的项目启动模板。它预配置了开发、测试和生产环境所需的基本工具和脚本，帮助您快速开始构建高效、可扩展的服务器端应用程序。

## 项目特点

*   **框架**: [Nest.js](https://nestjs.com/) v11
*   **语言**: [TypeScript](https://www.typescriptlang.org/) v5
*   **ORM**: [Prisma](https://www.prisma.io/) v6
*   **包管理器**: [pnpm](https://pnpm.io/)
*   **代码规范**: ESLint + Prettier
*   **环境要求**: Node.js >= 20.0.0, pnpm >= 10.0.0

## 环境准备

请确保您的开发环境中已安装 [Node.js](https://nodejs.org/) (版本 >= 20.0.0) 和 [pnpm](https://pnpm.io/) (版本 >= 10.0.0)。

如果您尚未安装 pnpm，可以通过 npm全局安装：
```md
npm install -g pnpm
```

## 快速开始

请按照以下步骤在您的本地环境中配置并运行此项目。

### 1. 安装依赖

首先，克隆本仓库到本地，然后使用 `pnpm` 安装项目所需的所有依赖。
```md
pnpm install
```
此命令会读取 `package.json` 文件并下载所有必要的开发和生产依赖项。

### 2. 配置 Prisma 数据库

本项目使用 Prisma作为 ORM 与数据库进行交互。

1.  **创建环境变量文件**: 在项目根目录下，创建一个名为 `.env` 的文件。
2.  **配置数据库连接**: 在 `.env` 文件中，添加 `DATABASE_URL` 变量，并设置为您的数据库连接字符串。

    例如，如果您使用的是 PostgreSQL 数据库，格式如下：
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"
    ```
    请将 `USER`, `PASSWORD`, `HOST`, `PORT` 和 `DATABASE_NAME` 替换为您的实际数据库信息。

3.  **运行数据库迁移**: 配置完成后，运行 Prisma migrate 命令来根据 `prisma/schema.prisma` 文件中的模型创建或更新数据库表结构。

    ```md
    pnpm prisma migrate dev
    ```

### 3. Prisma Seed 初始数据

如果您需要为应用程序填充初始数据（例如，默认的管理员账户或基础配置），可以运行 seed 命令。

该命令已在 `package.json` 中配置好：
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

执行以下命令来运行数据填充脚本：
```md
pnpm prisma db seed
```
此命令将执行 `prisma/seed.ts` 文件中的代码。您可以修改此文件以满足您的初始数据需求。

### 4. 运行项目

完成以上所有步骤后，您就可以启动项目了。

运行以下命令来启动应用程序：
```md
pnpm run start
```
该命令会编译并启动项目。成功后，您可以在 `http://localhost:3000` (或您在 `src/main.ts` 中配置的端口) 访问您的应用。

为了方便开发，您可以使用开发模式，该模式下文件发生变更时会自动重启服务：
```md
pnpm run start:dev
```

## 主要可用脚本

本项目在 `package.json` 的 `scripts` 字段中定义了多个常用命令：

*   `pnpm run build`: 编译 TypeScript 代码为 JavaScript，用于生产环境部署。
*   `pnpm run format`: 使用 Prettier 格式化 `src` 和 `test` 目录下的所有 `.ts` 文件。
*   `pnpm run lint`: 使用 ESLint 检查并自动修复代码中的语法和风格问题。
*   `pnpm run start`: 启动生产模式的应用程序。
*   `pnpm run start:dev`: 以监视模式启动应用程序，文件更改时自动重新加载。
*   `pnpm run start:prod`: 在生产环境中运行构建后的代码。
*   `pnpm test`: 运行所有单元测试。
*   `pnpm test:watch`: 以监视模式运行单元测试。
*   `pnpm test:cov`: 运行单元测试并生成代码覆盖率报告。
*   `pnpm test:e2e`: 运行端到端测试。