import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { Chapter } from './entities/chapter.entity';
import { ChapterContent } from './entities/chapter-content.entity';
import { ChapterResource } from './entities/chapter-resource.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter, ChapterContent, ChapterResource]),
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {} 