import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@ApiTags('章节管理')
@Controller('chapters')
export class ChaptersController {
  constructor(private chaptersService: ChaptersService) {}

  @Get()
  @ApiOperation({ summary: '获取所有章节' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取章节列表' })
  async findAll() {
    const chapters = await this.chaptersService.findAll();
    return {
      code: HttpStatus.OK,
      data: { chapters },
    };
  }

  @Get('stats')
  @ApiOperation({ summary: '获取章节统计信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取章节统计信息' })
  async getStats() {
    const stats = await this.chaptersService.getChapterStats();
    return {
      code: HttpStatus.OK,
      data: stats,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定章节详情' })
  @ApiParam({ name: 'id', description: '章节ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取章节详情' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '章节不存在' })
  async findOne(@Param('id') id: string) {
    const chapter = await this.chaptersService.findOne(+id);
    return {
      code: HttpStatus.OK,
      data: chapter,
    };
  }

  @Post()
  @ApiOperation({ summary: '创建新章节' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '章节创建成功' })
  async create(@Body() createChapterDto: CreateChapterDto) {
    const chapter = await this.chaptersService.create(createChapterDto);
    return {
      code: HttpStatus.CREATED,
      message: '章节创建成功',
      data: { id: chapter.id },
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '更新章节信息' })
  @ApiParam({ name: 'id', description: '章节ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '章节更新成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '章节不存在' })
  async update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    await this.chaptersService.update(+id, updateChapterDto);
    return {
      code: HttpStatus.OK,
      message: '章节更新成功',
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '删除章节' })
  @ApiParam({ name: 'id', description: '章节ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '章节删除成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '章节不存在' })
  async remove(@Param('id') id: string) {
    await this.chaptersService.remove(+id);
    return {
      code: HttpStatus.OK,
      message: '章节删除成功',
    };
  }

  @Get(':id/contents')
  @ApiOperation({ summary: '获取章节内容' })
  @ApiParam({ name: 'id', description: '章节ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取章节内容' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '章节不存在' })
  async getChapterContents(@Param('id') id: string) {
    const contents = await this.chaptersService.findChapterContents(+id);
    return {
      code: HttpStatus.OK,
      data: { contents },
    };
  }

  @Get(':id/resources')
  @ApiOperation({ summary: '获取章节资源' })
  @ApiParam({ name: 'id', description: '章节ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取章节资源' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '章节不存在' })
  async getChapterResources(@Param('id') id: string) {
    const resources = await this.chaptersService.findChapterResources(+id);
    return {
      code: HttpStatus.OK,
      data: { resources },
    };
  }
} 