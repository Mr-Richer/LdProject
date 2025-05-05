// 测试保存题目API请求格式 - 第二组测试
// 尝试更多请求结构，特别关注backend错误信息

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

// 测试用例 - 更多可能的格式
const testCases = [
  {
    name: '空对象questions',
    data: { 
      questions: [{}],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '数字ID的questions',
    data: { 
      questions: [0, 1, 2],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: 'questionTexts数组',
    data: { 
      questionTexts: ['测试题目1', '测试题目2'],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '无属性的嵌套数组',
    data: { 
      questions: [[], []],
      quizId: 1, 
      chapterId: 1 
    }
  },
  {
    name: '来自原始实现',
    data: {
      questions: [
        {
          id: 1,
          quiz_id: 1,
          type: 'single', 
          question: '测试题目',
          options: '[{"id":"A","text":"选项A"},{"id":"B","text":"选项B"}]',
          answer: 'A',
          explanation: '解析',
          difficulty: 'medium',
          order: 1,
          chapterID: 1
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '来自entity',
    data: {
      questions: [
        {
          id: null,
          quiz_id: 1,
          quizId: 1,
          type: 'single',
          options: '[]',
          answer: 'A',
          explanation: '',
          question: '测试题目',
          difficulty: 'medium',
          chapterID: 1,
          order: 1,
          isDeleted: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '未使用嵌套questions',
    data: [
      {
        question: '测试题目1',
        type: 'single',
        answer: 'A'
      },
      {
        question: '测试题目2',
        type: 'single',
        answer: 'B'
      }
    ]
  },
  {
    name: 'DTO原始类型',
    data: { 
      quizId: 1, 
      chapterId: 1,
      questions: JSON.stringify([
        {
          question: '测试题目',
          type: 'single',
          answer: 'A'
        }
      ])
    }
  }
];

// 主测试函数
async function runTests() {
  console.log('开始保存题目API格式测试...(第二组)');
  
  for (const test of testCases) {
    const result = await makeRequest(test.data, test.name);
    console.log(result ? '✅ 成功' : '❌ 失败');
  }
  
  console.log('\n全部测试完成');
}

// 运行测试
runTests().catch(console.error); 