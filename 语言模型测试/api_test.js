// 模型API测试脚本

const fs = require('fs');
const axios = require('axios');

// API配置
const apiConfig = {
    openrouter: {
        name: "DeepSeek (OpenRouter)",
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        modelId: 'deepseek/deepseek-chat-v3-0324:free',
        apiKey: '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'
    },
    chutes: {
        name: "DeepSeek (Chutes)",
        apiUrl: 'https://llm.chutes.ai/v1/chat/completions',
        modelId: 'deepseek-ai/DeepSeek-V3-0324',
        apiKey: 'cpk_4e6c011db10249f0bdc7b8f8df40cf9f.096169649b4d5c67b42bc5b83b11e149.KcltcWhOps9qvpqYOyoiSjG1JQOAkl33'
    }
};

// 测试消息
const testPrompt = "你好，请用中文回答：今天天气怎么样？请简短回复一句话";

// 将测试结果写入日志
function writeLog(message) {
    const logFile = 'api_test_log.txt';
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
    console.log(message);
}

// 测试API
async function testAPI(provider) {
    const config = apiConfig[provider];
    
    writeLog(`\n开始测试 ${config.name}...`);
    writeLog(`API URL: ${config.apiUrl}`);
    writeLog(`模型ID: ${config.modelId}`);
    
    try {
        const apiUrl = provider === 'chutes' ? config.apiUrl + '#' : config.apiUrl;
        
        // 添加请求开始时间戳
        const startTime = new Date();
        writeLog(`开始请求时间: ${startTime.toISOString()}`);
        
        // 构建请求体
        const requestBody = {
            model: config.modelId,
            messages: [
                {
                    role: "system",
                    content: "你是一个有帮助的AI助手，专注于中文对话。请提供简短的回答。"
                },
                {
                    role: "user",
                    content: testPrompt
                }
            ]
        };
        
        // 详细记录请求内容
        writeLog(`请求体: ${JSON.stringify(requestBody, null, 2)}`);
        
        // 发送请求
        const response = await axios.post(apiUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            timeout: 30000 // 30秒超时
        });
        
        // 计算响应时间
        const endTime = new Date();
        const responseTime = (endTime - startTime) / 1000;
        
        // 记录API响应
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const content = response.data.choices[0].message.content;
            writeLog(`✅ ${config.name} 测试成功`);
            writeLog(`响应时间: ${responseTime}秒`);
            writeLog(`回复内容: ${content}`);
            
            if (response.data.usage) {
                const usage = response.data.usage;
                writeLog(`Token使用: 输入=${usage.prompt_tokens}, 输出=${usage.completion_tokens}, 总计=${usage.total_tokens}`);
            }
            
            return true;
        } else {
            writeLog(`❌ ${config.name} 返回了无效的响应格式:`);
            writeLog(JSON.stringify(response.data, null, 2));
            return false;
        }
    } catch (error) {
        writeLog(`❌ ${config.name} 测试失败`);
        
        if (error.response) {
            // 服务器响应但状态码不在2xx范围内
            writeLog(`状态码: ${error.response.status}`);
            writeLog(`错误数据: ${JSON.stringify(error.response.data, null, 2)}`);
        } else if (error.request) {
            // 请求已发送但未收到响应
            writeLog(`未收到响应: ${error.message}`);
            if (error.code === 'ECONNABORTED') {
                writeLog('请求超时');
            }
        } else {
            // 设置请求时发生错误
            writeLog(`请求错误: ${error.message}`);
        }
        
        // 记录完整错误对象以进行调试
        writeLog(`详细错误: ${JSON.stringify(error.toJSON ? error.toJSON() : String(error), null, 2)}`);
        
        return false;
    }
}

// 修复浏览器端错误处理的辅助函数
function fixErrorHandlingInChat() {
    writeLog("\n开始生成浏览器端错误处理修复代码...");
    
    // 修复错误处理的代码
    const fixCode = `
// 在chat.js中找到sendStandardRequest函数和sendStreamingRequest函数的错误处理部分
// 将以下代码:
if (!response.ok) {
    let errorMessage = '请求失败';
    try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || \`请求失败: 状态码 \${response.status}\`;
    } catch (e) {
        errorMessage = \`请求失败: 状态码 \${response.status}\`;
    }
    throw new Error(errorMessage);
}

// 修改为:
if (!response.ok) {
    let errorMessage = \`请求失败: 状态码 \${response.status}\`;
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

// 同时在catch错误处理部分，将以下代码:
errorDiv.textContent = \`请求失败: \${error.message}\`;

// 修改为:
let errorText = error.message;
if (errorText.includes('[object Object]')) {
    errorText = '请求失败，服务器返回了无效的错误格式';
}
errorDiv.textContent = errorText;
`;
    
    writeLog(fixCode);
    writeLog("\n可以根据以上代码修复浏览器端的错误处理问题。");
}

// 主函数
async function runTests() {
    writeLog("====== API测试开始 ======");
    writeLog(`测试时间: ${new Date().toLocaleString()}`);
    
    const openrouterResult = await testAPI('openrouter');
    const chutesResult = await testAPI('chutes');
    
    writeLog("\n====== 测试结果汇总 ======");
    writeLog(`DeepSeek (OpenRouter): ${openrouterResult ? '✅ 可用' : '❌ 不可用'}`);
    writeLog(`DeepSeek (Chutes): ${chutesResult ? '✅ 可用' : '❌ 不可用'}`);
    
    // 生成修复浏览器错误显示的辅助代码
    fixErrorHandlingInChat();
    
    writeLog("\n====== API测试结束 ======");
}

// 运行测试
runTests(); 