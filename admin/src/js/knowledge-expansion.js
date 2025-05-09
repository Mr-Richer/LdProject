/**
 * 知识拓展模块 - 处理思维导图生成和管理功能
 */

// API配置
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000';

// 知识拓展模块对象
const KnowledgeExpansion = {
    // 当前选中的拓展类型
    currentExpansionType: 1, // 默认为"文化渊源"

    /**
     * 初始化知识拓展功能
     */
    init: function() {
        console.log('初始化知识拓展模块');
        
        // 初始化知识拓展功能
        this.initKnowledgeExpansion();
        
        // 初始化保存思维导图按钮
        this.initSaveMindmapButton();
        
        // 初始化查看历史思维导图功能
        this.initViewHistoryButton();
        
        // 查找思维导图生成按钮并绑定事件
        this.bindGenerateButton();
        
        return this;
    },
    
    /**
     * API请求工具方法 - 统一处理API请求
     * @param {string} endpoint - API端点
     * @param {Object} options - 请求选项
     * @returns {Promise} - 返回请求Promise
     */
    apiRequest: function(endpoint, options = {}) {
        // 构建URL时确保使用双重/api前缀，这是后端系统当前接受的方式
        // 注意：endpoint.startsWith('/') 条件保持不变，但我们添加了/api/前缀
        const url = `${API_BASE_URL}/api/api/${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`;
        
        // 默认请求选项
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        };
        
        // 合并选项
        const requestOptions = { ...defaultOptions, ...options };
        
        // 如果有token，添加到请求头
        const token = window.userToken || localStorage.getItem('userToken');
        if (token && !requestOptions.headers.Authorization) {
            requestOptions.headers.Authorization = `Bearer ${token}`;
        }
        
        // 如果有body，转为JSON
        if (requestOptions.body && typeof requestOptions.body === 'object') {
            requestOptions.body = JSON.stringify(requestOptions.body);
        }
        
        console.log(`发送${requestOptions.method}请求到:`, url);
        
        return fetch(url, requestOptions)
            .then(response => {
                // 记录响应状态
                console.log(`API响应状态: ${response.status} ${response.statusText}`, { url, method: requestOptions.method });
                
                // 检查响应状态
                if (!response.ok) {
                    return response.text().then(text => {
                        try {
                            const json = JSON.parse(text);
                            console.error('API请求失败，错误响应:', json);
                            throw new Error(json.message || `API请求失败: ${response.status}`);
                        } catch (e) {
                            console.error('API请求失败，无法解析响应:', text);
                            throw new Error(`API请求失败 (${response.status}): ${text || '未知错误'}`);
                        }
                    });
                }
                return response.json();
            })
            .then(data => {
                // 记录成功响应数据
                console.log(`API请求成功: ${url}`, { code: data.code, dataSize: JSON.stringify(data).length });
                
                // 检查API返回的状态码
                if (data.code && data.code !== 200) {
                    throw new Error(data.message || '操作失败');
                }
                return data;
            });
    },
    
    /**
     * 初始化知识拓展功能
     */
    initKnowledgeExpansion: function() {
        console.log('初始化知识拓展界面');
        
        const knowledgeContent = document.getElementById('knowledge-content');
        if (!knowledgeContent) {
            console.log('知识拓展内容区域未找到');
            return;
        }
        
        // 拓展类型映射表
        const expansionTypeMap = {
            '文化渊源': 1,
            '文化发展': 2,
            '文化创新': 3,
            '区域文化': 4,
            '跨学科知识': 5,
            '中西文化对比': 6
        };
        
        // 文化按钮选择
        const cultureBtns = knowledgeContent.querySelectorAll('.culture-btn');
        
        cultureBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有按钮的活跃状态
                cultureBtns.forEach(b => b.classList.remove('active'));
                
                // 设置当前按钮为活跃状态
                btn.classList.add('active');
                
                // 获取按钮文本内容
                const buttonText = btn.querySelector('span.zh').textContent;
                console.log('选择文化按钮:', buttonText);
                
                // 获取并保存拓展类型值
                if (expansionTypeMap[buttonText]) {
                    this.currentExpansionType = expansionTypeMap[buttonText];
                    console.log('当前拓展类型值:', this.currentExpansionType);
                    
                    // 显示当前选择的拓展类型
                    this.showExpansionTypeInfo(buttonText, this.currentExpansionType);
                }
            });
        });
    },
    
    /**
     * 显示当前选择的拓展类型信息
     * @param {string} typeName - 拓展类型名称
     * @param {number} typeValue - 拓展类型数值
     */
    showExpansionTypeInfo: function(typeName, typeValue) {
        // 查找或创建提示容器
        let infoEl = document.getElementById('expansion-type-info');
        if (!infoEl) {
            infoEl = document.createElement('div');
            infoEl.id = 'expansion-type-info';
            infoEl.style.cssText = 'margin-top:10px; padding:8px 12px; background-color:#f8f9fa; border-left:4px solid #17a2b8; font-size:14px; color:#333; border-radius:4px; display:none;';
            
            const knowledgeContent = document.getElementById('knowledge-content');
            const promptContainer = knowledgeContent.querySelector('.prompt-container');
            if (promptContainer) {
                promptContainer.appendChild(infoEl);
            }
        }
        
        // 更新内容并显示
        infoEl.innerHTML = `<i class="fas fa-info-circle" style="margin-right:5px;"></i> <strong>当前选择:</strong> ${typeName} (类型值: ${typeValue})`;
        infoEl.style.display = 'block';
        
        // 使用当前类型对应的颜色
        let borderColor = '#17a2b8'; // 默认蓝色
        switch(typeValue) {
            case 1: borderColor = '#007bff'; break; // 文化渊源 - 蓝色
            case 2: borderColor = '#28a745'; break; // 文化发展 - 绿色
            case 3: borderColor = '#fd7e14'; break; // 文化创新 - 橙色
            case 4: borderColor = '#6f42c1'; break; // 区域文化 - 紫色
            case 5: borderColor = '#dc3545'; break; // 跨学科知识 - 红色
            case 6: borderColor = '#20c997'; break; // 中西文化对比 - 青色
        }
        infoEl.style.borderLeftColor = borderColor;
        
        // 短暂闪烁效果
        infoEl.style.animation = 'none';
        setTimeout(() => {
            infoEl.style.animation = 'pulse 1s';
        }, 10);
    },
    
    /**
     * 初始化保存思维导图按钮
     */
    initSaveMindmapButton: function() {
        // 查找所有可能的保存按钮
        const saveButtons = document.querySelectorAll('.save-mindmap-btn, .result-action-btn');
        
        if (saveButtons.length === 0) {
            console.warn('未找到保存思维导图按钮');
            return;
        }
        
        // 检查每个按钮，找到知识拓展保存按钮
        saveButtons.forEach(btn => {
            // 检查是否是知识拓展区域内的保存按钮
            const isInKnowledgeContent = btn.closest('#knowledge-content') !== null;
            const isSaveBtn = btn.querySelector('i.fas.fa-save') !== null || 
                              btn.classList.contains('save-mindmap-btn');
            
            if (isInKnowledgeContent && isSaveBtn) {
                console.log('找到知识拓展保存按钮:', btn);
                
                // 移除现有事件监听器(克隆并替换节点)
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                // 添加新的事件监听器
                newBtn.addEventListener('click', this.handleSaveMindmap.bind(this));
                console.log('已为保存按钮绑定事件');
            }
        });
    },
    
    /**
     * 初始化查看历史思维导图按钮
     */
    initViewHistoryButton: function() {
        const viewHistoryBtn = document.querySelector('.view-history-btn');
        if (!viewHistoryBtn) return;
        
        viewHistoryBtn.addEventListener('click', () => {
            const chapterSelect = document.getElementById('chapter-select');
            if (chapterSelect && chapterSelect.value) {
                this.loadKnowledgeExpansions(chapterSelect.value);
                this.showNotification('已加载历史知识拓展', 'info');
            } else {
                this.showNotification('请先选择章节', 'warning');
            }
        });
    },
    
    /**
     * 绑定思维导图生成按钮事件
     */
    bindGenerateButton: function() {
        const knowledgeContent = document.getElementById('knowledge-content');
        if (!knowledgeContent) return;
        
        // 获取所有可能的思维导图生成按钮
        const generateBtn = knowledgeContent.querySelector('.generate-btn, .ai-generate-btn, #mindmap-generate-btn, #backup-generate-btn');
        
        if (generateBtn) {
            // 移除可能已存在的事件监听器
            const newGenerateBtn = generateBtn.cloneNode(true);
            generateBtn.parentNode.replaceChild(newGenerateBtn, generateBtn);
            
            // 绑定新的事件监听器
            newGenerateBtn.addEventListener('click', this.handleGenerateButtonClick.bind(this));
            
            console.log('思维导图生成按钮事件绑定完成');
        } else {
            console.error('找不到思维导图生成按钮');
        }
    },
    
    /**
     * 处理生成按钮点击事件
     */
    handleGenerateButtonClick: function() {
        console.log('点击生成思维导图按钮');
        this.showNotification('正在生成知识拓展...', 'info');
        
        // 获取知识内容区域
        const knowledgeContent = document.getElementById('knowledge-content');
        if (!knowledgeContent) return;
        
        // 获取输入和结果容器
        const promptInput = knowledgeContent.querySelector('.prompt-input.zh');
        const resultContainer = knowledgeContent.querySelector('.result-content .mindmap-container');
        const knowledgeResult = document.querySelector('.knowledge-result');
        
        if (!promptInput || !resultContainer) {
            console.error('找不到提示输入框或思维导图容器元素', {
                promptInput: !!promptInput,
                resultContainer: !!resultContainer
            });
            this.showNotification('组件初始化失败，请刷新页面重试', 'error');
            return;
        }
        
        const prompt = promptInput.value.trim();
        if (!prompt) {
            this.showNotification('请输入知识点提示词', 'warning');
            return;
        }
        
        // 显示结果区域
        if (knowledgeResult) {
            knowledgeResult.style.display = 'block';
        }
        
        // 获取当前选中的章节
        const chapterSelect = document.getElementById('chapter-select');
        let selectedChapterId = null;
        
        if (chapterSelect && chapterSelect.value) {
            selectedChapterId = chapterSelect.value;
        }
        
        // 显示加载状态
        resultContainer.innerHTML = '<div class="loading" style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin" style="font-size:24px;"></i><p>正在生成思维导图...</p></div>';
        
        // 添加动画效果
        if (knowledgeResult) {
            knowledgeResult.style.opacity = '0';
            knowledgeResult.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                knowledgeResult.style.opacity = '1';
                knowledgeResult.style.transform = 'translateY(0)';
                knowledgeResult.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                // 初始化思维导图
                this.initMindmap(resultContainer, prompt);
                
                // 显示知识拓展列表
                const knowledgeExpansionList = document.querySelector('.knowledge-expansion-list');
                if (knowledgeExpansionList) {
                    knowledgeExpansionList.style.display = 'block';
                    
                    // 如果有选中的章节，加载该章节的拓展列表
                    if (selectedChapterId) {
                        this.loadKnowledgeExpansions(selectedChapterId);
                    }
                }
            }, 50);
        }
    },
    
    /**
     * 处理保存思维导图按钮点击
     */
    handleSaveMindmap: function() {
        console.log('点击保存思维导图按钮');
        
        // 获取当前选中的章节
        const chapterSelect = document.getElementById('chapter-select');
        if (!chapterSelect || !chapterSelect.value) {
            this.showNotification('请先选择章节', 'warning');
            return;
        }
        
        const chapterId = chapterSelect.value;
        console.log('当前选中章节ID:', chapterId);
        
        // 获取当前思维导图容器和数据
        const container = document.querySelector('#mindmap-container') || document.querySelector('.mindmap-container');
        if (!container || !container._echartsInstance) {
            this.showNotification('未找到有效的思维导图数据', 'error');
            return;
        }
        
        // 获取ECharts实例的option
        const option = container._echartsInstance.getOption();
        
        // 提取思维导图数据
        if (option && option.series && option.series[0] && option.series[0].data && option.series[0].data[0]) {
            const mindmapData = option.series[0].data[0];
            
            // 调用保存函数
            this.saveMindmapData(mindmapData, chapterId)
                .then(() => {
                    // 保存成功后更新列表
                    this.loadKnowledgeExpansions(chapterId);
                    this.showNotification('思维导图保存成功', 'success');
                })
                .catch(error => {
                    console.error('保存思维导图失败:', error);
                    this.showNotification(`保存失败: ${error.message}`, 'error');
                });
        } else {
            this.showNotification('无法获取思维导图数据', 'error');
        }
    },
    
    /**
     * 保存思维导图数据到后端
     * @param {Object} mindmapData - 思维导图数据
     * @param {string|number} chapterId - 章节ID
     * @returns {Promise} - 返回保存操作的Promise
     */
    saveMindmapData: async function(mindmapData, chapterId) {
        if (!mindmapData || !chapterId) {
            console.error('保存失败：缺少必要参数');
            this.showNotification('保存失败：缺少思维导图数据或章节ID', 'error');
            return Promise.reject(new Error('缺少必要参数'));
        }
        
        console.log('正在保存思维导图数据...', {mindmapData, chapterId});
        this.showNotification('正在保存思维导图...', 'info');
        
        try {
            // 构建请求数据
            const requestData = {
                data: mindmapData,
                chapterId: parseInt(chapterId, 10),
                title: `${mindmapData.name || '主题'}思维导图`,
                centralTopic: mindmapData.name || '中心主题',
                chapter_id: parseInt(chapterId, 10),  // 确保同时提供chapter_id字段
                expansion_type: this.currentExpansionType  // 添加拓展类型
            };
            
            console.log('保存思维导图请求数据:', requestData);
            
            // 使用apiRequest方法发送请求
            return this.apiRequest('save-mindmap', {
                method: 'POST',
                body: requestData
            });
        } catch (error) {
            console.error('保存思维导图时出错:', error);
            this.showNotification(`保存失败: ${error.message}`, 'error');
            throw error;
        }
    },
    
    /**
     * 初始化思维导图
     * @param {HTMLElement} container - 思维导图容器
     * @param {string} topic - 中心主题
     */
    initMindmap: function(container, topic) {
        console.log('初始化思维导图', { container, topic });
        
        // 如果已经加载过，则清空容器
        if (container) {
            try {
                // 检查是否已经有图表实例
                if (container._echartsInstance) {
                    try {
                        // 安全地清理实例
                        container._echartsInstance.dispose();
                    } catch (error) {
                        console.error('清理ECharts实例失败:', error);
                    }
                    // 确保引用被清空
                    container._echartsInstance = null;
                }
                
                // 安全清空容器内容
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            } catch (error) {
                console.error('清空思维导图容器时发生错误:', error);
                // 备选方案：直接设置innerHTML
                container.innerHTML = '';
            }
        } else {
            console.error('思维导图容器不存在');
            return;
        }
        
        // 显示加载中
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>生成思维导图中...</p>';
        loadingDiv.style.cssText = 'text-align:center; padding:40px 20px; font-size:16px; color:#666;';
        container.appendChild(loadingDiv);
        
        // 使用API生成思维导图 - 使用新的apiRequest方法，添加只生成不保存的参数
        this.apiRequest('generate-mindmap', {
            method: 'POST',
            body: {
                topic: topic,
                depth: 3,
                language: 'zh',
                saveToDatabase: false, // 添加参数指示后端不要保存到数据库
                expansion_type: this.currentExpansionType // 添加拓展类型
            }
        })
        .then(result => {
            // 移除加载指示器
            if (loadingDiv && loadingDiv.parentNode === container) {
                container.removeChild(loadingDiv);
            }
            
            if (result.data) {
                console.log('成功获取思维导图数据');
                
                // 确保echarts库加载完成
                if (typeof echarts === 'undefined') {
                    // 动态加载echarts
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
                    script.onload = () => {
                        this.renderMindmap(container, result.data, topic);
                    };
                    document.head.appendChild(script);
                } else {
                    this.renderMindmap(container, result.data, topic);
                }
            } else {
                console.error('思维导图数据格式错误');
                container.innerHTML = '<div class="error-message">获取思维导图数据失败: 格式不正确</div>';
            }
            
            // 添加保存提示
            this.showSaveReminder();
        })
        .catch(error => {
            console.error('获取思维导图数据失败:', error);
            // 移除加载指示器
            if (loadingDiv && loadingDiv.parentNode === container) {
                container.removeChild(loadingDiv);
            }
            
            // 显示错误消息
            container.innerHTML = `<div class="error-message">获取思维导图数据失败: ${error.message}</div>`;
            
            // 使用模拟数据作为备选
            const mockData = this.generateMockMindmapData(topic);
            if (typeof echarts !== 'undefined') {
                this.renderMindmap(container, mockData, topic + ' (模拟数据)');
                
                // 添加保存提示
                this.showSaveReminder();
            }
        });
    },
    
    /**
     * 渲染思维导图
     * @param {HTMLElement} container - 容器元素
     * @param {Object} data - 思维导图数据
     * @param {string} title - 标题
     */
    renderMindmap: function(container, data, title) {
        if (!container || !data) {
            console.error('渲染思维导图失败：容器或数据为空');
            return;
        }
        
        try {
            // 确保echarts库已加载
            if (typeof echarts === 'undefined') {
                console.error('ECharts库未加载');
                container.innerHTML = '<div class="error-message">ECharts库未加载，无法渲染思维导图</div>';
                return;
            }
            
            // 确保容器有足够的高度和宽度
            if (container.clientHeight < 200) {
                container.style.height = '400px';
            }
            
            // 添加操作提示
            let tipEl = container.querySelector('.mindmap-operation-tip');
            if (!tipEl) {
                tipEl = document.createElement('div');
                tipEl.className = 'mindmap-operation-tip';
                tipEl.innerHTML = `
                    <i class="fas fa-info-circle"></i>操作提示:
                    <ul>
                        <li>鼠标拖拽：平移视图</li>
                        <li>鼠标滚轮：缩放视图</li>
                        <li>点击节点：展开/折叠</li>
                    </ul>
                `;
                container.style.position = 'relative';
                container.appendChild(tipEl);
                
                // 5秒后提示自动淡出
                setTimeout(() => {
                    tipEl.style.opacity = '0';
                    setTimeout(() => {
                        if (tipEl.parentNode) {
                            tipEl.parentNode.removeChild(tipEl);
                        }
                    }, 500);
                }, 5000);
            }
            
            // 初始化ECharts
            let chart;
            try {
                // 检查是否已经存在实例
                if (container._echartsInstance) {
                    chart = container._echartsInstance;
                    chart.clear();
                } else {
                    chart = echarts.init(container);
                }
            } catch (error) {
                console.error('初始化ECharts实例失败:', error);
                // 可能的DOM问题，尝试重置容器
                container.innerHTML = '';
                chart = echarts.init(container);
            }
            
            // 配置项
            const option = {
                title: {
                    text: '知识拓展思维导图',
                    subtext: title,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: { title: '保存为图片' },
                        restore: { title: '还原' },
                        dataZoom: { title: '区域缩放' }
                    }
                },
                // 添加缩放控制器
                dataZoom: [
                    {
                        type: 'inside', // 支持内置型（鼠标滚轮）
                        filterMode: 'filter'
                    }
                ],
                // 添加视图控制
                visualMap: {
                    show: false,
                    seriesIndex: 0
                },
                series: [
                    {
                        type: 'tree',
                        data: [data],
                        top: '10%',
                        left: '10%',
                        bottom: '10%',
                        right: '10%',
                        symbolSize: 12,
                        edgeShape: 'polyline',
                        edgeForkPosition: '50%',
                        initialTreeDepth: 2,
                        lineStyle: { width: 1.5 },
                        label: {
                            position: 'left',
                            verticalAlign: 'middle',
                            align: 'right',
                            fontSize: 14
                        },
                        leaves: {
                            label: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        },
                        expandAndCollapse: true,
                        animationDuration: 550,
                        animationDurationUpdate: 750,
                        // 添加动画延迟以实现渐进式展示
                        animationDelay: function(idx) {
                            return idx * 100;
                        },
                        animationDelayUpdate: function(idx) {
                            return idx * 100;
                        },
                        // 启用鼠标拖拽平移功能
                        roam: true
                    }
                ]
            };
            
            // 应用配置
            try {
                chart.setOption(option);
                
                // 存储实例引用
                container._echartsInstance = chart;
                
                // 适应窗口大小变化
                const resizeHandler = function() {
                    if (chart && !chart.isDisposed()) {
                        chart.resize();
                    }
                };
                
                // 移除可能已存在的事件监听器
                window.removeEventListener('resize', container._resizeHandler);
                
                // 添加新的事件监听器并保存引用
                window.addEventListener('resize', resizeHandler);
                container._resizeHandler = resizeHandler;
                
                // 添加容器尺寸变化监听
                if (typeof ResizeObserver !== 'undefined') {
                    // 移除之前的观察器
                    if (container._resizeObserver) {
                        container._resizeObserver.disconnect();
                    }
                    
                    // 创建新的观察器
                    const observer = new ResizeObserver(() => {
                        if (chart && !chart.isDisposed()) {
                            chart.resize();
                        }
                    });
                    observer.observe(container);
                    container._resizeObserver = observer;
                }
            } catch (error) {
                console.error('设置思维导图数据失败:', error);
                container.innerHTML = `<div class="error-message">渲染思维导图失败: ${error.message}</div>`;
            }
        } catch (error) {
            console.error('渲染思维导图失败:', error);
            container.innerHTML = `<div class="error-message">渲染思维导图失败: ${error.message}</div>`;
        }
    },
    
    /**
     * 生成模拟思维导图数据
     * @param {string} topic - 中心主题
     * @returns {Object} - 模拟的思维导图数据
     */
    generateMockMindmapData: function(topic) {
        return {
            name: topic,
            children: [
                {
                    name: '历史背景',
                    children: [
                        { name: '起源发展' },
                        { name: '重要时期' },
                        { name: '代表人物' }
                    ]
                },
                {
                    name: '核心概念',
                    children: [
                        { name: '基本原理' },
                        { name: '关键术语' },
                        { name: '理论体系' }
                    ]
                },
                {
                    name: '应用领域',
                    children: [
                        { name: '教育应用' },
                        { name: '文化传承' },
                        { name: '现代发展' }
                    ]
                },
                {
                    name: '文化价值',
                    children: [
                        { name: '精神内涵' },
                        { name: '社会影响' },
                        { name: '当代意义' }
                    ]
                }
            ]
        };
    },
    
    /**
     * 显示通知消息
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型(success, error, info, warning)
     * @param {number} duration - 显示时长，毫秒
     */
    showNotification: function(message, type = 'info', duration = 3000) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type, duration);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    },
    
    /**
     * 加载知识拓展列表
     * @param {string|number} chapterId - 章节ID
     */
    loadKnowledgeExpansions: function(chapterId) {
        if (!chapterId) {
            console.error('加载思维导图列表失败: 缺少章节ID');
            return;
        }
        
        console.log(`开始加载章节 ${chapterId} 的思维导图列表`);
        
        // 查找表格容器
        const expansionList = document.querySelector('.knowledge-expansion-list');
        if (!expansionList) {
            console.error('找不到知识拓展列表容器');
            return;
        }
        
        // 找到表格tbody元素或创建
        let tbody = expansionList.querySelector('table tbody');
        if (!tbody) {
            // 创建表格结构
            console.log('未找到表格结构，创建新表格');
            const tableHtml = `
                <div class="expansion-table">
                    <table>
                        <thead>
                            <tr>
                                <th class="col-number">序号</th>
                                <th class="col-title">拓展名称</th>
                                <th class="col-type">类型</th>
                                <th class="col-actions">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="4" class="loading-state" style="text-align:center;">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    <span>正在加载数据...</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            
            // 添加到容器
            expansionList.innerHTML = tableHtml;
            tbody = expansionList.querySelector('table tbody');
        } else {
            // 显示加载状态
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="loading-state" style="text-align:center;">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>正在加载数据...</span>
                    </td>
                </tr>
            `;
        }
        
        // 确保容器可见
        expansionList.style.display = 'block';
        
        // 准备API调用
        const endpoint = `mindmaps/chapter/${chapterId}`;
        console.log(`准备调用API获取思维导图列表: ${endpoint}`);
        
        // 调用API获取思维导图列表 - 使用修复后的apiRequest方法
        this.apiRequest(endpoint)
            .then(result => {
                console.log(`获取思维导图列表成功，章节ID: ${chapterId}，数据项数: ${result.data?.length || 0}`);
                
                if (result.data && Array.isArray(result.data)) {
                    // 渲染表格
                    this.renderMindmapTable(tbody, result.data, chapterId);
                } else {
                    throw new Error('返回数据格式不正确');
                }
            })
            .catch(error => {
                console.error(`加载思维导图列表失败，章节ID: ${chapterId}，错误:`, error);
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="error-state" style="text-align:center; color:red;">
                            <i class="fas fa-exclamation-circle"></i>
                            <span>加载失败: ${error.message}</span>
                        </td>
                    </tr>
                `;
            });
    },
    
    /**
     * 渲染思维导图表格
     * @param {HTMLElement} tbody - 表格tbody元素
     * @param {Array} items - 思维导图数据数组
     * @param {string|number} chapterId - 章节ID
     */
    renderMindmapTable: function(tbody, items, chapterId) {
        if (!tbody) return;
        
        // 清空表格内容
        tbody.innerHTML = '';
        
        if (!items || !items.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state" style="text-align:center; padding:20px;">
                        <i class="fas fa-info-circle"></i>
                        <span>暂无数据</span>
                    </td>
                </tr>
            `;
            return;
        }
        
        // 保存当前对象的引用，用于事件处理函数中
        const self = this;
        
        // 拓展类型映射表
        const expansionTypeMap = {
            1: { name: '文化渊源', class: 'origin' },
            2: { name: '文化发展', class: 'development' },
            3: { name: '文化创新', class: 'innovation' },
            4: { name: '区域文化', class: 'regional' },
            5: { name: '跨学科知识', class: 'interdisciplinary' },
            6: { name: '中西文化对比', class: 'comparative' }
        };
        
        // 渲染数据行
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            
            // 格式化日期
            const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString() : '未知';
            
            // 获取拓展类型信息
            const expansionType = item.expansion_type ? expansionTypeMap[item.expansion_type] || { name: '未知类型', class: 'default' } : { name: '思维导图', class: 'default' };
            
            // 创建单元格
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div class="title-cell">
                        <strong>${item.title || '未命名'}</strong>
                        <small>${dateStr}</small>
                    </div>
                </td>
                <td>
                    <span class="expansion-badge ${expansionType.class}">${expansionType.name}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-view" data-id="${item.id}" title="查看">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-delete" data-id="${item.id}" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // 添加查看事件
            row.querySelector('.btn-view').addEventListener('click', function() {
                self.viewMindmap(item.id);
            });
            
            // 添加删除事件
            row.querySelector('.btn-delete').addEventListener('click', function() {
                self.deleteMindmap(item.id, chapterId);
            });
            
            tbody.appendChild(row);
        });
        
        // 添加保存按钮提示 - 如果表中没有数据
        if (items.length === 0) {
            const tipRow = document.createElement('tr');
            tipRow.className = 'tip-row';
            tipRow.innerHTML = `
                <td colspan="4" style="text-align:center; padding:10px; background-color:#f0f8ff; color:#333;">
                    <i class="fas fa-info-circle"></i>
                    <span>生成思维导图后，请点击"保存"按钮保存到列表中</span>
                </td>
            `;
            tbody.appendChild(tipRow);
        }
    },
    
    /**
     * 查看思维导图
     * @param {number} id - 思维导图ID
     */
    viewMindmap: function(id) {
        console.log('查看思维导图:', id);
        
        // 使用API请求方法加载思维导图数据
        this.apiRequest(`mindmap/${id}`)
            .then(result => {
                if (result && result.tree) {
                    // 显示思维导图预览
                    const echartData = this.convertToFrontendFormat(result.tree);
                    this.showMindmapPreview(echartData, result.title, result.expansion_type);
                } else {
                    throw new Error('未获取到有效的思维导图数据');
                }
            })
            .catch(error => {
                console.error('加载思维导图失败:', error);
                this.showNotification(`加载失败: ${error.message}`, 'error');
            });
    },
    
    /**
     * 删除思维导图
     * @param {number} id - 思维导图ID
     * @param {string|number} chapterId - 章节ID，用于刷新列表
     */
    deleteMindmap: function(id, chapterId) {
        console.log(`删除思维导图: ${id}`);
        
        // 确认删除
        if (!confirm('确定要删除这个思维导图吗？')) {
            return;
        }
        
        // 使用API请求方法删除思维导图 - 确保路径格式正确
        this.apiRequest(`mindmap/${id}`, {
            method: 'DELETE'
        })
        .then(result => {
            this.showNotification('删除成功', 'success');
            // 重新加载列表
            this.loadKnowledgeExpansions(chapterId);
        })
        .catch(error => {
            console.error('删除失败:', error);
            this.showNotification(`删除失败: ${error.message}`, 'error');
        });
    },
    
    /**
     * 显示思维导图预览
     * @param {Object} data - 思维导图数据
     * @param {string} title - 思维导图标题
     * @param {number} expansionType - 拓展类型值
     */
    showMindmapPreview: function(data, title, expansionType) {
        // 查找或创建预览容器
        let previewContainer = document.getElementById('mindmap-preview-container');
        
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.id = 'mindmap-preview-container';
            
            previewContainer.innerHTML = `
                <div class="modal-content mindmap-preview">
                    <div class="modal-header">
                        <h3 class="preview-title"></h3>
                        <span class="preview-expansion-type"></span>
                        <button class="close-modal-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="mindmap-preview-chart" style="width: 100%; height: 600px;"></div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(previewContainer);
            
            // 添加关闭事件
            const closeBtn = previewContainer.querySelector('.close-modal-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    previewContainer.style.display = 'none';
                });
            }
            
            // 点击模态框背景时关闭
            previewContainer.addEventListener('click', function(e) {
                if (e.target === previewContainer) {
                    previewContainer.style.display = 'none';
                }
            });
            
            // 按ESC键关闭模态框
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && previewContainer.style.display === 'flex') {
                    previewContainer.style.display = 'none';
                }
            });
        }
        
        // 设置标题
        const titleElement = previewContainer.querySelector('.preview-title');
        if (titleElement) {
            titleElement.textContent = title || '思维导图预览';
        }
        
        // 显示拓展类型
        const typeElement = previewContainer.querySelector('.preview-expansion-type');
        if (typeElement) {
            // 拓展类型映射表
            const expansionTypeMap = {
                1: { name: '文化渊源', class: 'origin' },
                2: { name: '文化发展', class: 'development' },
                3: { name: '文化创新', class: 'innovation' },
                4: { name: '区域文化', class: 'regional' },
                5: { name: '跨学科知识', class: 'interdisciplinary' },
                6: { name: '中西文化对比', class: 'comparative' }
            };
            
            const typeInfo = expansionType ? expansionTypeMap[expansionType] || { name: '未知类型', class: 'default' } : { name: '思维导图', class: 'default' };
            typeElement.innerHTML = `<span class="expansion-badge ${typeInfo.class}">${typeInfo.name}</span>`;
        }
        
        // 显示预览
        previewContainer.style.display = 'flex';
        
        // 渲染思维导图
        const chartContainer = document.getElementById('mindmap-preview-chart');
        if (chartContainer) {
            // 确保清除之前的图表实例
            if (chartContainer._echartsInstance) {
                chartContainer._echartsInstance.dispose();
            }
            
            // 添加操作提示
            let tipEl = chartContainer.querySelector('.mindmap-operation-tip');
            if (!tipEl) {
                tipEl = document.createElement('div');
                tipEl.className = 'mindmap-operation-tip';
                tipEl.innerHTML = `
                    <i class="fas fa-info-circle"></i>操作提示:
                    <ul>
                        <li>鼠标拖拽：平移视图</li>
                        <li>鼠标滚轮：缩放视图</li>
                        <li>点击节点：展开/折叠</li>
                    </ul>
                `;
                chartContainer.style.position = 'relative';
                chartContainer.appendChild(tipEl);
                
                // 6秒后提示自动淡出
                setTimeout(() => {
                    tipEl.style.opacity = '0';
                    setTimeout(() => {
                        if (tipEl.parentNode) {
                            tipEl.parentNode.removeChild(tipEl);
                        }
                    }, 500);
                }, 6000);
            }
            
            const chart = echarts.init(chartContainer);
            chartContainer._echartsInstance = chart;
            
            const option = {
                title: {
                    text: title || '思维导图预览',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: { title: '保存为图片' },
                        restore: { title: '还原' },
                        dataZoom: { title: '区域缩放' }
                    }
                },
                // 添加缩放控制器
                dataZoom: [
                    {
                        type: 'inside', // 支持内置型（鼠标滚轮）
                        filterMode: 'filter'
                    }
                ],
                // 添加视图控制
                visualMap: {
                    show: false,
                    seriesIndex: 0
                },
                series: [
                    {
                        type: 'tree',
                        id: 0,
                        name: 'mindmap preview',
                        data: [data],
                        top: '10%',
                        left: '10%',
                        bottom: '10%',
                        right: '10%',
                        symbolSize: 12,
                        edgeShape: 'polyline',
                        edgeForkPosition: '50%',
                        initialTreeDepth: 2,
                        lineStyle: {
                            width: 2
                        },
                        label: {
                            backgroundColor: '#fff',
                            position: 'left',
                            verticalAlign: 'middle',
                            align: 'right',
                            fontSize: 14
                        },
                        leaves: {
                            label: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        },
                        emphasis: {
                            focus: 'descendant'
                        },
                        expandAndCollapse: true,
                        animationDuration: 550,
                        animationDurationUpdate: 750,
                        // 启用鼠标拖拽平移功能
                        roam: true
                    }
                ]
            };
            
            chart.setOption(option);
            
            // 适应窗口大小变化
            const resizeChart = function() {
                if (chart && !chart.isDisposed()) {
                    chart.resize();
                }
            };
            
            window.addEventListener('resize', resizeChart);
            
            // 在模态框隐藏时移除事件监听器
            const originalDisplay = previewContainer.style.display;
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'style') {
                        const currentDisplay = previewContainer.style.display;
                        if (originalDisplay !== currentDisplay && currentDisplay === 'none') {
                            window.removeEventListener('resize', resizeChart);
                            observer.disconnect();
                        }
                    }
                });
            });
            
            observer.observe(previewContainer, { attributes: true });
        }
    },
    
    /**
     * 将后端数据转换为前端ECharts格式
     * @param {Object} node - 后端节点数据
     * @returns {Object} - 前端格式节点数据
     */
    convertToFrontendFormat: function(node) {
        if (!node) return null;
        
        const result = {
            name: node.name || node.value || '未命名节点',
            value: node.value || node.name || '',
        };
        
        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
            result.children = node.children.map(child => this.convertToFrontendFormat(child));
        }
        
        return result;
    },
    
    /**
     * 显示保存提示，提醒用户点击保存按钮
     */
    showSaveReminder: function() {
        // 查找保存按钮并添加闪烁效果
        const saveButton = document.querySelector('#knowledge-content .result-action-btn.save-highlight');
        if (saveButton) {
            // 强调保存按钮
            saveButton.style.animation = 'none'; // 重置动画
            setTimeout(() => {
                saveButton.style.animation = 'pulse 2s infinite';
            }, 10);
            
            // 显示提示消息
            this.showNotification('思维导图已生成，请点击"保存"按钮将其保存到数据库', 'info', 5000);
            
            // 创建或更新提醒标签
            let reminderEl = document.getElementById('save-reminder');
            if (!reminderEl) {
                reminderEl = document.createElement('div');
                reminderEl.id = 'save-reminder';
                reminderEl.style.cssText = 'margin-top:10px; padding:8px 12px; background-color:#f0f8ff; border-left:4px solid #28a745; font-size:14px; color:#333; border-radius:4px;';
                
                const mindmapContainer = document.querySelector('.mindmap-container');
                if (mindmapContainer && mindmapContainer.parentNode) {
                    mindmapContainer.parentNode.appendChild(reminderEl);
                }
            }
            
            reminderEl.innerHTML = '<i class="fas fa-info-circle" style="margin-right:5px;"></i> <strong>提示:</strong> 请点击上方的<span style="color:#28a745;font-weight:bold;">保存</span>按钮，将思维导图保存到数据库。';
            
            // 3秒后自动消失
            setTimeout(() => {
                if (reminderEl && reminderEl.parentNode) {
                    reminderEl.style.opacity = '0.7';
                }
            }, 3000);
        }
    },
};

// 导出模块
window.KnowledgeExpansion = KnowledgeExpansion; 