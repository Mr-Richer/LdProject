/**
 * 课堂小测系统 - 服务重启和测试脚本
 * 用于验证删除题目功能
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';

// 删除和软删除测试
async function testDeleteEndpoints() {
    console.log('\n===== 测试删除题目API =====\n');
    
    try {
        // 1. 先获取所有题目，找到一个可以删除的题目
        console.log('1. 获取题目列表...');
        const response = await fetch(`${API_BASE_URL}/api/ai/quiz/questions`);
        
        if (!response.ok) {
            throw new Error(`获取题目列表失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
            throw new Error('获取题目列表失败: 未找到题目数据');
        }
        
        console.log(`成功获取${data.data.length}道题目`);
        
        // 选择第一个和第二个题目进行测试
        const questions = data.data.slice(0, 3);
        
        if (questions.length < 2) {
            console.warn('警告: 题目数量不足，测试可能不完整');
        }
        
        // 2. 测试硬删除 (DELETE) - 使用第一个题目
        if (questions.length > 0) {
            const questionId = questions[0].id;
            console.log(`\n2. 测试硬删除题目 ID=${questionId}...`);
            
            const deleteResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!deleteResponse.ok) {
                console.error(`硬删除失败: ${deleteResponse.status} ${deleteResponse.statusText}`);
                const errorText = await deleteResponse.text();
                console.error(`错误详情: ${errorText}`);
            } else {
                const deleteResult = await deleteResponse.json();
                console.log('硬删除成功: ', deleteResult);
            }
        }
        
        // 3. 测试软删除 (PATCH) - 使用第二个题目
        if (questions.length > 1) {
            const questionId = questions[1].id;
            console.log(`\n3. 测试软删除题目 ID=${questionId}...`);
            
            const patchResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/${questionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ isDeleted: 1 })
            });
            
            if (!patchResponse.ok) {
                console.error(`软删除失败: ${patchResponse.status} ${patchResponse.statusText}`);
                const errorText = await patchResponse.text();
                console.error(`错误详情: ${errorText}`);
            } else {
                const patchResult = await patchResponse.json();
                console.log('软删除成功: ', patchResult.message);
            }
        }
        
        // 4. 测试软删除专用端点 - 使用第三个题目
        if (questions.length > 2) {
            const questionId = questions[2].id;
            console.log(`\n4. 测试软删除专用端点 ID=${questionId}...`);
            
            const softDeleteResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/${questionId}/soft-delete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!softDeleteResponse.ok) {
                console.error(`软删除专用端点失败: ${softDeleteResponse.status} ${softDeleteResponse.statusText}`);
                const errorText = await softDeleteResponse.text();
                console.error(`错误详情: ${errorText}`);
            } else {
                const softDeleteResult = await softDeleteResponse.json();
                console.log('软删除专用端点成功: ', softDeleteResult.message);
            }
        }
        
        // 5. 验证软删除后的过滤功能
        console.log('\n5. 验证软删除过滤功能...');
        const chaptersResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions`);
        
        if (!chaptersResponse.ok) {
            throw new Error(`获取题目列表失败: ${chaptersResponse.status} ${chaptersResponse.statusText}`);
        }
        
        const chaptersData = await chaptersResponse.json();
        
        if (!chaptersData.data || !Array.isArray(chaptersData.data)) {
            throw new Error('获取题目列表失败: 未找到题目数据');
        }
        
        console.log(`成功获取${chaptersData.data.length}道题目`);
        
        // 检查被软删除的题目是否存在
        if (questions.length > 1) {
            const softDeletedQuestion = chaptersData.data.find(q => q.id === questions[1].id);
            if (softDeletedQuestion) {
                console.error('验证失败: 软删除的题目仍然出现在列表中！');
                console.log('可能原因: 查询方法没有过滤isDeleted=1的题目');
            } else {
                console.log('验证成功: 软删除的题目已从列表中过滤');
            }
        }
        
        console.log('\n===== 测试完成 =====');
    } catch (error) {
        console.error('\n测试过程中发生错误:', error);
    }
}

// 执行测试
testDeleteEndpoints().catch(console.error); 