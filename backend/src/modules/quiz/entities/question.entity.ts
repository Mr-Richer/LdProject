import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 题目实体
 */
@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quiz_id', nullable: false })
  quiz_id: number;

  @Column({ type: 'enum', enum: ['choice', 'single', 'multiple', 'short', 'discussion'], default: 'choice' })
  type: string;

  @Column({ type: 'text', nullable: true })
  options: string;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'text', nullable: false })
  question: string;

  @Column({ type: 'varchar', length: 255, default: 'medium' })
  difficulty: string;

  @Column({ name: 'chapterID', nullable: true })
  chapterID: number;

  @Column({ default: 0 })
  order: number;

  @Column({ name: 'quizId', nullable: true })
  quizId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 0 })
  isDeleted: number;
} 