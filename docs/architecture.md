# fullstack-template-todolist 架构文档

> pnpm monorepo 全栈 Todo 模板：NestJS + Prisma(PostgreSQL) 后端、React 19 + Vite Web 前端、Expo Router 移动端，外加三个共享 workspace 包（类型契约 / 工具函数 / shadcn 风格 UI 组件库）。前端统一采用 zustand 乐观更新模式。

## 1. 技术栈总览

| Workspace 包名 | 目录 | 技术栈 | 职责 |
| --- | --- | --- | --- |
| `@todo-monorepo/web` | `apps/web` | React 19 + Vite 6 + zustand + @tanstack/react-query + tailwindcss 4 | Web 端 Todo 应用 |
| `mobile` | `apps/mobile` | Expo 53 + expo-router 5 + Tamagui + zustand + axios | 移动端 Todo 应用（iOS/Android/Web） |
| `nest-typescript-starter` | `apps/server` | NestJS 11 + Prisma 6 (PostgreSQL) + Swagger + class-validator | REST API 服务 |
| `@todo-monorepo/datasource` | `packages/datasource` | 纯 TypeScript 类型 | Todo 类型契约 / State 接口 / 对话框 Props |
| `@todo-monorepo/shared` | `packages/shared` | TypeScript + moment | 通用工具（formatTime / guid） |
| `@todo-monorepo/ui` | `packages/ui` | React 19 + Radix UI + tailwind + cva | shadcn 风格无头组件库 |

根目录 `package.json` 脚本：`dev / build / start / lint` 均为 `pnpm --parallel run ...`（并行驱动全部子包）。根目录依赖里也声明了 `@todo-monorepo/datasource|shared|ui: workspace:^`、`zustand`、`axios`、`tailwindcss` 等，供通过 `tsconfig.base.json` paths 引用共享包的项目兜底解析。

`pnpm-workspace.yaml`：

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

## 2. Workspace 依赖关系图

```
                        +---------------------------+
                        |   packages/datasource     |
                        |  @todo-monorepo/datasource|
                        |  (类型契约, 无三方依赖)     |
                        +----+------------+---------+
                             ^            ^
                import type  |            |  import type
        +--------------------+---+    +---+----------------------+
        |                        |    |                          |
+-------+----------+   +---------v----+--------+          +------v-------------------+
|  apps/web        |   |  apps/mobile          |          | packages/shared          |
| @todo-monorepo/  |   |  mobile               |          | @todo-monorepo/shared    |
|     web          |   |                       |          |  formatTime / guid       |
+--+------+---+----+   +--+----------------+---+          +------+-------------------+
   |      ^   |           ^  (经根 tsconfig paths   ^                ^
   |      |   |           |   与根 package.json      |                |
   |      |   +-----------+------------+------------+                |
   |      |  import { guid }  import type { State, Todo... }         |
   |      |                                                          |
   |      |                                     import { guid }      |
   |      +----------------------------------------------------------+
   |                          import { Button } 等
   |      +------------------------------+
   |      v                              |
+--+---------------------+          +---+----------------------+
| packages/ui             |<--------+  apps/web                |
| @todo-monorepo/ui       |  运行时组件引用      (同时引用)     |
| Radix + tailwind + cva  |                                     |
+-------------------------+                                     |

+---------------------------+
|  apps/server              |   不依赖任何 workspace 包：
|  NestJS + Prisma          |   类型直接取自 .prisma/client 生成的 Todo model
+---------------------------+
```

依赖关系明细（按 import 语句核实）：

| 依赖方 | 被依赖方 | 引用内容 | 解析方式 |
| --- | --- | --- | --- |
| `apps/web/src/state/todo.ts` | `@todo-monorepo/datasource` | `State` 类型 | 根 package.json `workspace:^` + tsconfig paths |
| `apps/web/src/state/todo.ts` | `@todo-monorepo/shared` | `guid()` | 同上 |
| `apps/web/src/api/TodoApiService.ts` | `@todo-monorepo/datasource` | `Todo`、`TodoState` 类型 | 同上 |
| `apps/web/src/components/TodoList.tsx` | `@todo-monorepo/ui` | `Button` 组件 | 同上（`main` 指向 `src/index`，源码直引） |
| `apps/web/src/App.tsx` | `@todo-monorepo/ui` | `src/assets/styles/main.css` | 相对包路径 CSS 直引 |
| `apps/mobile/state/todo.ts` | `@todo-monorepo/datasource`、`shared` | `State` 类型、`guid()` | 根 `tsconfig.base.json` paths 映射到 `packages/*/src` |
| `apps/mobile/api/TodoApiService.ts` | `@todo-monorepo/datasource` | `Todo`、`TodoState` 类型 | 同上 |
| `apps/server/*` | （无） | `.prisma/client` 的 `Todo` | Prisma 生成代码 |

注：`apps/web` 另有 `@tanstack/react-query` 依赖，`TodoApiHooks.ts` 封装了 React Query 版 hooks（`useAllTodos/useCreateTodo/...`），但当前 UI 组件实际走的是 zustand store 路线，React Query hooks 属于备用实现且引用了 Service 上未导出的 `getTodoById`。

## 3. 目录结构（有效源码）

```
fullstack-template-todolist/
|-- package.json                  # 并行脚本 + workspace:^ 依赖 + pnpm overrides(react19/metro)
|-- pnpm-workspace.yaml
|-- tsconfig.base.json            # paths: @todo-monorepo/* -> packages/*/src
|-- apps/
|   |-- web/
|   |   |-- vite.config.ts        # react + tailwindcss + vite-tsconfig-paths 插件
|   |   |-- .env                  # VITE_BASE_URL=http://localhost:3000/api
|   |   `-- src/
|   |       |-- main.tsx / App.tsx
|   |       |-- api/  TodoApiService.ts (axios 单例) / TodoApiHooks.ts (react-query) / mock.ts
|   |       |-- state/todo.ts     # zustand store（乐观更新）
|   |       `-- components/  TodoList / TodoListItem / AddEditDialog / AlertDialog
|   |-- mobile/
|   |   |-- app/  (tabs)/index.tsx 等   # expo-router 文件路由
|   |   |-- api/  TodoApiService.ts / TodoApiHooks.ts / mock.ts
|   |   |-- state/todo.ts         # 与 web 版 store 完全同构
|   |   `-- components/  TodoListItem / AddEditDialog / AlertDialog / Button
|   `-- server/
|       |-- nest-cli.json / prisma/schema.prisma + migrations + seed.ts
|       `-- src/
|           |-- main.ts           # 全局前缀 api + ValidationPipe + Swagger
|           |-- app.module.ts / app.controller.ts / app.service.ts
|           |-- prisma/  prisma.module.ts / prisma.service.ts
|           `-- todos/  todos.controller.ts / todos.service.ts
|                 dto/ create-todo.dto.ts / update-todo.dto.ts
|                 entities/todo.entity.ts
`-- packages/
    |-- datasource/src/  index.ts + types/{todo,state,alert,dialog}.ts
    |-- shared/src/      index.ts + utils/{formatTime,guid}.ts
    `-- ui/src/          index.ts + components/(alert-dialog|button|card|checkbox|dialog|input|label|textarea).tsx + lib/utils.ts
```

## 4. 各端架构

### 4.1 服务端（NestJS）

```
main.ts bootstrap
   |-- app.enableCors()
   |-- app.setGlobalPrefix('api')
   |-- ValidationPipe(whitelist, transform, forbidNonWhitelisted)
   |-- Swagger: /api/docs
   `-- listen(process.env.PORT || 3000)

AppModule
   `-- TodosModule
         |-- TodosController  (/api/todos)
         |-- TodosService ----> PrismaService (PrismaModule, 全局)
         |                        `--> PostgreSQL (env DATABASE_URL)
         `-- DTO: CreateTodoDto / UpdateTodoDto (class-validator 校验)
```

Prisma `Todo` model（映射表 `todos`）：

```prisma
model Todo {
  id          String   @id          // 由客户端 guid 生成后提交
  title       String
  description String?
  completed   Boolean  @default(false)
  isPending   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@map("todos")
}
```

设计要点（源自 datasource/types/todo.ts 内注释）：字段最小化原则——客户端只提交 `TodoBase`（title/description/completed），`id` 由客户端 `guid()` 在状态层补齐，`createdAt/updatedAt` 等字段统一交给后端生成。

### 4.2 Web 端（React + Vite）

```
main.tsx -> App.tsx -> TodoList.tsx
TodoList: useStore() 取 { todos, addTodo, updateTodo, deleteTodo, fetchTodos }
          useEffect(fetchTodos)
          local state: addEditComp / alertComp / mode('add'|'edit') / currentEditTodoId
          渲染 TodoListItem[] + AddEditDialogComp(mode 判别联合) + AlertDialogComp
```

### 4.3 移动端（Expo Router）

```
app/_layout.tsx -> Provider(Tamagui) -> (tabs)/index.tsx (Todo 列表)
                 -> modal.tsx (添加/编辑)
结构：expo-router 文件路由；state/todo.ts 与 api/TodoApiService.ts 和 web 端逐行同构，
     区别仅在 baseUrl 读取 process.env.EXPO_PUBLIC_API_URL（apps/mobile/.env）
api/mock.ts 与正式 api 同名导出，可一键切换降级为 mock（源码注释：名字一样以便快速降级）
```

## 5. 数据结构（@todo-monorepo/datasource 类型契约）

```ts
// types/todo.ts
Todo        = { id, title, description?, completed, isPending, createdAt: Date, updatedAt: Date }
TodoBase    = { title, description?, completed }              // 客户端提交的最小字段
TodoState   = { id, title, description?, completed, isPending }  // 加上状态层生成的 id
TodoOperate = { toggleTodoStatus, openEditMode, openDeleteConfirm }  // UI 操作回调集合

// types/state.ts —— zustand store 的形状（web/mobile 共用）
State = {
  todos: TodoState[]; isLoading: boolean; error: string | null;
  pendingOperation: string[]; toastMessage: null | object;
  showToast(message, type?);
  fetchTodos(): Promise<void>;
  addTodo(todo: TodoBase): Promise<{success, message} | undefined>;
  updateTodo({id,title,description,completed}): Promise<...>;
  deleteTodo(id): Promise<...>;
}

// types/dialog.ts —— 可辨识联合
TodoDialogProps = { mode: "edit", initialData: TodoBase, ... } | { mode: "add", initialData?: undefined, ... }

// types/alert.ts
AlertDialogComProps = { isOpen, onOpenChange, onConfirm, title?, description?, confirmText?, cancelText?, ... }
```

## 6. REST API 清单（apps/server，全局前缀 /api）

| 方法 | 路径 | 请求体 | 响应 | 说明 |
| --- | --- | --- | --- | --- |
| POST | `/api/todos` | CreateTodoDto（id/title/description?/completed/isPending，均校验） | 201 `Todo` | 创建 |
| GET | `/api/todos` | - | `Todo[]` | 列表（`findMany`） |
| POST | `/api/todos/:id` | UpdateTodoDto（PartialType(CreateTodoDto) 扩展） | 200 `Todo` | 更新（先 findOne 校验存在，404） |
| DELETE | `/api/todos/:id` | - | 200 `{ success: Todo, message: "Todo deleted successfully" }` | 删除 |
| GET | `/api/docs` | - | Swagger UI | 接口文档 |

注：控制器中 `GET /todos/:id`（findOne）已被注释停用；更新/删除内部都会先触发 `findOne` 抛 `NotFoundException`。

## 7. 函数 / 导出清单

### 7.1 @todo-monorepo/shared

| 导出 | 签名 | 说明 |
| --- | --- | --- |
| `formatTime` | `(time: string, format = "HH:mm:ss") => string` | 基于 moment 的时刻格式化 |
| `guid` | `() => string` | 伪 GUID 生成（Math.random 拼接，非加密安全），供客户端预生成 Todo id |

### 7.2 @todo-monorepo/ui（shadcn 风格，全部由 src/index.ts 桶导出）

```
AlertDialog / AlertDialogPortal / AlertDialogOverlay / AlertDialogTrigger /
AlertDialogContent / AlertDialogHeader / AlertDialogFooter / AlertDialogTitle /
AlertDialogDescription / AlertDialogAction / AlertDialogCancel
Dialog / DialogClose / DialogContent / DialogDescription / DialogFooter /
DialogHeader / DialogOverlay / DialogPortal / DialogTitle / DialogTrigger
Button, buttonVariants, Card 系, Checkbox, Input, Label, Textarea
lib/utils.ts: cn(...inputs)  // clsx + tailwind-merge
```

### 7.3 服务端

| 类 | 方法 | 说明 |
| --- | --- | --- |
| `TodosService` | `create / findOne / findAll / update / remove` | 全部薄封装 PrismaService；findOne 不存在抛 `NotFoundException` |
| `PrismaService` | 继承 `PrismaClient`，`onModuleInit` 中 `$connect`（Nest 官方模式） | 全局模块注入 |

### 7.4 客户端

| 标识符 | 文件 | 说明 |
| --- | --- | --- |
| `todoApiService`（单例） | apps/{web,mobile}/api/TodoApiService.ts | axios 实例（5s 超时、Bearer token 请求拦截、401 响应拦截）；方法 `getAllTodos / createTodo / updateTodo / markTodoAsCompleted / deleteTodo` |
| `useStore`（默认导出） | apps/{web,mobile}/state/todo.ts | zustand `create<State>`，乐观更新 + 失败回滚 + showToast |
| `TODO_QUERY_KEYS` / `useAllTodos` / `useCreateTodo` / `useUpdateTodo` / `useMarkTodoAsCompleted` / `useDeleteTodo` / `useTodoOperations` | apps/{web,mobile}/api/TodoApiHooks.ts | React Query 备用封装（当前 UI 未使用） |

## 8. 环境变量

| 位置 | 变量 | 用途 |
| --- | --- | --- |
| `apps/web/.env` | `VITE_BASE_URL=http://localhost:3000/api` | axios baseURL（TodoApiService 内 `import.meta.env.VITE_BASE_URL`，回退 localhost） |
| `apps/mobile/.env` | `EXPO_PUBLIC_API_URL=http://localhost:3000/api`、`EXPO_PUBLIC_APP_NAME`、`SECRET_KEY` | Expo 构建时注入 |
| `apps/server/.env.example` | `PORT / DATABASE_URL / API_KEY / JWT_SECRET` | Nest 启动端口与 Prisma 连接串 |
