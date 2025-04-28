// 直接API连接测试脚本
// 用于测试语言模型API的直接连接

const axios = require('axios');

// OpenRouter API配置
const openRouterConfig = {
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  modelId: 'deepseek/deepseek-chat-v3-0324:free',
  apiKey: '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'
};

// Chutes API配置
const chutesConfig = {
  apiUrl: 'https://llm.chutes.ai/v1/chat/completions',
  modelId: 'deepseek-ai/DeepSeek-V3-0324',
  apiKey: 'cpk_4e6c011db10249f0bdc7b8f8df40cf9f.096169649b4d5c67b42bc5b83b11e149.KcltcWhOps9qvpqYOyoiSjG1JQOAkl33'
};

// 测试消息列表
const testPrompts = [
  "你好，请介绍一下你自己。",
  "请用中文简要介绍中国的四大发明。",
  "为一节'中国传统文化'课程设计一个教学大纲，包括5个主要知识点。",
  "我是一名中学语文教师，请帮我设计一个关于'唐诗'的教学测验，包含5道单选题。"
];

/**
 * 测试OpenRouter API连接
 */
async function testOpenRouterAPI() {
  console.log('\n===== 测试OpenRouter API连接 =====');
  
  try {
    const prompt = testPrompts[1]; // 使用四大发明的提示
    
    console.log(`发送提示: "${prompt}"`);
    
    console.time('OpenRouter响应时间');
    const response = await axios.post(
      openRouterConfig.apiUrl,
      {
        model: openRouterConfig.modelId,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.timeEnd('OpenRouter响应时间');
    
    console.log('OpenRouter API连接成功!');
    
    const result = response.data;
    if (result.choices && result.choices.length > 0) {
      const message = result.choices[0].message;
      console.log('\n生成内容:');
      console.log('-----------------');
      console.log(message.content);
      console.log('-----------------');
      
      console.log('\n响应统计:');
      console.log(`- 模型: ${result.model}`);
      if (result.usage) {
        console.log(`- 提示令牌数: ${result.usage.prompt_tokens}`);
        console.log(`- 完成令牌数: ${result.usage.completion_tokens}`);
        console.log(`- 总令牌数: ${result.usage.total_tokens}`);
      }
    } else {
      console.log('响应中没有找到生成内容');
      console.log('完整响应:', result);
    }
    
    return true;
  } catch (error) {
    console.error('OpenRouter API连接失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return false;
  }
}

/**
 * 测试Chutes API连接
 */
async function testChutesAPI() {
  console.log('\n===== 测试Chutes API连接 =====');
  
  try {
    const prompt = testPrompts[1]; // 使用四大发明的提示
    
    console.log(`发送提示: "${prompt}"`);
    
    console.time('Chutes响应时间');
    const response = await axios.post(
      chutesConfig.apiUrl + '#', // 注意：强制性加#
      {
        model: chutesConfig.modelId,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${chutesConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.timeEnd('Chutes响应时间');
    
    console.log('Chutes API连接成功!');
    
    const result = response.data;
    if (result.choices && result.choices.length > 0) {
      const message = result.choices[0].message;
      console.log('\n生成内容:');
      console.log('-----------------');
      console.log(message.content);
      console.log('-----------------');
      
      console.log('\n响应统计:');
      console.log(`- 模型: ${result.model}`);
      if (result.usage) {
        console.log(`- 提示令牌数: ${result.usage.prompt_tokens}`);
        console.log(`- 完成令牌数: ${result.usage.completion_tokens}`);
        console.log(`- 总令牌数: ${result.usage.total_tokens}`);
      }
    } else {
      console.log('响应中没有找到生成内容');
      console.log('完整响应:', result);
    }
    
    return true;
  } catch (error) {
    console.error('Chutes API连接失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return false;
  }
}

/**
 * 测试教学内容生成
 */
async function testTeachingContentGeneration() {
  console.log('\n===== 测试教学内容生成 =====');
  
  try {
    const prompt = testPrompts[2]; // 使用教学大纲的提示
    
    console.log(`发送提示: "${prompt}"`);
    
    console.time('教学内容生成响应时间');
    const response = await axios.post(
      openRouterConfig.apiUrl,
      {
        model: openRouterConfig.modelId,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.timeEnd('教学内容生成响应时间');
    
    console.log('教学内容生成请求成功!');
    
    const result = response.data;
    if (result.choices && result.choices.length > 0) {
      const content = result.choices[0].message.content;
      console.log('\n生成内容:');
      console.log('-----------------');
      console.log(content);
      console.log('-----------------');
    } else {
      console.log('响应中没有找到生成内容');
    }
    
    return true;
  } catch (error) {
    console.error('教学内容生成失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return false;
  }
}

/**
 * 测试测验题目生成
 */
async function testQuizGeneration() {
  console.log('\n===== 测试测验题目生成 =====');
  
  try {
    const prompt = testPrompts[3]; // 使用测验生成的提示
    
    console.log(`发送提示: "${prompt}"`);
    
    console.time('测验生成响应时间');
    const response = await axios.post(
      openRouterConfig.apiUrl,
      {
        model: openRouterConfig.modelId,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.timeEnd('测验生成响应时间');
    
    console.log('测验生成请求成功!');
    
    const result = response.data;
    if (result.choices && result.choices.length > 0) {
      const content = result.choices[0].message.content;
      console.log('\n生成内容:');
      console.log('-----------------');
      console.log(content);
      console.log('-----------------');
    } else {
      console.log('响应中没有找到生成内容');
    }
    
    return true;
  } catch (error) {
    console.error('测验生成失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return false;
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('===== 开始API直接连接测试 =====');
  
  // 测试API连接
  const openRouterResult = await testOpenRouterAPI();
  console.log('\n');
  
  const chutesResult = await testChutesAPI();
  console.log('\n');
  
  // 测试特定功能
  const teachingResult = await testTeachingContentGeneration();
  console.log('\n');
  
  const quizResult = await testQuizGeneration();
  
  console.log('\n===== 测试结果汇总 =====');
  console.log(`OpenRouter API: ${openRouterResult ? '✓ 连接成功' : '✗ 连接失败'}`);
  console.log(`Chutes API: ${chutesResult ? '✓ 连接成功' : '✗ 连接失败'}`);
  console.log(`教学内容生成: ${teachingResult ? '✓ 测试成功' : '✗ 测试失败'}`);
  console.log(`测验题目生成: ${quizResult ? '✓ 测试成功' : '✗ 测试失败'}`);
}

// 执行测试
runAllTests().catch(err => {
  console.error('测试过程中发生错误:', err);
}); 