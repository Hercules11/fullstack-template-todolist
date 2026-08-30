# fullstack-template-todolist 数据流文档

本文描述 Todo 数据从用户操作到 PostgreSQL 落库的完整流转。核心模式：**zustand 乐观更新 + 客户端预生成 id + 失败回滚**，Web 与移动端共用同一套 store 逻辑与 REST API。

## 1. 总体数据流（Web 端为例，移动端同构）

```
+------------+   axios   +--------------------+   Prisma   +------------+
| apps/web   |---------> | apps/server (Nest) | ---------> | PostgreSQL |
| zustand    |  /api/*   | TodosController    |  Todo model| (todos 表) |
| store      | <--------- | TodosService      | <--------- |            |
+------------+   JSON    +--------------------+            +------------+

       ^  +---------------------------+      +----------------------+
       |  | packages/datasource       |      | packages/shared      |
       +--| Todo / TodoState / State  |      | guid() 预生成 id      |
          | (类型契约)                 |      +----------------------+
          +---------------------------+
                     ^
       +-------------+-----------+
       | apps/web   apps/mobile  |   import type
       +-------------------------+
```

## 2. 读取流（fetchTodos）

```
TodoList.tsx useEffect / store 初始化
   |
   v
useStore.fetchTodos()          (apps/web/src/state/todo.ts)
   |
   v
set({ isLoading: true })
   |
   v
todoApiService.getAllTodos()   (api/TodoApiService.ts)
   axios GET {VITE_BASE_URL}/todos
   |-- 请求拦截器: 附带 localStorage token (Bearer)
   |
   v
Nest: TodosController.findAll() -> TodosService.findAll()
      -> prisma.todo.findMany()  -> SELECT * FROM "todos"
   |
   v  Todo[] JSON
set({ todos: res, isLoading: false })
   |
   +-- 失败: set({ isLoading:false, error: message })
             showToast("获取任务失败: ...", "error")
```

## 3. 创建流（addTodo，乐观更新 + 回滚）

```
AddEditDialog 提交 TodoBase { title, description?, completed }
   |
   v
useStore.addTodo(newTodo)
   |
   v
previousTodos = [...todos]          // 快照，供回滚
tempId = guid()                     // @todo-monorepo/shared，客户端预生成 id
   |
   v  乐观更新
set({ todos: [...todos, { ...newTodo, id: tempId, isPending: true }], isLoading: true })
   |                    UI 立即出现新条目（isPending 标记进行中）
   v
todoApiService.createTodo({ ...newTodo, id: tempId, isPending: false })
   axios POST /todos  (CreateTodoDto: id/title/description?/completed/isPending)
   |
   v
Nest: ValidationPipe(whitelist+forbidNonWhitelisted) 校验
      TodosService.create() -> prisma.todo.create
      createdAt = now(), updatedAt = now() 由后端补齐
   |
   +-- 成功:
   |     set({ todos: todos.map(t => t.id === tempId ? {...completeTodo, isPending:false} : t) })
   |     // 临时 id 被服务端返回的完整 Todo 替换
   |     showToast("任务添加成功", "success")
   |
   +-- 失败:
         set({ todos: previousTodos, ... })     // 回滚快照
         showToast("添加失败: ...", "error")
```

## 4. 更新流（updateTodo / toggleTodoStatus）

```
TodoListItem 勾选 Checkbox 或 编辑对话框提交
   |
   v  TodoList.toggleTodoStatus(id): 取当前 todo, completed 取反
useStore.updateTodo({ id, title, description, completed })
   |
   v
todoToUpdate = todos.find(id); 不存在 -> { success:false, message:"任务未找到" }
previousTodos = [...todos]
   |
   v  乐观更新（isPending: true，description 为 undefined 时保留原值）
set({ todos: todos.map(t => t.id===id ? {...t, title, description, completed, isPending:true} : t) })
   |
   v
todoApiService.updateTodo({ id, title, description, completed, isPending:false })
   axios POST /todos/:id    // 注意：本项目更新用 POST 而非 PATCH
   |
   v
Nest: TodosService.update(id, UpdateTodoDto)
      先 findOne(id) 校验存在（否则 404）-> prisma.todo.update（updatedAt 自动更新）
   |
   +-- 成功: set(isPending: false)
   +-- 失败: set({ todos: previousTodos }) 回滚 + showToast("更新失败", "error")
```

## 5. 删除流（deleteTodo）

```
TodoListItem 删除按钮 -> openDeleteConfirm(id) -> AlertDialog 确认
   |
   v
useStore.deleteTodo(id)
   |
   v
previousTodos = [...todos]
set({ todos: todos.filter(t => t.id !== id) })   // 乐观移除
   |
   v
todoApiService.deleteTodo(id)  axios DELETE /todos/:id
   |
   v
Nest: TodosService.remove(id) -> prisma.todo.delete -> 返回 { success, message }
   |
   +-- 成功(res 为 true): showToast("任务已删除", "info")
   +-- 失败/返回 false: set({ todos: previousTodos }) 回滚 + showToast("删除失败", "error")
```

## 6. 一次完整创建的字段演化（字段最小化原则）

```
用户输入            状态层(乐观更新)        HTTP 请求体(CreateTodoDto)      服务端补齐          落库/返回
{ title,     -->  { title,          -->  { id: guid(),             -->  createdAt: now() --> Todo 全量
  description,    description?,         title, description?,           updatedAt: now()    (返回给前端
  completed }     completed }           completed, isPending:false }   (+Prisma 默认值)     替换临时条目)
                                    ^                     ^
                          + id: tempId (guid)        + isPending 由 store 管理
                          (@todo-monorepo/shared)
```

对应 `packages/datasource/src/types/todo.ts` 中的注释：从用户生成数据开始，字段需求随阶段递增（TodoBase -> TodoState -> Todo），额外字段统一交给后端处理。

## 7. UI 交互流（TodoList.tsx 状态机）

```
                    +---------------------+
                    |      TodoList       |
                    | addEditComp=false   |
                    | alertComp=false     |
                    | mode='add'          |
                    +----+-----------+----+
        点击"添加任务" |           | 点击条目编辑/删除
                      v           v
        mode='add'          mode='edit' + currentEditTodoId=id
        setAddEditComp(true)      setAlertComp(true)  (删除走 AlertDialog)
                      |                 |
                      v                 v
        +---------------------------+   +----------------+
        | AddEditDialogComp         |   | AlertDialogComp |
        | TodoDialogProps 可辨识联合 |   | onConfirm ->    |
        | mode: 'add'|'edit'        |   | deleteTodo(id)  |
        | onSubmit -> handleNewTask |   +----------------+
        |          / handleEditTask |
        +---------------------------+
                      |
                      v
          addTodo / updateTodo（走第 3、4 节流程）-> 成功后 setAddEditComp(false)
```

## 8. Mock 降级流（移动端预留）

```
api/mock.ts 与 api/TodoApiService.ts 导出同名接口
state/todo.ts 中切换 import 即可降级（源码注释：mock api 和正式的 api 名字要一样，以便快速降级）:
  import * as todoApiService from "../api/mock"   // mock
  import todoApiService from "../api/TodoApiService"  // 真实
```

## 9. 备用数据流：React Query（apps/web/src/api/TodoApiHooks.ts）

```
useAllTodos()          -> useQuery(['todos','list'])          -> getAllTodos()
useCreateTodo()        -> useMutation -> onSuccess invalidate lists
useUpdateTodo()        -> setQueryData(detail) + invalidate lists
useDeleteTodo()        -> removeQueries(detail) + invalidate lists
注：该套 hooks 目前未被 UI 组件使用（实际走 zustand），且引用了
    TodoApiService 上未定义的 getTodoById / CreateTodoDto 等，属半成品备用实现。
```

## 10. 主题/样式流（补充）

```
packages/ui/src/assets/styles/main.css
   被 apps/web/src/App.tsx `import "@todo-monorepo/ui/src/assets/styles/main.css"` 全局引入
tailwindcss 4 通过 apps/web/vite.config.ts 的 @tailwindcss/vite 插件编译
packages/ui 组件内的 cn() = tailwind-merge(clsx(...)) 合并类名
```
