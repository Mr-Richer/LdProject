import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MindmapController } from './mindmap.controller';
import { GenerateMindmapController } from './generate-mindmap.controller';
import { MindmapService } from './mindmap.service';
import { Mindmap } from './entities/mindmap.entity';
import { MindmapNode } from './entities/mindmap-node.entity';
import { KnowledgePoint } from './entities/knowledge-point.entity';
import { MindmapKnowledgeRelation } from './entities/mindmap-knowledge-relation.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mindmap,
      MindmapNode,
      KnowledgePoint,
      MindmapKnowledgeRelation
    ]),
    AiModule,
  ],
  controllers: [MindmapController, GenerateMindmapController],
  providers: [MindmapService],
  exports: [MindmapService],
})
export class MindmapModule {} 