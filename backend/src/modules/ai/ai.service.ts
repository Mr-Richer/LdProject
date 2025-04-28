import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AiResponseDto, TokenUsage } from './dto/ai-response.dto';
import { AiChatMessage, AiModelConfig, ExternalAiResponse } from './interfaces/ai.interfaces';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly defaultModelType: string;
  private readonly modelsConfig: Record<string, AiModelConfig> = {};

  constructor(private configService: ConfigService) {
    // 从配置中获取AI模型信息
    const aiConfig = this.configService.get('ai');
    this.defaultModelType = aiConfig.default.modelType;
    
    // 配置支持的模型
    this.modelsConfig = {
      openrouter: aiConfig.openrouter,
      chutes: aiConfig.chutes,
    };
    
    this.logger.log(`AI服务已初始化，默认模型类型: ${this.defaultModelType}`);
  }

  /**
   * 生成AI聊天回复
   * @param messages 消息历史记录
   * @param modelType 模型类型（可选）
   * @param temperature 温度参数（可选）
   * @param maxTokens 最大token数（可选）
   */
  async generateChatResponse(
    messages: AiChatMessage[],
    modelType?: string,
    temperature?: number,
    maxTokens?: number,
  ): Promise<AiResponseDto> {
    const aiConfig = this.configService.get('ai');
    const useModelType = modelType || this.defaultModelType;
    const modelConfig = this.modelsConfig[useModelType];
    
    if (!modelConfig) {
      throw new Error(`不支持的模型类型: ${useModelType}`);
    }
    
    if (!modelConfig.apiKey) {
      throw new Error(`未配置模型API密钥: ${useModelType}`);
    }
    
    try {
      const response = await axios.post<ExternalAiResponse>(
        modelConfig.apiUrl,
        {
          model: modelConfig.modelId,
          messages: messages,
          temperature: temperature || aiConfig.default.temperature,
          max_tokens: maxTokens || aiConfig.default.maxTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${modelConfig.apiKey}`,
          },
        },
      );
      
      const result = new AiResponseDto();
      result.content = response.data.choices[0].message.content;
      result.model = response.data.model;
      
      if (response.data.usage) {
        result.usage = new TokenUsage();
        result.usage.prompt_tokens = response.data.usage.prompt_tokens;
        result.usage.completion_tokens = response.data.usage.completion_tokens;
        result.usage.total_tokens = response.data.usage.total_tokens;
      }
      
      return result;
    } catch (error) {
      this.logger.error(`AI请求失败: ${error.message}`, error.stack);
      throw new Error(`AI请求失败: ${error.message}`);
    }
  }

  /**
   * 生成课前小测题目
   * @param chapterContent 章节内容
   * @param count 题目数量
   * @param difficulty 难度级别
   */
  async generateQuizQuestions(
    chapterContent: string,
    count: number = this.configService.get('ai.quiz.defaultCount'),
    difficulty: string = this.configService.get('ai.quiz.defaultDifficulty'),
  ): Promise<AiResponseDto> {
    const maxQuestions = this.configService.get('ai.quiz.maxQuestions');
    const actualCount = Math.min(count, maxQuestions);
    
    const prompt = `
根据以下章节内容，生成${actualCount}道${this.getDifficultyText(difficulty)}难度的中国文化知识小测试题目（包含选择题和判断题）。
每个题目必须包含题干、选项（选择题）和正确答案。请按以下JSON格式返回：
[
  {
    "type": "choice", // 选择题
    "question": "题目内容",
    "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
    "answer": "A", // 正确答案选项
    "explanation": "解析说明"
  },
  {
    "type": "true_false", // 判断题
    "question": "题目内容",
    "answer": true, // 或 false
    "explanation": "解析说明"
  }
]

章节内容：
${chapterContent}
`;

    const messages: AiChatMessage[] = [
      { role: 'system', content: '你是一个专业的中国文化教育助手，擅长根据教学内容设计合适的测试题目。' },
      { role: 'user', content: prompt }
    ];
    
    return this.generateChatResponse(messages);
  }
  
  /**
   * 将难度级别转换为中文描述
   */
  private getDifficultyText(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return '中等';
    }
  }
} 