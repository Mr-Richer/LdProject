import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { QuizController } from './quiz.controller';
import { ChaptersModule } from '../chapters/chapters.module';
import { PptController } from './ppt.controller';
import { QuizModule } from '../quiz/quiz.module';

@Module({
  imports: [
    ConfigModule,
    ChaptersModule,
    QuizModule
  ],
  providers: [AiService],
  controllers: [QuizController, PptController],
  exports: [AiService],
})
export class AiModule {} 