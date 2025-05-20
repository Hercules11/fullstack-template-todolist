import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
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
  @IsBoolean()
  @IsNotEmpty()
  isPending: boolean;

  // 创建数据的时候，没有日期参数，这是后端自己生成的，经过后端操作后，才有完整的 Todo 数据
  //   @ApiProperty({ description: 'The status of the todo' })
  //   @IsDate()
  //   @IsNotEmpty()
  //   createdAt: Date;

  //   @ApiProperty({ description: 'The status of the todo' })
  //   @IsDate()
  //   @IsNotEmpty()
  //   updatedAt: Date;
}
