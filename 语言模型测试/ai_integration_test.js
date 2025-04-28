// AI模型集成测试脚本
// 用于测试deepseek模型集成到中国文化课程平台中

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 配置
const config = {
  // 项目API基础URL
  apiBaseUrl: 'http://localhost:3000/api',
  
  // OpenRouter API配置
  openRouter: {
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    modelId: 'deepseek/deepseek-chat-v3-0324:free',
    apiKey: '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'
  },
  
  // Chutes API配置
  chutes: {
    apiUrl: 'https://llm.chutes.ai/v1/chat/completions',
    modelId: 'deepseek-ai/DeepSeek-V3-0324',
    apiKey: 'cpk_4e6c011db10249f0bdc7b8f8df40cf9f.096169649b4d5c67b42bc5b83b11e149.KcltcWhOps9qvpqYOyoiSjG1JQOAkl33'
  },
  
  // 项目测试数据
  testData: {
    // 登录凭据
    auth: {
      username: 'admin',
      password: 'admin123'
    },
    
    // 测试章节数据
    chapter: {
      chapter_number: 999,
      title_zh: '测试章节 - AI生成',
      title_en: 'Test Chapter - AI Generated',
      description_zh: '这是一个用于测试AI功能的章节',
      description_en: 'This is a chapter for testing AI functionality'
    },
    
    // AI助教测试数据
    ai: {
      coursewarePrompt: '生成一份关于中国传统文化中的四大发明的课件',
      quizPrompt: '生成5道关于中国传统文化的单选题',
      knowledgePrompt: '拓展"中国茶文化"的相关知识点'
    }
  }
};

// 存储认证令牌
let authToken = '';

/**
 * 登录并获取认证令牌
 */
async function login() {
  try {
    console.log('正在登录系统...');
    
    const response = await axios.post(
      `${config.apiBaseUrl}/auth/login`,
      config.testData.auth
    );
    
    if (response.data && response.data.data && response.data.data.token) {
      authToken = response.data.data.token;
      console.log('登录成功! 已获取认证令牌');
      return true;
    } else {
      console.error('登录响应中没有找到令牌');
      console.log('响应数据:', response.data);
      return false;
    }
  } catch (error) {
    console.error('登录失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return false;
  }
}

/**
 * 创建测试章节
 */
async function createTestChapter() {
  if (!authToken) {
    console.error('无法创建章节: 未获取认证令牌');
    return null;
  }
  
  try {
    console.log('创建测试章节...');
    
    const response = await axios.post(
      `${config.apiBaseUrl}/chapters`,
      config.testData.chapter,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.data) {
      console.log('测试章节创建成功!');
      console.log('章节ID:', response.data.data.id);
      return response.data.data;
    } else {
      console.error('创建章节响应中没有找到数据');
      console.log('响应数据:', response.data);
      return null;
    }
  } catch (error) {
    console.error('创建章节失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return null;
  }
}

/**
 * 测试直接连接OpenRouter API生成内容
 */
async function testOpenRouterDirectAPI() {
  console.log('\n===== 测试直接连接OpenRouter API =====');
  
  try {
    const prompt = "请用中文简要介绍中国的四大发明";
    
    console.log(`发送提示: "${prompt}"`);
    
    const response = await axios.post(
      config.openRouter.apiUrl,
      {
        model: config.openRouter.modelId,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openRouter.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const result = response.data;
    console.log('OpenRouter API连接成功!');
    
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
    console.error('OpenRouter API连接失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return false;
  }
}

/**
 * 测试直接连接Chutes API生成内容
 */
async function testChutesDirectAPI() {
  console.log('\n===== 测试直接连接Chutes API =====');
  
  try {
    const prompt = "请用中文简要介绍中国的四大发明";
    
    console.log(`发送提示: "${prompt}"`);
    
    const response = await axios.post(
      config.chutes.apiUrl + '#', // 注意：强制性加#
      {
        model: config.chutes.modelId,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${config.chutes.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const result = response.data;
    console.log('Chutes API连接成功!');
    
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
    console.error('Chutes API连接失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return false;
  }
}

/**
 * 测试项目中的AI课件生成功能
 */
async function testAICoursewareGeneration(chapterId) {
  if (!authToken) {
    console.error('无法测试AI课件生成: 未获取认证令牌');
    return false;
  }
  
  console.log('\n===== 测试项目中的AI课件生成功能 =====');
  
  try {
    const data = {
      chapterId: chapterId || '1',
      topic: config.testData.ai.coursewarePrompt,
      style: 'academic',
      slideCount: 6
    };
    
    console.log(`发送课件生成请求: "${data.topic}"`);
    
    const response = await axios.post(
      `${config.apiBaseUrl}/ai/courseware/generate`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('AI课件生成请求成功!');
    console.log('课件幻灯片数量:', response.data.data.slides.length);
    
    // 保存生成的课件数据
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = path.join(__dirname, `courseware_${timestamp}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(response.data.data, null, 2));
    console.log(`课件数据已保存至: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error('AI课件生成失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return false;
  }
}

/**
 * 测试项目中的AI测验生成功能
 */
async function testAIQuizGeneration(chapterId) {
  if (!authToken) {
    console.error('无法测试AI测验生成: 未获取认证令牌');
    return false;
  }
  
  console.log('\n===== 测试项目中的AI测验生成功能 =====');
  
  try {
    const data = {
      chapterId: chapterId || '1',
      types: ['single', 'multiple', 'short'],
      difficulty: 'medium',
      count: 5,
      keywords: ['中国传统文化', '四大发明']
    };
    
    console.log(`发送测验生成请求，关键词: ${data.keywords.join(', ')}`);
    
    const response = await axios.post(
      `${config.apiBaseUrl}/ai/quiz/generate`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('AI测验生成请求成功!');
    console.log('生成测试题数量:', response.data.data.questions.length);
    
    // 保存生成的测验数据
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = path.join(__dirname, `quiz_${timestamp}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(response.data.data, null, 2));
    console.log(`测验数据已保存至: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error('AI测验生成失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return false;
  }
}

/**
 * 测试项目中的AI知识拓展功能
 */
async function testAIKnowledgeExpansion(chapterId) {
  if (!authToken) {
    console.error('无法测试AI知识拓展: 未获取认证令牌');
    return false;
  }
  
  console.log('\n===== 测试项目中的AI知识拓展功能 =====');
  
  try {
    const data = {
      chapterId: chapterId || '1',
      cultureConcept: '中国茶文化',
      expansionType: 'interdisciplinary'
    };
    
    console.log(`发送知识拓展请求，概念: "${data.cultureConcept}"`);
    
    const response = await axios.post(
      `${config.apiBaseUrl}/ai/knowledge/generate`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('AI知识拓展请求成功!');
    console.log('知识概念数量:', response.data.data.mindmap.concepts.length);
    
    // 保存生成的知识拓展数据
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = path.join(__dirname, `knowledge_${timestamp}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(response.data.data, null, 2));
    console.log(`知识拓展数据已保存至: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error('AI知识拓展失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
    return false;
  }
}

/**
 * 清理测试数据
 */
async function cleanupTestData(chapterId) {
  if (!authToken || !chapterId) {
    console.log('跳过清理测试数据');
    return;
  }
  
  try {
    console.log(`\n删除测试章节 (ID: ${chapterId})...`);
    
    const response = await axios.delete(
      `${config.apiBaseUrl}/chapters/${chapterId}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    if (response.data && response.data.code === 200) {
      console.log('测试章节删除成功!');
    } else {
      console.log('删除响应:', response.data);
    }
  } catch (error) {
    console.error('删除测试章节失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
  }
}

/**
 * 运行所有测试
 */
async function runTests() {
  console.log('===== 开始AI模型集成测试 =====\n');
  
  // 测试直接API连接
  const openRouterResult = await testOpenRouterDirectAPI();
  const chutesResult = await testChutesDirectAPI();
  
  // 系统功能测试
  const loginSuccess = await login();
  let testChapter = null;
  let coursewareResult = false;
  let quizResult = false;
  let knowledgeResult = false;
  
  if (loginSuccess) {
    testChapter = await createTestChapter();
    
    if (testChapter && testChapter.id) {
      coursewareResult = await testAICoursewareGeneration(testChapter.id);
      quizResult = await testAIQuizGeneration(testChapter.id);
      knowledgeResult = await testAIKnowledgeExpansion(testChapter.id);
      
      // 清理测试数据
      await cleanupTestData(testChapter.id);
    }
  }
  
  console.log('\n===== 测试结果汇总 =====');
  console.log(`1. OpenRouter API直接连接: ${openRouterResult ? '✓ 成功' : '✗ 失败'}`);
  console.log(`2. Chutes API直接连接: ${chutesResult ? '✓ 成功' : '✗ 失败'}`);
  console.log(`3. 系统登录: ${loginSuccess ? '✓ 成功' : '✗ 失败'}`);
  console.log(`4. 创建测试章节: ${testChapter ? '✓ 成功' : '✗ 失败'}`);
  console.log(`5. AI课件生成: ${coursewareResult ? '✓ 成功' : '✗ 失败'}`);
  console.log(`6. AI测验生成: ${quizResult ? '✓ 成功' : '✗ 失败'}`);
  console.log(`7. AI知识拓展: ${knowledgeResult ? '✓ 成功' : '✗ 失败'}`);
}

// 执行测试
runTests().catch(err => {
  console.error('测试过程中发生错误:', err);
}); 