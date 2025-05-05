// 测试保存题目API请求格式
// 尝试多种请求结构，找出后端接受的正确格式

const makeRequest = async (data, name) => {
  console.log(`\n===== 测试 ${name} =====`);
  console.log('请求数据:', JSON.stringify(data, null, 2));

  try {
    const response = await fetch('http://localhost:3000/api/quiz/save-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    console.log('响应状态:', response.status);
    
    const text = await response.text();
    console.log('响应内容:', text);
    
    try {
      const json = JSON.parse(text);
      console.log('响应JSON:', JSON.stringify(json, null, 2));
      return response.ok;
    } catch (e) {
      console.log('响应不是JSON格式');
      return false;
    }
  } catch (err) {
    console.error('请求错误:', err.message);
    return false;
  }
};

// 测试用例 - 尝试不同格式
const testCases = [
  {
    name: '空对象',
    data: {}
  },
  {
    name: '只有ID',
    data: { quizId: 1, chapterId: 1 }
  },
  {
    name: '空questions数组',
    data: { questions: [], quizId: 1, chapterId: 1 }
  },
  {
    name: '简单question对象',
    data: { 
      questions: [{ question: '测试题目', type: 'single', answer: 'A' }],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '使用text字段',
    data: { 
      questions: [{ text: '测试题目', type: 'single', answer: 'A' }],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '字符串questions数组',
    data: { 
      questions: ['测试题目1', '测试题目2'],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '无嵌套结构',
    data: { 
      question: '测试题目', 
      type: 'single', 
      answer: 'A',
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '包含完整序列化选项',
    data: { 
      questions: [{
        question: '中国有多少个省级行政区?',
        type: 'single',
        options: JSON.stringify([
          { id: 'A', text: '31个' },
          { id: 'B', text: '32个' },
          { id: 'C', text: '33个' },
          { id: 'D', text: '34个' }
        ]),
        answer: 'D',
        explanation: '解析内容'
      }],
      quizId: 1, 
      chapterId: 1 
    }
  }
];

// 主测试函数
async function runTests() {
  console.log('开始保存题目API格式测试...');
  
  for (const test of testCases) {
    const result = await makeRequest(test.data, test.name);
    console.log(result ? '✅ 成功' : '❌ 失败');
  }
  
  console.log('\n全部测试完成');
}

// 运行测试
runTests().catch(console.error); 