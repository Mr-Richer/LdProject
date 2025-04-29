// 设置离线模式，使用模拟数据
window.isOfflineMode = false; // 设置为false，从API获取实际数据

// API配置
const API_BASE_URL = 'http://localhost:3000'; // 开发环境
window.API_BASE_URL = API_BASE_URL; // 导出给其他模块使用

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
    return new Promise((resolve, reject) => {
        try {
            console.log('加载PPT相关模块...');
            
            // 首先加载PptistBridge模块
            const bridgeScript = document.createElement('script');
            bridgeScript.src = '../src/components/courseware/PptistBridge.js';
            bridgeScript.type = 'text/javascript';
            
            bridgeScript.onload = () => {
                console.log('PptistBridge模块加载成功');
                
                // 然后加载服务模块
                const serviceScript = document.createElement('script');
                serviceScript.src = '../src/services/ppt.js';
                serviceScript.type = 'text/javascript';
                
                serviceScript.onload = () => {
                    console.log('PPT服务模块加载成功');
                    
                    // 检查是否成功创建全局对象
                    if (!window.PptistBridge || !window.PptService) {
                        console.error('PPT服务模块全局对象未正确创建');
                        reject(new Error('PPT服务模块初始化失败'));
                        return;
                    }
                    
                    // 最后加载PptLoader模块
                    const loaderScript = document.createElement('script');
                    loaderScript.src = '../src/components/courseware/PptLoader.js';
                    loaderScript.type = 'text/javascript';
                    
                    loaderScript.onload = () => {
                        console.log('PptLoader模块加载成功');
                        
                        // 确认所有模块都已加载并初始化
                        if (window.PptLoader && typeof window.PptLoader.initAutoLoadPPT === 'function') {
                            // 等待DOM完全加载后再初始化自动加载功能
                            setTimeout(() => {
                                try {
                                    window.PptLoader.initAutoLoadPPT();
                                    console.log('PPT自动加载功能已初始化');
                                    resolve(true);
                                } catch (error) {
                                    console.error('初始化PPT自动加载功能失败:', error);
                                    resolve(false);
                                }
                            }, 500);
                        } else {
                            console.error('PPT加载器初始化失败：未找到initAutoLoadPPT方法');
                            resolve(false);
                        }
                    };
                    
                    loaderScript.onerror = (error) => {
                        console.error('加载PptLoader模块失败:', error);
                        reject(new Error('无法加载PptLoader模块'));
                    };
                    
                    document.head.appendChild(loaderScript);
                };
                
                serviceScript.onerror = (error) => {
                    console.error('加载PPT服务模块失败:', error);
                    reject(new Error('无法加载PPT服务模块'));
                };
                
                document.head.appendChild(serviceScript);
            };
            
            bridgeScript.onerror = (error) => {
                console.error('加载PptistBridge模块失败:', error);
                reject(new Error('无法加载PptistBridge模块'));
            };
            
            document.head.appendChild(bridgeScript);
            
        } catch (error) {
            console.error('加载PPT模块总体失败:', error);
            reject(error);
        }
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
    
    // 初始化签到二维码按钮
    initQRCodeDisplay();
    
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
                
                    // 重新加载章节列表
                    await loadChapters();
                
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
    fetch(`${API_BASE_URL}/api/chapters`)
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
    fetch(`${API_BASE_URL}/api/chapters/stats`)
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
        const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        return `${baseUrl}${url}`;
    }
    
    // 其他情况保持原样(相对路径)
    return url;
}

/**
 * 初始化章节选择器
 */
function initChapterSelector() {
    const chapterSelect = document.getElementById('chapter-select');
    if (!chapterSelect) {
        console.error('章节选择器元素未找到');
        return;
    }
    
    console.log('开始初始化章节选择器...');
    
    // 显示加载中状态
    chapterSelect.innerHTML = '<option disabled selected>加载中...</option>';
    
    // 获取章节数据
    fetch(`${API_BASE_URL}/api/chapters`)
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
                
                console.log('章节选择器初始化完成');
                
                // 添加选择器变更事件
                addChapterSelectChangeEvent(chapterSelect);
                
                // 选择第一个章节（如果没有预选）
                if (document.body.classList.contains('en-mode')) {
                    // 英文模式下选择第一个英文选项
                    const firstEnOption = chapterSelect.querySelector('option.en');
                    if (firstEnOption) firstEnOption.selected = true;
                } else {
                    // 中文模式下选择第一个中文选项
                    const firstZhOption = chapterSelect.querySelector('option.zh');
                    if (firstZhOption) firstZhOption.selected = true;
                }
                
                // 触发change事件，初始化内容
                const event = new Event('change');
                chapterSelect.dispatchEvent(event);
            } else {
                // 没有数据时显示提示
                chapterSelect.innerHTML = '<option disabled selected class="zh">暂无章节数据</option><option disabled selected class="en">No chapters available</option>';
                console.error('未获取到章节数据');
                showNotification('未能获取章节数据，请检查网络连接或联系管理员', 'error');
            }
        })
        .catch(error => {
            console.error('获取章节数据出错:', error);
            chapterSelect.innerHTML = '<option disabled selected class="zh">获取数据失败</option><option disabled selected class="en">Failed to load data</option>';
            showNotification('获取章节数据失败: ' + error.message, 'error');
        });
}

/**
 * 为章节选择器添加变更事件
 * @param {HTMLSelectElement} chapterSelect - 章节选择器元素
 */
function addChapterSelectChangeEvent(chapterSelect) {
    // 存储章节中英文名称的映射
    const chapterTitles = {};
    
    // 处理所有章节选项，建立章节号与标题的映射
    for (let i = 0; i < chapterSelect.options.length; i++) {
        const option = chapterSelect.options[i];
        const value = option.value;
        
        if (value && option.classList.contains('zh')) {
            // 保存中文标题
            chapterTitles[value] = option.textContent;
        }
    }
    
    // 移除现有的事件监听器（如果有的话）
    chapterSelect.removeEventListener('change', chapterSelectChangeHandler);
    
    // 添加新的事件监听器
    chapterSelect.addEventListener('change', chapterSelectChangeHandler);
    
    // 章节选择器变更事件处理函数
    function chapterSelectChangeHandler() {
        const chapterNumber = this.value;
        
        if (chapterNumber && chapterTitles[chapterNumber]) {
            const chapterTitle = chapterTitles[chapterNumber];
            
            // 更新界面显示
            updateAIPreContent(chapterNumber, chapterTitle);
            
            // 显示通知
            showNotification(`已切换到${chapterTitle}`, 'info');
        }
    }
}

/**
 * 更新AI课前内容区域
 * @param {string} chapterNumber - 章节编号
 * @param {string} chapterTitle - 章节标题
 */
function updateAIPreContent(chapterNumber, chapterTitle) {
    // 更新标题显示
    const titleElements = document.querySelectorAll('.ai-pre-container .section-header h2');
    if (titleElements.length > 0) {
        titleElements.forEach(element => {
            if (element.classList.contains('zh')) {
                element.textContent = `章节备课: ${chapterTitle}`;
            } else if (element.classList.contains('en')) {
                element.textContent = `Chapter Preparation: ${chapterNumber}`;
            }
        });
    }
    
    // 可以在这里添加更多内容更新逻辑
    console.log(`正在加载章节 ${chapterNumber} 的课前内容`);
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
    
    // 加载PPT模块并初始化自动加载功能
    loadPPTModules().catch(error => {
        console.error('初始化PPT模块失败:', error);
        showNotification('PPT功能初始化失败，请刷新页面重试', 'error');
    });
    
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
 * 重新从API获取最新的章节数据并更新选择器
 */
function refreshChapterSelector() {
    console.log('开始刷新章节选择器...');
    
    const chapterSelect = document.getElementById('chapter-select');
    if (!chapterSelect) {
        console.error('章节选择器元素未找到');
        return;
    }
    
    // 保存当前选中的值
    const currentSelectedValue = chapterSelect.value;
    
    // 显示加载中状态
    chapterSelect.innerHTML = '<option disabled selected>刷新中...</option>';
    
    // 获取章节数据
    fetch(`${API_BASE_URL}/api/chapters`)
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
                
                console.log('章节选择器刷新完成，选项数量:', sortedChapters.length);
                
                // 添加选择器变更事件
                addChapterSelectChangeEvent(chapterSelect);
                
                // 尝试选择之前选中的章节
                if (currentSelectedValue) {
                    const selector = document.body.classList.contains('en-mode') 
                        ? `option.en[value="${currentSelectedValue}"]` 
                        : `option.zh[value="${currentSelectedValue}"]`;
                    
                    const targetOption = chapterSelect.querySelector(selector);
                    if (targetOption) {
                        targetOption.selected = true;
                    } else {
                        // 如果之前选中的选项不存在，则选择最新添加的章节
                        const latestChapterNumber = sortedChapters[sortedChapters.length - 1].chapter_number;
                        const latestSelector = document.body.classList.contains('en-mode')
                            ? `option.en[value="${latestChapterNumber}"]`
                            : `option.zh[value="${latestChapterNumber}"]`;
                        
                        const latestOption = chapterSelect.querySelector(latestSelector);
                        if (latestOption) {
                            latestOption.selected = true;
                        }
                    }
                } else {
                    // 默认选中第一个章节
                    if (document.body.classList.contains('en-mode')) {
                        const firstEnOption = chapterSelect.querySelector('option.en');
                        if (firstEnOption) firstEnOption.selected = true;
                    } else {
                        const firstZhOption = chapterSelect.querySelector('option.zh');
                        if (firstZhOption) firstZhOption.selected = true;
                    }
                }
                
                // 触发change事件，更新内容
                const event = new Event('change');
                chapterSelect.dispatchEvent(event);
                
                // 显示通知
                showNotification('章节选择器已更新', 'success');
            } else {
                // 没有数据时显示提示
                chapterSelect.innerHTML = '<option disabled selected class="zh">暂无章节数据</option><option disabled selected class="en">No chapters available</option>';
                console.error('未获取到章节数据');
                showNotification('刷新章节选择器失败：未获取到数据', 'error');
            }
        })
        .catch(error => {
            console.error('刷新章节选择器出错:', error);
            chapterSelect.innerHTML = '<option disabled selected class="zh">刷新失败</option><option disabled selected class="en">Refresh failed</option>';
            showNotification('刷新章节选择器失败: ' + error.message, 'error');
        });
}

// 将刷新章节选择器的函数暴露到全局，使其他组件可以调用
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
