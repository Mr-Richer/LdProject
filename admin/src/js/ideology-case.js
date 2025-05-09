/**
 * 思政案例生成和管理模块
 * 用于处理思政案例的生成、查询、编辑和删除等功能
 */

// 初始化模块
document.addEventListener('DOMContentLoaded', function() {
    // 初始化思政案例模块
    IdeologyCaseManager.init();
});

// 思政案例管理器
const IdeologyCaseManager = {
    currentChapterId: null,  // 当前章节ID
    
    // 初始化
    init: function() {
        this.bindEventListeners();
        this.setupTypeMapping();
    },
    
    // 设置类型映射
    setupTypeMapping: function() {
        // 案例类型映射：前端value到后端enum值的映射
        this.caseTypeMapping = {
            'story': 1,      // 故事型案例
            'debate': 2,     // 辩论型案例
            'historical': 3, // 历史事件型案例
            'values': 4      // 价值观分析型案例
        };
        
        // 案例长度映射：前端value到后端enum值的映射
        this.caseLengthMapping = {
            'short': 1,  // 简短
            'medium': 2, // 中等
            'long': 3    // 详细
        };
    },
    
    // 绑定事件监听器
    bindEventListeners: function() {
        // 生成思政案例按钮点击事件
        const generateBtn = document.querySelector('#ideology-content .generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', this.handleGenerateCase.bind(this));
        }
        
        // 复制按钮点击事件
        const copyBtn = document.querySelector('#ideology-content .result-actions .result-action-btn:nth-child(2)');
        if (copyBtn) {
            copyBtn.addEventListener('click', this.handleCopyCaseContent.bind(this));
        }
        
        // 保存案例按钮点击事件
        const saveBtn = document.querySelector('#ideology-content .save-case-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', this.handleSaveCase.bind(this));
        }
        
        // 编辑按钮点击事件
        const editBtn = document.querySelector('#ideology-content .result-actions .result-action-btn:nth-child(1)');
        if (editBtn) {
            editBtn.addEventListener('click', this.handleEditCase.bind(this));
        }
        
        // 重新生成按钮点击事件
        const regenerateBtn = document.querySelector('#ideology-content .result-actions .result-action-btn:nth-child(3)');
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', this.handleRegenerateCase.bind(this));
        }
        
        // 监听章节切换事件，更新当前章节ID
        document.addEventListener('chapterChanged', (event) => {
            if (event.detail && event.detail.chapterId) {
                this.currentChapterId = event.detail.chapterId;
                this.loadCasesList(this.currentChapterId);
            }
        });
    },
    
    // 处理生成案例事件
    handleGenerateCase: async function(event) {
        try {
            // 检查是否有章节ID
            if (!this.currentChapterId) {
                this.showNotification('请先选择一个章节', 'warning');
                return;
            }
            
            // 获取表单数据
            const themeInput = document.querySelector('#ideology-content .prompt-input.zh');
            const theme = themeInput.value.trim();
            
            if (!theme) {
                this.showNotification('请输入思政案例主题', 'warning');
                return;
            }
            
            // 获取案例类型和长度
            const typeSelect = document.querySelectorAll('#ideology-content .ideology-select')[0];
            const lengthSelect = document.querySelectorAll('#ideology-content .ideology-select')[1];
            
            const selectedType = typeSelect.options[typeSelect.selectedIndex].value;
            const selectedLength = lengthSelect.options[lengthSelect.selectedIndex].value;
            
            // 映射到后端枚举值
            const caseType = this.caseTypeMapping[selectedType];
            const caseLength = this.caseLengthMapping[selectedLength];
            
            // 显示加载状态
            this.showLoading(true);
            
            // 调用后端API生成案例
            const response = await this.generateCase({
                theme: theme,
                caseType: caseType,
                caseLength: caseLength,
                chapterId: this.currentChapterId
            });
            
            // 隐藏加载状态
            this.showLoading(false);
            
            if (response && response.data) {
                // 显示生成结果
                this.displayGeneratedCase(response.data);
                this.showNotification('思政案例生成成功', 'success');
            } else {
                this.showNotification('生成失败: ' + (response?.message || '未知错误'), 'error');
            }
        } catch (error) {
            this.showLoading(false);
            this.showNotification('生成失败: ' + (error.message || '未知错误'), 'error');
            console.error('生成思政案例失败:', error);
        }
    },
    
    // 调用API生成案例
    generateCase: async function(data) {
        try {
            const response = await fetch(`${window.API_BASE_URL}/api/ideology/case/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '生成案例请求失败');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API调用失败:', error);
            throw error;
        }
    },
    
    // 显示生成的案例
    displayGeneratedCase: function(caseData) {
        // 显示结果区域
        const resultContainer = document.querySelector('#ideology-content .ideology-result');
        if (resultContainer) {
            resultContainer.style.display = 'block';
        }
        
        // 设置文本内容
        const contentTextarea = document.querySelector('#ideology-content .case-content-textarea.zh');
        if (contentTextarea && caseData.content) {
            const formattedContent = `${caseData.title}\n\n${caseData.content}`;
            contentTextarea.value = formattedContent;
            
            // 存储案例ID用于后续操作
            contentTextarea.dataset.caseId = caseData.id;
        }
    },
    
    // 处理复制案例内容事件
    handleCopyCaseContent: function() {
        const contentTextarea = document.querySelector('#ideology-content .case-content-textarea.zh');
        if (contentTextarea) {
            contentTextarea.select();
            document.execCommand('copy');
            this.showNotification('内容已复制到剪贴板', 'success');
        }
    },
    
    // 处理编辑案例事件
    handleEditCase: function() {
        const contentTextarea = document.querySelector('#ideology-content .case-content-textarea.zh');
        if (contentTextarea) {
            // 移除只读属性，允许编辑
            contentTextarea.readOnly = false;
            contentTextarea.focus();
            this.showNotification('现在可以编辑案例内容', 'info');
            
            // 如果页面上没有保存按钮，则添加一个
            const resultActions = document.querySelector('#ideology-content .result-actions');
            if (resultActions && !document.querySelector('.save-case-btn')) {
                const saveBtn = document.createElement('button');
                saveBtn.className = 'result-action-btn save-case-btn';
                saveBtn.innerHTML = '<i class="fas fa-save"></i><span class="zh">保存</span>';
                saveBtn.addEventListener('click', this.handleSaveCase.bind(this));
                resultActions.appendChild(saveBtn);
            }
        }
    },
    
    // 处理保存案例事件
    handleSaveCase: async function() {
        try {
            const contentTextarea = document.querySelector('#ideology-content .case-content-textarea.zh');
            if (!contentTextarea) return;
            
            const caseId = contentTextarea.dataset.caseId;
            if (!caseId) {
                this.showNotification('无法保存，案例ID不存在', 'error');
                return;
            }
            
            const content = contentTextarea.value;
            
            // 从内容中提取标题（第一行）和正文
            const lines = content.split('\n');
            let title = '';
            let caseContent = content;
            
            if (lines.length > 0) {
                title = lines[0].trim();
                caseContent = lines.slice(1).join('\n').trim();
            }
            
            // 显示加载状态
            this.showLoading(true);
            
            // 调用API保存案例
            const response = await fetch(`${window.API_BASE_URL}/api/ideology/case/${caseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: title,
                    content: caseContent
                })
            });
            
            // 隐藏加载状态
            this.showLoading(false);
            
            if (response.ok) {
                // 恢复只读状态
                contentTextarea.readOnly = true;
                
                // 移除保存按钮
                const saveBtn = document.querySelector('.save-case-btn');
                if (saveBtn) {
                    saveBtn.remove();
                }
                
                this.showNotification('案例保存成功', 'success');
                
                // 刷新案例列表
                this.loadCasesList(this.currentChapterId);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || '保存失败');
            }
        } catch (error) {
            this.showLoading(false);
            this.showNotification('保存失败: ' + (error.message || '未知错误'), 'error');
            console.error('保存思政案例失败:', error);
        }
    },
    
    // 处理重新生成案例事件
    handleRegenerateCase: function() {
        // 直接触发生成按钮的点击事件，重新生成案例
        const generateBtn = document.querySelector('#ideology-content .generate-btn');
        if (generateBtn) {
            generateBtn.click();
        }
    },
    
    // 加载案例列表
    loadCasesList: async function(chapterId) {
        try {
            if (!chapterId) return;
            
            const response = await fetch(`${window.API_BASE_URL}/api/ideology/case?chapterId=${chapterId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '获取案例列表失败');
            }
            
            const result = await response.json();
            
            if (result && result.data && result.data.cases) {
                this.renderCasesList(result.data.cases);
            }
        } catch (error) {
            this.showNotification('加载案例列表失败: ' + (error.message || '未知错误'), 'error');
            console.error('加载思政案例列表失败:', error);
        }
    },
    
    // 渲染案例列表
    renderCasesList: function(cases) {
        const casesTableBody = document.querySelector('#ideology-content .cases-table tbody');
        if (!casesTableBody) return;
        
        // 清空现有内容
        casesTableBody.innerHTML = '';
        
        if (cases.length === 0) {
            // 显示空状态
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="4" class="empty-table">
                    <i class="fas fa-inbox"></i>
                    <p class="zh">暂无思政案例</p>
                    <p class="en">No ideology cases yet</p>
                </td>
            `;
            casesTableBody.appendChild(emptyRow);
            return;
        }
        
        // 添加案例行
        cases.forEach((caseItem, index) => {
            const row = document.createElement('tr');
            
            // 创建资源标签HTML
            let resourceTags = '<div class="resource-tags">';
            if (caseItem.image_count > 0) {
                resourceTags += '<span class="resource-tag image"><i class="fas fa-image"></i></span>';
            }
            if (caseItem.video_count > 0) {
                resourceTags += '<span class="resource-tag video"><i class="fas fa-video"></i></span>';
            }
            if (caseItem.link_count > 0) {
                resourceTags += '<span class="resource-tag link"><i class="fas fa-link"></i></span>';
            }
            resourceTags += '</div>';
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <p class="zh">${caseItem.title}</p>
                    <p class="en">${caseItem.title}</p>
                </td>
                <td>${resourceTags}</td>
                <td>
                    <button class="case-action-btn view" data-id="${caseItem.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="case-action-btn edit" data-id="${caseItem.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="case-action-btn delete" data-id="${caseItem.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            casesTableBody.appendChild(row);
        });
        
        // 绑定案例操作按钮事件
        this.bindCaseActionButtons();
    },
    
    // 绑定案例操作按钮事件
    bindCaseActionButtons: function() {
        // 查看按钮
        const viewButtons = document.querySelectorAll('#ideology-content .case-action-btn.view');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const caseId = e.currentTarget.dataset.id;
                this.viewCase(caseId);
            });
        });
        
        // 编辑按钮
        const editButtons = document.querySelectorAll('#ideology-content .case-action-btn.edit');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const caseId = e.currentTarget.dataset.id;
                this.editCase(caseId);
            });
        });
        
        // 删除按钮
        const deleteButtons = document.querySelectorAll('#ideology-content .case-action-btn.delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const caseId = e.currentTarget.dataset.id;
                this.deleteCase(caseId);
            });
        });
    },
    
    // 查看案例详情
    viewCase: async function(caseId) {
        try {
            const response = await fetch(`${window.API_BASE_URL}/api/ideology/case/${caseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '获取案例详情失败');
            }
            
            const result = await response.json();
            
            if (result && result.data) {
                // 显示案例详情（可以使用模态框展示）
                this.showCaseDetailModal(result.data);
            }
        } catch (error) {
            this.showNotification('查看案例失败: ' + (error.message || '未知错误'), 'error');
            console.error('查看思政案例失败:', error);
        }
    },
    
    // 编辑现有案例
    editCase: async function(caseId) {
        try {
            const response = await fetch(`${window.API_BASE_URL}/api/ideology/case/${caseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '获取案例详情失败');
            }
            
            const result = await response.json();
            
            if (result && result.data) {
                // 显示到编辑区域
                this.displayGeneratedCase(result.data);
                
                // 自动触发编辑按钮
                const editBtn = document.querySelector('#ideology-content .result-actions .result-action-btn:nth-child(1)');
                if (editBtn) {
                    editBtn.click();
                }
            }
        } catch (error) {
            this.showNotification('编辑案例失败: ' + (error.message || '未知错误'), 'error');
            console.error('编辑思政案例失败:', error);
        }
    },
    
    // 删除案例
    deleteCase: async function(caseId) {
        try {
            // 弹出确认框
            if (!confirm('确定要删除这个思政案例吗？')) {
                return;
            }
            
            const response = await fetch(`${window.API_BASE_URL}/api/ideology/case/${caseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '删除案例失败');
            }
            
            this.showNotification('案例删除成功', 'success');
            
            // 刷新案例列表
            this.loadCasesList(this.currentChapterId);
        } catch (error) {
            this.showNotification('删除案例失败: ' + (error.message || '未知错误'), 'error');
            console.error('删除思政案例失败:', error);
        }
    },
    
    // 显示案例详情模态框
    showCaseDetailModal: function(caseData) {
        // 这里可以实现一个模态框来展示案例详情
        // 为简化实现，可以直接使用alert或者复用现有的模态框组件
        alert(`案例标题: ${caseData.title}\n\n${caseData.content}`);
    },
    
    // 显示加载状态
    showLoading: function(isLoading) {
        // 这里可以实现加载指示器
        // 例如添加/移除一个加载覆盖层或spinner
        
        // 暂时使用简单的禁用/启用生成按钮来表示加载状态
        const generateBtn = document.querySelector('#ideology-content .generate-btn');
        if (generateBtn) {
            generateBtn.disabled = isLoading;
            
            if (isLoading) {
                generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="zh">处理中...</span><span class="en">Processing...</span>';
            } else {
                generateBtn.innerHTML = '<i class="fas fa-file-alt"></i><span class="zh">生成思政案例</span><span class="en">Generate Case</span>';
            }
        }
    },
    
    // 显示通知消息
    showNotification: function(message, type = 'info') {
        // 检查是否有通知组件
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // 简单的备用方案
            alert(message);
        }
    }
}; 