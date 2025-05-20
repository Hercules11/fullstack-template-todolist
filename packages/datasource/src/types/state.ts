import type { Todo, TodoBase, TodoState } from "./todo";

export interface State {
	todos: TodoState[];
	isLoading: boolean;
	error: string | null;
	pendingOperation: string[];
	toastMessage: null | object;
	showToast: (message: string, type?: "info" | "success" | "error") => void;
	fetchTodos: () => Promise<void>;
	addTodo: (
		todo: TodoBase
	) => Promise<{ success: boolean; message: string } | undefined>;
	updateTodo: (
	{id, title, description, completed}:
		{
			id: string;
			title: string;
			description?: string;
			completed: boolean;
			}
		// 有三种方案，只传修改的字段，传可见子段，传完整字段
	) => Promise<{ success: boolean; message: string } | undefined>;
	deleteTodo: (
		id: string
	) => Promise<{ success: boolean; message: string } | undefined>;
}
