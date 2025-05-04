/**
 * Chutes API 直接测试脚本
 * 用于测试Chutes API密钥是否正常工作
 */

const axios = require('axios');

// Chutes API配置
const config = {
  apiUrl: 'https://llm.chutes.ai/v1/chat/completions',
  modelId: 'deepseek-ai/DeepSeek-V3-0324',
  apiKey: 'cpk_4e6c011db10249f0bdc7b8f8df40cf9f.096169649b4d5c67b42bc5b83b11e149.KcltcWhOps9qvpqYOyoiSjG1JQOAkl33'
};

async function testChutesAPI() {
  console.log('开始测试Chutes API...');
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
testChutesAPI(); 