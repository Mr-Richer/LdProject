// Quiz加载器模块
(function() {
    'use strict';

    // 等待QuizGenerator加载完成
    function waitForQuizGenerator() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 10;
            const interval = 500;
            
            function checkQuizGenerator() {
                if (window.QuizGenerator && typeof window.QuizGenerator.init === 'function') {
                    console.log('QuizGenerator加载成功');
                    resolve(window.QuizGenerator);
                } else {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        reject(new Error('QuizGenerator加载超时'));
                    } else {
                        setTimeout(checkQuizGenerator, interval);
                    }
                }
            }
            
            checkQuizGenerator();
        });
    }

    // 页面加载完成后初始化Quiz组件
    document.addEventListener('DOMContentLoaded', function() {
        // 等待QuizGenerator加载完成后再初始化
        waitForQuizGenerator()
            .then(QuizGenerator => {
                QuizGenerator.init();
                console.log('Quiz Generator initialized');
                
                // 添加章节选择事件监听
                const chapterSelector = document.getElementById('chapter-select');
                if (chapterSelector) {
                    chapterSelector.addEventListener('change', function() {
                        const selectedChapterId = this.value;
                        if (selectedChapterId) {
                            loadChapterQuestions(selectedChapterId);
                        }
                    });
                    
                    // 如果章节选择器有值，立即加载题目
                    if (chapterSelector.value) {
                        console.log('初始自动加载章节题目:', chapterSelector.value);
                        loadChapterQuestions(chapterSelector.value);
                    }
                }
            })
            .catch(error => {
                console.error('QuizGenerator初始化失败:', error);
                showError('QuizGenerator初始化失败: ' + error.message);
            });
    });
    
    // 加载指定章节的题目
    function loadChapterQuestions(chapterId, forceRefresh = false) {
        if (!chapterId) {
            console.error('章节ID为空，无法加载题目');
            showError('请选择一个章节');
            return;
        }
        
        console.log('加载章节题目:', chapterId, forceRefresh ? '(强制刷新)' : '');
        
        // 添加全局变量跟踪当前章节ID，方便其他模块使用
        window.currentChapterId = chapterId;
        
        // 获取容器元素
        const quizContent = document.getElementById('quiz-content');
        if (!quizContent) {
            console.error('未找到题目容器元素');
            return;
        }
        
        // 显示加载状态
        showLoading(quizContent);
        
        // 获取API基础URL
        const apiBaseUrl = window.API_BASE_URL || 'http://localhost:3000';
        
        // 添加缓存破坏参数，确保始终获取最新数据
        const cacheBreaker = forceRefresh ? `&_t=${Date.now()}` : '';
        
        // 首选新创建的API端点
        const primaryEndpoints = [
            `/api/ai/quiz/questions/chapter/${chapterId}?fresh=1${cacheBreaker}`
        ];
        
        // 创建备用的API端点数组，包含多种可能的路径格式
        const fallbackEndpoints = [
            `/api/quiz/questions/chapter/${chapterId}?fresh=1${cacheBreaker}`,
            `/quiz/questions/chapter/${chapterId}?fresh=1${cacheBreaker}`,
            `/questions/chapter/${chapterId}?fresh=1${cacheBreaker}`,
            `/api/v1/questions/chapter/${chapterId}?fresh=1${cacheBreaker}`,
            `/api/questions/chapter/${chapterId}?fresh=1${cacheBreaker}`,
            `/api/quiz/question/chapter/${chapterId}?fresh=1${cacheBreaker}`, // 单数形式
            `/api/ai/quiz/question/chapter/${chapterId}?fresh=1${cacheBreaker}`, // 单数形式
            `/question/chapter/${chapterId}?fresh=1${cacheBreaker}`, // 单数形式
            `/api/quiz/questions/by-chapter/${chapterId}?fresh=1${cacheBreaker}`, // 另一种路径格式
            `/api/ai/quiz/questions/by-chapter/${chapterId}?fresh=1${cacheBreaker}`, // 另一种路径格式
            `/api/quiz/chapters/${chapterId}/questions?fresh=1${cacheBreaker}` // RESTful风格路径
        ];
        
        // 如果之前有成功的端点，优先使用相同路径模式的获取端点
        if (window.successfulDeleteEndpoint) {
            const successPath = window.successfulDeleteEndpoint.split('/').slice(0, -1).join('/');
            const priorityEndpoint = `${successPath}/chapter/${chapterId}?fresh=1${cacheBreaker}`;
            // 避免重复添加已存在的端点
            if (!primaryEndpoints.includes(priorityEndpoint) && !fallbackEndpoints.includes(priorityEndpoint)) {
                primaryEndpoints.push(priorityEndpoint);
                console.log('优先尝试基于成功删除端点的路径:', priorityEndpoint);
            }
        }
        
        if (window.successfulSaveEndpoint) {
            // 从保存端点推断获取端点
            const pathParts = window.successfulSaveEndpoint.split('/');
            // 替换最后一个路径段
            pathParts[pathParts.length - 1] = `chapter/${chapterId}?fresh=1${cacheBreaker}`;
            const priorityEndpoint = pathParts.join('/');
            // 避免重复添加已存在的端点
            if (!primaryEndpoints.includes(priorityEndpoint) && !fallbackEndpoints.includes(priorityEndpoint)) {
                primaryEndpoints.push(priorityEndpoint);
                console.log('优先尝试基于成功保存端点的路径:', priorityEndpoint);
            }
        }
        
        console.log('将优先尝试以下API端点:', primaryEndpoints);
        console.log('备用API端点:', fallbackEndpoints);
        
        // 尝试第一个端点
        tryFetchWithEndpoint(0, true);
        
        // 递归尝试不同的端点
        function tryFetchWithEndpoint(endpointIndex, useNewEndpoints = true) {
            const endpoints = useNewEndpoints ? primaryEndpoints : fallbackEndpoints;
            
            if (endpointIndex >= endpoints.length) {
                // 如果所有新端点都失败，但还未尝试旧端点
                if (useNewEndpoints) {
                    console.log('所有新端点均失败，尝试备用端点');
                    return tryFetchWithEndpoint(0, false);
                }
                
                // 所有端点都失败，显示无数据（不再尝试从本地备份恢复）
                console.error('所有API端点均尝试失败');
                removeLoading(quizContent);
                
                // 渲染空的题目表格，显示无数据
                if (window.QuizGenerator && typeof window.QuizGenerator.renderQuestionsTable === 'function') {
                    window.QuizGenerator.renderQuestionsTable([], quizContent);
                    showWarning(quizContent, '该章节暂无题目数据', false);
                } else {
                    showError('无法获取题目数据，请检查网络连接', () => loadChapterQuestions(chapterId, true));
                }
                return;
            }
            
            const endpoint = endpoints[endpointIndex];
            console.log(`尝试获取端点 ${useNewEndpoints ? '(优先)' : '(备用)'} (${endpointIndex+1}/${endpoints.length}): ${apiBaseUrl}${endpoint}`);
            
            // 发送请求
            fetch(`${apiBaseUrl}${endpoint}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(`端点 ${endpoint} 响应状态:`, response.status);
                
                if (response.ok) {
                    // 请求成功，记录成功的端点
                    window.successfulQuestionEndpoint = endpoint;
                    return response.json();
                }
                
                if ((response.status === 404 || response.status === 400) && endpointIndex < endpoints.length - 1) {
                    // 如果是404或400且还有其他端点可尝试，继续尝试下一个
                    console.log(`端点 ${endpoint} 返回${response.status}，尝试下一个端点`);
                    return tryFetchWithEndpoint(endpointIndex + 1, useNewEndpoints);
                }
                
                // 其他错误状态
                throw new Error(`获取题目失败 (${response.status}): ${response.statusText}`);
            })
            .then(result => {
                if (!result) return; // 如果已转到下一个端点，跳过后续处理
                
                // 移除加载状态
                removeLoading(quizContent);
                
                // 处理各种可能的数据结构
                let questions = [];
                try {
                    // 尝试多种可能的数据结构
                    if (result && result.code === 200 && Array.isArray(result.data)) {
                        // 标准响应格式 {code: 200, data: [...]}
                        questions = result.data;
                        console.log(`成功加载到${questions.length}道题目`);
                    } else if (result && Array.isArray(result)) {
                        // 直接返回数组的情况
                        questions = result;
                        console.log(`成功加载到${questions.length}道题目(直接数组格式)`);
                    } else if (result && result.questions && Array.isArray(result.questions)) {
                        // 嵌套在questions字段中
                        questions = result.questions;
                        console.log(`成功加载到${questions.length}道题目(questions字段)`);
                    } else if (result && result.data && Array.isArray(result.data.questions)) {
                        // 双层嵌套
                        questions = result.data.questions;
                        console.log(`成功加载到${questions.length}道题目(data.questions字段)`);
                    } else if (result && result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
                        // 对象形式的数据，转为数组
                        questions = Object.values(result.data);
                        console.log(`成功加载到${questions.length}道题目(对象转数组)`);
                    } else {
                        console.warn('API返回数据格式不识别:', result);
                        showWarning(quizContent, '获取数据格式异常，请联系管理员');
                    }
                    
                    // 过滤掉已标记为删除的题目
                    const filteredQuestions = questions.filter(q => {
                        // 检查各种可能的软删除标记字段
                        if (q.isDeleted === 1 || q.is_deleted === 1 || q.deleted === true || q.deleted === 1) {
                            console.log('过滤掉已删除题目:', q.id);
                            return false;
                        }
                        return true;
                    });
                    
                    console.log(`过滤后剩余${filteredQuestions.length}道题目`);
                    questions = filteredQuestions;
                    
                    // 检查并修复题目数据结构，映射字段名与数据库一致
                    questions = questions.map(q => {
                        const mappedQuestion = {
                            // ID映射
                            id: q.id || q._id || q.questionId || '',
                            
                            // 题目内容映射
                            question: q.question || q.questionText || q.content || '',
                            
                            // 题目类型映射
                            type: q.type || q.questionType || 'choice',
                            
                            // 选项映射并确保为数组
                            options: parseOptions(q.options),
                            
                            // 答案映射
                            answer: q.answer || q.correctAnswer || '',
                            
                            // 解析映射
                            explanation: q.explanation || '',
                            
                            // 章节ID映射
                            chapterId: q.chapterId || q.chapterID || q.chapter_id || chapterId,
                            
                            // 难度映射
                            difficulty: q.difficulty || 'medium',
                            
                            // 排序映射
                            order: q.order || 0,
                            
                            // 保留原始数据，以防需要
                            _original: q
                        };
                        
                        return mappedQuestion;
                    });
                    
                    // 按照order字段排序
                    questions.sort((a, b) => {
                        const orderA = a.order || 0;
                        const orderB = b.order || 0;
                        return orderA - orderB;
                    });
                } catch (error) {
                    console.error('处理题目数据时出错:', error);
                    showWarning(quizContent, '处理题目数据时出错', true);
                }
                
                // 如果没有找到题目，直接显示无数据（不再使用本地备份）
                if (questions.length === 0) {
                    console.log('未找到题目，显示无数据提示');
                    showWarning(quizContent, '该章节暂无题目', false);
                }
                
                // 渲染题目列表
                if (window.QuizGenerator && typeof window.QuizGenerator.renderQuestionsTable === 'function') {
                    window.QuizGenerator.renderQuestionsTable(questions, quizContent);
                } else {
                    throw new Error('QuizGenerator.renderQuestionsTable未定义');
                }
            })
            .catch(error => {
                if (endpointIndex < endpoints.length - 1) {
                    // 如果还有其他端点可尝试，继续尝试下一个
                    console.log(`端点 ${endpoint} 失败:`, error.message, '尝试下一个端点');
                    tryFetchWithEndpoint(endpointIndex + 1, useNewEndpoints);
                } else if (useNewEndpoints) {
                    // 如果所有新端点都失败，尝试备用端点
                    console.log('所有新端点均失败，尝试备用端点');
                    tryFetchWithEndpoint(0, false);
                } else {
                    // 所有端点都失败，显示无数据（不再使用本地备份）
                    console.error('所有获取端点均失败:', error);
                    removeLoading(quizContent);
                    
                    // 显示无数据
                    if (window.QuizGenerator && typeof window.QuizGenerator.renderQuestionsTable === 'function') {
                        window.QuizGenerator.renderQuestionsTable([], quizContent);
                        showWarning(quizContent, '无法加载题目数据', false);
                    } else {
                        // 显示错误信息并提供重试按钮
                        showError(error.message, () => loadChapterQuestions(chapterId, true));
                    }
                }
            });
        }
    }
    
    // 从本地备份获取章节题目
    function getBackupQuestions(chapterId) {
        try {
            // 首先尝试从API恢复
            if (window.API && window.API.quiz && typeof window.API.quiz.restoreFromLocalBackup === 'function') {
                const backupQuestions = window.API.quiz.restoreFromLocalBackup();
                if (backupQuestions && Array.isArray(backupQuestions) && backupQuestions.length > 0) {
                    // 过滤出当前章节的题目
                    const filtered = backupQuestions.filter(q => 
                        q.chapterId == chapterId || 
                        q.chapterID == chapterId || 
                        q.chapter_id == chapterId
                    );
                    
                    if (filtered.length > 0) {
                        return filtered;
                    }
                }
            }
            
            // 如果API不可用，直接从localStorage获取
            if (window.localStorage) {
                const backupKey = `quiz_backup_chapter_${chapterId}`;
                const storedData = window.localStorage.getItem(backupKey);
                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);
                        if (Array.isArray(parsedData) && parsedData.length > 0) {
                            return parsedData;
                        }
                    } catch (e) {
                        console.error('解析本地备份数据失败:', e);
                    }
                }
            }
        } catch (error) {
            console.error('获取本地备份失败:', error);
        }
        
        // 如果所有方法都失败，返回空数组
        return [];
    }
    
    // 显示加载状态
    function showLoading(container) {
        // 清除旧数据
        const oldTable = container.querySelector('.quiz-questions-table');
        if (oldTable) {
            container.removeChild(oldTable);
        }
        
        // 移除已有的加载或错误消息
        removeMessages(container);
        
        // 创建并显示加载指示器
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-message';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <p>
                <span class="zh">正在加载题目数据...</span>
                <span class="en">Loading questions...</span>
            </p>
        `;
        
        container.appendChild(loadingDiv);
        
        // 添加加载样式
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .loading-message {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
                border-radius: 8px;
                background-color: #f5f5f5;
            }
            .loading-spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
                margin-bottom: 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleEl);
    }
                
                // 移除加载状态
    function removeLoading(container) {
        const loadingDiv = container.querySelector('.loading-message');
        if (loadingDiv) {
            container.removeChild(loadingDiv);
        }
    }
    
    // 移除所有消息元素
    function removeMessages(container) {
        const messages = container.querySelectorAll('.loading-message, .error-message, .warning-message');
        messages.forEach(el => el.remove());
    }
    
    // 显示错误消息
    function showError(message, retryCallback) {
        const quizContent = document.getElementById('quiz-content');
        if (!quizContent) return;
        
        // 移除已有的错误消息
        const existingError = quizContent.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // 创建错误消息元素
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.innerHTML = `
            <div class="error-icon">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="error-content">
                <p class="error-title">
                    <span class="zh">加载失败</span>
                    <span class="en">Loading Failed</span>
                </p>
                <p class="error-text">${message}</p>
            </div>
            ${retryCallback ? `
            <button class="retry-button">
                <i class="fas fa-sync-alt"></i>
                        <span class="zh">重试</span>
                        <span class="en">Retry</span>
                    </button>
            ` : ''}
        `;
        
        // 添加错误样式
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .error-message {
                display: flex;
                align-items: center;
                padding: 15px;
                margin: 20px 0;
                border-radius: 8px;
                background-color: #ffebee;
                border-left: 5px solid #f44336;
                color: #d32f2f;
            }
            .error-icon {
                font-size: 24px;
                margin-right: 15px;
                color: #f44336;
            }
            .error-content {
                flex: 1;
            }
            .error-title {
                font-weight: bold;
                margin-bottom: 5px;
            }
            .error-text {
                margin: 0;
                color: #666;
            }
            .retry-button {
                padding: 8px 15px;
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                transition: background-color 0.3s;
            }
            .retry-button:hover {
                background-color: #d32f2f;
            }
            .retry-button i {
                margin-right: 5px;
            }
            .warning-message {
                display: flex;
                align-items: center;
                padding: 15px;
                margin: 10px 0;
                border-radius: 8px;
                background-color: #fff8e1;
                border-left: 5px solid #ffc107;
                color: #ff8f00;
            }
            .warning-icon {
                font-size: 24px;
                margin-right: 15px;
                color: #ffc107;
            }
            .warning-content {
                flex: 1;
            }
            .close-warning {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 16px;
                padding: 0 5px;
            }
            .close-warning:hover {
                color: #666;
            }
        `;
        document.head.appendChild(styleEl);
        
                quizContent.appendChild(errorDiv);
                
                // 添加重试按钮事件
        if (retryCallback) {
            const retryBtn = errorDiv.querySelector('.retry-button');
                if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                        errorDiv.remove();
                    retryCallback();
                });
            }
        }
    }
    
    // 显示警告消息
    function showWarning(container, message, isDismissible = false) {
        // 移除已有的警告消息
        const existingWarning = container.querySelector('.warning-message');
        if (existingWarning) {
            existingWarning.remove();
        }
        
        // 创建警告消息元素
        const warningDiv = document.createElement('div');
        warningDiv.className = 'warning-message';
        warningDiv.innerHTML = `
            <div class="warning-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="warning-content">
                <p>${message}</p>
            </div>
            ${isDismissible ? `<button class="close-warning">&times;</button>` : ''}
        `;
        
        container.appendChild(warningDiv);
        
        // 添加关闭按钮事件
        if (isDismissible) {
            const closeBtn = warningDiv.querySelector('.close-warning');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    warningDiv.remove();
                });
            }
        }
        
        // 自动关闭
        if (isDismissible) {
            setTimeout(() => {
                if (warningDiv.parentNode) {
                    warningDiv.remove();
                }
            }, 5000);
        }
    }

    // 将函数暴露到全局作用域
    window.loadChapterQuestions = loadChapterQuestions;

    /**
     * 解析选项数据，确保为数组格式
     * @param {*} options - 选项数据，可能是字符串、数组或对象
     * @returns {Array} - 格式化后的选项数组
     */
    function parseOptions(options) {
        if (!options) {
            return [];
        }
        
        // 如果是字符串，尝试解析为JSON
        if (typeof options === 'string') {
            try {
                const parsedOptions = JSON.parse(options);
                return normalizeOptions(parsedOptions);
            } catch (e) {
                console.warn('选项解析失败:', e);
                return [];
            }
        }
        
        // 如果已经是数组
        if (Array.isArray(options)) {
            return normalizeOptions(options);
        }
        
        // 如果是对象，转换为数组
        if (typeof options === 'object') {
            try {
                const optionsArray = Object.values(options);
                return normalizeOptions(optionsArray);
            } catch (e) {
                console.warn('选项对象转数组失败:', e);
                return [];
            }
        }
        
        return [];
    }

    /**
     * 标准化选项格式
     * @param {Array} options - 选项数组
     * @returns {Array} - 标准化后的选项数组
     */
    function normalizeOptions(options) {
        if (!Array.isArray(options)) {
            return [];
        }
        
        return options.map((option, index) => {
            // 如果选项是字符串，转换为对象格式
            if (typeof option === 'string') {
                return {
                    id: String.fromCharCode(65 + index), // A, B, C, ...
                    text: option
                };
            }
            
            // 如果选项是对象，确保包含id和text字段
            if (typeof option === 'object') {
                return {
                    id: option.id || option.value || String.fromCharCode(65 + index),
                    text: option.text || option.label || option.content || ''
                };
            }
            
            return {
                id: String.fromCharCode(65 + index),
                text: String(option)
            };
        });
    }
})(); 