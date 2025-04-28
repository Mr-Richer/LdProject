import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { QuizController } from './quiz.controller';
import { ChaptersModule } from '../chapters/chapters.module';

@Module({
  imports: [
    ConfigModule,
    ChaptersModule
  ],
  providers: [AiService],
  controllers: [QuizController],
  exports: [AiService],
})
export class AiModule {} 