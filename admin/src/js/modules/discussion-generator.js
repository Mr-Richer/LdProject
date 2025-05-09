/**
 * 思政讨论题生成模块
 * 处理讨论题的生成请求和结果展示
 */

// 模块初始化入口
document.addEventListener('DOMContentLoaded', function() {
    // 延迟加载，确保DOM完全加载
    setTimeout(() => {
        initDiscussionGenerator();
    }, 2500);
});

/**
 * 初始化讨论题生成功能
 */
function initDiscussionGenerator() {
    console.log('开始初始化讨论题生成按钮事件');
    
    // 绑定讨论题生成按钮点击事件
    const discussionGenerateBtn = document.querySelector('.discussion-generator .generate-btn');
    if (discussionGenerateBtn) {
        console.log('找到讨论题生成按钮，添加点击事件');
        
        // 移除现有事件监听器
        const newBtn = discussionGenerateBtn.cloneNode(true);
        discussionGenerateBtn.parentNode.replaceChild(newBtn, discussionGenerateBtn);
        
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
        newBtn.addEventListener('click', handleGenerateDiscussion);
        
        console.log('讨论题生成按钮事件绑定完成');
    } else {
        console.error('无法找到讨论题生成按钮');
    }
}

/**
 * 处理讨论题生成按钮点击
 */
function handleGenerateDiscussion() {
    console.log('讨论题生成按钮被点击');
    
    // 获取输入值
    const themeInput = document.querySelector('.discussion-generator .form-input:not([style*="display: none"])');
    if (!themeInput) {
        console.error('无法找到讨论题主题输入元素');
        return;
    }
    
    const theme = themeInput.value.trim();
    if (!theme) {
        return;
    }
    
    // 获取讨论题数量和类型
    const countInput = document.querySelector('.discussion-generator .option-input');
    const typeSelect = document.querySelector('.discussion-generator .ideology-select');
    
    const count = countInput ? parseInt(countInput.value, 10) : 3;
    const type = typeSelect ? typeSelect.value : 'basic';
    
    // 显示加载状态
    const resultContainer = document.querySelector('.discussion-result');
    if (resultContainer) {
        resultContainer.innerHTML = `
            <div class="result-header">
                <h4 class="zh">讨论题列表</h4>
                <h4 class="en">Discussion Topics</h4>
            </div>
            <div class="loading-placeholder">
                <i class="fas fa-spinner fa-spin"></i>
                <p class="zh">正在生成讨论题，请稍候...</p>
                <p class="en">Generating discussion topics, please wait...</p>
            </div>
        `;
    }
    
    // 获取当前章节ID
    const currentChapterId = window.currentChapterId || 1;
    
    // 调用API生成讨论题
    fetch('http://localhost:3000/api/ideology/discussion/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
            theme: theme,
            type: type,
            count: count,
            chapterId: currentChapterId
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.data && (Array.isArray(data.data.discussions) || Array.isArray(data.data.topics))) {
            // 获取讨论题列表
            const topics = Array.isArray(data.data.discussions) ? 
                data.data.discussions.map(item => typeof item === 'object' ? item.content : item) :
                data.data.topics;
            
            // 渲染讨论题列表
            renderDiscussionTopics(topics);
        } else {
            throw new Error('API返回数据格式不正确');
        }
    })
    .catch(error => {
        console.error('获取讨论题失败:', error);
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="result-header">
                    <h4 class="zh">讨论题列表</h4>
                    <h4 class="en">Discussion Topics</h4>
                </div>
                <div class="error-message" style="padding: 20px; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="color: #f44336; font-size: 24px; margin-bottom: 10px;"></i>
                    <p class="zh">生成失败，请稍后重试<br>错误信息: ${error.message}</p>
                    <p class="en">Generation failed, please try again later<br>Error: ${error.message}</p>
                </div>
            `;
        }
    });
}

/**
 * 渲染讨论题列表
 * @param {Array<string>} topics 讨论题列表
 */
function renderDiscussionTopics(topics) {
    const resultContainer = document.querySelector('.discussion-result');
    if (!resultContainer) return;
    
    // 移除加载状态
    resultContainer.innerHTML = `
        <div class="result-header">
            <h4 class="zh">讨论题列表</h4>
            <h4 class="en">Discussion Topics</h4>
        </div>
        <div class="discussion-list" style="max-height: 350px; overflow-y: auto; border: 1px solid #e0e0e0; padding: 10px; border-radius: 5px;">
        </div>
    `;
    
    const discussionList = resultContainer.querySelector('.discussion-list');
    
    // 添加讨论题列表
    topics.forEach((topic, index) => {
        const discussionItem = document.createElement('div');
        discussionItem.className = 'discussion-item';
        discussionItem.style.marginBottom = '15px';
        discussionItem.style.padding = '10px';
        discussionItem.style.backgroundColor = '#f9f9f9';
        discussionItem.style.borderRadius = '5px';
        discussionItem.style.border = '1px solid #ddd';
        
        discussionItem.innerHTML = `
            <div class="discussion-number" style="display: inline-block; width: 25px; height: 25px; line-height: 25px; text-align: center; background-color: #007bff; color: white; border-radius: 50%; margin-right: 10px; font-weight: bold;">${index + 1}</div>
            <div class="discussion-content" style="display: inline-block; width: calc(100% - 80px); vertical-align: middle;">
                <p class="zh" style="margin: 0;">${topic}</p>
                <p class="en" style="margin: 0; display: none;">${topic}</p>
            </div>
            <div class="discussion-actions" style="display: inline-block; vertical-align: middle;">
                <button class="action-btn-small edit-topic" style="background: none; border: none; cursor: pointer; color: #007bff;"><i class="fas fa-edit"></i></button>
                <button class="action-btn-small delete-topic" style="background: none; border: none; cursor: pointer; color: #dc3545;"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        discussionList.appendChild(discussionItem);
    });
    
    // 添加控制按钮
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'discussion-controls';
    controlsDiv.style.marginTop = '15px';
    controlsDiv.style.textAlign = 'center';
    
    controlsDiv.innerHTML = `
        <button class="btn-secondary" style="background-color: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">
            <i class="fas fa-save"></i>
            <span class="zh">保存讨论题</span>
            <span class="en">Save Topics</span>
        </button>
        <button class="btn-secondary" style="background-color: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-plus"></i>
            <span class="zh">添加讨论题</span>
            <span class="en">Add Topic</span>
        </button>
    `;
    resultContainer.appendChild(controlsDiv);
    
    // 绑定事件
    bindDiscussionEvents(resultContainer);
}

/**
 * 绑定讨论题相关事件
 * @param {Element} container 讨论题容器元素
 */
function bindDiscussionEvents(container) {
    // 绑定保存按钮
    const saveBtn = container.querySelector('.btn-secondary:nth-child(1)');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            console.log('保存讨论题');
        });
    }
    
    // 绑定添加按钮
    const addBtn = container.querySelector('.btn-secondary:nth-child(2)');
    if (addBtn) {
        addBtn.addEventListener('click', addNewDiscussionTopic);
    }
    
    // 绑定编辑和删除按钮事件
    bindTopicItemEvents(container);
}

/**
 * 绑定讨论题项目的编辑和删除事件
 * @param {Element} container 讨论题容器元素
 */
function bindTopicItemEvents(container) {
    // 添加编辑按钮事件
    const editButtons = container.querySelectorAll('.edit-topic');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.discussion-item');
            const contentP = item.querySelector('.discussion-content p.zh');
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
            
            // 添加确认按钮
            const actionsDiv = item.querySelector('.discussion-actions');
            const originalHtml = actionsDiv.innerHTML;
            actionsDiv.innerHTML = `
                <button class="action-btn-small confirm-edit" style="background: none; border: none; cursor: pointer; color: #28a745;"><i class="fas fa-check"></i></button>
                <button class="action-btn-small cancel-edit" style="background: none; border: none; cursor: pointer; color: #dc3545;"><i class="fas fa-times"></i></button>
            `;
            
            // 绑定确认和取消事件
            actionsDiv.querySelector('.confirm-edit').addEventListener('click', function() {
                const newText = textarea.value.trim();
                const newP = document.createElement('p');
                newP.className = 'zh';
                newP.style.margin = '0';
                newP.textContent = newText;
                
                textarea.parentNode.replaceChild(newP, textarea);
                actionsDiv.innerHTML = originalHtml;
                bindTopicItemEvents(container);
            });
            
            actionsDiv.querySelector('.cancel-edit').addEventListener('click', function() {
                const newP = document.createElement('p');
                newP.className = 'zh';
                newP.style.margin = '0';
                newP.textContent = currentText;
                
                textarea.parentNode.replaceChild(newP, textarea);
                actionsDiv.innerHTML = originalHtml;
                bindTopicItemEvents(container);
            });
        });
    });
    
    // 添加删除按钮事件
    const deleteButtons = container.querySelectorAll('.delete-topic');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.discussion-item');
            item.remove();
            
            // 重新排序序号
            updateTopicNumbers(container);
        });
    });
}

/**
 * 更新讨论题序号
 * @param {Element} container 讨论题容器元素
 */
function updateTopicNumbers(container) {
    const items = container.querySelectorAll('.discussion-item');
    items.forEach((item, index) => {
        const numberDiv = item.querySelector('.discussion-number');
        if (numberDiv) {
            numberDiv.textContent = index + 1;
        }
    });
}

/**
 * 添加新的讨论题
 */
function addNewDiscussionTopic() {
    const resultContainer = document.querySelector('.discussion-result');
    if (!resultContainer) return;
    
    const discussionList = resultContainer.querySelector('.discussion-list');
    if (!discussionList) return;
    
    // 获取当前项目数
    const currentCount = discussionList.querySelectorAll('.discussion-item').length;
    
    // 创建新的讨论题项
    const newItem = document.createElement('div');
    newItem.className = 'discussion-item';
    newItem.style.marginBottom = '15px';
    newItem.style.padding = '10px';
    newItem.style.backgroundColor = '#f9f9f9';
    newItem.style.borderRadius = '5px';
    newItem.style.border = '1px solid #ddd';
    
    newItem.innerHTML = `
        <div class="discussion-number" style="display: inline-block; width: 25px; height: 25px; line-height: 25px; text-align: center; background-color: #007bff; color: white; border-radius: 50%; margin-right: 10px; font-weight: bold;">${currentCount + 1}</div>
        <div class="discussion-content" style="display: inline-block; width: calc(100% - 80px); vertical-align: middle;">
            <textarea style="width: 100%; min-height: 60px; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-family: 'Microsoft YaHei', sans-serif; font-size: 14px;" placeholder="请输入讨论题内容..."></textarea>
        </div>
        <div class="discussion-actions" style="display: inline-block; vertical-align: middle;">
            <button class="action-btn-small confirm-topic" style="background: none; border: none; cursor: pointer; color: #28a745;"><i class="fas fa-check"></i></button>
            <button class="action-btn-small cancel-topic" style="background: none; border: none; cursor: pointer; color: #dc3545;"><i class="fas fa-times"></i></button>
        </div>
    `;
    
    discussionList.appendChild(newItem);
    
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
            <p class="zh" style="margin: 0;">${text}</p>
            <p class="en" style="margin: 0; display: none;">${text}</p>
        `;
        
        // 更改按钮
        const actionsDiv = this.parentNode;
        actionsDiv.innerHTML = `
            <button class="action-btn-small edit-topic" style="background: none; border: none; cursor: pointer; color: #007bff;"><i class="fas fa-edit"></i></button>
            <button class="action-btn-small delete-topic" style="background: none; border: none; cursor: pointer; color: #dc3545;"><i class="fas fa-trash"></i></button>
        `;
        
        // 重新绑定事件
        bindTopicItemEvents(resultContainer);
    });
    
    // 添加取消按钮事件
    const cancelBtn = newItem.querySelector('.cancel-topic');
    cancelBtn.addEventListener('click', function() {
        newItem.remove();
    });
}

// 导出模块函数，使其可全局访问
window.initDiscussionGenerator = initDiscussionGenerator; 