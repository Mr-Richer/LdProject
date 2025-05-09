import { Module } from '@nestjs/common';
import { IdeologyCaseController } from './ideology-case.controller';
import { IdeologyCaseService } from './ideology-case.service';
import { AiModule } from '../ai/ai.module';
import { UploadModule } from '../upload/upload.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    AiModule,
    UploadModule,
    DatabaseModule,
  ],
  controllers: [
    IdeologyCaseController,
  ],
  providers: [
    IdeologyCaseService,
  ],
  exports: [
    IdeologyCaseService,
  ],
})
export class IdeologyModule {} 