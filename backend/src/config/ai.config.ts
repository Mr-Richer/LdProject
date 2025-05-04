/**
 * AI模型配置
 * 从环境变量中加载AI模型相关配置
 */
import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  default: {
    modelType: process.env.AI_DEFAULT_MODEL_TYPE || 'chutes',
    temperature: parseFloat(process.env.AI_DEFAULT_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_DEFAULT_MAX_TOKENS || '1000', 10)
  },
  
  openrouter: {
    apiUrl: process.env.AI_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
    modelId: process.env.AI_OPENROUTER_MODEL_ID || 'deepseek/deepseek-chat-v3-0324:free',
    apiKey: process.env.AI_OPENROUTER_API_KEY || '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'
  },
  
  chutes: {
    apiUrl: process.env.AI_CHUTES_API_URL || 'https://llm.chutes.ai/v1/chat/completions',
    modelId: process.env.AI_CHUTES_MODEL_ID || 'deepseek-ai/DeepSeek-V3-0324',
    apiKey: process.env.AI_CHUTES_API_KEY || 'cpk_4e6c011db10249f0bdc7b8f8df40cf9f.096169649b4d5c67b42bc5b83b11e149.KcltcWhOps9qvpqYOyoiSjG1JQOAkl33'
  },
  
  quiz: {
    defaultCount: parseInt(process.env.AI_QUIZ_DEFAULT_COUNT || '5', 10),
    maxQuestions: parseInt(process.env.AI_QUIZ_MAX_QUESTIONS || '20', 10),
    defaultDifficulty: process.env.AI_QUIZ_DEFAULT_DIFFICULTY || 'medium'
  }
})); 