import { create } from "zustand";
import type { State } from "@todo-monorepo/datasource";
// import { addTodo, removeTodo, updateTodo, getTodos } from "../api/mock";
import todoApiService from "../api/TodoApiService";
import { guid } from "@todo-monorepo/shared";

const useStore = create<State>((set, get) => ({
	todos: [],
	isLoading: false,
	error: null,
	pendingOperation: [],
	toastMessage: null,
	// 显示通知
	showToast: (message, type = "info") => {
		set({ toastMessage: { message, type } });
		setTimeout(() => set({ toastMessage: null }), 3000);
	},
	fetchTodos: async () => {
		set({ isLoading: true });
		try {
			const res = await todoApiService.getAllTodos();
			set({ todos: res, isLoading: false });
		} catch (error) {
			if (error instanceof Error) {
				set({ isLoading: false, error: error.message });
				get().showToast("获取任务失败: " + error.message, "error");
			}
		}
	},
	addTodo: async (newTodo) => {
		// 保存原始状态以便回滚
		const previousTodos = [...get().todos];
		const tempId = guid();

		// 乐观更新 UI
		set((state) => ({
			todos: [...state.todos, { ...newTodo, id: tempId, isPending: true }],
			isLoading: true,
		}));

		try {
			// 模拟 API 延迟
			const completeTodo = await todoApiService.createTodo({
				...newTodo,
				id: tempId,
				isPending: false,
			});

			// 更新状态 - 替换临时ID的todo为服务器返回的todo
			set((state) => ({
				todos: state.todos.map((todo) =>
					todo.id === tempId ? { ...completeTodo, isPending: false } : todo
				),
				isLoading: false,
			}));

			get().showToast("任务添加成功", "success");
			return { success: true, message: "任务添加成功" };
		} catch (error) {
			// 回滚状态
			if (error instanceof Error) {
				set({
					todos: previousTodos,
					isLoading: false,
					error: error.message,
				});

				get().showToast("添加失败: " + error.message, "error");
				return { success: false, message: error.message };
			}
		}
	},

	// 切换完成状态
	updateTodo: async ({ id, title, description, completed }) => {
		// 查找并获取当前todo
		const todoToUpdate = get().todos.find((todo) => todo.id === id);
		if (!todoToUpdate) return { success: false, message: "任务未找到" };

		// 保存原始状态
		const previousTodos = [...get().todos];

		// 乐观更新
		set((state) => ({
			todos: state.todos.map((todo) =>
				todo.id === id
					? {
							...todo,
							title,
							description:
								typeof description === "undefined"
									? todo.description
									: description,
							completed: completed,
							isPending: true,
					  }
					: todo
			),
		}));

		try {
			// 模拟 API 延迟
			await todoApiService.updateTodo({
				id,
				title,
				description,
				completed,
				isPending: false,
			});

			// 标记为不再处于待定状态
			set((state) => ({
				todos: state.todos.map((todo) =>
					todo.id === id ? { ...todo, isPending: false } : todo
				),
			}));

			return { success: true, message: "任务已更新" };
		} catch (error) {
			// 回滚状态
			if (error instanceof Error) {
				set({ todos: previousTodos });
				get().showToast("更新失败", "error");
				return { success: false, message: error.message };
			}
		}
	},

	// 删除 Todo
	deleteTodo: async (id) => {
		const previousTodos = [...get().todos];

		// 乐观更新
		set((state) => ({
			todos: state.todos.filter((todo) => todo.id !== id),
		}));

		try {
			// 模拟 API 调用
			const res = await todoApiService.deleteTodo(id);
			if (!res) {
				throw new Error("删除失败");
			}
			get().showToast("任务已删除", "info");
			return { success: true, message: "任务已删除" };
		} catch (error) {
			// 回滚
			if (error instanceof Error) {
				set({ todos: previousTodos });
				get().showToast("删除失败", "error");
				return { success: false, message: error.message };
			}
		}
	},
}));

export default useStore;
