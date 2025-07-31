# TodoList Monorepo
- 搭建全端（PC/H5/Mobile/Server）全栈项目，
- 各个模块使用不同的技术栈，有助于了解技术栈(React/React Native with Expo/Nestjs)的基本使用，以及 AI 辅助编程
- 生产环境下，有其他更好的技术方案[全栈全端技术栈](https://react.dev/learn/creating-a-react-app#full-stack-frameworks)可用

## Project Structure
- Mobile App: React Native with Expo
- Web App: React + Zustand
- Backend: NestJS with TypeORM

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
- Create a database named `todo_db`
- Update database connection in server's `.env`

4. Run Development Servers
- Automatically run tasks in .vscode/tasks

## Key Technologies
- PNPM Workspaces
- TypeScript
- React Native (Expo)
- React.js
- Zustand
- NestJS
- TypeORM
- PostgreSQL

## Deployment
- Web: Standard React build
- Mobile: Expo build
- Backend: NestJS standard deployment