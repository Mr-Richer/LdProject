/**
 * 课堂小测按钮功能修复
 * 解决课堂小测中按钮无法点击的问题
 */

// 声明API基础路径 
// 自动检测当前环境并设置正确的API基础URL
var baseUrl = (function() {
    // 检查当前协议
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = window.location.port;
    
    // 如果是file://协议（本地文件），使用开发环境API
    if (protocol === 'file:') {
        console.log('检测到本地文件环境，使用开发服务器API');
        return 'http://localhost:3000/api'; // 开发服务器地址
    }
    
    // 如果是http/https协议，使用相对路径
    if (protocol === 'http:' || protocol === 'https:') {
        return '/api'; // 使用相对路径
    }
    
    // 默认返回完整的API路径
    return protocol + '//' + hostname + (port ? ':' + port : '') + '/api';
})();

console.log('API基础路径:', baseUrl);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('初始化课堂小测功能...');
    
    // 确保提示词输入框始终可见
    makePromptVisible();
    
    // 绑定题型按钮事件
    bindQuizTypeButtons();
    
    // 绑定生成方式按钮事件
    bindMethodButtons();
    
    // 绑定生成按钮事件
    bindGenerateButton();
    
    // 绑定保存按钮事件
    bindResultActionButtons();
    
    console.log('课堂小测按钮初始化完成');
});

/**
 * 确保提示词输入框始终可见
 */
function makePromptVisible() {
    // 直接添加样式使提示词输入框可见
    var style = document.createElement('style');
    style.textContent = `
        .generation-prompt { 
            display: flex !important; 
            visibility: visible !important; 
            opacity: 1 !important; 
        }
    `;
    document.head.appendChild(style);
    
    // 定期检查确保提示词框可见
    setInterval(function() {
        var promptBox = document.querySelector('.generation-prompt');
        if (promptBox) {
            promptBox.style.display = 'flex';
            promptBox.style.visibility = 'visible';
            promptBox.style.opacity = '1';
        }
    }, 1000);
}

/**
 * 绑定题型按钮事件
 */
function bindQuizTypeButtons() {
    var typeButtons = document.querySelectorAll('.quiz-type');
    
    if (typeButtons.length === 0) {
        console.log('未找到题型按钮');
        return;
    }
    
    console.log('找到题型按钮数量:', typeButtons.length);
    
    typeButtons.forEach(function(button) {
        button.onclick = function(event) {
            // 移除其他按钮的活动状态
            typeButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            // 设置当前按钮为活动状态
            this.classList.add('active');
            
            // 显示按钮选中状态
            var typeText = this.querySelector('.zh')?.innerText || this.innerText;
            console.log('选择题型:', typeText);
            
            // 阻止默认行为（如果需要）
            if (event) {
                event.preventDefault();
            }
            
            return false;
        };
    });
    
    // 默认选中第一个题型
    if (typeButtons.length > 0 && !document.querySelector('.quiz-type.active')) {
        typeButtons[0].classList.add('active');
    }
}

/**
 * 绑定生成方式按钮事件
 */
function bindMethodButtons() {
    var methodButtons = document.querySelectorAll('.option-btn');
    
    if (methodButtons.length === 0) {
        console.log('未找到生成方式按钮');
        return;
    }
    
    console.log('找到生成方式按钮数量:', methodButtons.length);
    
    methodButtons.forEach(function(button) {
        button.onclick = function(event) {
            // 获取按钮组
            var btnGroup = this.parentElement ? this.parentElement.querySelectorAll('.option-btn') : [];
            
            // 移除其他按钮的活动状态
            btnGroup.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            // 设置当前按钮为活动状态
            this.classList.add('active');
            
            // 显示按钮选中状态
            var methodText = this.querySelector('.zh')?.innerText || this.innerText;
            console.log('选择生成方式:', methodText);
            
            // 阻止默认行为和冒泡
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            return false;
        };
    });
    
    // 默认选中第一个生成方式
    if (methodButtons.length > 0 && !document.querySelector('.option-btn.active')) {
        methodButtons[0].classList.add('active');
    }
}

/**
 * 绑定生成按钮事件
 */
function bindGenerateButton() {
    var generateBtn = document.querySelector('.generate-btn');
    
    if (!generateBtn) {
        console.log('未找到生成按钮');
        return;
    }
    
    console.log('找到生成按钮');
    
    generateBtn.onclick = function(event) {
        // 阻止默认行为和冒泡
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        console.log('点击生成按钮');
        
        // 获取生成参数
        var params = getGenerationParams();
        console.log('生成参数:', params);
        
        // 显示生成中提示
        if (window.showNotification) {
            window.showNotification('正在生成题目...', 'info');
        }
        
        // 调用生成接口
        generateQuizQuestions(params)
            .then(function(response) {
                console.log('生成成功:', response);
                
                // 显示成功提示
                if (window.showNotification) {
                    window.showNotification('题目生成成功!', 'success');
                }
                
                // 渲染题目
                if (response && response.data && response.data.questions) {
                    renderQuizResult(response.data.questions);
                }
            })
            .catch(function(error) {
                console.error('生成失败:', error);
                
                // 显示错误提示
                if (window.showNotification) {
                    window.showNotification('题目生成失败:' + error.message, 'error');
                }
            });
        
        return false;
    };
}

/**
 * 获取生成参数
 */
function getGenerationParams() {
    // 获取选中的题型
    var activeType = document.querySelector('.quiz-type.active');
    var quizType = 'single'; // 默认单选题
    
    if (activeType) {
        var typeText = activeType.querySelector('.zh')?.innerText || activeType.innerText;
        if (typeText.includes('多选')) {
            quizType = 'multiple';
        } else if (typeText.includes('简答')) {
            quizType = 'short_answer';
        } else if (typeText.includes('讨论')) {
            quizType = 'discussion';
        }
    }
    
    // 打印选中的题型，用于调试
    console.log('选中题型:', quizType, '原始文本:', typeText);
    
    // 获取选中的生成方式
    var activeMethod = document.querySelector('.option-btn.active');
    var method = 'ai'; // 默认智能生成
    
    if (activeMethod) {
        var methodText = activeMethod.querySelector('.zh')?.innerText || activeMethod.innerText;
        if (methodText.includes('随机')) {
            method = 'random';
        }
    }
    
    // 获取数量
    var countInput = document.querySelector('.option-input');
    var count = 5; // 默认5道题
    
    if (countInput && !isNaN(parseInt(countInput.value))) {
        count = parseInt(countInput.value);
        // 确保在合理范围内
        count = Math.min(Math.max(count, 1), 20);
    }
    
    // 获取提示词
    var promptInput = document.querySelector('.prompt-input');
    var prompt = '生成中国传统文化题目'; // 默认提示词
    
    if (promptInput && promptInput.value && promptInput.value.trim()) {
        prompt = promptInput.value.trim();
    }
    
    // 获取章节ID
    var chapterSelect = document.querySelector('select[name="chapterId"]') || document.getElementById('chapterId') || document.getElementById('chapter-select');
    var chapterId = 1; // 默认章节ID
    
    if (chapterSelect && chapterSelect.value) {
        chapterId = parseInt(chapterSelect.value);
        console.log('生成参数 - 选择的章节ID:', chapterId);
    }
    
    return {
        prompt: prompt,
        quizType: quizType,
        generationMethod: method,
        count: parseInt(count, 10), // 确保是数字类型
        difficulty: 'medium', // 默认中等难度
        chapterId: chapterId // 添加章节ID
    };
}

/**
 * 生成题目的API调用
 */
function generateQuizQuestions(params) {
    return new Promise(function(resolve, reject) {
        // 显示网络请求状态
        console.log('正在发送请求到:', baseUrl + '/ai/quiz/generate-by-prompt');
        
        // 从参数中提取chapterId，保存到生成成功后使用
        var chapterId = 1;
        if (params.chapterId) {
            chapterId = params.chapterId;
            // 检查API是否支持chapterId参数
            const apiSupportsChapterId = true; // 设置为true表示API支持此参数
            
            if (!apiSupportsChapterId) {
                delete params.chapterId; // 只有在API不支持时才删除
            }
            
            console.log('使用章节ID:', chapterId, '是否包含在请求中:', apiSupportsChapterId);
        }
        
        // 将章节ID保存到window对象，供保存时使用
        window.lastChapterId = chapterId;
        
        // 确保参数类型正确
        if (params.count && typeof params.count !== 'number') {
            params.count = parseInt(params.count, 10) || 5;
        }
        
        console.log('发送最终参数:', params);
        
        fetch(baseUrl + '/ai/quiz/generate-by-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(function(response) {
            console.log('收到服务器响应:', response.status, response.statusText);
            
            if (!response.ok) {
                // 详细记录错误响应
                return response.text().then(text => {
                    let errorMsg = '请求失败: ' + response.status + ' ' + response.statusText;
                    try {
                        // 尝试解析错误响应为JSON
                        const errorJson = JSON.parse(text);
                        if (errorJson.message) {
                            errorMsg += ' - ' + errorJson.message;
                        }
                    } catch (e) {
                        // 如果不是JSON，直接使用文本
                        if (text) {
                            errorMsg += ' - ' + text;
                        }
                    }
                    
                    console.error('API错误详情:', errorMsg);
                    throw new Error(errorMsg);
                });
            }
            
            return response.json();
        })
        .then(function(data) {
            console.log('成功解析响应数据');
            resolve(data);
        })
        .catch(function(error) {
            console.error('请求错误详细信息:', error);
            
            // 直接拒绝并传递错误
            reject(error);
        });
    });
}

/**
 * 获取题型名称
 */
function getQuestionTypeName(type) {
    switch (type) {
        case 'single': return '单选题';
        case 'multiple': return '多选题';
        case 'short_answer': return '简答题';
        case 'discussion': return '讨论题';
        default: return '题目';
    }
}

/**
 * 渲染题目结果
 */
function renderQuizResult(questions) {
    if (!questions || questions.length === 0) {
        console.error('没有题目可渲染');
        return;
    }
    
    // 创建存储所有题目的数组，用于分页显示
    window.allQuestions = questions;
    
    // 查找结果容器（使用原有结构）
    var resultContainer = document.querySelector('.quiz-result');
    
    if (!resultContainer) {
        console.error('未找到原始题目容器');
        return;
    }
    
    // 显示结果容器
    resultContainer.style.display = 'block';
    
    // 获取题目内容容器
    var resultContent = resultContainer.querySelector('.result-content');
    if (!resultContent) {
        console.error('未找到题目内容容器');
        return;
    }
    
    // 清空现有内容
    resultContent.innerHTML = '';
    
    // 渲染所有题目到结果容器中
    questions.forEach(function(question, index) {
        renderQuestionToExistingStructure(question, index, resultContent);
    });
    
    // 添加题目列表
    updateQuestionTable(questions);
    
    // 滚动到结果区域
    resultContainer.scrollIntoView({behavior: 'smooth'});
    
    // 重新绑定结果操作按钮事件
    bindResultActionButtons();
}

/**
 * 渲染单个题目到已有结构中
 */
function renderQuestionToExistingStructure(question, index, container) {
    if (!question || !container) return;
    
    // 检查并修正题目类型
    if (!question.type || !['single', 'multiple', 'short_answer', 'discussion'].includes(question.type)) {
        // 尝试根据问题特征推断类型
        if (question.options && question.options.length > 0) {
            if (Array.isArray(question.correctAnswer)) {
                question.type = 'multiple';
            } else {
                question.type = 'single';
            }
        } else if (question.discussionPoints) {
            question.type = 'discussion';
        } else {
            question.type = 'short_answer';
        }
        
        console.log('修正题目类型:', question.type, '对于题目:', question.questionText);
    }
    
    // 创建题目容器
    var questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    
    var html = `
        <div class="question-header">
            <span class="question-number">${index + 1}</span>
            <div class="question-type">
                <span class="zh">${getQuestionTypeName(question.type)}</span>
                <span class="en">${getQuestionTypeNameEn(question.type)}</span>
            </div>
        </div>
        <div class="question-text">
            <p class="zh">${question.questionText}</p>
            <p class="en">${question.questionText}</p>
        </div>
    `;
    
    // 根据题型渲染不同内容
    if (question.type === 'single' || question.type === 'multiple') {
        // 选择题显示选项
        html += '<div class="question-options">';
        
        if (question.options && question.options.length > 0) {
            question.options.forEach(function(option) {
                html += `
                    <div class="option">
                        <span class="option-label">${option.id}.</span>
                        <p class="zh">${option.text}</p>
                        <p class="en">${option.text}</p>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        
        // 添加答案
        var correctAnswer = Array.isArray(question.correctAnswer) 
            ? question.correctAnswer.join(', ') 
            : question.correctAnswer || '';
            
        html += `
            <div class="question-answer">
                <div class="answer-label">
                    <span class="zh">答案：</span>
                    <span class="en">Answer: </span>
                </div>
                <div class="answer-content">${correctAnswer}</div>
            </div>
        `;
    } else if (question.type === 'short_answer') {
        // 简答题显示参考答案
        html += `
            <div class="question-answer">
                <div class="answer-label">
                    <span class="zh">参考答案：</span>
                    <span class="en">Reference Answer: </span>
                </div>
                <div class="answer-content">${question.correctAnswer || '无参考答案'}</div>
            </div>
        `;
    } else if (question.type === 'discussion') {
        // 讨论题显示讨论方向
        html += `
            <div class="question-answer">
                <div class="answer-label">
                    <span class="zh">讨论方向：</span>
                    <span class="en">Discussion Direction: </span>
                </div>
                <div class="answer-content">${question.discussionPoints || question.correctAnswer || '无讨论方向'}</div>
            </div>
        `;
    }
    
    // 添加解析
    if (question.explanation) {
        html += `
            <div class="question-explanation">
                <div class="explanation-label">
                    <span class="zh">解析：</span>
                    <span class="en">Explanation: </span>
                </div>
                <div class="explanation-content">${question.explanation}</div>
            </div>
        `;
    }
    
    // 设置题目内容
    questionDiv.innerHTML = html;
    
    // 添加到容器中
    container.appendChild(questionDiv);
}

/**
 * 更新题目列表表格
 */
function updateQuestionTable(questions) {
    // 查找问题表格
    var questionsTable = document.querySelector('.questions-table tbody');
    if (!questionsTable) {
        console.warn('未找到题目列表表格容器');
        return;
    }
    
    // 清空现有内容
    questionsTable.innerHTML = '';
    
    // 为每个问题创建一行
    questions.forEach(function(question, index) {
        var row = document.createElement('tr');
        
        // 确保题目类型有效
        var type = question.type || 'single';
        if (!['single', 'multiple', 'short_answer', 'discussion'].includes(type)) {
            type = 'single';
        }
        
        var typeClass = '';
        var typeTextZh = '';
        var typeTextEn = '';
        
        switch(type) {
            case 'single':
                typeClass = 'single';
                typeTextZh = '单选题';
                typeTextEn = 'Single Choice';
                break;
            case 'multiple':
                typeClass = 'multiple';
                typeTextZh = '多选题';
                typeTextEn = 'Multiple Choice';
                break;
            case 'short_answer':
                typeClass = 'short';
                typeTextZh = '简答题';
                typeTextEn = 'Short Answer';
                break;
            case 'discussion':
                typeClass = 'discussion';
                typeTextZh = '讨论题';
                typeTextEn = 'Discussion';
                break;
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <p class="zh">${question.questionText}</p>
                <p class="en">${question.questionText}</p>
            </td>
            <td>
                <span class="question-badge ${typeClass}">
                    <span class="zh">${typeTextZh}</span>
                    <span class="en">${typeTextEn}</span>
                </span>
            </td>
            <td class="table-actions">
                <button class="question-action-btn edit" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="question-action-btn delete" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        questionsTable.appendChild(row);
    });
}

/**
 * 获取题型的英文名称
 */
function getQuestionTypeNameEn(type) {
    switch (type) {
        case 'single': return 'Single Choice';
        case 'multiple': return 'Multiple Choice';
        case 'short_answer': return 'Short Answer';
        case 'discussion': return 'Discussion';
        default: return 'Question';
    }
}

/**
 * 添加结果样式
 */
function addResultStyles() {
    // 检查是否已添加样式
    if (document.getElementById('quiz-result-styles')) {
        return;
    }
    
    // 创建样式元素
    var styleEl = document.createElement('style');
    styleEl.id = 'quiz-result-styles';
    
    // 设置样式内容
    styleEl.textContent = `
        .quiz-result-wrapper {
            margin-top: 20px;
            position: relative;
        }
        .result-title {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #333;
            font-weight: bold;
            padding-left: 5px;
        }
        .quiz-result {
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 15px;
            background: #fff;
            max-height: 80vh;
            overflow-y: auto;
            scroll-behavior: smooth;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .questions-container {
            padding-right: 5px;
        }
        .question-item {
            margin-bottom: 30px;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 20px;
            background: white;
            position: relative;
        }
        .question-item:last-child {
            margin-bottom: 10px;
        }
        .question-header {
            display: flex;
            margin-bottom: 15px;
            align-items: center;
        }
        .question-number {
            font-weight: bold;
            margin-right: 10px;
            background: #e74c3c;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }
        .question-type {
            color: #666;
            background: #f0f0f0;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
        }
        .question-text {
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.6;
            color: #333;
        }
        .options-list {
            margin-bottom: 20px;
        }
        .option {
            margin-bottom: 10px;
            padding: 12px 15px;
            border-radius: 4px;
            border: 1px solid #eee;
            transition: background 0.2s;
        }
        .option:hover {
            background: #f9f9f9;
        }
        .option-label {
            display: inline-block;
            min-width: 20px;
            font-weight: 500;
            color: #555;
        }
        .option-text {
            margin-left: 5px;
        }
        .answer-section {
            margin-top: 15px;
            padding: 12px 15px;
            background: #ffebee;
            border-radius: 4px;
            display: flex;
            align-items: flex-start;
        }
        .answer-label {
            font-weight: bold;
            color: #e74c3c;
            margin-right: 5px;
            white-space: nowrap;
        }
        .answer-value {
            color: #333;
        }
        .explanation {
            margin-top: 15px;
            padding: 12px 15px;
            background: #f5f5f5;
            border-radius: 4px;
            border-left: 3px solid #ccc;
        }
        .explanation-label {
            font-weight: bold;
            color: #666;
            margin-bottom: 5px;
        }
        .explanation-content {
            line-height: 1.5;
            color: #555;
        }
        
        /* 滚动条样式 */
        .quiz-result::-webkit-scrollbar {
            width: 6px;
        }
        .quiz-result::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        .quiz-result::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 4px;
        }
        .quiz-result::-webkit-scrollbar-thumb:hover {
            background: #bbb;
        }
    `;
    
    // 添加到文档头部
    document.head.appendChild(styleEl);
}

/**
 * 绑定结果操作按钮事件（编辑、保存、重新生成等）
 */
function bindResultActionButtons() {
    var resultActionBtns = document.querySelectorAll('.result-action-btn');
    
    if (resultActionBtns.length === 0) {
        console.log('未找到结果操作按钮');
        return;
    }
    
    console.log('找到结果操作按钮数量:', resultActionBtns.length);
    
    // 遍历所有按钮
    resultActionBtns.forEach(function(btn) {
        // 移除旧的事件监听器，防止重复绑定
        btn.removeEventListener('click', handleResultButtonClick);
        
        // 添加新的事件监听器
        btn.addEventListener('click', handleResultButtonClick);
    });
}

/**
 * 处理结果操作按钮点击事件
 */
function handleResultButtonClick(event) {
    // 阻止默认行为和冒泡
    event.preventDefault();
    event.stopPropagation();
    
    // 获取按钮内容以确定按钮类型
    var buttonContent = this.innerHTML.toLowerCase();
    
    console.log('点击结果操作按钮:', buttonContent);
    
    // 根据按钮类型执行不同操作
    if (buttonContent.includes('fa-save') || buttonContent.includes('保存')) {
        console.log('点击了保存按钮');
        
        // 获取当前生成的题目
        var questions = window.allQuestions;
        if (!questions || questions.length === 0) {
            if (window.showNotification) {
                window.showNotification('没有题目可保存', 'error');
            }
            return false;
        }
        
        // 获取当前选择的章节ID
        var chapterSelect = document.querySelector('select[name="chapterId"]') || document.getElementById('chapterId') || document.getElementById('chapter-select');
        var chapterId = window.lastChapterId || 1; // 使用生成时记录的章节ID
        
        if (chapterSelect && chapterSelect.value) {
            chapterId = parseInt(chapterSelect.value);
            console.log('从选择器获取到章节ID:', chapterId);
        } else {
            console.log('未找到章节选择器或值为空，使用默认章节ID:', chapterId);
        }
        
        console.log('使用章节ID:', chapterId);
        
        // 正确格式化题目数据以适应后端要求
        var formattedQuestions = questions.map(function(q, index) {
            // 确保question字段有值
            var questionText = q.questionText || q.question || '未定义题目';
            
            // 选项处理 - 确保是字符串格式
            var options = '';
            if (q.options) {
                if (typeof q.options === 'string') {
                    options = q.options;
                } else if (Array.isArray(q.options)) {
                    options = JSON.stringify(q.options);
                }
            }
            
            // 答案处理 - 确保是字符串格式
            var answer = '';
            if (q.correctAnswer) {
                if (typeof q.correctAnswer === 'string') {
                    answer = q.correctAnswer;
                } else if (Array.isArray(q.correctAnswer)) {
                    answer = JSON.stringify(q.correctAnswer);
                }
            } else {
                answer = 'A'; // 默认答案
            }
            
            // 题型映射 - 将前端题型映射到数据库支持的枚举值
            var mappedType = 'choice'; // 默认为choice
            
            if (q.type) {
                switch (q.type.toLowerCase()) {
                    case 'single':
                        mappedType = 'single';
                        break;
                    case 'multiple':
                        mappedType = 'multiple';
                        break;
                    case 'short_answer':
                        mappedType = 'short';
                        break;
                    case 'discussion':
                        mappedType = 'discussion';
                        break;
                }
            } else {
                // 尝试根据题目特征推断类型
                if (Array.isArray(q.correctAnswer) && q.correctAnswer.length > 1) {
                    mappedType = 'multiple'; 
                } else if (q.options && Array.isArray(q.options) && q.options.length > 0) {
                    mappedType = 'single';
                } else if (q.discussionPoints) {
                    mappedType = 'discussion';
                } else if (!q.options || q.options.length === 0) {
                    mappedType = 'short';
                }
            }
            
            console.log(`题目#${index+1} 类型: ${q.type || '未指定'} -> 映射为: ${mappedType}`);
            
            // 创建题目对象，确保所有必要字段都存在
            return {
                type: mappedType,
                question: questionText,
                options: options,
                answer: answer,
                explanation: q.explanation || '',
                difficulty: q.difficulty || 'medium',
                order: index + 1
            };
        });
        
        // 输出完整题目数据用于调试
        console.log('格式化后的题目数据:', formattedQuestions);
        
        // 直接保存题目
        saveQuizQuestions(formattedQuestions, 1, chapterId);
    } 
    else if (buttonContent.includes('fa-edit') || buttonContent.includes('编辑')) {
        console.log('点击了编辑按钮');
        // 编辑功能实现
        if (window.showNotification) {
            window.showNotification('编辑功能尚未实现', 'info');
        }
    } 
    else if (buttonContent.includes('fa-redo') || buttonContent.includes('重新生成')) {
        console.log('点击了重新生成按钮');
        // 重新触发生成按钮点击
        var generateBtn = document.querySelector('.generate-btn');
        if (generateBtn) {
            generateBtn.click();
        } else {
            if (window.showNotification) {
                window.showNotification('未找到生成按钮', 'error');
            }
        }
    }
    
    return false;
}

/**
 * 保存题目到数据库的API调用
 */
function saveQuizQuestions(questions, quizId, chapterId) {
    // 显示网络请求状态
    console.log('正在发送保存请求到:', baseUrl + '/ai/quiz/save-questions');
    console.log('保存参数 - quizId:', quizId, 'chapterId:', chapterId);
    
    // 确保chapterId是有效的数字
    chapterId = parseInt(chapterId) || 1;
    
    // 显示保存中提示
    if (window.showNotification) {
        window.showNotification(`正在保存题目到章节 #${chapterId}...`, 'info');
    }
    
    // 创建请求数据 - 使用格式化后的题目数据
    const requestData = {
        questions: questions, // 使用完整的格式化后题目数据
        quizId: parseInt(quizId) || 1,
        chapterId: chapterId
    };
    
    console.log('请求数据 - quizId:', requestData.quizId, 'chapterId:', requestData.chapterId);
    console.log('题目数量:', questions.length);
    
    // 发送请求
    fetch(baseUrl + '/ai/quiz/save-questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(function(response) {
        console.log('收到服务器响应:', response.status, response.statusText);
        
        if (!response.ok) {
            // 详细记录错误响应
            return response.text().then(text => {
                let errorMsg = '保存失败: ' + response.status + ' ' + response.statusText;
                console.log('错误响应内容:', text);
                
                try {
                    // 尝试解析错误响应为JSON
                    const errorJson = JSON.parse(text);
                    console.log('解析的错误JSON:', errorJson);
                    if (errorJson.message) {
                        errorMsg += ' - ' + errorJson.message;
                    }
                } catch (e) {
                    // 如果不是JSON，直接使用文本
                    console.log('不是有效的JSON响应');
                    if (text) {
                        errorMsg += ' - ' + text;
                    }
                }
                
                console.error('API错误详情:', errorMsg);
                throw new Error(errorMsg);
            });
        }
        
        return response.json();
    })
    .then(function(data) {
        console.log('成功解析响应数据:', data);
        
        if (window.showNotification) {
            var successMsg = '题目保存成功!';
            if (data && data.data && data.data.savedCount) {
                successMsg += ` 共保存了${data.data.savedCount}道题目`;
            }
            window.showNotification(successMsg, 'success');
        }
    })
    .catch(function(error) {
        console.error('请求错误详细信息:', error);
        
        // 显示错误提示
        var errorMsg = '题目保存失败: ' + error.message;
        
        if (window.showNotification) {
            window.showNotification(errorMsg, 'error');
        }
    });
}