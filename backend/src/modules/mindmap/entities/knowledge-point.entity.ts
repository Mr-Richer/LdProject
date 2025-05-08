import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { MindmapKnowledgeRelation } from './mindmap-knowledge-relation.entity';

@Entity('knowledge_points')
export class KnowledgePoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  keywords: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: 0 })
  is_deleted: number;

  @OneToMany(() => MindmapKnowledgeRelation, relation => relation.knowledge)
  mindmapRelations: MindmapKnowledgeRelation[];
} 