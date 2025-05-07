/**
 * 课堂小测系统 - 硬删除已软删除题目工具
 * 本工具会将所有已标记为软删除(isDeleted=1)的题目从数据库中彻底删除
 */

const fetch = require('node-fetch');
const API_BASE_URL = 'http://localhost:3000';

async function hardDeleteSoftDeletedQuestions() {
    console.log('===== 硬删除已软删除题目工具 =====');
    console.log('警告: 此操作将从数据库中彻底删除已标记为软删除的题目!\n');
    
    try {
        // 1. 获取所有已软删除的题目
        console.log('1. 获取所有已软删除的题目...');
        
        const response = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/all-with-deleted`);
        
        if (!response.ok) {
            throw new Error(`获取所有题目失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('获取所有题目失败: 返回的数据格式无效');
        }
        
        const allQuestions = data.data;
        const deletedQuestions = allQuestions.filter(q => q.isDeleted === 1);
        
        console.log(`总共找到${allQuestions.length}道题目，其中${deletedQuestions.length}道已标记为软删除`);
        
        if (deletedQuestions.length === 0) {
            console.log('没有找到已软删除的题目，无需操作');
            return;
        }
        
        // 显示将要删除的题目
        console.log('\n将要硬删除以下题目:');
        deletedQuestions.forEach((q, index) => {
            console.log(`${index+1}. ID: ${q.id}, 章节: ${q.chapterID}, 类型: ${q.type}`);
            console.log(`   题目: ${q.question.substring(0, 30)}${q.question.length > 30 ? '...' : ''}`);
        });
        
        // 2. 请求确认
        console.log('\n2. 请确认是否要硬删除以上题目? (y/n)');
        console.log('由于这是自动化脚本，将自动确认...');
        
        // 3. 执行硬删除
        console.log('\n3. 执行硬删除...');
        
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < deletedQuestions.length; i++) {
            const question = deletedQuestions[i];
            console.log(`处理题目 ${i+1}/${deletedQuestions.length}: ID=${question.id}`);
            
            try {
                // 发送DELETE请求
                const deleteResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/${question.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                if (!deleteResponse.ok) {
                    console.warn(`删除题目ID=${question.id}失败: ${deleteResponse.status}`);
                    failCount++;
                } else {
                    console.log(`成功删除题目ID=${question.id}`);
                    successCount++;
                }
            } catch (error) {
                console.error(`删除题目ID=${question.id}时发生错误:`, error);
                failCount++;
            }
        }
        
        // 4. 验证结果
        console.log('\n4. 验证结果...');
        
        const verifyResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/all-with-deleted`);
        
        if (!verifyResponse.ok) {
            throw new Error(`验证失败: ${verifyResponse.status}`);
        }
        
        const verifyData = await verifyResponse.json();
        
        if (!verifyData.data || !Array.isArray(verifyData.data)) {
            throw new Error('验证失败: 返回的数据格式无效');
        }
        
        const remainingQuestions = verifyData.data;
        const remainingDeletedQuestions = remainingQuestions.filter(q => q.isDeleted === 1);
        
        console.log(`硬删除操作完成，成功: ${successCount}，失败: ${failCount}`);
        console.log(`当前数据库中总共有${remainingQuestions.length}道题目，其中${remainingDeletedQuestions.length}道标记为软删除`);
        
        if (remainingDeletedQuestions.length > 0) {
            console.log('警告: 仍有软删除题目未被硬删除:');
            remainingDeletedQuestions.forEach((q, index) => {
                console.log(`${index+1}. ID: ${q.id}, 题目: ${q.question.substring(0, 30)}...`);
            });
        } else {
            console.log('所有软删除题目已成功硬删除!');
        }
        
        console.log('\n===== 操作完成 =====');
    } catch (error) {
        console.error('操作过程中发生错误:', error);
    }
}

// 执行操作
hardDeleteSoftDeletedQuestions().catch(console.error); 