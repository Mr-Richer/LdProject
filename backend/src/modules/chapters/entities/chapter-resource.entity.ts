import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity('chapter_resources')
export class ChapterResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chapter_id: number;

  @Column({ type: 'enum', enum: ['document', 'ppt', 'video', 'exercise', 'quiz', 'reference'] })
  resource_type: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  file_path: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_downloadable: boolean;

  @Column({ default: 0 })
  sort_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Chapter, chapter => chapter.resources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter;
} 