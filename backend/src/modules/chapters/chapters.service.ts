import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './entities/chapter.entity';
import { ChapterContent } from './entities/chapter-content.entity';
import { ChapterResource } from './entities/chapter-resource.entity';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { MoreThan } from 'typeorm';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chaptersRepository: Repository<Chapter>,
    @InjectRepository(ChapterContent)
    private chapterContentsRepository: Repository<ChapterContent>,
    @InjectRepository(ChapterResource)
    private chapterResourcesRepository: Repository<ChapterResource>,
  ) {}

  async findAll() {
    return this.chaptersRepository.find({
      order: {
        order_index: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const chapter = await this.chaptersRepository.findOne({
      where: { id },
      relations: ['contents', 'resources'],
    });

    if (!chapter) {
      throw new NotFoundException(`章节 #${id} 不存在`);
    }

    return chapter;
  }

  async create(createChapterDto: CreateChapterDto) {
    const chapter = this.chaptersRepository.create(createChapterDto);
    return this.chaptersRepository.save(chapter);
  }

  async update(id: number, updateChapterDto: UpdateChapterDto) {
    const chapter = await this.findOne(id);
    const updatedChapter = this.chaptersRepository.merge(chapter, updateChapterDto);
    return this.chaptersRepository.save(updatedChapter);
  }

  async remove(id: number) {
    const chapter = await this.findOne(id);
    return this.chaptersRepository.remove(chapter);
  }

  // 章节内容相关方法
  async findChapterContents(chapterId: number) {
    const chapter = await this.findOne(chapterId);
    return this.chapterContentsRepository.find({
      where: { chapter_id: chapter.id },
      order: { sort_order: 'ASC' },
    });
  }

  // 章节资源相关方法
  async findChapterResources(chapterId: number) {
    const chapter = await this.findOne(chapterId);
    return this.chapterResourcesRepository.find({
      where: { chapter_id: chapter.id },
      order: { sort_order: 'ASC' },
    });
  }

  // 获取章节统计信息
  async getChapterStats() {
    // 获取总章节数
    const totalCount = await this.chaptersRepository.count();
    
    // 获取最近24小时内新增的章节数
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    const newCount = await this.chaptersRepository.count({
      where: {
        created_at: MoreThan(oneDayAgo)
      }
    });
    
    return {
      total: totalCount,
      newToday: newCount
    };
  }
} 