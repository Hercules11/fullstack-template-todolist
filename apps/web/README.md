1. pnpm 创建子包，通过 pnpm-workspace.yaml 声明
2. 通过在 .npmrc 中设置 link-workspace-packages=true 开启包与包之间的链接，
3. 通过 pnpm add @todo-monorepo/datasource --filter @todo-monorepo/web 为特定的包添加其他的包，添加的是硬链接，也就是说可随时修改

项目技术栈： react + zustand + shadcn/ui