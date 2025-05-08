import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Mindmap } from './mindmap.entity';

@Entity('mindmap_nodes')
export class MindmapNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mindmap_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, nullable: true })
  value: string;

  @Column({ nullable: true })
  parent_id: number;

  @Column()
  level: number;

  @Column({ default: 0 })
  position: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: 0 })
  is_deleted: number;

  @ManyToOne(() => Mindmap, mindmap => mindmap.nodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mindmap_id' })
  mindmap: Mindmap;

  @ManyToOne(() => MindmapNode, node => node.children)
  @JoinColumn({ name: 'parent_id' })
  parent: MindmapNode;

  @OneToMany(() => MindmapNode, node => node.parent)
  children: MindmapNode[];
} 