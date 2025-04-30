/**
 * 课前小测生成模块
 * 负责处理课堂小测题目的生成和渲染
 */

/**
 * 初始化课堂小测功能
 */
function initQuizGenerator() {
    const quizContentContainer = document.getElementById('quiz-content');
    if (!quizContentContainer) {
        console.error('找不到测验内容容器');
        return;
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
        generateBtn.addEventListener('click', function() {
            // 显示加载状态
            quizContentContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> 正在生成题目...</div>';
            
            const selectedType = quizTypeSelect.value;
            const chapterContent = document.getElementById('chapter-content')?.value || '';
            
            if (!chapterContent.trim()) {
                quizContentContainer.innerHTML = '<p class="error">请先输入章节内容</p>';
                return;
            }
            
            // 模拟API请求延迟
            setTimeout(() => {
                try {
                    // 检查API.ai是否存在，如果不存在则创建模拟函数
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
                    
                    // 渲染题目
                    renderQuestions(questions, quizContentContainer, selectedType);
                } catch (error) {
                    console.error('生成题目时出错:', error);
                    quizContentContainer.innerHTML = `<p class="error">生成题目时出错: ${error.message}</p>`;
                }
            }, 2000);
        });
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
 * 渲染问题到容器中
 * @param {Array} questions - 问题数组
 * @param {HTMLElement} container - 容器元素
 * @param {string} type - 问题类型
 */
function renderQuestions(questions, container, type) {
    if (!questions || questions.length === 0) {
        container.innerHTML = '<p class="error">没有生成有效的题目</p>';
        return;
    }
    
    let html = `<div class="quiz-list">
                <div class="quiz-header">
                    <h3>已生成 ${questions.length} 道${getQuestionTypeName(type)}题</h3>
                    <div class="quiz-actions">
                        <button class="btn" id="exportQuizBtn">
                            <i class="fas fa-download"></i> 导出
                        </button>
                    </div>
                </div>`;
    
    questions.forEach((question, index) => {
        html += `
        <div class="quiz-item">
            <div class="question-header">
                <span class="question-number">${index + 1}</span>
                <span class="question-type">${getQuestionTypeName(type)}</span>
            </div>
            <div class="question-text">${question.questionText}</div>
            <div class="options-list">`;
        
        question.options.forEach(option => {
            const isCorrect = Array.isArray(question.correctAnswer)
                ? question.correctAnswer.includes(option.id)
                : question.correctAnswer === option.id;
            
            html += `
            <div class="option${isCorrect ? ' correct' : ''}">
                <span class="option-label">${option.id}.</span>
                <span class="option-text">${option.text}</span>
                ${isCorrect ? '<span class="correct-mark"><i class="fas fa-check"></i></span>' : ''}
            </div>`;
        });
        
        html += `
            </div>
            <div class="explanation">
                <div class="explanation-title">解析</div>
                <div class="explanation-content">${question.explanation}</div>
            </div>
        </div>`;
    });
    
    html += `</div>`;
    
    container.innerHTML = html;
    
    // 为导出按钮添加事件
    const exportBtn = container.querySelector('#exportQuizBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportQuestions(questions, type);
        });
    }
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

// 导出模块
const QuizGenerator = {
    init: initQuizGenerator,
    simulateGenerateQuestions,
    getQuestionTypeName,
    getRandomSubstring,
    getRandomItem,
    renderQuestions,
    exportQuestions
};

// 兼容CommonJS和ES模块
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = QuizGenerator;
} else {
    window.QuizGenerator = QuizGenerator;
} 