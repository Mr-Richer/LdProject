/**
 * 测试修复后的API保存功能
 * 针对实际生产环境中的问题进行特定测试
 */

const API_URL = 'http://localhost:3000/api/quiz/save-questions';

// 创建一个针对实际问题的测试数据
// 这个测试数据模拟了前端可能会发送的实际数据格式
const testData = {
  questions: [
    {
      type: 'single',
      question: '中国有多少个省级行政区?',
      options: [
        { id: '1', text: '31个' },
        { id: '2', text: '32个' },
        { id: '3', text: '33个' },
        { id: '4', text: '34个' }
      ],
      answer: '4',
      explanation: '中国有34个省级行政区，包括23个省、5个自治区、4个直辖市、2个特别行政区'
    }
  ],
  quizId: 1,
  chapterId: 1
};

// 修复数据格式的函数
function fixRequestData(data) {
  // 创建深拷贝，避免修改原始数据
  const fixedData = JSON.parse(JSON.stringify(data));
  
  // 确保questions是数组
  if (!fixedData.questions || !Array.isArray(fixedData.questions)) {
    console.error('修复失败: questions不是有效数组');
    return null;
  }
  
  // 修复每个题目
  fixedData.questions = fixedData.questions.map(q => {
    // 跳过无效题目
    if (!q) return null;
    
    const fixed = {...q};
    
    // 确保type字段符合枚举要求
    if (!fixed.type || !['choice', 'single', 'multiple', 'short', 'discussion'].includes(fixed.type)) {
      console.log(`修正题型: ${fixed.type || '未定义'} -> choice`);
      fixed.type = 'choice';
    }
    
    // 确保options是字符串格式
    if (fixed.options !== undefined && fixed.options !== null) {
      if (typeof fixed.options !== 'string') {
        try {
          fixed.options = JSON.stringify(fixed.options);
          console.log('将options转换为字符串');
        } catch (e) {
          console.error('转换options失败:', e);
          fixed.options = '[]';
        }
      }
    } else {
      fixed.options = '[]';
    }
    
    // 处理数字ID答案
    if (fixed.answer !== undefined && fixed.answer !== null) {
      // 如果使用数字ID，转换为字母
      if (fixed.answer === '1') fixed.answer = 'A';
      else if (fixed.answer === '2') fixed.answer = 'B';
      else if (fixed.answer === '3') fixed.answer = 'C';
      else if (fixed.answer === '4') fixed.answer = 'D';
      
      // 如果是数组格式，转换为字符串
      if (Array.isArray(fixed.answer)) {
        // 将数组中的数字ID转换为字母
        fixed.answer = fixed.answer.map(a => {
          if (a === '1' || a === 1) return 'A';
          if (a === '2' || a === 2) return 'B';
          if (a === '3' || a === 3) return 'C';
          if (a === '4' || a === 4) return 'D';
          return a;
        });
        fixed.answer = JSON.stringify(fixed.answer);
      } else if (typeof fixed.answer !== 'string') {
        fixed.answer = String(fixed.answer);
      }
    } else {
      fixed.answer = fixed.type === 'multiple' ? '["A"]' : 'A';
    }
    
    // 确保question字段存在
    if (!fixed.question) {
      fixed.question = '未提供题目内容';
    }
    
    return fixed;
  }).filter(q => q !== null); // 过滤掉无效题目
  
  // 确保ID是数字
  fixedData.quizId = parseInt(fixedData.quizId) || 1;
  fixedData.chapterId = parseInt(fixedData.chapterId) || 1;
  
  return fixedData;
}

// 主测试函数
async function testAndFix() {
  console.log('===== 测试修复API保存问题 =====');
  console.log('\n1. 显示原始数据:');
  console.log(JSON.stringify(testData, null, 2));
  
  console.log('\n2. 应用修复:');
  const fixedData = fixRequestData(testData);
  console.log(JSON.stringify(fixedData, null, 2));
  
  console.log('\n3. 尝试直接发送原始数据:');
  try {
    const responseRaw = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('原始数据响应状态:', responseRaw.status);
    const rawText = await responseRaw.text();
    console.log('原始响应内容:', rawText);
    
    try {
      const rawJson = JSON.parse(rawText);
      console.log('原始响应JSON:', JSON.stringify(rawJson, null, 2));
    } catch (e) {
      console.log('非JSON响应');
    }
  } catch (error) {
    console.error('原始数据请求失败:', error.message);
  }
  
  console.log('\n4. 发送修复后的数据:');
  try {
    const responseFixed = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(fixedData)
    });
    
    console.log('修复数据响应状态:', responseFixed.status);
    const fixedText = await responseFixed.text();
    console.log('修复响应内容:', fixedText);
    
    try {
      const fixedJson = JSON.parse(fixedText);
      console.log('修复响应JSON:', JSON.stringify(fixedJson, null, 2));
      
      if (responseFixed.status === 200 || responseFixed.status === 201) {
        console.log('\n✅ 修复成功! 后端接受了修复后的数据');
      } else {
        console.log('\n❌ 修复后依然存在问题');
      }
    } catch (e) {
      console.log('非JSON响应');
    }
  } catch (error) {
    console.error('修复数据请求失败:', error.message);
  }
  
  console.log('\n===== 测试完成 =====');
}

// 执行测试
testAndFix().catch(console.error); 