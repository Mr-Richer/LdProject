import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MindmapNode } from './mindmap-node.entity';
import { MindmapKnowledgeRelation } from './mindmap-knowledge-relation.entity';

@Entity('mindmaps')
export class Mindmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  central_topic: string;

  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  chapter_id: number;

  @Column({ default: 'standard', length: 50 })
  style: string;

  @Column({ default: 4 })
  max_levels: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: 0 })
  is_deleted: number;

  @OneToMany(() => MindmapNode, node => node.mindmap)
  nodes: MindmapNode[];

  @OneToMany(() => MindmapKnowledgeRelation, relation => relation.mindmap)
  knowledgeRelations: MindmapKnowledgeRelation[];
} 