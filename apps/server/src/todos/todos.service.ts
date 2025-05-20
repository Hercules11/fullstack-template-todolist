import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Todo } from '.prisma/client';

@Injectable()
export class TodosService {
  // 类型被声明，服务被注册，就可以直接使用，Nest 会自动完成实例化和注入
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const { id, title, description, completed, isPending } = createTodoDto;
    return this.prisma.todo.create({
      data: {
        id,
        title,
        description,
        completed,
        isPending,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findOne(id: string): Promise<Todo | null> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  findAll() {
    return this.prisma.todo.findMany();
  }

  // findOne(id: string) {
  //   return `This action returns a #${id} todo`;
  // }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    console.log(updateTodoDto);
    await this.findOne(id);

    const todo = await this.prisma.todo.update({
      where: { id },
      data: {
        title: updateTodoDto.title,
        description: updateTodoDto.description,
        completed: updateTodoDto.completed,
        // updatedAt: new Date(), // 这里不需要更新，因为 Prisma 会自动更新
      },
    });
    return todo;
  }

  async remove(id: string): Promise<Todo> {
    // console.log(id);
    const res = await this.prisma.todo.delete({ where: { id } });
    return res;
  }
}
