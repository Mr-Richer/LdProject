/**
 * 课堂小测系统 - 简化版检查软删除题目脚本
 */

const fetch = require('node-fetch');
const API_BASE_URL = 'http://localhost:3000';

async function checkDeletedQuestionsSimple() {
    try {
        console.log('===== 检查软删除题目 =====');
        
        // 获取所有题目（包括已删除的）
        const response = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/all-with-deleted`);
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('API返回的数据格式无效');
        }
        
        const allQuestions = data.data;
        console.log(`总共找到${allQuestions.length}道题目`);
        
        // 分类
        const deletedQuestions = allQuestions.filter(q => q.isDeleted === 1);
        const activeQuestions = allQuestions.filter(q => q.isDeleted === 0);
        
        console.log(`- 已删除题目: ${deletedQuestions.length}道`);
        console.log(`- 活动题目: ${activeQuestions.length}道`);
        
        // 打印已删除题目的简要信息
        if (deletedQuestions.length > 0) {
            console.log('\n已删除题目列表:');
            deletedQuestions.forEach((q, index) => {
                console.log(`${index+1}. ID: ${q.id}, 章节: ${q.chapterID}, 类型: ${q.type}`);
                console.log(`   题目: ${q.question.substring(0, 30)}${q.question.length > 30 ? '...' : ''}`);
                console.log(`   创建时间: ${new Date(q.createdAt).toLocaleString()}`);
                console.log(`   isDeleted: ${q.isDeleted}`);
                console.log('---');
            });
        }
        
        // 检查特定章节
        const chapterId = 1; // 默认检查章节1
        console.log(`\n检查章节${chapterId}的题目:`);
        
        const chapterResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/chapter/${chapterId}/all-with-deleted`);
        
        if (!chapterResponse.ok) {
            throw new Error(`获取章节题目失败: ${chapterResponse.status}`);
        }
        
        const chapterData = await chapterResponse.json();
        
        if (!chapterData.data || !Array.isArray(chapterData.data)) {
            throw new Error('获取章节题目失败: 返回的数据格式无效');
        }
        
        const chapterQuestions = chapterData.data;
        const deletedChapterQuestions = chapterQuestions.filter(q => q.isDeleted === 1);
        const activeChapterQuestions = chapterQuestions.filter(q => q.isDeleted === 0);
        
        console.log(`章节${chapterId}总共${chapterQuestions.length}道题目`);
        console.log(`- 已删除: ${deletedChapterQuestions.length}道`);
        console.log(`- 活动: ${activeChapterQuestions.length}道`);
        
        // 验证前端会返回哪些数据
        console.log('\n验证普通API返回的活动题目:');
        const normalResponse = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/chapter/${chapterId}`);
        const normalData = await normalResponse.json();
        
        if (!normalData.data || !Array.isArray(normalData.data)) {
            console.log('普通API返回的数据格式无效');
        } else {
            console.log(`普通API返回${normalData.data.length}道题目`);
            
            if (normalData.data.length !== activeChapterQuestions.length) {
                console.log('警告: 普通API返回的题目数量与活动题目数量不一致！');
                console.log(`普通API返回: ${normalData.data.length}, 活动题目: ${activeChapterQuestions.length}`);
            }
        }
        
        console.log('\n===== 检查完成 =====');
    } catch (error) {
        console.error('检查过程中发生错误:', error);
    }
}

// 执行检查
checkDeletedQuestionsSimple().catch(console.error); 