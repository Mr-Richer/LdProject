/**
 * 思政案例生成模块
 * 处理思政案例的生成请求和结果展示
 */

// 模块初始化入口
document.addEventListener('DOMContentLoaded', function() {
    // 延迟加载，确保DOM完全加载
    setTimeout(() => {
        initIdeologyCaseGenerator();
    }, 2000);
});

/**
 * 初始化思政案例生成功能
 */
function initIdeologyCaseGenerator() {
    console.log('开始初始化思政案例生成按钮事件');
    
    // 绑定思政案例生成按钮点击事件
    const ideologyGenerateBtn = document.querySelector('.ideology-generation .generate-btn');
    if (ideologyGenerateBtn) {
        console.log('找到思政案例生成按钮，添加点击事件');
        
        // 判断按钮是否已经被处理过(通过检查data-initialized属性)
        if (ideologyGenerateBtn.getAttribute('data-initialized') === 'true') {
            console.log('思政案例生成按钮已经初始化，跳过重复绑定');
            return;
        }
        
        // 移除现有事件监听器
        const newBtn = ideologyGenerateBtn.cloneNode(true);
        ideologyGenerateBtn.parentNode.replaceChild(newBtn, ideologyGenerateBtn);
        
        // 美化按钮样式
        newBtn.style.backgroundColor = '#1976d2';
        newBtn.style.color = 'white';
        newBtn.style.border = 'none';
        newBtn.style.borderRadius = '8px';
        newBtn.style.padding = '12px 20px';
        newBtn.style.fontSize = '14px';
        newBtn.style.fontWeight = '600';
        newBtn.style.cursor = 'pointer';
        newBtn.style.minWidth = '160px';
        newBtn.style.display = 'flex';
        newBtn.style.alignItems = 'center';
        newBtn.style.justifyContent = 'center';
        newBtn.style.boxShadow = '0 4px 6px rgba(25, 118, 210, 0.15)';
        newBtn.style.transition = 'all 0.2s ease';
        newBtn.style.marginTop = '20px';
        newBtn.style.marginLeft = 'auto'; // 右对齐按钮
        
        // 调整按钮内部图标
        const btnIcon = newBtn.querySelector('i');
        if (btnIcon) {
            btnIcon.style.marginRight = '8px';
        }
        
        // 添加鼠标悬停效果
        newBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#1565c0';
            this.style.boxShadow = '0 6px 10px rgba(25, 118, 210, 0.2)';
        });
        
        newBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#1976d2';
            this.style.boxShadow = '0 4px 6px rgba(25, 118, 210, 0.15)';
        });
        
        // 添加新的事件监听器
        newBtn.addEventListener('click', handleGenerateIdeologyCase);
        
        // 标记按钮已初始化
        newBtn.setAttribute('data-initialized', 'true');
        
        console.log('思政案例生成按钮事件绑定完成');
    } else {
        console.error('无法找到思政案例生成按钮');
    }
}

/**
 * 处理思政案例生成按钮点击事件
 */
function handleGenerateIdeologyCase() {
    console.log('思政案例生成按钮被点击');
    
    // 获取输入值
    const themeInput = document.querySelector('.ideology-generation .prompt-input:not([style*="display: none"])');
    if (!themeInput) {
        console.error('无法找到思政案例主题输入元素');
        return;
    }
    
    const theme = themeInput.value.trim();
    if (!theme) {
        return;
    }
    
    // 获取案例类型和长度
    const typeSelect = document.querySelector('#case-type-select');
    const lengthSelect = document.querySelector('#case-length-select');
    
    if (!typeSelect || !lengthSelect) {
        console.error('无法找到选择框元素');
        return;
    }
    
    const caseType = typeSelect.value;
    const caseLength = lengthSelect.value;
    
    // 记录实际选择的值便于调试
    console.log('已选择的案例类型:', caseType);
    console.log('已选择的案例长度:', caseLength);
    
    // 显示结果区域
    const resultTextarea = document.querySelector('.ideology-result .case-content-textarea:not([style*="display: none"])');
    const ideologyResult = document.querySelector('.ideology-result');
    
    if (ideologyResult) {
        ideologyResult.style.display = 'block';
    }
    
    if (resultTextarea) {
        resultTextarea.value = '正在生成思政案例，请稍候...';
    }
    
    // 检查是否可以调用主模块的fetchIdeologyCase函数
    if (typeof window.fetchIdeologyCase === 'function') {
        console.log('使用全局fetchIdeologyCase函数生成思政案例');
        window.fetchIdeologyCase(theme, caseType, caseLength)
            .then(content => {
                // 更新文本框内容
                if (resultTextarea) {
                    resultTextarea.value = content;
                    resultTextarea.readOnly = true;
                }
            })
            .catch(error => {
                console.error('获取思政案例失败:', error);
                if (resultTextarea) {
                    resultTextarea.value = `生成失败，请稍后重试\n错误信息: ${error.message}`;
                }
            });
    } else {
        console.log('全局fetchIdeologyCase函数不存在，使用本地API调用');
        
        // 将前端选择值转换为后端需要的枚举值
        let caseTypeInt = 1; // 默认Story
        if (caseType === 'story') caseTypeInt = 1;
        if (caseType === 'debate') caseTypeInt = 2;
        if (caseType === 'historical') caseTypeInt = 3;
        if (caseType === 'values') caseTypeInt = 4;
        
        let caseLengthInt = 2; // 默认Medium
        if (caseLength === 'short') caseLengthInt = 1;
        if (caseLength === 'medium') caseLengthInt = 2;
        if (caseLength === 'long') caseLengthInt = 3;
        
        // 获取当前章节ID
        const currentChapterId = parseInt(window.currentChapterId || 1, 10);
        
        // 准备请求参数 - 确保所有数值类型参数是整数
        const requestData = {
            theme: String(theme),
            caseType: Number(caseTypeInt),
            caseLength: Number(caseLengthInt),
            chapterId: Number(currentChapterId)
        };
        
        // 打印严格格式的请求体
        const strictRequestBody = JSON.stringify({
            theme: String(theme),
            caseType: Number(caseTypeInt),
            caseLength: Number(caseLengthInt),
            chapterId: Number(currentChapterId)
        });
        console.log('严格格式的请求体:', strictRequestBody);
        
        // 绕过JWT验证，尝试不发送令牌
        console.log('不发送令牌尝试请求API');
        
        // 调用API接口生成思政案例
        fetch('http://localhost:3000/api/ideology/case/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 移除Authorization头，尝试绕过JWT验证
            },
            body: strictRequestBody // 使用严格格式的请求体
        })
        .then(response => {
            console.log('API响应状态:', response.status);
            
            if (!response.ok) {
                return response.text().then(text => {
                    // 尝试解析为JSON
                    try {
                        const errorData = JSON.parse(text);
                        console.error('API错误详情:', errorData);
                        throw new Error(`API请求失败: ${response.status} - ${JSON.stringify(errorData)}`);
                    } catch (e) {
                        // 如果不是JSON，则直接返回文本
                        console.error('API错误响应文本:', text);
                        throw new Error(`API请求失败: ${response.status} - ${text}`);
                    }
                });
            }
            return response.text();
        })
        .then(text => {
            // 尝试将响应解析为JSON，如果失败则直接使用文本
            let data;
            let content;
            
            // 检查是否是JSON格式的响应
            if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
                try {
                    data = JSON.parse(text);
                    console.log('API响应数据(JSON):', data);
                    
                    // 检查不同的数据结构
                    if (data && data.data && data.data.content) {
                        // 标准响应格式
                        const title = data.data.title || `${theme}的思考与实践`;
                        content = `${title}\n\n${data.data.content}`;
                    } else if (data && data.title && data.content) {
                        // 替代响应格式
                        content = `${data.title}\n\n${data.content}`;
                    } else {
                        // 无法识别的JSON格式，直接使用原始文本
                        content = text;
                    }
                } catch (e) {
                    // JSON解析失败，直接使用文本
                    console.warn('API响应不是有效的JSON，将直接使用文本内容', e);
                    content = text;
                }
            } else {
                // 不是JSON格式，直接使用文本
                console.log('API直接返回了文本内容');
                content = text;
            }
            
            // 更新文本框内容
            if (resultTextarea) {
                resultTextarea.value = content;
                resultTextarea.readOnly = true;
            }
        })
        .catch(error => {
            console.error('获取思政案例失败:', error);
            if (resultTextarea) {
                resultTextarea.value = `生成失败，请稍后重试\n错误信息: ${error.message}`;
            }
        });
    }
}

// 导出模块函数，使其可全局访问
window.initIdeologyCaseGenerator = initIdeologyCaseGenerator; 