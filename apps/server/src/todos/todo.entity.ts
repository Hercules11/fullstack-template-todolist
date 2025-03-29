// apps/server/src/todos/todo.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";
import { Todo as TodoInterface } from "@todo-monorepo/datasource";

@Entity("todos")
export class Todo implements TodoInterface {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	title: string;

	@Column({ nullable: true })
	description?: string;

	@Column({ default: false })
	completed: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
