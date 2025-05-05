/**
 * 测试保存题目API的脚本
 * 使用不同格式的数据测试API响应
 */

const API_URL = 'http://localhost:3000/api/quiz/save-questions';

// 定义测试用例
const testCases = [
  {
    name: '基本有效数据',
    data: {
      questions: [
        {
          type: 'single',
          question: '测试单选题',
          options: JSON.stringify([
            { id: 'A', text: '选项A' },
            { id: 'B', text: '选项B' }
          ]),
          answer: 'A',
          explanation: '这是解析'
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '数字ID选项',
    data: {
      questions: [
        {
          type: 'single',
          question: '数字ID的单选题',
          options: JSON.stringify([
            { id: '1', text: '选项1' },
            { id: '2', text: '选项2' }
          ]),
          answer: '1',
          explanation: '这是解析'
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '完整结构测试',
    data: {
      questions: [
        {
          type: 'single',
          question: '单选题',
          options: JSON.stringify([
            { id: 'A', text: '选项A' },
            { id: 'B', text: '选项B' }
          ]),
          answer: 'A',
          explanation: '解析1',
          difficulty: 'medium',
          order: 1
        },
        {
          type: 'multiple',
          question: '多选题',
          options: JSON.stringify([
            { id: 'A', text: '选项A' },
            { id: 'B', text: '选项B' },
            { id: 'C', text: '选项C' }
          ]),
          answer: JSON.stringify(['A', 'B']),
          explanation: '解析2',
          difficulty: 'medium',
          order: 2
        },
        {
          type: 'short',
          question: '简答题',
          options: '[]',
          answer: '参考答案',
          explanation: '解析3',
          difficulty: 'medium',
          order: 3
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '非字符串options',
    data: {
      questions: [
        {
          type: 'single',
          question: 'options是数组而非字符串',
          options: [
            { id: 'A', text: '选项A' },
            { id: 'B', text: '选项B' }
          ],
          answer: 'A',
          explanation: '解析'
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '非字符串answer',
    data: {
      questions: [
        {
          type: 'multiple',
          question: 'answer是数组而非字符串',
          options: JSON.stringify([
            { id: 'A', text: '选项A' },
            { id: 'B', text: '选项B' }
          ]),
          answer: ['A', 'B'],
          explanation: '解析'
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '缺少type字段',
    data: {
      questions: [
        {
          question: '缺少type字段的题目',
          options: JSON.stringify([
            { id: 'A', text: '选项A' },
            { id: 'B', text: '选项B' }
          ]),
          answer: 'A',
          explanation: '解析'
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '不支持的type值',
    data: {
      questions: [
        {
          type: 'unsupported_type',
          question: 'type值不在支持范围内',
          options: JSON.stringify([
            { id: 'A', text: '选项A' },
            { id: 'B', text: '选项B' }
          ]),
          answer: 'A',
          explanation: '解析'
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '字符串类型的ID',
    data: {
      questions: [
        {
          type: 'single',
          question: '测试题目',
          options: JSON.stringify([
            { id: 'A', text: '选项A' },
            { id: 'B', text: '选项B' }
          ]),
          answer: 'A',
          explanation: '解析'
        }
      ],
      quizId: "1", // 字符串类型
      chapterId: "1" // 字符串类型
    }
  },
  {
    name: '测试扁平结构',
    data: {
      questions: [
        {
          type: 'single',
          question: '测试题目',
          options: '[{"id":"A","text":"选项A"},{"id":"B","text":"选项B"}]', // 已经是字符串
          answer: 'A',
          explanation: '解析'
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  }
];

// 测试函数
async function runTests() {
  console.log('===== 开始测试保存题目API =====');
  
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
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('响应数据:', JSON.stringify(responseData, null, 2));
      } catch (e) {
        const text = await response.text();
        console.log('响应内容(非JSON):', text);
      }
      
      if (status === 200 || status === 201) {
        console.log('✅ 测试通过');
      } else {
        console.log('❌ 测试失败');
      }
    } catch (error) {
      console.error('❌ 请求错误:', error.message);
    }
  }
  
  console.log('\n===== 测试完成 =====');
}

// 执行测试
runTests().catch(console.error); 