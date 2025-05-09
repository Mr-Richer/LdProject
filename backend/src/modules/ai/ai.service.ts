import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AiResponseDto, TokenUsage } from './dto/ai-response.dto';
import { AiChatMessage, AiModelConfig, ExternalAiResponse } from './interfaces/ai.interfaces';
import { GenerationMethod, QuizType } from './dto/quiz-prompt-request.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly defaultModelType: string;
  private readonly modelsConfig: Record<string, AiModelConfig> = {};
  private readonly defaultTemperature: number = 0.7;
  private readonly defaultMaxTokens: number = 1000;

  constructor(private configService: ConfigService) {
    // 从配置中获取AI模型信息
    const aiConfig = this.configService.get('ai');
    
    if (!aiConfig) {
      this.logger.warn('无法加载AI配置，使用默认值');
      this.defaultModelType = 'chutes';
      
      // 使用默认配置
      this.modelsConfig = {
        openrouter: {
          apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
          modelId: 'deepseek/deepseek-chat-v3-0324:free',
          apiKey: '',
        },
        chutes: {
          apiUrl: 'https://llm.chutes.ai/v1/chat/completions',
          modelId: 'deepseek-ai/DeepSeek-V3-0324',
          apiKey: 'cpk_4e6c011db10249f0bdc7b8f8df40cf9f.096169649b4d5c67b42bc5b83b11e149.KcltcWhOps9qvpqYOyoiSjG1JQOAkl33',
        },
      };
    } else {
      // 使用配置文件中的配置，但强制使用chutes模型，因为已经在测试中验证了它可以工作
      this.defaultModelType = 'chutes';
      
      this.modelsConfig = {
        openrouter: aiConfig.openrouter || {
          apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
          modelId: 'deepseek/deepseek-chat-v3-0324:free',
          apiKey: '',
        },
        chutes: aiConfig.chutes || {
          apiUrl: 'https://llm.chutes.ai/v1/chat/completions',
          modelId: 'deepseek-ai/DeepSeek-V3-0324',
          apiKey: 'cpk_4e6c011db10249f0bdc7b8f8df40cf9f.096169649b4d5c67b42bc5b83b11e149.KcltcWhOps9qvpqYOyoiSjG1JQOAkl33',
        },
      };
    }
    
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
      // 准备请求头
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${modelConfig.apiKey}`,
      };
      
      const response = await axios.post<ExternalAiResponse>(
        modelConfig.apiUrl,
        {
          model: modelConfig.modelId,
          messages: messages,
          temperature: temperature || aiConfig?.default?.temperature || this.defaultTemperature,
          max_tokens: maxTokens || aiConfig?.default?.maxTokens || this.defaultMaxTokens,
        },
        { headers },
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
      
      // 记录更详细的错误信息
      if (error.response) {
        this.logger.error(`HTTP状态码: ${error.response.status}`);
        this.logger.error(`错误详情: ${JSON.stringify(error.response.data)}`);
      }
      
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
    count?: number,
    difficulty?: string,
  ): Promise<AiResponseDto> {
    const aiConfig = this.configService.get('ai');
    const defaultCount = aiConfig?.quiz?.defaultCount || 5;
    const defaultDifficulty = aiConfig?.quiz?.defaultDifficulty || 'medium';
    const maxQuestions = aiConfig?.quiz?.maxQuestions || 20;
    
    const actualCount = Math.min(count || defaultCount, maxQuestions);
    const actualDifficulty = difficulty || defaultDifficulty;
    
    const prompt = `
根据以下章节内容，生成${actualCount}道${this.getDifficultyText(actualDifficulty)}难度的中国文化知识小测试题目（包含选择题和判断题）。
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
   * 根据提示词生成课堂小测题目
   * @param prompt 用户提供的提示词
   * @param quizType 题目类型（单选题、多选题、判断题）
   * @param method 生成方式（智能生成、随机生成）
   * @param count 题目数量
   * @param difficulty 难度级别
   */
  async generateQuizByPrompt(
    prompt: string,
    quizType: QuizType = QuizType.SINGLE,
    method: GenerationMethod = GenerationMethod.AI,
    count?: number,
    difficulty?: string,
  ): Promise<AiResponseDto> {
    // 获取配置
    const aiConfig = this.configService.get('ai');
    const defaultCount = aiConfig?.quiz?.defaultCount || 5;
    const defaultDifficulty = aiConfig?.quiz?.defaultDifficulty || 'medium';
    const maxQuestions = aiConfig?.quiz?.maxQuestions || 20;
    
    // 使用默认值或提供的值
    const actualCount = Math.min(count || defaultCount, maxQuestions);
    const actualDifficulty = difficulty || defaultDifficulty;
    
    // 记录日志
    this.logger.log(`使用提示词生成题目: 
      提示词=${prompt}, 
      类型=${quizType}, 
      方式=${method}, 
      数量=${actualCount}, 
      难度=${actualDifficulty}`);
    
    // 随机生成方式
    if (method === GenerationMethod.RANDOM) {
      return this.generateRandomQuizQuestions(prompt, quizType, actualCount, actualDifficulty);
    }
    
    // 智能生成方式 (AI)
    let typeDescription = '';
    switch (quizType) {
      case QuizType.SINGLE:
        typeDescription = '单选题';
        break;
      case QuizType.MULTIPLE:
        typeDescription = '多选题';
        break;
      case QuizType.SHORT_ANSWER:
        typeDescription = '简答题';
        break;
      case QuizType.DISCUSSION:
        typeDescription = '讨论题';
        break;
    }
    
    const aiPrompt = `
请根据以下提示词，生成${actualCount}道${this.getDifficultyText(actualDifficulty)}难度的中国文化${typeDescription}。
每个题目必须包含题干、选项和正确答案。请按以下JSON格式返回：

${this.getQuizJsonFormat(quizType)}

提示词：${prompt}
`;

    const messages: AiChatMessage[] = [
      { role: 'system', content: '你是一个专业的中国文化教育助手，擅长根据提示词设计合适的测试题目。请只返回JSON格式数据，不要有任何额外解释。' },
      { role: 'user', content: aiPrompt }
    ];
    
    const response = await this.generateChatResponse(messages);
    
    // 从AI响应中解析JSON格式的题目
    let questions = [];
    try {
      // 尝试在响应内容中查找JSON数组
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedQuestions = JSON.parse(jsonMatch[0]);
        
        // 转换题目格式，确保与前端期望的格式一致
        questions = parsedQuestions.map(q => {
          // 基本字段转换
          const formattedQuestion: any = {
            id: q.id || `q${Math.random().toString(36).substring(2, 9)}`,
            type: q.type || quizType,
            questionText: q.questionText || q.question || '未提供题目内容',
            explanation: q.explanation || '',
            options: [],
            correctAnswer: null
          };
          
          // 处理选项
          if (Array.isArray(q.options)) {
            // 已经是数组格式，检查元素是否符合{id, text}结构
            formattedQuestion.options = q.options.map(opt => {
              if (typeof opt === 'string') {
                // 尝试从字符串中解析选项ID和文本
                const match = opt.match(/^([A-Z0-9])[\.、\s]*\s*(.+)$/);
                if (match) {
                  return { id: match[1], text: match[2] };
                }
                return { id: '?', text: opt };
              } else if (typeof opt === 'object' && opt !== null) {
                // 已经是对象格式，确保有id和text字段
                return { 
                  id: opt.id || opt.label || '?', 
                  text: opt.text || opt.content || opt.value || '' 
                };
              }
              return { id: '?', text: String(opt) };
            });
          } else if (q.type === QuizType.SHORT_ANSWER || quizType === QuizType.SHORT_ANSWER) {
            // 简答题不需要选项
            formattedQuestion.options = [];
          } else if (q.type === QuizType.DISCUSSION || quizType === QuizType.DISCUSSION) {
            // 讨论题不需要选项
            formattedQuestion.options = [];
          } else {
            // 默认为空选项数组
            formattedQuestion.options = [];
          }
          
          // 处理答案
          if (q.correctAnswer !== undefined) {
            formattedQuestion.correctAnswer = q.correctAnswer;
          } else if (q.answer !== undefined) {
            formattedQuestion.correctAnswer = q.answer;
          } else {
            // 默认答案
            if (q.type === QuizType.SHORT_ANSWER || quizType === QuizType.SHORT_ANSWER) {
              formattedQuestion.correctAnswer = '参考答案未提供';
            } else if (q.type === QuizType.DISCUSSION || quizType === QuizType.DISCUSSION) {
              // 讨论题没有标准答案，但可以有讨论方向
              formattedQuestion.discussionPoints = q.discussionPoints || '讨论方向未提供';
              formattedQuestion.correctAnswer = null;
            } else if (q.type === QuizType.MULTIPLE || quizType === QuizType.MULTIPLE) {
              formattedQuestion.correctAnswer = [];
            } else {
              formattedQuestion.correctAnswer = 'A';
            }
          }
          
          return formattedQuestion;
        });
        
        this.logger.log(`成功转换题目格式，共${questions.length}道题`);
      } else {
        throw new Error('无法从AI响应中解析JSON数据');
      }
    } catch (error) {
      this.logger.error(`解析AI响应JSON失败: ${error.message}`);
      throw new Error('解析生成的题目时出错');
    }
    
    // 创建返回结果
    const result = new AiResponseDto();
    result.content = JSON.stringify(questions);
    result.model = 'random-generator';
    
    return result;
  }
  
  /**
   * 随机生成小测题目（不调用AI）
   * 这个方法在无法使用AI接口或选择随机生成方式时使用
   */
  private async generateRandomQuizQuestions(
    topic: string,
    quizType: QuizType,
    count: number,
    difficulty: string
  ): Promise<AiResponseDto> {
    // 生成随机题目
    const questions = [];
    
    for (let i = 1; i <= count; i++) {
      // 根据题型生成不同结构的题目
      switch (quizType) {
        case QuizType.SINGLE:
          questions.push({
            id: `q${i}`,
            type: 'single',
            questionText: `单选题 #${i}: 关于${topic}的问题`,
            options: [
              { id: 'A', text: `选项A` },
              { id: 'B', text: `选项B` },
              { id: 'C', text: `选项C` },
              { id: 'D', text: `选项D` }
            ],
            correctAnswer: 'A',
            explanation: `这是一道关于${topic}的自动生成单选题`
          });
          break;
        
        case QuizType.MULTIPLE:
          questions.push({
            id: `q${i}`,
            type: 'multiple',
            questionText: `多选题 #${i}: 关于${topic}的问题`,
            options: [
              { id: 'A', text: `选项A` },
              { id: 'B', text: `选项B` },
              { id: 'C', text: `选项C` },
              { id: 'D', text: `选项D` }
            ],
            correctAnswer: ['A', 'B'],
            explanation: `这是一道关于${topic}的自动生成多选题`
          });
          break;
        
        case QuizType.SHORT_ANSWER:
          questions.push({
            id: `q${i}`,
            type: 'short_answer',
            questionText: `简答题 #${i}: 关于${topic}的问题`,
            correctAnswer: `这是一道关于${topic}的自动生成简答题的参考答案`,
            explanation: `这是一道关于${topic}的自动生成简答题`
          });
          break;
          
        case QuizType.DISCUSSION:
          questions.push({
            id: `q${i}`,
            type: 'discussion',
            questionText: `讨论题 #${i}: 关于${topic}的问题`,
            discussionPoints: `可以从以下几个方面讨论：\n1. 方面一\n2. 方面二\n3. 方面三`,
            explanation: `这是一道关于${topic}的自动生成讨论题`
          });
          break;
      }
    }
    
    // 创建返回结果
    const result = new AiResponseDto();
    result.content = JSON.stringify(questions);
    result.model = 'random-generator';
    
    return result;
  }
  
  /**
   * 获取不同题型的JSON格式示例
   */
  private getQuizJsonFormat(quizType: QuizType): string {
    switch (quizType) {
      case QuizType.SINGLE:
        return `[
  {
    "id": "q1",
    "type": "single",
    "questionText": "题目内容",
    "options": [
      { "id": "A", "text": "选项A内容" },
      { "id": "B", "text": "选项B内容" },
      { "id": "C", "text": "选项C内容" },
      { "id": "D", "text": "选项D内容" }
    ],
    "correctAnswer": "A",
    "explanation": "解析说明"
  },
  ...
]`;
      
      case QuizType.MULTIPLE:
        return `[
  {
    "id": "q1",
    "type": "multiple",
    "questionText": "题目内容",
    "options": [
      { "id": "A", "text": "选项A内容" },
      { "id": "B", "text": "选项B内容" },
      { "id": "C", "text": "选项C内容" },
      { "id": "D", "text": "选项D内容" }
    ],
    "correctAnswer": ["A", "C"],
    "explanation": "解析说明"
  },
  ...
]`;
      
      case QuizType.SHORT_ANSWER:
        return `[
  {
    "id": "q1",
    "type": "short_answer",
    "questionText": "题目内容",
    "correctAnswer": "参考答案",
    "explanation": "解析说明"
  },
  ...
]`;
      
      case QuizType.DISCUSSION:
        return `[
  {
    "id": "q1",
    "type": "discussion",
    "questionText": "题目内容",
    "discussionPoints": "可以从以下几个方面讨论：\\n1. 方面一\\n2. 方面二\\n3. 方面三",
    "explanation": "解析说明"
  },
  ...
]`;
    }
  }
  
  /**
   * 将难度级别转换为中文描述
   */
  private getDifficultyText(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '中等';
    }
  }

  /**
   * 生成文本（用于简单文本生成场景）
   * @param prompt 提示词
   * @param modelType 模型类型
   * @param temperature 温度参数
   * @param maxTokens 最大token数
   * @returns AI生成的响应
   */
  async generateText(prompt: string, modelType?: string, temperature?: number, maxTokens?: number): Promise<{text: string}> {
    try {
      const messages: AiChatMessage[] = [
        { role: 'system', content: '你是一个有用的AI助手，擅长根据指示创建高质量的文本内容。' },
        { role: 'user', content: prompt }
      ];
      
      const response = await this.generateChatResponse(messages, modelType, temperature, maxTokens);
      
      return { text: response.content };
    } catch (error) {
      this.logger.error(`文本生成失败: ${error.message}`, error.stack);
      throw new Error(`文本生成失败: ${error.message}`);
    }
  }
} 