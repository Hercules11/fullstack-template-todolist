import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  // 如果数据不符合 DTO 定义的规则，会自动返回错误响应，无需在控制器中编写繁琐的校验逻辑
  @ApiProperty({ description: 'The unique identifier of the todo' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'The title of the todo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the todo' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The status of the todo' })
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

  @ApiProperty({ description: 'The status of the todo' })
  @IsOptional()
  isPending?: boolean;
}
