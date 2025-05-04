/**
 * OpenRouter API 直接测试脚本
 * 用于测试OpenRouter API密钥是否正常工作
 */

const axios = require('axios');

// OpenRouter API配置
const config = {
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  modelId: 'deepseek/deepseek-chat-v3-0324:free',
  apiKey: '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'
};

async function testOpenRouterAPI() {
  console.log('开始测试OpenRouter API...');
  console.log(`使用模型: ${config.modelId}`);
  
  try {
    const response = await axios.post(
      config.apiUrl,
      {
        model: config.modelId,
        messages: [
          { role: 'system', content: '你是一个专业的中国文化教育助手，擅长根据教学内容设计合适的测试题目。' },
          { role: 'user', content: '生成一道关于中国传统节日的单选题。' }
        ],
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );
    
    // 输出响应状态
    console.log('响应状态:', response.status, response.statusText);
    console.log('响应头:', response.headers);
    
    // 输出响应内容
    console.log('\n解析后的响应:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.choices && response.data.choices[0]) {
      console.log('\n生成的内容:');
      console.log(response.data.choices[0].message.content);
    }
    
  } catch (error) {
    console.error('API调用失败:', error.message);
    if (error.response) {
      console.error('错误状态:', error.response.status);
      console.error('错误详情:', error.response.data);
    }
  }
}

// 执行测试
testOpenRouterAPI(); 