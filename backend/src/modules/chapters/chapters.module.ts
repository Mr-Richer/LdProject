import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { Chapter } from './entities/chapter.entity';
import { ChapterContent } from './entities/chapter-content.entity';
import { ChapterResource } from './entities/chapter-resource.entity';
import { PptController } from './controllers/ppt.controller';
import { PptService } from './services/ppt.service';
import { PptConverterUtil } from '../../common/utils/ppt-converter.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter, ChapterContent, ChapterResource]),
  ],
  controllers: [ChaptersController, PptController],
  providers: [ChaptersService, PptService, PptConverterUtil],
  exports: [ChaptersService, PptService],
})
export class ChaptersModule {} 