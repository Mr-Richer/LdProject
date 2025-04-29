import { Controller, Get, Post, Param, Body, Res, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { PptService } from '../services/ppt.service';

@ApiTags('PPT管理')
@Controller('api/chapters')
export class PptController {
  private readonly logger = new Logger(PptController.name);

  constructor(private readonly pptService: PptService) {}

  @Get(':id/ppt/content')
  @ApiOperation({ summary: '获取章节PPT内容' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取PPT内容' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '未找到章节或PPT文件' })
  async getPPTContent(@Param('id') id: string, @Res() res: Response) {
    try {
      this.logger.log(`获取章节${id}的PPT内容`);
      const pptContent = await this.pptService.getPPTContent(+id);
      return res.status(HttpStatus.OK).json(pptContent);
    } catch (error) {
      this.logger.error(`获取章节${id}的PPT内容失败: ${error.message}`);
      
      if (error.status === HttpStatus.NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message || '未找到章节或PPT文件'
        });
      }
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `获取PPT内容失败: ${error.message}`
      });
    }
  }

  @Post(':id/ppt/content')
  @ApiOperation({ summary: '保存章节PPT内容' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功保存PPT内容' })
  async savePPTContent(@Param('id') id: string, @Body() pptData: any, @Res() res: Response) {
    try {
      this.logger.log(`保存章节${id}的PPT内容`);
      const result = await this.pptService.savePPTContent(+id, pptData);
      return res.status(HttpStatus.OK).json({
        message: '保存成功',
        data: result
      });
    } catch (error) {
      this.logger.error(`保存章节${id}的PPT内容失败: ${error.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `保存PPT内容失败: ${error.message}`
      });
    }
  }
} 