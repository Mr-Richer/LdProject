import { registerAs } from '@nestjs/config';

/**
 * AI语言模型配置
 */
export default registerAs('ai', () => ({
  // OpenRouter模型配置
  openrouter: {
    apiUrl: process.env.AI_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
    modelId: process.env.AI_OPENROUTER_MODEL_ID || 'deepseek/deepseek-chat-v3-0324:free',
    apiKey: process.env.AI_OPENROUTER_API_KEY,
  },
  
  // Chutes模型配置
  chutes: {
    apiUrl: process.env.AI_CHUTES_API_URL || 'https://llm.chutes.ai/v1/chat/completions',
    modelId: process.env.AI_CHUTES_MODEL_ID || 'deepseek-ai/DeepSeek-V3-0324',
    apiKey: process.env.AI_CHUTES_API_KEY,
  },
  
  // 默认配置
  default: {
    modelType: process.env.AI_DEFAULT_MODEL_TYPE || 'openrouter',
    temperature: parseFloat(process.env.AI_DEFAULT_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_DEFAULT_MAX_TOKENS || '1000', 10),
  },
  
  // 课前小测生成配置
  quiz: {
    defaultCount: parseInt(process.env.AI_QUIZ_DEFAULT_COUNT || '5', 10),
    defaultDifficulty: process.env.AI_QUIZ_DEFAULT_DIFFICULTY || 'medium',
    maxQuestions: parseInt(process.env.AI_QUIZ_MAX_QUESTIONS || '10', 10),
  },
})); 