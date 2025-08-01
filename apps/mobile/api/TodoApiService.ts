// TodoApiService.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Todo, TodoState } from "@todo-monorepo/datasource";
// import { API_URL } from "@env"; // 使用dotenv加载环境变量

// Todo API 服务类
class TodoApiService {
	private readonly apiClient: AxiosInstance;
	private readonly baseUrl: string;

	constructor() {
		// this.baseUrl = "http://localhost:3000/api";
		console.log(process.env.EXPO_PUBLIC_API_URL);
		this.baseUrl =
			process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

		// 创建 axios 实例
		this.apiClient = axios.create({
			baseURL: this.baseUrl,
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 5000, // 5秒超时
		});

		// 请求拦截器 - 可以在这里添加认证令牌等
		this.apiClient.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("token");
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		// 响应拦截器 - 处理错误和响应数据
		this.apiClient.interceptors.response.use(
			(response) => response,
			(error) => {
				// 处理错误情况，如401未授权重定向到登录页等
				if (error.response && error.response.status === 401) {
					// 重定向到登录页或触发登出操作
					console.error("未授权，请重新登录");
					// 例如: window.location.href = '/login';
				}
				return Promise.reject(error);
			}
		);
	}

	/**
	 * 获取所有Todo列表
	 */
	async getAllTodos(): Promise<Todo[]> {
		try {
			const response: AxiosResponse<Todo[]> =
				await this.apiClient.get("/todos");
			return response.data;
		} catch (error) {
			console.error("获取Todo列表失败:", error);
			throw error;
		}
	}

	/**
	 * 通过ID获取单个Todo
	 */
	// async getTodoById(id: string): Promise<Todo> {
	// 	try {
	// 		const response: AxiosResponse<Todo> = await this.apiClient.get(
	// 			`/todos/${id}`
	// 		);
	// 		return response.data;
	// 	} catch (error) {
	// 		console.error(`获取Todo(ID: ${id})失败:`, error);
	// 		throw error;
	// 	}
	// }

	/**
	 * 创建新的Todo
	 */
	async createTodo(todoData: TodoState): Promise<Todo> {
		try {
			const response: AxiosResponse<Todo> = await this.apiClient.post(
				"/todos",
				todoData
			);
			return response.data;
		} catch (error) {
			console.error("创建Todo失败:", error);
			throw error;
		}
	}

	/**
	 * 更新Todo
	 */
	async updateTodo(updateData: TodoState): Promise<Todo> {
		try {
			const response: AxiosResponse<Todo> = await this.apiClient.post(
				`/todos/${updateData.id}`,
				updateData
			);
			return response.data;
		} catch (error) {
			console.error(`更新Todo(ID: ${updateData.id})失败:`, error);
			throw error;
		}
	}

	/**
	 * 标记Todo为已完成
	 */
	async markTodoAsCompleted(id: string): Promise<Todo> {
		try {
			const response: AxiosResponse<Todo> = await this.apiClient.patch(
				`/todos/${id}/complete`,
				{
					completed: true,
				}
			);
			return response.data;
		} catch (error) {
			console.error(`标记Todo(ID: ${id})为已完成失败:`, error);
			throw error;
		}
	}

	/**
	 * 删除Todo
	 */
	async deleteTodo(id: string): Promise<boolean> {
		try {
			await this.apiClient.delete(`/todos/${id}`);
			return true;
		} catch (error) {
			console.error(`删除Todo(ID: ${id})失败:`, error);
			throw error;
		}
	}
}

// 导出单例实例
export const todoApiService = new TodoApiService();
export default todoApiService;
