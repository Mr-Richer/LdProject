/**
 * 修复后API测试脚本
 * 用于测试修复后的题目保存API是否正常工作
 */

const fetch = require('node-fetch');

async function testFixedAPI() {
  console.log('===== 测试修复后的题目保存API =====');
  
  // 测试数据 - 包含完整属性的题目对象
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
        explanation: '中国有34个省级行政区，包括23个省、5个自治区、4个直辖市、2个特别行政区',
        difficulty: 'medium',
        order: 1
      }
    ],
    quizId: 1,
    chapterId: 1
  };
  
  // 尝试不同的API端点
  const apiEndpoints = [
    'http://localhost:3000/api/quiz/save-questions',
    'http://localhost:3000/quiz/save-questions',
    'http://localhost:3001/api/quiz/save-questions',
    'http://localhost:3001/quiz/save-questions'
  ];
  
  for (const endpoint of apiEndpoints) {
    try {
      console.log(`\n尝试端点: ${endpoint}`);
      console.log('发送请求...');
      
      const response = await fetch(endpoint, {
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
          
          // 检查返回的题目数据是否包含我们发送的属性
          if (data.data && data.data.questions && data.data.questions.length > 0) {
            const savedQuestion = data.data.questions[0];
            console.log('✅ 保存的题目数据:');
            console.log('  - question:', savedQuestion.question);
            console.log('  - options:', savedQuestion.options);
            console.log('  - answer:', savedQuestion.answer);
            console.log('  - explanation:', savedQuestion.explanation);
          }
          
          // 成功了，不再尝试其他端点
          return;
        } else {
          console.log('❌ 此端点测试失败: API返回了错误');
          console.log('错误信息:', data.message);
        }
      } catch (e) {
        console.log('响应不是JSON格式:', text);
        console.log('❌ 此端点测试失败: 无法解析响应');
      }
    } catch (error) {
      console.error(`请求错误 (${endpoint}):`, error.message);
      console.log(`❌ 此端点测试失败: 请求发送失败`);
    }
  }
  
  console.log('\n所有端点测试都失败了');
}

// 执行测试
testFixedAPI(); 