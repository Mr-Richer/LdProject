import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, HttpStatus, Get, Header, Res, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UploadService } from './upload.service';
import { join } from 'path';
import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';

@ApiTags('文件上传')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: '上传图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '图片文件',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: '上传成功' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = this.uploadService.getFileUrl(file.filename, 'image');
    return {
      code: HttpStatus.OK,
      message: '上传成功',
      data: {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
      },
    };
  }

  @Post('ppt')
  @ApiOperation({ summary: '上传PPT文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PPT文件',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: '上传成功' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPpt(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = this.uploadService.getFileUrl(file.filename, 'ppt');
    return {
      code: HttpStatus.OK,
      message: '上传成功',
      data: {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
      },
    };
  }

  @Post('resource')
  @ApiOperation({ summary: '上传资源文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '资源文件',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: '上传成功' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadResource(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = this.uploadService.getFileUrl(file.filename, 'resource');
    return {
      code: HttpStatus.OK,
      message: '上传成功',
      data: {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
      },
    };
  }

  @Get('getPPT')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
  async getPPT(@Res() res) {
    try {
      const pptDir = join(process.cwd(), 'uploads/ppt');
      if (!existsSync(pptDir)) {
        mkdirSync(pptDir, { recursive: true });
      }
      
      const defaultPptPath = join(pptDir, 'default.pptx');
      if (!existsSync(defaultPptPath)) {
        return res.status(404).send({ message: '默认PPT文件不存在' });
      }
      
      return res.sendFile(defaultPptPath);
    } catch (error) {
      console.error('获取PPT文件失败:', error);
      return res.status(500).send({ message: '获取PPT文件失败' });
    }
  }

  @Get('listPPT')
  async listPPT() {
    try {
      const pptDir = join(process.cwd(), 'uploads/ppt');
      if (!existsSync(pptDir)) {
        mkdirSync(pptDir, { recursive: true });
        return { files: [] };
      }
      
      const files = readdirSync(pptDir)
        .filter(file => file.endsWith('.pptx') || file.endsWith('.pptist'))
        .map(file => ({
          name: file,
          path: `/api/upload/getPPT/${file}`,
          type: file.endsWith('.pptx') ? 'pptx' : 'pptist',
          size: statSync(join(pptDir, file)).size,
          lastModified: statSync(join(pptDir, file)).mtime
        }));
      
      return { files };
    } catch (error) {
      console.error('获取PPT文件列表失败:', error);
      throw new Error('获取PPT文件列表失败');
    }
  }

  @Get('getPPT/:filename')
  async getPPTByName(@Param('filename') filename: string, @Res() res) {
    try {
      const pptDir = join(process.cwd(), 'uploads/ppt');
      const filePath = join(pptDir, filename);
      
      if (!existsSync(filePath)) {
        return res.status(404).send({ message: `文件 ${filename} 不存在` });
      }
      
      const contentType = filename.endsWith('.pptx') 
        ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        : 'application/json';
      
      res.header('Content-Type', contentType);
      return res.sendFile(filePath);
    } catch (error) {
      console.error(`获取PPT文件 ${filename} 失败:`, error);
      return res.status(500).send({ message: `获取PPT文件 ${filename} 失败` });
    }
  }
} 