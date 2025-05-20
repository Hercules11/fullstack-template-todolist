# TodoList Monorepo
- 搭建全端（pc/h5/mobile/server）全栈项目，
- 各个模块使用不同的技术栈，是为了了解技术栈(react/react native/nestjs)的基本使用，以及将 AI 生成代码引入开发流程
- 生产环境下有其他更好的技术方案[全栈全端技术栈](https://react.dev/learn/creating-a-react-app#full-stack-frameworks)可用

## Project Structure
- Mobile App: React Native with Expo
- Web App: React
- Backend: NestJS with TypeORM
- Shared Types: Monorepo package

## Prerequisites
- Node.js (v18+)
- PNPM (v8+)
- PostgreSQL

## Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd todo-monorepo
```

2. Install dependencies
```bash
pnpm install
```

3. Set up PostgreSQL
- Create a database named `todolist`
- Update database connection in server's `.env`

4. Run Development Servers
```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter web dev
pnpm --filter mobile dev
pnpm --filter server dev
```

## Key Technologies
- PNPM Workspaces
- TypeScript
- React Native (Expo)
- React.js
- NestJS
- TypeORM
- PostgreSQL

## Deployment
- Web: Standard React build
- Mobile: Expo build
- Backend: NestJS standard deployment