import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('后台管理')
@Controller('admin')
export class AdminController {
  
  @Post('copy-image')
  @ApiOperation({ summary: '复制上传图片到admin/picture目录' })
  @ApiResponse({ status: HttpStatus.OK, description: '复制成功' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '复制失败' })
  async copyImageToPictureDir(@Body() body: { sourceFileName: string }) {
    try {
      const { sourceFileName } = body;
      
      if (!sourceFileName) {
        return {
          code: HttpStatus.BAD_REQUEST,
          message: '文件名不能为空',
        };
      }
      
      // 源文件路径
      const sourcePath = path.join(process.cwd(), 'uploads', 'images', sourceFileName);
      
      // 目标文件路径
      const targetDir = path.join(process.cwd(), '..', 'admin', 'picture');
      const targetPath = path.join(targetDir, sourceFileName);
      
      // 检查源文件是否存在
      if (!fs.existsSync(sourcePath)) {
        return {
          code: HttpStatus.BAD_REQUEST,
          message: '源文件不存在',
        };
      }
      
      // 确保目标目录存在
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // 复制文件
      fs.copyFileSync(sourcePath, targetPath);
      
      return {
        code: HttpStatus.OK,
        message: '复制成功',
        data: {
          sourcePath,
          targetPath,
        },
      };
    } catch (error) {
      console.error('复制图片失败:', error);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '复制图片失败: ' + error.message,
      };
    }
  }
} 