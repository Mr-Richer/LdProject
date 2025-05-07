/**
 * 课堂小测系统 - 检查软删除题目脚本
 * 用于查看包括软删除在内的所有题目
 */

const fetch = require('node-fetch');
const API_BASE_URL = 'http://localhost:3000';

async function checkDeletedQuestions() {
    console.log('\n===== 检查软删除题目 =====\n');
    
    try {
        // 1. 检查QuizController中的服务实现
        console.log('1. 检查问题表中的所有记录(包括已删除的)');
        
        // 由于没有直接的API端点访问已删除题目，我们创建一个特殊的查询
        // 检查QuizService.js的实现，尝试修改条件绕过isDeleted过滤
        const response = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/all-with-deleted`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Debug-Mode': 'true',  // 尝试添加调试标记
                'X-Show-Deleted': 'true' // 尝试添加特殊标记
            }
        });
        
        // 如果不存在查询软删除记录的API，则返回错误
        if (response.status === 404) {
            console.log('没有专门查询已删除题目的API端点，需要在后端添加');
            
            // 尝试用其他方法绕过isDeleted过滤
            console.log('\n2. 尝试检查PATCH请求是否真正设置了isDeleted=1');
            
            // 获取当前存在的题目，看是否有漏网之鱼
            const normalResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions`);
            const normalData = await normalResponse.json();
            
            console.log(`当前API返回的题目数量: ${normalData.data.length}`);
            
            if (normalData.data.length > 0) {
                console.log('API仍然返回一些题目，这些题目可能没有被正确软删除:');
                normalData.data.forEach(q => {
                    console.log(`- ID: ${q.id}, isDeleted: ${q.isDeleted}, title: ${q.question.substring(0, 30)}...`);
                });
            } else {
                console.log('API未返回任何题目，可能软删除正常工作');
                
                // 检查特定章节
                console.log('\n3. 检查章节1的题目(包括检查已删除标记)');
                const chapterResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/chapter/1`);
                const chapterData = await chapterResponse.json();
                
                console.log(`章节1的题目数量: ${chapterData.data.length}`);
                
                if (chapterData.data.length > 0) {
                    console.log('章节1仍有题目:');
                    chapterData.data.forEach(q => {
                        console.log(`- ID: ${q.id}, isDeleted: ${q.isDeleted}, title: ${q.question.substring(0, 30)}...`);
                    });
                } else {
                    console.log('章节1未返回任何题目，可能全部删除或软删除正常工作');
                }
            }
            
            console.log('\n4. 创建一个新题目并软删除，检查删除是否正确');
            
            // 创建新题目
            const newQuestion = {
                type: 'single',
                questionText: '软删除测试题目',
                options: [
                    { id: 'A', text: '选项A' },
                    { id: 'B', text: '选项B' }
                ],
                correctAnswer: 'A',
                explanation: '这是软删除测试'
            };
            
            const createResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/save-questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    questions: [newQuestion],
                    quizId: 1,
                    chapterId: 1
                })
            });
            
            if (!createResponse.ok) {
                throw new Error(`创建测试题目失败: ${createResponse.status}`);
            }
            
            const createData = await createResponse.json();
            let testQuestionId = null;
            
            if (createData.data && createData.data.questions && createData.data.questions.length > 0) {
                testQuestionId = createData.data.questions[0].id;
            } else if (createData.data && createData.data.savedCount > 0) {
                // 重新查询最新的题目
                const latestResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/chapter/1`);
                const latestData = await latestResponse.json();
                if (latestData.data && latestData.data.length > 0) {
                    testQuestionId = latestData.data[0].id;
                }
            }
            
            if (!testQuestionId) {
                throw new Error('无法获取新创建题目的ID');
            }
            
            console.log(`创建测试题目成功，ID: ${testQuestionId}`);
            
            // 软删除新题目
            console.log(`尝试软删除测试题目 ID: ${testQuestionId}`);
            
            const softDeleteResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/${testQuestionId}/soft-delete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!softDeleteResponse.ok) {
                throw new Error(`软删除测试题目失败: ${softDeleteResponse.status}`);
            }
            
            console.log('软删除请求成功发送');
            
            // 检查题目是否从API结果中消失
            const afterDeleteResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/chapter/1`);
            const afterDeleteData = await afterDeleteResponse.json();
            
            const stillExists = afterDeleteData.data.some(q => q.id === testQuestionId);
            
            if (stillExists) {
                console.log('问题: 软删除后题目仍在API结果中显示，软删除逻辑存在问题');
            } else {
                console.log('成功: 软删除后题目不再显示在API结果中');
            }
            
            // 检查是否能直接获取该题目
            const directFetchResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/${testQuestionId}`);
            
            if (directFetchResponse.ok) {
                const questionData = await directFetchResponse.json();
                console.log(`直接获取软删除题目结果:`, questionData);
                
                if (questionData.data && questionData.data.isDeleted === 1) {
                    console.log('验证: 题目确实被标记为已删除(isDeleted=1)');
                } else {
                    console.log('问题: 题目未被正确标记为已删除');
                }
            } else {
                console.log(`无法直接获取软删除题目: ${directFetchResponse.status}`);
            }
        } else {
            // 如果API存在
            const data = await response.json();
            console.log('查询结果:', data);
            
            if (data.data && Array.isArray(data.data)) {
                console.log(`总共找到${data.data.length}道题目(包括已删除的)`);
                
                // 分类统计
                const deletedQuestions = data.data.filter(q => q.isDeleted === 1);
                const activeQuestions = data.data.filter(q => q.isDeleted === 0);
                
                console.log(`- 已删除题目: ${deletedQuestions.length}道`);
                console.log(`- 活动题目: ${activeQuestions.length}道`);
                
                if (deletedQuestions.length > 0) {
                    console.log('\n已删除题目列表:');
                    deletedQuestions.forEach(q => {
                        console.log(`- ID: ${q.id}, 类型: ${q.type}, 题目: ${q.question.substring(0, 30)}...`);
                    });
                }
            }
        }
        
        console.log('\n===== 检查完成 =====');
    } catch (error) {
        console.error('检查过程中发生错误:', error);
    }
}

// 执行检查
checkDeletedQuestions().catch(console.error); 