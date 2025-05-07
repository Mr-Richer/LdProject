// 语言模型聊天界面核心逻辑

// API配置
const apiConfig = {
    openrouter: {
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        modelId: 'deepseek/deepseek-chat-v3-0324:free',
        apiKey: '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'
    },
    chutes: {
        apiUrl: 'https://llm.chutes.ai/v1/chat/completions',
        modelId: 'deepseek-ai/DeepSeek-V3-0324',
        apiKey: 'cpk_4e6c011db10249f0bdc7b8f8df40cf9f.096169649b4d5c67b42bc5b83b11e149.KcltcWhOps9qvpqYOyoiSjG1JQOAkl33'
    },
    claude: {
        apiUrl: 'https://api.anthropic.com/v1/messages',
        modelId: 'claude-3-opus-20240229',
        apiKey: 'sk-ant-api03-...' // 请替换为您的Claude API密钥
    },
    gemini: {
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        apiKey: '...' // 请替换为您的Gemini API密钥
    },
    custom: {
        apiUrl: '', // 将在界面填写
        modelId: '', // 将在界面填写
        apiKey: '' // 将在界面填写
    }
};

// 全局变量
let isWaitingForResponse = false;
let isStreaming = false;
let chatHistory = [];
let abortController = null;

// DOM元素引用
let messagesContainer;
let messageInput;
let sendButton;
let typingIndicator;
let streamToggle;
let customApiForm;

// 初始化聊天界面
function initChat() {
    // 获取DOM元素
    messagesContainer = document.getElementById('messages');
    messageInput = document.getElementById('message-input');
    sendButton = document.getElementById('send-button');
    typingIndicator = document.getElementById('typing-indicator');
    streamToggle = document.getElementById('stream-toggle');
    customApiForm = document.getElementById('custom-api-form');
    
    // 设置初始时间
    updateInitialMessageTime();
    
    // 自动调整文本区域高度
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight < 150 ? this.scrollHeight : 150) + 'px';
    });
    
    // 切换流式响应
    streamToggle.addEventListener('change', function() {
        isStreaming = this.checked;
    });
    
    // 处理自定义API的显示/隐藏
    const modelOptions = document.querySelectorAll('input[name="model"]');
    modelOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'custom') {
                customApiForm.style.display = 'block';
            } else {
                customApiForm.style.display = 'none';
            }
        });
    });
    
    // 如果之前选择了自定义API，则显示表单
    if (document.querySelector('input[name="model"]:checked').value === 'custom') {
        customApiForm.style.display = 'block';
    }
    
    // 初始聚焦到输入框
    messageInput.focus();
    
    // 添加清除对话按钮事件
    const clearChatBtn = document.getElementById('clear-chat-btn');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }
    
    // 添加停止生成按钮事件
    const stopGenerationBtn = document.getElementById('stop-generation-btn');
    if (stopGenerationBtn) {
        stopGenerationBtn.addEventListener('click', stopGeneration);
    }
}

// 更新初始欢迎消息的时间
function updateInitialMessageTime() {
    const initialTimeDiv = document.querySelector('.bot-message .message-time');
    if (initialTimeDiv) {
        const hours = new Date().getHours();
        const minutes = String(new Date().getMinutes()).padStart(2, '0');
        initialTimeDiv.textContent = `今天 ${hours}:${minutes}`;
    }
}

// 添加消息到聊天界面
function addMessage(content, isUser) {
    const message = document.createElement('div');
    message.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    message.innerHTML = content;
    
    // 添加时间
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    const hours = new Date().getHours();
    const minutes = String(new Date().getMinutes()).padStart(2, '0');
    timeDiv.textContent = `今天 ${hours}:${minutes}`;
    message.appendChild(timeDiv);
    
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // 添加到聊天历史
    chatHistory.push({
        role: isUser ? 'user' : 'assistant',
        content: content
    });
    
    return message;
}

// 按Enter发送消息
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// 发送消息
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isWaitingForResponse) return;
    
    // 显示用户消息
    addMessage(message, true);
    
    // 清空输入框并重置高度
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // 显示正在输入指示器
    typingIndicator.style.display = 'block';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // 禁用发送按钮
    isWaitingForResponse = true;
    sendButton.disabled = true;
    
    // 显示停止生成按钮
    const stopBtn = document.getElementById('stop-generation-btn');
    if (stopBtn) stopBtn.style.display = 'inline-block';
    
    // 创建AbortController实例
    abortController = new AbortController();
    
    try {
        const selectedModel = document.querySelector('input[name="model"]:checked').value;
        
        // 如果是自定义API，则更新配置
        if (selectedModel === 'custom') {
            updateCustomApiConfig();
        }
        
        if (isStreaming) {
            await sendStreamingRequest(message, selectedModel);
        } else {
            await sendStandardRequest(message, selectedModel);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        
        // 检查是否是用户主动取消的请求
        if (error.name === 'AbortError') {
            console.log('请求被用户取消');
            
            // 添加取消通知
            const cancelDiv = document.createElement('div');
            cancelDiv.className = 'status-message info';
            cancelDiv.textContent = '已停止生成';
            messagesContainer.appendChild(cancelDiv);
            
            setTimeout(() => {
                cancelDiv.remove();
            }, 3000);
        } else {
            // 显示错误消息
            const errorDiv = document.createElement('div');
            errorDiv.className = 'status-message error';
            
            // 修复[object Object]错误显示
            let errorText = error.message;
            if (errorText.includes('[object Object]')) {
                errorText = '请求失败，服务器返回了无效的错误格式';
            }
            errorDiv.textContent = errorText;
            
            messagesContainer.appendChild(errorDiv);
            
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    } finally {
        // 隐藏正在输入指示器和停止按钮
        typingIndicator.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'none';
        
        isWaitingForResponse = false;
        sendButton.disabled = false;
        messageInput.focus();
        abortController = null;
    }
}

// 更新自定义API配置
function updateCustomApiConfig() {
    const customUrl = document.getElementById('custom-api-url').value.trim();
    const customModel = document.getElementById('custom-model-id').value.trim();
    const customKey = document.getElementById('custom-api-key').value.trim();
    
    if (customUrl) {
        apiConfig.custom.apiUrl = customUrl;
    }
    
    if (customModel) {
        apiConfig.custom.modelId = customModel;
    }
    
    if (customKey) {
        apiConfig.custom.apiKey = customKey;
    }
}

// 停止生成
function stopGeneration() {
    if (abortController) {
        abortController.abort();
    }
}

// 发送标准请求
async function sendStandardRequest(message, modelType) {
    const config = apiConfig[modelType];
    const apiUrl = modelType === 'chutes' ? config.apiUrl + '#' : config.apiUrl;
    
    // 获取最近的聊天历史用于上下文
    const recentMessages = getRecentMessages();
    
    // 根据不同模型准备请求体
    let requestBody;
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
    };
    
    switch (modelType) {
        case 'claude':
            requestBody = {
                model: config.modelId,
                messages: recentMessages,
                max_tokens: 2000
            };
            break;
        case 'gemini':
            requestBody = {
                contents: recentMessages.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : msg.role,
                    parts: [{ text: msg.content }]
                })),
                generationConfig: {
                    maxOutputTokens: 2000
                }
            };
            headers = {
                'Content-Type': 'application/json',
                'x-goog-api-key': config.apiKey
            };
            break;
        default:
            requestBody = {
                model: config.modelId,
                messages: recentMessages
            };
    }
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        signal: abortController.signal
    });
    
    if (!response.ok) {
        let errorMessage = `请求失败: 状态码 ${response.status}`;
        try {
            const errorData = await response.json();
            if (typeof errorData.error === 'object') {
                errorMessage = JSON.stringify(errorData.error);
            } else {
                errorMessage = errorData.message || errorData.error || errorMessage;
            }
        } catch (e) {
            // 保持默认错误消息
        }
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    let botResponse = '';
    
    // 根据不同API处理响应
    switch (modelType) {
        case 'claude':
            botResponse = data.content[0].text;
            break;
        case 'gemini':
            botResponse = data.candidates[0].content.parts[0].text;
            break;
        default:
            if (data.choices && data.choices.length > 0) {
                botResponse = data.choices[0].message.content;
            } else {
                throw new Error('没有接收到有效的响应');
            }
    }
    
    addMessage(botResponse, false);
    
    // 记录使用的令牌数
    if (data.usage) {
        console.log(`令牌使用: 输入=${data.usage.prompt_tokens}, 输出=${data.usage.completion_tokens}, 总计=${data.usage.total_tokens}`);
    }
}

// 发送流式请求
async function sendStreamingRequest(message, modelType) {
    const config = apiConfig[modelType];
    const apiUrl = modelType === 'chutes' ? config.apiUrl + '#' : config.apiUrl;
    
    // 获取最近的聊天历史用于上下文
    const recentMessages = getRecentMessages();
    
    // 根据不同模型准备请求体
    let requestBody;
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
    };
    
    switch (modelType) {
        case 'claude':
            requestBody = {
                model: config.modelId,
                messages: recentMessages,
                max_tokens: 2000,
                stream: true
            };
            break;
        case 'gemini':
            requestBody = {
                contents: recentMessages.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : msg.role,
                    parts: [{ text: msg.content }]
                })),
                generationConfig: {
                    maxOutputTokens: 2000
                },
                stream: true
            };
            headers = {
                'Content-Type': 'application/json',
                'x-goog-api-key': config.apiKey
            };
            break;
        default:
            requestBody = {
                model: config.modelId,
                messages: recentMessages,
                stream: true
            };
    }
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        signal: abortController.signal
    });
    
    if (!response.ok) {
        let errorMessage = `请求失败: 状态码 ${response.status}`;
        try {
            const errorData = await response.json();
            if (typeof errorData.error === 'object') {
                errorMessage = JSON.stringify(errorData.error);
            } else {
                errorMessage = errorData.message || errorData.error || errorMessage;
            }
        } catch (e) {
            // 保持默认错误消息
        }
        throw new Error(errorMessage);
    }
    
    // 创建一个空的回复消息
    const responseMessage = addMessage('', false);
    let fullResponse = '';
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const data = line.substring(5).trim();
                    
                    // 跳过[DONE]消息
                    if (data === '[DONE]') continue;
                    
                    try {
                        const json = JSON.parse(data);
                        
                        // 根据不同API处理流式响应
                        let content = '';
                        
                        switch (modelType) {
                            case 'claude':
                                if (json.delta && json.delta.text) {
                                    content = json.delta.text;
                                }
                                break;
                            case 'gemini':
                                if (json.candidates && json.candidates[0]?.content?.parts[0]?.text) {
                                    content = json.candidates[0].content.parts[0].text;
                                }
                                break;
                            default:
                                if (json.choices && json.choices[0]?.delta?.content) {
                                    content = json.choices[0].delta.content;
                                }
                        }
                        
                        if (content) {
                            fullResponse += content;
                            responseMessage.innerHTML = parseMarkdown(fullResponse);
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        }
                    } catch (e) {
                        console.error('解析流式响应时出错:', e);
                    }
                }
            }
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            throw error; // 让外层函数处理中止错误
        } else {
            console.error('读取流时出错:', error);
            // 即使出错，也保留已经收到的部分回复
        }
    }
    
    // 更新聊天历史中的最后一条消息
    chatHistory[chatHistory.length - 1].content = fullResponse;
}

// 获取最近的聊天历史
function getRecentMessages() {
    // 取最近的10条消息作为上下文，包括当前的用户消息
    const recentMessages = chatHistory.slice(-10);
    
    // 添加系统消息作为第一条消息
    if (recentMessages.length > 0 && recentMessages[0].role !== 'system') {
        recentMessages.unshift({
            role: 'system',
            content: '你是一个有帮助的AI助手，专注于中文对话。请提供准确、有用且安全的回答。'
        });
    }
    
    return recentMessages;
}

// 清除聊天历史
function clearChat() {
    // 保留欢迎消息
    const welcomeMessage = messagesContainer.querySelector('.bot-message');
    messagesContainer.innerHTML = '';
    
    if (welcomeMessage) {
        messagesContainer.appendChild(welcomeMessage);
    }
    
    // 重置聊天历史
    chatHistory = [];
    if (welcomeMessage) {
        chatHistory.push({
            role: 'assistant',
            content: welcomeMessage.textContent
        });
    }
    
    console.log('已清除聊天历史');
}

// 简单的Markdown解析器
function parseMarkdown(text) {
    // 处理代码块
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // 处理行内代码
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 处理粗体
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // 处理斜体
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // 处理链接
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // 处理换行
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// 导出模块
window.ChatApp = {
    init: initChat,
    send: sendMessage,
    handleKeyDown: handleKeyDown,
    clearChat: clearChat,
    stopGeneration: stopGeneration
}; 