import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ChapterContent } from './chapter-content.entity';
import { ChapterResource } from './chapter-resource.entity';

@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chapter_number: number;

  @Column({ length: 100 })
  title_zh: string;

  @Column({ length: 100 })
  title_en: string;

  @Column({ type: 'text', nullable: true })
  description_zh: string;

  @Column({ type: 'text', nullable: true })
  description_en: string;

  @Column({ nullable: true })
  cover_image: string;

  @Column({ nullable: true })
  ppt_file: string;

  @Column({ default: true })
  is_published: boolean;

  @Column({ default: 0 })
  order_index: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ChapterContent, content => content.chapter)
  contents: ChapterContent[];

  @OneToMany(() => ChapterResource, resource => resource.chapter)
  resources: ChapterResource[];
} 