import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Mindmap } from './mindmap.entity';
import { KnowledgePoint } from './knowledge-point.entity';

@Entity('mindmap_knowledge_relations')
export class MindmapKnowledgeRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mindmap_id: number;

  @Column()
  knowledge_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Mindmap, mindmap => mindmap.knowledgeRelations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mindmap_id' })
  mindmap: Mindmap;

  @ManyToOne(() => KnowledgePoint, knowledge => knowledge.mindmapRelations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'knowledge_id' })
  knowledge: KnowledgePoint;
} 