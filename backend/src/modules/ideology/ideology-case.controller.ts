import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../users/entities/user.entity';
import { IdeologyCaseService } from './ideology-case.service';
import { GenerateCaseDto } from './dto/generate-case.dto';
import { QueryCaseDto } from './dto/query-case.dto';
import { ResourceDto } from './dto/resource.dto';
import { GenerateTopicsDto } from './dto/generate-topics.dto';

@ApiTags('思政案例')
@Controller('ideology')
export class IdeologyCaseController {
  constructor(private readonly ideologyCaseService: IdeologyCaseService) {}

  @Post('case/generate')
  @ApiOperation({ summary: '生成思政案例' })
  @ApiResponse({ status: 201, description: '案例生成成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 500, description: '服务器错误' })
  async generateCase(
    @Body() generateCaseDto: GenerateCaseDto,
  ) {
    // 设置默认用户ID
    const userId = generateCaseDto.userId || 1;
    return this.ideologyCaseService.generateCase({
      ...generateCaseDto,
      userId,
    });
  }

  @Post('case')
  @ApiOperation({ summary: '创建思政案例' })
  @ApiResponse({ status: 201, description: '案例创建成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 500, description: '服务器错误' })
  async createCase(@Body() caseData: any) {
    try {
      console.log('接收到的请求体原始数据:', JSON.stringify(caseData));
      
      // 处理可能的字符串类型转换
      let parsedData = caseData;
      if (typeof caseData === 'string') {
        try {
          parsedData = JSON.parse(caseData);
          console.log('已将字符串解析为JSON:', parsedData);
        } catch (e) {
          console.error('解析JSON字符串失败:', e);
        }
      }
      
      // 打印处理后的数据
      console.log('处理后的案例数据:', JSON.stringify(parsedData));
      
      // 设置默认用户ID
      const userId = parsedData.user_id || 1;
      
      // 调用服务创建案例
      return this.ideologyCaseService.createCase(parsedData);
    } catch (error) {
      console.error('创建案例控制器错误:', error);
      throw error;
    }
  }

  @Post('topics/generate')
  @ApiOperation({ summary: '生成讨论题' })
  @ApiResponse({ status: 201, description: '讨论题生成成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 500, description: '服务器错误' })
  async generateTopics(
    @Body() generateTopicsDto: GenerateTopicsDto,
  ) {
    return this.ideologyCaseService.generateTopics(generateTopicsDto);
  }

  @Post('discussion/generate')
  @ApiOperation({ summary: '生成讨论题' })
  @ApiResponse({ status: 201, description: '讨论题生成成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 500, description: '服务器错误' })
  async generateDiscussions(
    @Body() generateTopicsDto: GenerateTopicsDto,
  ) {
    return this.ideologyCaseService.generateDiscussions(generateTopicsDto);
  }

  @Post('discussion/save-batch')
  @ApiOperation({ summary: '批量保存讨论题' })
  async saveDiscussionBatch(@Body() body: { topics: any[] }) {
    return this.ideologyCaseService.saveDiscussionBatch(body.topics);
  }

  @Get('case')
  @ApiOperation({ summary: '获取思政案例列表' })
  @ApiResponse({ status: 200, description: '成功获取列表' })
  async getCases(@Query() queryDto: QueryCaseDto) {
    return this.ideologyCaseService.getCases(queryDto);
  }

  @Get('case/:id')
  @ApiOperation({ summary: '获取思政案例详情' })
  @ApiParam({ name: 'id', description: '案例ID' })
  @ApiResponse({ status: 200, description: '成功获取案例详情' })
  @ApiResponse({ status: 404, description: '案例不存在' })
  async getCaseDetail(@Param('id') id: number) {
    return this.ideologyCaseService.getCaseDetail(id);
  }

  @Put('case/:id')
  @ApiOperation({ summary: '更新思政案例' })
  @ApiParam({ name: 'id', description: '案例ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '案例不存在' })
  async updateCase(
    @Param('id') id: number,
    @Body() updateData: Partial<GenerateCaseDto>,
  ) {
    return this.ideologyCaseService.updateCase(id, updateData);
  }

  @Delete('case/:id')
  @ApiOperation({ summary: '删除思政案例' })
  @ApiParam({ name: 'id', description: '案例ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '案例不存在' })
  async deleteCase(@Param('id') id: number) {
    return this.ideologyCaseService.deleteCase(id);
  }

  @Post('case/:id/resource')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传思政案例资源' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: '案例ID' })
  @ApiResponse({ status: 201, description: '资源上传成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 404, description: '案例不存在' })
  async uploadResource(
    @Param('id') caseId: number,
    @Body() resourceDto: ResourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ideologyCaseService.uploadResource(caseId, resourceDto, file);
  }

  @Delete('case/:id/resource/:resourceId')
  @ApiOperation({ summary: '删除思政案例资源' })
  @ApiParam({ name: 'id', description: '案例ID' })
  @ApiParam({ name: 'resourceId', description: '资源ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '资源不存在' })
  async deleteResource(
    @Param('id') caseId: number,
    @Param('resourceId') resourceId: number,
  ) {
    return this.ideologyCaseService.deleteResource(caseId, resourceId);
  }
} 