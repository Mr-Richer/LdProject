// 设置离线模式，使用模拟数据
window.isOfflineMode = false; // 设置为false，从API获取实际数据

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航系统
    initNavigation();
    
    // 初始化语言切换
    initLanguageToggle();
    
    // 初始化章节创建模态框
    initChapterModal();
    
    // 初始化章节卡片交互
    initChapterCards();
    
    // 初始化选项卡切换
    initTabSwitching();
    
    // 初始化通知系统
    initNotifications();
    
    // 初始化日期显示
    updateCurrentDate();
    
    // 初始化教学助手交互
    initTeachingAssistant();
    
    // 初始化知识点抽取功能
    initKnowledgeExtraction();
    
    // 初始化章节进度条更新
    updateChapterProgress();
    
    // 加载课程章节数据
    loadChapters();
    
    console.log('页面功能初始化完成');
});

/**
 * 初始化导航系统
 * 处理侧边栏导航项的点击事件，切换内容区域的显示
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitleZh = document.querySelector('.current-page-title.zh');
    const pageTitleEn = document.querySelector('.current-page-title.en');
    
    // 确保初始状态下至少有一个导航项和内容区域是激活的
    if (navItems.length > 0 && !document.querySelector('.nav-item.active')) {
        navItems[0].classList.add('active');
    }
    
    if (contentSections.length > 0 && !document.querySelector('.content-section.active')) {
        contentSections[0].classList.add('active');
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有导航项的活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // 为当前点击的导航项添加活动状态
            this.classList.add('active');
            
            // 获取要显示的内容区域的ID
            const sectionId = this.getAttribute('data-section') + '-section';
            
            // 隐藏所有内容区域
            contentSections.forEach(section => section.classList.remove('active'));
            
            // 显示对应的内容区域
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // 更新页面标题
                const navTextZh = this.querySelector('.nav-text.zh');
                const navTextEn = this.querySelector('.nav-text.en');
                
                if (pageTitleZh && navTextZh) pageTitleZh.textContent = navTextZh.textContent;
                if (pageTitleEn && navTextEn) pageTitleEn.textContent = navTextEn.textContent;
                
                // 添加动态效果
                animateContentChange(targetSection);
                
                // 显示通知
                const titleText = navTextZh ? navTextZh.textContent : this.getAttribute('data-section');
                showNotification(`已切换到${titleText}`, 'success');
            } else {
                console.error(`找不到内容区域: ${sectionId}`);
                showNotification('无法找到相应内容区域', 'error');
            }
        });
    });
}

/**
 * 初始化语言切换
 * 处理语言切换按钮的点击事件，切换界面语言
 */
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    
    langToggle.addEventListener('click', function() {
        document.body.classList.toggle('en-mode');
        
        // 触发语言更改事件，供其他需要响应语言变化的组件使用
        const langChangeEvent = new Event('langchange');
        document.body.dispatchEvent(langChangeEvent);
        
        // 添加切换动画效果
        const elements = document.querySelectorAll('.zh, .en');
        elements.forEach(el => {
            el.style.transition = 'opacity 0.3s ease';
            el.style.opacity = '0';
            
            setTimeout(() => {
                el.style.opacity = '1';
            }, 300);
        });
    });
}

/**
 * 初始化章节创建模态框
 */
function initChapterModal() {
    const modal = document.getElementById('newChapterModal');
    const openBtn = document.getElementById('newChapterBtn');
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtns = modal.querySelectorAll('.btn-cancel');
    const confirmBtns = modal.querySelectorAll('.btn-confirm');
    
    // 打开模态框
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
    
    // 关闭模态框的多种方式
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // 重置表单
        const form = modal.querySelector('.modal-body');
        form.querySelectorAll('input[type="text"], textarea').forEach(input => {
            input.value = '';
        });
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 确认按钮 - 将数据保存到数据库
    confirmBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const form = document.getElementById('newChapterForm');
            
            // 获取表单数据
            const chapterNumber = document.getElementById('chapterNumber').value.trim();
            const titleZh = document.getElementById('titleZh').value.trim();
            const titleEn = document.getElementById('titleEn').value.trim();
            const descriptionZh = document.getElementById('descriptionZh').value.trim();
            const descriptionEn = document.getElementById('descriptionEn').value.trim();
            const isPublished = document.getElementById('isPublished').checked;
            
            // 验证必填字段
            if (!chapterNumber || !titleZh || !titleEn) {
                showNotification('请填写必填字段（章节编号和标题）', 'warning');
                return;
            }
            
            try {
                // 创建要发送的数据对象 - 只包含数据库表中存在的字段
                const chapterData = {
                    chapter_number: parseInt(chapterNumber),
                    title_zh: titleZh,
                    title_en: titleEn,
                    description_zh: descriptionZh,
                    description_en: descriptionEn,
                    is_published: isPublished,
                    order_index: parseInt(chapterNumber) // 默认使用章节编号作为排序索引
                };
                
                // 处理封面图片
                const fileInput = document.getElementById('coverImage');
                if (fileInput && fileInput.files && fileInput.files[0]) {
                    // 这里应该上传图片到服务器
                    // 简单起见，我们使用默认图片路径
                    chapterData.cover_image = '../picture/banner.jpg';
                }
                
                // 显示加载状态
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span class="zh">保存中...</span><span class="en">Saving...</span>';
                
                console.log('发送章节数据:', chapterData);
                
                // 发送API请求保存章节数据
                const response = await fetch('http://localhost:3000/api/chapters', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(chapterData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `API错误: ${response.status}`);
                }
                
                const result = await response.json();
                console.log('章节保存成功:', result);
                
                // 显示成功消息
                showNotification('章节创建成功！', 'success');
                
                // 关闭模态框
                closeModal();
                
                // 保存创建的章节编号，用于后续定位
                const createdChapterNumber = parseInt(chapterNumber);
                
                // 重新加载章节列表并在加载完成后滚动到新章节位置
                await loadChaptersAndScrollToNew(createdChapterNumber);
                
            } catch (error) {
                console.error('保存章节时出错:', error);
                showNotification(`保存失败: ${error.message}`, 'error');
            } finally {
                // 恢复按钮状态
                btn.disabled = false;
                btn.innerHTML = '<span class="zh">保存</span><span class="en">Save</span>';
            }
        });
    });
    
    // 文件上传预览
    const fileInput = document.getElementById('coverImage');
    const filePreview = modal.querySelector('.file-preview');
    
    if (fileInput && filePreview) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    filePreview.innerHTML = `<img src="${event.target.result}" alt="封面预览" class="preview-img">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

/**
 * 初始化章节卡片交互
 */
function initChapterCards() {
    // 获取章节卡片容器
    const chaptersContainer = document.getElementById('chaptersContainer');
    if (!chaptersContainer) return;
    
    // 为所有章节卡片添加点击事件
    const chapterCards = chaptersContainer.querySelectorAll('.chapter-card');
    chapterCards.forEach(card => {
        // 添加卡片整体点击事件 - 打开章节详情
        card.addEventListener('click', function(e) {
            // 避免按钮点击事件冒泡
            if (e.target.closest('.chapter-action-btn')) return;
            
            const chapterId = this.getAttribute('data-id');
            const chapterTitle = this.querySelector('.chapter-title.zh').textContent;
            console.log('打开章节详情:', chapterTitle, '(ID:', chapterId, ')');
            showNotification(`正在查看${chapterTitle}`, 'info');
        });
    });
    
    // 编辑按钮
    const editBtns = chaptersContainer.querySelectorAll('.chapter-action-btn.edit');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            const chapterId = this.getAttribute('data-id');
            const card = this.closest('.chapter-card');
            const chapterTitle = card.querySelector('.chapter-title.zh').textContent;
            console.log('编辑章节:', chapterTitle, '(ID:', chapterId, ')');
            showNotification(`正在编辑${chapterTitle}...`, 'info');
        });
    });
    
    // 备课按钮
    const prepareBtns = chaptersContainer.querySelectorAll('.chapter-action-btn.prepare');
    prepareBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            const chapterId = this.getAttribute('data-id');
            const card = this.closest('.chapter-card');
            const chapterTitle = card.querySelector('.chapter-title.zh').textContent;
            
            // 切换到AI助教-课前界面
            const aiPreNavItem = document.querySelector('.nav-item[data-section="ai-pre"]');
            if (aiPreNavItem) {
                aiPreNavItem.click();
            }
            
            console.log('备课:', chapterTitle, '(ID:', chapterId, ')');
            showNotification(`已切换到${chapterTitle}的备课界面`, 'success');
        });
    });
    
    // 授课按钮
    const teachBtns = chaptersContainer.querySelectorAll('.chapter-action-btn.teach');
    teachBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            const chapterId = this.getAttribute('data-id');
            const card = this.closest('.chapter-card');
            const chapterTitle = card.querySelector('.chapter-title.zh').textContent;
            
            // 切换到AI助教-课中界面
            const aiInNavItem = document.querySelector('.nav-item[data-section="ai-in"]');
            if (aiInNavItem) {
                aiInNavItem.click();
            }
            
            console.log('上课:', chapterTitle, '(ID:', chapterId, ')');
            showNotification(`已切换到${chapterTitle}的授课界面`, 'success');
        });
    });
    
    // 初始化章节导航按钮
    initChapterNavButtons();
}

/**
 * 初始化选项卡切换
 */
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabContainer = this.closest('.tab-container');
            const targetId = this.getAttribute('data-tab');
            
            // 更新按钮状态
            tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新内容状态
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
        });
    });
}

/**
 * 初始化通知系统
 */
function initNotifications() {
    // 全局通知函数 - 取消右上角提示框的显示
    window.showNotification = function(message, type = 'info') {
        // 仅在控制台输出通知信息，不在界面显示提示框
        console.log(`通知 [${type}]: ${message}`);
        return null;
    };
}

/**
 * 更新当前日期显示
 */
function updateCurrentDate() {
    const dateZh = document.getElementById('current-date-zh');
    const dateEn = document.getElementById('current-date-en');
    
    if (dateZh && dateEn) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        dateZh.textContent = now.toLocaleDateString('zh-CN', options);
        dateEn.textContent = now.toLocaleDateString('en-US', options);
    }
}

/**
 * 初始化教学助手交互
 */
function initTeachingAssistant() {
    const assistantPrompts = document.querySelectorAll('.assistant-prompt');
    const assistantResults = document.querySelectorAll('.assistant-result');
    const generateButtons = document.querySelectorAll('.generate-btn');
    
    generateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const assistantContainer = this.closest('.assistant-container');
            const promptInput = assistantContainer.querySelector('.assistant-prompt');
            const resultContainer = assistantContainer.querySelector('.assistant-result');
            
            if (promptInput && resultContainer) {
                const prompt = promptInput.value.trim();
                
                if (prompt) {
                    // 显示加载状态
                    resultContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> 正在生成内容...</div>';
                    
                    // 模拟API请求延迟
                    setTimeout(() => {
                        generateAssistantResponse(prompt, resultContainer);
                    }, 1500);
                } else {
                    showNotification('请输入提示词', 'warning');
                }
            }
        });
    });
}

/**
 * 生成教学助手响应
 * @param {string} prompt 提示词
 * @param {HTMLElement} container 结果容器
 */
function generateAssistantResponse(prompt, container) {
    // 这里应该是实际的API调用
    // 目前使用模拟响应
    let response = '';
    
    if (prompt.includes('复习')) {
        response = `
            <h3>复习内容建议</h3>
            <p>根据学生学习情况，建议重点复习以下内容：</p>
            <ul>
                <li>文化礼仪中的尊老爱幼传统</li>
                <li>茶道的历史发展与基本礼仪</li>
                <li>传统节日中的文化象征意义</li>
            </ul>
            <p>复习方式建议：</p>
            <ol>
                <li>小组讨论传统礼仪在现代生活中的应用</li>
                <li>观看茶道表演视频并进行简单实践</li>
                <li>设计一个传统节日主题海报，解释其文化内涵</li>
            </ol>
        `;
    } else if (prompt.includes('难点')) {
        response = `
            <h3>教学难点分析</h3>
            <p>本章节的主要教学难点包括：</p>
            <ul>
                <li>传统文化核心价值在现代语境下的理解</li>
                <li>文化符号背后的哲学思想理解</li>
                <li>传统艺术形式的审美标准与欣赏方法</li>
            </ul>
            <p>针对性建议：</p>
            <ol>
                <li>使用现代案例进行类比，建立联系</li>
                <li>通过视觉化图表展示抽象概念</li>
                <li>提供多感官体验，如音频、视频和实物展示</li>
            </ol>
        `;
    } else if (prompt.includes('测试') || prompt.includes('考试')) {
        response = `
            <h3>考试题目建议</h3>
            <p>根据本章节内容，建议出题方向：</p>
            <ul>
                <li>多选题：传统节日的文化象征与习俗</li>
                <li>判断题：传统礼仪的现代应用场景</li>
                <li>简答题：分析一种传统艺术形式的美学特点</li>
                <li>论述题：传统文化核心价值观在现代社会的传承与创新</li>
            </ul>
            <p>考试形式建议：结合课堂表现、笔试和实践项目的综合评估</p>
        `;
    } else {
        response = `
            <h3>教学建议</h3>
            <p>基于您的提示词"${prompt}"，建议以下教学策略：</p>
            <ul>
                <li>增加课堂互动环节，提高学生参与度</li>
                <li>使用真实案例分析，加深理解</li>
                <li>引入多媒体资源，丰富教学内容</li>
                <li>设计分组活动，促进协作学习</li>
            </ul>
            <p>教学资源推荐：</p>
            <ol>
                <li>《中国传统文化精要》视频系列</li>
                <li>国家图书馆数字资源库中的传统文化专题</li>
                <li>中华传统美德故事集</li>
            </ol>
        `;
    }
    
    // 更新结果容器
    container.innerHTML = response;
    
    // 显示通知
    showNotification('内容生成完成', 'success');
}

/**
 * 初始化知识点抽取功能
 */
function initKnowledgeExtraction() {
    const extractButtons = document.querySelectorAll('.extract-btn');
    
    extractButtons.forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('.knowledge-extraction');
            const sourceText = container.querySelector('.source-text');
            const resultContainer = container.querySelector('.extraction-result');
            
            if (sourceText && resultContainer) {
                const text = sourceText.value.trim();
                
                if (text) {
                    // 显示加载状态
                    resultContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> 正在抽取知识点...</div>';
                    
                    // 模拟API请求延迟
                    setTimeout(() => {
                        extractKnowledgePoints(text, resultContainer);
                    }, 1500);
                } else {
                    showNotification('请输入文本内容', 'warning');
                }
            }
        });
    });
}

/**
 * 抽取知识点
 * @param {string} text 源文本
 * @param {HTMLElement} container 结果容器
 */
function extractKnowledgePoints(text, container) {
    // 模拟知识点抽取结果
    const result = `
        <div class="knowledge-tree">
            <div class="knowledge-node main-node">
                <span class="node-content">中国传统文化</span>
                <div class="sub-nodes">
                    <div class="knowledge-node">
                        <span class="node-content">传统礼仪</span>
                        <div class="sub-nodes">
                            <div class="knowledge-node">
                                <span class="node-content">尊老爱幼</span>
                            </div>
                            <div class="knowledge-node">
                                <span class="node-content">待客之道</span>
                            </div>
                        </div>
                    </div>
                    <div class="knowledge-node">
                        <span class="node-content">传统艺术</span>
                        <div class="sub-nodes">
                            <div class="knowledge-node">
                                <span class="node-content">书法</span>
                            </div>
                            <div class="knowledge-node">
                                <span class="node-content">国画</span>
                            </div>
                            <div class="knowledge-node">
                                <span class="node-content">戏曲</span>
                            </div>
                        </div>
                    </div>
                    <div class="knowledge-node">
                        <span class="node-content">传统节日</span>
                        <div class="sub-nodes">
                            <div class="knowledge-node">
                                <span class="node-content">春节</span>
                            </div>
                            <div class="knowledge-node">
                                <span class="node-content">中秋节</span>
                            </div>
                            <div class="knowledge-node">
                                <span class="node-content">端午节</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 更新结果容器
    container.innerHTML = result;
    
    // 添加交互性
    const nodes = container.querySelectorAll('.knowledge-node');
    nodes.forEach(node => {
        const content = node.querySelector('.node-content');
        const subNodes = node.querySelector('.sub-nodes');
        
        if (content && subNodes) {
            content.addEventListener('click', () => {
                node.classList.toggle('expanded');
            });
            
            // 默认展开主节点
            if (node.classList.contains('main-node')) {
                node.classList.add('expanded');
            }
        }
    });
    
    // 显示通知
    showNotification('知识点抽取完成', 'success');
}

/**
 * 更新章节进度条
 */
function updateChapterProgress() {
    const progressBars = document.querySelectorAll('.progress-bar-inner');
    
    progressBars.forEach(bar => {
        const progress = parseInt(bar.getAttribute('data-progress') || '0');
        bar.style.width = `${progress}%`;
        
        // 根据进度添加不同的颜色
        if (progress < 30) {
            bar.style.backgroundColor = '#FF5722';
        } else if (progress < 70) {
            bar.style.backgroundColor = '#FFC107';
        } else {
            bar.style.backgroundColor = '#4CAF50';
        }
    });
}

/**
 * 添加内容切换动画效果
 * @param {HTMLElement} element 需要添加动画的元素
 */
function animateContentChange(element) {
    if (!element) return;
    
    // 使用更轻量的动画方式，避免强制触发重绘
    element.style.transition = 'none';
    element.style.opacity = '0.5';
    
    // 使用requestAnimationFrame而不是强制触发重绘
    requestAnimationFrame(() => {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '1';
    });
}

/**
 * 加载课程章节数据
 * 在离线模式下使用模拟数据，在线模式尝试从API获取
 */
function loadChapters() {
    console.log('开始加载课程章节数据...');
    
    const chaptersContainer = document.getElementById('chaptersContainer');
    const loadingIndicator = document.getElementById('chaptersLoading');
    
    if (!chaptersContainer) {
        console.error('找不到章节容器：#chaptersContainer');
        // 尝试在DOM中创建章节容器
        const chaptersSection = document.querySelector('.chapters-section');
        if (chaptersSection) {
            const newContainer = document.createElement('div');
            newContainer.className = 'chapters-container';
            newContainer.id = 'chaptersContainer';
            
            // 添加加载指示器
            const newLoadingIndicator = document.createElement('div');
            newLoadingIndicator.className = 'loading-indicator';
            newLoadingIndicator.id = 'chaptersLoading';
            newLoadingIndicator.innerHTML = `
                <div class="spinner"></div>
                <p class="zh">加载章节中...</p>
                <p class="en">Loading chapters...</p>
            `;
            
            newContainer.appendChild(newLoadingIndicator);
            
            // 查找合适的位置插入
            const prevBtn = chaptersSection.querySelector('.chapter-nav-btn.prev-btn');
            const nextBtn = chaptersSection.querySelector('.chapter-nav-btn.next-btn');
            
            if (prevBtn && nextBtn) {
                chaptersSection.insertBefore(newContainer, nextBtn);
                console.log('成功创建章节容器');
                // 重新获取引用
                return setTimeout(() => loadChapters(), 100);
            }
        }
        return;
    }
    
    console.log('已找到章节容器，继续加载...');
    
    // 显示加载指示器
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
    
    // 从API获取数据
    console.log('尝试从API获取章节数据');
    
    // 设置请求超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
    
    // 使用实际数据库API地址
    const apiUrl = 'http://localhost:3000/api/chapters';
    
    fetch(apiUrl, { 
        signal: controller.signal,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error('获取章节列表失败: ' + response.status);
        }
        console.log('API响应状态码:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('成功获取章节数据 (原始格式):', data);
        
        // 根据您的数据库结构，适配数据格式
        let chaptersData;
        
        try {
            if (Array.isArray(data)) {
                // 直接返回数组格式
                console.log('数据格式: 数组');
                chaptersData = data;
            } else if (data.data && Array.isArray(data.data)) {
                // { data: [...] } 格式
                console.log('数据格式: { data: [...] }');
                chaptersData = data.data;
            } else if (data.data && data.data.chapters && Array.isArray(data.data.chapters)) {
                // { data: { chapters: [...] } } 格式
                console.log('数据格式: { data: { chapters: [...] } }');
                chaptersData = data.data.chapters;
            } else if (data.chapters && Array.isArray(data.chapters)) {
                // { chapters: [...] } 格式
                console.log('数据格式: { chapters: [...] }');
                chaptersData = data.chapters;
            } else if (data.code === 200 && data.data && Array.isArray(data.data)) {
                // { code: 200, data: [...] } 格式
                console.log('数据格式: { code: 200, data: [...] }');
                chaptersData = data.data;
            } else if (data.code === 200 && data.data && data.data.chapters && Array.isArray(data.data.chapters)) {
                // { code: 200, data: { chapters: [...] } } 格式
                console.log('数据格式: { code: 200, data: { chapters: [...] } }');
                chaptersData = data.data.chapters;
            } else {
                // 尝试查找嵌套属性中的数组
                console.log('尝试查找嵌套属性中的数组');
                const findArrayInObject = (obj, depth = 0) => {
                    if (depth > 3) return null; // 防止过深递归
                    if (!obj || typeof obj !== 'object') return null;
                    
                    // 直接检查当前对象的属性
                    for (const key in obj) {
                        if (Array.isArray(obj[key])) {
                            console.log(`在属性 ${key} 中找到数组`);
                            return obj[key];
                        }
                    }
                    
                    // 递归检查嵌套对象
                    for (const key in obj) {
                        if (obj[key] && typeof obj[key] === 'object') {
                            const result = findArrayInObject(obj[key], depth + 1);
                            if (result) return result;
                        }
                    }
                    
                    return null;
                };
                
                const arrayFound = findArrayInObject(data);
                if (arrayFound && arrayFound.length > 0) {
                    console.log('在嵌套属性中找到数组');
                    chaptersData = arrayFound;
                } else {
                    console.error('数据结构:', JSON.stringify(data));
                    throw new Error('无法识别的数据格式');
                }
            }
            
            console.log('解析后的章节数据:', chaptersData);
            
            if (chaptersData && chaptersData.length > 0) {
                renderChapters(chaptersData);
            } else {
                console.error('没有找到有效的章节数据');
                showEmptyState();
            }
        } catch (error) {
            console.error('解析数据时出错:', error);
            showEmptyState();
        }
    })
    .catch(error => {
        console.error('加载章节数据出错:', error);
        
        // 显示错误状态
        showEmptyState(error.message);
        
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    });
    
    // 绑定章节导航按钮事件
    const prevBtn = document.querySelector('.chapter-nav-btn.prev-btn');
    const nextBtn = document.querySelector('.chapter-nav-btn.next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            chaptersContainer.scrollBy({ left: -350, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            chaptersContainer.scrollBy({ left: 350, behavior: 'smooth' });
        });
    }

    // 显示空状态或错误状态
    function showEmptyState(errorMessage) {
        if (!chaptersContainer) return;
        
        chaptersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p class="zh">暂无章节数据</p>
                <p class="en">No chapters available</p>
                ${errorMessage ? `<p class="error-details">${errorMessage}</p>` : ''}
            </div>
        `;
    }
}

/**
 * 渲染章节卡片
 * @param {Array} chapters 章节数据数组
 */
function renderChapters(chapters) {
    console.log('开始渲染章节...');
    
    const chaptersContainer = document.getElementById('chaptersContainer');
    const loadingIndicator = document.getElementById('chaptersLoading');
    
    if (!chaptersContainer) {
        console.error('找不到章节容器元素 #chaptersContainer');
        return;
    }
    
    // 隐藏加载指示器
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    // 清空容器
    chaptersContainer.innerHTML = '';
    
    // 检查数据
    if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
        console.warn('没有章节数据可显示');
        chaptersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p class="zh">暂无章节数据</p>
                <p class="en">No chapters available</p>
            </div>
        `;
        return;
    }
    
    console.log(`准备渲染 ${chapters.length} 个章节卡片`, chapters);
    
    try {
        // 根据章节号排序
        if (chapters[0].chapter_number !== undefined) {
            chapters.sort((a, b) => a.chapter_number - b.chapter_number);
        } else if (chapters[0].order_index !== undefined) {
            chapters.sort((a, b) => a.order_index - b.order_index);
        }
        
        // 定义字段映射函数，尝试从数据中找到最匹配的字段
        const getField = (chapter, possibleFields) => {
            for (const field of possibleFields) {
                if (chapter[field] !== undefined) {
                    return chapter[field];
                }
            }
            return null; // 未找到匹配的字段
        };
    
    // 创建章节卡片
        chapters.forEach((chapter, index) => {
            // 获取章节信息
            const chapterId = getField(chapter, ['id', 'chapter_id', '_id']) || index + 1;
            const chapterNumber = getField(chapter, ['chapter_number', 'number', 'index', 'order']) || index + 1;
            const titleZh = getField(chapter, ['title_zh', 'title', 'name_zh', 'name', 'zh_title']) || `第${chapterNumber}章`;
            const titleEn = getField(chapter, ['title_en', 'en_title', 'english_title']) || `Chapter ${chapterNumber}`;
            const descriptionZh = getField(chapter, ['description_zh', 'desc_zh', 'description', 'desc', 'content_zh']) || '';
            const descriptionEn = getField(chapter, ['description_en', 'desc_en', 'en_description', 'content_en']) || '';
            const imagePath = getField(chapter, ['cover_image', 'image_path', 'image', 'cover', 'thumbnail']) || '../picture/banner.jpg';
            
            // 处理更新时间
            let updateTimeStr = '更新于 3周前';
            if (chapter.updated_at) {
                const updateTime = new Date(chapter.updated_at);
                const now = new Date();
                const diffTime = Math.abs(now - updateTime);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays < 1) {
                    updateTimeStr = '更新于 今天';
                } else if (diffDays < 2) {
                    updateTimeStr = '更新于 昨天';
                } else if (diffDays < 7) {
                    const diffWeeks = Math.ceil(diffDays / 7);
                    updateTimeStr = `更新于 ${diffWeeks}周前`;
                } else if (diffDays < 30) {
                    const diffMonths = Math.ceil(diffDays / 30);
                    updateTimeStr = `更新于 ${diffMonths}月前`;
                } else {
                    const diffYears = Math.ceil(diffDays / 365);
                    updateTimeStr = `更新于 ${diffYears}年前`;
                }
            }
            
            // 创建章节卡片
            const card = document.createElement('div');
            card.className = 'chapter-card';
            card.setAttribute('data-id', chapterId);
            
            // 设置卡片内容 - 按照新样式报告的HTML结构
            // 增加卡片宽度和上下间距的样式
            card.style.width = '350px';
            card.style.marginBottom = '20px';
            card.style.padding = '15px';
            
            // 确保章节标题中包含"第X章："的格式
            let formattedTitleZh = titleZh;
            let formattedTitleEn = titleEn;
            
            // 如果标题中没有包含"第X章"格式，添加上去
            if (!formattedTitleZh.match(/^第\d+章[：:]/) && chapterNumber) {
                formattedTitleZh = `第${chapterNumber}章：${formattedTitleZh.replace(/^第\d+章\s*/, '')}`;
            }
            
            // 如果标题中没有包含"Chapter X"格式，添加上去
            if (!formattedTitleEn.match(/^Chapter\s+\d+[：:]/i) && chapterNumber) {
                formattedTitleEn = `Chapter ${chapterNumber}: ${formattedTitleEn.replace(/^Chapter\s+\d+\s*/, '')}`;
            }
            
            card.innerHTML = `
                <div class="chapter-cover">
                    <img src="${imagePath}" alt="${formattedTitleZh}" onerror="this.src='../picture/banner.jpg'" class="chapter-img">
                    <div class="chapter-actions">
                        <button class="chapter-action-btn edit" title="编辑章节" data-id="${chapterId}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="chapter-action-btn prepare" title="备课" data-id="${chapterId}">
                            <i class="fas fa-magic"></i>
                        </button>
                        <button class="chapter-action-btn teach" title="上课" data-id="${chapterId}">
                            <i class="fas fa-chalkboard-teacher"></i>
                        </button>
                    </div>
                </div>
                <div class="chapter-info">
                    <h3 class="chapter-title zh">${formattedTitleZh}</h3>
                    <h3 class="chapter-title en">${formattedTitleEn}</h3>
                    <p class="chapter-desc zh">${descriptionZh}</p>
                    <p class="chapter-desc en">${descriptionEn}</p>
                    <div class="chapter-meta" style="overflow: visible; white-space: nowrap; margin-top: 10px; margin-bottom: 5px;">
                        <div class="meta-item">
                            <i class="far fa-clock"></i>
                            <span class="zh" style="display: inline-block;">${updateTimeStr}</span>
                            <span class="en" style="display: inline-block;">Updated recently</span>
                        </div>
                    </div>
                </div>
            `;
        
            // 将卡片添加到容器
            chaptersContainer.appendChild(card);
            console.log(`已渲染章节 ${index + 1}/${chapters.length}: ${formattedTitleZh}`);
        });
    
        // 初始化章节卡片交互
        initChapterCards();
    
        console.log('章节渲染完成');
    } catch (error) {
        console.error('渲染章节卡片时出错:', error);
        chaptersContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p class="zh">渲染章节时出错</p>
                <p class="en">Error rendering chapters</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;
    }
}

/**
 * 获取状态文本
 * @param {string} status 状态代码
 * @param {string} lang 语言代码
 * @returns {string} 状态文本
 */
function getStatusText(status, lang) {
    const statusMap = {
        'completed': { zh: '已完成', en: 'Completed' },
        'in-progress': { zh: '进行中', en: 'In Progress' },
        'upcoming': { zh: '未开始', en: 'Upcoming' }
    };
    
    if (statusMap[status] && statusMap[status][lang]) {
        return statusMap[status][lang];
    }
    
    return lang === 'zh' ? '未知状态' : 'Unknown';
}

// 移除页面完全加载后的诊断代码，避免重复添加事件监听器导致卡顿
window.addEventListener('load', function() {
    // 确保二维码弹窗在页面加载时立即隐藏
    const qrcodeModal = document.getElementById('qrcodeModal');
    if (qrcodeModal) {
        qrcodeModal.style.display = 'none';
        qrcodeModal.classList.remove('show');
        qrcodeModal.style.opacity = '0';
        qrcodeModal.style.visibility = 'hidden';
    }
});

/**
 * 初始化章节导航按钮
 * 添加左右滚动章节列表的功能
 */
function initChapterNavButtons() {
    const chaptersSection = document.querySelector('.chapters-section');
    const chaptersContainer = document.getElementById('chaptersContainer');
    
    if (!chaptersSection || !chaptersContainer) return;
    
    // 检查是否已经有导航按钮
    if (chaptersSection.querySelector('.chapter-nav-btn')) return;
    
    // 创建上一章按钮
    const prevBtn = document.createElement('button');
    prevBtn.className = 'chapter-nav-btn prev-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.title = '查看上一章';
    
    // 创建下一章按钮
    const nextBtn = document.createElement('button');
    nextBtn.className = 'chapter-nav-btn next-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.title = '查看下一章';
    
    // 添加到章节区域
    chaptersSection.appendChild(prevBtn);
    chaptersSection.appendChild(nextBtn);
    
    // 添加点击事件
    prevBtn.addEventListener('click', function() {
        chaptersContainer.scrollBy({ left: -350, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', function() {
        chaptersContainer.scrollBy({ left: 350, behavior: 'smooth' });
    });
    
    // 滚动时处理按钮显示/隐藏
    chaptersContainer.addEventListener('scroll', function() {
        const isAtStart = chaptersContainer.scrollLeft <= 10;
        const isAtEnd = chaptersContainer.scrollLeft + chaptersContainer.clientWidth >= chaptersContainer.scrollWidth - 10;
        
        prevBtn.style.opacity = isAtStart ? '0.5' : '1';
        prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
        
        nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
        nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    });
    
    // 初始化按钮状态
    setTimeout(() => {
        const scrollEvent = new Event('scroll');
        chaptersContainer.dispatchEvent(scrollEvent);
    }, 500);
}

/**
 * 加载章节数据并滚动到新创建的章节位置
 * @param {number} targetChapterNumber - 要滚动到的章节编号
 */
async function loadChaptersAndScrollToNew(targetChapterNumber) {
    // 先加载全部章节
    await new Promise(resolve => {
        // 保存原始的renderChapters函数
        const originalRenderChapters = window.renderChapters || renderChapters;
        
        // 重写renderChapters函数，在渲染完成后执行回调
        window.renderChapters = function(chapters) {
            // 调用原始的渲染函数
            originalRenderChapters(chapters);
            
            // 渲染完成后恢复原函数并解析Promise
            window.renderChapters = originalRenderChapters;
            resolve();
        };
        
        // 开始加载章节
        loadChapters();
    });
    
    // 章节加载完成后，找到并滚动到目标章节
    setTimeout(() => {
        const chaptersContainer = document.getElementById('chaptersContainer');
        if (!chaptersContainer) return;
        
        // 查找与目标章节编号匹配的章节卡片
        const chapterCards = chaptersContainer.querySelectorAll('.chapter-card');
        let targetCard = null;
        let targetIndex = -1;
        
        chapterCards.forEach((card, index) => {
            const cardTitle = card.querySelector('.chapter-title.zh').textContent;
            // 检查标题是否包含目标章节编号
            if (cardTitle.includes(`第${targetChapterNumber}章`)) {
                targetCard = card;
                targetIndex = index;
            }
        });
        
        if (targetCard) {
            console.log(`找到新创建的章节卡片，索引: ${targetIndex}`);
            
            // 计算目标章节的位置
            const cardWidth = targetCard.offsetWidth;
            const cardMargin = 20; // 假设每个卡片有20px的外边距
            const scrollPosition = (cardWidth + cardMargin) * targetIndex;
            
            // 平滑滚动到目标位置
            chaptersContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            // 添加高亮效果
            targetCard.classList.add('highlight-new');
            
            // 3秒后移除高亮效果
            setTimeout(() => {
                targetCard.classList.remove('highlight-new');
            }, 3000);
        }
    }, 500); // 给渲染一些时间
}

// 添加新样式以突出显示新创建的章节
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    .chapter-card.highlight-new {
        box-shadow: 0 0 20px rgba(233, 30, 99, 0.8);
        transform: scale(1.03);
        transition: all 0.3s ease;
        z-index: 10;
    }
`;
document.head.appendChild(highlightStyle); 
