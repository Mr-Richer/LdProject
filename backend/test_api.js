/**
 * API测试脚本
 * 用于测试AI题目生成API是否正常工作
 */

const fetch = require('node-fetch');

async function testQuizAPI() {
  console.log('开始测试AI题目生成API...');
  
  try {
    // 先测试简单的路由测试端点
    console.log('\n1. 测试路由系统');
    const testResponse = await fetch('http://localhost:3000/api/ai/quiz/test');
    const testData = await testResponse.json();
    console.log('路由测试结果:', testData);
    
    // 测试题目生成API
    console.log('\n2. 测试题目生成API');
    const quizResponse = await fetch('http://localhost:3000/api/ai/quiz/generate-by-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: '生成中国传统文化题目',
        quizType: 'single',
        generationMethod: 'ai',
        count: 2, // 只生成2道题目，加快测试速度
        difficulty: 'medium'
      })
    });
    
    if (!quizResponse.ok) {
      const errorText = await quizResponse.text();
      console.error('API请求失败:', quizResponse.status, quizResponse.statusText);
      console.error('错误详情:', errorText);
      return;
    }
    
    const quizData = await quizResponse.json();
    console.log('题目生成结果:');
    console.log(JSON.stringify(quizData, null, 2));
    
    console.log('\n测试完成!');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 执行测试
testQuizAPI(); 