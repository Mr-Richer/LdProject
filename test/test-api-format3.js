// 测试保存题目API请求格式 - 第三组测试
// 专注于测试空对象和空数组格式，因为这些在之前的测试中成功了

const makeRequest = async (data, name) => {
  console.log(`\n===== 测试 ${name} =====`);
  console.log('请求数据:', JSON.stringify(data, null, 2));

  try {
    const response = await fetch('http://localhost:3000/api/quiz/save-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    console.log('响应状态:', response.status, response.statusText);
    
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

// 测试用例 - 专注于空对象和空数组
const testCases = [
  {
    name: '确认成功格式1：空对象',
    data: { 
      questions: [{}],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '确认成功格式2：空数组',
    data: { 
      questions: [[]],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '多个空对象',
    data: { 
      questions: [{}, {}, {}],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '空对象中设置questionText',
    data: { 
      questions: [{ questionText: "测试题目" }],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '空对象中设置content',
    data: { 
      questions: [{ content: "测试题目内容" }],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '使用数组包装内容',
    data: { 
      questions: [[{ content: "测试内容" }]],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '使用数组包装内容2',
    data: { 
      questions: [[{ data: "测试数据" }]],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '空对象中设置多个属性',
    data: { 
      questions: [{ 
        title: "测试标题",
        content: "测试内容",
        typeText: "single"
      }],
      quizId: 1, 
      chapterId: 1 
    }
  }
];

// 主测试函数
async function runTests() {
  console.log('开始保存题目API格式测试...(第三组)');
  console.log('专注于空对象和空数组格式，因为这些在前面测试中成功了');
  
  for (const test of testCases) {
    const result = await makeRequest(test.data, test.name);
    console.log(result ? '✅ 成功' : '❌ 失败');
  }
  
  console.log('\n全部测试完成');
}

// 运行测试
runTests().catch(console.error); 