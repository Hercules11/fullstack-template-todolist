import { Todo } from "@todo-monorepo/datasource";
import { guid } from "@todo-monorepo/shared";

// 模拟数据
const mockTodos: Todo[] = [
	{
		id: guid(),
		title: "学习React",
		completed: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: guid(),
		title: "完成项目",
		completed: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: guid(),
		title: "准备面试",
		completed: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

// 模拟网络延迟
const delay = (ms: number) => new Promise((resolve: any) => setTimeout(resolve, ms));

// 模拟获取所有Todo
export const fetchTodos = async (): Promise<Todo[]> => {
	// 模拟50%几率的网络错误
	if (Math.random() > 0.9) {
		await delay(300);
		return mockTodos;
	} else {
		await delay(500);
		throw new Error("Failed to fetch todos");
	}
};

// 模拟添加Todo
export const addTodo = async ({title, description}: {title: string, description?: string}): Promise<Todo> => {
	await delay(300);
	const newTodo: Todo = {
		id: guid(),
        title,
        description,
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
	};
	mockTodos.push(newTodo);
	return newTodo;
};

export const removeTodo = async (id: string): Promise<boolean> => {
    await delay(300);
    let idx = mockTodos.findIndex(item => item.id === id);
    if (idx !== -1) {
        mockTodos.splice(idx);
        return true;
    }
    return false;
}

export const updateTodo = async ({ id, title, description }: { id: string, title?: string, description?: string }): Promise<boolean> {
    await delay(300)
    let idx = mockTodos.findIndex(item => item.id === id);
    if (idx !== -1) {
        title ? mockTodos[idx].title = title : '';
        mockTodos[idx].description = description;
        mockTodos[idx].updatedAt = new Date()
        return true;
    }
    return false;
}

