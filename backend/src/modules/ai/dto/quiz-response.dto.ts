import { ApiProperty } from '@nestjs/swagger';

/**
 * 选项DTO
 */
export class QuizOptionDto {
  @ApiProperty({ description: '选项ID', example: 'A' })
  id: string;

  @ApiProperty({ description: '选项文本', example: '选项A: 孔子' })
  text: string;
}

/**
 * 单选题DTO
 */
export class SingleChoiceQuestionDto {
  @ApiProperty({ description: '题目ID', example: 'q1' })
  id: string;

  @ApiProperty({ description: '题目类型', example: 'single' })
  type: string;

  @ApiProperty({ description: '题目内容', example: '《论语》的作者是谁？' })
  questionText: string;

  @ApiProperty({ description: '选项列表', type: [QuizOptionDto] })
  options: QuizOptionDto[];

  @ApiProperty({ description: '正确答案', example: 'A' })
  correctAnswer: string;

  @ApiProperty({ description: '题目解析', example: '《论语》是记录孔子及其弟子言行的书籍，由孔子的弟子及再传弟子编撰而成。' })
  explanation: string;
}

/**
 * 多选题DTO
 */
export class MultipleChoiceQuestionDto {
  @ApiProperty({ description: '题目ID', example: 'q2' })
  id: string;

  @ApiProperty({ description: '题目类型', example: 'multiple' })
  type: string;

  @ApiProperty({ description: '题目内容', example: '以下哪些是中国传统节日？' })
  questionText: string;

  @ApiProperty({ description: '选项列表', type: [QuizOptionDto] })
  options: QuizOptionDto[];

  @ApiProperty({ description: '正确答案', example: ['A', 'B', 'D'] })
  correctAnswer: string[];

  @ApiProperty({ description: '题目解析', example: '春节、元宵节和中秋节都是中国的传统节日，而感恩节是西方节日。' })
  explanation: string;
}

/**
 * 判断题DTO
 */
export class TrueFalseQuestionDto {
  @ApiProperty({ description: '题目ID', example: 'q3' })
  id: string;

  @ApiProperty({ description: '题目类型', example: 'truefalse' })
  type: string;

  @ApiProperty({ description: '题目内容', example: '长城是世界上最长的城墙。' })
  questionText: string;

  @ApiProperty({ description: '选项列表', type: [QuizOptionDto] })
  options: QuizOptionDto[];

  @ApiProperty({ description: '正确答案', example: true })
  correctAnswer: boolean;

  @ApiProperty({ description: '题目解析', example: '长城确实是世界上最长的城墙，全长超过21,000公里。' })
  explanation: string;
}

/**
 * 题目DTO联合类型
 */
export type QuizQuestionDto = SingleChoiceQuestionDto | MultipleChoiceQuestionDto | TrueFalseQuestionDto;

/**
 * 课堂小测响应数据DTO
 */
export class QuizResponseDataDto {
  @ApiProperty({ 
    description: '题目列表',
    type: [Object]
  })
  questions: any[];

  @ApiProperty({
    description: '是否已保存到数据库',
    required: false,
    type: Boolean
  })
  savedToDatabase?: boolean;

  @ApiProperty({
    description: '保存到数据库的题目数量',
    required: false,
    type: Number
  })
  savedCount?: number;

  @ApiProperty({
    description: '保存失败时的错误信息',
    required: false,
    type: String
  })
  error?: string;
}

/**
 * 课堂小测响应DTO
 */
export class QuizResponseDto {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ 
    description: '返回数据',
    type: QuizResponseDataDto
  })
  data: QuizResponseDataDto;

  @ApiProperty({ description: '消息', example: '题目生成成功' })
  message: string;
} 