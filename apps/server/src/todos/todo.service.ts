// apps/server/src/todos/todo.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Todo } from "./todo.entity";
import { CreateTodoInput, UpdateTodoInput } from "@todo-monorepo/datasource";

@Injectable()
export class TodoService {
	constructor(
		@InjectRepository(Todo)
		private todoRepository: Repository<Todo>
	) {}

	async createTodo(input: CreateTodoInput): Promise<Todo> {
		const todo = this.todoRepository.create({
			...input,
			completed: false,
		});
		return this.todoRepository.save(todo);
	}

	async getAllTodos(): Promise<Todo[]> {
		return this.todoRepository.find();
	}

	async updateTodo(input: UpdateTodoInput): Promise<Todo> {
		await this.todoRepository.update(input.id, input);
		return this.todoRepository.findOneOrFail({ where: { id: input.id } });
	}

	async deleteTodo(id: string): Promise<void> {
		await this.todoRepository.delete(id);
	}
}
