/**
 * 模拟后端控制器处理逻辑，用于排查可能的问题
 */

// 模拟question实体
class Question {
  constructor() {
    this.id = null;
    this.quiz_id = null;
    this.quizId = null;
    this.type = null;
    this.options = null;
    this.answer = null;
    this.explanation = null;
    this.question = null;
    this.difficulty = null;
    this.chapterID = null;
    this.order = null;
    this.isDeleted = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

// 模拟后端接口调用
function simulateBackendProcessing(requestData) {
  console.log('===== 模拟后端处理 =====');
  
  try {
    console.log('接收请求数据:', JSON.stringify(requestData, null, 2));
    
    // 验证基本参数
    if (!requestData) {
      throw new Error('请求数据为空');
    }
    
    // 验证questions参数
    if (!requestData.questions) {
      throw new Error('questions字段不存在');
    }
    
    if (!Array.isArray(requestData.questions)) {
      throw new Error('questions不是数组');
    }
    
    if (requestData.questions.length === 0) {
      throw new Error('题目列表为空');
    }
    
    // 验证quizId和chapterId
    if (!requestData.quizId) {
      throw new Error('测验ID不能为空');
    }
    
    if (!requestData.chapterId) {
      throw new Error('章节ID不能为空');
    }
    
    // 尝试将字符串转换为数字
    const quizId = parseInt(requestData.quizId);
    const chapterId = parseInt(requestData.chapterId);
    
    if (isNaN(quizId)) {
      throw new Error('无效的测验ID，无法转换为数字');
    }
    
    if (isNaN(chapterId)) {
      throw new Error('无效的章节ID，无法转换为数字');
    }
    
    // 模拟保存题目
    const savedQuestions = [];
    
    for (let i = 0; i < requestData.questions.length; i++) {
      const q = requestData.questions[i];
      
      // 检查题目对象是否合法
      if (!q) {
        throw new Error(`第${i+1}题为null或undefined`);
      }
      
      // 创建新的题目实体
      const question = new Question();
      
      try {
        // 设置必填字段
        question.quiz_id = quizId;
        question.quizId = quizId; 
        
        // 验证并设置type字段
        if (!q.type) {
          console.warn(`第${i+1}题缺少type字段，使用默认值'choice'`);
          question.type = 'choice';
        } else if (['choice', 'single', 'multiple', 'short', 'discussion'].includes(q.type)) {
          question.type = q.type;
        } else {
          console.warn(`第${i+1}题的type值'${q.type}'不支持，使用默认值'choice'`);
          question.type = 'choice';
        }
        
        // 设置题目内容，必填字段
        if (!q.question) {
          throw new Error(`第${i+1}题缺少问题内容`);
        }
        question.question = q.question;
        
        // 处理options字段
        if (q.options) {
          if (typeof q.options === 'string') {
            // 验证是否是有效的JSON字符串
            try {
              JSON.parse(q.options);
              question.options = q.options;
            } catch (e) {
              throw new Error(`第${i+1}题的options不是有效的JSON字符串: ${e.message}`);
            }
          } else if (Array.isArray(q.options)) {
            question.options = JSON.stringify(q.options);
          } else if (typeof q.options === 'object') {
            question.options = JSON.stringify([q.options]);
          } else {
            throw new Error(`第${i+1}题的options格式无效`);
          }
        } else {
          question.options = '[]';
        }
        
        // 处理answer字段
        if (q.answer !== undefined && q.answer !== null) {
          if (typeof q.answer === 'string') {
            question.answer = q.answer;
          } else if (Array.isArray(q.answer)) {
            question.answer = JSON.stringify(q.answer);
          } else {
            question.answer = String(q.answer);
          }
        } else {
          if (question.type === 'multiple') {
            question.answer = '["A"]';
          } else {
            question.answer = 'A';
          }
        }
        
        // 设置其他字段
        question.explanation = q.explanation || '';
        question.difficulty = q.difficulty || 'medium';
        question.chapterID = chapterId;
        question.order = i + 1;
        
        // 模拟保存到数据库的逻辑
        question.id = i + 1; // 模拟自增ID
        savedQuestions.push(question);
        
        console.log(`✅ 第${i+1}题处理成功`);
      } catch (err) {
        console.error(`❌ 处理第${i+1}题时出错:`, err.message);
        throw err; // 重新抛出错误
      }
    }
    
    // 返回成功结果
    const result = {
      code: 200,
      message: '题目保存成功',
      data: {
        savedCount: savedQuestions.length,
        questions: savedQuestions
      }
    };
    
    console.log('处理成功，返回结果:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ 处理失败:', error.message);
    const errorResult = {
      code: 400,
      message: `保存题目失败: ${error.message}`,
      data: null
    };
    console.log('返回错误:', JSON.stringify(errorResult, null, 2));
    return errorResult;
  }
}

// 测试用例
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
    name: 'questions为null',
    data: {
      questions: null,
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '题目对象包含null值',
    data: {
      questions: [
        {
          type: 'single',
          question: '正常题目',
          options: null,
          answer: 'A'
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  },
  {
    name: '实际生产环境数据',
    data: {
      questions: [
        {
          type: 'single',
          question: '张三的年龄是多少?',
          options: [
            {id: '1', text: '20岁'},
            {id: '2', text: '25岁'},
            {id: '3', text: '30岁'},
            {id: '4', text: '35岁'}
          ],
          answer: '2',
          explanation: '题目中明确说明张三25岁'
        }
      ],
      quizId: 1,
      chapterId: 1
    }
  }
];

// 运行测试
function runTests() {
  console.log('开始测试模拟后端处理逻辑');
  
  testCases.forEach(test => {
    console.log(`\n\n==== 测试用例: ${test.name} ====`);
    try {
      simulateBackendProcessing(test.data);
    } catch (e) {
      console.error('测试执行出错:', e);
    }
  });
  
  console.log('\n全部测试完成');
}

// 执行测试
runTests(); 