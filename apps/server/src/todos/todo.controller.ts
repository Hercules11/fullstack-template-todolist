// apps/server/src/todos/todo.controller.ts
import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { CreateTodoInput, UpdateTodoInput } from "@todo-monorepo/datasource";

@Controller("todos")
export class TodoController {
	constructor(private readonly todoService: TodoService) {}

	@Post()
	async create(@Body() input: CreateTodoInput) {
		return this.todoService.createTodo(input);
	}

	@Get()
	async findAll() {
		return this.todoService.getAllTodos();
	}

	@Put(":id")
	async update(@Param("id") id: string, @Body() input: UpdateTodoInput) {
		return this.todoService.updateTodo({ ...input, id });
	}

	@Delete(":id")
	async delete(@Param("id") id: string) {
		return this.todoService.deleteTodo(id);
	}
}
