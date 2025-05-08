/**
 * Quiz API 初始化模块
 * 负责创建和初始化Quiz API对象，连接真实的后端API
 */

// 定义API初始化状态标志
window.API_INITIALIZED = false;

// 确保API_BASE_URL已定义
if (!window.API_BASE_URL) {
    // 从APP_CONFIG获取API_BASE_URL
    window.API_BASE_URL = window.APP_CONFIG ? window.APP_CONFIG.API_BASE_URL : window.location.origin;
}

// 初始化Quiz API
function initQuizAPI() {
    console.log('初始化Quiz API模块...');
    
    // 始终禁用模拟数据
    window.useMockApi = false;
    window.isOfflineMode = false;
    
    try {
        // 如果window.API不存在，则创建一个空对象
        if (!window.API) {
            console.log('创建全局API对象');
            window.API = {};
        }
        
        // 如果window.API.quiz不存在，则创建一个空对象
        if (!window.API.quiz) {
            console.log('创建Quiz API对象');
            window.API.quiz = {};
        }
        
        // 添加获取所有题目的方法
        if (typeof window.API.quiz.getQuestions !== 'function') {
            window.API.quiz.getQuestions = function() {
                console.log('获取所有题目');
                // 返回Promise，连接到真实后端
                return fetch(`${window.API_BASE_URL}/api/ai/quiz/questions`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('获取题目失败: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // 检查API响应格式
                        if (data && data.code === 200 && data.data) {
                            return data.data;
                        }
                        return data; // 如果API直接返回数据，不包装在data字段中
                    })
                    .catch(error => {
                        console.error('获取题目请求失败:', error);
                        // 显示错误提示
                        if (typeof window.showNotification === 'function') {
                            window.showNotification('连接API失败: ' + error.message, 'error');
                        }
                        // 在请求失败时返回空数组，而不是拒绝Promise
                        return [];
                    });
            };
        }
        
        // 添加获取指定章节题目的方法
        if (typeof window.API.quiz.getQuestionsByChapter !== 'function') {
            window.API.quiz.getQuestionsByChapter = function(chapterId) {
                console.log(`获取章节${chapterId}的题目`);
                // 返回Promise，连接到真实后端
                return fetch(`${window.API_BASE_URL}/api/ai/quiz/questions/chapter/${chapterId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('获取题目失败: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // 检查API响应格式
                        if (data && data.code === 200 && data.data) {
                            return data.data;
                        } else if (data && Array.isArray(data)) {
                            // 如果直接返回数组，不包装在data字段中
                            return data;
                        }
                        // 如果没有数据，返回空数组
                        console.warn('API响应没有data字段或格式异常:', data);
                        return [];
                    })
                    .catch(error => {
                        console.error(`获取章节${chapterId}题目请求失败:`, error);
                        // 显示错误提示
                        if (typeof window.showNotification === 'function') {
                            window.showNotification(`获取章节${chapterId}题目失败: ${error.message}`, 'error');
                        }
                        // 在请求失败时返回空数组，而不是拒绝Promise
                        return [];
                    });
            };
        }
        
        // 添加删除题目的方法
        if (typeof window.API.quiz.deleteQuestion !== 'function') {
            window.API.quiz.deleteQuestion = function(questionId) {
                console.log(`删除题目${questionId}`);
                
                if (!questionId || questionId === 'undefined') {
                    console.error('删除题目失败: 无效的题目ID');
                    return Promise.reject(new Error('无效的题目ID'));
                }
                
                // 构建正确的API请求URL
                const apiUrl = `${window.API_BASE_URL}/api/ai/quiz/questions/${questionId}`;
                console.log('删除题目API URL:', apiUrl);
                
                // 返回Promise，连接到真实后端
                return fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error(`题目不存在(ID: ${questionId})`);
                        }
                        throw new Error(`删除题目失败 (${response.status}): ${response.statusText}`);
                    }
                    
                    // 尝试解析JSON响应，如果不是JSON格式，返回成功状态
                    return response.json().catch(() => ({ success: true }));
                })
                .then(data => {
                    // 检查API响应格式
                    if (data && (data.code === 200 || data.success)) {
                        console.log('题目删除成功响应:', data);
                        return true;
                    }
                    
                    if (data && data.message) {
                        throw new Error(data.message);
                    }
                    
                    return false;
                })
                .catch(error => {
                    console.error(`删除题目${questionId}请求失败:`, error);
                    // 显示错误提示
                    if (typeof window.showNotification === 'function') {
                        window.showNotification(`删除题目失败: ${error.message}`, 'error');
                    }
                    throw error; // 删除失败时，需要将错误传递给调用者
                });
            };
        }
        
        // 添加保存题目的方法
        if (typeof window.API.quiz.saveQuestions !== 'function') {
            window.API.quiz.saveQuestions = async function(questions, quizId, chapterId) {
                console.log(`保存${questions.length}道题目，测验ID=${quizId}，章节ID=${chapterId}`);
                
                // 构建请求数据
                const requestData = {
                    questions: questions,
                    quizId: parseInt(quizId) || null,
                    chapterId: parseInt(chapterId)
                };
                
                console.log('发送请求数据:', requestData);
                
                try {
                    // 发送请求到正确的API路径
                    const response = await fetch(`${window.API_BASE_URL}/api/ai/quiz/save-questions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(requestData)
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    if (data && data.code === 200) {
                        console.log('题目保存成功:', data);
                        return data;
                    }
                    
                    throw new Error(data.message || '服务器响应格式错误');
                } catch (error) {
                    console.error('保存题目请求失败:', error);
                    // 显示错误提示
                    if (typeof window.showNotification === 'function') {
                        window.showNotification(`保存题目失败: ${error.message}`, 'error');
                    }
                    throw error;
                }
            };
        }

        // 添加创建本地备份方法 (仅用于备份，不用于模拟数据)
        if (typeof window.API.quiz.createLocalBackup !== 'function') {
            window.API.quiz.createLocalBackup = function(questions) {
                try {
                    localStorage.setItem('quiz_questions_backup', JSON.stringify(questions));
                    return true;
                } catch (error) {
                    console.error('创建本地备份失败:', error);
                    return false;
                }
            };
        }

        // 添加从本地备份恢复数据的方法 (仅用于紧急情况)
        if (typeof window.API.quiz.restoreFromLocalBackup !== 'function') {
            window.API.quiz.restoreFromLocalBackup = function() {
                try {
                    const backup = localStorage.getItem('quiz_questions_backup');
                    if (!backup) return [];
                    return JSON.parse(backup);
                } catch (error) {
                    console.error('从本地备份恢复失败:', error);
                    return [];
                }
            };
        }
        
        // 设置API初始化标志
        window.API_INITIALIZED = true;
        console.log('Quiz API初始化完成');
        
        // 触发自定义事件，通知其他模块API已初始化完成
        const apiReadyEvent = new CustomEvent('api:ready', { detail: { api: window.API } });
        document.dispatchEvent(apiReadyEvent);
        
        return true;
    } catch (error) {
        console.error('初始化Quiz API时出错:', error);
        // 显示错误提示
        if (typeof window.showNotification === 'function') {
            window.showNotification('初始化API失败: ' + error.message, 'error');
        }
        return false;
    }
}

// 提供一个检查API是否准备好的方法
function isApiReady() {
    return window.API && window.API.quiz && typeof window.API.quiz.getQuestionsByChapter === 'function';
}

// 提供一个等待API准备好的方法
function waitForApi(timeout = 5000) {
    return new Promise((resolve, reject) => {
        // 如果API已经准备好，立即解析
        if (isApiReady()) {
            return resolve(window.API);
        }
        
        // 设置超时
        const timeoutId = setTimeout(() => {
            // 移除事件监听器
            document.removeEventListener('api:ready', apiReadyHandler);
            // 尝试再次初始化API
            if (!isApiReady()) {
                const result = initQuizAPI();
                if (result && isApiReady()) {
                    return resolve(window.API);
                }
                return reject(new Error('API初始化超时，请检查后端服务是否正常运行。'));
            }
            resolve(window.API);
        }, timeout);
        
        // 监听API就绪事件
        const apiReadyHandler = (event) => {
            clearTimeout(timeoutId);
            document.removeEventListener('api:ready', apiReadyHandler);
            resolve(event.detail.api);
        };
        
        document.addEventListener('api:ready', apiReadyHandler);
    });
}

// 导出API工具函数
window.isApiReady = isApiReady;
window.waitForApi = waitForApi;
window.initQuizAPI = initQuizAPI;

// 在DOM加载完成后初始化API
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuizAPI);
} else {
    // 立即初始化API
    initQuizAPI();
}

// 确保在页面完全加载后API是初始化的
window.addEventListener('load', function() {
    if (!window.API_INITIALIZED) {
        console.log('页面加载完成，但API尚未初始化，尝试重新初始化');
        initQuizAPI();
    }
});

// 立即执行初始化 - 增加可靠性
(function() {
    if (!window.API_INITIALIZED) {
        console.log('立即执行API初始化');
        initQuizAPI();
    }
})();