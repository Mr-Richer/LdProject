/**
 * 课堂小测系统 - 空状态测试脚本
 * 用于测试删除所有题目后显示无数据状态
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';

// 测试删除所有题目
async function testEmptyState() {
    console.log('\n===== 测试删除所有题目后的空状态显示 =====\n');
    
    try {
        // 1. 先获取所有题目
        console.log('1. 获取题目列表...');
        const response = await fetch(`${API_BASE_URL}/api/ai/quiz/questions`);
        
        if (!response.ok) {
            throw new Error(`获取题目列表失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('获取题目列表失败: 未找到题目数据');
        }
        
        console.log(`成功获取${data.data.length}道题目`);
        
        // 如果没有题目，可以直接测试空状态
        if (data.data.length === 0) {
            console.log('当前已经没有题目，可以测试空状态显示');
            return;
        }
        
        // 2. 选择章节1的所有题目进行删除
        const chapterId = 1; // 假设使用章节1进行测试
        console.log(`\n2. 获取章节${chapterId}的题目...`);
        
        const chapterResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/chapter/${chapterId}`);
        
        if (!chapterResponse.ok) {
            throw new Error(`获取章节题目失败: ${chapterResponse.status} ${chapterResponse.statusText}`);
        }
        
        const chapterData = await chapterResponse.json();
        
        if (!chapterData.data || !Array.isArray(chapterData.data)) {
            throw new Error('获取章节题目失败: 未找到题目数据');
        }
        
        const chapterQuestions = chapterData.data;
        console.log(`成功获取章节${chapterId}的${chapterQuestions.length}道题目`);
        
        // 如果章节没有题目，可以直接测试空状态
        if (chapterQuestions.length === 0) {
            console.log(`章节${chapterId}当前已经没有题目，可以测试空状态显示`);
            return;
        }
        
        // 3. 删除该章节的所有题目
        console.log(`\n3. 删除章节${chapterId}的${chapterQuestions.length}道题目...`);
        
        for (let i = 0; i < chapterQuestions.length; i++) {
            const question = chapterQuestions[i];
            console.log(`删除题目 ${i+1}/${chapterQuestions.length}: ID=${question.id}`);
            
            // 使用硬删除端点
            const deleteResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/${question.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!deleteResponse.ok) {
                console.warn(`删除题目${question.id}失败: ${deleteResponse.status} ${deleteResponse.statusText}`);
                continue;
            }
            
            const deleteResult = await deleteResponse.json();
            console.log(`题目${question.id}删除成功:`, deleteResult.message || 'OK');
        }
        
        // 4. 验证章节题目已被删除
        console.log(`\n4. 验证章节${chapterId}的题目是否已全部删除...`);
        
        const verifyResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/chapter/${chapterId}`);
        
        if (!verifyResponse.ok) {
            throw new Error(`验证失败: ${verifyResponse.status} ${verifyResponse.statusText}`);
        }
        
        const verifyData = await verifyResponse.json();
        
        if (!verifyData.data || !Array.isArray(verifyData.data)) {
            throw new Error('验证失败: 返回的数据格式无效');
        }
        
        const remainingQuestions = verifyData.data;
        
        if (remainingQuestions.length === 0) {
            console.log(`验证成功: 章节${chapterId}的题目已全部删除，可以测试空状态显示`);
        } else {
            console.warn(`验证失败: 章节${chapterId}仍有${remainingQuestions.length}道题目未被删除`);
            for (const q of remainingQuestions) {
                console.log(`- 题目ID: ${q.id}`);
            }
        }
        
        console.log('\n===== 测试完成 =====');
        console.log('\n现在可以在前端界面中查看该章节，应该会显示"暂无题目数据"');
    } catch (error) {
        console.error('\n测试过程中发生错误:', error);
    }
}

// 执行测试
testEmptyState().catch(console.error); 