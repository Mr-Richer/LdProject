import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity('chapter_contents')
export class ChapterContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chapter_id: number;

  @Column({ type: 'enum', enum: ['text', 'image', 'video', 'audio', 'link'] })
  content_type: string;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  media_url: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: false })
  is_required: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Chapter, chapter => chapter.contents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter;
} 