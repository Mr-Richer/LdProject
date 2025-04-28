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
    }
};

// 全局变量
let isWaitingForResponse = false;
let isStreaming = false;
let chatHistory = [];

// DOM元素引用
let messagesContainer;
let messageInput;
let sendButton;
let typingIndicator;
let streamToggle;

// 初始化聊天界面
function initChat() {
    // 获取DOM元素
    messagesContainer = document.getElementById('messages');
    messageInput = document.getElementById('message-input');
    sendButton = document.getElementById('send-button');
    typingIndicator = document.getElementById('typing-indicator');
    streamToggle = document.getElementById('stream-toggle');
    
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
    
    // 初始聚焦到输入框
    messageInput.focus();
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
    
    try {
        const selectedModel = document.querySelector('input[name="model"]:checked').value;
        
        if (isStreaming) {
            await sendStreamingRequest(message, selectedModel);
        } else {
            await sendStandardRequest(message, selectedModel);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        
        // 显示错误消息
        const errorDiv = document.createElement('div');
        errorDiv.className = 'status-message error';
        errorDiv.textContent = `请求失败: ${error.message}`;
        messagesContainer.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    } finally {
        // 隐藏正在输入指示器并启用发送按钮
        typingIndicator.style.display = 'none';
        isWaitingForResponse = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
}

// 发送标准请求
async function sendStandardRequest(message, modelType) {
    const config = apiConfig[modelType];
    const apiUrl = modelType === 'chutes' ? config.apiUrl + '#' : config.apiUrl;
    
    // 获取最近的聊天历史用于上下文
    const recentMessages = getRecentMessages();
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: config.modelId,
            messages: recentMessages
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '请求失败');
    }
    
    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
        const botResponse = data.choices[0].message.content;
        addMessage(botResponse, false);
        
        // 记录使用的令牌数
        if (data.usage) {
            console.log(`令牌使用: 输入=${data.usage.prompt_tokens}, 输出=${data.usage.completion_tokens}, 总计=${data.usage.total_tokens}`);
        }
    } else {
        throw new Error('没有接收到有效的响应');
    }
}

// 发送流式请求
async function sendStreamingRequest(message, modelType) {
    const config = apiConfig[modelType];
    const apiUrl = modelType === 'chutes' ? config.apiUrl + '#' : config.apiUrl;
    
    // 获取最近的聊天历史用于上下文
    const recentMessages = getRecentMessages();
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: config.modelId,
            messages: recentMessages,
            stream: true
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '请求失败');
    }
    
    // 创建一个空的机器人消息
    const botMessageElement = addMessage('', false);
    
    // 删除最后一个从历史记录中添加的空消息，后面会重新添加完整消息
    chatHistory.pop();
    
    // 流式处理响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullResponse = '';
    
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // 解码和处理响应块
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data:') && line.trim() !== 'data: [DONE]') {
                    try {
                        const jsonData = JSON.parse(line.slice(5));
                        if (jsonData.choices && jsonData.choices.length > 0) {
                            const contentDelta = jsonData.choices[0].delta?.content || '';
                            fullResponse += contentDelta;
                            botMessageElement.innerHTML = fullResponse;
                            
                            // 保持滚动到底部
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        }
                    } catch (e) {
                        console.error('解析流式数据出错:', e);
                    }
                }
            }
        }
    } catch (error) {
        console.error('流式读取出错:', error);
        throw error;
    }
    
    // 添加完整回复到聊天历史
    chatHistory.push({
        role: 'assistant',
        content: fullResponse
    });
    
    // 确保添加了时间标签
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    const hours = new Date().getHours();
    const minutes = String(new Date().getMinutes()).padStart(2, '0');
    timeDiv.textContent = `今天 ${hours}:${minutes}`;
    botMessageElement.appendChild(timeDiv);
}

// 获取最近的聊天历史用于上下文
function getRecentMessages() {
    // 限制历史消息长度，避免超出token限制
    const maxMessages = 10; 
    const recentHistory = chatHistory.slice(-maxMessages);
    
    // 如果有上下文，则添加最新的用户消息
    if (recentHistory.length > 0 && recentHistory[recentHistory.length - 1].role === 'user') {
        return recentHistory;
    } else {
        // 如果没有上下文，直接返回当前用户消息
        return [{ role: 'user', content: messageInput.value.trim() }];
    }
}

// 清空聊天历史
function clearChat() {
    // 保留第一条欢迎消息
    const welcomeMessage = messagesContainer.querySelector('.bot-message');
    
    // 清空消息容器
    messagesContainer.innerHTML = '';
    
    // 重新添加欢迎消息
    if (welcomeMessage) {
        messagesContainer.appendChild(welcomeMessage);
    }
    
    // 重置聊天历史
    chatHistory = [];
    
    // 添加系统提示到历史
    chatHistory.push({
        role: 'system',
        content: '你是一个有帮助的助手，基于DeepSeek大型语言模型。你能够提供信息、回答问题和进行对话。'
    });
    
    // 更新初始消息时间
    updateInitialMessageTime();
}

// 导出公共函数
window.chatApp = {
    init: initChat,
    sendMessage: sendMessage,
    handleKeyDown: handleKeyDown,
    clearChat: clearChat
}; 