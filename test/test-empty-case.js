/**
 * 测试特殊边界案例的脚本
 * 主要测试questions为null或空数组，以及非标准结构的请求数据
 */

const API_URL = 'http://localhost:3000/api/quiz/save-questions';

// 定义测试用例
const testCases = [
  {
    name: 'questions为null',
    data: {
      questions: null,
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: 'questions为空数组',
    data: {
      questions: [],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '缺少questions字段',
    data: {
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '使用非数组结构',
    data: {
      questions: {
        type: 'single',
        question: '这不是一个数组结构',
        options: '[]',
        answer: 'A'
      },
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '嵌套结构错误',
    data: {
      data: {
        questions: [
          {
            type: 'single',
            question: '嵌套在错误的层级',
            options: '[]',
            answer: 'A'
          }
        ],
        quizId: 1,
        chapterId: 1
      }
    }
  },
  {
    name: '测试只修改其中一个字段',
    data: {
      questions: [
        {
          question: '这里只有question字段'
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '混合不同数据类型',
    data: {
      questions: [
        {
          type: 'single',
          question: '正常单选题',
          options: JSON.stringify([
            { id: 'A', text: '选项A' },
            { id: 'B', text: '选项B' }
          ]),
          answer: 'A'
        },
        null,
        {
          type: 'multiple',
          question: '正常多选题',
          options: JSON.stringify([
            { id: 'A', text: '选项A' },
            { id: 'B', text: '选项B' }
          ]),
          answer: JSON.stringify(['A', 'B'])
        },
        {}
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '空对象',
    data: {}
  },
  {
    name: '纯数组',
    data: [
      {
        type: 'single',
        question: '测试题目',
        options: '[]',
        answer: 'A'
      }
    ]
  }
];

// 测试函数
async function runTests() {
  console.log('===== 开始测试边界案例 =====');
  
  for (const testCase of testCases) {
    console.log(`\n----- 测试用例: ${testCase.name} -----`);
    console.log('请求数据:', JSON.stringify(testCase.data, null, 2));
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      });
      
      const status = response.status;
      console.log('响应状态:', status);
      
      let responseText = await response.text();
      console.log('原始响应:', responseText);
      
      // 尝试解析为JSON
      try {
        const responseData = JSON.parse(responseText);
        console.log('响应数据(JSON):', JSON.stringify(responseData, null, 2));
      } catch (e) {
        console.log('非JSON响应');
      }
      
      if (status === 200 || status === 201) {
        console.log('✅ 测试通过');
      } else if (status === 400) {
        console.log('⚠️ 预期的验证错误');
      } else {
        console.log('❌ 服务器错误');
      }
    } catch (error) {
      console.error('❌ 请求错误:', error.message);
    }
  }
  
  console.log('\n===== 测试完成 =====');
}

// 执行测试
runTests().catch(console.error); 