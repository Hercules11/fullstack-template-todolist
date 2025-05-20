import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Todo } from '.prisma/client';

// 加不加斜杠 NestJS 都能自动规范化，实际效果一样，但建议按照官方文档习惯不加斜杠。
@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Explicitly set 201 for creation
  @ApiOperation({ summary: 'Create a todo' })
  @ApiBody({ type: CreateTodoDto }) // Explicitly define request body type for Swagger
  @ApiResponse({ status: 201, description: 'Create a todo'})
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'Get all todos', isArray: true })
  findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get a todo by id' })
  // @ApiParam({ name: 'id', description: 'Todo ID' })
  // @ApiResponse({ status: 200, description: 'Return the todo' })
  // @ApiResponse({ status: 404, description: 'Todo not found' })
  // async findOne(@Param('id') id: string): Promise<Todo> {
  //   return this.todosService.findOne(id);
  // }

  @Post(':id')
  @ApiOperation({ summary: 'Update an existing todo by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the todo to update',
    type: String,
  })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The todo has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '1234567890',
        },
        title: {
          type: 'string',
          example: 'Updated Todo Title',
        },
        description: {
          type: 'string',
          example: 'Updated Todo Description',
        },
        completed: {
          type: 'boolean',
          example: true,
        },
        isPending: {
          type: 'boolean',
          example: false,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2023-10-01T00:00:00Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2023-10-01T00:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo with the given ID not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK) // override default status code
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Todo ID to delete',
    type: String,
  })
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The todo has been successfully deleted.',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo with the given ID not found.',
  })
  async remove(
    @Param('id') id: string,
  ): Promise<{ success: Todo; message: string }> {
    const result = await this.todosService.remove(id);
    return { success: result, message: 'Todo deleted successfully' };
  }
}
