import { Todo } from "@todo-monorepo/datasource";
import { TodoState } from "@todo-monorepo/datasource/src/types/todo";
import { guid } from "@todo-monorepo/shared";

// 模拟数据
const mockTodos: Todo[] = [
	{
		id: guid(),
		title: "学习React",
		completed: false,
		description: "学习React的基本用法和高级特性",
		isPending: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: guid(),
		title: "完成项目",
		completed: true,
		description: "完成Todo项目的开发和测试",
		isPending: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: guid(),
		title: "准备面试",
		completed: false,
		description: "准备前端面试的常见问题和答案",
		isPending: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

// 模拟网络延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 模拟获取所有Todo
export const getAllTodos = async (): Promise<Todo[]> => {
	// 模拟50%几率的网络错误
	if (Math.random() > 0.01) {
		await delay(300);
		return mockTodos;
	} else {
		await delay(500);
		throw new Error("Failed to fetch todos");
	}
};

// 模拟添加Todo
export const createTodo = async ({
	id,
	title,
	description,
	completed,
	isPending,
}: TodoState): Promise<Todo> => {
	await delay(300);
	const newTodo: Todo = {
		id,
		title,
		description,
		completed,
		isPending,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
	mockTodos.push(newTodo);
	return newTodo;
};

export const deleteTodo = async (id: string): Promise<boolean> => {
	await delay(300);
	const idx = mockTodos.findIndex((item) => item.id === id);
	if (idx !== -1) {
		mockTodos.splice(idx);
		return true;
	}
	return false;
};

export const updateTodo = async ({
	id,
	title,
	description,
	completed,
}: {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
}): Promise<boolean> => {
	await delay(300);
	const idx = mockTodos.findIndex((item) => item.id === id);
	if (idx !== -1) {
		mockTodos[idx].title = title ? title : mockTodos[idx].title;
		mockTodos[idx].description =
			typeof description === "undefined"
				? mockTodos[idx].description
				: description;
		mockTodos[idx].updatedAt = new Date();
		mockTodos[idx].completed = completed;
		return true;
	}
	return false;
};
