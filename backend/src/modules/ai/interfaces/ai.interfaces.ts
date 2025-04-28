/**
 * AI聊天消息接口
 */
export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * AI模型配置接口
 */
export interface AiModelConfig {
  apiUrl: string;
  modelId: string;
  apiKey: string;
}

/**
 * 外部AI响应接口
 */
export interface ExternalAiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
} 