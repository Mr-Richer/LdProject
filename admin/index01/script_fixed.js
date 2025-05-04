// 设置离线模式，使用模拟数据
window.isOfflineMode = false; // 设置为false，从API获取实际数据

// API配置
window.API_BASE_URL = 'http://localhost:3000'; // 开发环境
// 不再使用const声明，直接使用全局变量

// 动态加载ChapterUpload组件脚本
function loadChapterUploadScript() {
    return new Promise((resolve, reject) => {
        // 检查是否已加载
        if (window.ChapterUpload) {
            console.log('ChapterUpload组件已加载');
            resolve();
            return;
        }
        
        console.log('开始加载ChapterUpload组件...');
        const script = document.createElement('script');
        script.src = '../src/components/chapter/ChapterUpload.js';
        script.onload = () => {
            console.log('ChapterUpload组件加载成功');
            resolve();
        };
        script.onerror = (error) => {
            console.error('ChapterUpload组件加载失败:', error);
            reject(new Error('无法加载ChapterUpload组件'));
        };
        document.head.appendChild(script);
    });
}

// 动态加载PPT模块
function loadPPTModules() {
    return new Promise((resolve) => {
        console.log('PPT模块加载已被禁用');
        resolve(false);
    });
}

// 确保没有其他script_new.js在运行
function checkForConflictingScripts() {
    const scriptTags = document.querySelectorAll('script');
    for (const scriptTag of scriptTags) {
        const src = scriptTag.getAttribute('src');
        if (src && (src.includes('script_new.js') || src.includes('script.js.original'))) {
            console.warn(`发现可能的冲突脚本: ${src}，这可能导致重复创建章节`);
            return true;
        }
    }
    return false;
}

// 添加顶级样式，确保导航按钮总是可见
const topLevelStyle = document.createElement('style');
topLevelStyle.textContent = `
    .chapter-nav-btn {
        position: absolute !important; /* 改为absolute, 相对于chapters-section定位 */
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 40px !important;
        height: 40px !important;
        background-color: white !important;
        border-radius: 50% !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
        border: none !important;
        z-index: 100 !important; /* 较小的z-index，避免覆盖其他UI元素 */
        cursor: pointer !important;
        font-size: 18px !important;
        color: #333 !important;
        top: 50% !important; /* 垂直居中 */
        transform: translateY(-50%) !important;
    }
    
    .chapter-nav-btn.prev-btn {
        left: 10px !important;
    }
    
    .chapter-nav-btn.next-btn {
        right: 10px !important;
    }
    
    .chapter-nav-btn:hover {
        background-color: #f5f5f5 !important;
        transform: translateY(-50%) scale(1.1) !important;
    }
    
    .chapter-nav-btn:active {
        transform: translateY(-50%) scale(0.95) !important;
    }
    
    .chapter-nav-btn.disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
    }
    
    .chapters-container {
        position: relative !important;
        padding: 0 60px !important; /* 增加内边距，为按钮留出空间 */
    }
`;
document.head.appendChild(topLevelStyle);

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', async function() {
    // 检查是否存在冲突脚本
    const hasConflicts = checkForConflictingScripts();
    if (hasConflicts) {
        console.warn('检测到可能的脚本冲突，这可能导致重复创建章节。请检查HTML中是否加载了多个JS文件。');
    }
    
    // 先加载ChapterUpload组件
    try {
        await loadChapterUploadScript();
    } catch (error) {
        console.error('加载ChapterUpload组件失败:', error);
        showNotification('系统错误：无法加载章节上传组件', 'error');
    }
    
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
    
    // 初始化章节选择器
    initChapterSelector();
    
    // 初始化AI助教-课前选项卡切换
    initAIPreTabs();
    
    // 初始化AI助教-课前部分
    initAIPre();
    
    // 初始化AI助教-课中部分
    initAIInClass();
    
    // 初始化签到二维码按钮
    initQRCodeDisplay();
    
    // 初始化课中章节选择器
    initInClassChapterSelector();
    
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
        
        // 重置图片预览
        const filePreview = modal.querySelector('.file-preview');
        if (filePreview) {
            filePreview.innerHTML = '';
        }
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
    
    // 确认按钮 - 使用ChapterUpload组件的方法而不是自己实现
    confirmBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            // 检查是否有ChapterUpload组件
            if (window.ChapterUpload && typeof window.ChapterUpload.submitNewChapter === 'function') {
                // 使用ChapterUpload组件的方法提交表单
                console.log('使用ChapterUpload组件提交表单');
            try {
                // 显示加载状态
                    const originalBtnText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span class="zh">保存中...</span><span class="en">Saving...</span>';
                
                    // 调用ChapterUpload的提交方法
                    await window.ChapterUpload.submitNewChapter();
                
                // 关闭模态框
                closeModal();
                
                    // 获取创建的章节编号
                    let newChapterNumber = null;
                    if (window.ChapterUpload && window.ChapterUpload.getLastCreatedChapter) {
                        newChapterNumber = window.ChapterUpload.getLastCreatedChapter().chapter_number;
                    } else {
                        // 如果没有获取方法，尝试从表单获取
                        const chapterNumberInput = modal.querySelector('input[name="chapter_number"]');
                        if (chapterNumberInput) {
                            newChapterNumber = chapterNumberInput.value;
                        }
                    }
                
                    // 重新加载章节列表并滚动到新创建的章节
                    if (newChapterNumber) {
                        await loadChaptersAndScrollToNew(newChapterNumber);
                    } else {
                        // 如果无法获取章节编号，回退到普通加载
                        await loadChapters();
                    }
                
                // 更新章节统计数据
                updateChapterStats();
                
                    // 刷新课前章节选择器
                    if (window.PreClass && typeof window.PreClass.refreshChapterSelector === 'function') {
                        // 使用短延迟，确保章节创建完全完成后再刷新选择器
                        setTimeout(() => {
                            window.PreClass.refreshChapterSelector();
                            console.log('已刷新课前章节选择器');
                        }, 300);
                    }
                    
                    // 刷新所有章节选择器
                    if (typeof window.ChapterUpload.refreshAllSelectors === 'function') {
                        window.ChapterUpload.refreshAllSelectors();
                    }
            } catch (error) {
                console.error('保存章节时出错:', error);
                showNotification(`保存失败: ${error.message}`, 'error');
            } finally {
                // 恢复按钮状态
                btn.disabled = false;
                btn.innerHTML = '<span class="zh">保存</span><span class="en">Save</span>';
                }
            } else {
                // ChapterUpload组件不可用，显示错误
                console.error('ChapterUpload组件未加载或submitNewChapter方法不可用');
                showNotification('系统错误：章节创建组件未加载', 'error');
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
            
            // 从章节卡片中提取章节编号
            const chapterNumberMatch = chapterTitle.match(/第(\d+)章/);
            const chapterNumber = chapterNumberMatch ? chapterNumberMatch[1] : null;
            
            // 切换到AI助教-课前界面
            const aiPreNavItem = document.querySelector('.nav-item[data-section="ai-pre"]');
            if (aiPreNavItem) {
                // 先切换到课前界面
                aiPreNavItem.click();
                
                // 设置延时，等待页面切换完成
                setTimeout(() => {
                    // 查找章节选择器
                    const chapterSelect = document.getElementById('chapter-select');
                    if (chapterSelect && chapterNumber) {
                        // 根据当前语言模式选择对应的选项
                        const isEnMode = document.body.classList.contains('en-mode');
                        const selector = isEnMode ? `option.en[value="${chapterNumber}"]` : `option.zh[value="${chapterNumber}"]`;
                        const option = chapterSelect.querySelector(selector);
                        
                        if (option) {
                            // 设置选中的章节
                            option.selected = true;
                            
                            // 触发change事件
                            const event = new Event('change');
                            chapterSelect.dispatchEvent(event);
                            
                            console.log(`已选择章节 ${chapterNumber}`);
                        } else {
                            console.error(`未找到章节选项: ${chapterNumber}`);
                        }
                    } else {
                        console.error('未找到章节选择器或章节编号无效');
                    }
                }, 300); // 等待300毫秒，确保页面切换完成
            }
            
            console.log('备课:', chapterTitle, '(ID:', chapterId, ', 章节编号:', chapterNumber, ')');
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
            
            // 确保tabContainer存在
            if (tabContainer) {
            // 更新按钮状态
            tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新内容状态
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
                
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            } else {
                console.error('无法找到tab容器元素');
                this.classList.add('active');
                
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    // 找到同级别的其他内容元素，先隐藏它们
                    const siblingContents = document.querySelectorAll('.tab-content');
                    siblingContents.forEach(content => content.classList.remove('active'));
                    
                    // 显示目标内容
                    targetContent.classList.add('active');
                }
            }
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
    
    // 检查是否找到了生成按钮
    if (generateButtons.length === 0) {
        console.error('找不到生成按钮元素 .generate-btn');
        return;
    }
    
    generateButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 检查按钮是否在小测区域内
            const quizContainer = this.closest('.quiz-container');
            if (quizContainer) {
                // 如果是小测区域的生成按钮，使用小测的逻辑
                const quizResult = document.querySelector('.quiz-result');
                const generatedQuestionsList = document.querySelector('.generated-questions-list');
                
                if (quizResult) {
                    quizResult.style.display = 'block';
                }
                
                if (generatedQuestionsList) {
                    generatedQuestionsList.style.display = 'block';
                }
                
                showNotification('小测题目生成成功!', 'success');
                return;
            }
            
            // 其他区域的生成按钮使用原来的逻辑
            const assistantContainer = this.closest('.assistant-container');
            if (!assistantContainer) {
                console.error('找不到助手容器元素 .assistant-container');
                return;
            }
            
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
 * 加载章节数据
 */
function loadChapters() {
    console.log('开始加载章节数据...');
    
    const chaptersContainer = document.getElementById('chaptersContainer');
    const loadingIndicator = document.getElementById('chaptersLoading');
    
    if (!chaptersContainer) {
        console.error('找不到章节容器元素 #chaptersContainer');
        return;
    }
    
    if (!loadingIndicator) {
        console.warn('找不到加载指示器元素 #chaptersLoading');
    } else {
        loadingIndicator.style.display = 'flex';
    }
    
    // 调用API获取章节数据
    fetch(`${window.API_BASE_URL}/api/chapters`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('成功获取章节数据:', data);
            
            if (data.code === 200 && data.data && data.data.chapters) {
                // 渲染章节卡片
                renderChapters(data.data.chapters);
            } else {
                throw new Error(data.message || '获取章节数据失败，返回的数据结构不正确');
            }
            
            // 更新章节统计数据
            updateChapterStats();
        })
        .catch(error => {
            console.error('加载章节数据失败:', error);
            
            if (loadingIndicator) {
                loadingIndicator.innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p class="zh">加载失败: ${error.message}</p>
                        <p class="en">Loading failed: ${error.message}</p>
                    </div>
                `;
            }
        });
}

/**
 * 从数据库获取章节统计数据并更新UI
 */
function updateChapterStats() {
    // 获取章节统计数据
    fetch(`${window.API_BASE_URL}/api/chapters/stats`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.code === 200 && result.data) {
                // 更新章节数量显示
                const chapterCountElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
                if (chapterCountElement) {
                    chapterCountElement.textContent = result.data.total;
                }
                
                // 更新新增数量显示
                const chapterChangeElement = document.querySelector('.stat-card:nth-child(1) .stat-change');
                if (chapterChangeElement && result.data.newToday > 0) {
                    chapterChangeElement.style.display = 'flex';
                    const countSpan = chapterChangeElement.querySelector('span');
                    if (countSpan) {
                        countSpan.textContent = `+${result.data.newToday}`;
                    }
                } else if (chapterChangeElement) {
                    chapterChangeElement.style.display = 'none';
                }
            }
        })
        .catch(error => {
            console.error('获取章节统计数据失败:', error);
        });
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
            
            // 处理更新时间 - 格式化为年月日格式
            let updateTimeZh = '未知日期';
            let updateTimeEn = 'Unknown date';
            
            // 获取更新时间字段
            const updateTimeValue = getField(chapter, ['updated_at', 'update_time', 'updateTime', 'last_updated', 'lastUpdated']);
            
            if (updateTimeValue) {
                try {
                    const updateTime = new Date(updateTimeValue);
                    
                    // 检查日期是否有效
                    if (!isNaN(updateTime.getTime())) {
                        // 中文格式：YYYY年MM月DD日
                        updateTimeZh = `${updateTime.getFullYear()}年${updateTime.getMonth() + 1}月${updateTime.getDate()}日`;
                        
                        // 英文格式：MMM DD, YYYY
                        const options = { year: 'numeric', month: 'short', day: 'numeric' };
                        updateTimeEn = updateTime.toLocaleDateString('en-US', options);
                    }
                } catch (e) {
                    console.error('日期格式化错误:', e);
                }
            }
            
            // 创建章节卡片
            const card = document.createElement('div');
            card.className = 'chapter-card';
            card.setAttribute('data-id', chapterId);
            card.setAttribute('data-index', index); // 添加索引属性，用于滑块导航
            
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
                    <img src="${processImageUrl(imagePath)}" alt="${formattedTitleZh}" onerror="this.src='../picture/banner.jpg'" class="chapter-img">
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
                            <span class="zh" style="display: inline-block;">${updateTimeZh}</span>
                            <span class="en" style="display: inline-block;">${updateTimeEn}</span>
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
    
    // 删除已有的按钮（如果有）
    const existingPrevBtn = document.querySelector('.chapter-nav-btn.prev-btn');
    const existingNextBtn = document.querySelector('.chapter-nav-btn.next-btn');
    
    if (existingPrevBtn) existingPrevBtn.remove();
    if (existingNextBtn) existingNextBtn.remove();
    
    // 创建新的按钮
    const prevBtn = document.createElement('button');
    prevBtn.className = 'chapter-nav-btn prev-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.title = '查看上一章';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'chapter-nav-btn next-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.title = '查看下一章';
    
    // 将按钮添加到章节区域内部，而不是body
    chaptersSection.appendChild(prevBtn);
    chaptersSection.appendChild(nextBtn);
    
    // 更新按钮状态方法
    function updateButtonsPosition() {
        // 计算是否在开始或结束位置
        const isAtStart = chaptersContainer.scrollLeft <= 10;
        const isAtEnd = chaptersContainer.scrollLeft + chaptersContainer.clientWidth >= chaptersContainer.scrollWidth - 10;
        
        // 更新按钮状态
        if (isAtStart) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        
        if (isAtEnd) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
    
    // 添加点击事件
    prevBtn.addEventListener('click', function() {
        if (!this.classList.contains('disabled')) {
            chaptersContainer.scrollBy({ left: -350, behavior: 'smooth' });
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (!this.classList.contains('disabled')) {
            chaptersContainer.scrollBy({ left: 350, behavior: 'smooth' });
        }
    });
    
    // 监听滚动事件
    chaptersContainer.addEventListener('scroll', updateButtonsPosition);
    
    // 立即更新位置
    updateButtonsPosition();
    
    // 确保初始化后更新一次
    setTimeout(updateButtonsPosition, 500);
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

/**
 * 处理图片URL，确保URL格式正确
 * @param {string} url - 原始URL
 * @return {string} - 处理后的URL
 */
function processImageUrl(url) {
    if (!url) return '../picture/banner.jpg';
    
    // 如果是完整的URL(http://或https://开头)，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // 如果是以/开头的绝对路径，添加API基础URL
    if (url.startsWith('/')) {
        // 去掉API_BASE_URL结尾的斜杠(如果有)
        const baseUrl = window.API_BASE_URL.endsWith('/') ? window.API_BASE_URL.slice(0, -1) : window.API_BASE_URL;
        return `${baseUrl}${url}`;
    }
    
    // 其他情况保持原样(相对路径)
    return url;
}

/**
 * 初始化章节选择器
 * @returns {Promise} 初始化完成的Promise
 */
function initChapterSelector() {
    console.log('开始初始化课前章节选择器...');
    
    return new Promise((resolve, reject) => {
    const chapterSelect = document.getElementById('chapter-select');
    if (!chapterSelect) {
            console.error('课前章节选择器元素未找到');
            reject(new Error('课前章节选择器元素未找到'));
        return;
    }
    
    // 显示加载中状态
        chapterSelect.innerHTML = '<option disabled selected class="zh">加载中...</option><option disabled selected class="en">Loading...</option>';
    
    // 获取章节数据
    fetch(`${window.API_BASE_URL}/api/chapters`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.code === 200 && result.data && result.data.chapters && result.data.chapters.length > 0) {
                // 清空现有选项
                chapterSelect.innerHTML = '';
                
                // 按章节编号排序
                const sortedChapters = result.data.chapters.sort((a, b) => 
                    a.chapter_number - b.chapter_number
                );
                
                // 添加章节选项
                sortedChapters.forEach(chapter => {
                    // 添加中文选项
                    const optionZh = document.createElement('option');
                    optionZh.value = chapter.chapter_number;
                    optionZh.textContent = `第${chapter.chapter_number}章：${chapter.title_zh || ''}`;
                    optionZh.classList.add('zh');
                    chapterSelect.appendChild(optionZh);
                    
                    // 添加英文选项
                    const optionEn = document.createElement('option');
                    optionEn.value = chapter.chapter_number;
                    optionEn.textContent = `Chapter ${chapter.chapter_number}: ${chapter.title_en || ''}`;
                    optionEn.classList.add('en');
                    chapterSelect.appendChild(optionEn);
                });
                
                    console.log('课前章节选择器初始化完成');
                    
                    // 移除现有事件监听器，避免重复绑定
                    chapterSelect.removeEventListener('change', window._chapterSelectChangeHandler);
                
                // 添加选择器变更事件
                    window._chapterSelectChangeHandler = function() {
                addChapterSelectChangeEvent(chapterSelect);
                    };
                    
                    chapterSelect.addEventListener('change', window._chapterSelectChangeHandler);
                
                // 选择第一个章节（如果没有预选）
                    const currentLang = document.body.classList.contains('en-mode') ? 'en' : 'zh';
                    if (chapterSelect.selectedIndex === -1) {
                        const firstOption = chapterSelect.querySelector(`option.${currentLang}`);
                        if (firstOption) firstOption.selected = true;
                }
                
                // 触发change事件，初始化内容
                const event = new Event('change');
                chapterSelect.dispatchEvent(event);
                    
                    resolve(true);
            } else {
                // 没有数据时显示提示
                chapterSelect.innerHTML = '<option disabled selected class="zh">暂无章节数据</option><option disabled selected class="en">No chapters available</option>';
                    console.error('未获取到课前章节数据');
                    showNotification('未能获取课前章节数据，请检查网络连接或联系管理员', 'error');
                    reject(new Error('未获取到课前章节数据'));
            }
        })
        .catch(error => {
                console.error('获取课前章节数据出错:', error);
            chapterSelect.innerHTML = '<option disabled selected class="zh">获取数据失败</option><option disabled selected class="en">Failed to load data</option>';
                showNotification('获取课前章节数据失败: ' + error.message, 'error');
                reject(error);
            });
    });
}

/**
 * 初始化课中章节选择器
 * @returns {Promise} 初始化完成的Promise
 */
function initInClassChapterSelector() {
    console.log('开始初始化课中章节选择器...');
    
    return new Promise((resolve, reject) => {
        const inClassChapterSelect = document.getElementById('in-class-chapter-select');
        if (!inClassChapterSelect) {
            console.error('课中章节选择器元素未找到');
            reject(new Error('课中章节选择器元素未找到'));
            return;
        }
        
        // 显示加载中状态
        inClassChapterSelect.innerHTML = '<option disabled selected class="zh">加载中...</option><option disabled selected class="en">Loading...</option>';
        
        // 获取章节数据
        fetch(`${window.API_BASE_URL}/api/chapters`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                if (result.code === 200 && result.data && result.data.chapters && result.data.chapters.length > 0) {
                    // 清空现有选项
                    inClassChapterSelect.innerHTML = '';
                    
                    // 按章节编号排序
                    const sortedChapters = result.data.chapters.sort((a, b) => 
                        a.chapter_number - b.chapter_number
                    );
                    
                    // 添加章节选项
                    sortedChapters.forEach(chapter => {
                        // 添加中文选项
                        const optionZh = document.createElement('option');
                        optionZh.value = chapter.chapter_number;
                        optionZh.textContent = `第${chapter.chapter_number}章：${chapter.title_zh || ''}`;
                        optionZh.classList.add('zh');
                        inClassChapterSelect.appendChild(optionZh);
                        
                        // 添加英文选项
                        const optionEn = document.createElement('option');
                        optionEn.value = chapter.chapter_number;
                        optionEn.textContent = `Chapter ${chapter.chapter_number}: ${chapter.title_en || ''}`;
                        optionEn.classList.add('en');
                        inClassChapterSelect.appendChild(optionEn);
                    });
                    
                    console.log('课中章节选择器初始化完成');
                    
                    // 移除现有事件监听器，避免重复绑定
                    inClassChapterSelect.removeEventListener('change', window._inClassChapterSelectChangeHandler);
                    
                    // 添加选择器变更事件
                    window._inClassChapterSelectChangeHandler = function() {
                        addInClassChapterSelectChangeEvent(inClassChapterSelect);
                    };
                    
                    inClassChapterSelect.addEventListener('change', window._inClassChapterSelectChangeHandler);
                    
                    // 选择第一个章节（如果没有预选）
                    const currentLang = document.body.classList.contains('en-mode') ? 'en' : 'zh';
                    if (inClassChapterSelect.selectedIndex === -1) {
                        const firstOption = inClassChapterSelect.querySelector(`option.${currentLang}`);
                        if (firstOption) firstOption.selected = true;
                    }
                    
                    // 不触发change事件，让用户主动选择才加载PPT
                    // 这与课前的行为不同，是为了避免自动加载大型PPT文件
                    
                    resolve(true);
                } else {
                    // 没有数据时显示提示
                    inClassChapterSelect.innerHTML = '<option disabled selected class="zh">暂无章节数据</option><option disabled selected class="en">No chapters available</option>';
                    console.error('未获取到课中章节数据');
                    showNotification('未能获取课中章节数据，请检查网络连接或联系管理员', 'error');
                    reject(new Error('未获取到课中章节数据'));
                }
            })
            .catch(error => {
                console.error('获取课中章节数据出错:', error);
                inClassChapterSelect.innerHTML = '<option disabled selected class="zh">获取数据失败</option><option disabled selected class="en">Failed to load data</option>';
                showNotification('获取课中章节数据失败: ' + error.message, 'error');
                reject(error);
            });
        });
}

/**
 * 为章节选择器添加变更事件
 * @param {HTMLSelectElement} chapterSelect - 章节选择器元素
 */
function addChapterSelectChangeEvent(chapterSelect) {
    // 存储章节中英文名称的映射
    const chapterTitles = {
        zh: {},
        en: {}
    };
    
    // 处理所有章节选项，建立章节号与标题的映射
    for (let i = 0; i < chapterSelect.options.length; i++) {
        const option = chapterSelect.options[i];
        const value = option.value;
        
        if (!value) continue;
        
        if (option.classList.contains('zh')) {
            // 保存中文标题
            chapterTitles.zh[value] = option.textContent;
        } else if (option.classList.contains('en')) {
            // 保存英文标题
            chapterTitles.en[value] = option.textContent;
        }
    }
    
    // 移除现有的事件监听器（如果有的话）
    chapterSelect.removeEventListener('change', chapterSelectChangeHandler);
    
    // 添加新的事件监听器
    chapterSelect.addEventListener('change', chapterSelectChangeHandler);
    
    // 章节选择器变更事件处理函数
    function chapterSelectChangeHandler() {
        const chapterNumber = this.value;
        
        if (!chapterNumber) return;
            
        // 根据当前语言模式获取标题
        const lang = document.body.classList.contains('en-mode') ? 'en' : 'zh';
        const chapterTitle = chapterTitles[lang][chapterNumber] || chapterTitles.zh[chapterNumber];
        
        if (chapterTitle) {
            // 更新界面显示
            updateAIPreContent(chapterNumber, chapterTitle, lang);
            
            // 显示通知
            const message = lang === 'en' ? 
                `Switched to ${chapterTitle}` : 
                `已切换到${chapterTitle}`;
            showNotification(message, 'info');
        }
    }
}

/**
 * 更新AI课前内容区域
 * @param {string} chapterNumber - 章节编号
 * @param {string} chapterTitle - 章节标题
 * @param {string} lang - 语言模式 ('zh'或'en')
 */
function updateAIPreContent(chapterNumber, chapterTitle, lang = 'zh') {
    console.log(`正在加载章节 ${chapterNumber} 的课前内容, 语言: ${lang}`);
    
    // 更新标题显示
    const titleElements = document.querySelectorAll('.ai-pre-container .section-header h2');
    if (titleElements.length > 0) {
        titleElements.forEach(element => {
            if (element.classList.contains('zh')) {
                element.textContent = `章节备课: ${chapterTitle}`;
            } else if (element.classList.contains('en')) {
                // 注意这里使用英文标题
                const englishTitle = lang === 'en' ? chapterTitle : `Chapter ${chapterNumber}`;
                element.textContent = `Chapter Preparation: ${englishTitle}`;
            }
        });
    }
    
    // 更新相关内容区域
    // 例如：更新课前设计、内容生成等选项卡的内容
    
    // 更新知识点提取区域
    const extractionContainer = document.getElementById('knowledge-extraction-content');
    if (extractionContainer) {
        extractionContainer.innerHTML = `
            <div class="content-placeholder">
                <i class="fas fa-lightbulb"></i>
                <div class="placeholder-text zh">选择文本后点击"提取知识点"按钮</div>
                <div class="placeholder-text en">Select text and click "Extract Knowledge Points"</div>
                <div class="chapter-info zh">当前章节: ${chapterTitle}</div>
                <div class="chapter-info en">Current Chapter: ${lang === 'en' ? chapterTitle : `Chapter ${chapterNumber}`}</div>
            </div>
        `;
    }
    
    // 更新内容生成区域
    const contentGenContainer = document.getElementById('content-generation-content');
    if (contentGenContainer) {
        // 更新当前章节信息
        const chapterInfoElement = contentGenContainer.querySelector('.current-chapter-info');
        if (chapterInfoElement) {
            chapterInfoElement.innerHTML = `
                <span class="zh">当前章节: ${chapterTitle}</span>
                <span class="en">Current Chapter: ${lang === 'en' ? chapterTitle : `Chapter ${chapterNumber}`}</span>
            `;
        }
    }
    
    // 可以在这里添加更多内容更新逻辑
    // 例如更新课件设计、教学资源等选项卡
    
    // 触发一个自定义事件，通知其他组件章节已更改
    const chapterChangeEvent = new CustomEvent('chapterChanged', {
        detail: {
            chapterNumber: chapterNumber,
            chapterTitle: chapterTitle,
            language: lang
        }
    });
    document.dispatchEvent(chapterChangeEvent);
}

/**
 * 初始化AI助教-课前选项卡切换
 */
function initAIPreTabs() {
    const tabBtns = document.querySelectorAll('.ai-pre-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.ai-pre-tabs .tab-content');
    
    if (!tabBtns.length || !tabContents.length) {
        console.log('Tab buttons or contents not found');
        return;
    }
    
    console.log('Initializing AI Pre Tabs, found', tabBtns.length, 'buttons');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有选项卡的活动状态
            tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
            
            // 为当前点击的选项卡添加活动状态
            this.classList.add('active');
            
            // 获取要显示的内容区域的ID
            const tabId = this.getAttribute('data-tab');
            const contentId = tabId + '-content';
            
            console.log('Tab clicked:', tabId, 'Looking for content:', contentId);
            
            // 隐藏所有内容区域
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 显示对应的内容区域
            const targetContent = document.getElementById(contentId);
            if (targetContent) {
                targetContent.classList.add('active');
                // 添加动态效果
                animateTabContentChange(targetContent);
                console.log('Activated content:', contentId);
            } else {
                console.log('Content not found:', contentId);
            }
        });
    });
}

/**
 * 为选项卡内容添加切换动画
 * @param {HTMLElement} content - 要添加动画的内容元素
 */
function animateTabContentChange(content) {
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 50);
}

/**
 * 初始化AI助教-课前部分
 */
function initAIPre() {
    console.log('Initializing AI Pre section');
    
    // 初始化选项卡切换
    initAIPreTabs();
    
    // 初始化课件设计功能
    initCoursewareDesign();
    
    // PPT模块已被禁用
    console.log('PPT模块加载已被禁用');
    
    // 加载小测生成模块
    loadScript('../src/components/quizGenerator/QuizGenerator.js')
        .then(() => {
            if (window.QuizGenerator && typeof window.QuizGenerator.init === 'function') {
                window.QuizGenerator.init();
                console.log('课堂小测模块加载成功');
            } else {
                console.error('课堂小测模块加载失败：未找到QuizGenerator.init方法');
            }
        })
        .catch(error => {
            console.error('加载课堂小测模块失败:', error);
            showNotification('课堂小测模块加载失败', 'error');
        });
    
    // 初始化知识拓展功能
    initKnowledgeExpansion();
}

/**
 * 初始化课件设计功能
 */
function initCoursewareDesign() {
    console.log('Initializing Courseware Design');
    const coursewareContent = document.getElementById('courseware-content');
    if (!coursewareContent) {
        console.log('Courseware content not found');
        return;
    }

    const actionButtons = coursewareContent.querySelectorAll('.action-button');
    if (!actionButtons.length) {
        console.log('Action buttons not found');
        return;
    }
    
    const genBtn = actionButtons[0]; // 内容生成按钮是第一个按钮
    const replaceBtn = actionButtons[1]; // 替换课件按钮是第二个按钮
    
    // 内容生成按钮初始化
    if (genBtn) {
        genBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            console.log('Content generation button clicked');
            
            // 显示内容生成模态框
            const modal = document.getElementById('contentGenerateModal');
            if (modal) {
                modal.classList.add('active');
                // 初始化内容生成模态框，确保关闭按钮正常工作
                initContentGenerateModal();
            } else {
                console.log('Content generate modal not found');
            }
        });
    }
    
    // 初始化替换按钮
    initReplaceButton(replaceBtn);
    
    // 幻灯片缩略图交互
    const thumbnails = coursewareContent.querySelectorAll('.thumbnail-item');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // 处理缩略图点击
            console.log('Thumbnail clicked:', this.getAttribute('data-slide'));
        });
    });
}

/**
 * 初始化内容生成模态框
 * 处理内容生成模态框的打开、关闭和交互功能
 */
function initContentGenerateModal() {
    const modal = document.getElementById('contentGenerateModal');
    if (!modal) {
        console.log('Content generate modal not found');
        return;
    }
    
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const generateBtn = modal.querySelector('.generate-btn');
    const tabBtns = modal.querySelectorAll('.generate-tab-btn');
    const tabContents = modal.querySelectorAll('.generate-tab-content');
    const styleBtns = modal.querySelectorAll('.style-btn');
    const sizeBtns = modal.querySelectorAll('.size-btn');
    
    // 关闭弹窗
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Content generate modal closed');
    }
    
    // 移除所有现有的事件监听器（通过克隆和替换实现）
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        newCloseBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        newCancelBtn.addEventListener('click', closeModal);
    }
    
    // 切换选项卡
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有选项卡的激活状态
            tabBtns.forEach(tb => tb.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // 激活当前选项卡
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
    
    // 切换风格和尺寸按钮
    function toggleButtons(buttons) {
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除同组按钮的激活状态
                btn.parentElement.querySelectorAll('.style-btn, .size-btn').forEach(b => {
                    b.classList.remove('active');
                });
                // 激活当前按钮
                btn.classList.add('active');
            });
        });
    }
    
    toggleButtons(styleBtns);
    toggleButtons(sizeBtns);
    
    // 生成按钮点击事件
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const activeTab = document.querySelector('.generate-tab-content.active');
            const resultPlaceholder = activeTab.querySelector('.result-placeholder');
            const generatedContent = activeTab.querySelector('.generated-text, .generated-images');
            
            // 显示加载状态
            resultPlaceholder.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <p class="zh">正在生成中，请稍候...</p>
                <p class="en">Generating, please wait...</p>
            `;
            resultPlaceholder.style.display = 'flex';
            
            if (generatedContent) {
                generatedContent.style.display = 'none';
            }
            
            // 模拟生成过程 (这里可以替换为实际的API调用)
            setTimeout(() => {
                resultPlaceholder.style.display = 'none';
                
                if (generatedContent) {
                    generatedContent.style.display = 'block';
                    
                    // 根据不同的标签页填充不同的内容
                    if (activeTab.id === 'text2text-content') {
                        const generatedText = activeTab.querySelector('.generated-text');
                        if (generatedText) {
                            generatedText.innerHTML = `
                                <h4>中国传统绘画的特点与技法</h4>
                                <p>中国传统绘画有着悠久的历史，其独特的艺术特点和技法形成了与西方绘画截然不同的审美体系。</p>
                                <h5>一、中国传统绘画的主要特点</h5>
                                <ol>
                                    <li><strong>以线造型</strong>：中国画以线条为主要造型手段，讲究"线中有骨，骨中有神"。</li>
                                    <li><strong>写意精神</strong>：追求意境的表达，不拘泥于形似，而重在传达画家的思想情感。</li>
                                    <li><strong>虚实结合</strong>：画面中往往留有空白，形成"留白"艺术，使观者有想象的空间。</li>
                                    <li><strong>诗书画印结合</strong>：中国画常将诗词、书法、印章融为一体，形成独特的艺术形式。</li>
                                </ol>
                                <h5>二、主要技法</h5>
                                <ol>
                                    <li><strong>工笔</strong>：细腻精工，注重细节刻画，多用于人物、花鸟画。</li>
                                    <li><strong>写意</strong>：大胆潇洒，重在表达意境，多用于山水、花鸟画。</li>
                                    <li><strong>墨分五色</strong>：利用水墨浓淡变化，表现出丰富的层次和质感。</li>
                                    <li><strong>皴法</strong>：表现山石质感和结构的特殊技法，如披麻皴、斧劈皴等。</li>
                                </ol>
                            `;
                        }
                    } else if (activeTab.id === 'text2img-content') {
                        const generatedImages = activeTab.querySelector('.generated-images');
                        if (generatedImages) {
                            generatedImages.innerHTML = `
                                <div class="image-grid">
                                    <div class="generated-image-item">
                                        <img src="../picture/generated1.jpg" alt="Generated Image 1">
                                    </div>
                                    <div class="generated-image-item">
                                        <img src="../picture/generated2.jpg" alt="Generated Image 2">
                                    </div>
                                    <div class="generated-image-item">
                                        <img src="../picture/generated3.jpg" alt="Generated Image 3">
                                    </div>
                                    <div class="generated-image-item">
                                        <img src="../picture/generated4.jpg" alt="Generated Image 4">
                                    </div>
                                </div>
                            `;
                        }
                    }
                }
                
                // 启用操作按钮
                const actionBtns = activeTab.querySelectorAll('.result-action-btn');
                actionBtns.forEach(btn => {
                    btn.disabled = false;
                });
                
                showNotification('内容生成完成！', 'success');
            }, 2000);
        });
    }
}

/**
 * 初始化知识拓展功能
 */
function initKnowledgeExpansion() {
    console.log('Initializing Knowledge Expansion');
    
    const knowledgeContent = document.getElementById('knowledge-content');
    if (!knowledgeContent) {
        console.log('Knowledge content not found');
        return;
    }
    
    // 文化按钮选择
    const cultureBtns = knowledgeContent.querySelectorAll('.culture-btn');
    
    cultureBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cultureBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log('Culture button selected:', this.querySelector('span.zh').textContent);
        });
    });
    
    // 生成按钮
    const generateBtn = knowledgeContent.querySelector('.generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log('Generate knowledge expansion button clicked');
            showNotification('正在生成知识拓展...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                const knowledgeResult = document.querySelector('.knowledge-result');
                if (knowledgeResult) {
                    knowledgeResult.style.display = 'block';
                    
                    // 添加动画效果
                    knowledgeResult.style.opacity = '0';
                    knowledgeResult.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        knowledgeResult.style.opacity = '1';
                        knowledgeResult.style.transform = 'translateY(0)';
                        knowledgeResult.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        
                        // 显示知识拓展列表
                        const knowledgeExpansionList = document.querySelector('.knowledge-expansion-list');
                        if (knowledgeExpansionList) {
                            knowledgeExpansionList.style.display = 'block';
                        }
                    }, 50);
                }
                
                showNotification('知识拓展已生成', 'success');
            }, 1500);
        });
    }
} 

/**
 * 刷新章节选择器
 */
function refreshChapterSelector() {
    console.log('刷新课前章节选择器');
    
    // 获取课前章节选择器
    const chapterSelect = document.getElementById('chapter-select');
    if (!chapterSelect) {
        console.error('课前章节选择器元素未找到');
        return;
    }
    
    // 保存当前选中的值
    const currentSelectedValue = chapterSelect.value;
    
    // 重新初始化课前章节选择器
    initChapterSelector()
        .then(() => {
            // 如果之前有选中值，尝试恢复选择
            if (currentSelectedValue) {
                const options = Array.from(chapterSelect.options);
                const matchingOption = options.find(option => 
                    option.value === currentSelectedValue && 
                    option.classList.contains(document.body.classList.contains('en-mode') ? 'en' : 'zh')
                );
                
                if (matchingOption) {
                    matchingOption.selected = true;
                    // 手动触发一次change事件
                    const event = new Event('change');
                    chapterSelect.dispatchEvent(event);
                }
            }
        });
}

/**
 * 刷新课中章节选择器
 */
function refreshInClassChapterSelector() {
    console.log('刷新课中章节选择器');
                    
    // 获取课中章节选择器
    const inClassChapterSelect = document.getElementById('in-class-chapter-select');
    if (!inClassChapterSelect) {
        console.error('课中章节选择器元素未找到');
        return;
    }
    
    // 保存当前选中的值
    const currentSelectedValue = inClassChapterSelect.value;
                
    // 重新初始化课中章节选择器
    initInClassChapterSelector()
        .then(() => {
            // 如果之前有选中值，尝试恢复选择
                if (currentSelectedValue) {
                const options = Array.from(inClassChapterSelect.options);
                const matchingOption = options.find(option => 
                    option.value === currentSelectedValue && 
                    option.classList.contains(document.body.classList.contains('en-mode') ? 'en' : 'zh')
                );
                
                if (matchingOption) {
                    matchingOption.selected = true;
                    // 手动触发一次change事件
                    const event = new Event('change');
                    inClassChapterSelect.dispatchEvent(event);
                }
            }
        });
}

/**
 * 刷新所有章节选择器
 */
function refreshAllChapterSelectors() {
    console.log('刷新所有章节选择器...');
    
    // 检查当前激活的界面
    const activeSection = document.querySelector('.content-section.active');
    if (!activeSection) {
        console.warn('未找到活动界面，刷新所有选择器');
        // 如果找不到活动界面，刷新所有选择器
        refreshChapterSelector();
        refreshInClassChapterSelector();
        return;
    }
    
    // 根据当前活动的界面选择性刷新
    if (activeSection.id === 'ai-pre-section') {
        // 如果当前是课前界面，只刷新课前选择器
        console.log('当前在课前界面，只刷新课前选择器');
        refreshChapterSelector();
    } else if (activeSection.id === 'ai-in-section') {
        // 如果当前是课中界面，只刷新课中选择器
        console.log('当前在课中界面，只刷新课中选择器');
        refreshInClassChapterSelector();
            } else {
        // 其他界面，刷新所有选择器
        console.log('当前在其他界面，刷新所有选择器');
        refreshChapterSelector();
        refreshInClassChapterSelector();
    }
    
    // 刷新章节卡片列表
    loadChapters();
    
    // 更新章节统计数据
    updateChapterStats();
}

// 将函数挂载到window对象，使其可以作为全局函数访问
window.refreshAllChapterSelectors = refreshAllChapterSelectors;
window.refreshChapterSelector = refreshChapterSelector; // 为兼容现有代码保留此挂载
window.initChapterSelector = initChapterSelector;
window.initInClassChapterSelector = initInClassChapterSelector;

// PreClass命名空间也保留，保持兼容性
window.PreClass = window.PreClass || {};
window.PreClass.refreshChapterSelector = refreshChapterSelector; 

/**
 * 动态加载脚本
 * @param {string} url - 脚本URL
 * @returns {Promise} - 加载完成的Promise
 */
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            console.log(`脚本加载成功: ${url}`);
            resolve();
        };
        script.onerror = (error) => {
            console.error(`脚本加载失败: ${url}`, error);
            reject(new Error(`无法加载脚本: ${url}`));
        };
        document.head.appendChild(script);
    });
} 

// 替换课件按钮初始化 - 修改为不使用动态导入
function initReplaceButton(replaceBtn) {
    if (replaceBtn) {
        replaceBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            console.log('Replace courseware button clicked');
            
            // 获取当前章节并加载其PPT
            const chapterSelect = document.getElementById('chapter-select');
            if (chapterSelect && chapterSelect.value) {
                // 如果已加载PptLoader模块，使用它来加载PPT
                if (window.PptLoader && typeof window.PptLoader.loadChapterPPT === 'function') {
                    window.PptLoader.loadChapterPPT(chapterSelect.value);
                    showNotification('正在重新加载章节PPT', 'info');
                } else {
                    console.error('PPT加载器未找到，无法加载章节PPT');
                    // 如果模块未加载，退回到刷新iframe
                    const pptistFrame = document.getElementById('pptistFrame');
                    if (pptistFrame) {
                        pptistFrame.src = pptistFrame.src;
                        showNotification('已重新加载PPTist编辑器', 'info');
                    }
                }
            } else {
                // 如果没有选择章节，刷新PPTist iframe
                const pptistFrame = document.getElementById('pptistFrame');
                if (pptistFrame) {
                    pptistFrame.src = pptistFrame.src;
                    showNotification('已重新加载PPTist编辑器', 'info');
                } else {
                    showNotification('替换课件功能已触发', 'info');
                }
            }
        });
    }
}

/**
 * 初始化签到二维码按钮
 * 移除弹窗功能，仅保留按钮点击事件
 */
function initQRCodeDisplay() {
    // 查找签到二维码按钮
    const qrcodeBtn = document.querySelector('.panel-btn:not(.group-action-btn)');
    
    // 如果找不到按钮，直接返回
    if (!qrcodeBtn) {
        console.warn('签到二维码按钮未找到');
        return;
    }
    
    // 为签到按钮添加点击事件处理程序
    qrcodeBtn.addEventListener('click', function() {
        showNotification('签到二维码功能已禁用', 'info');
        console.log('签到二维码功能已禁用');
    });
}

/**
 * 初始化课中章节选择器
 */
function initInClassChapterSelector() {
    const inClassChapterSelect = document.getElementById('in-class-chapter-select');
    if (!inClassChapterSelect) {
        console.error('课中界面章节选择器元素未找到');
        return;
    }
    
    console.log('开始初始化课中界面章节选择器...');
    
    // 显示加载中状态
    inClassChapterSelect.innerHTML = '<option disabled selected class="zh">加载中...</option><option disabled selected class="en">Loading...</option>';
    
    // 获取章节数据
    fetch(`${window.API_BASE_URL}/api/chapters`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.code === 200 && result.data && result.data.chapters && result.data.chapters.length > 0) {
                // 清空现有选项
                inClassChapterSelect.innerHTML = '';
                
                // 按章节编号排序
                const sortedChapters = result.data.chapters.sort((a, b) => 
                    a.chapter_number - b.chapter_number
                );
                
                // 添加章节选项
                sortedChapters.forEach(chapter => {
                    // 添加中文选项
                    const optionZh = document.createElement('option');
                    optionZh.value = chapter.chapter_number;
                    optionZh.textContent = `第${chapter.chapter_number}章：${chapter.title_zh || ''}`;
                    optionZh.classList.add('zh');
                    inClassChapterSelect.appendChild(optionZh);
                    
                    // 添加英文选项
                    const optionEn = document.createElement('option');
                    optionEn.value = chapter.chapter_number;
                    optionEn.textContent = `Chapter ${chapter.chapter_number}: ${chapter.title_en || ''}`;
                    optionEn.classList.add('en');
                    inClassChapterSelect.appendChild(optionEn);
                });
                
                console.log('课中界面章节选择器初始化完成');
                
                // 添加选择器变更事件
                addInClassChapterSelectChangeEvent(inClassChapterSelect);
                
                // 选择第一个章节（如果没有预选）
                if (document.body.classList.contains('en-mode')) {
                    // 英文模式下选择第一个英文选项
                    const firstEnOption = inClassChapterSelect.querySelector('option.en');
                    if (firstEnOption) firstEnOption.selected = true;
                } else {
                    // 中文模式下选择第一个中文选项
                    const firstZhOption = inClassChapterSelect.querySelector('option.zh');
                    if (firstZhOption) firstZhOption.selected = true;
                }
                
                // 触发change事件，初始化内容
                const event = new Event('change');
                inClassChapterSelect.dispatchEvent(event);
            } else {
                // 没有数据时显示提示
                inClassChapterSelect.innerHTML = '<option disabled selected class="zh">暂无章节数据</option><option disabled selected class="en">No chapters available</option>';
                console.error('未获取到章节数据');
                showNotification('未能获取章节数据，请检查网络连接或联系管理员', 'error');
            }
        })
        .catch(error => {
            console.error('获取章节数据出错:', error);
            inClassChapterSelect.innerHTML = '<option disabled selected class="zh">获取数据失败</option><option disabled selected class="en">Failed to load data</option>';
            showNotification('获取章节数据失败: ' + error.message, 'error');
        });
}

/**
 * 为课中章节选择器添加变更事件
 * @param {HTMLSelectElement} inClassChapterSelect - 课中章节选择器元素
 */
function addInClassChapterSelectChangeEvent(inClassChapterSelect) {
    // 存储章节中英文名称的映射
    const chapterTitles = {
        zh: {},
        en: {}
    };
    
    // 处理所有章节选项，建立章节号与标题的映射
    for (let i = 0; i < inClassChapterSelect.options.length; i++) {
        const option = inClassChapterSelect.options[i];
        const value = option.value;
        
        if (!value) continue;
        
        if (option.classList.contains('zh')) {
            // 保存中文标题
            chapterTitles.zh[value] = option.textContent;
        } else if (option.classList.contains('en')) {
            // 保存英文标题
            chapterTitles.en[value] = option.textContent;
        }
    }
    
    // 移除现有的事件监听器（如果有的话）
    inClassChapterSelect.removeEventListener('change', inClassChapterSelectChangeHandler);
    
    // 添加新的事件监听器
    inClassChapterSelect.addEventListener('change', inClassChapterSelectChangeHandler);
    
    // 章节选择器变更事件处理函数
    function inClassChapterSelectChangeHandler() {
        const chapterNumber = this.value;
        
        if (!chapterNumber) return;
        
        // 根据当前语言模式获取标题
        const lang = document.body.classList.contains('en-mode') ? 'en' : 'zh';
        const chapterTitle = chapterTitles[lang][chapterNumber] || chapterTitles.zh[chapterNumber];
        
        // 如果不在课中界面，略过内容更新
        const aiInSection = document.getElementById('ai-in-section');
        if (!aiInSection || !aiInSection.classList.contains('active')) {
            console.log('当前不在课中界面，略过内容更新');
            
            // 记录选择但不执行操作
            console.log(`用户已选择章节 ${chapterNumber} (${chapterTitle})，但当前不在课中界面`);
            
            // 显示提示
            showNotification('请先切换到课中界面再选择章节', 'warning');
            return;
        }
        
        // 更新界面显示
        updateInClassContent(chapterNumber, chapterTitle, lang);
        
        // 显示通知
        const message = lang === 'en' ? 
            `Switched to ${chapterTitle}` : 
            `已切换到${chapterTitle}`;
        showNotification(message, 'info');
    }
}

/**
 * 更新AI课中内容区域
 * @param {string} chapterNumber - 章节编号
 * @param {string} chapterTitle - 章节标题
 * @param {string} lang - 语言模式 ('zh'或'en')
 */
function updateInClassContent(chapterNumber, chapterTitle, lang = 'zh') {
    console.log(`正在更新课中界面的章节 ${chapterNumber} (${chapterTitle}) 内容, 语言: ${lang}`);
    
    // 如果当前不在课中界面，不执行更新操作
    const aiInSection = document.getElementById('ai-in-section');
    if (!aiInSection || !aiInSection.classList.contains('active')) {
        console.log('当前不在课中界面，跳过更新课中内容');
        return;
    }
    
    // 更新课中界面的标题显示
    const titleElements = aiInSection.querySelectorAll('.section-header h2');
    if (titleElements.length > 0) {
        titleElements.forEach(element => {
            if (element.classList.contains('zh')) {
                element.textContent = `章节教学: ${chapterTitle}`;
            } else if (element.classList.contains('en')) {
                // 注意这里使用英文标题
                const englishTitle = lang === 'en' ? chapterTitle : `Chapter ${chapterNumber}`;
                element.textContent = `Chapter Teaching: ${englishTitle}`;
            }
        });
    }
    
    // 更新课中面板的章节信息
    const classroomPanels = aiInSection.querySelectorAll('.classroom-panel');
    if (classroomPanels.length > 0) {
        classroomPanels.forEach(panel => {
            const panelHeader = panel.querySelector('.panel-header h3');
            if (panelHeader) {
                // 添加章节信息到标题
                const originalText = panelHeader.textContent.split(' - ')[0]; // 保留原始标题
                if (panelHeader.classList.contains('zh')) {
                    panelHeader.textContent = `${originalText} - ${chapterTitle}`;
                } else if (panelHeader.classList.contains('en')) {
                    const englishTitle = lang === 'en' ? chapterTitle : `Chapter ${chapterNumber}`;
                    panelHeader.textContent = `${originalText} - ${englishTitle}`;
                }
            }
            
            // 更新面板内容的章节信息
            const chapterInfoElements = panel.querySelectorAll('.chapter-info');
            if (chapterInfoElements.length > 0) {
                chapterInfoElements.forEach(element => {
                    if (element.classList.contains('zh')) {
                        element.textContent = `当前章节: ${chapterTitle}`;
                    } else if (element.classList.contains('en')) {
                        const englishTitle = lang === 'en' ? chapterTitle : `Chapter ${chapterNumber}`;
                        element.textContent = `Current Chapter: ${englishTitle}`;
                    }
                });
            }
        });
    }
    
    // 触发PPT加载 - 仅在课件展示面板活跃时
    const slidesPanel = document.getElementById('slides-panel');
    if (slidesPanel && slidesPanel.classList.contains('active')) {
        console.log('课件展示面板处于活跃状态，尝试加载PPT');
        // 使用新的加载函数
        if (typeof loadChapterSlides === 'function') {
            loadChapterSlides(chapterNumber);
        } else {
            console.error('找不到loadChapterSlides函数，无法加载PPT');
        }
    } else {
        console.log('课件展示面板未激活，暂不加载PPT');
    }
    
    // 触发一个自定义事件，通知其他组件课中章节已更改
    const chapterChangeEvent = new CustomEvent('inClassChapterChanged', {
        detail: {
            chapterNumber: chapterNumber,
            chapterTitle: chapterTitle,
            language: lang
        }
    });
    document.dispatchEvent(chapterChangeEvent);
}

/**
 * 初始化课中界面
 */
function initAIInClass() {
    console.log('正在初始化课中界面...');
    
    // 初始化控制面板切换
    initClassroomControlPanel();
    
    // 确保加载PptLoader模块
    loadPPTistServices().then(() => {
        console.log('PptLoader模块加载完成');
        initCoursePPTDisplay();
    }).catch(error => {
        console.error('加载PptLoader模块失败:', error);
        // 即使PptLoader加载失败，仍然初始化课件展示以便显示演示内容
        initCoursePPTDisplay();
    });
}

/**
 * 初始化课件PPT展示
 */
function initCoursePPTDisplay() {
    const slidePreview = document.getElementById('slide-preview');
    if (!slidePreview) {
        console.error('未找到幻灯片预览容器，无法初始化课件展示');
        return;
    }
    
    // 清除原有内容
    slidePreview.innerHTML = '';
    
    console.log('正在初始化课中PPT显示组件...');
    
    // 创建iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'inClassPptFrame';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allowFullscreen = true;
    
    // 添加到容器
    slidePreview.appendChild(iframe);
    
    // 设置iframe源 - 使用课前编辑器相同的源
    const iframeSrc = 'http://localhost:5173/?mode=static&embed=true';
    console.log('设置PPT iframe源:', iframeSrc);
    iframe.src = iframeSrc;
    
    // 添加iframe加载事件
    iframe.onload = function() {
        console.log('PPT iframe加载完成，初始化PPT显示');
        
        // 添加跨窗口通信事件监听
        window.addEventListener('message', function(event) {
            // 检查消息来源
            if (event.source !== iframe.contentWindow) return;
            
            const message = event.data;
            console.log('收到PPT iframe消息:', message);
            
            // 处理来自iframe的消息
            if (message && message.type) {
                switch (message.type) {
                    case 'ppt-loaded':
                        console.log('PPT加载完成通知');
                        // 可以更新UI或状态
                        updateSlideIndicator(message.currentSlide, message.totalSlides, false);
                        break;
                    
                    case 'slide-change':
                        console.log(`幻灯片切换: ${message.currentSlide}/${message.totalSlides}`);
                        // 更新幻灯片指示器
                        updateSlideIndicator(message.currentSlide, message.totalSlides, false);
                        break;
                    
                    case 'ppt-error':
                        console.error('PPT错误:', message.error);
                        showNotification('PPT加载出错: ' + message.error, 'error');
                        break;
                }
            }
        });
        
        // 延迟初始化，确保课中章节选择器已加载
        setTimeout(function() {
            // 获取当前选中的章节
            const chapterSelect = document.getElementById('in-class-chapter-select');
            if (chapterSelect && chapterSelect.value) {
                const selectedChapterId = chapterSelect.value;
                console.log('课中初始化: 加载当前选中章节的PPT:', selectedChapterId);
                loadChapterSlides(selectedChapterId);
            } else {
                console.log('课中初始化: 没有找到章节选择器或未选中章节');
            }
            
            // 添加章节选择变更事件
            if (chapterSelect) {
                console.log('为课中章节选择器添加事件监听器');
                // 移除已有的事件监听器(如果有)
                chapterSelect.removeEventListener('change', handleChapterSelectChange);
                // 添加新的事件监听器
                chapterSelect.addEventListener('change', handleChapterSelectChange);
            }
        }, 500);
    };
    
    // iframe加载错误处理
    iframe.onerror = function(error) {
        console.error('PPT iframe加载失败:', error);
        slidePreview.innerHTML = '<div class="ppt-error">PPT显示组件加载失败</div>';
    };
}

/**
 * 处理章节选择变更事件
 * @param {Event} event - 变更事件
 */
function handleChapterSelectChange(event) {
    const chapterId = event.target.value;
    if (!chapterId) return;
    
    console.log(`章节选择变更为: ${chapterId}`);
    
    // 加载对应章节的PPT
    loadChapterSlides(chapterId);
}

/**
 * 初始化幻灯片控制按钮
 * @param {HTMLIFrameElement} iframe PPTist iframe元素
 */
function initSlideControlButtons(iframe) {
    const prevButton = document.getElementById('prev-slide-btn');
    const nextButton = document.getElementById('next-slide-btn');
    const playButton = document.getElementById('play-slides-btn');
    
    // 监听上一张按钮点击
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'pptist-command',
                    action: 'prev-slide'
                }, '*');
            }
        });
    }
    
    // 监听下一张按钮点击
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'pptist-command',
                    action: 'next-slide'
                }, '*');
            }
        });
    }
    
    // 监听播放/暂停按钮点击
    if (playButton) {
        let isPlaying = false;
        
        playButton.addEventListener('click', () => {
            if (!iframe || !iframe.contentWindow) return;
            
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                iframe.contentWindow.postMessage({
                    type: 'pptist-command',
                    action: 'play',
                    data: { interval: 5000 }
                }, '*');
                
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                playButton.setAttribute('title', '暂停播放');
            } else {
                iframe.contentWindow.postMessage({
                    type: 'pptist-command',
                    action: 'pause'
                }, '*');
                
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                playButton.setAttribute('title', '自动播放');
            }
        });
    }
}

/**
 * 更新幻灯片指示器
 * @param {number} current 当前幻灯片索引
 * @param {number} total 总幻灯片数量
 * @param {boolean} loading 是否正在加载
 * @param {string} message 加载消息
 */
function updateSlideIndicator(current, total, loading = false, message = '') {
    const indicator = document.getElementById('slide-indicator');
    
    if (!indicator) return;
    
    if (loading) {
        indicator.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message || '加载中...'}`;
    } else {
        indicator.textContent = `${current} / ${total}`;
    }
}

/**
 * 加载章节幻灯片
 * @param {string|number} chapterId 章节ID
 */
function loadChapterSlides(chapterId) {
    if (!chapterId) {
        console.error('加载幻灯片：章节ID为空');
        return;
    }
    
    console.log(`正在加载章节${chapterId}的PPT...`);
    
    // 更新加载状态
    updateSlideIndicator(0, 0, true, `正在加载章节${chapterId}的PPT...`);
    
    // 检查iframe是否存在
    const iframe = document.getElementById('inClassPptFrame');
    if (!iframe || !iframe.contentWindow) {
        console.error('找不到PPT显示iframe，无法加载PPT');
        showNotification('PPT显示区域未准备好，请刷新页面', 'error');
        return;
    }
    
    // 检查PPT功能是否已加载
    if (window.PptLoader && typeof window.PptLoader.loadChapterPPT === 'function') {
        try {
            // 通过PptLoader加载PPT
            console.log(`使用PptLoader加载章节${chapterId}的PPT`);
            const result = window.PptLoader.loadChapterPPT(chapterId);
            
            if (result === false) {
                // 如果PptLoader返回失败，使用备用方案
                console.warn('PptLoader加载失败，使用备用方案');
                loadDemoSlides(chapterId);
            }
        } catch (error) {
            console.error('调用PptLoader时出错:', error);
            showNotification('加载PPT时出错，显示演示内容', 'warning');
            // 发生错误时使用备用方案
            loadDemoSlides(chapterId);
        }
    } else {
        // 如果PptLoader不可用，直接使用演示模式
        console.warn('PptLoader不可用，使用备用方案显示演示PPT');
        loadDemoSlides(chapterId);
    }
}

/**
 * 加载演示幻灯片（作为备用方案）
 * @param {string|number} chapterId 章节ID
 */
function loadDemoSlides(chapterId = '1') {
    console.log(`加载章节${chapterId}的演示PPT...`);
    
    const iframe = document.getElementById('inClassPptFrame');
    if (!iframe || !iframe.contentWindow) {
        console.error('PPTist iframe不存在或未就绪');
        return;
    }
    
    // 构建演示PPT数据
    const demoPPT = {
        slides: [],
        thumbnails: []
    };
    
    // 生成简化的演示数据
    for (let i = 1; i <= 5; i++) {
        demoPPT.slides.push({
            id: i.toString(),
            elements: [
                {
                    type: 'text',
                    id: `title-${i}`,
                    content: `章节${chapterId} - 幻灯片 ${i}`,
                    position: { x: 100, y: 50 },
                    width: 600,
                    height: 80,
                    style: {
                        fontSize: 32,
                        fontWeight: 'bold',
                        color: '#333333',
                        textAlign: 'center'
                    }
                }
            ],
            background: {
                type: 'solid',
                color: '#ffffff'
            }
        });
    }
    
    // 发送PPT数据到iframe
    try {
        iframe.contentWindow.postMessage({
            type: 'pptist-command',
            action: 'load-ppt-data',
            data: demoPPT
        }, '*');
        
        console.log('已发送演示PPT数据到PPTist');
    } catch (error) {
        console.error('发送演示PPT数据失败:', error);
    }
}

/**
 * 初始化课堂控制面板
 */
function initClassroomControlPanel() {
    const controlItems = document.querySelectorAll('.control-item');
    const classroomPanels = document.querySelectorAll('.classroom-panel');
    
    // 初始化时隐藏所有面板
    classroomPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // 默认显示第一个面板
    if (classroomPanels[0]) {
        classroomPanels[0].classList.add('active');
    }
    
    // 移除已有的click事件监听器（防止重复绑定）
    controlItems.forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
    });
    
    // 重新获取更新后的元素
    const updatedControlItems = document.querySelectorAll('.control-item');
    
    // 添加点击事件
    updatedControlItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            console.log(`点击了控制项: ${index}`);
            
            // 清除所有面板的活动状态
            classroomPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            // 清除所有控制项的活动状态
            updatedControlItems.forEach(cItem => {
                cItem.classList.remove('active');
            });
            
            // 添加当前控制项的活动状态
            item.classList.add('active');
            
            // 添加当前面板的活动状态
            if (classroomPanels[index]) {
                classroomPanels[index].classList.add('active');
                
                // 如果切换到课件展示面板，尝试加载PPT
                if (index === 1) { // 索引1通常是课件展示面板
                    // 检查iframe是否存在
                    const iframe = document.getElementById('inClassPptFrame');
                    if (iframe) {
                        console.log('切换到课件展示面板，尝试加载PPT');
                        // 获取当前选中的章节
                        const chapterSelect = document.getElementById('in-class-chapter-select');
                        if (chapterSelect && chapterSelect.value && typeof loadChapterSlides === 'function') {
                            // 显示通知
                            showNotification('正在加载章节PPT', 'info');
                            loadChapterSlides(chapterSelect.value);
                        } else {
                            console.log('没有选择章节或加载函数不可用，将加载演示PPT');
                            if (typeof loadDemoSlides === 'function') {
                                loadDemoSlides();
                            }
                        }
                    }
                }
            }
        });
    });
    
    // 课堂计时器功能
    const pauseBtn = document.querySelector('.class-status .control-btn:nth-child(3)');
    const stopBtn = document.querySelector('.class-status .control-btn:nth-child(4)');
    const timeDisplay = document.querySelector('.class-time');
    const statusBadge = document.querySelector('.status-badge');
    
    // 初始化课堂时间状态
    let classTimeElapsed = 0;
    let classTimeInterval = null;
    let isPaused = false;
    
    function updateTimeDisplay() {
        // 格式化显示时间：小时:分钟:秒
        const hours = Math.floor(classTimeElapsed / 3600);
        const minutes = Math.floor((classTimeElapsed % 3600) / 60);
        const seconds = classTimeElapsed % 60;
        
        // 格式化为两位数显示
        const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeDisplay) {
            timeDisplay.textContent = timeFormatted;
        }
    }
    
    // 更新初始时间显示
    updateTimeDisplay();
    
    // 开始按钮点击事件
    const startBtn = document.querySelector('.class-status .control-btn:nth-child(2)');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if (!classTimeInterval) {
                // 开始计时
                classTimeInterval = setInterval(() => {
                    if (!isPaused) {
                        classTimeElapsed++;
                        updateTimeDisplay();
                    }
                }, 1000);
                
                // 更新状态显示
                if (statusBadge) {
                    statusBadge.textContent = '进行中';
                    statusBadge.className = 'status-badge active';
                }
                
                showNotification('课堂计时开始', 'success');
            }
        });
    }
    
    // 暂停按钮点击事件
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            if (classTimeInterval) {
                // 切换暂停状态
                isPaused = !isPaused;
                
                // 更新按钮图标
                const icon = this.querySelector('i');
                if (isPaused) {
                    icon.className = 'fas fa-play';
                    
                    // 更新状态显示
                    if (statusBadge) {
                        statusBadge.textContent = '已暂停';
                        statusBadge.className = 'status-badge paused';
                    }
                    
                    showNotification('课堂计时已暂停', 'warning');
                } else {
                    icon.className = 'fas fa-pause';
                    
                    // 更新状态显示
                    if (statusBadge) {
                        statusBadge.textContent = '进行中';
                        statusBadge.className = 'status-badge active';
                    }
                    
                    showNotification('课堂计时已恢复', 'success');
                }
            }
        });
    }
    
    // 停止按钮点击事件
    if (stopBtn) {
        stopBtn.addEventListener('click', function() {
            if (classTimeInterval) {
                // 确认对话框
                if (confirm('确定要结束本节课吗？')) {
                    // 停止计时
                    clearInterval(classTimeInterval);
                    classTimeInterval = null;
                    
                    // 重置状态
                    isPaused = false;
                    
                    // 不重置时间，保留显示
                    // 可以添加最终时间的上报逻辑
                    
                    // 更新状态显示
                    if (statusBadge) {
                        statusBadge.textContent = '已结束';
                        statusBadge.className = 'status-badge ended';
                    }
                    
                    // 更新暂停按钮图标
                    if (pauseBtn) {
                        const pauseIcon = pauseBtn.querySelector('i');
                        if (pauseIcon) {
                            pauseIcon.className = 'fas fa-pause';
                        }
                    }
                    
                    showNotification('本节课已结束，课堂时间已记录', 'info');
                }
            }
        });
    }
}

/**
 * 确保文档加载完成后初始化所有章节选择器
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化课中章节选择器 (课前的已在页面加载时初始化)
    if (typeof initInClassChapterSelector === 'function') {
        initInClassChapterSelector();
    }
    
    // 初始化课中界面
    if (typeof initAIInClass === 'function') {
        initAIInClass();
    }
});

/**
 * 添加课中章节选择器变更事件
 * @param {HTMLElement} chapterSelect - 章节选择器元素
 */
function addInClassChapterSelectChangeEvent(chapterSelect) {
    if (!chapterSelect) {
        console.error('添加章节选择器事件：选择器元素为空');
        return;
    }
    
    // 存储事件处理函数以便可以移除
    window._inClassChapterSelectChangeHandler = function(event) {
        const chapterId = event.target.value;
        if (!chapterId) return;
        
        console.log(`课中章节选择器变更为章节: ${chapterId}`);
        
        // 获取选中的章节标题
        const selectedOption = event.target.options[event.target.selectedIndex];
        const chapterTitle = selectedOption ? selectedOption.textContent : `章节${chapterId}`;
        
        // 更新课中界面内容
        updateInClassContent(chapterId, chapterTitle);
        
        // 如果当前在课件展示面板，则加载PPT
        const slidesPanel = document.querySelector('.classroom-panel:nth-child(2)');
        if (slidesPanel && slidesPanel.classList.contains('active')) {
            console.log('检测到章节变更，自动加载PPT...');
            showNotification('正在加载章节PPT', 'info');
            loadChapterSlides(chapterId);
        }
    };
    
    // 移除旧的事件处理函数（如果存在）
    chapterSelect.removeEventListener('change', window._inClassChapterSelectChangeHandler);
    
    // 添加新的事件处理函数
    chapterSelect.addEventListener('change', window._inClassChapterSelectChangeHandler);
}

/**
 * 加载PPTist相关模块
 * @returns {Promise} 加载完成的Promise
 */
function loadPPTistServices() {
    return new Promise((resolve, reject) => {
        console.log('开始初始化课中PPT功能...');
        
        // 检查当前页面中是否已存在PptLoader
        if (window.PptLoader) {
            console.log('检测到PptLoader已加载，直接使用');
            
            // 可以设置一个全局标志，表示课中部分已准备好
            window.classroomPptEnabled = true;
            
            resolve(window.PptLoader);
            return;
        }
        
        // 尝试从页面中查找PptLoader相关的script标签
        const scripts = document.querySelectorAll('script');
        let pptLoaderPath = null;
        
        for (const script of scripts) {
            const src = script.getAttribute('src') || '';
            if (src.includes('PptLoader') || src.includes('ppt-loader')) {
                pptLoaderPath = script.getAttribute('src');
                console.log('从页面找到PptLoader脚本路径:', pptLoaderPath);
                break;
            }
        }
        
        // 如果页面中没有找到，使用默认路径
        if (!pptLoaderPath) {
            // 根据成功加载的QuizGenerator路径推断
            pptLoaderPath = '../src/components/courseware/PptLoader.js';
            console.log('使用默认路径:', pptLoaderPath);
        }
        
        // 加载PptLoader脚本
        const script = document.createElement('script');
        script.src = pptLoaderPath;
        script.type = 'text/javascript';
        
        script.onload = () => {
            console.log('PptLoader脚本加载成功，检查是否正确初始化...');
            
            // 给模块一点时间初始化
            setTimeout(() => {
                if (window.PptLoader) {
                    console.log('PptLoader成功加载并初始化');
                    
                    // 设置标志
                    window.classroomPptEnabled = true;
                    
                    // 修复可能缺失的属性和方法
                    if (!window.PptLoader.loadChapterPPT) {
                        console.warn('PptLoader缺少loadChapterPPT方法，创建替代方法');
                        
                        // 创建一个简单的替代方法
                        window.PptLoader.loadChapterPPT = function(chapterId) {
                            console.log(`尝试通过替代方法加载章节${chapterId}的PPT...`);
                            
                            const iframe = document.getElementById('inClassPptFrame');
                            if (!iframe || !iframe.contentWindow) {
                                console.error('找不到PPT iframe，无法加载PPT');
                                return false;
                            }
                            
                            // 发送简单的消息到iframe
                            try {
                                iframe.contentWindow.postMessage({
                                    type: 'load-chapter',
                                    chapterId: chapterId
                                }, '*');
                                console.log(`已发送章节${chapterId}加载请求到PPT iframe`);
                                return true;
                            } catch (error) {
                                console.error('向PPT iframe发送消息失败:', error);
                                return false;
                            }
                        };
                    }
                    
                    resolve(window.PptLoader);
                } else {
                    console.error('PptLoader脚本加载成功但未正确初始化');
                    reject(new Error('PptLoader加载失败'));
                }
            }, 500);
        };
        
        script.onerror = (error) => {
            console.error('PptLoader脚本加载失败:', error);
            
            // 创建一个简单的替代对象
            console.warn('创建PptLoader替代对象');
            window.PptLoader = {
                loadChapterPPT: function(chapterId) {
                    console.log(`[替代方法] 加载章节${chapterId}的PPT`);
                    return false;
                },
                // 其他所需方法...
                initialized: true
            };
            
            // 即使加载失败也继续运行
            resolve(window.PptLoader);
        };
        
        // 添加到文档
        document.head.appendChild(script);
    });
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (info, success, warning, error)
 * @param {number} duration - 显示时间(毫秒)
 */
function showNotification(message, type = 'info', duration = 3000) {
    if (!message) return;
    
    console.log(`显示通知[${type}]: ${message}`);
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 设置样式
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.color = '#fff';
    notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.style.maxWidth = '300px';
    notification.style.wordBreak = 'break-word';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // 设置不同类型的背景颜色
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'warning':
            notification.style.backgroundColor = '#FF9800';
            break;
        case 'error':
            notification.style.backgroundColor = '#F44336';
            break;
        default: // info
            notification.style.backgroundColor = '#2196F3';
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 50);
    
    // 设置定时器移除通知
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // 过渡结束后移除元素
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}
