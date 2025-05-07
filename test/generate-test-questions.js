/**
 * 课堂小测系统 - 生成测试题目脚本
 * 用于生成测试题目，以便测试完整流程
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';

// 生成测试题目
async function generateTestQuestions() {
    console.log('\n===== 生成测试题目 =====\n');
    
    try {
        // 1. 准备测试题目数据
        const chapterId = 1; // 使用章节1进行测试
        const testQuestions = [
            {
                type: 'single',
                question: '测试单选题 - 这是第一道测试题',
                options: [
                    { id: 'A', text: '选项A' },
                    { id: 'B', text: '选项B' },
                    { id: 'C', text: '选项C' },
                    { id: 'D', text: '选项D' }
                ],
                answer: 'A',
                explanation: '这是解析内容 - 选项A是正确答案'
            },
            {
                type: 'multiple',
                question: '测试多选题 - 这是第二道测试题',
                options: [
                    { id: 'A', text: '选项A' },
                    { id: 'B', text: '选项B' },
                    { id: 'C', text: '选项C' },
                    { id: 'D', text: '选项D' }
                ],
                answer: ['A', 'C'],
                explanation: '这是解析内容 - 选项A和C是正确答案'
            },
            {
                type: 'truefalse',
                question: '测试判断题 - 这是第三道测试题',
                options: [
                    { id: 'T', text: '正确' },
                    { id: 'F', text: '错误' }
                ],
                answer: 'T',
                explanation: '这是解析内容 - 正确'
            }
        ];
        
        console.log(`准备创建${testQuestions.length}道测试题目`);
        
        // 2. 发送保存请求
        console.log('\n2. 保存测试题目...');
        
        const saveResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/save-questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                questions: testQuestions.map(q => ({
                    questionText: q.question,
                    type: q.type,
                    options: q.options,
                    correctAnswer: q.answer,
                    explanation: q.explanation
                })),
                quizId: 1,
                chapterId: chapterId
            })
        });
        
        if (!saveResponse.ok) {
            const errorText = await saveResponse.text();
            throw new Error(`保存题目失败: ${saveResponse.status} ${saveResponse.statusText}\n${errorText}`);
        }
        
        const saveResult = await saveResponse.json();
        console.log('保存题目成功:', saveResult.message || 'OK');
        
        // 3. 验证题目是否保存成功
        console.log('\n3. 验证题目是否保存成功...');
        
        const verifyResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/chapter/${chapterId}`);
        
        if (!verifyResponse.ok) {
            throw new Error(`验证失败: ${verifyResponse.status} ${verifyResponse.statusText}`);
        }
        
        const verifyData = await verifyResponse.json();
        
        if (!verifyData.data || !Array.isArray(verifyData.data)) {
            throw new Error('验证失败: 返回的数据格式无效');
        }
        
        const savedQuestions = verifyData.data;
        
        if (savedQuestions.length > 0) {
            console.log(`验证成功: 已保存${savedQuestions.length}道题目`);
            console.log('题目ID列表:');
            for (const q of savedQuestions) {
                console.log(`- ID: ${q.id}, 类型: ${q.type}, 题目: ${q.question.substring(0, 30)}...`);
            }
        } else {
            console.warn('验证失败: 未找到保存的题目');
        }
        
        console.log('\n===== 测试完成 =====');
        console.log('\n现在可以在前端界面中查看该章节，应该会显示新生成的题目');
    } catch (error) {
        console.error('\n测试过程中发生错误:', error);
    }
}

// 执行测试
generateTestQuestions().catch(console.error); 