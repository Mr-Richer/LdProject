import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryCaseDto {
  @ApiProperty({
    description: '章节ID，可选',
    required: false,
    example: 1
  })
  @IsOptional()
  @IsInt({ message: '章节ID必须是整数' })
  @Type(() => Number)
  chapterId?: number;

  @ApiProperty({
    description: '用户ID，可选',
    required: false,
    example: 1
  })
  @IsOptional()
  @IsInt({ message: '用户ID必须是整数' })
  @Type(() => Number)
  userId?: number;

  @ApiProperty({
    description: '页码，默认为1',
    required: false,
    example: 1
  })
  @IsOptional()
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为1' })
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: '每页条数，默认为10',
    required: false,
    example: 10
  })
  @IsOptional()
  @IsInt({ message: '每页条数必须是整数' })
  @Min(1, { message: '每页条数最小为1' })
  @Type(() => Number)
  limit?: number = 10;
} 