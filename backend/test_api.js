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

/**
 * 测试题目保存API是否能接受有属性的题目对象
 * 这个脚本用于验证修复后的API是否工作正常
 */

async function testQuizAPI() {
  console.log('===== 测试修复后的题目保存API =====');
  
  // 测试数据 - 包含属性的题目对象
  const testData = {
    questions: [
      {
        type: 'single',
        question: '中国有多少个省级行政区?',
        options: JSON.stringify([
          { id: 'A', text: '31个' },
          { id: 'B', text: '32个' },
          { id: 'C', text: '33个' },
          { id: 'D', text: '34个' }
        ]),
        answer: 'D',
        explanation: '中国有34个省级行政区，包括23个省、5个自治区、4个直辖市、2个特别行政区'
      }
    ],
    quizId: 1,
    chapterId: 1
  };
  
  try {
    console.log('发送请求...');
    console.log('请求数据:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/quiz/save-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('响应状态:', response.status, response.statusText);
    
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log('响应数据:', JSON.stringify(data, null, 2));
      
      if (response.ok) {
        console.log('✅ 测试成功: API接受了带属性的题目对象');
      } else {
        console.log('❌ 测试失败: API返回了错误');
      }
    } catch (e) {
      console.log('响应不是JSON格式:', text);
      console.log('❌ 测试失败: 无法解析响应');
    }
  } catch (error) {
    console.error('请求错误:', error.message);
    console.log('❌ 测试失败: 请求发送失败');
  }
}

// 执行测试
testQuizAPI(); 