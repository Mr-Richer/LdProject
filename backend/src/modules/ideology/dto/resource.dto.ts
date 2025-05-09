import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ResourceType {
  Image = 1,  // 图片
  Video = 2,  // 视频
  Link = 3,   // 链接
}

export class ResourceDto {
  @ApiProperty({
    description: '资源类型: 1=图片, 2=视频, 3=链接',
    enum: ResourceType,
    example: 1
  })
  @IsNotEmpty({ message: '资源类型不能为空' })
  @IsEnum(ResourceType, { message: '无效的资源类型' })
  resourceType: ResourceType;

  @ApiProperty({
    description: '资源URL，当resourceType=3(链接)时必填',
    required: false,
    example: 'https://example.com/resource.jpg'
  })
  @ValidateIf(o => o.resourceType === ResourceType.Link)
  @IsNotEmpty({ message: '链接类型资源URL不能为空' })
  @IsUrl({}, { message: '请输入有效的URL' })
  resourceUrl?: string;

  @ApiProperty({
    description: '资源名称，可选',
    required: false,
    example: '教学图片'
  })
  @IsOptional()
  @IsString({ message: '资源名称必须是字符串' })
  resourceName?: string;
} 