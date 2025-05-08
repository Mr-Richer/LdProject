/**
 * 课前小测生成模块
 * 负责处理课堂小测题目的生成和渲染
 */

// 初始化QuizGenerator模块
const QuizGeneratorModule = {
    async init() {
        try {
            await initQuizGenerator();
            console.log('QuizGenerator初始化成功');
            return true;
        } catch (error) {
            console.error('QuizGenerator初始化失败:', error);
            return false;
        }
    }
};

// API初始化和检查机制
const APIManager = {
    maxRetries: 3,
    retryDelay: 1000,
    
    async initAPI() {
        if (!window.API) {
            window.API = {};
        }
        if (!window.API.quiz) {
            window.API.quiz = {
                async getQuestionsByChapter(chapterId) {
                    try {
                        // 使用window.API_BASE_URL
                        const API_BASE_URL = window.API_BASE_URL || window.location.origin;
                        
                        const response = await fetch(`${API_BASE_URL}/api/ai/quiz/questions/chapter/${chapterId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            }
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        // 检查API响应格式
                        if (data && data.code === 200 && Array.isArray(data.data)) {
                            return data.data;
                        }
                        // 如果数据格式不对，返回空数组
                        console.warn('API返回数据格式不正确:', data);
                        return [];
                    } catch (error) {
                        console.error('获取章节题目失败:', error);
                        throw error;
                    }
                },
                
                async getQuestions() {
                    try {
                        // 使用window.API_BASE_URL
                        const API_BASE_URL = window.API_BASE_URL || window.location.origin;
                        
                        const response = await fetch(`${API_BASE_URL}/api/ai/quiz/questions`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            }
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        // 检查API响应格式
                        if (data && data.code === 200 && Array.isArray(data.data)) {
                            return data.data;
                        }
                        // 如果数据格式不对，返回空数组
                        console.warn('API返回数据格式不正确:', data);
                        return [];
                    } catch (error) {
                        console.error('获取所有题目失败:', error);
                        throw error;
                    }
                },
                
                async saveQuestions(questions, quizId, chapterId) {
                    try {
                        // 使用window.API_BASE_URL
                        const API_BASE_URL = window.API_BASE_URL || window.location.origin;
                        
                        const response = await fetch(`${API_BASE_URL}/api/ai/quiz/save-questions`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                questions: questions.map(q => ({
                                    questionText: q.question,
                                    type: q.type,
                                    options: q.options,
                                    correctAnswer: q.answer,
                                    explanation: q.explanation
                                })),
                                quizId: quizId,
                                chapterId: chapterId
                            })
                        });
                        
                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        if (data && data.code === 200) {
                            console.log('题目保存成功');
                            return data.data;
                        }
                        throw new Error('保存失败: ' + (data.message || '未知错误'));
                    } catch (error) {
                        console.error('保存题目失败:', error);
                        throw error;
                    }
                }
            };
        }
    },
    
    async waitForAPI() {
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            if (window.API && window.API.quiz) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        throw new Error('API初始化超时');
    },
    
    async retryOperation(operation, retries = this.maxRetries) {
        let lastError;
        
        for (let i = 0; i < retries; i++) {
            try {
                return await operation();
            } catch (error) {
                console.warn(`操作失败，尝试重试 ${i + 1}/${retries}:`, error);
                lastError = error;
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            }
        }
        
        throw lastError;
    }
};

/**
 * 初始化课堂小测功能
 */
async function initQuizGenerator() {
    try {
        // 初始化API
        await APIManager.initAPI();
        console.log('API初始化成功');
        
        const quizContentContainer = document.getElementById('quiz-content');
        if (!quizContentContainer) {
            throw new Error('找不到测验内容容器');
        }
        
        // 清理静态HTML中的题目列表
        const staticQuizTable = quizContentContainer.querySelector('.quiz-questions-table');
        if (staticQuizTable && staticQuizTable.parentNode) {
            staticQuizTable.parentNode.removeChild(staticQuizTable);
        }
        
        // 初始化类型选择
        const quizTypeSelect = document.getElementById('quiz-type');
        const generateBtn = document.getElementById('generate-quiz-btn');
        
        if (quizTypeSelect && generateBtn) {
            // 切换测验类型
            quizTypeSelect.addEventListener('change', function() {
                const selectedType = this.value;
                console.log('切换到测验类型:', selectedType);
            });
            
            // 生成测验题目
            generateBtn.addEventListener('click', async function() {
                // 显示加载状态
                quizContentContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> 正在生成题目...</div>';
                
                const selectedType = quizTypeSelect.value;
                const chapterContent = document.getElementById('chapter-content')?.value || '';
                const chapterSelector = document.getElementById('chapter-select');
                const chapterId = chapterSelector ? parseInt(chapterSelector.value) || 1 : 1;
                
                if (!chapterContent.trim()) {
                    quizContentContainer.innerHTML = '<p class="error">请先输入章节内容</p>';
                    return;
                }
                
                // 获取生成的题目
                try {
                    // 检查API.ai是否存在
                    if (!window.API) {
                        window.API = {};
                    }
                    
                    if (!window.API.ai) {
                        window.API.ai = {};
                    }
                    
                    // 如果API函数不存在，创建一个模拟函数
                    if (typeof window.API.ai.generateSingleChoiceQuestions !== 'function') {
                        window.API.ai.generateSingleChoiceQuestions = function(content, count) {
                            console.log('使用模拟的单选题生成函数');
                            return simulateGenerateQuestions(content, count, 'single');
                        };
                    }
                    
                    if (typeof window.API.ai.generateMultipleChoiceQuestions !== 'function') {
                        window.API.ai.generateMultipleChoiceQuestions = function(content, count) {
                            console.log('使用模拟的多选题生成函数');
                            return simulateGenerateQuestions(content, count, 'multiple');
                        };
                    }
                    
                    if (typeof window.API.ai.generateTrueFalseQuestions !== 'function') {
                        window.API.ai.generateTrueFalseQuestions = function(content, count) {
                            console.log('使用模拟的判断题生成函数');
                            return simulateGenerateQuestions(content, count, 'truefalse');
                        };
                    }
                    
                    let questions = [];
                    const count = 5; // 默认生成5道题目
                    
                    // 根据选择的类型调用不同的API
                    switch (selectedType) {
                        case 'single':
                            questions = window.API.ai.generateSingleChoiceQuestions(chapterContent, count);
                            break;
                        case 'multiple':
                            questions = window.API.ai.generateMultipleChoiceQuestions(chapterContent, count);
                            break;
                        case 'truefalse':
                            questions = window.API.ai.generateTrueFalseQuestions(chapterContent, count);
                            break;
                        default:
                            questions = window.API.ai.generateSingleChoiceQuestions(chapterContent, count);
                    }
                    
                    // 渲染题目列表
                    renderQuestionsList(questions, quizContentContainer, selectedType);
                    
                    // 立即保存生成的题目
                    await saveQuestions(questions, chapterId);
                    
                } catch (error) {
                    console.error('生成题目时出错:', error);
                    quizContentContainer.innerHTML = `<p class="error">生成题目时出错: ${error.message}</p>`;
                }
            });
        }

        // 设置章节选择器事件（如果存在）
        await setupChapterSelector(quizContentContainer);
        
        // 初始渲染空的题目列表
        renderQuestionsTable([], quizContentContainer);
        
        // 尝试加载题目列表
        await loadQuestionsFromDatabase(quizContentContainer);
        
    } catch (error) {
        console.error('初始化失败:', error);
        showErrorMessage(document.getElementById('quiz-content'), error);
        throw error;  // 重新抛出错误以便外部处理
    }
}

/**
 * 设置章节选择器事件
 * @param {HTMLElement} container - 题目容器元素
 */
async function setupChapterSelector(container) {
    // 查找所有可能的章节选择器
    const chapterSelectors = [
        document.getElementById('chapter-select'),
        document.querySelector('.chapter-selector select'),
        document.querySelector('[name="chapter"]')
    ].filter(Boolean);
    
    if (chapterSelectors.length > 0) {
        // 使用找到的第一个选择器
        const chapterSelector = chapterSelectors[0];
        console.log('找到章节选择器:', chapterSelector);
        
        // 绑定变更事件
        chapterSelector.addEventListener('change', function() {
            const selectedChapterId = this.value;
            if (selectedChapterId) {
                console.log('选择了章节:', selectedChapterId);
                // 根据章节ID加载题目
                loadQuestionsFromDatabase(container, selectedChapterId);
            } else {
                // 没有选择章节时，加载所有题目
                loadQuestionsFromDatabase(container);
            }
        });
        
        // 如果已经有选择的章节，则立即加载对应题目
        if (chapterSelector.value) {
            console.log('初始化时已选择章节:', chapterSelector.value);
            loadQuestionsFromDatabase(container, chapterSelector.value);
        }
    } else {
        console.log('未找到章节选择器');
    }
}

/**
 * 模拟生成问题的函数
 * @param {string} content - 章节内容
 * @param {number} count - 问题数量
 * @param {string} type - 问题类型: 'single', 'multiple', 'truefalse'
 * @returns {Array} - 生成的问题数组
 */
function simulateGenerateQuestions(content, count, type) {
    console.log(`模拟生成${count}道${type}类型的问题`);
    
    // 从内容中提取一些关键词
    const contentWords = content.split(/\s+/).filter(word => word.length > 2);
    const keywords = Array.from(new Set(contentWords)).slice(0, 20);
    
    const questions = [];
    
    for (let i = 1; i <= count; i++) {
        let question = {
            id: `q${i}`,
            questionText: `这是第${i}道${getQuestionTypeName(type)}题，基于内容: "${getRandomSubstring(content)}"`,
            options: [],
            correctAnswer: null,
            explanation: `这道题考察了内容中的关键概念。正确答案是基于上下文确定的。`
        };
        
        // 根据题型生成不同的选项和答案
        switch (type) {
            case 'single':
                question.options = [
                    { id: 'A', text: `选项A: 包含关键词 ${getRandomItem(keywords)}` },
                    { id: 'B', text: `选项B: 包含关键词 ${getRandomItem(keywords)}` },
                    { id: 'C', text: `选项C: 包含关键词 ${getRandomItem(keywords)}` },
                    { id: 'D', text: `选项D: 包含关键词 ${getRandomItem(keywords)}` }
                ];
                question.correctAnswer = 'A'; // 假设A是正确答案
                break;
                
            case 'multiple':
                question.options = [
                    { id: 'A', text: `选项A: 包含关键词 ${getRandomItem(keywords)}` },
                    { id: 'B', text: `选项B: 包含关键词 ${getRandomItem(keywords)}` },
                    { id: 'C', text: `选项C: 包含关键词 ${getRandomItem(keywords)}` },
                    { id: 'D', text: `选项D: 包含关键词 ${getRandomItem(keywords)}` }
                ];
                question.correctAnswer = ['A', 'C']; // 假设A和C是正确答案
                break;
                
            case 'truefalse':
                question.options = [
                    { id: 'T', text: '正确' },
                    { id: 'F', text: '错误' }
                ];
                question.correctAnswer = 'T'; // 假设正确
                break;
        }
        
        questions.push(question);
    }
    
    return questions;
}

/**
 * 获取问题类型的中文名称
 * @param {string} type - 问题类型
 * @returns {string} - 类型的中文名称
 */
function getQuestionTypeName(type) {
    switch (type) {
        case 'single': return '单选';
        case 'multiple': return '多选';
        case 'truefalse': return '判断';
        default: return '未知类型';
    }
}

/**
 * 从内容中随机获取一个子串
 * @param {string} content - 内容文本
 * @returns {string} - 随机子串
 */
function getRandomSubstring(content) {
    if (!content || content.length < 20) return content;
    
    const words = content.split(/\s+/);
    const startIndex = Math.floor(Math.random() * (words.length - 10));
    return words.slice(startIndex, startIndex + 10).join(' ');
}

/**
 * 从数组中随机获取一个项目
 * @param {Array} array - 数组
 * @returns {*} - 随机项目
 */
function getRandomItem(array) {
    if (!array || array.length === 0) return '';
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 渲染生成的问题列表
 * @param {Array} questions - 问题数组
 * @param {HTMLElement} container - 容器元素
 * @param {string} type - 问题类型
 */
function renderQuestionsList(questions, container, type) {
    if (!questions || questions.length === 0) {
        container.innerHTML = '<p class="error">没有生成有效的题目</p>';
        return;
    }
    
    // 处理生成的题目数据，确保数据格式正确
    const formattedQuestions = questions.map((question, index) => {
        return {
            id: question.id || `temp_${Date.now()}_${index}`,
            question: question.questionText,
            type: type,
            options: question.options,
            answer: question.correctAnswer,
            explanation: question.explanation,
            // 其他需要的字段
        };
    });
    
    // 渲染题目表格
    renderQuestionsTable(formattedQuestions, container);
}

/**
 * 从数据库加载题目列表
 * @param {HTMLElement} container - 容器元素
 * @param {string} chapterId - 章节ID（可选）
 */
async function loadQuestionsFromDatabase(container, chapterId) {
    const loadingDiv = showLoadingState(container);
    
    try {
        // 等待API就绪
        await APIManager.waitForAPI();
        
        // 使用重试机制调用API
        const questions = await APIManager.retryOperation(async () => {
            const apiMethod = chapterId 
                ? window.API.quiz.getQuestionsByChapter 
                : window.API.quiz.getQuestions;
                
            return await apiMethod.call(window.API.quiz, chapterId);
        });
        
        // 移除加载状态
        removeLoadingState(loadingDiv);
        
        // 渲染题目表格
        renderQuestionsTable(questions, container);
        
    } catch (error) {
        console.error('加载题目失败:', error);
        removeLoadingState(loadingDiv);
        showErrorMessage(container, error);
        
        // 渲染空题目表格
        renderQuestionsTable([], container);
    }
}

/**
 * 显示加载状态
 * @param {HTMLElement} container - 容器元素
 * @returns {HTMLElement} 加载状态元素
 */
function showLoadingState(container) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在加载题目...';
    
    if (!container.querySelector('.quiz-questions-table')) {
        container.appendChild(loadingDiv);
    }
    
    return loadingDiv;
}

/**
 * 移除加载状态
 * @param {HTMLElement} loadingDiv - 加载状态元素
 */
function removeLoadingState(loadingDiv) {
    if (loadingDiv && loadingDiv.parentNode) {
        loadingDiv.parentNode.removeChild(loadingDiv);
    }
}

/**
 * 显示错误信息
 * @param {HTMLElement} container - 容器元素
 * @param {Error} error - 错误对象
 */
function showErrorMessage(container, error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span class="zh">加载失败: ${error.message}</span>
        <span class="en">Failed to load: ${error.message}</span>
        <button class="retry-btn">
            <span class="zh">重试</span>
            <span class="en">Retry</span>
        </button>
    `;
    
    // 添加重试按钮事件
    const retryBtn = errorDiv.querySelector('.retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', async () => {
            errorDiv.remove();
            const chapterSelector = document.getElementById('chapter-select');
            const chapterId = chapterSelector ? chapterSelector.value : null;
            await loadQuestionsFromDatabase(container, chapterId);
        });
    }
    
    container.appendChild(errorDiv);
}

/**
 * 渲染题目表格
 * @param {Array} questions - 题目数组
 * @param {HTMLElement} container - 容器元素
 */
function renderQuestionsTable(questions, container) {
    // 如果已经存在题目表格，则移除
    const existingTable = container.querySelector('.quiz-questions-table');
    if (existingTable) {
        existingTable.parentNode.removeChild(existingTable);
    }
    
    // 创建题目表格容器
    const tableContainer = document.createElement('div');
    tableContainer.className = 'quiz-questions-table';
    
    // 构建表格HTML
    let html = `
    <div class="quiz-table-container">
        <table class="quiz-table">
            <thead>
                <tr>
                    <th class="column-serial">
                        <span class="zh">序号</span>
                        <span class="en">No.</span>
                    </th>
                    <th class="column-title">
                        <span class="zh">题目名称</span>
                        <span class="en">Question Title</span>
                    </th>
                    <th class="column-type">
                        <span class="zh">题目类型</span>
                        <span class="en">Question Type</span>
                    </th>
                    <th class="column-actions">
                        <span class="zh">操作</span>
                        <span class="en">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody>`;
    
    // 如果有题目，则渲染题目行
    if (questions && questions.length > 0) {
        questions.forEach((question, index) => {
            // 获取题目类型名称
            let questionType = question.type;
            if (typeof questionType === 'string' && getQuestionTypeName(questionType)) {
                questionType = getQuestionTypeName(questionType);
            }
            
            // 获取样式类名
            let typeClass = question.type;
            if (typeof typeClass === 'string') {
                typeClass = getTypeClass(typeClass);
            }
            
            // 获取题目内容
            const questionText = question.question || question.questionText || '无题目内容';
            
            html += `
                <tr data-question-index="${index}" data-question-id="${question.id || ''}">
                    <td class="column-serial">${index + 1}</td>
                    <td class="column-title">
                        <p class="question-text">${questionText}</p>
                    </td>
                    <td class="column-type">
                        <span class="type-badge ${typeClass}">
                            <span class="zh">${questionType}</span>
                            <span class="en">${getQuestionTypeNameEN(questionType)}</span>
                        </span>
                    </td>
                    <td class="column-actions">
                        <button class="view-btn" onclick="window.QuizGenerator.viewQuestion(${JSON.stringify(question)})">
                            <i class="fas fa-eye"></i>
                            <span class="zh">查看</span>
                            <span class="en">View</span>
                        </button>
                        <button class="delete-btn" onclick="window.QuizGenerator.deleteQuestion('${question.id || ''}', ${index}, document.querySelector('.quiz-questions-table'))">
                            <i class="fas fa-trash"></i>
                            <span class="zh">删除</span>
                            <span class="en">Delete</span>
                        </button>
                    </td>
                </tr>`;
        });
    } else {
        // 如果没有题目，显示一个空行
        html += `
            <tr class="empty-row">
                <td colspan="4" class="empty-message">
                    <span class="zh">暂无题目数据</span>
                    <span class="en">No questions available</span>
                </td>
            </tr>`;
    }
    
    html += `
            </tbody>
        </table>
    </div>`;
    
    // 设置HTML内容
    tableContainer.innerHTML = html;
    
    // 将表格添加到容器
    container.appendChild(tableContainer);
    
    // 添加CSS样式
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .quiz-table-container {
            overflow-x: auto;
            margin-bottom: 20px;
        }
        .quiz-table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .quiz-table thead {
            background-color: #f5f5f5;
        }
        .quiz-table th, .quiz-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        .quiz-table tbody tr:hover {
            background-color: #f9f9f9;
        }
        .column-serial {
            width: 60px;
            text-align: center;
        }
        .column-type {
            width: 120px;
        }
        .column-actions {
            width: 160px;
            text-align: center;
        }
        .type-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: white;
        }
        .single-choice {
            background-color: #4CAF50;
        }
        .multiple-choice {
            background-color: #2196F3;
        }
        .true-false {
            background-color: #FF9800;
        }
        .short-answer {
            background-color: #9C27B0;
        }
        .discussion {
            background-color: #795548;
        }
        .view-btn, .delete-btn {
            margin: 0 5px;
            padding: 6px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            transition: all 0.2s;
        }
        .view-btn {
            background-color: #2196F3;
            color: white;
        }
        .delete-btn {
            background-color: #f44336;
            color: white;
        }
        .view-btn:hover {
            background-color: #0b7dda;
        }
        .delete-btn:hover {
            background-color: #d32f2f;
        }
        .view-btn i, .delete-btn i {
            margin-right: 5px;
        }
        .empty-message {
            text-align: center;
            padding: 20px;
            color: #999;
        }
    `;
    document.head.appendChild(styleEl);
}

/**
 * 查看题目详情
 * @param {Object} question - 题目对象
 */
function viewQuestion(question) {
    console.log('查看题目详情', question);
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'question-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    // 获取题目类型名称
    let questionType = question.type;
    if (typeof questionType === 'string' && getQuestionTypeName(questionType)) {
        questionType = getQuestionTypeName(questionType);
    }
    
    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.className = 'question-modal-content';
    modalContent.style.cssText = `
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    
    // 构建选项HTML
    let optionsHtml = '';
    if (question.options && Array.isArray(question.options)) {
        optionsHtml = '<div class="question-options">';
        question.options.forEach(option => {
            const isCorrect = Array.isArray(question.correctAnswer) 
                ? question.correctAnswer.includes(option.id)
                : question.correctAnswer === option.id;
            
            optionsHtml += `
                <div class="question-option ${isCorrect ? 'correct' : ''}">
                    <span class="option-id">${option.id}.</span>
                    <span class="option-text">${option.text}</span>
                    ${isCorrect ? '<span class="correct-badge">✓</span>' : ''}
                </div>
            `;
        });
        optionsHtml += '</div>';
    }
    
    // 添加解析HTML
    let explanationHtml = '';
    if (question.explanation) {
        explanationHtml = `
            <div class="question-explanation">
                <h4>
                    <span class="zh">解析</span>
                    <span class="en">Explanation</span>
                </h4>
                <p>${question.explanation}</p>
            </div>
        `;
    }
    
    // 设置模态框内容
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>
                <span class="zh">题目详情</span>
                <span class="en">Question Details</span>
            </h3>
            <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
            <div class="question-meta">
                <span class="question-type ${getTypeClass(question.type)}">
                    <span class="zh">${questionType}</span>
                    <span class="en">${getQuestionTypeNameEN(questionType)}</span>
                </span>
                <span class="question-id">ID: ${question.id || '未保存'}</span>
            </div>
            <div class="question-content">
                <h4>
                    <span class="zh">题目内容</span>
                    <span class="en">Question Content</span>
                </h4>
                <p>${question.question || question.questionText || '无题目内容'}</p>
            </div>
            ${optionsHtml}
            ${explanationHtml}
        </div>
        <div class="modal-footer">
            <button class="close-modal-btn">
                <span class="zh">关闭</span>
                <span class="en">Close</span>
            </button>
        </div>
    `;
    
    // 添加模态框样式
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        .close-btn:hover {
            color: #333;
        }
        .question-meta {
            margin-bottom: 15px;
        }
        .question-type {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: white;
            margin-right: 10px;
        }
        .question-id {
            font-size: 12px;
            color: #999;
        }
        .question-content {
            margin-bottom: 20px;
        }
        .question-content p {
            line-height: 1.5;
        }
        .question-options {
            margin-bottom: 20px;
        }
        .question-option {
            padding: 8px 10px;
            margin-bottom: 8px;
            border-radius: 4px;
            background-color: #f5f5f5;
            position: relative;
        }
        .question-option.correct {
            background-color: #e8f5e9;
            border-left: 4px solid #4CAF50;
        }
        .option-id {
            font-weight: bold;
            margin-right: 8px;
        }
        .correct-badge {
            position: absolute;
            right: 10px;
            color: #4CAF50;
            font-weight: bold;
        }
        .question-explanation {
            padding: 10px;
            background-color: #fff8e1;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        .close-modal-btn {
            padding: 8px 15px;
            background-color: #f5f5f5;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .close-modal-btn:hover {
            background-color: #e0e0e0;
        }
    `;
    document.head.appendChild(styleEl);
    
    // 添加到文档中
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // 添加关闭按钮事件
    const closeButtons = modal.querySelectorAll('.close-btn, .close-modal-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

/**
 * 编辑题目
 * @param {string} questionId - 题目ID
 * @param {Object} question - 题目对象
 */
function editQuestion(questionId, question) {
    console.log('编辑题目', questionId, question);
    // 编辑题目的逻辑，可以打开一个编辑模态框或跳转到编辑页面
    // 此处仅作示例，实际实现可能需要更复杂的逻辑
    alert('编辑题目: ' + question.question);
}

/**
 * 删除题目
 * @param {string} questionId - 题目ID
 * @param {number} index - 题目在列表中的索引
 * @param {HTMLElement} container - 容器元素
 */
function deleteQuestion(questionId, index, container) {
    // 修复questionId为undefined的问题
    if (!questionId || questionId === 'undefined' || questionId === 'null') {
        console.error('无效的题目ID，无法删除');
        window.showNotification ? 
            window.showNotification('无法删除题目：题目ID无效', 'error') : 
            alert('无法删除题目：题目ID无效');
        return;
    }
    
    console.log('准备删除题目:', questionId, '索引:', index);
    
    // 确认是否删除
    if (!confirm('确定要删除这道题目吗?')) {
        return;
    }
    
    // 查找行元素
    if (!container) {
        console.error('容器元素为空');
        window.showNotification ? 
            window.showNotification('删除失败：无法找到容器元素', 'error') : 
            alert('删除失败：无法找到容器元素');
            return;
        }
    
    const row = container.querySelector(`tr[data-question-index="${index}"]`);
    if (!row) {
        console.error('找不到要删除的题目行元素, 索引:', index);
        window.showNotification ? 
            window.showNotification('删除失败：找不到题目元素', 'error') : 
            alert('删除失败：找不到题目元素');
        return;
    }
    
    // 获取当前选中的章节ID，用于后续刷新
    const chapterSelector = document.getElementById('chapter-select');
    const currentChapterId = chapterSelector ? chapterSelector.value : null;
        
        // 显示loading状态
            const td = row.querySelector('.column-actions');
    if (!td) {
        console.error('找不到操作列');
        return;
    }
    
            const originalContent = td.innerHTML;
    td.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span class="zh">删除中...</span><span class="en">Deleting...</span>';
    
    // 检查这是否是最后一道题目
    const allRows = container.querySelectorAll('tbody tr:not(.empty-row)');
    const isLastQuestion = allRows.length === 1;
    
    // 如果是服务器上的题目且有ID，调用API删除
    if (questionId && !questionId.startsWith('temp_')) {
        console.log('开始调用API删除题目:', questionId);
        
        // 获取API基础URL
        const API_BASE_URL = window.API_BASE_URL || window.location.origin;
        
        // 优先使用新的删除端点
        const primaryEndpoints = [
            `/api/ai/quiz/questions/${questionId}`,  // 新添加的删除端点
            `/api/ai/quiz/questions/${questionId}/soft-delete` // 新添加的软删除端点
        ];
        
        // 创建备用API路径数组，兼容旧版路径
        const fallbackEndpoints = [
            `/api/quiz/questions/${questionId}`,
            `/quiz/questions/${questionId}`,
            `/questions/${questionId}`,
            `/api/v1/questions/${questionId}`,
            `/api/questions/${questionId}`,
            `/api/quiz/question/${questionId}`, // 单数形式
            `/api/ai/quiz/question/${questionId}`, // 单数形式
            `/question/${questionId}` // 单数形式
        ];
        
        console.log('尝试优先使用删除端点:', primaryEndpoints);
        
        // 先尝试软删除
        trySoftDelete()
            .then(success => {
                if (!success) {
                    // 如果软删除失败，尝试硬删除
                    tryHardDelete(0);
                }
            })
            .catch(error => {
                console.error('软删除失败:', error);
                // 软删除失败时尝试硬删除
                tryHardDelete(0);
            });
        
        // 尝试软删除（更新isDeleted字段为1）- 优先使用新端点
        async function trySoftDelete() {
            // 先尝试专用的软删除端点
            try {
                console.log(`尝试软删除专用端点: ${API_BASE_URL}${primaryEndpoints[1]}`);
                
                // 发送PATCH请求进行软删除
                const response = await fetch(`${API_BASE_URL}${primaryEndpoints[1]}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                console.log(`软删除专用端点响应状态:`, response.status);
                
                if (response.ok) {
                    console.log('题目软删除成功 (专用端点)');
                    handleDeleteSuccess(primaryEndpoints[1]);
                    return true;
                }
            } catch (error) {
                console.warn(`专用软删除端点失败:`, error.message);
            }
            
            // 尝试普通PATCH更新isDeleted字段
            try {
                console.log(`尝试PATCH更新端点: ${API_BASE_URL}${primaryEndpoints[0]}`);
                
                // 发送PATCH请求更新isDeleted字段
                const response = await fetch(`${API_BASE_URL}${primaryEndpoints[0]}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ isDeleted: 1 })
                });
                
                console.log(`PATCH更新端点响应状态:`, response.status);
                
                if (response.ok) {
                    console.log('题目软删除成功 (PATCH更新)');
                    handleDeleteSuccess(primaryEndpoints[0]);
                    return true;
                }
            } catch (error) {
                console.warn(`PATCH更新端点失败:`, error.message);
            }
            
            // 如果新端点都失败，尝试旧的端点...
            for (let i = 0; i < fallbackEndpoints.length; i++) {
                const endpoint = fallbackEndpoints[i];
                try {
                    console.log(`尝试旧版PATCH更新端点 (${i+1}/${fallbackEndpoints.length}): ${API_BASE_URL}${endpoint}`);
                    
                    // 发送PATCH请求更新isDeleted字段
                    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ isDeleted: 1 })
                    });
                    
                    console.log(`旧版PATCH更新端点 ${endpoint} 响应状态:`, response.status);
                    
                    if (response.ok) {
                        console.log('题目软删除成功(旧版PATCH更新)');
                        handleDeleteSuccess(endpoint);
                        return true;
                    }
                } catch (error) {
                    console.warn(`旧版PATCH更新端点 ${endpoint} 失败:`, error.message);
                }
            }
            
            return false;
        }
        
        // 递归尝试不同的端点进行硬删除
        function tryHardDelete(endpointIndex = 0, useNewEndpoints = true) {
            const endpoints = useNewEndpoints ? primaryEndpoints : fallbackEndpoints;
            
            if (endpointIndex >= endpoints.length) {
                // 如果使用新端点失败，但还未尝试旧端点
                if (useNewEndpoints) {
                    console.log('所有新端点均失败，尝试旧端点');
                    return tryHardDelete(0, false);
                }
                
                // 所有端点都失败
                td.innerHTML = originalContent;
                window.showNotification ? 
                    window.showNotification('删除题目失败: 所有API端点均无响应', 'error') : 
                    alert('删除题目失败: 所有API端点均无响应');
                return;
            }
            
            const endpoint = endpoints[endpointIndex];
            console.log(`尝试硬删除端点 (${endpointIndex+1}/${endpoints.length}): ${API_BASE_URL}${endpoint}`);
            
            // 发送DELETE请求
            fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                console.log(`端点 ${endpoint} 响应状态:`, response.status);
                
                if (response.ok) {
                    // 删除成功
                    return response.json().catch(() => ({ success: true }));
                }
                
                if ((response.status === 404 || response.status === 400) && endpointIndex < endpoints.length - 1) {
                    // 如果是404或400且还有其他端点可尝试，继续尝试下一个
                    console.log(`端点 ${endpoint} 返回${response.status}，尝试下一个端点`);
                    return tryHardDelete(endpointIndex + 1, useNewEndpoints);
                }
                
                // 其他错误状态
                return response.text().then(text => {
                    let errorMessage = `删除失败(${response.status}): ${response.statusText}`;
                    try {
                        const errorJson = JSON.parse(text);
                        if (errorJson.message) {
                            errorMessage = errorJson.message;
                        }
                    } catch (e) {
                        if (text) errorMessage += ' - ' + text;
                    }
                    throw new Error(errorMessage);
                });
            })
            .then(result => {
                if (!result) return; // 如果已转到下一个端点，跳过后续处理
                
                console.log('题目删除成功:', result);
                handleDeleteSuccess(endpoint);
            })
            .catch(error => {
                if (endpointIndex < endpoints.length - 1) {
                    // 如果还有其他端点可尝试，继续尝试下一个
                    console.log(`端点 ${endpoint} 失败:`, error.message, '尝试下一个端点');
                    tryHardDelete(endpointIndex + 1, useNewEndpoints);
                } else if (useNewEndpoints) {
                    // 如果所有新端点都失败，尝试旧端点
                    console.log('所有新端点均失败，尝试旧端点');
                    tryHardDelete(0, false);
                } else {
                    // 所有端点都失败
                    console.error('所有删除端点均失败:', error);
                    td.innerHTML = originalContent;
                    window.showNotification ? 
                        window.showNotification(`删除题目失败: ${error.message}`, 'error') : 
                        alert(`删除题目失败: ${error.message}`);
                }
            });
        }
        
        // 删除成功后的处理
        function handleDeleteSuccess(endpoint) {
                    // 动画移除行
                    row.style.transition = "all 0.3s";
                    row.style.opacity = "0";
                    row.style.height = "0";
                    setTimeout(() => {
                // 确保行元素仍然在DOM中
                if (row && row.parentNode) {
                    row.parentNode.removeChild(row);
                }
                if (container) {
                    // 如果是最后一道题目，直接强制显示无数据状态，而不是检查空状态
                    if (isLastQuestion) {
                        showEmptyState(container);
                    } else {
                        checkEmptyState(container);
                    }
                }
            
                // 显示成功通知
                window.showNotification ? 
                    window.showNotification('题目删除成功', 'success') : 
                    console.log('题目删除成功');
                
                // 记录成功的端点以供将来使用
                window.successfulDeleteEndpoint = endpoint;
                
                // 刷新题目列表
                if (currentChapterId) {
                    console.log('正在刷新题目列表，章节ID:', currentChapterId);
                    if (typeof window.loadChapterQuestions === 'function') {
                        setTimeout(() => window.loadChapterQuestions(currentChapterId, true), 500);
                    } else {
                        // 尝试使用页面上的函数
                        setTimeout(() => {
                            // 尝试查找并点击章节选择器的change事件
                            if (chapterSelector) {
                                const event = new Event('change');
                                chapterSelector.dispatchEvent(event);
                            } else if (isLastQuestion) {
                                // 如果是最后一道题且没有成功刷新，确保显示空状态
                                showEmptyState(container);
                            }
                        }, 500);
                    }
                }
                    }, 300);
        }
    } else {
        // 如果是临时生成的题目，直接从DOM中移除
        console.log('移除临时题目');
            row.style.transition = "all 0.3s";
            row.style.opacity = "0";
            row.style.height = "0";
            setTimeout(() => {
            if (row && row.parentNode) {
                row.parentNode.removeChild(row);
            }
            if (container) {
                if (isLastQuestion) {
                    showEmptyState(container);
                } else {
                checkEmptyState(container);
        }
            }
            window.showNotification ? 
                window.showNotification('临时题目已移除', 'success') : 
                console.log('临时题目已移除');
        }, 300);
    }
}

/**
 * 显示空状态（当没有题目时）
 * @param {HTMLElement} container - 容器元素
 */
function showEmptyState(container) {
    if (!container) return;
    
        const tbody = container.querySelector('tbody');
    if (!tbody) return;
    
    // 清空已有行
    tbody.innerHTML = '';
    
    // 添加空状态行
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row';
            emptyRow.innerHTML = `
                <td colspan="4" class="empty-message">
                    <span class="zh">暂无题目数据</span>
                    <span class="en">No questions available</span>
                </td>`;
            tbody.appendChild(emptyRow);
            
            // 移除操作按钮区域
            const actionsDiv = container.querySelector('.quiz-actions');
            if (actionsDiv) {
                actionsDiv.remove();
            }
    
    console.log('显示无数据状态');
}

/**
 * 检查表格是否为空，如果为空则显示空状态
 * @param {HTMLElement} container - 容器元素
 */
function checkEmptyState(container) {
    if (!container) return;
    
    const rows = container.querySelectorAll('tbody tr:not(.empty-row)');
    if (rows.length === 0) {
        showEmptyState(container);
    }
}

/**
 * 获取题目类型对应的CSS类名
 * @param {string} type - 题目类型
 * @returns {string} - CSS类名
 */
function getTypeClass(type) {
    switch (type) {
        case 'single': return 'single-choice';
        case 'multiple': return 'multiple-choice';
        case 'truefalse': return 'true-false';
        case 'short': return 'short-answer';
        case 'discussion': return 'discussion';
        default: return '';
    }
}

/**
 * 保存题目到服务器
 * @param {Array} questions - 题目数组
 * @param {number} chapterId - 章节ID
 */
async function saveQuestions(questions, chapterId) {
    if (!questions || questions.length === 0) {
        console.error('没有题目可保存');
        window.showNotification ? window.showNotification('没有题目可保存', 'error') : alert('没有题目可保存');
        return;
    }
    
    if (!chapterId) {
        // 尝试从选择器获取章节ID
        const chapterSelector = document.getElementById('chapter-select');
        if (chapterSelector && chapterSelector.value) {
            chapterId = parseInt(chapterSelector.value);
            console.log('从选择器获取章节ID:', chapterId);
        } else {
        console.error('未指定章节ID');
        window.showNotification ? window.showNotification('未指定章节ID', 'error') : alert('未指定章节ID');
        return;
        }
    }
    
    console.log('准备保存题目到章节:', chapterId, questions);
    
    // 验证API可用性
    if (!window.API || !window.API.quiz || typeof window.API.quiz.saveQuestions !== 'function') {
        console.log('常规API不可用，尝试直接使用fetch保存');
        return directSaveQuestions(questions, chapterId);
    }
    
    // 显示保存中状态
    window.showNotification ? window.showNotification('正在保存题目...', 'info') : console.log('正在保存题目...');
    
    try {
        // 调用API保存题目，使用实际的章节ID
        const response = await window.API.quiz.saveQuestions(questions, null, chapterId);
        console.log('保存成功:', response);
        window.showNotification ? window.showNotification('题目保存成功', 'success') : alert('题目保存成功');
        
        // 刷新题目列表
        refreshQuestionsList(chapterId);
    } catch (error) {
        console.error('保存题目失败:', error);
        window.showNotification ? window.showNotification(`保存题目失败: ${error.message}`, 'error') : alert(`保存题目失败: ${error.message}`);
        
        // 如果常规API保存失败，尝试直接使用fetch保存
        console.log('尝试使用备用方法保存');
        directSaveQuestions(questions, chapterId);
    }
}

/**
 * 使用直接fetch请求保存题目（备用方法）
 * 当常规API不可用时使用
 */
async function directSaveQuestions(questions, chapterId) {
    console.log('使用直接fetch方法保存题目');
    
    if (!questions || questions.length === 0 || !chapterId) {
        console.error('保存题目失败：无效的参数');
        window.showNotification ? window.showNotification('保存失败：参数无效', 'error') : alert('保存失败：参数无效');
        return false;
    }
    
    // 显示保存中状态
    window.showNotification ? window.showNotification('正在保存题目...', 'info') : console.log('正在保存题目...');
    
    // 获取API基础URL
    const API_BASE_URL = window.API_BASE_URL || window.location.origin;
    
    // 创建可能的API端点数组
    const possibleEndpoints = [
        `/api/quiz/save-questions`,
        `/api/ai/quiz/save-questions`,
        `/quiz/save-questions`,
        `/api/quiz/questions/save`,
        `/api/ai/quiz/questions/save`,
        `/api/quiz/questions`, // RESTful POST
        `/api/ai/quiz/questions`, // RESTful POST
        `/quiz/questions`, // RESTful POST
        `/questions`, // RESTful POST
        `/api/v1/questions`, // 另一种RESTful版本
        `/api/v1/quiz/questions` // 另一种RESTful版本
    ];
    
    // 如果之前有成功的获取或删除端点，优先使用相同的路径模式
    if (window.successfulQuestionEndpoint) {
        const successPath = window.successfulQuestionEndpoint.split('/').slice(0, -2).join('/');
        const priorityEndpoint = `${successPath}/save-questions`;
        // 避免重复添加已存在的端点
        if (!possibleEndpoints.includes(priorityEndpoint)) {
            possibleEndpoints.unshift(priorityEndpoint);
            console.log('优先尝试基于成功获取端点的路径:', priorityEndpoint);
        }

        // 尝试RESTful风格的端点
        const restfulEndpoint = `${successPath}`;
        if (!possibleEndpoints.includes(restfulEndpoint)) {
            possibleEndpoints.push(restfulEndpoint);
            console.log('添加基于成功获取端点的RESTful路径:', restfulEndpoint);
        }
    } else if (window.successfulDeleteEndpoint) {
        const successPath = window.successfulDeleteEndpoint.split('/').slice(0, -2).join('/');
        const priorityEndpoint = `${successPath}/save-questions`;
        // 避免重复添加已存在的端点
        if (!possibleEndpoints.includes(priorityEndpoint)) {
            possibleEndpoints.unshift(priorityEndpoint);
            console.log('优先尝试基于成功删除端点的路径:', priorityEndpoint);
        }

        // 尝试RESTful风格的端点
        const restfulEndpoint = `${successPath}`;
        if (!possibleEndpoints.includes(restfulEndpoint)) {
            possibleEndpoints.push(restfulEndpoint);
            console.log('添加基于成功删除端点的RESTful路径:', restfulEndpoint);
        }
    }
    
    console.log('将尝试以下保存API端点:', possibleEndpoints);
    
    // 准备多种可能的请求格式，与数据库字段匹配
    const requestFormats = [
        // 标准格式 - 精确匹配数据库字段名
        {
            body: JSON.stringify({
                questions: questions.map(q => ({
                    quiz_id: q.quiz_id || q.quizId || null, // 同时匹配snake_case和camelCase
                    question: q.question || q.questionText || '', // 题目内容
                    type: q.type || 'choice', // 题目类型
                    options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options), // 确保选项为字符串
                    answer: q.answer || q.correctAnswer || '', // 正确答案
                    explanation: q.explanation || '', // 解析说明
                    difficulty: q.difficulty || 'medium', // 难度
                    order: q.order || 0, // 排序
                    chapterId: parseInt(chapterId), // 章节ID
                    isDeleted: 0 // 默认未删除
                })),
                chapterId: parseInt(chapterId)
            }),
            contentType: 'application/json'
        },
        // 兼容格式 - 使用API常见字段名
        {
            body: JSON.stringify({
                questions: questions.map(q => ({
                    questionText: q.question || q.questionText || '',
                    type: q.type || 'choice',
                    options: q.options,
                    correctAnswer: q.answer || q.correctAnswer || '',
                    explanation: q.explanation || '',
                    chapterId: parseInt(chapterId)
                })),
                quizId: null,
                chapterId: parseInt(chapterId)
            }),
            contentType: 'application/json'
        },
        // RESTful格式 - 直接数组格式
        {
            body: JSON.stringify(questions.map(q => ({
                question: q.question || q.questionText || '',
                type: q.type || 'choice',
                options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options),
                answer: q.answer || q.correctAnswer || '',
                explanation: q.explanation || '',
                difficulty: q.difficulty || 'medium',
                chapterId: parseInt(chapterId)
            }))),
            contentType: 'application/json'
        },
        // 另一种嵌套格式
        {
            body: JSON.stringify({
                data: {
                    questions: questions.map(q => ({
                        question: q.question || q.questionText || '',
                        type: q.type || 'choice',
                        options: q.options,
                        answer: q.answer || q.correctAnswer || '',
                        explanation: q.explanation || '',
                        chapterId: parseInt(chapterId),
                        isDeleted: 0
                    })),
                    chapterId: parseInt(chapterId)
                }
            }),
            contentType: 'application/json'
        }
    ];
    
    // 递归尝试不同的端点和请求格式
    async function trySaveWithEndpointAndFormat(endpointIndex, formatIndex = 0) {
        if (endpointIndex >= possibleEndpoints.length) {
            // 所有端点都失败
            console.error('所有保存API端点均尝试失败');
            window.showNotification ? 
                window.showNotification('保存题目失败: 所有API端点均无响应', 'error') : 
                alert('保存题目失败: 所有API端点均无响应');
            return false;
        }
        
        if (formatIndex >= requestFormats.length) {
            // 当前端点的所有格式都失败，尝试下一个端点
            return await trySaveWithEndpointAndFormat(endpointIndex + 1, 0);
        }
        
        const endpoint = possibleEndpoints[endpointIndex];
        const requestFormat = requestFormats[formatIndex];
        
        console.log(`尝试保存端点 (${endpointIndex+1}/${possibleEndpoints.length}) 格式 (${formatIndex+1}/${requestFormats.length}): ${API_BASE_URL}${endpoint}`);
        
        try {
            // 发送请求
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': requestFormat.contentType,
                    'Accept': 'application/json'
                },
                body: requestFormat.body
            });
            
            console.log(`端点 ${endpoint} 响应状态:`, response.status);
            
            if (response.ok) {
                // 请求成功，保存成功的端点
                const data = await response.json().catch(() => ({ success: true }));
                console.log('保存成功:', data);
                window.successfulSaveEndpoint = endpoint;
                window.showNotification ? 
                    window.showNotification('题目保存成功', 'success') : 
                    alert('题目保存成功');
                
                // 刷新题目列表
                refreshQuestionsList(chapterId);
                return true;
            }
            
            if ((response.status === 404 || response.status === 400) && 
                (formatIndex < requestFormats.length - 1 || endpointIndex < possibleEndpoints.length - 1)) {
                // 如果是404或400，优先尝试下一种格式，然后再尝试下一个端点
                if (formatIndex < requestFormats.length - 1) {
                    console.log(`端点 ${endpoint} 格式 ${formatIndex+1} 返回${response.status}，尝试下一种格式`);
                    return await trySaveWithEndpointAndFormat(endpointIndex, formatIndex + 1);
                } else {
                    console.log(`端点 ${endpoint} 所有格式都失败，尝试下一个端点`);
                    return await trySaveWithEndpointAndFormat(endpointIndex + 1, 0);
                }
            }
            
            // 其他错误状态
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    } catch (error) {
            console.warn(`端点 ${endpoint} 格式 ${formatIndex+1} 失败:`, error.message);
            
            if (formatIndex < requestFormats.length - 1) {
                // 如果当前端点还有其他格式可尝试
                console.log(`尝试同一端点的下一种格式`);
                return await trySaveWithEndpointAndFormat(endpointIndex, formatIndex + 1);
            } else if (endpointIndex < possibleEndpoints.length - 1) {
                // 如果还有其他端点可尝试
                console.log(`端点 ${endpoint} 所有格式都失败，尝试下一个端点`);
                return await trySaveWithEndpointAndFormat(endpointIndex + 1, 0);
            } else {
                // 所有端点和格式都失败
                console.error('所有保存端点均失败:', error);
                window.showNotification ? 
                    window.showNotification(`保存题目失败: ${error.message}`, 'error') : 
                    alert(`保存题目失败: ${error.message}`);
                return false;
            }
        }
    }
    
    // 开始尝试第一个端点和第一种格式
    return await trySaveWithEndpointAndFormat(0, 0);
}

/**
 * 刷新题目列表
 */
function refreshQuestionsList(chapterId) {
    if (!chapterId) {
        console.error('刷新题目列表失败：缺少章节ID');
        return;
    }
    
    console.log('刷新题目列表，章节ID:', chapterId);
    
    // 尝试使用三种不同的方法刷新列表，确保至少一种方法有效
    
    // 方法1：使用全局loadChapterQuestions函数
    if (typeof window.loadChapterQuestions === 'function') {
        console.log('使用loadChapterQuestions刷新题目列表');
        setTimeout(() => window.loadChapterQuestions(chapterId, true), 300);
        return;
    }
    
    // 方法2：触发章节选择器的change事件
    const chapterSelector = document.getElementById('chapter-select');
    if (chapterSelector) {
        console.log('触发章节选择器change事件刷新题目列表');
        setTimeout(() => {
            const event = new Event('change');
            chapterSelector.dispatchEvent(event);
        }, 300);
        return;
    }
    
    // 方法3：使用内部loadQuestionsFromDatabase函数
    const quizContentContainer = document.getElementById('quiz-content');
    if (quizContentContainer && typeof loadQuestionsFromDatabase === 'function') {
        console.log('使用loadQuestionsFromDatabase刷新题目列表');
        setTimeout(() => loadQuestionsFromDatabase(quizContentContainer, chapterId), 300);
        return;
    }
    
    console.warn('无法刷新题目列表：找不到可用的刷新方法');
}

/**
 * 导出问题到文件
 * @param {Array} questions - 问题数组
 * @param {string} type - 题目类型
 */
function exportQuestions(questions, type) {
    if (!questions || questions.length === 0) {
        console.error('没有题目可导出');
        return;
    }

    // 创建导出内容
    let exportContent = `# ${getQuestionTypeName(type)}题 (${questions.length}题)\n\n`;
    
    questions.forEach((question, index) => {
        exportContent += `## ${index + 1}. ${question.questionText}\n\n`;
        
        question.options.forEach(option => {
            const isCorrect = Array.isArray(question.correctAnswer)
                ? question.correctAnswer.includes(option.id)
                : question.correctAnswer === option.id;
                
            exportContent += `${option.id}. ${option.text} ${isCorrect ? '[✓]' : ''}\n`;
        });
        
        exportContent += `\n解析: ${question.explanation}\n\n`;
    });
    
    // 创建Blob对象
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `课堂小测-${getQuestionTypeName(type)}题-${new Date().toISOString().slice(0, 10)}.txt`;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    console.log('题目导出完成');
    window.showNotification('题目导出完成', 'success');
}

/**
 * 获取问题类型的英文名称
 * @param {string} typeZh - 问题类型的中文名称
 * @returns {string} - 类型的英文名称
 */
function getQuestionTypeNameEN(typeZh) {
    switch (typeZh) {
        case '单选': return 'Single Choice';
        case '多选': return 'Multiple Choice';
        case '判断': return 'True/False';
        case '简答': return 'Short Answer';
        case '讨论': return 'Discussion';
        default: return 'Unknown Type';
    }
}

// 导出模块
const QuizGeneratorExport = {
    init: initQuizGenerator,
    simulateGenerateQuestions,
    getQuestionTypeName,
    getRandomSubstring,
    getRandomItem,
    renderQuestionsList,
    loadQuestionsFromDatabase,
    renderQuestionsTable,
    exportQuestions,
    saveQuestions,
    directSaveQuestions,
    refreshQuestionsList,
    deleteQuestion,
    viewQuestion,
    APIManager  // 导出APIManager以便外部使用
};

// 兼容CommonJS和ES模块
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = QuizGeneratorExport;
} else {
    window.QuizGenerator = QuizGeneratorExport;
}