/**
 * 课程思政模块
 * 处理思政案例生成和讨论题生成功能
 */

// 模块初始化入口
document.addEventListener('DOMContentLoaded', function() {
    // 延迟加载，确保DOM完全加载
    setTimeout(() => {
        // 调用主函数
        initIdeologyModule();
    }, 100);
});

/**
 * 初始化课程思政模块
 */
function initIdeologyModule() {
    try {
        console.log('开始初始化思政模块...');
        
        // 加载案例列表HTML结构
        loadIdeologyCasesTemplate();
        
        // 初始化思政案例生成相关功能
        initIdeologyCase();
        
        // 初始化讨论题生成相关功能 
        initDiscussionTopics();

        // 初始化添加网络链接按钮
        initUrlLinkButton();

        // 初始化文件上传功能
        initFileUpload();
        
        // 初始化思政案例表格样式
        initIdeologyCasesTable();
        
        console.log('思政模块初始化完成');
    } catch (error) {
        console.error('思政模块初始化失败:', error);
    }
}

/**
 * 加载思政案例列表HTML结构模板
 */
function loadIdeologyCasesTemplate() {
    // 检查是否已经加载模板
    if (typeof window.initIdeologyCasesListHTML === 'function') {
        window.initIdeologyCasesListHTML();
        return;
    }
    
    // 尝试加载模板脚本
    const script = document.createElement('script');
    script.src = '../src/js/ideology-cases-template.js';
    script.async = true;
    script.onload = function() {
        console.log('思政案例列表模板加载成功');
        if (typeof window.initIdeologyCasesListHTML === 'function') {
            window.initIdeologyCasesListHTML();
        }
    };
    script.onerror = function() {
        console.error('加载思政案例列表模板失败');
    };
    
    document.head.appendChild(script);
}

// 将主函数添加到全局命名空间，使其他脚本可以调用
window.initIdeologyModule = initIdeologyModule;

/**
 * 初始化思政案例生成功能
 */
function initIdeologyCase() {
    // 获取思政案例生成按钮
    const ideologyGenerateBtn = document.querySelector('.ideology-generation .generate-btn');
    if (!ideologyGenerateBtn) {
        console.error('找不到思政案例生成按钮');
        return;
    }
    
    // 美化输入表单区域
    const formContainer = document.querySelector('.ideology-generation .form-container');
    if (formContainer) {
        formContainer.style.backgroundColor = '#ffffff';
        formContainer.style.padding = '30px';
        formContainer.style.borderRadius = '10px';
        formContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        formContainer.style.marginBottom = '30px';
        formContainer.style.width = '95%';
        formContainer.style.maxWidth = '1200px'; // 增加最大宽度以匹配上方框体
        formContainer.style.margin = '20px auto 30px';
        formContainer.style.display = 'flex';
        formContainer.style.flexWrap = 'wrap';
        formContainer.style.justifyContent = 'space-between';
        formContainer.style.alignItems = 'flex-end';
        formContainer.style.position = 'relative'; // 确保相对定位以便绝对定位按钮
    }
    
    // 美化表单组
    const formGroups = document.querySelectorAll('.ideology-generation .form-group');
    formGroups.forEach(group => {
        group.style.flex = '1 1 45%';
        group.style.margin = '0 10px 20px 0';
        group.style.minWidth = '200px';
    });
    
    // 美化输入框标签
    const formLabels = document.querySelectorAll('.ideology-generation .form-label');
    formLabels.forEach(label => {
        label.style.display = 'block';
        label.style.marginBottom = '8px';
        label.style.fontWeight = '600';
        label.style.fontSize = '14px';
        label.style.color = '#333';
    });
    
    // 美化输入框
    const themeInput = document.querySelector('.ideology-generation .prompt-input');
    if (themeInput) {
        themeInput.style.width = '100%';
        themeInput.style.padding = '12px 15px';
        themeInput.style.borderRadius = '8px';
        themeInput.style.border = '1px solid #e0e0e0';
        themeInput.style.fontSize = '14px';
        themeInput.style.boxSizing = 'border-box';
        themeInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
        themeInput.style.boxShadow = 'none';
        
        // 添加鼠标焦点效果
        themeInput.addEventListener('focus', function() {
            this.style.borderColor = '#1976d2';
            this.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
            this.style.outline = 'none';
        });
        
        themeInput.addEventListener('blur', function() {
            this.style.borderColor = '#e0e0e0';
            this.style.boxShadow = 'none';
        });
    }
    
    // 美化选择框
    const selects = document.querySelectorAll('.ideology-generation select');
    selects.forEach(select => {
        select.style.width = '100%';
        select.style.padding = '12px 15px';
        select.style.borderRadius = '8px';
        select.style.border = '1px solid #e0e0e0';
        select.style.fontSize = '14px';
        select.style.appearance = 'none';
        select.style.backgroundImage = 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23333\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")';
        select.style.backgroundRepeat = 'no-repeat';
        select.style.backgroundPosition = 'right 15px center';
        select.style.backgroundSize = '15px';
        select.style.backgroundColor = 'white';
        select.style.cursor = 'pointer';
        select.style.boxSizing = 'border-box';
        select.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
        
        // 添加鼠标焦点效果
        select.addEventListener('focus', function() {
            this.style.borderColor = '#1976d2';
            this.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
            this.style.outline = 'none';
        });
        
        select.addEventListener('blur', function() {
            this.style.borderColor = '#e0e0e0';
            this.style.boxShadow = 'none';
        });
    });
    
    // 样式化现有按钮而不是创建新按钮
    if (ideologyGenerateBtn) {
        // 移除现有的事件监听器（通过克隆和替换实现）
        const newBtn = ideologyGenerateBtn.cloneNode(true);
        ideologyGenerateBtn.parentNode.replaceChild(newBtn, ideologyGenerateBtn);
        
        // 设置按钮样式，参考图片中的蓝色按钮
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
        
        // 添加点击事件
        newBtn.addEventListener('click', handleGenerateIdeologyCase);
    }
    
    // 初始化结果区域的按钮
    initResultActions();
    
    // 设置思政案例文本框样式
    const caseTextarea = document.querySelector('.ideology-result .case-content-textarea');
    if (caseTextarea) {
        caseTextarea.style.width = '100%';
        caseTextarea.style.height = '350px';
        caseTextarea.style.fontFamily = '"Microsoft YaHei", sans-serif';
        caseTextarea.style.fontSize = '15px';
        caseTextarea.style.lineHeight = '1.8';
        caseTextarea.style.padding = '20px';
        caseTextarea.style.borderRadius = '10px';
        caseTextarea.style.border = '1px solid #e0e0e0';
        caseTextarea.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        caseTextarea.style.resize = 'none';
        caseTextarea.style.color = '#333';
        caseTextarea.style.backgroundColor = '#f9f9f9';
    }
    
    // 设置思政案例结果容器样式，保持与上方表单相同的宽度
    const ideologyResult = document.querySelector('.ideology-result');
    if (ideologyResult) {
        ideologyResult.style.width = '95%';
        ideologyResult.style.maxWidth = '1200px'; // 匹配上方表单宽度
        ideologyResult.style.margin = '15px auto';
        ideologyResult.style.backgroundColor = '#ffffff';
        ideologyResult.style.borderRadius = '10px';
        ideologyResult.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
    }
}

/**
 * 初始化思政案例结果区域的按钮
 */
function initResultActions() {
    // 美化结果区域标题和按钮容器
    const resultHeader = document.querySelector('.ideology-result .result-header');
    if (resultHeader) {
        resultHeader.style.display = 'flex';
        resultHeader.style.justifyContent = 'space-between';
        resultHeader.style.alignItems = 'center';
        resultHeader.style.padding = '0 0 15px 0';
        resultHeader.style.marginBottom = '20px';
        resultHeader.style.borderBottom = '1px solid #eaeaea';
    }
    
    // 设置标题样式
    const resultTitle = document.querySelector('.ideology-result .result-title');
    if (resultTitle) {
        resultTitle.style.fontSize = '18px';
        resultTitle.style.fontWeight = '600';
        resultTitle.style.color = '#333';
        resultTitle.style.margin = '0';
    }
    
    // 美化按钮容器
    const actionButtons = document.querySelector('.ideology-result .result-actions');
    if (actionButtons) {
        actionButtons.style.display = 'flex';
        actionButtons.style.gap = '12px';
    }

    const resultActionBtns = document.querySelectorAll('.ideology-result .result-action-btn');
    
    resultActionBtns.forEach(btn => {
        // 移除原有事件
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // 美化按钮样式
        newBtn.style.padding = '8px 12px';
        newBtn.style.borderRadius = '8px';
        newBtn.style.border = '1px solid #e0e0e0';
        newBtn.style.backgroundColor = '#f9f9f9';
        newBtn.style.cursor = 'pointer';
        newBtn.style.transition = 'all 0.2s ease';
        newBtn.style.display = 'flex';
        newBtn.style.alignItems = 'center';
        newBtn.style.justifyContent = 'center';
        newBtn.style.fontSize = '14px';
        newBtn.style.fontWeight = '500';
        newBtn.style.color = '#555';
        newBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        
        // 添加鼠标悬停效果
        newBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f0f0f0';
            this.style.borderColor = '#ccc';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        });
        
        newBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#f9f9f9';
            this.style.borderColor = '#e0e0e0';
            this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        });
        
        // 添加事件监听器
        newBtn.addEventListener('click', function() {
            const action = this.querySelector('i').className;
            
            if (action.includes('fa-edit')) {
                // 编辑按钮
                handleEditCase();
            } else if (action.includes('fa-copy')) {
                // 复制按钮
                handleCopyCase();
            } else if (action.includes('fa-redo')) {
                // 重新生成按钮
                handleGenerateIdeologyCase();
            }
        });
    });
    
    // 美化图标
    const icons = document.querySelectorAll('.ideology-result .result-action-btn i');
    icons.forEach(icon => {
        icon.style.marginRight = '6px';
        icon.style.fontSize = '14px';
    });
    
    // 初始化新建案例按钮
    const createCaseBtn = document.getElementById('createCaseBtn');
    if (createCaseBtn) {
        const newCreateBtn = createCaseBtn.cloneNode(true);
        createCaseBtn.parentNode.replaceChild(newCreateBtn, createCaseBtn);
        
        // 使用与知识拓展列表类似的样式
        newCreateBtn.style.marginTop = '10px';
        newCreateBtn.style.padding = '10px 16px';
        newCreateBtn.style.backgroundColor = '#1976d2';
        newCreateBtn.style.color = 'white';
        newCreateBtn.style.border = 'none';
        newCreateBtn.style.borderRadius = '8px';
        newCreateBtn.style.cursor = 'pointer';
        newCreateBtn.style.fontWeight = '600';
        newCreateBtn.style.fontSize = '14px';
        newCreateBtn.style.boxShadow = '0 4px 6px rgba(25, 118, 210, 0.15)';
        newCreateBtn.style.transition = 'all 0.2s ease';
        newCreateBtn.style.display = 'inline-flex';
        newCreateBtn.style.alignItems = 'center';
        newCreateBtn.style.justifyContent = 'center';
        
        // 替换按钮文本，从"新建案例"改为"保存案例"
        const zhSpan = newCreateBtn.querySelector('.zh');
        if (zhSpan) {
            zhSpan.textContent = '保存案例';
        }
        
        const enSpan = newCreateBtn.querySelector('.en');
        if (enSpan) {
            enSpan.textContent = 'Save Case';
        }
        
        // 添加鼠标悬停效果
        newCreateBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#1565c0';
            this.style.boxShadow = '0 6px 10px rgba(25, 118, 210, 0.2)';
        });
        
        newCreateBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#1976d2';
            this.style.boxShadow = '0 4px 6px rgba(25, 118, 210, 0.15)';
        });
        
        newCreateBtn.addEventListener('click', async function() {
            // 获取思政案例内容 - 尝试多个可能的选择器
            const contentTextareas = [
                document.querySelector('#ideology-content .case-content-textarea.zh'),
                document.querySelector('.ideology-result .case-content-textarea.zh'),
                document.querySelector('.case-content-textarea.zh'),
                document.querySelector('.case-content-textarea')
            ];
            
            let contentTextarea = null;
            for (const textarea of contentTextareas) {
                if (textarea && textarea.value && textarea.value.trim()) {
                    contentTextarea = textarea;
                    break;
                }
            }
            
            if (!contentTextarea) {
                alert('请先生成思政案例内容');
                return;
            }
            
            const content = contentTextarea.value.trim();
            
            // 从内容中提取标题（第一行）和正文
            const lines = content.split('\n');
            let title = '';
            let caseContent = content;
            
            if (lines.length > 0) {
                title = lines[0].trim();
                // 从标题中移除【】包围的案例类型前缀
                title = title.replace(/【.*?】/, '').trim();
                // 从标题中移除"关于"和"的思政案例"
                title = title.replace(/关于["""]?/g, '').replace(/["""]?的思政案例/g, '').trim();
                caseContent = lines.slice(1).join('\n').trim();
            }
            
            // 获取当前章节ID
            const chapterId = parseInt(window.currentChapterId || 1, 10);
            
            // 显示加载状态
            contentTextarea.readOnly = true;
            contentTextarea.style.opacity = '0.7';
            
            // 设置按钮状态
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span class="zh">保存中...</span>';
            
            // 构建案例数据
            const caseData = {
                title: title,
                content: caseContent,
                chapter_id: Number(chapterId),
                user_id: 1, // 默认使用1作为用户ID
                case_type: 1, // 默认使用故事型案例
                case_length: 2, // 默认使用中等长度
                is_ai_generated: 1,
                theme: title // 使用标题作为主题
            };
            
            // 获取资源列表
            const resourceItems = document.querySelectorAll('.resources-list .resource-item');
            
            // 计算各类型资源数量（直接包含在case数据中）
            let imageCount = 0;
            let videoCount = 0;
            let linkCount = 0;
            
            resourceItems.forEach(item => {
                const itemClass = item.querySelector('i').className;
                if (itemClass.includes('fa-image')) {
                    imageCount++;
                } else if (itemClass.includes('fa-video')) {
                    videoCount++;
                } else if (itemClass.includes('fa-link')) {
                    linkCount++;
                }
            });
            
            // 将资源计数直接添加到案例数据中
            caseData.image_count = imageCount;
            caseData.video_count = videoCount;
            caseData.link_count = linkCount;
            
            console.log('准备提交的案例数据:', caseData);
            
            // 调用API保存案例
            try {
                // 尝试直接调用API
                console.log('开始保存案例...');
                
                // 确保正确的API路径
                const apiBaseUrl = window.API_BASE_URL || 'http://localhost:3000';
                const apiUrl = `${apiBaseUrl}/api/ideology/case`;
                console.log('API URL:', apiUrl);
                
                // 使用XMLHttpRequest替代fetch进行测试
                const xhr = new XMLHttpRequest();
                xhr.open('POST', apiUrl, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                
                xhr.onload = function() {
                    console.log('XHR状态:', xhr.status);
                    console.log('XHR响应:', xhr.responseText);
                    
                    // 恢复UI状态
                    contentTextarea.readOnly = true;
                    contentTextarea.style.opacity = '1';
                    
                    // 恢复按钮状态
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-save"></i> <span class="zh">保存案例</span> <span class="en">Save Case</span>';
                    
                    if (xhr.status >= 200 && xhr.status < 300) {
                        // 请求成功
                        let apiResult = null;
                        try {
                            apiResult = JSON.parse(xhr.responseText);
                        } catch (e) {
                            console.warn('无法解析JSON响应:', e);
                        }
                        
                        // 存储案例ID用于后续操作
                        const caseId = apiResult?.data?.id || apiResult?.id || Date.now();
                        contentTextarea.dataset.caseId = caseId;
                        
                        // 显示成功提示
                        showToast('案例保存成功', 'success');
                        
                        // 刷新案例列表
                        refreshCasesList(caseData, caseId);
                    } else {
                        // 请求失败
                        showToast('保存失败: ' + xhr.responseText, 'error');
                        console.error('保存思政案例失败:', xhr.responseText);
                    }
                }.bind(this);
                
                xhr.onerror = function() {
                    // 恢复UI状态
                    contentTextarea.readOnly = false;
                    contentTextarea.style.opacity = '1';
                    
                    // 恢复按钮状态
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-save"></i> <span class="zh">保存案例</span> <span class="en">Save Case</span>';
                    
                    showToast('网络错误，请检查服务器连接', 'error');
                    console.error('网络错误');
                }.bind(this);
                
                // 发送请求 - 确保发送的是字符串
                const jsonData = JSON.stringify(caseData);
                console.log('发送的JSON数据:', jsonData);
                xhr.send(jsonData);
                
            } catch (error) {
                // 恢复文本框状态
                contentTextarea.readOnly = false;
                contentTextarea.style.opacity = '1';
                
                // 恢复按钮状态
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-save"></i> <span class="zh">保存案例</span> <span class="en">Save Case</span>';
                
                // 显示错误信息
                showToast('保存失败: ' + (error.message || '未知错误'), 'error');
                console.error('保存思政案例失败:', error);
            }
        });
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
        alert('无法找到思政案例主题输入元素');
        return;
    }
    
    const caseTypeSelect = document.getElementById('case-type-select');
    const caseLengthSelect = document.getElementById('case-length-select');
    
    if (!caseTypeSelect || !caseLengthSelect) {
        console.error('无法找到案例类型或长度选择元素');
        // 尝试使用默认值继续
    }
    
    const theme = themeInput.value.trim();
    if (!theme) {
        alert('请输入思政案例主题');
        return;
    }
    
    // 获取选中的案例类型和长度（提供默认值）
    const caseType = caseTypeSelect ? caseTypeSelect.value : 'story';
    const caseLength = caseLengthSelect ? caseLengthSelect.value : 'medium';
    
    console.log('生成思政案例参数:', { theme, caseType, caseLength });
    
    // 显示结果区域
    const ideologyResult = document.querySelector('.ideology-result');
    if (ideologyResult) {
        ideologyResult.style.display = 'block';
    } else {
        console.error('找不到.ideology-result元素');
    }
    
    // 获取文本区域
    const resultContent = document.querySelector('.ideology-result .case-content-textarea:not([style*="display: none"])');
    if (resultContent) {
        resultContent.value = '正在生成思政案例，请稍候...';
    } else {
        console.error('找不到案例内容文本区域');
        // 尝试查找其他可能的选择器
        const altResultContent = document.querySelector('.case-content-textarea');
        if (altResultContent) {
            console.log('找到替代文本区域元素');
            altResultContent.value = '正在生成思政案例，请稍候...';
        } else {
            console.error('无法找到任何可用的文本区域元素');
        }
    }
    
    // 从API获取生成内容
    fetchIdeologyCase(theme, caseType, caseLength)
        .then(content => {
            console.log('思政案例生成成功');
            
            // 更新文本框内容（尝试多个可能的选择器）
            const textareas = [
                document.querySelector('.ideology-result .case-content-textarea:not([style*="display: none"])'),
                document.querySelector('.ideology-result .case-content-textarea'),
                document.querySelector('.case-content-textarea')
            ];
            
            let updated = false;
            for (const textarea of textareas) {
                if (textarea) {
                    textarea.value = content;
                    textarea.readOnly = true;
                    updated = true;
                    break;
                }
            }
            
            if (!updated) {
                console.error('无法找到任何文本区域来显示结果');
                alert('生成成功，但无法显示结果。请刷新页面后重试。');
            }
            
            // 禁止显示成功提示弹窗
            if (typeof window._showNotificationOriginal === 'undefined' && typeof window.showNotification === 'function') {
                window._showNotificationOriginal = window.showNotification;
                window.showNotification = function() {
                    console.log('通知已被屏蔽');
                    return;
                };
                setTimeout(() => {
                    if (window._showNotificationOriginal) {
                        window.showNotification = window._showNotificationOriginal;
                    }
                }, 1000);
            }
        })
        .catch(error => {
            console.error('获取思政案例失败:', error);
            
            // 尝试更新多个可能的文本区域
            const textareas = [
                document.querySelector('.ideology-result .case-content-textarea:not([style*="display: none"])'),
                document.querySelector('.ideology-result .case-content-textarea'),
                document.querySelector('.case-content-textarea')
            ];
            
            let updated = false;
            for (const textarea of textareas) {
                if (textarea) {
                    textarea.value = `生成失败，请稍后重试\n错误信息: ${error.message}`;
                    updated = true;
                    break;
                }
            }
            
            if (!updated) {
                alert(`生成失败: ${error.message}`);
            }
        });
}

/**
 * 从API获取思政案例
 * @param {string} theme 主题
 * @param {string} caseType 案例类型
 * @param {string} caseLength 案例长度
 * @returns {Promise<string>} 生成的内容
 */
async function fetchIdeologyCase(theme, caseType, caseLength) {
    try {
        // 获取当前章节ID（如果有）
        const chapterId = parseInt(window.currentChapterId || 1, 10);
        
        // 定义API基础URL
        const apiBaseUrl = window.API_BASE_URL || 'http://localhost:3000';
        
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
        
        // 准备请求参数 - 确保所有数值类型参数是整数
        const requestData = {
            theme: String(theme),
            caseType: Number(caseTypeInt),
            caseLength: Number(caseLengthInt),
            chapterId: Number(chapterId)
        };
        
        // 创建严格格式的请求体
        const strictRequestBody = JSON.stringify({
            theme: String(theme),
            caseType: Number(caseTypeInt),
            caseLength: Number(caseLengthInt),
            chapterId: Number(chapterId)
        });
        
        console.log('严格格式的请求体:', strictRequestBody);
        console.log('请求URL:', `${apiBaseUrl}/api/ideology/case/generate`);
        
        // 使用模拟数据作为备用方案
        try {
            // 先尝试正常API调用
            const response = await fetch(`${apiBaseUrl}/api/ideology/case/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: strictRequestBody
            });
            
            console.log('API响应状态:', response.status);
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            // 处理响应
            let responseText = await response.text();
            
            // 解析响应
            if (responseText.trim().startsWith('{') && responseText.trim().endsWith('}')) {
                try {
                    const data = JSON.parse(responseText);
                    console.log('API响应数据(JSON):', data);
                    
                    if (data && data.data && data.data.content) {
                        const title = data.data.title || `${theme}的思考与实践`;
                        return `${title}\n\n${data.data.content}`;
                    } else if (data && data.title && data.content) {
                        return `${data.title}\n\n${data.content}`;
                    }
                } catch (e) {
                    console.warn('API响应解析失败，使用原始文本', e);
                }
            }
            
            return responseText;
        } catch (apiError) {
            // API调用失败，使用本地模拟数据
            console.warn('API调用失败，使用本地模拟数据:', apiError);
            
            // 生成一个模拟的思政案例作为后备方案
            let title = '';
            let content = '';
            
            // 根据案例类型生成不同的标题
            switch (caseTypeInt) {
                case 1:
                    title = `【故事型案例】关于"${theme}"的思政案例`;
                    break;
                case 2:
                    title = `【辩论型案例】关于"${theme}"的思政案例`;
                    break;
                case 3:
                    title = `【历史事件型案例】关于"${theme}"的思政案例`;
                    break;
                case 4:
                    title = `【价值观分析型案例】关于"${theme}"的思政案例`;
                    break;
                default:
                    title = `关于"${theme}"的思政案例`;
            }
            
            // 根据长度生成不同的内容长度
            let lengthDesc = '';
            switch (caseLengthInt) {
                case 1:
                    lengthDesc = '简短';
                    break;
                case 2:
                    lengthDesc = '中等';
                    break;
                case 3:
                    lengthDesc = '详细';
                    break;
                default:
                    lengthDesc = '中等';
            }
            
            // 生成模拟内容
            content = `这是一个${lengthDesc}的思政案例示例，主题围绕"${theme}"展开。\n\n`;
            content += `在中华优秀传统文化的传承与创新中，"${theme}"始终是一个重要的思想内核。`;
            content += `本案例通过具体的历史事件和现代案例，深入阐述了"${theme}"在当代中国发展中的重要意义。`;
            content += `学生通过学习本案例，可以更好地理解中华文化的精髓，增强文化自信。\n\n`;
            content += `这是本地生成的模拟内容，由于API请求失败而显示。`;
            
            return `${title}\n\n${content}`;
        }
    } catch (error) {
        console.error('思政案例生成失败:', error);
        throw error;
    }
}

// 将fetchIdeologyCase函数导出为全局函数
window.fetchIdeologyCase = fetchIdeologyCase;

/**
 * 处理编辑案例事件
 */
function handleEditCase() {
    const textarea = document.querySelector('.ideology-result .case-content-textarea:not([style*="display: none"])');
    if (textarea) {
        textarea.readOnly = false;
        textarea.focus();
        
        // 禁止显示编辑操作的弹窗通知
        if (typeof window.showNotification === 'function') {
            const originalShowNotification = window.showNotification;
            window.showNotification = function() {
                console.log('编辑案例通知已屏蔽');
                return;
            };
            
            setTimeout(() => {
                window.showNotification = originalShowNotification;
            }, 500);
        }
    }
}

/**
 * 处理复制案例事件
 */
function handleCopyCase() {
    const textarea = document.querySelector('.ideology-result .case-content-textarea:not([style*="display: none"])');
    if (textarea) {
        textarea.select();
        document.execCommand('copy');
        
        // 禁止显示复制成功的弹窗通知
        if (typeof window.showNotification === 'function') {
            const originalShowNotification = window.showNotification;
            window.showNotification = function() {
                console.log('复制案例通知已屏蔽');
                return;
            };
            
            setTimeout(() => {
                window.showNotification = originalShowNotification;
            }, 500);
        }
    }
}

/**
 * 显示思政案例结果区域
 */
function showIdeologyResult() {
    const ideologyResult = document.querySelector('.ideology-result');
    if (ideologyResult) {
        ideologyResult.style.display = 'block';
    }
}

/**
 * 隐藏思政案例结果区域
 */
function hideIdeologyResult() {
    const ideologyResult = document.querySelector('.ideology-result');
    if (ideologyResult) {
        ideologyResult.style.display = 'none';
    }
}

/**
 * 初始化讨论题生成功能
 */
function initDiscussionTopics() {
    // 获取讨论题生成按钮
    const discussionGenerateBtn = document.querySelector('.discussion-generator .generate-btn');
    if (!discussionGenerateBtn) {
        console.error('讨论题生成按钮未找到');
        return;
    }
    
    // 移除原有事件，避免重复绑定
    const newGenerateBtn = discussionGenerateBtn.cloneNode(true);
    discussionGenerateBtn.parentNode.replaceChild(newGenerateBtn, discussionGenerateBtn);
    
    // 添加点击事件处理
    newGenerateBtn.addEventListener('click', handleGenerateDiscussion);
    
    // 设置讨论题列表样式
    const discussionList = document.querySelector('.discussion-result .discussion-list');
    if (discussionList) {
        discussionList.style.maxHeight = '400px';
        discussionList.style.overflowY = 'auto';
    }
}

/**
 * 处理生成讨论题按钮点击
 */
function handleGenerateDiscussion() {
    console.log('讨论题生成按钮被点击');
    
    // 获取输入值
    const themeInput = document.querySelector('.discussion-generator .form-input:not([style*="display: none"])');
    if (!themeInput) {
        console.error('无法找到讨论题主题输入元素');
        showToast('无法找到主题输入框', 'error');
        return;
    }
    
    const theme = themeInput.value.trim();
    if (!theme) {
        showToast('请输入讨论主题', 'error');
        return;
    }
    
    // 获取讨论题数量和类型
    const countInput = document.querySelector('.discussion-generator .option-input');
    const typeSelect = document.querySelector('.discussion-generator .ideology-select');
    
    const count = countInput ? parseInt(countInput.value, 10) : 3;
    const type = typeSelect ? typeSelect.value : 'basic';
    
    console.log('讨论题生成参数:', { theme, count, type });
    
    // 显示加载状态
    const resultContainer = document.querySelector('.discussion-result .discussion-list');
    if (resultContainer) {
        resultContainer.innerHTML = '<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i><p class="zh">正在生成讨论题，请稍候...</p></div>';
    }
    
    // 生成讨论题按钮状态
    const generateBtn = document.querySelector('.discussion-generator .generate-btn');
    if (generateBtn) {
        generateBtn.disabled = true;
        
        // 保存原始文本
        const originalText = generateBtn.innerHTML;
        
        // 设置加载状态
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';
        
        // 恢复函数
        const restoreButton = () => {
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalText;
        };
        
        // 尝试从API获取讨论题
        fetchDiscussionTopics(theme, count, type)
            .then(topics => {
                displayDiscussionTopics(topics);
                restoreButton();
                showToast('讨论题生成成功', 'success');
            })
            .catch(error => {
                console.error('获取讨论题失败:', error);
                restoreButton();
                
                if (resultContainer) {
                    resultContainer.innerHTML = `<div class="error-message" style="color:#f44336;padding:15px;background:#ffebee;border-radius:8px;text-align:center;">
                        <i class="fas fa-exclamation-circle" style="font-size:24px;margin-bottom:10px;"></i>
                        <p>生成失败，请稍后重试</p>
                        <small>${error.message}</small>
                    </div>`;
                }
                
                // 使用默认讨论题以确保用户体验
                setTimeout(() => {
                    const defaultTopics = [
                        `请结合当下社会现状，分析"${theme}"的现代意义。`,
                        `从文化传承的角度，探讨"${theme}"在当代的实践方式。`,
                        `"${theme}"体现了哪些中华优秀传统文化的核心价值观？`
                    ];
                    displayDiscussionTopics(defaultTopics);
                    showToast('已显示默认讨论题', 'info');
                }, 2000);
            });
    } else {
        // 如果找不到按钮，直接尝试获取讨论题
        fetchDiscussionTopics(theme, count, type)
            .then(topics => {
                displayDiscussionTopics(topics);
            })
            .catch(error => {
                console.error('获取讨论题失败:', error);
                if (resultContainer) {
                    resultContainer.innerHTML = `<div class="error-message">生成失败，请稍后重试<br>错误信息: ${error.message}</div>`;
                }
            });
    }
}

/**
 * 从API获取讨论题
 * @param {string} theme 主题
 * @param {number} count 数量
 * @param {string} type 类型
 * @returns {Promise<Array<string>>} 讨论题列表
 */
async function fetchDiscussionTopics(theme, count, type) {
    try {
        console.log('开始获取讨论题，参数:', { theme, count, type });
        // 定义API基础URL
        const apiBaseUrl = window.API_BASE_URL || 'http://localhost:3000';
        
        // 类型映射，确保type为后端需要的字符串
        const typeMapping = {
            'basic': 'basic',
            'critical': 'critical',
            'creative': 'creative',
            'applied': 'applied',
            '1': 'basic',
            '2': 'critical',
            '3': 'creative',
            '4': 'applied',
            1: 'basic',
            2: 'critical',
            3: 'creative',
            4: 'applied'
        };
        console.log('type原始值:', type, typeof type);
        const mappedType = typeMapping[type] || 'basic';
        console.log('最终传递给后端的type:', mappedType, typeof mappedType);
        // 章节ID强制转为整数
        let chapterId = 1;
        if (window.currentChapterId !== undefined && window.currentChapterId !== null && window.currentChapterId !== '') {
            chapterId = parseInt(window.currentChapterId, 10);
            if (isNaN(chapterId)) chapterId = 1;
        }
        
        // 构建请求参数，确保类型正确
        const requestData = {
            theme: theme,
            count: parseInt(count, 10),
            type: mappedType,
            chapterId: chapterId
        };
        
        console.log('请求数据:', requestData);
        console.log('请求URL:', `${apiBaseUrl}/api/ideology/topics/generate`);
        
        // 发送API请求
        const response = await fetch(`${apiBaseUrl}/api/ideology/topics/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        console.log('API响应状态:', response.status);
        
        const responseText = await response.text();
        console.log('API响应内容:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('解析JSON响应失败:', e);
            throw new Error(`无法解析服务器响应: ${responseText}`);
        }
        
        // 适配返回数据结构
        if (data && data.data) {
            if (Array.isArray(data.data.topics)) {
                console.log('获取到讨论题数组:', data.data.topics);
                return data.data.topics;
            } else if (Array.isArray(data.data.discussions)) {
                console.log('获取到讨论题对象数组，提取content字段');
                return data.data.discussions.map(item => typeof item === 'object' ? item.content : item);
            }
        }
        
        // 处理服务器返回的错误信息
        if (data && data.message) {
            throw new Error(data.message);
        }
        
        // 如果无法获取有效的讨论题，创建一些默认的讨论题
        console.warn('无法从API获取有效的讨论题，使用默认讨论题');
        return [
            `请结合当下社会现状，分析"${theme}"的现代意义。`,
            `从文化传承的角度，探讨"${theme}"在当代的实践方式。`,
            `"${theme}"体现了哪些中华优秀传统文化的核心价值观？`
        ];
    } catch (error) {
        console.error('获取讨论题失败:', error);
        
        // 返回一些基于主题的默认讨论题，而不是抛出错误
        const defaultTopics = [
            `请结合当下社会现状，分析"${theme}"的现代意义。`,
            `从文化传承的角度，探讨"${theme}"在当代的实践方式。`,
            `"${theme}"体现了哪些中华优秀传统文化的核心价值观？`
        ];
        
        return defaultTopics;
    }
}

/**
 * 显示讨论题列表
 * @param {Array<string>} topics 讨论题列表
 */
function displayDiscussionTopics(topics) {
    const resultContainer = document.querySelector('.discussion-result .discussion-list');
    if (!resultContainer) return;
    
    // 清空内容
    resultContainer.innerHTML = '';
    
    // 添加讨论题列表
    topics.forEach((topic, index) => {
        const discussionItem = document.createElement('div');
        discussionItem.className = 'discussion-item';
        discussionItem.style.marginBottom = '15px';
        discussionItem.style.padding = '15px';
        discussionItem.style.backgroundColor = '#f9f9f9';
        discussionItem.style.borderRadius = '8px';
        discussionItem.style.border = '1px solid #e0e0e0';
        discussionItem.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        
        discussionItem.innerHTML = `
            <div class="discussion-number" style="display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; background-color: #1976d2; color: white; border-radius: 50%; margin-right: 12px; font-weight: bold;">${index + 1}</div>
            <div class="discussion-content" style="display: inline-block; width: calc(100% - 90px); vertical-align: middle;">
                <p class="zh" style="margin: 0; font-size: 14px; line-height: 1.5;">${topic}</p>
                <p class="en" style="margin: 0; display: none;">${topic}</p>
            </div>
            <div class="discussion-actions" style="display: inline-block; vertical-align: middle; text-align: right;">
                <button class="action-btn-small edit-topic" style="background: none; border: none; cursor: pointer; color: #1976d2; margin-right: 5px;"><i class="fas fa-edit"></i></button>
                <button class="action-btn-small delete-topic" style="background: none; border: none; cursor: pointer; color: #f44336;"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        resultContainer.appendChild(discussionItem);
    });
    
    // 添加编辑和删除功能
    addTopicItemEvents();
    
    // 确保控制按钮存在
    ensureControlButtons();
}

/**
 * 为讨论题项添加事件
 */
function addTopicItemEvents() {
    // 添加编辑按钮事件
    const editButtons = document.querySelectorAll('.discussion-item .edit-topic');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const contentP = this.closest('.discussion-item').querySelector('.discussion-content p.zh');
            const currentText = contentP.textContent;
            
            // 创建一个临时的textarea
            const textarea = document.createElement('textarea');
            textarea.value = currentText;
            textarea.style.width = '100%';
            textarea.style.minHeight = '60px';
            textarea.style.padding = '8px';
            textarea.style.borderRadius = '4px';
            textarea.style.border = '1px solid #ccc';
            textarea.style.fontFamily = '"Microsoft YaHei", sans-serif';
            textarea.style.fontSize = '14px';
            
            // 替换原内容
            contentP.parentNode.replaceChild(textarea, contentP);
            textarea.focus();
            
            // 添加失去焦点事件
            textarea.addEventListener('blur', function() {
                const newText = this.value.trim();
                const newP = document.createElement('p');
                newP.className = 'zh';
                newP.style.margin = '0';
                newP.style.fontSize = '14px';
                newP.style.lineHeight = '1.5';
                newP.textContent = newText;
                
                this.parentNode.replaceChild(newP, this);
            });
        });
    });
    
    // 添加删除按钮事件
    const deleteButtons = document.querySelectorAll('.discussion-item .delete-topic');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.discussion-item');
            item.remove();
            
            // 重新排序序号
            updateTopicNumbers();
        });
    });
}

/**
 * 更新讨论题序号
 */
function updateTopicNumbers() {
    const items = document.querySelectorAll('.discussion-item');
    items.forEach((item, index) => {
        const numberDiv = item.querySelector('.discussion-number');
        if (numberDiv) {
            numberDiv.textContent = index + 1;
        }
    });
}

/**
 * 确保控制按钮存在
 */
function ensureControlButtons() {
    const resultContainer = document.querySelector('.discussion-result');
    if (!resultContainer) return;
    
    // 检查是否已存在控制按钮
    let controlsDiv = resultContainer.querySelector('.discussion-controls');
    
    if (!controlsDiv) {
        // 创建控制按钮
        controlsDiv = document.createElement('div');
        controlsDiv.className = 'discussion-controls';
        controlsDiv.style.marginTop = '20px';
        controlsDiv.style.textAlign = 'center';
        
        controlsDiv.innerHTML = `
            <button class="btn-secondary" style="background-color: #1976d2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; font-size: 14px;">
                <i class="fas fa-save"></i>
                <span class="zh">保存讨论题</span>
                <span class="en">Save Topics</span>
            </button>
            <button class="btn-secondary" style="background-color: #4caf50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                <i class="fas fa-plus"></i>
                <span class="zh">添加讨论题</span>
                <span class="en">Add Topic</span>
            </button>
        `;
        
        resultContainer.appendChild(controlsDiv);
        
        // 绑定事件
        const saveBtn = controlsDiv.querySelector('.btn-secondary:first-child');
        const addBtn = controlsDiv.querySelector('.btn-secondary:last-child');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', saveDiscussionTopics);
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                addNewDiscussionTopic();
            });
        }
    }
}

/**
 * 添加新的讨论题
 */
function addNewDiscussionTopic() {
    const resultContainer = document.querySelector('.discussion-result .discussion-list');
    if (!resultContainer) return;
    
    // 获取当前项目数
    const currentCount = resultContainer.querySelectorAll('.discussion-item').length;
    
    // 创建新的讨论题项
    const newItem = document.createElement('div');
    newItem.className = 'discussion-item';
    newItem.style.marginBottom = '15px';
    newItem.style.padding = '15px';
    newItem.style.backgroundColor = '#f9f9f9';
    newItem.style.borderRadius = '8px';
    newItem.style.border = '1px solid #e0e0e0';
    newItem.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
    
    newItem.innerHTML = `
        <div class="discussion-number" style="display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; background-color: #1976d2; color: white; border-radius: 50%; margin-right: 12px; font-weight: bold;">${currentCount + 1}</div>
        <div class="discussion-content" style="display: inline-block; width: calc(100% - 90px); vertical-align: middle;">
            <textarea style="width: 100%; min-height: 60px; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-family: 'Microsoft YaHei', sans-serif; font-size: 14px;" placeholder="请输入讨论题内容..."></textarea>
        </div>
        <div class="discussion-actions" style="display: inline-block; vertical-align: middle; text-align: right;">
            <button class="action-btn-small confirm-topic" style="background: none; border: none; cursor: pointer; color: #4caf50; margin-right: 5px;"><i class="fas fa-check"></i></button>
            <button class="action-btn-small cancel-topic" style="background: none; border: none; cursor: pointer; color: #f44336;"><i class="fas fa-times"></i></button>
        </div>
    `;
    
    resultContainer.appendChild(newItem);
    
    // 聚焦到文本框
    const textarea = newItem.querySelector('textarea');
    textarea.focus();
    
    // 添加确认按钮事件
    const confirmBtn = newItem.querySelector('.confirm-topic');
    confirmBtn.addEventListener('click', function() {
        const text = textarea.value.trim();
        if (!text) {
            return;
        }
        
        // 创建正式的内容
        const contentDiv = textarea.parentNode;
        contentDiv.innerHTML = `
            <p class="zh" style="margin: 0; font-size: 14px; line-height: 1.5;">${text}</p>
            <p class="en" style="margin: 0; display: none;">${text}</p>
        `;
        
        // 更改按钮
        const actionsDiv = this.parentNode;
        actionsDiv.innerHTML = `
            <button class="action-btn-small edit-topic" style="background: none; border: none; cursor: pointer; color: #1976d2; margin-right: 5px;"><i class="fas fa-edit"></i></button>
            <button class="action-btn-small delete-topic" style="background: none; border: none; cursor: pointer; color: #f44336;"><i class="fas fa-trash"></i></button>
        `;
        
        // 重新绑定事件
        addTopicItemEvents();
    });
    
    // 添加取消按钮事件
    const cancelBtn = newItem.querySelector('.cancel-topic');
    cancelBtn.addEventListener('click', function() {
        newItem.remove();
    });
}

/**
 * 初始化添加网络链接按钮
 */
function initUrlLinkButton() {
    const addUrlBtn = document.querySelector('.add-url-btn');
    if (!addUrlBtn) return;
    
    // 添加悬停效果
    addUrlBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#1565c0';
        this.style.boxShadow = '0 4px 8px rgba(25, 118, 210, 0.3)';
    });
    
    addUrlBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#1976d2';
        this.style.boxShadow = '0 2px 4px rgba(25, 118, 210, 0.2)';
    });
    
    // 添加点击事件
    addUrlBtn.addEventListener('click', function() {
        const urlInput = document.querySelector('.url-input:not([style*="display: none"])');
        if (!urlInput) return;
        
        const url = urlInput.value.trim();
        if (!url) {
            alert('请输入有效的网络链接');
            return;
        }
        
        // 检查URL是否有效
        if (!isValidUrl(url)) {
            alert('请输入有效的网络链接');
            return;
        }
        
        // 添加链接到资源列表
        addUrlToResourceList(url);
        
        // 清空输入框
        urlInput.value = '';
    });
}

/**
 * 检查URL是否有效
 * @param {string} url - 要检查的URL
 * @returns {boolean} - URL是否有效
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * 添加URL到资源列表
 * @param {string} url - 要添加的URL
 */
function addUrlToResourceList(url) {
    // 获取资源列表容器
    const resourcesContainer = document.querySelector('.uploaded-resources');
    if (!resourcesContainer) return;
    
    // 移除占位符
    const placeholder = resourcesContainer.querySelector('.resource-placeholder');
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    // 检查是否已有资源列表，如果没有则创建
    let resourcesList = resourcesContainer.querySelector('.resources-list');
    if (!resourcesList) {
        resourcesList = document.createElement('div');
        resourcesList.className = 'resources-list';
        resourcesList.style.marginTop = '15px';
        resourcesContainer.appendChild(resourcesList);
    }
    
    // 创建新的资源项
    const resourceItem = document.createElement('div');
    resourceItem.className = 'resource-item';
    resourceItem.style.display = 'flex';
    resourceItem.style.alignItems = 'center';
    resourceItem.style.justifyContent = 'space-between';
    resourceItem.style.padding = '12px 15px';
    resourceItem.style.margin = '8px 0';
    resourceItem.style.backgroundColor = '#f9f9f9';
    resourceItem.style.borderRadius = '8px';
    resourceItem.style.border = '1px solid #e0e0e0';
    
    // 根据URL类型添加不同的图标
    let icon = 'fa-link';
    if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
        icon = 'fa-image';
    } else if (url.match(/\.(mp4|avi|mov|wmv)$/i)) {
        icon = 'fa-video';
    }
    
    // 显示链接内容
    const urlDisplay = url.length > 40 ? url.substring(0, 37) + '...' : url;
    
    resourceItem.innerHTML = `
        <div class="resource-info" style="display: flex; align-items: center;">
            <i class="fas ${icon}" style="margin-right: 12px; color: #1976d2; font-size: 16px;"></i>
            <div>
                <div class="resource-name" style="font-weight: 500;">${urlDisplay}</div>
                <div class="resource-type" style="font-size: 12px; color: #666;">网络链接</div>
            </div>
        </div>
        <div class="resource-actions">
            <button class="resource-action-btn view" style="background: none; border: none; cursor: pointer; color: #1976d2; margin-right: 8px;">
                <i class="fas fa-external-link-alt"></i>
            </button>
            <button class="resource-action-btn delete" style="background: none; border: none; cursor: pointer; color: #f44336;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // 添加到资源列表
    resourcesList.appendChild(resourceItem);
    
    // 更新资源计数
    updateResourceCount();
    
    // 添加查看和删除事件
    const viewBtn = resourceItem.querySelector('.resource-action-btn.view');
    const deleteBtn = resourceItem.querySelector('.resource-action-btn.delete');
    
    if (viewBtn) {
        viewBtn.addEventListener('click', function() {
            window.open(url, '_blank');
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            resourceItem.remove();
            updateResourceCount();
            
            // 如果没有资源了，显示占位符
            if (resourcesList.children.length === 0 && placeholder) {
                placeholder.style.display = 'block';
            }
        });
    }
}

/**
 * 更新资源计数
 */
function updateResourceCount() {
    const resourcesCount = document.querySelectorAll('.resources-list .resource-item').length;
    const resourceHeader = document.querySelector('.resource-header');
    
    if (resourceHeader) {
        const zhHeader = resourceHeader.querySelector('h4.zh');
        const enHeader = resourceHeader.querySelector('h4.en');
        
        if (zhHeader) {
            zhHeader.textContent = `已上传资源 (${resourcesCount})`;
        }
        
        if (enHeader) {
            enHeader.textContent = `Uploaded Resources (${resourcesCount})`;
        }
    }
}

/**
 * 初始化文件上传功能
 */
function initFileUpload() {
    const fileInput = document.querySelector('.file-upload-large .file-input');
    const filePreview = document.querySelector('.file-upload-large .file-preview-large');
    
    if (!fileInput || !filePreview) return;
    
    // 美化文件上传区域
    filePreview.style.border = '2px dashed #e0e0e0';
    filePreview.style.borderRadius = '12px';
    filePreview.style.padding = '30px 20px';
    filePreview.style.textAlign = 'center';
    filePreview.style.cursor = 'pointer';
    filePreview.style.backgroundColor = '#f9f9f9';
    filePreview.style.transition = 'all 0.3s ease';
    
    // 添加鼠标悬停效果
    filePreview.addEventListener('mouseenter', function() {
        this.style.borderColor = '#1976d2';
        this.style.backgroundColor = '#f0f8ff';
        this.style.boxShadow = '0 0 8px rgba(25,118,210,0.2)';
    });
    
    filePreview.addEventListener('mouseleave', function() {
        this.style.borderColor = '#e0e0e0';
        this.style.backgroundColor = '#f9f9f9';
        this.style.boxShadow = 'none';
    });
    
    // 触发文件选择对话框
    filePreview.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 拖放文件功能
    filePreview.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#1976d2';
        this.style.backgroundColor = '#f0f8ff';
        this.style.boxShadow = '0 0 12px rgba(25,118,210,0.3)';
    });
    
    filePreview.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#e0e0e0';
        this.style.backgroundColor = '#f9f9f9';
        this.style.boxShadow = 'none';
    });
    
    filePreview.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#e0e0e0';
        this.style.backgroundColor = '#f9f9f9';
        this.style.boxShadow = 'none';
        
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(e.dataTransfer.files);
        }
    });
    
    // 处理文件选择
    fileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            handleFileSelect(this.files);
        }
    });
    
    /**
     * 处理文件选择
     * @param {FileList} files - 选择的文件列表
     */
    function handleFileSelect(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // 检查文件类型
            if (!isValidFileType(file)) {
                alert('不支持的文件格式，请选择MP4视频或JPG/PNG图片');
                continue;
            }
            
            // 上传文件到资源列表
            addFileToResourceList(file);
        }
        
        // 清空文件输入框，以便再次选择相同文件
        fileInput.value = '';
    }
    
    /**
     * 检查文件类型是否有效
     * @param {File} file - 要检查的文件
     * @returns {boolean} - 文件类型是否有效
     */
    function isValidFileType(file) {
        const validTypes = ['image/jpeg', 'image/png', 'video/mp4'];
        return validTypes.includes(file.type);
    }
    
    /**
     * 添加文件到资源列表
     * @param {File} file - 要添加的文件
     */
    function addFileToResourceList(file) {
        // 获取资源列表容器
        const resourcesContainer = document.querySelector('.uploaded-resources');
        if (!resourcesContainer) return;
        
        // 移除占位符
        const placeholder = resourcesContainer.querySelector('.resource-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        // 检查是否已有资源列表，如果没有则创建
        let resourcesList = resourcesContainer.querySelector('.resources-list');
        if (!resourcesList) {
            resourcesList = document.createElement('div');
            resourcesList.className = 'resources-list';
            resourcesList.style.marginTop = '15px';
            resourcesContainer.appendChild(resourcesList);
        }
        
        // 创建新的资源项
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        resourceItem.style.display = 'flex';
        resourceItem.style.alignItems = 'center';
        resourceItem.style.justifyContent = 'space-between';
        resourceItem.style.padding = '12px 15px';
        resourceItem.style.margin = '8px 0';
        resourceItem.style.backgroundColor = '#f9f9f9';
        resourceItem.style.borderRadius = '8px';
        resourceItem.style.border = '1px solid #e0e0e0';
        
        // 根据文件类型设置图标
        let icon = 'fa-file';
        let typeName = '文件';
        
        if (file.type.startsWith('image/')) {
            icon = 'fa-image';
            typeName = '图片';
        } else if (file.type.startsWith('video/')) {
            icon = 'fa-video';
            typeName = '视频';
        }
        
        // 创建预览用的URL（在内存中）
        const fileUrl = URL.createObjectURL(file);
        
        resourceItem.innerHTML = `
            <div class="resource-info" style="display: flex; align-items: center;">
                <i class="fas ${icon}" style="margin-right: 12px; color: #1976d2; font-size: 16px;"></i>
                <div>
                    <div class="resource-name" style="font-weight: 500;">${file.name}</div>
                    <div class="resource-type" style="font-size: 12px; color: #666;">${typeName} - ${formatFileSize(file.size)}</div>
                </div>
            </div>
            <div class="resource-actions">
                <button class="resource-action-btn view" style="background: none; border: none; cursor: pointer; color: #1976d2; margin-right: 8px;">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="resource-action-btn delete" style="background: none; border: none; cursor: pointer; color: #f44336;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // 添加到资源列表
        resourcesList.appendChild(resourceItem);
        
        // 更新资源计数
        updateResourceCount();
        
        // 添加查看和删除事件
        const viewBtn = resourceItem.querySelector('.resource-action-btn.view');
        const deleteBtn = resourceItem.querySelector('.resource-action-btn.delete');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                // 根据文件类型预览
                if (file.type.startsWith('image/')) {
                    showImagePreview(fileUrl, file.name);
                } else if (file.type.startsWith('video/')) {
                    showVideoPreview(fileUrl, file.name);
                }
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                // 释放URL
                URL.revokeObjectURL(fileUrl);
                resourceItem.remove();
                updateResourceCount();
                
                // 如果没有资源了，显示占位符
                if (resourcesList.children.length === 0 && placeholder) {
                    placeholder.style.display = 'block';
                }
            });
        }
    }
    
    /**
     * 显示图片预览
     * @param {string} url - 图片URL
     * @param {string} name - 图片名称
     */
    function showImagePreview(url, name) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.zIndex = '9999';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.flexDirection = 'column';
        
        const image = document.createElement('img');
        image.src = url;
        image.alt = name;
        image.style.maxWidth = '80%';
        image.style.maxHeight = '80%';
        image.style.borderRadius = '8px';
        image.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '关闭预览';
        closeButton.style.marginTop = '20px';
        closeButton.style.padding = '8px 20px';
        closeButton.style.backgroundColor = '#ffffff';
        closeButton.style.color = '#333';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.appendChild(image);
        modal.appendChild(closeButton);
        document.body.appendChild(modal);
        
        // 点击模态框背景也可以关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    /**
     * 显示视频预览
     * @param {string} url - 视频URL
     * @param {string} name - 视频名称
     */
    function showVideoPreview(url, name) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.zIndex = '9999';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.flexDirection = 'column';
        
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = '80%';
        video.style.maxHeight = '80%';
        video.style.borderRadius = '8px';
        video.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '关闭预览';
        closeButton.style.marginTop = '20px';
        closeButton.style.padding = '8px 20px';
        closeButton.style.backgroundColor = '#ffffff';
        closeButton.style.color = '#333';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.appendChild(video);
        modal.appendChild(closeButton);
        document.body.appendChild(modal);
        
        // 点击模态框背景也可以关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    /**
     * 格式化文件大小
     * @param {number} bytes - 文件大小（字节）
     * @returns {string} - 格式化后的文件大小
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

/**
 * 初始化思政案例表格样式
 */
function initIdeologyCasesTable() {
    // 获取思政案例列表容器
    const ideologyCasesContainer = document.querySelector('.ideology-cases-list');
    if (!ideologyCasesContainer) {
        console.error('找不到思政案例列表容器');
        return;
    }
    
    // 美化列表容器样式，参考知识拓展列表
    ideologyCasesContainer.style.marginTop = '30px';
    ideologyCasesContainer.style.padding = '25px';
    ideologyCasesContainer.style.backgroundColor = '#ffffff';
    ideologyCasesContainer.style.borderRadius = '12px';
    ideologyCasesContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    ideologyCasesContainer.style.transition = 'all 0.3s ease';
    ideologyCasesContainer.style.border = '1px solid #e0e0e0';
    
    // 美化列表标题和按钮容器
    const listHeader = ideologyCasesContainer.querySelector('.list-header');
    if (listHeader) {
        listHeader.style.display = 'flex';
        listHeader.style.justifyContent = 'space-between';
        listHeader.style.alignItems = 'center';
        listHeader.style.marginBottom = '20px';
        listHeader.style.paddingBottom = '15px';
        listHeader.style.borderBottom = '1px solid #eaeaea';
    }
    
    // 美化标题
    const headerTitles = ideologyCasesContainer.querySelectorAll('.list-header h4');
    headerTitles.forEach(title => {
        title.style.fontSize = '18px';
        title.style.fontWeight = '600';
        title.style.color = '#333';
        title.style.margin = '0';
    });
    
    // 美化表格
    const casesTable = ideologyCasesContainer.querySelector('.cases-table');
    if (casesTable) {
        casesTable.style.width = '100%';
        casesTable.style.borderCollapse = 'collapse';
        casesTable.style.borderSpacing = '0';
        casesTable.style.tableLayout = 'fixed';
        
        // 美化表头
        const tableHead = casesTable.querySelector('thead');
        if (tableHead) {
            const headerRow = tableHead.querySelector('tr');
            if (headerRow) {
                headerRow.style.backgroundColor = '#f5f7fa';
                headerRow.style.color = '#555';
                headerRow.style.fontSize = '14px';
                headerRow.style.fontWeight = '600';
                headerRow.style.textAlign = 'left';
                
                // 设置表头单元格样式
                const headerCells = headerRow.querySelectorAll('th');
                headerCells.forEach(cell => {
                    cell.style.padding = '12px 15px';
                    cell.style.borderBottom = '1px solid #e0e0e0';
                });
                
                // 设置表头列宽
                if (headerCells.length >= 4) {
                    headerCells[0].style.width = '80px'; // 序号列
                    headerCells[1].style.width = ''; // 标题列，自适应
                    headerCells[2].style.width = '120px'; // 资源列
                    headerCells[3].style.width = '120px'; // 操作列
                }
            }
        }
        
        // 美化表格主体
        const tableBody = casesTable.querySelector('tbody');
        if (tableBody) {
            // 设置表格行样式
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                // 添加行高
                row.style.height = '60px';
                
                // 鼠标悬停效果
                row.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = '#f9f9f9';
                });
                
                row.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'transparent';
                });
                
                // 美化单元格
                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.padding = '12px 15px';
                    cell.style.borderBottom = '1px solid #eaeaea';
                    cell.style.color = '#333';
                    cell.style.fontSize = '14px';
                    cell.style.verticalAlign = 'middle';
                });
                
                // 美化标题单元格
                const titleCell = row.querySelector('td:nth-child(2)');
                if (titleCell) {
                    const titleElements = titleCell.querySelectorAll('p');
                    titleElements.forEach(title => {
                        title.style.margin = '0';
                        title.style.lineHeight = '1.4';
                        title.style.fontWeight = '500';
                        // 只显示标题，不显示"案例标题："前缀
                        if (title.textContent.includes('案例标题：')) {
                            title.textContent = title.textContent.replace('案例标题：', '');
                        }
                    });
                }
                
                // 美化资源标签
                const resourceCell = row.querySelector('td:nth-child(3)');
                if (resourceCell) {
                    const tags = resourceCell.querySelectorAll('.resource-tag');
                    tags.forEach(tag => {
                        tag.style.display = 'inline-block';
                        tag.style.margin = '0 4px 4px 0';
                        tag.style.padding = '4px 8px';
                        tag.style.borderRadius = '4px';
                        tag.style.fontSize = '12px';
                        tag.style.cursor = 'pointer';
                        
                        // 根据资源类型设置不同背景色
                        if (tag.classList.contains('image')) {
                            tag.style.backgroundColor = 'rgba(25, 118, 210, 0.1)';
                            tag.style.color = '#1976d2';
                        } else if (tag.classList.contains('video')) {
                            tag.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                            tag.style.color = '#4caf50';
                        } else if (tag.classList.contains('link')) {
                            tag.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
                            tag.style.color = '#ff9800';
                        }
                        
                        // 设置图标样式
                        const icon = tag.querySelector('i');
                        if (icon) {
                            icon.style.marginRight = '4px';
                        }
                    });
                }
                
                // 美化操作按钮
                const actionCell = row.querySelector('td:nth-child(4)');
                if (actionCell) {
                    const buttons = actionCell.querySelectorAll('button');
                    buttons.forEach(btn => {
                        btn.style.width = '32px';
                        btn.style.height = '32px';
                        btn.style.padding = '0';
                        btn.style.margin = '0 4px';
                        btn.style.border = 'none';
                        btn.style.borderRadius = '4px';
                        btn.style.cursor = 'pointer';
                        btn.style.display = 'inline-flex';
                        btn.style.alignItems = 'center';
                        btn.style.justifyContent = 'center';
                        btn.style.transition = 'all 0.2s ease';
                        
                        // 设置按钮背景色
                        if (btn.classList.contains('view')) {
                            btn.style.backgroundColor = 'rgba(25, 118, 210, 0.1)';
                            btn.style.color = '#1976d2';
                        } else if (btn.classList.contains('edit')) {
                            btn.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
                            btn.style.color = '#ff9800';
                        } else if (btn.classList.contains('delete')) {
                            btn.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
                            btn.style.color = '#f44336';
                        }
                        
                        // 添加悬停效果
                        btn.addEventListener('mouseenter', function() {
                            if (this.classList.contains('view')) {
                                this.style.backgroundColor = 'rgba(25, 118, 210, 0.2)';
                            } else if (this.classList.contains('edit')) {
                                this.style.backgroundColor = 'rgba(255, 152, 0, 0.2)';
                            } else if (this.classList.contains('delete')) {
                                this.style.backgroundColor = 'rgba(244, 67, 54, 0.2)';
                            }
                        });
                        
                        btn.addEventListener('mouseleave', function() {
                            if (this.classList.contains('view')) {
                                this.style.backgroundColor = 'rgba(25, 118, 210, 0.1)';
                            } else if (this.classList.contains('edit')) {
                                this.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
                            } else if (this.classList.contains('delete')) {
                                this.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
                            }
                        });
                    });
                }
            });
        }
    }
    
    // 添加按钮事件
    initCaseTableEvents();
}

/**
 * 初始化思政案例表格事件
 */
function initCaseTableEvents() {
    // 获取所有操作按钮
    const viewButtons = document.querySelectorAll('.cases-table .case-action-btn.view');
    const editButtons = document.querySelectorAll('.cases-table .case-action-btn.edit');
    const deleteButtons = document.querySelectorAll('.cases-table .case-action-btn.delete');
    
    // 添加查看按钮事件
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const caseId = row.dataset.caseId || '';
            const title = row.querySelector('td:nth-child(2) p.zh').textContent;
            
            // 查看案例详情
            showCaseDetailModal(caseId, title, row);
        });
    });
    
    // 添加编辑按钮事件
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const caseId = row.dataset.caseId || '';
            
            // 编辑案例
            editCase(caseId, row);
        });
    });
    
    // 添加删除按钮事件
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const caseId = row.dataset.caseId || '';
            const title = row.querySelector('td:nth-child(2) p.zh').textContent;
            
            // 删除案例
            confirmDeleteCase(caseId, title, row);
        });
    });
    
    // 添加资源标签事件 - 点击可以预览资源
    const resourceTags = document.querySelectorAll('.cases-table .resource-tag');
    resourceTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const row = this.closest('tr');
            const caseId = row.dataset.caseId || '';
            const resourceType = this.classList.contains('image') ? 'image' : 
                                this.classList.contains('video') ? 'video' : 'link';
            
            // 预览资源
            previewCaseResource(caseId, resourceType, row);
        });
    });
}

/**
 * 显示案例详情模态框
 * @param {string} caseId - 案例ID
 * @param {string} title - 案例标题
 * @param {HTMLElement} row - 表格行元素
 */
function showCaseDetailModal(caseId, title, row) {
    // 从行中获取案例信息（用于本地模拟，实际项目中应通过API获取）
    let caseDetail = {
        id: caseId || Date.now().toString(),
        title: title,
        content: '加载中...',
        resources: []
    };
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'case-detail-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    
    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '900px';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.overflow = 'hidden';
    
    // 创建模态框头部
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.style.padding = '20px 24px';
    modalHeader.style.borderBottom = '1px solid #eaeaea';
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.alignItems = 'center';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = title;
    modalTitle.style.margin = '0';
    modalTitle.style.fontSize = '20px';
    modalTitle.style.fontWeight = '600';
    modalTitle.style.color = '#333';
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#666';
    closeButton.style.padding = '0';
    closeButton.style.lineHeight = '1';
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // 创建模态框内容
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.style.padding = '20px 24px';
    modalBody.style.overflowY = 'auto';
    modalBody.style.maxHeight = 'calc(80vh - 130px)';
    
    // 案例内容区域
    const contentSection = document.createElement('div');
    contentSection.className = 'case-content-section';
    contentSection.style.marginBottom = '24px';
    
    const contentTitle = document.createElement('h4');
    contentTitle.textContent = '案例内容';
    contentTitle.style.fontSize = '16px';
    contentTitle.style.fontWeight = '600';
    contentTitle.style.marginTop = '0';
    contentTitle.style.marginBottom = '16px';
    contentTitle.style.paddingBottom = '8px';
    contentTitle.style.borderBottom = '1px solid #eaeaea';
    
    const content = document.createElement('div');
    content.className = 'case-content';
    content.style.fontSize = '14px';
    content.style.lineHeight = '1.6';
    content.style.whiteSpace = 'pre-wrap';
    content.textContent = caseDetail.content;
    
    contentSection.appendChild(contentTitle);
    contentSection.appendChild(content);
    
    // 资源区域
    const resourcesSection = document.createElement('div');
    resourcesSection.className = 'case-resources-section';
    
    const resourcesTitle = document.createElement('h4');
    resourcesTitle.textContent = '关联资源';
    resourcesTitle.style.fontSize = '16px';
    resourcesTitle.style.fontWeight = '600';
    resourcesTitle.style.marginTop = '0';
    resourcesTitle.style.marginBottom = '16px';
    resourcesTitle.style.paddingBottom = '8px';
    resourcesTitle.style.borderBottom = '1px solid #eaeaea';
    
    const resourcesList = document.createElement('div');
    resourcesList.className = 'resources-list';
    resourcesList.style.display = 'flex';
    resourcesList.style.flexWrap = 'wrap';
    
    // 获取资源标签，用于展示
    const resourceTags = row.querySelectorAll('.resource-tag');
    let hasResources = resourceTags.length > 0;
    
    if (hasResources) {
        resourceTags.forEach((tag, index) => {
            const resourceType = tag.classList.contains('image') ? 'image' : 
                                tag.classList.contains('video') ? 'video' : 'link';
            
            const resourceItem = document.createElement('div');
            resourceItem.className = 'resource-item';
            resourceItem.style.width = '120px';
            resourceItem.style.height = '100px';
            resourceItem.style.margin = '0 12px 12px 0';
            resourceItem.style.borderRadius = '8px';
            resourceItem.style.overflow = 'hidden';
            resourceItem.style.position = 'relative';
            resourceItem.style.cursor = 'pointer';
            resourceItem.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            
            // 根据资源类型设置不同的背景和图标
            if (resourceType === 'image') {
                resourceItem.style.backgroundColor = 'rgba(25, 118, 210, 0.1)';
                resourceItem.innerHTML = '<div style="height: 100%; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image" style="font-size: 32px; color: #1976d2;"></i></div>';
                resourceItem.innerHTML += '<div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; text-align: center; color: #333; font-size: 12px; background-color: rgba(255, 255, 255, 0.8);">图片 ' + (index + 1) + '</div>';
            } else if (resourceType === 'video') {
                resourceItem.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                resourceItem.innerHTML = '<div style="height: 100%; display: flex; align-items: center; justify-content: center;"><i class="fas fa-video" style="font-size: 32px; color: #4caf50;"></i></div>';
                resourceItem.innerHTML += '<div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; text-align: center; color: #333; font-size: 12px; background-color: rgba(255, 255, 255, 0.8);">视频 ' + (index + 1) + '</div>';
            } else if (resourceType === 'link') {
                resourceItem.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
                resourceItem.innerHTML = '<div style="height: 100%; display: flex; align-items: center; justify-content: center;"><i class="fas fa-link" style="font-size: 32px; color: #ff9800;"></i></div>';
                resourceItem.innerHTML += '<div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; text-align: center; color: #333; font-size: 12px; background-color: rgba(255, 255, 255, 0.8);">链接 ' + (index + 1) + '</div>';
            }
            
            // 添加点击事件
            resourceItem.addEventListener('click', function() {
                previewCaseResource(caseId, resourceType, row, index);
            });
            
            resourcesList.appendChild(resourceItem);
        });
    } else {
        // 没有资源时显示提示
        const noResources = document.createElement('div');
        noResources.textContent = '暂无关联资源';
        noResources.style.color = '#999';
        noResources.style.fontSize = '14px';
        noResources.style.padding = '20px 0';
        noResources.style.textAlign = 'center';
        noResources.style.width = '100%';
        
        resourcesList.appendChild(noResources);
    }
    
    resourcesSection.appendChild(resourcesTitle);
    resourcesSection.appendChild(resourcesList);
    
    modalBody.appendChild(contentSection);
    modalBody.appendChild(resourcesSection);
    
    // 模态框底部
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    modalFooter.style.padding = '16px 24px';
    modalFooter.style.borderTop = '1px solid #eaeaea';
    modalFooter.style.display = 'flex';
    modalFooter.style.justifyContent = 'flex-end';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.padding = '8px 16px';
    closeBtn.style.border = '1px solid #ddd';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.backgroundColor = '#f5f5f5';
    closeBtn.style.color = '#333';
    closeBtn.style.fontSize = '14px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginLeft = '8px';
    
    modalFooter.appendChild(closeBtn);
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // 添加关闭按钮事件
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // 获取案例详情（模拟）
    setTimeout(() => {
        // 模拟API请求延迟
        const contentText = `【${title}案例介绍】

中国传统茶馆在现代社会中焕发新生，老茶馆通过创新经营模式，融合传统文化与现代需求，重新获得了市场活力。

本案例展示了传统文化如何在保持其本质的同时，通过创新焕发新的生命力。茶馆从单纯的饮茶场所，转变为文化交流、社交活动和文艺表演的综合空间。

茶文化中的"和、敬、清、寂"理念，与社会主义核心价值观中的"和谐、友善、敬业"等价值高度契合，展示了传统文化的现代价值。

通过本案例，学生可以思考：
1. 传统文化如何在现代社会中找到立足点
2. 创新与传承的辩证关系
3. 文化自信的实践路径`;

        content.textContent = contentText;
    }, 500);
}

/**
 * 预览案例资源
 * @param {string} caseId - 案例ID
 * @param {string} resourceType - 资源类型
 * @param {HTMLElement} row - 表格行元素
 * @param {number} index - 资源索引
 */
function previewCaseResource(caseId, resourceType, row, index = 0) {
    // 模拟资源URL（实际项目中应通过API获取）
    let resourceUrl = '';
    let resourceName = '';
    
    // 根据资源类型生成模拟URL和名称
    if (resourceType === 'image') {
        resourceUrl = 'https://example.com/tea-house.jpg';
        resourceName = '茶馆实景图';
    } else if (resourceType === 'video') {
        resourceUrl = 'https://example.com/tea-culture.mp4';
        resourceName = '茶文化介绍视频';
    } else if (resourceType === 'link') {
        resourceUrl = 'https://example.com/article/tea-history';
        resourceName = '中国茶文化历史';
    }
    
    // 根据资源类型显示不同的预览模态框
    if (resourceType === 'image') {
        showImagePreviewModal(resourceUrl, resourceName);
    } else if (resourceType === 'video') {
        showVideoPreviewModal(resourceUrl, resourceName);
    } else if (resourceType === 'link') {
        // 对于链接，直接在新窗口打开
        window.open(resourceUrl, '_blank');
    }
}

/**
 * 显示图片预览模态框
 * @param {string} url - 图片URL
 * @param {string} name - 图片名称
 */
function showImagePreviewModal(url, name) {
    // 因为实际URL可能不存在，这里使用一个占位图片
    const placeholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15e8d59c125%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15e8d59c125%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9296875%22%20y%3D%22217.7%22%3E%E8%8C%B6%E9%A6%86%E5%AE%9E%E6%99%AF%E5%9B%BE%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.flexDirection = 'column';
    
    // 创建图片标题
    const title = document.createElement('h3');
    title.textContent = name || '图片预览';
    title.style.color = '#fff';
    title.style.margin = '0 0 20px 0';
    title.style.textAlign = 'center';
    
    // 创建图片元素
    const image = document.createElement('img');
    image.src = placeholderImage; // 使用占位图片
    image.alt = name;
    image.style.maxWidth = '80%';
    image.style.maxHeight = '70vh';
    image.style.borderRadius = '8px';
    image.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    
    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭预览';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#fff';
    closeButton.style.color = '#333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '14px';
    
    modal.appendChild(title);
    modal.appendChild(image);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
    
    // 添加关闭按钮事件
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // 点击模态框背景也可以关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

/**
 * 显示视频预览模态框
 * @param {string} url - 视频URL
 * @param {string} name - 视频名称
 */
function showVideoPreviewModal(url, name) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.flexDirection = 'column';
    
    // 创建视频标题
    const title = document.createElement('h3');
    title.textContent = name || '视频预览';
    title.style.color = '#fff';
    title.style.margin = '0 0 20px 0';
    title.style.textAlign = 'center';
    
    // 创建视频占位容器（实际URL可能不存在）
    const videoContainer = document.createElement('div');
    videoContainer.style.width = '640px';
    videoContainer.style.height = '360px';
    videoContainer.style.backgroundColor = '#111';
    videoContainer.style.borderRadius = '8px';
    videoContainer.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    videoContainer.style.display = 'flex';
    videoContainer.style.alignItems = 'center';
    videoContainer.style.justifyContent = 'center';
    videoContainer.style.flexDirection = 'column';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-video';
    icon.style.fontSize = '48px';
    icon.style.color = '#555';
    icon.style.marginBottom = '20px';
    
    const message = document.createElement('p');
    message.textContent = '视频资源无法加载';
    message.style.color = '#888';
    message.style.margin = '0';
    
    videoContainer.appendChild(icon);
    videoContainer.appendChild(message);
    
    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭预览';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#fff';
    closeButton.style.color = '#333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '14px';
    
    modal.appendChild(title);
    modal.appendChild(videoContainer);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
    
    // 添加关闭按钮事件
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // 点击模态框背景也可以关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

/**
 * 编辑思政案例
 * @param {string} caseId - 案例ID
 * @param {HTMLElement} row - 表格行元素
 */
function editCase(caseId, row) {
    // 获取案例标题
    const title = row.querySelector('td:nth-child(2) p.zh').textContent;
    
    // 显示提示
    alert(`编辑案例功能暂未实现\n\n案例ID: ${caseId}\n案例标题: ${title}`);
}

/**
 * 确认删除思政案例
 * @param {string} caseId - 案例ID
 * @param {string} title - 案例标题
 * @param {HTMLElement} row - 表格行元素
 */
function confirmDeleteCase(caseId, title, row) {
    if (confirm(`确定要删除案例"${title}"吗？此操作不可恢复。`)) {
        // 模拟删除操作
        setTimeout(() => {
            // 从DOM中移除行
            row.remove();
            
            // 重新编号
            updateCaseNumbers();
            
            // 显示删除成功提示
            showToast('案例删除成功');
        }, 500);
    }
}

/**
 * 更新案例序号
 */
function updateCaseNumbers() {
    const rows = document.querySelectorAll('.cases-table tbody tr');
    rows.forEach((row, index) => {
        const numCell = row.querySelector('td:first-child');
        if (numCell) {
            numCell.textContent = index + 1;
        }
    });
}

/**
 * 显示Toast提示
 * @param {string} message - 提示消息
 * @param {string} type - 提示类型
 */
function showToast(message, type = 'success') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '4px';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.15)';
    toast.style.zIndex = '10000';
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    
    // 根据类型设置不同样式
    if (type === 'success') {
        toast.style.backgroundColor = '#4caf50';
        toast.style.color = '#fff';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#f44336';
        toast.style.color = '#fff';
    } else if (type === 'warning') {
        toast.style.backgroundColor = '#ff9800';
        toast.style.color = '#fff';
    } else if (type === 'info') {
        toast.style.backgroundColor = '#2196f3';
        toast.style.color = '#fff';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 添加进入动画
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // 设置自动消失
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        
        // 完全消失后移除元素
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/**
 * 更新案例列表，添加新保存的案例
 * @param {Object} caseData - 案例数据
 * @param {number|string} caseId - 案例ID
 */
function refreshCasesList(caseData, caseId) {
    try {
        const casesTableBody = document.querySelector('#ideology-content .cases-table tbody');
        if (!casesTableBody) {
            console.warn('找不到案例表格，无法刷新案例列表');
            return;
        }
        
        // 获取资源计数
        const imageCount = caseData.image_count || 0;
        const videoCount = caseData.video_count || 0;
        const linkCount = caseData.link_count || 0;
        
        // 添加新行到表格
        const newRow = document.createElement('tr');
        const rowCount = casesTableBody.querySelectorAll('tr').length + 1;
        
        // 设置行的数据属性
        newRow.dataset.caseId = caseId;
        
        // 设置表格行内容
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>
                <p class="zh">${caseData.title}</p>
                <p class="en">${caseData.title}</p>
            </td>
            <td>
                <div class="resource-tags">
                    ${imageCount > 0 ? `<span class="resource-tag image"><i class="fas fa-image"></i>${imageCount > 1 ? ` <span class="count">${imageCount}</span>` : ''}</span>` : ''}
                    ${videoCount > 0 ? `<span class="resource-tag video"><i class="fas fa-video"></i>${videoCount > 1 ? ` <span class="count">${videoCount}</span>` : ''}</span>` : ''}
                    ${linkCount > 0 ? `<span class="resource-tag link"><i class="fas fa-link"></i>${linkCount > 1 ? ` <span class="count">${linkCount}</span>` : ''}</span>` : ''}
                </div>
            </td>
            <td>
                <button class="case-action-btn view"><i class="fas fa-eye"></i></button>
                <button class="case-action-btn edit"><i class="fas fa-edit"></i></button>
                <button class="case-action-btn delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // 添加到表格
        casesTableBody.appendChild(newRow);
        
        // 应用样式并重新绑定事件
        initIdeologyCasesTable();
        
        console.log('案例列表已更新');
    } catch (error) {
        console.error('更新案例列表失败:', error);
    }
}

// 保存讨论题
function saveDiscussionTopics() {
    // 获取主题、类型、章节ID
    const themeInput = document.querySelector('.discussion-generator .form-input:not([style*="display: none"])');
    const typeSelect = document.querySelector('.discussion-generator .ideology-select');
    const theme = themeInput ? themeInput.value.trim() : '';
    const type = typeSelect ? typeSelect.value : 'basic';
    const typeMapping = { basic: 1, critical: 2, creative: 3, applied: 4 };
    const discussionType = typeMapping[type] || 1;
    const chapterId = parseInt(window.currentChapterId, 10) || 1;
    const userId = 1;

    // 获取所有讨论题内容
    const items = document.querySelectorAll('.discussion-item .discussion-content p.zh, .discussion-item .discussion-content textarea');
    const topics = [];
    items.forEach(item => {
        const content = item.value ? item.value.trim() : item.textContent.trim();
        if (content) {
            topics.push({
                discussion_theme: theme,
                content,
                chapter_id: chapterId,
                user_id: userId,
                discussion_type: discussionType,
                is_ai_generated: 0
            });
        }
    });

    if (topics.length === 0) {
        showToast('没有可保存的讨论题', 'warning');
        return;
    }

    // 发送到后端
    (async () => {
        try {
            const apiBaseUrl = window.API_BASE_URL || 'http://localhost:3000';
            const response = await fetch(`${apiBaseUrl}/api/ideology/discussion/save-batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topics })
            });
            const result = await response.json();
            if (response.ok) {
                showToast('讨论题保存成功', 'success');
            } else {
                showToast('保存失败: ' + (result.message || '未知错误'), 'error');
            }
        } catch (e) {
            showToast('保存失败: ' + e.message, 'error');
        }
    })();
}

// 监听语言切换事件，自动切换思政模块内所有中英文内容
if (!window._ideologyLangListenerAdded) {
    document.body.addEventListener('langchange', function() {
        const isEnglish = document.body.classList.contains('en-mode');
        // 切换思政模块内所有.zh/.en元素的显示
        const ideologySections = document.querySelectorAll('.ideology-generation, .ideology-result, .ideology-cases-list, .discussion-generator, .discussion-result');
        ideologySections.forEach(section => {
            const zhEls = section.querySelectorAll('.zh');
            const enEls = section.querySelectorAll('.en');
            zhEls.forEach(el => { el.style.display = isEnglish ? 'none' : ''; });
            enEls.forEach(el => { el.style.display = isEnglish ? '' : 'none'; });
        });
    });
    window._ideologyLangListenerAdded = true;
}