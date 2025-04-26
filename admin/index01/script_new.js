/**
 * 中国文化人工智能课程平台 - 教师端
 * 主脚本文件
 */

// 在文件顶部，DOMContentLoaded事件监听器之前添加标记变量
// 全局变量，用于跟踪按钮是否已经绑定事件
let contentGenBtnInitialized = false;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航系统
    initNavigation();
    
    // 初始化语言切换
    initLanguageToggle();
    
    // 初始化章节模态框
    initChapterModal();
    
    // 初始化章节卡片交互
    initChapterCards();
    
    // 更新当前日期显示
    updateCurrentDate();
    
    // 初始化内容生成弹窗
    initContentGenerateModal();
    
    // 初始化AI助教-课前部分
    initAIPre();
    
    // 初始化AI助教-课中部分
    initAIInClass();
    
    // 初始化章节滑动功能
    initChapterSlider();
    
    // 初始化课程思政和实训任务部分
    initIdeologyAndPractice();
    
    // 初始化最新动态过滤功能
    initActivityFilters();
    
    // 初始化学情画像部分
    initStudentProfile();
    
    // 初始化中国文化演化部分
    initCultureEvolution();
    
    // 初始化一键生成功能
    initOneClickGeneration();
    
    // 初始化各个模块
    initContentSections();
    initTabSwitching();
    initQuizGenerator();
    initKnowledgeExpansion(); // 添加知识拓展初始化
    // ... 其他初始化函数
    
    // 在页面加载时隐藏知识拓展列表
    const knowledgeExpansionList = document.querySelector('.knowledge-expansion-list');
    if (knowledgeExpansionList) {
        knowledgeExpansionList.style.display = 'none';
    }
    
    // 设置默认激活的标签
    const defaultTabBtn = document.querySelector('.tab-btn[data-tab="courseware"]');
    if (defaultTabBtn) {
        defaultTabBtn.click();
    }
    
    initIdeology(); // 初始化思政功能
    
    // 全屏功能
    initFullscreenButton();
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
    
    // 初始化课程思政多媒体标签页和案例/讨论题切换功能
    initIdeologyMediaTabs();
    
    initMediaTabs();
    initCaseNavigation();
    initDiscussionNavigation();
    initClassSelection(); // 初始化班级选择功能
    
    // 初始化课后总结部分
    initPostClass();
    
    // 知识图谱功能
    initKnowledgeGraph();
    
    // 获取章节列表数据
    fetchChapters();
    
    // 直接调用更新课程统计数据
    updateCourseStatsCount();
    
    // 新建章节按钮点击事件
    document.getElementById('newChapterBtn').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.add('active');
    });
    
    // 关闭模态框按钮点击事件
    document.getElementById('closeNewChapterModal').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 取消按钮点击事件
    document.getElementById('cancelNewChapter').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 提交表单事件
    document.getElementById('submitNewChapter').addEventListener('click', () => {
        submitNewChapter();
    });
    
    // 文件上传预览
    document.getElementById('coverImage').addEventListener('change', (e) => {
        const fileInput = e.target;
        const filePreview = fileInput.parentElement.querySelector('.file-preview');
        
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            reader.readAsDataURL(fileInput.files[0]);
            
            // 这里应该上传文件到服务器，然后获取文件路径
            // 简化处理：假设上传成功并返回路径
            document.getElementById('coverImagePath').value = `../picture/uploads/${fileInput.files[0].name}`;
        }
    });
    
    // 初始化PPTist iframe集成
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
            document.getElementById(sectionId).classList.add('active');
            
            // 更新页面标题
            const navTextZh = this.querySelector('.nav-text.zh').textContent;
            const navTextEn = this.querySelector('.nav-text.en').textContent;
            pageTitleZh.textContent = navTextZh;
            pageTitleEn.textContent = navTextEn;
            
            // 添加动态效果
            animateContentChange(document.getElementById(sectionId));
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
 * 处理打开和关闭模态框的交互
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
    
    // 确认按钮
    confirmBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 模拟创建章节
            const titleInputZh = modal.querySelector('.form-input.zh');
            const titleInputEn = modal.querySelector('.form-input.en');
            
            if (titleInputZh.value.trim() !== '' || titleInputEn.value.trim() !== '') {
                showNotification('章节创建成功！', 'success');
                closeModal();
                
                // 这里可以添加实际创建章节的代码
            } else {
                showNotification('请填写章节标题', 'warning');
            }
        });
    });
    
    // 文件上传预览
    const fileInputs = modal.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileCount = this.files.length;
            const filePreview = this.closest('.form-group').querySelector('.uploaded-files');
            
            if (filePreview) {
                const textZh = filePreview.querySelector('.zh');
                const textEn = filePreview.querySelector('.en');
                
                if (textZh) textZh.textContent = `已上传: ${fileCount} 个文件`;
                if (textEn) textEn.textContent = `Uploaded: ${fileCount} files`;
            }
        });
    });
}

/**
 * 初始化章节卡片交互
 * 添加章节卡片上的按钮点击事件
 */
function initChapterCards() {
    const editBtns = document.querySelectorAll('.chapter-action-btn.edit');
    const prepareBtns = document.querySelectorAll('.chapter-action-btn.prepare');
    const teachBtns = document.querySelectorAll('.chapter-action-btn.teach');
    
    // 编辑按钮
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            showNotification(`正在编辑${chapterTitle}...`, 'info');
            // 这里可以添加实际的编辑功能
        });
    });
    
    // 备课按钮
    prepareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取章节信息
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            const chapterTitleEn = chapterCard.querySelector('.chapter-title.en').textContent;
            
            // 提取章节序号（从标题中获取第X章）
            const chapterMatch = chapterTitle.match(/第(\d+)章/);
            if (chapterMatch && chapterMatch[1]) {
                const chapterNumber = chapterMatch[1];
                
                // 切换到AI助教-课前界面
                const aiPreNavItem = document.querySelector('.nav-item[data-section="ai-pre"]');
                if (aiPreNavItem) {
                    // 触发点击事件，切换到AI助教-课前界面
                    aiPreNavItem.click();
                    
                    // 延迟一下，等待界面切换完成后设置章节选择器的值
                    setTimeout(() => {
                        // 设置章节选择器
                        const chapterSelect = document.getElementById('chapter-select');
                        if (chapterSelect) {
                            // 查找对应章节的选项
                            const options = chapterSelect.options;
                            for (let i = 0; i < options.length; i++) {
                                if (options[i].value === chapterNumber) {
                                    chapterSelect.selectedIndex = i;
                                    // 手动触发变更事件
                                    const event = new Event('change');
                                    chapterSelect.dispatchEvent(event);
                                    break;
                                }
                            }
                        }
                        
                        showNotification(`正在准备${chapterTitle}的课前内容...`, 'success');
                    }, 300);
                }
            } else {
                showNotification(`无法确定章节编号，请手动选择章节`, 'warning');
            }
        });
    });
    
    // 上课按钮
    teachBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            
            // 切换到"AI助教-课中"界面
            const aiInNavItem = document.querySelector('.nav-item[data-section="ai-in"]');
            if (aiInNavItem) {
                aiInNavItem.click();
                
                showNotification(`开始${chapterTitle}的课堂教学`, 'success');
            }
        });
    });
    
    // 整个卡片点击事件
    const chapterCards = document.querySelectorAll('.chapter-card');
    chapterCards.forEach(card => {
        card.addEventListener('click', function() {
            const chapterTitle = this.querySelector('.chapter-title.zh').textContent;
            showNotification(`查看章节详情: ${chapterTitle}`, 'info');
            
            // 这里可以添加显示章节详情的代码
        });
    });
}

/**
 * 为内容区域添加切换动画
 * @param {HTMLElement} section - 要添加动画的内容区域
 */
function animateContentChange(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    }, 50);
}

/**
 * 创建通知提示
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (success, warning, error, info)
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 添加图标
    const icon = document.createElement('i');
    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            icon.className = 'fas fa-times-circle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    // 添加消息文本
    const text = document.createElement('span');
    text.textContent = message;
    
    // 添加关闭按钮
    const closeBtn = document.createElement('i');
    closeBtn.className = 'fas fa-times close-notification';
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 组装通知元素
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加进入动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动消失
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * 当前日期显示
 * 更新首页欢迎横幅中的日期显示
 */
function updateCurrentDate() {
    const dateElementZh = document.getElementById('current-date-zh');
    const dateElementEn = document.getElementById('current-date-en');
    
    if (dateElementZh && dateElementEn) {
        const now = new Date();
        
        // 中文日期格式
        const zhOptions = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
        let zhDate = now.toLocaleDateString('zh-CN', zhOptions);
        // 进一步格式化中文日期，确保格式为：2023年3月23日 星期四
        zhDate = zhDate.replace(/\//g, '年') + '日';
        zhDate = zhDate.replace(/年(\d+)年/, '年$1月');
        zhDate = zhDate.replace(/星期(.+)日/, '星期$1'); // 去掉星期后面的"日"字
        dateElementZh.textContent = `今天是 ${zhDate}`; // 删除平台口号
        
        // 英文日期格式
        const enOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElementEn.textContent = `Today is ${now.toLocaleDateString('en-US', enOptions)}`;
    }
}

/**
 * 初始化AI助教-课前部分
 */
function initAIPre() {
    // 初始化标签页切换
    initAIPreTabs();
    
    // 初始化课件设计
    initCoursewareDesign();
    
    // 初始化小测题目导航
    initQuizNavigation();
    
    // 初始化可缩放思维导图
    initZoomableMindmap();
    
    // 初始化章节选择器
    initChapterSelector();
}

/**
 * 初始化AI助教-课前选项卡切换
 */
function initAIPreTabs() {
    const tabBtns = document.querySelectorAll('.ai-pre-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.ai-pre-tabs .tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有选项卡的活动状态
            tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
            
            // 为当前点击的选项卡添加活动状态
            this.classList.add('active');
            
            // 获取要显示的内容区域的ID
            const contentId = this.getAttribute('data-tab') + '-content';
            
            // 隐藏所有内容区域
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 显示对应的内容区域
            document.getElementById(contentId).classList.add('active');
            
            // 添加动态效果
            animateTabContentChange(document.getElementById(contentId));
        });
    });
}

/**
 * 初始化课件设计功能
 */
function initCoursewareDesign() {
    const coursewareContent = document.getElementById('courseware-content');
    if (!coursewareContent) return;

    const actionButtons = coursewareContent.querySelectorAll('.action-button');
    const genBtn = actionButtons[0]; // 内容生成按钮是第一个按钮
    const replaceBtn = actionButtons[1]; // 替换课件按钮是第二个按钮
    
    // 内容生成按钮初始化
    if (genBtn && !contentGenBtnInitialized) {
        // 先移除可能已经存在的所有点击事件处理器
        const newGenBtn = genBtn.cloneNode(true);
        genBtn.parentNode.replaceChild(newGenBtn, genBtn);
        
        // 为新的按钮添加单一事件监听器
        newGenBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            // 显示内容生成模态框
            const modal = document.getElementById('contentGenerateModal');
            if (modal) {
                modal.classList.add('active');
            }
        });
        
        contentGenBtnInitialized = true;
        console.log("内容生成按钮已初始化");
    }
    
    // 替换课件按钮初始化
    if (replaceBtn) {
        // 先移除可能已经存在的所有点击事件处理器
        const newReplaceBtn = replaceBtn.cloneNode(true);
        replaceBtn.parentNode.replaceChild(newReplaceBtn, replaceBtn);
        
        // 为新的按钮添加单一事件监听器
        newReplaceBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            
            // 显示替换课件弹窗
            showReplaceCoursewareModal();
        });
        
        console.log("替换课件按钮已初始化");
    }
    
    // 幻灯片缩略图交互
    const thumbnails = coursewareContent.querySelectorAll('.thumbnail-item');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 显示替换课件模态框
    function showReplaceCoursewareModal() {
        // 创建模态框
        let modal = document.getElementById('replaceCoursewareModal');
        
        // 如果模态框不存在，创建一个新的
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'replaceCoursewareModal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="zh">替换课件</h3>
                        <h3 class="en">Replace Courseware</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="file-upload-section">
                            <div class="upload-instructions">
                                <p class="zh">请选择要上传的课件文件，支持PPT、PPTX或PDF格式</p>
                                <p class="en">Please select courseware file to upload, supports PPT, PPTX or PDF formats</p>
                            </div>
                            <div class="file-upload-large">
                                <div class="file-preview-large">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p class="zh">拖放文件到此处或点击上传</p>
                                    <p class="en">Drag and drop files here or click to upload</p>
                                    <p class="file-types zh">支持的格式: PPT, PPTX, PDF</p>
                                    <p class="file-types en">Supported formats: PPT, PPTX, PDF</p>
                                </div>
                                <input type="file" class="file-input" accept=".ppt,.pptx,.pdf">
                            </div>
                            <div class="uploaded-files">
                                <h4 class="zh">已选择文件</h4>
                                <h4 class="en">Selected Files</h4>
                                <div class="no-file-selected">
                                    <p class="zh">未选择任何文件</p>
                                    <p class="en">No file selected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel">
                            <span class="zh">取消</span>
                            <span class="en">Cancel</span>
                        </button>
                        <button class="btn-confirm">
                            <span class="zh">替换</span>
                            <span class="en">Replace</span>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 关闭按钮
            const closeBtn = modal.querySelector('.close-btn');
            const cancelBtn = modal.querySelector('.btn-cancel');
            
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            cancelBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            // 文件上传功能
            const fileInput = modal.querySelector('.file-input');
            const uploadArea = modal.querySelector('.file-preview-large');
            const noFileSelected = modal.querySelector('.no-file-selected');
            const uploadedFiles = modal.querySelector('.uploaded-files');
            
            // 文件上传区域点击触发文件选择
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            // 监听文件选择变化
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    
                    // 处理已选择的文件
                    noFileSelected.style.display = 'none';
                    
                    // 移除旧的文件详情
                    const oldFileDetails = uploadedFiles.querySelector('.file-details');
                    if (oldFileDetails) {
                        oldFileDetails.remove();
                    }
                    
                    // 创建文件详情显示
                    const fileDetails = document.createElement('div');
                    fileDetails.className = 'file-details';
                    
                    // 根据文件类型显示不同的图标
                    let fileIcon = 'fa-file';
                    if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
                        fileIcon = 'fa-file-powerpoint';
                    } else if (file.name.endsWith('.pdf')) {
                        fileIcon = 'fa-file-pdf';
                    }
                    
                    // 计算文件大小显示
                    let fileSize = (file.size / 1024).toFixed(2) + ' KB';
                    if (file.size > 1024 * 1024) {
                        fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                    }
                    
                    fileDetails.innerHTML = `
                        <div class="file-icon"><i class="fas ${fileIcon}"></i></div>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${fileSize}</div>
                        </div>
                        <button class="remove-file-btn"><i class="fas fa-times"></i></button>
                    `;
                    
                    uploadedFiles.appendChild(fileDetails);
                    
                    // 添加删除文件的按钮事件
                    const removeBtn = fileDetails.querySelector('.remove-file-btn');
                    removeBtn.addEventListener('click', () => {
                        fileInput.value = '';
                        fileDetails.remove();
                        noFileSelected.style.display = 'block';
                    });
                }
            });
            
            // 拖放功能
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    fileInput.files = e.dataTransfer.files;
                    
                    // 触发change事件以更新UI
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            });
            
            // 替换按钮点击事件
            const confirmBtn = modal.querySelector('.btn-confirm');
            confirmBtn.addEventListener('click', () => {
                if (fileInput.files.length > 0) {
                    showNotification('课件替换成功', 'success');
                    modal.classList.remove('active');
                } else {
                    showNotification('请选择一个文件', 'warning');
                }
            });
        }
        
        // 显示模态框
        modal.classList.add('active');
    }
    
    // 全屏按钮功能
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                // 进入全屏 - 整个编辑器区域
                if (editorContent.requestFullscreen) {
                    editorContent.requestFullscreen();
                } else if (editorContent.mozRequestFullScreen) { // Firefox
                    editorContent.mozRequestFullScreen();
                } else if (editorContent.webkitRequestFullscreen) { // Chrome, Safari, Opera
                    editorContent.webkitRequestFullscreen();
                } else if (editorContent.msRequestFullscreen) { // IE/Edge
                    editorContent.msRequestFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenBtn.title = "退出全屏";
            } else {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        });
        
        // 监听全屏变化事件
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement && 
                !document.msFullscreenElement) {
                // 退出全屏
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        }
    }
}

/**
 * 初始化课堂小测功能
 */
function initQuizGenerator() {
    // 题型选择
    const quizTypes = document.querySelectorAll('.quiz-type');
    
    quizTypes.forEach(type => {
        type.addEventListener('click', function() {
            quizTypes.forEach(qt => qt.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换题型的逻辑
        });
    });
    
    // 生成方式选择
    const optionBtns = document.querySelectorAll('.option-btn');
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换生成方式的逻辑
        });
    });
    
    // 难度滑块
    const difficultySlider = document.getElementById('difficulty-slider');
    
    if (difficultySlider) {
        difficultySlider.addEventListener('input', function() {
            // 这里可以添加难度调整的逻辑
        });
    }
    
    // 生成按钮
    const generateBtn = document.querySelector('.generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            showNotification('正在生成题目...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                showNotification('题目生成成功！', 'success');
                
                // 显示题目结果和生成的题目列表
                const quizResult = document.querySelector('.quiz-result');
                const generatedQuestionsList = document.querySelector('.generated-questions-list');
                
                if (quizResult) {
                    quizResult.style.display = 'block';
                }
                
                if (generatedQuestionsList) {
                    // 清除之前的动画
                    generatedQuestionsList.classList.remove('visible');
                    
                    // 显示列表
                    generatedQuestionsList.style.display = 'block';
                    
                    // 触发重绘
                    void generatedQuestionsList.offsetWidth;
                    
                    // 添加动画类
                    generatedQuestionsList.classList.add('visible');
                    
                    // 滚动到题目列表
                    setTimeout(() => {
                        generatedQuestionsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
                
                // 这里可以添加实际的题目生成逻辑
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 这里可以添加结果操作逻辑（编辑、保存、重新生成等）
        });
    });
}

/**
 * 初始化知识拓展功能
 */
function initKnowledgeExpansion() {
    // 文化按钮选择
    const cultureBtns = document.querySelectorAll('.culture-btn');
    
    cultureBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cultureBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换文化类型的逻辑
        });
    });
    
    // 生成按钮
    const generateBtn = document.querySelector('.knowledge-generation .generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
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
 * 初始化思维导图的缩放和拖动功能
 * 使用鼠标中键滚动实现缩放，按住中键拖动实现平移
 */
function initZoomableMindmap() {
    // 在文档加载完毕后或在AI助教-课中页面初始化时调用
    document.addEventListener('DOMContentLoaded', setupMindmapZoom);
    // 也可以在切换到相应页面时初始化
    const aiInClassNav = document.querySelector('.nav-item[data-section="ai-in"]');
    if (aiInClassNav) {
        aiInClassNav.addEventListener('click', setupMindmapZoom);
    }
    
    function setupMindmapZoom() {
        const mindmapContainer = document.getElementById('zoomable-mindmap');
        if (!mindmapContainer) return;
        
        let scale = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;
        
        // 设置初始状态
        updateMindmapTransform();
        
        // 滚动缩放功能 - 不需要按住中键，直接滚动即可缩放
        mindmapContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const zoomSensitivity = 0.1;
            const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
            
            // 计算缩放的鼠标位置
            const rect = mindmapContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 更新缩放比例
            const newScale = Math.max(0.5, Math.min(3, scale + delta));
            
            // 根据鼠标位置计算新的平移值以保持鼠标下方的点不变
            if (scale !== newScale) {
                const scaleRatio = newScale / scale;
                translateX = mouseX - scaleRatio * (mouseX - translateX);
                translateY = mouseY - scaleRatio * (mouseY - translateY);
                scale = newScale;
                
                updateMindmapTransform();
            }
        });
        
        // 中键拖动功能
        mindmapContainer.addEventListener('mousedown', function(e) {
            // 检查是否是中键按下
            if (e.button === 1) {
                e.preventDefault();
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                
                // 改变鼠标指针样式
                mindmapContainer.style.cursor = 'grabbing';
            }
        });
        
        // 处理拖动移动
        window.addEventListener('mousemove', function(e) {
            if (isDragging) {
                e.preventDefault();
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateMindmapTransform();
            }
        });
        
        // 处理拖动结束
        window.addEventListener('mouseup', function(e) {
            if (isDragging && e.button === 1) {
                isDragging = false;
                mindmapContainer.style.cursor = 'default';
            }
        });
        
        // 更新思维导图的变换
        function updateMindmapTransform() {
            if (!mindmapContainer) return;
            mindmapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            mindmapContainer.style.transformOrigin = 'center';
            mindmapContainer.style.transition = isDragging ? 'none' : 'transform 0.2s ease-out';
        }
    }
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
 * 初始化章节滑动功能
 * 处理章节列表的水平滚动和导航按钮
 */
function initChapterSlider() {
    const chapterList = document.querySelector('.chapters-container');
    if (!chapterList) return;

    const prevBtn = document.querySelector('.chapter-nav-btn.prev-btn');
    const nextBtn = document.querySelector('.chapter-nav-btn.next-btn');
    
    if (!prevBtn || !nextBtn) return;
    
    // 初始状态下禁用上一页按钮
    prevBtn.classList.add('disabled');
    prevBtn.style.opacity = '0.5';
    prevBtn.style.cursor = 'not-allowed';
    
    // 卡片容器可见宽度
    const containerWidth = chapterList.offsetWidth;
    // 总内容宽度
    const scrollWidth = chapterList.scrollWidth;
    
    // 检查是否有溢出内容需要滚动
    if (scrollWidth <= containerWidth) {
        nextBtn.classList.add('disabled');
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
        return; // 如果没有滚动内容，不需要继续设置
    }

    // 设置滚动距离
    let cardWidth = 500; // 更新默认卡片宽度（包含外边距）
    const chapterCard = document.querySelector('.chapter-card');
    if (chapterCard) {
        cardWidth = chapterCard.offsetWidth + 20; // 加上外边距
    }
    const cardGap = 30; // 卡片之间的间距
    const scrollDistance = cardWidth + cardGap;

    // 更新按钮状态的函数
    function updateButtonStates() {
        if (!chapterList) return;
        
        const scrollPosition = chapterList.scrollLeft;
        const maxScroll = scrollWidth - containerWidth;
        
        // 根据滚动位置启用/禁用按钮
        if (scrollPosition <= 5) { // 添加少量容差
            prevBtn.classList.add('disabled');
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (scrollPosition >= maxScroll - 5) { // 添加容差值
            nextBtn.classList.add('disabled');
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    // 添加按钮点击事件
    prevBtn.addEventListener('click', function() {
        if (!prevBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    nextBtn.addEventListener('click', function() {
        if (!nextBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    // 监听滚动事件更新按钮状态
    chapterList.addEventListener('scroll', updateButtonStates);
    
    // 初始化按钮状态
    updateButtonStates();
    
    // 确保初始状态下正确设置按钮状态
    setTimeout(updateButtonStates, 100);
}

// 添加课程思政和实训任务部分的交互
function initIdeologyAndPractice() {
    // 思政部分多媒体上传选项切换
    const uploadOptions = document.querySelectorAll('.upload-option');
    if (uploadOptions.length > 0) {
        uploadOptions.forEach(option => {
            option.addEventListener('click', () => {
                uploadOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    // 实训任务选项卡切换
    const practiceTabs = document.querySelectorAll('.practice-tab');
    const practiceContents = document.querySelectorAll('.practice-content');
    
    if (practiceTabs.length > 0) {
        practiceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-practice-tab');
                
                // 更新选项卡状态
                practiceTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 更新内容显示
                practiceContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}-content`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // 虚拟角色选择
    const roleTypes = document.querySelectorAll('.role-type');
    if (roleTypes.length > 0) {
        roleTypes.forEach(role => {
            role.addEventListener('click', () => {
                roleTypes.forEach(r => r.classList.remove('active'));
                role.classList.add('active');
            });
        });
    }

    // 为生成按钮添加点击效果
    const generateButtons = document.querySelectorAll('.generate-btn');
    if (generateButtons.length > 0) {
        generateButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 模拟生成中状态
                const originalText = btn.innerHTML;
                btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span class="zh">生成中...</span><span class="en">Generating...</span>`;
                btn.disabled = true;
                
                // 模拟生成过程
                setTimeout(() => {
                    // 恢复按钮状态
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    
                    // 显示成功通知
                    showNotification('内容已成功生成！', 'success');
                    
                    // 刷新预览区域，这里可以根据实际需求进行更多处理
                    // 此处仅作为示例
                }, 1500);
            });
        });
    }
}

// 初始化最新动态过滤功能
function initActivityFilters() {
    const filterItems = document.querySelectorAll('.filter-item');
    const activityItems = document.querySelectorAll('.activity-item');
    
    if (filterItems.length > 0) {
        filterItems.forEach(item => {
            item.addEventListener('click', () => {
                // 更新过滤器样式
                filterItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const filterType = item.getAttribute('data-filter');
                
                // 显示/隐藏活动项
                activityItems.forEach(activity => {
                    if (filterType === 'all' || activity.classList.contains(filterType)) {
                        activity.style.display = 'flex';
                    } else {
                        activity.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // 查看更多按钮功能
    const moreBtn = document.querySelector('.more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            // 这里可以实现查看更多功能，例如加载更多活动或跳转到活动页面
            showNotification('加载更多动态...', 'info');
        });
    }
}

/**
 * 初始化AI助教-课中部分
 * 处理AI助教-课中部分的交互功能
 */
function initAIInClass() {
    // 初始化控制面板切换
    initClassroomControlPanel();
    
    // 初始化签到分组功能
    initCheckInAndGrouping();
    
    // 初始化课件展示功能
    initSlidesDisplay();
    
    // 初始化互动功能
    initClassInteraction();
    
    // 初始化课堂数据分析
    initClassDataAnalysis();
}

/**
 * 初始化课堂控制面板
 */
function initClassroomControlPanel() {
    const controlItems = document.querySelectorAll('.control-item');
    const classroomPanels = document.querySelectorAll('.classroom-panel');
    
    if (controlItems.length === 0 || classroomPanels.length === 0) return;
    
    controlItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 移除所有控制项的活动状态
            controlItems.forEach(i => i.classList.remove('active'));
            // 为当前点击的控制项添加活动状态
            item.classList.add('active');
            
            // 隐藏所有面板
            classroomPanels.forEach(panel => panel.classList.remove('active'));
            // 显示对应的面板
            if (index < classroomPanels.length) {
                classroomPanels[index].classList.add('active');
            }
        });
    });
    
    // 课堂计时器功能
    const pauseBtn = document.querySelector('.class-status .control-btn:nth-child(3)');
    const stopBtn = document.querySelector('.class-status .control-btn:nth-child(4)');
    const timeDisplay = document.querySelector('.class-time');
    const statusBadge = document.querySelector('.status-badge');
    
    if (pauseBtn && stopBtn && timeDisplay && statusBadge) {
        let isPaused = false;
        let classTime = 0; // 秒数
        let timerInterval;
        
        // 初始化计时器
        function startTimer() {
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    classTime++;
                    updateTimeDisplay();
                }
            }, 1000);
        }
        
        // 更新时间显示
        function updateTimeDisplay() {
            const hours = Math.floor(classTime / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((classTime % 3600) / 60).toString().padStart(2, '0');
            const seconds = (classTime % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // 暂停/继续按钮
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            
            if (isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂已暂停</span><span class="en">Class Paused</span>';
                statusBadge.classList.remove('active');
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂进行中</span><span class="en">Class in Progress</span>';
                statusBadge.classList.add('active');
            }
        });
        
        // 停止按钮
        stopBtn.addEventListener('click', () => {
            if (confirm('确定要结束当前课堂吗？')) {
                clearInterval(timerInterval);
                showNotification('课堂已结束', 'success');
                
                // 模拟导航到课后页面
                setTimeout(() => {
                    const aiPostNav = document.querySelector('.nav-item[data-section="ai-post"]');
                    if (aiPostNav) {
                        aiPostNav.click();
                    }
                }, 1500);
            }
        });
        
        // 启动计时器
        startTimer();
    }
}

/**
 * 初始化签到分组功能
 */
function initCheckInAndGrouping() {
    // 获取DOM元素
    const groupCountInput = document.getElementById('groupCount');
    const peoplePerGroupInput = document.getElementById('peoplePerGroup');
    const groupingMethodSelect = document.getElementById('groupingMethod');
    const groupBtn = document.querySelector('.panel-btn.group-action-btn');
    const groupList = document.querySelector('.group-list');
    
    // 签到二维码按钮
    const qrCodeBtn = document.querySelector('.panel-actions .panel-btn:not(.group-action-btn)');
    if (qrCodeBtn) {
        qrCodeBtn.addEventListener('click', () => {
            showNotification('签到二维码已显示', 'info');
        });
    }
    
    // 添加不同颜色样式到按钮
    if (groupBtn) {
        groupBtn.classList.add('primary-action');
    }
    
    // 数量增减控制
    function initNumberInput(input) {
        if (!input) return;
        
        const decreaseBtn = input.parentElement.querySelector('.decrease');
        const increaseBtn = input.parentElement.querySelector('.increase');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value > parseInt(input.min)) {
                    input.value = value - 1;
                    updateGroupSettings();
                }
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value < parseInt(input.max)) {
                    input.value = value + 1;
                    updateGroupSettings();
                }
            });
        }
        
        // 输入框值变化时更新
        input.addEventListener('change', updateGroupSettings);
    }
    
    // 初始化数量输入框
    initNumberInput(groupCountInput);
    initNumberInput(peoplePerGroupInput);
    
    // 更新分组设置
    function updateGroupSettings() {
        const totalStudents = 78; // 已签到学生数
        const groupCount = parseInt(groupCountInput.value);
        const peoplePerGroup = parseInt(peoplePerGroupInput.value);
        
        // 检查设置是否合理
        if (groupCount * peoplePerGroup > totalStudents) {
            showNotification('当前设置超出总人数,请调整', 'warning');
            return false;
        }
        
        return true;
    }
    
    // 分组按钮点击事件
    if (groupBtn) {
        groupBtn.addEventListener('click', () => {
            if (!updateGroupSettings()) return;
            
            const groupCount = parseInt(groupCountInput.value);
            const peoplePerGroup = parseInt(peoplePerGroupInput.value);
            const groupingMethod = groupingMethodSelect.value;
            
            // 生成模拟学生数据
            const students = generateMockStudents();
            
            // 根据不同方式分组
            const groups = groupStudents(students, groupCount, peoplePerGroup, groupingMethod);
            
            // 显示分组结果
            displayGroups(groups);
        });
    }
    
    // 生成模拟学生数据
    function generateMockStudents() {
        const names = ['张明', '李华', '王芳', '刘伟', '陈晓', '赵阳', '钱宇', '孙丽', '周红', '吴勇', 
                      '郑军', '冯敏', '陈刚', '徐静', '杨光', '朱峰', '秦莉', '许涛', '潘婷', '马超'];
        
        return Array.from({length: 78}, (_, i) => ({
            id: i + 1,
            name: names[i % names.length] + (Math.floor(i / names.length) + 1),
            grade: Math.floor(Math.random() * 40) + 60, // 60-100分
            activity: Math.floor(Math.random() * 100) // 0-100活跃度
        }));
    }
    
    // 根据不同方式分组
    function groupStudents(students, groupCount, peoplePerGroup, method) {
        let groupedStudents = [];
        
        switch (method) {
            case 'balanced': // 成绩均衡
                students.sort((a, b) => b.grade - a.grade);
                break;
            case 'activity': // 活跃度均衡
                students.sort((a, b) => b.activity - a.activity);
                break;
            default: // 随机
                students.sort(() => Math.random() - 0.5);
        }
        
        // 创建分组
        for (let i = 0; i < groupCount; i++) {
            groupedStudents.push([]);
        }
        
        // 蛇形分配,确保每组能力均衡
        let groupIndex = 0;
        let direction = 1;
        
        students.forEach((student, index) => {
            if (groupedStudents[groupIndex].length < peoplePerGroup) {
                groupedStudents[groupIndex].push(student);
            }
            
            groupIndex += direction;
            
            if (groupIndex >= groupCount - 1) {
                direction = -1;
            } else if (groupIndex <= 0) {
                direction = 1;
            }
        });
        
        return groupedStudents;
    }
    
    // 显示分组结果
    function displayGroups(groups) {
        if (!groupList) return;
        
        groupList.innerHTML = '';
        
        groups.forEach((group, index) => {
            if (group.length === 0) return;
            
            const groupItem = document.createElement('div');
            groupItem.className = 'group-item';
            
            groupItem.innerHTML = `
                <div class="group-header">
                    <h4 class="zh">第${index + 1}组 (${group.length}人)</h4>
                    <h4 class="en">Group ${index + 1} (${group.length} Students)</h4>
                    <div class="group-actions">
                        <button class="group-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="group-btn">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </div>
                <div class="student-tags">
                    ${group.slice(0, 5).map(student => `
                        <span class="student-tag" title="成绩:${student.grade} 活跃度:${student.activity}">
                            ${student.name}
                        </span>
                    `).join('')}
                    ${group.length > 5 ? `<span class="student-tag">+${group.length - 5}</span>` : ''}
                </div>
            `;
            
            // 添加编辑和消息按钮事件
            const editBtn = groupItem.querySelector('.group-btn:nth-child(1)');
            const messageBtn = groupItem.querySelector('.group-btn:nth-child(2)');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showNotification(`正在编辑第${index + 1}组`, 'info');
                });
            }
            
            if (messageBtn) {
                messageBtn.addEventListener('click', () => {
                    showNotification(`已向第${index + 1}组发送消息`, 'success');
                });
            }
            
            groupList.appendChild(groupItem);
        });
        
        showNotification('分组完成', 'success');
    }
}

/**
 * 初始化课件展示功能
 */
function initSlidesDisplay() {
    // 幻灯片控制按钮
    const prevSlideBtn = document.querySelector('.slide-control-btn:nth-child(1)');
    const playSlideBtn = document.querySelector('.slide-control-btn:nth-child(2)');
    const nextSlideBtn = document.querySelector('.slide-control-btn:nth-child(3)');
    const slideCounter = document.querySelector('.slide-counter');
    
    if (prevSlideBtn && playSlideBtn && nextSlideBtn && slideCounter) {
        let currentSlide = 15;
        const totalSlides = 45;
        let isPlaying = false;
        let slideInterval;
        
        // 上一张幻灯片
        prevSlideBtn.addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                updateSlideDisplay();
            }
        });
        
        // 播放/暂停幻灯片
        playSlideBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playSlideBtn.innerHTML = '<i class="fas fa-pause"></i>';
                slideInterval = setInterval(() => {
                    if (currentSlide < totalSlides) {
                        currentSlide++;
                        updateSlideDisplay();
                    } else {
                        clearInterval(slideInterval);
                        isPlaying = false;
                        playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }, 3000);
            } else {
                playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                clearInterval(slideInterval);
            }
        });
        
        // 下一张幻灯片
        nextSlideBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlideDisplay();
            }
        });
        
        // 更新幻灯片显示
        function updateSlideDisplay() {
            slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
            
            // 这里可以添加切换幻灯片图片的逻辑
            const slideImg = document.querySelector('.current-slide');
            if (slideImg) {
                slideImg.style.opacity = '0';
                
                setTimeout(() => {
                    slideImg.style.opacity = '1';
                }, 300);
            }
            
            // 更新缩略图选中状态
            const thumbnails = document.querySelectorAll('.slide-thumbnail');
            if (thumbnails.length > 0) {
                thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
                
                // 假设缩略图的顺序与幻灯片顺序对应，选中当前幻灯片的缩略图
                // 由于示例中只有几个缩略图，这里只是模拟效果
                const idx = (currentSlide - 13) % thumbnails.length;
                if (idx >= 0 && idx < thumbnails.length) {
                    thumbnails[idx].classList.add('active');
                }
            }
        }
        
        // 缩略图点击事件
        const thumbnails = document.querySelectorAll('.slide-thumbnail');
        if (thumbnails.length > 0) {
            thumbnails.forEach((thumbnail, idx) => {
                thumbnail.addEventListener('click', () => {
                    // 修改: 避免读取不存在的元素
                    currentSlide = 13 + idx;
                    updateSlideDisplay();
                });
            });
        }
    }
    
    // 全屏和批注按钮
    const fullscreenBtn = document.querySelector('#slides-panel .panel-btn:nth-child(1)');
    const annotateBtn = document.querySelector('#slides-panel .panel-btn:nth-child(2)');
    const slidePreview = document.querySelector('.slide-preview');
    
    if (fullscreenBtn && annotateBtn && slidePreview) {
        fullscreenBtn.addEventListener('click', () => {
            toggleFullscreen();
        });
        
        annotateBtn.addEventListener('click', () => {
            showNotification('已启用批注模式', 'info');
        });
        
        // 全屏切换函数
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                slidePreview.requestFullscreen().catch(err => {
                    showNotification('全屏模式失败: ' + err.message, 'error');
                });
                slidePreview.classList.add('fullscreen');
            } else {
                document.exitFullscreen();
                slidePreview.classList.remove('fullscreen');
            }
        }
        
        // 全屏状态变化监听
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                slidePreview.classList.remove('fullscreen');
            }
        });
        
        // 初始化全屏互动工具
        initFullscreenInteractionTools();
    }
}

/**
 * 初始化全屏模式下的互动工具
 */
function initFullscreenInteractionTools() {
    const interactionTools = document.querySelectorAll('.fullscreen-tool');
    const interactionModal = document.getElementById('interaction-modal');
    const closeInteractionBtn = document.querySelector('.close-interaction-btn');
    
    // 互动工具点击事件
    if (interactionTools.length > 0) {
        interactionTools.forEach(tool => {
            tool.addEventListener('click', () => {
                if (document.fullscreenElement) {
                    // 先退出全屏，再显示互动弹窗
                    document.exitFullscreen().then(() => {
                        setTimeout(() => {
                            openInteractionModal(tool.getAttribute('data-interaction'));
                        }, 300);
                    });
                } else {
                    openInteractionModal(tool.getAttribute('data-interaction'));
                }
            });
        });
    }
    
    // 关闭互动弹窗
    if (closeInteractionBtn) {
        closeInteractionBtn.addEventListener('click', () => {
            interactionModal.classList.remove('active');
        });
    }
    
    // 初始化显示答案按钮事件
    initShowAnswerButtons();
    
    // 打开互动弹窗并显示对应内容
    function openInteractionModal(interactionType) {
        if (!interactionModal) return;
        
        // 隐藏所有互动内容区域
        const interactionSections = interactionModal.querySelectorAll('.interaction-section');
        interactionSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // 根据互动类型显示对应内容
        const targetSection = document.getElementById(`${interactionType}-interaction`);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // 更新弹窗标题
            const headerZh = interactionModal.querySelector('.interaction-header .zh');
            const headerEn = interactionModal.querySelector('.interaction-header .en');
            
            if (headerZh && headerEn) {
                if (interactionType === 'quiz') {
                    headerZh.textContent = '课堂小测';
                    headerEn.textContent = 'Quiz';
                    
                    // 初始化题目导航
                    setTimeout(() => {
                        initQuizNavigation();
                    }, 100);
                } else if (interactionType === 'knowledge') {
                    headerZh.textContent = '知识拓展';
                    headerEn.textContent = 'Knowledge Expansion';
                } else if (interactionType === 'ideology') {
                    headerZh.textContent = '课程思政';
                    headerEn.textContent = 'Ideological Discussion';
                }
            }
            
            // 重置答案显示状态
            const answerContainers = targetSection.querySelectorAll('.answer-container');
            const showAnswerBtns = targetSection.querySelectorAll('.show-answer-btn');
            
            answerContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            showAnswerBtns.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
            });
            
            interactionModal.classList.add('active');
        }
    }
}

/**
 * 初始化显示答案按钮事件
 */
function initShowAnswerButtons() {
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.show-answer-btn')) {
            const btn = e.target.closest('.show-answer-btn');
            const answerContainer = btn.nextElementSibling;
            
            if (answerContainer && answerContainer.classList.contains('answer-container')) {
                if (answerContainer.style.display === 'none') {
                    // 显示答案
                    answerContainer.style.display = 'block';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i><span class="zh">隐藏答案</span><span class="en">Hide Answer</span>';
                } else {
                    // 隐藏答案
                    answerContainer.style.display = 'none';
                    btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
                }
            }
        }
    });
}

/**
 * 初始化互动功能
 */
function initClassInteraction() {
    // 互动类型切换
    const interactionTypes = document.querySelectorAll('.interaction-type');
    
    if (interactionTypes.length > 0) {
        interactionTypes.forEach(type => {
            type.addEventListener('click', () => {
                interactionTypes.forEach(t => t.classList.remove('active'));
                type.classList.add('active');
                
                const typeName = type.querySelector('.zh').textContent;
                showNotification(`已切换到: ${typeName}`, 'info');
            });
        });
    }
    
    // 发起互动按钮
    const startInteractionBtn = document.querySelector('.panel-btn.primary');
    
    if (startInteractionBtn) {
        startInteractionBtn.addEventListener('click', () => {
            const activeType = document.querySelector('.interaction-type.active');
            if (activeType) {
                const typeName = activeType.querySelector('.zh').textContent;
                showNotification(`正在发起: ${typeName}`, 'success');
            }
        });
    }
    
    // 弹幕发送功能
    const danmakuInput = document.querySelector('.danmaku-input.zh');
    const sendDanmakuBtn = document.querySelector('.send-danmaku-btn');
    const danmakuScreen = document.querySelector('.danmaku-screen');
    const sentimentBtns = document.querySelectorAll('.sentiment-btn');
    
    if (danmakuInput && sendDanmakuBtn && danmakuScreen && sentimentBtns.length > 0) {
        // 情感按钮切换
        sentimentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sentimentBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // 发送弹幕
        function sendDanmaku() {
            const content = danmakuInput.value.trim();
            if (content) {
                const danmaku = document.createElement('div');
                danmaku.classList.add('danmaku-item');
                
                // 添加情感类型
                const activeSentiment = document.querySelector('.sentiment-btn.active');
                if (activeSentiment) {
                    if (activeSentiment.classList.contains('agree')) {
                        danmaku.classList.add('agree');
                    } else if (activeSentiment.classList.contains('disagree')) {
                        danmaku.classList.add('disagree');
                    }
                }
                
                danmaku.textContent = content;
                
                // 随机高度
                const top = Math.floor(Math.random() * 150) + 10;
                danmaku.style.top = `${top}px`;
                
                danmakuScreen.appendChild(danmaku);
                danmakuInput.value = '';
                
                // 弹幕动画结束后移除元素
                danmaku.addEventListener('animationend', () => {
                    danmaku.remove();
                });
            }
        }
        
        // 点击发送按钮
        sendDanmakuBtn.addEventListener('click', sendDanmaku);
        
        // 按下回车键发送
        danmakuInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendDanmaku();
            }
        });
        
        // 弹幕设置按钮
        const danmakuSettingBtns = document.querySelectorAll('.danmaku-setting-btn');
        
        if (danmakuSettingBtns.length >= 3) {
            // 设置按钮
            danmakuSettingBtns[0].addEventListener('click', () => {
                showNotification('弹幕设置已打开', 'info');
            });
            
            // 暂停/继续按钮
            let isPaused = false;
            danmakuSettingBtns[1].addEventListener('click', () => {
                isPaused = !isPaused;
                
                if (isPaused) {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-play"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'paused';
                    });
                    showNotification('弹幕已暂停', 'info');
                } else {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-pause"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'running';
                    });
                    showNotification('弹幕已继续', 'info');
                }
            });
            
            // 清空按钮
            danmakuSettingBtns[2].addEventListener('click', () => {
                danmakuScreen.innerHTML = '';
                showNotification('弹幕已清空', 'info');
            });
        }
    }
}

/**
 * 初始化课堂数据分析
 */
function initClassDataAnalysis() {
    // 导出数据按钮
    const exportDataBtn = document.querySelector('#class-data-panel .panel-btn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            showNotification('正在导出课堂数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('课堂数据已导出', 'success');
            }, 800);
        });
    }
    
    // 这里可以添加图表初始化代码，但由于示例中使用的是占位图像，暂不实现
}

/**
 * 初始化学情画像功能
 * 处理学生数据的筛选、排序、查询等交互功能
 */
function initStudentProfile() {
    // 初始化筛选功能
    initProfileFilters();
    
    // 初始化表格操作和分页功能
    initProfileTable();
    
    // 初始化搜索和批量操作功能
    initProfileSearch();
    
    // 初始化表格内操作按钮功能
    initTableActions();
}

/**
 * 初始化筛选功能
 */
function initProfileFilters() {
    const classSelect = document.getElementById('class-select');
    const dateFilter = document.querySelector('.filter-date');
    const filterBtn = document.querySelector('.filter-btn:not(.reset)');
    const resetBtn = document.querySelector('.filter-btn.reset');
    
    if (!classSelect || !dateFilter || !filterBtn || !resetBtn) return;
    
    // 筛选按钮点击事件
    filterBtn.addEventListener('click', () => {
        const selectedClass = classSelect.value;
        const selectedDate = dateFilter.value;
        
        // 模拟筛选操作
        showNotification('正在应用筛选条件...', 'info');
        
        // 这里可以添加实际的筛选逻辑，向后端发送请求等
        setTimeout(() => {
            let message = '';
            
            if (selectedClass !== 'all') {
                const classText = document.querySelector(`#class-select option[value="${selectedClass}"]`).textContent;
                const className = document.body.classList.contains('en-mode') ? 
                    classText.trim() : classText.trim();
                message += `班级: ${className}, `;
            }
            
            if (selectedDate) {
                const dateObj = new Date(selectedDate);
                const formattedDate = dateObj.toLocaleDateString();
                message += `截止日期: ${formattedDate}`;
            }
            
            if (message) {
                showNotification(`筛选已应用: ${message}`, 'success');
            } else {
                showNotification('筛选已应用', 'success');
            }
        }, 500);
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', () => {
        classSelect.value = 'all';
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateFilter.value = `${year}-${month}-${day}`;
        
        showNotification('筛选条件已重置', 'info');
    });
}

/**
 * 初始化表格操作和分页功能
 */
function initProfileTable() {
    const selectAll = document.getElementById('select-all');
    const studentCheckboxes = document.querySelectorAll('.student-checkbox');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const paginationSelect = document.querySelector('.pagination-select');
    
    if (!selectAll || studentCheckboxes.length === 0) return;
    
    // 全选/取消全选
    selectAll.addEventListener('change', () => {
        studentCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    });
    
    // 单个复选框更新全选状态
    studentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(studentCheckboxes).every(cb => cb.checked);
            const anyChecked = Array.from(studentCheckboxes).some(cb => cb.checked);
            
            selectAll.checked = allChecked;
            selectAll.indeterminate = anyChecked && !allChecked;
        });
    });
    
    // 分页按钮点击
    if (paginationBtns.length > 0) {
        paginationBtns.forEach(btn => {
            if (!btn.disabled && !btn.classList.contains('active')) {
                btn.addEventListener('click', () => {
                    // 获取页码
                    const page = btn.textContent;
                    if (!isNaN(page)) {
                        // 数字页码按钮
                        paginationBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        showNotification(`已切换到第 ${page} 页`, 'info');
                    } else if (btn.querySelector('i.fa-chevron-left')) {
                        // 上一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.previousElementSibling && 
                            activePage.previousElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.previousElementSibling.classList.add('active');
                            showNotification(`已切换到上一页`, 'info');
                        }
                    } else if (btn.querySelector('i.fa-chevron-right')) {
                        // 下一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.nextElementSibling && 
                            activePage.nextElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.nextElementSibling.classList.add('active');
                            showNotification(`已切换到下一页`, 'info');
                        }
                    }
                });
            }
        });
    }
    
    // 每页显示数量选择
    if (paginationSelect) {
        paginationSelect.addEventListener('change', () => {
            const perPage = paginationSelect.value;
            showNotification(`每页显示数量已更改为 ${perPage}`, 'info');
        });
    }
}

/**
 * 初始化搜索和批量操作功能
 */
function initProfileSearch() {
    const searchInputs = document.querySelectorAll('.profile-search .search-input');
    const exportBtn = document.querySelector('.action-btn.export');
    const batchBtn = document.querySelector('.action-btn.batch');
    
    // 搜索功能
    if (searchInputs.length > 0) {
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = input.value.trim();
                    if (searchTerm) {
                        showNotification(`正在搜索: ${searchTerm}`, 'info');
                        
                        // 这里可以添加实际的搜索逻辑
                        setTimeout(() => {
                            showNotification(`已找到与 "${searchTerm}" 相关的结果`, 'success');
                        }, 500);
                    }
                }
            });
        });
    }
    
    // 导出数据按钮
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showNotification('正在准备导出数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('数据已成功导出', 'success');
            }, 800);
        });
    }
    
    // 批量操作按钮
    if (batchBtn) {
        batchBtn.addEventListener('click', () => {
            const checkedStudents = document.querySelectorAll('.student-checkbox:checked');
            
            if (checkedStudents.length === 0) {
                showNotification('请先选择学生', 'warning');
                return;
            }
            
            showNotification(`已选择 ${checkedStudents.length} 名学生，准备批量操作`, 'info');
            
            // 这里可以添加实际的批量操作逻辑，例如显示操作菜单等
        });
    }
}

/**
 * 初始化表格内操作按钮功能
 */
function initTableActions() {
    const viewBtns = document.querySelectorAll('.table-btn.view');
    const gradeBtns = document.querySelectorAll('.table-btn.grade');
    const messageBtns = document.querySelectorAll('.table-btn.message');
    
    // 查看学生画像
    if (viewBtns.length > 0) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                const studentId = row.cells[2].textContent;
                
                showNotification(`查看学生画像: ${studentName} (${studentId})`, 'info');
                
                // 这里可以添加打开学生详情模态框的逻辑
            });
        });
    }
    
    // 批阅作业
    if (gradeBtns.length > 0) {
        gradeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`正在批阅 ${studentName} 的作业`, 'info');
                
                // 这里可以添加打开批阅界面的逻辑
            });
        });
    }
    
    // 发送消息
    if (messageBtns.length > 0) {
        messageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`发送消息给 ${studentName}`, 'info');
                
                // 这里可以添加打开消息对话框的逻辑
            });
        });
    }
}

/**
 * 初始化中国文化演化模块
 * 处理文化演化模块中的视图切换、交互等功能
 */
function initCultureEvolution() {
    // 初始化视图切换
    initViewModes();
    
    // 初始化时间轴功能
    initTimelineView();
    
    // 初始化地图视图功能
    initMapView();
    
    // 初始化关系图视图功能
    initRelationView();
    
    // 初始化文化元素卡片功能
    initElementCard();
}

/**
 * 初始化视图模式切换功能
 */
function initViewModes() {
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const evolutionViews = document.querySelectorAll('.evolution-view');
    
    if (viewModeBtns.length === 0 || evolutionViews.length === 0) return;
    
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的活动状态
            viewModeBtns.forEach(b => b.classList.remove('active'));
            // 为当前点击的按钮添加活动状态
            btn.classList.add('active');
            
            // 获取要显示的视图模式
            const viewMode = btn.getAttribute('data-mode');
            
            // 隐藏所有视图
            evolutionViews.forEach(view => view.classList.remove('active'));
            
            // 显示对应的视图
            document.querySelector(`.${viewMode}-view`).classList.add('active');
            
            // 视图切换通知
            const modeName = btn.querySelector('.zh').textContent;
            showNotification(`已切换到${modeName}视图`, 'info');
        });
    });
    
    // 类别和朝代筛选下拉框
    const filterSelects = document.querySelectorAll('.evolution-filters .filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            const filterType = select.querySelector('option:checked').classList.contains('zh') ? 
                select.previousElementSibling.querySelector('.zh').textContent : 
                select.previousElementSibling.querySelector('.en').textContent;
            
            const selectedValue = select.value;
            const selectedText = select.querySelector(`option[value="${selectedValue}"]`).textContent;
            
            showNotification(`已筛选${filterType}: ${selectedText}`, 'info');
            
            // 根据视图模式应用不同的筛选逻辑
            const activeView = document.querySelector('.evolution-view.active');
            
            if (activeView.classList.contains('timeline-view')) {
                applyTimelineFilter(selectedValue);
            } else if (activeView.classList.contains('map-view')) {
                applyMapFilter(selectedValue);
            } else if (activeView.classList.contains('relation-view')) {
                applyRelationFilter(selectedValue);
            }
        });
    });
}

/**
 * 应用时间轴视图筛选
 * @param {string} filter - 筛选条件
 */
function applyTimelineFilter(filter) {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    if (filter === 'all') {
        // 显示所有节点
        timelineNodes.forEach(node => {
            node.style.display = 'block';
        });
        return;
    }
    
    // 筛选节点
    timelineNodes.forEach(node => {
        // 检查节点是否符合筛选条件（类别或朝代）
        const nodeCategory = node.getAttribute('data-category');
        
        if (nodeCategory === filter) {
            node.style.display = 'block';
        } else {
            node.style.display = 'none';
        }
    });
}

/**
 * 应用地图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyMapFilter(filter) {
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    if (filter === 'all') {
        // 显示所有标记
        mapMarkers.forEach(marker => {
            marker.style.display = 'block';
        });
        return;
    }
    
    // 筛选标记
    mapMarkers.forEach(marker => {
        // 检查标记是否符合筛选条件（朝代）
        const markerEra = marker.getAttribute('data-era');
        
        if (markerEra === filter) {
            marker.style.display = 'block';
        } else {
            marker.style.display = 'none';
        }
    });
}

/**
 * 应用关系图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyRelationFilter(filter) {
    // 这里通常会与可视化库（如D3.js）集成
    // 目前仅显示通知
    showNotification(`关系图筛选已应用: ${filter}`, 'info');
}

/**
 * 初始化时间轴视图功能
 */
function initTimelineView() {
    // 缩放控制
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    const zoomSlider = document.querySelector('.zoom-slider input');
    
    if (zoomSlider) {
        // 缩放滑块
        zoomSlider.addEventListener('input', () => {
            const zoomLevel = zoomSlider.value;
            applyTimelineZoom(zoomLevel);
        });
        
        // 缩放按钮
        if (zoomButtons.length >= 2) {
            // 缩小按钮
            zoomButtons[0].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.max(1, currentZoom - 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
            
            // 放大按钮
            zoomButtons[1].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.min(10, currentZoom + 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
        }
    }
    
    // 时间轴导航
    const navigationButtons = document.querySelectorAll('.navigation-btn');
    const timelineEras = document.querySelectorAll('.timeline-era');
    let currentEraIndex = 2; // 默认选中"秦汉"时期
    
    if (navigationButtons.length >= 2 && timelineEras.length > 0) {
        // 上一个时期按钮
        navigationButtons[0].addEventListener('click', () => {
            if (currentEraIndex > 0) {
                currentEraIndex--;
                updateActiveEra();
            }
        });
        
        // 下一个时期按钮
        navigationButtons[1].addEventListener('click', () => {
            if (currentEraIndex < timelineEras.length - 1) {
                currentEraIndex++;
                updateActiveEra();
            }
        });
        
        // 时期点击事件
        timelineEras.forEach((era, index) => {
            era.addEventListener('click', () => {
                currentEraIndex = index;
                updateActiveEra();
            });
        });
        
        // 更新活动时期
        function updateActiveEra() {
            // 更新时期高亮
            timelineEras.forEach(era => era.classList.remove('active'));
            timelineEras[currentEraIndex].classList.add('active');
            
            // 更新导航信息
            const eraLabelZh = timelineEras[currentEraIndex].querySelector('.era-label .zh').textContent;
            const eraLabelEn = timelineEras[currentEraIndex].querySelector('.era-label .en').textContent;
            
            // 模拟不同时期的年代范围
            const eraDates = [
                {zh: '史前时期 (约公元前8000年-前2070年)', en: 'Prehistoric Period (ca. 8000-2070 BC)'},
                {zh: '夏商周时期 (约公元前2070年-前221年)', en: 'Xia-Shang-Zhou Period (ca. 2070-221 BC)'},
                {zh: '秦汉时期 (公元前221年-公元220年)', en: 'Qin-Han Period (221 BC-220 AD)'},
                {zh: '隋唐时期 (公元581年-907年)', en: 'Sui-Tang Period (581-907 AD)'},
                {zh: '宋元时期 (公元960年-1368年)', en: 'Song-Yuan Period (960-1368 AD)'},
                {zh: '明清时期 (公元1368年-1912年)', en: 'Ming-Qing Period (1368-1912 AD)'},
                {zh: '近现代 (公元1912年至今)', en: 'Modern Period (1912-Present)'}
            ];
            
            const navigationInfoZh = document.querySelector('.navigation-info.zh');
            const navigationInfoEn = document.querySelector('.navigation-info.en');
            
            if (navigationInfoZh && navigationInfoEn) {
                navigationInfoZh.textContent = eraDates[currentEraIndex].zh;
                navigationInfoEn.textContent = eraDates[currentEraIndex].en;
            }
            
            // 通知
            showNotification(`已切换到${eraLabelZh}时期`, 'info');
            
            // 更新时间轴上显示的节点
            updateVisibleTimelineNodes();
        }
        
        // 更新可见的时间轴节点
        function updateVisibleTimelineNodes() {
            // 这里可以根据当前选中的时期，显示/隐藏相应的节点
            // 现在简单模拟这个效果
            const eraLeftPosition = [10, 25, 45, 65, 80, 90, 95]; // 时期的大致位置百分比
            const timelineNodes = document.querySelectorAll('.timeline-node');
            
            timelineNodes.forEach(node => {
                const nodeLeft = parseFloat(node.style.left);
                
                // 简单判断节点是否应该在当前时期显示
                // 实际应用中可以使用具体的时间数据来判断
                const lowerBound = currentEraIndex > 0 ? eraLeftPosition[currentEraIndex - 1] : 0;
                const upperBound = currentEraIndex < eraLeftPosition.length - 1 ? eraLeftPosition[currentEraIndex + 1] : 100;
                
                if (nodeLeft >= lowerBound && nodeLeft <= upperBound) {
                    node.style.display = 'block';
                } else {
                    node.style.display = 'none';
                }
            });
        }
    }
    
    // 绑定节点点击事件
    bindTimelineNodeEvents();
}

/**
 * 应用时间轴缩放
 * @param {number} level - 缩放级别
 */
function applyTimelineZoom(level) {
    const timelineItems = document.querySelector('.timeline-items');
    
    if (!timelineItems) return;
    
    // 缩放效果，基础高度为300px，最大可以放大到700px
    const newHeight = 300 + level * 40;
    timelineItems.style.height = `${newHeight}px`;
    
    // 通知
    showNotification(`时间轴缩放级别: ${level}`, 'info');
}

/**
 * 绑定时间轴节点点击事件
 */
function bindTimelineNodeEvents() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    timelineNodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeTitle = node.querySelector('.node-title .zh').textContent;
            
            // 显示文化元素详情卡片
            showElementCard(nodeTitle, node.getAttribute('data-category'));
        });
    });
}

/**
 * 初始化地图视图功能
 */
function initMapView() {
    // 地图标记点点击事件
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const markerLabel = marker.querySelector('.marker-label .zh').textContent;
            
            // 显示地点信息面板
            showLocationInfo(markerLabel);
        });
    });
    
    // 信息面板关闭按钮
    const closeInfoBtn = document.querySelector('.map-info-panel .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoPanel = document.querySelector('.map-info-panel');
            
            if (infoPanel) {
                infoPanel.style.display = 'none';
            }
        });
    }
}

/**
 * 显示地点信息
 * @param {string} location - 地点名称
 */
function showLocationInfo(location) {
    const infoPanel = document.querySelector('.map-info-panel');
    const infoItems = document.querySelectorAll('.info-item');
    
    if (!infoPanel || infoItems.length === 0) return;
    
    // 显示信息面板
    infoPanel.style.display = 'block';
    
    // 根据地点名称匹配相应的信息项
    let found = false;
    
    infoItems.forEach(item => {
        const itemLocation = item.getAttribute('data-location');
        
        if (itemLocation && (itemLocation === location.toLowerCase() || itemLocation.includes(location.toLowerCase()))) {
            // 显示匹配的信息项
            infoItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            found = true;
        }
    });
    
    // 如果没有找到匹配的信息项，使用第一个作为默认
    if (!found && infoItems.length > 0) {
        infoItems.forEach(i => i.classList.remove('active'));
        infoItems[0].classList.add('active');
    }
    
    // 通知
    showNotification(`正在查看: ${location}`, 'info');
}

/**
 * 初始化关系图视图功能
 */
function initRelationView() {
    // 信息框关闭按钮
    const closeInfoBtn = document.querySelector('.graph-info-box .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoBox = document.querySelector('.graph-info-box');
            
            if (infoBox) {
                infoBox.style.display = 'none';
            }
        });
    }
    
    // 关系图点击（使用占位图像模拟）
    const graphPlaceholder = document.querySelector('.graph-placeholder');
    
    if (graphPlaceholder) {
        graphPlaceholder.addEventListener('click', event => {
            // 获取点击位置相对于图像的坐标
            const rect = graphPlaceholder.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // 显示信息框
            showGraphInfo(x, y);
        });
    }
}

/**
 * 显示关系图信息
 * @param {number} x - 点击X坐标
 * @param {number} y - 点击Y坐标
 */
function showGraphInfo(x, y) {
    const infoBox = document.querySelector('.graph-info-box');
    
    if (!infoBox) return;
    
    // 显示信息框
    infoBox.style.display = 'block';
    
    // 通知
    showNotification('已选择关系图元素', 'info');
}

/**
 * 初始化文化元素卡片功能
 */
function initElementCard() {
    // 卡片关闭按钮
    const closeCardBtn = document.querySelector('.culture-element-card .close-card-btn');
    
    if (closeCardBtn) {
        closeCardBtn.addEventListener('click', () => {
            hideElementCard();
        });
    }
    
    // 卡片操作按钮
    const elementBtns = document.querySelectorAll('.element-actions .element-btn');
    
    elementBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const btnText = btn.querySelector('.zh').textContent;
            showNotification(`执行操作: ${btnText}`, 'info');
        });
    });
    
    // 相关元素标签点击
    const elementTags = document.querySelectorAll('.element-tags li');
    
    elementTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.querySelector('.zh').textContent;
            showNotification(`正在查看: ${tagText}`, 'info');
            
            // 模拟加载新的元素详情
            setTimeout(() => {
                showElementCard(tagText);
            }, 500);
        });
    });
}

/**
 * 显示文化元素详情卡片
 * @param {string} elementName - 元素名称
 * @param {string} category - 元素类别
 */
function showElementCard(elementName, category = 'material') {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 更新卡片类别
    const elementCategory = elementCard.querySelector('.element-category');
    
    if (elementCategory) {
        // 移除之前的类别
        elementCategory.classList.remove('material', 'institutional', 'spiritual');
        
        // 添加新的类别
        elementCategory.classList.add(category);
        
        // 更新类别文本
        const categoryTextZh = elementCategory.querySelector('.zh');
        const categoryTextEn = elementCategory.querySelector('.en');
        
        if (categoryTextZh && categoryTextEn) {
            switch (category) {
                case 'material':
                    categoryTextZh.textContent = '物质文化';
                    categoryTextEn.textContent = 'Material Culture';
                    break;
                case 'institutional':
                    categoryTextZh.textContent = '制度文化';
                    categoryTextEn.textContent = 'Institutional Culture';
                    break;
                case 'spiritual':
                    categoryTextZh.textContent = '精神文化';
                    categoryTextEn.textContent = 'Spiritual Culture';
                    break;
            }
        }
    }
    
    // 显示卡片
    elementCard.classList.add('show');
    
    // 通知
    showNotification(`正在查看文化元素: ${elementName}`, 'info');
}

/**
 * 隐藏文化元素详情卡片
 */
function hideElementCard() {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 隐藏卡片
    elementCard.classList.remove('show');
}

/**
 * 初始化内容生成弹窗
 * 处理内容生成弹窗的打开、关闭和交互
 */
function initContentGenerateModal() {
    const modal = document.getElementById('contentGenerateModal');
    const openBtn = document.querySelector('.action-button:nth-child(2)'); // 内容生成按钮
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const generateBtn = modal.querySelector('.generate-btn');
    const tabBtns = modal.querySelectorAll('.generate-tab-btn');
    const tabContents = modal.querySelectorAll('.generate-tab-content');
    const styleBtns = modal.querySelectorAll('.style-btn');
    const sizeBtns = modal.querySelectorAll('.size-btn');
    
    // 打开弹窗
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    }
    
    // 关闭弹窗
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
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
            
            // 模拟生成过程
            setTimeout(() => {
                resultPlaceholder.style.display = 'none';
                
                if (activeTab.id === 'text2text-content') {
                    // 文生文结果
                    const generatedText = activeTab.querySelector('.generated-text');
                    generatedText.style.display = 'block';
                    generatedText.innerHTML = `<h3>中国传统绘画的特点与技法</h3>
<p>中国传统绘画是中华文明的重要组成部分，具有悠久的历史和独特的艺术魅力。以下从几个方面介绍中国传统绘画的主要特点与技法：</p>

<h4>一、中国传统绘画的特点</h4>

<p>1. <strong>以线造型</strong>：中国画以线条为主要表现手段，讲究"线条用笔"，通过不同的线条变化来表现物象的形态和质感。</p>

<p>2. <strong>写意精神</strong>：强调艺术家的主观表达，不追求对客观对象的完全模仿，而是追求"神似"而非"形似"。</p>

<p>3. <strong>虚实结合</strong>：画面中有意识地留白，使实与虚、有与无相互映衬，达到"虚实相生"的艺术效果。</p>

<p>4. <strong>诗书画印结合</strong>：中国画常与诗文、书法、印章相结合，形成独特的综合艺术形式。</p>

<h4>二、主要技法</h4>

<p>1. <strong>用笔技法</strong>：</p>
<ul>
    <li>钩勒：以线条勾画轮廓</li>
    <li>皴法：表现山石纹理的技法</li>
    <li>点法：用笔尖点画，表现叶、花等</li>
    <li>擦法：用侧锋轻擦，表现烟云等</li>
</ul>

<p>2. <strong>用墨技法</strong>：</p>
<ul>
    <li>焦墨：墨色浓重</li>
    <li>浓墨：墨色较重</li>
    <li>淡墨：墨色较淡</li>
    <li>破墨：墨色深浅相间</li>
    <li>渴墨：干笔擦出的效果</li>
</ul>

<p>3. <strong>设色技法</strong>：</p>
<ul>
    <li>工笔重彩：精细描绘，色彩浓重</li>
    <li>淡彩：颜色淡雅</li>
    <li>水墨渲染：水墨晕染效果</li>
    <li>泼墨泼彩：随意挥洒墨与彩</li>
</ul>

<h4>三、主要流派</h4>

<p>1. <strong>北宋山水画</strong>：以范宽、郭熙、李成为代表，追求雄伟壮丽的山水风貌。</p>

<p>2. <strong>南宋院体画</strong>：以马远、夏圭为代表，形成"马一角"、"夏半边"的构图特点。</p>

<p>3. <strong>元代文人画</strong>：以黄公望、吴镇、倪瓒、王蒙"元四家"为代表，重视个人情感表达。</p>

<p>4. <strong>明清写意画</strong>：以徐渭、八大山人、石涛等为代表，笔墨更加随意奔放。</p>

<p>通过学习和掌握这些特点与技法，可以更好地理解和欣赏中国传统绘画的艺术魅力，也为创作实践提供参考和指导。</p>`;
                } else {
                    // 文生图结果
                    const generatedImages = activeTab.querySelector('.generated-images');
                    generatedImages.style.display = 'flex';
                    generatedImages.innerHTML = `
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=中国山水画" alt="生成的图像1">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=青山绿水" alt="生成的图像2">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=亭台楼阁" alt="生成的图像3">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=飞鸟山水" alt="生成的图像4">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                    `;
                    
                    // 给生成的图片添加悬停效果和按钮功能
                    const imageActions = document.querySelectorAll('.image-actions button');
                    imageActions.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            showNotification('图片操作成功', 'success');
                        });
                    });
                }
                
                // 添加结果操作按钮事件
                const actionBtns = activeTab.querySelectorAll('.result-action-btn');
                actionBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (btn.classList.contains('regenerate')) {
                            showNotification('正在重新生成内容...', 'info');
                        } else if (btn.classList.contains('copy')) {
                            showNotification('内容已复制到剪贴板', 'success');
                        } else if (btn.classList.contains('download')) {
                            showNotification('图片已下载', 'success');
                        } else if (btn.classList.contains('insert')) {
                            showNotification('内容已插入到课件', 'success');
                            closeModal();
                        }
                    });
                });
                
            }, 2000);
        });
    }
}

/**
 * 处理标签切换，包括隐藏生成的题目列表
 */
function initTabSwitching() {
    // 标签按钮点击事件
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动标签
            tabBtns.forEach(tb => tb.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // 激活目标标签
            this.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
            
            // 隐藏生成的题目列表，除非是在 quiz 标签中
            const generatedQuestionsList = document.querySelector('.generated-questions-list');
            if (generatedQuestionsList) {
                if (targetTab === 'quiz') {
                    // 只有在生成过题目后才显示题目列表
                    const quizResult = document.querySelector('.quiz-result');
                    if (quizResult && window.getComputedStyle(quizResult).display !== 'none') {
                        generatedQuestionsList.style.display = 'block';
                    } else {
                        generatedQuestionsList.style.display = 'none';
                    }
                } else {
                    generatedQuestionsList.style.display = 'none';
                }
            }
        });
    });
}

/**
 * 初始化内容区域功能
 */
function initContentSections() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitles = document.querySelectorAll('.current-page-title');
    
    // 在页面加载时隐藏生成的题目列表
    const generatedQuestionsList = document.querySelector('.generated-questions-list');
    if (generatedQuestionsList) {
        generatedQuestionsList.style.display = 'none';
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 更新导航项目状态
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // 更新页面标题
            const sectionName = this.querySelector('.nav-text.zh').textContent;
            pageTitles.forEach(title => {
                if (title.classList.contains('zh')) {
                    title.textContent = sectionName;
                } else {
                    title.textContent = this.querySelector('.nav-text.en').textContent;
                }
            });
            
            // 更新内容部分
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('id') === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
            
            // 隐藏生成的题目列表（如果不在相关部分）
            if (generatedQuestionsList) {
                generatedQuestionsList.style.display = 'none';
            }
        });
    });
}

/**
 * 初始化课程思政功能
 */
function initIdeology() {
    // 思政案例生成按钮
    const ideologyGenerateBtn = document.querySelector('.ideology-generation .generate-btn');
    
    if (ideologyGenerateBtn) {
        ideologyGenerateBtn.addEventListener('click', function() {
            showNotification('正在生成思政案例...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                // 获取表单内容
                const themeInput = document.querySelector('.ideology-generation .prompt-input.zh');
                const caseType = document.querySelector('.ideology-generation .ideology-select:first-of-type');
                const caseLength = document.querySelector('.ideology-generation .ideology-select:last-of-type');
                
                // 生成案例内容（这里是示例内容）
                let generatedCase = '';
                if (themeInput && themeInput.value) {
                    const theme = themeInput.value;
                    const type = caseType ? caseType.options[caseType.selectedIndex].text : '故事型案例';
                    const length = caseLength ? caseLength.options[caseLength.selectedIndex].text : '中等';
                    
                    generatedCase = `【${type}】关于"${theme}"的思政案例\n\n`;
                    generatedCase += `这是一个${length}的思政案例示例，主题围绕"${theme}"展开。\n\n`;
                    generatedCase += `在中华优秀传统文化的传承与创新中，"${theme}"始终是一个重要的思想内核。`;
                    generatedCase += `本案例通过具体的历史事件和现代案例，深入阐述了"${theme}"在当代中国发展中的重要意义。`;
                    generatedCase += `学生通过学习本案例，可以更好地理解中华文化的精髓，增强文化自信。`;
                } else {
                    generatedCase = '请先输入思政案例主题...';
                }
                
                // 更新结果区域
                const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
                if (caseTextarea) {
                    caseTextarea.value = generatedCase;
                }
                
                // 显示结果区域
                const ideologyResult = document.querySelector('.ideology-result');
                if (ideologyResult) {
                    ideologyResult.style.display = 'block';
                }
                
                showNotification('思政案例生成成功！', 'success');
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.ideology-result .result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span.zh').textContent;
            const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
            
            switch (action) {
                case '编辑':
                    if (caseTextarea) {
                        caseTextarea.readOnly = false;
                        caseTextarea.focus();
                        showNotification('您可以编辑思政案例内容', 'info');
                    }
                    break;
                    
                case '复制':
                    if (caseTextarea) {
                        caseTextarea.select();
                        document.execCommand('copy');
                        showNotification('案例内容已复制到剪贴板', 'success');
                    }
                    break;
                    
                case '重新生成':
                    showNotification('正在重新生成案例...', 'info');
                    document.querySelector('.ideology-generation .generate-btn').click();
                    break;
            }
        });
    });
}

// 新建思政案例功能
document.addEventListener('DOMContentLoaded', function() {
    const createCaseBtn = document.getElementById('createCaseBtn');
    const createCaseModal = document.getElementById('createCaseModal');
    const closeBtn = createCaseModal.querySelector('.close-btn');
    const cancelBtn = createCaseModal.querySelector('.btn-cancel');
    const saveBtn = document.getElementById('saveNewCaseBtn');
    
    // 打开模态框
    createCaseBtn.addEventListener('click', function() {
        createCaseModal.classList.add('active');
    });
    
    // 关闭模态框
    function closeModal() {
        createCaseModal.classList.remove('active');
        // 清空表单
        document.getElementById('caseTitleInput').value = '';
        document.getElementById('caseContentInput').value = '';
        // 重置复选框
        const checkboxes = document.querySelectorAll('input[name="resourceType"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 保存新案例
    saveBtn.addEventListener('click', function() {
        const title = document.getElementById('caseTitleInput').value.trim();
        const content = document.getElementById('caseContentInput').value.trim();
        const selectedResources = [];
        
        document.querySelectorAll('input[name="resourceType"]:checked').forEach(checkbox => {
            selectedResources.push(checkbox.value);
        });
        
        if (title === '') {
            alert('请输入案例标题');
            return;
        }
        
        if (content === '') {
            alert('请输入案例内容');
            return;
        }
        
        // 这里可以添加保存逻辑，如API调用或本地存储
        
        // 模拟添加到列表
        addNewCaseToList(title, selectedResources);
        
        // 关闭模态框
        closeModal();
    });
    
    // 添加新案例到列表
    function addNewCaseToList(title, resources) {
        const casesTable = document.querySelector('.cases-table tbody');
        const rowCount = casesTable.querySelectorAll('tr').length + 1;
        
        const newRow = document.createElement('tr');
        
        // 创建序号单元格
        const numCell = document.createElement('td');
        numCell.textContent = rowCount;
        
        // 创建标题单元格
        const titleCell = document.createElement('td');
        const zhTitle = document.createElement('p');
        zhTitle.className = 'zh';
        zhTitle.textContent = title;
        const enTitle = document.createElement('p');
        enTitle.className = 'en';
        enTitle.textContent = title; // 在实际应用中可能需要翻译
        titleCell.appendChild(zhTitle);
        titleCell.appendChild(enTitle);
        
        // 创建资源标签单元格
        const resourceCell = document.createElement('td');
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'resource-tags';
        
        resources.forEach(resource => {
            const tagSpan = document.createElement('span');
            tagSpan.className = `resource-tag ${resource}`;
            const icon = document.createElement('i');
            
            if (resource === 'image') {
                icon.className = 'fas fa-image';
            } else if (resource === 'video') {
                icon.className = 'fas fa-video';
            } else if (resource === 'link') {
                icon.className = 'fas fa-link';
            }
            
            tagSpan.appendChild(icon);
            tagsDiv.appendChild(tagSpan);
        });
        
        resourceCell.appendChild(tagsDiv);
        
        // 创建操作按钮单元格
        const actionCell = document.createElement('td');
        
        const viewBtn = document.createElement('button');
        viewBtn.className = 'case-action-btn view';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'case-action-btn edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'case-action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        actionCell.appendChild(viewBtn);
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        
        // 将所有单元格添加到行
        newRow.appendChild(numCell);
        newRow.appendChild(titleCell);
        newRow.appendChild(resourceCell);
        newRow.appendChild(actionCell);
        
        // 将行添加到表格
        casesTable.appendChild(newRow);
    }
}); 

// 全屏功能
function initFullscreenButton() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            editorContent.classList.toggle('fullscreen');
            
            // 切换全屏按钮图标
            const icon = fullscreenBtn.querySelector('i');
            if (editorContent.classList.contains('fullscreen')) {
                icon.classList.remove('fa-expand');
                icon.classList.add('fa-compress');
            } else {
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
        
        // ESC键退出全屏
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && editorContent.classList.contains('fullscreen')) {
                editorContent.classList.remove('fullscreen');
                const icon = fullscreenBtn.querySelector('i');
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
    }
}

// 在页面加载完成后初始化全屏按钮
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initFullscreenButton();
}); 

// 二维码弹窗功能
function initQrcodeModal() {
    // 更新选择器，确保准确找到签到二维码按钮
    const qrcodeBtn = document.querySelector('.panel-btn:not(.group-action-btn)');
    const qrcodeModal = document.getElementById('qrcodeModal');
    
    // 如果找不到相关元素，直接返回
    if (!qrcodeBtn || !qrcodeModal) {
        console.warn('签到二维码相关元素未找到');
        return;
    }
    
    const closeBtn = qrcodeModal.querySelector('.close-btn');
    const refreshBtn = qrcodeModal.querySelector('.refresh-btn');
    const downloadBtn = qrcodeModal.querySelector('.download-btn');
    
    // 确保二维码弹窗默认隐藏
    qrcodeModal.style.display = 'none';
    qrcodeModal.classList.remove('show');
    
    // 显示二维码弹窗
    qrcodeBtn.addEventListener('click', function() {
        qrcodeModal.style.display = 'flex';
        setTimeout(() => {
            qrcodeModal.classList.add('show');
        }, 10);
        generateQRCode();
        showNotification('二维码已生成，有效期5分钟', 'success');
    });
    
    // 关闭二维码弹窗
    closeBtn.addEventListener('click', function() {
        qrcodeModal.classList.remove('show');
        setTimeout(() => {
            qrcodeModal.style.display = 'none';
        }, 300);
    });
    
    // 点击弹窗外部关闭
    qrcodeModal.addEventListener('click', function(e) {
        if (e.target === qrcodeModal) {
            qrcodeModal.classList.remove('show');
            setTimeout(() => {
                qrcodeModal.style.display = 'none';
            }, 300);
        }
    });
    
    // 刷新二维码
    refreshBtn.addEventListener('click', function() {
        generateQRCode();
        showNotification('二维码已刷新，有效期重置为5分钟', 'info');
    });
    
    // 下载二维码
    downloadBtn.addEventListener('click', function() {
        // 获取二维码图片
        const qrImg = document.getElementById('checkinQRCode');
        
        // 创建一个临时链接
        const a = document.createElement('a');
        a.href = qrImg.src;
        a.download = '签到二维码.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('二维码已下载', 'success');
    });
}

// 模拟生成二维码的功能
function generateQRCode() {
    // 实际应用中，这里应该调用后端API生成真实的二维码
    // 此处仅做演示，随机更新二维码图片
    const qrImg = document.getElementById('checkinQRCode');
    const randomId = Math.floor(Math.random() * 1000);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=checkin_session_${randomId}`;
}

// 在文档加载完成后初始化二维码功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化其他功能...
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
}); 

// 初始化替换课件模态框
function initReplaceCoursewareModal() {
    // 此功能已移除
}

/**
 * 中国文化人工智能课程平台 - 教师端
 * 主脚本文件
 */

// 在文件顶部，DOMContentLoaded事件监听器之前添加标记变量
// 全局变量，用于跟踪按钮是否已经绑定事件
let contentGenBtnInitialized = false;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航系统
    initNavigation();
    
    // 初始化语言切换
    initLanguageToggle();
    
    // 初始化章节模态框
    initChapterModal();
    
    // 初始化章节卡片交互
    initChapterCards();
    
    // 更新当前日期显示
    updateCurrentDate();
    
    // 初始化内容生成弹窗
    initContentGenerateModal();
    
    // 初始化AI助教-课前部分
    initAIPre();
    
    // 初始化AI助教-课中部分
    initAIInClass();
    
    // 初始化章节滑动功能
    initChapterSlider();
    
    // 初始化课程思政和实训任务部分
    initIdeologyAndPractice();
    
    // 初始化最新动态过滤功能
    initActivityFilters();
    
    // 初始化学情画像部分
    initStudentProfile();
    
    // 初始化中国文化演化部分
    initCultureEvolution();
    
    // 初始化一键生成功能
    initOneClickGeneration();
    
    // 初始化各个模块
    initContentSections();
    initTabSwitching();
    initQuizGenerator();
    initKnowledgeExpansion(); // 添加知识拓展初始化
    // ... 其他初始化函数
    
    // 在页面加载时隐藏知识拓展列表
    const knowledgeExpansionList = document.querySelector('.knowledge-expansion-list');
    if (knowledgeExpansionList) {
        knowledgeExpansionList.style.display = 'none';
    }
    
    // 设置默认激活的标签
    const defaultTabBtn = document.querySelector('.tab-btn[data-tab="courseware"]');
    if (defaultTabBtn) {
        defaultTabBtn.click();
    }
    
    initIdeology(); // 初始化思政功能
    
    // 全屏功能
    initFullscreenButton();
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
    
    // 初始化课程思政多媒体标签页和案例/讨论题切换功能
    initIdeologyMediaTabs();
    
    initMediaTabs();
    initCaseNavigation();
    initDiscussionNavigation();
    initClassSelection(); // 初始化班级选择功能
    
    // 初始化课后总结部分
    initPostClass();
    
    // 知识图谱功能
    initKnowledgeGraph();
    
    // 获取章节列表数据
    fetchChapters();
    
    // 直接调用更新课程统计数据
    updateCourseStatsCount();
    
    // 新建章节按钮点击事件
    document.getElementById('newChapterBtn').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.add('active');
    });
    
    // 关闭模态框按钮点击事件
    document.getElementById('closeNewChapterModal').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 取消按钮点击事件
    document.getElementById('cancelNewChapter').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 提交表单事件
    document.getElementById('submitNewChapter').addEventListener('click', () => {
        submitNewChapter();
    });
    
    // 文件上传预览
    document.getElementById('coverImage').addEventListener('change', (e) => {
        const fileInput = e.target;
        const filePreview = fileInput.parentElement.querySelector('.file-preview');
        
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            reader.readAsDataURL(fileInput.files[0]);
            
            // 这里应该上传文件到服务器，然后获取文件路径
            // 简化处理：假设上传成功并返回路径
            document.getElementById('coverImagePath').value = `../picture/uploads/${fileInput.files[0].name}`;
        }
    });
    
    // 初始化PPTist iframe集成
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
            document.getElementById(sectionId).classList.add('active');
            
            // 更新页面标题
            const navTextZh = this.querySelector('.nav-text.zh').textContent;
            const navTextEn = this.querySelector('.nav-text.en').textContent;
            pageTitleZh.textContent = navTextZh;
            pageTitleEn.textContent = navTextEn;
            
            // 添加动态效果
            animateContentChange(document.getElementById(sectionId));
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
 * 处理打开和关闭模态框的交互
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
    
    // 确认按钮
    confirmBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 模拟创建章节
            const titleInputZh = modal.querySelector('.form-input.zh');
            const titleInputEn = modal.querySelector('.form-input.en');
            
            if (titleInputZh.value.trim() !== '' || titleInputEn.value.trim() !== '') {
                showNotification('章节创建成功！', 'success');
                closeModal();
                
                // 这里可以添加实际创建章节的代码
            } else {
                showNotification('请填写章节标题', 'warning');
            }
        });
    });
    
    // 文件上传预览
    const fileInputs = modal.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileCount = this.files.length;
            const filePreview = this.closest('.form-group').querySelector('.uploaded-files');
            
            if (filePreview) {
                const textZh = filePreview.querySelector('.zh');
                const textEn = filePreview.querySelector('.en');
                
                if (textZh) textZh.textContent = `已上传: ${fileCount} 个文件`;
                if (textEn) textEn.textContent = `Uploaded: ${fileCount} files`;
            }
        });
    });
}

/**
 * 初始化章节卡片交互
 * 添加章节卡片上的按钮点击事件
 */
function initChapterCards() {
    const editBtns = document.querySelectorAll('.chapter-action-btn.edit');
    const prepareBtns = document.querySelectorAll('.chapter-action-btn.prepare');
    const teachBtns = document.querySelectorAll('.chapter-action-btn.teach');
    
    // 编辑按钮
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            showNotification(`正在编辑${chapterTitle}...`, 'info');
            // 这里可以添加实际的编辑功能
        });
    });
    
    // 备课按钮
    prepareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取章节信息
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            const chapterTitleEn = chapterCard.querySelector('.chapter-title.en').textContent;
            
            // 提取章节序号（从标题中获取第X章）
            const chapterMatch = chapterTitle.match(/第(\d+)章/);
            if (chapterMatch && chapterMatch[1]) {
                const chapterNumber = chapterMatch[1];
                
                // 切换到AI助教-课前界面
                const aiPreNavItem = document.querySelector('.nav-item[data-section="ai-pre"]');
                if (aiPreNavItem) {
                    // 触发点击事件，切换到AI助教-课前界面
                    aiPreNavItem.click();
                    
                    // 延迟一下，等待界面切换完成后设置章节选择器的值
                    setTimeout(() => {
                        // 设置章节选择器
                        const chapterSelect = document.getElementById('chapter-select');
                        if (chapterSelect) {
                            // 查找对应章节的选项
                            const options = chapterSelect.options;
                            for (let i = 0; i < options.length; i++) {
                                if (options[i].value === chapterNumber) {
                                    chapterSelect.selectedIndex = i;
                                    // 手动触发变更事件
                                    const event = new Event('change');
                                    chapterSelect.dispatchEvent(event);
                                    break;
                                }
                            }
                        }
                        
                        showNotification(`正在准备${chapterTitle}的课前内容...`, 'success');
                    }, 300);
                }
            } else {
                showNotification(`无法确定章节编号，请手动选择章节`, 'warning');
            }
        });
    });
    
    // 上课按钮
    teachBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            
            // 切换到"AI助教-课中"界面
            const aiInNavItem = document.querySelector('.nav-item[data-section="ai-in"]');
            if (aiInNavItem) {
                aiInNavItem.click();
                
                showNotification(`开始${chapterTitle}的课堂教学`, 'success');
            }
        });
    });
    
    // 整个卡片点击事件
    const chapterCards = document.querySelectorAll('.chapter-card');
    chapterCards.forEach(card => {
        card.addEventListener('click', function() {
            const chapterTitle = this.querySelector('.chapter-title.zh').textContent;
            showNotification(`查看章节详情: ${chapterTitle}`, 'info');
            
            // 这里可以添加显示章节详情的代码
        });
    });
}

/**
 * 为内容区域添加切换动画
 * @param {HTMLElement} section - 要添加动画的内容区域
 */
function animateContentChange(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    }, 50);
}

/**
 * 创建通知提示
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (success, warning, error, info)
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 添加图标
    const icon = document.createElement('i');
    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            icon.className = 'fas fa-times-circle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    // 添加消息文本
    const text = document.createElement('span');
    text.textContent = message;
    
    // 添加关闭按钮
    const closeBtn = document.createElement('i');
    closeBtn.className = 'fas fa-times close-notification';
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 组装通知元素
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加进入动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动消失
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * 当前日期显示
 * 更新首页欢迎横幅中的日期显示
 */
function updateCurrentDate() {
    const dateElementZh = document.getElementById('current-date-zh');
    const dateElementEn = document.getElementById('current-date-en');
    
    if (dateElementZh && dateElementEn) {
        const now = new Date();
        
        // 中文日期格式
        const zhOptions = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
        let zhDate = now.toLocaleDateString('zh-CN', zhOptions);
        // 进一步格式化中文日期，确保格式为：2023年3月23日 星期四
        zhDate = zhDate.replace(/\//g, '年') + '日';
        zhDate = zhDate.replace(/年(\d+)年/, '年$1月');
        zhDate = zhDate.replace(/星期(.+)日/, '星期$1'); // 去掉星期后面的"日"字
        dateElementZh.textContent = `今天是 ${zhDate}`; // 删除平台口号
        
        // 英文日期格式
        const enOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElementEn.textContent = `Today is ${now.toLocaleDateString('en-US', enOptions)}`;
    }
}

/**
 * 初始化AI助教-课前部分
 */
function initAIPre() {
    // 初始化标签页切换
    initAIPreTabs();
    
    // 初始化课件设计
    initCoursewareDesign();
    
    // 初始化小测题目导航
    initQuizNavigation();
    
    // 初始化可缩放思维导图
    initZoomableMindmap();
    
    // 初始化章节选择器
    initChapterSelector();
}

/**
 * 初始化AI助教-课前选项卡切换
 */
function initAIPreTabs() {
    const tabBtns = document.querySelectorAll('.ai-pre-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.ai-pre-tabs .tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有选项卡的活动状态
            tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
            
            // 为当前点击的选项卡添加活动状态
            this.classList.add('active');
            
            // 获取要显示的内容区域的ID
            const contentId = this.getAttribute('data-tab') + '-content';
            
            // 隐藏所有内容区域
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 显示对应的内容区域
            document.getElementById(contentId).classList.add('active');
            
            // 添加动态效果
            animateTabContentChange(document.getElementById(contentId));
        });
    });
}

/**
 * 初始化课件设计功能
 */
function initCoursewareDesign() {
    const coursewareContent = document.getElementById('courseware-content');
    if (!coursewareContent) return;

    const actionButtons = coursewareContent.querySelectorAll('.action-button');
    const genBtn = actionButtons[0]; // 内容生成按钮是第一个按钮
    const replaceBtn = actionButtons[1]; // 替换课件按钮是第二个按钮
    
    // 内容生成按钮初始化
    if (genBtn && !contentGenBtnInitialized) {
        // 先移除可能已经存在的所有点击事件处理器
        const newGenBtn = genBtn.cloneNode(true);
        genBtn.parentNode.replaceChild(newGenBtn, genBtn);
        
        // 为新的按钮添加单一事件监听器
        newGenBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            // 显示内容生成模态框
            const modal = document.getElementById('contentGenerateModal');
            if (modal) {
                modal.classList.add('active');
            }
        });
        
        contentGenBtnInitialized = true;
        console.log("内容生成按钮已初始化");
    }
    
    // 替换课件按钮初始化
    if (replaceBtn) {
        // 先移除可能已经存在的所有点击事件处理器
        const newReplaceBtn = replaceBtn.cloneNode(true);
        replaceBtn.parentNode.replaceChild(newReplaceBtn, replaceBtn);
        
        // 为新的按钮添加单一事件监听器
        newReplaceBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            
            // 显示替换课件弹窗
            showReplaceCoursewareModal();
        });
        
        console.log("替换课件按钮已初始化");
    }
    
    // 幻灯片缩略图交互
    const thumbnails = coursewareContent.querySelectorAll('.thumbnail-item');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 显示替换课件模态框
    function showReplaceCoursewareModal() {
        // 创建模态框
        let modal = document.getElementById('replaceCoursewareModal');
        
        // 如果模态框不存在，创建一个新的
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'replaceCoursewareModal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="zh">替换课件</h3>
                        <h3 class="en">Replace Courseware</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="file-upload-section">
                            <div class="upload-instructions">
                                <p class="zh">请选择要上传的课件文件，支持PPT、PPTX或PDF格式</p>
                                <p class="en">Please select courseware file to upload, supports PPT, PPTX or PDF formats</p>
                            </div>
                            <div class="file-upload-large">
                                <div class="file-preview-large">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p class="zh">拖放文件到此处或点击上传</p>
                                    <p class="en">Drag and drop files here or click to upload</p>
                                    <p class="file-types zh">支持的格式: PPT, PPTX, PDF</p>
                                    <p class="file-types en">Supported formats: PPT, PPTX, PDF</p>
                                </div>
                                <input type="file" class="file-input" accept=".ppt,.pptx,.pdf">
                            </div>
                            <div class="uploaded-files">
                                <h4 class="zh">已选择文件</h4>
                                <h4 class="en">Selected Files</h4>
                                <div class="no-file-selected">
                                    <p class="zh">未选择任何文件</p>
                                    <p class="en">No file selected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel">
                            <span class="zh">取消</span>
                            <span class="en">Cancel</span>
                        </button>
                        <button class="btn-confirm">
                            <span class="zh">替换</span>
                            <span class="en">Replace</span>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 关闭按钮
            const closeBtn = modal.querySelector('.close-btn');
            const cancelBtn = modal.querySelector('.btn-cancel');
            
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            cancelBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            // 文件上传功能
            const fileInput = modal.querySelector('.file-input');
            const uploadArea = modal.querySelector('.file-preview-large');
            const noFileSelected = modal.querySelector('.no-file-selected');
            const uploadedFiles = modal.querySelector('.uploaded-files');
            
            // 文件上传区域点击触发文件选择
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            // 监听文件选择变化
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    
                    // 处理已选择的文件
                    noFileSelected.style.display = 'none';
                    
                    // 移除旧的文件详情
                    const oldFileDetails = uploadedFiles.querySelector('.file-details');
                    if (oldFileDetails) {
                        oldFileDetails.remove();
                    }
                    
                    // 创建文件详情显示
                    const fileDetails = document.createElement('div');
                    fileDetails.className = 'file-details';
                    
                    // 根据文件类型显示不同的图标
                    let fileIcon = 'fa-file';
                    if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
                        fileIcon = 'fa-file-powerpoint';
                    } else if (file.name.endsWith('.pdf')) {
                        fileIcon = 'fa-file-pdf';
                    }
                    
                    // 计算文件大小显示
                    let fileSize = (file.size / 1024).toFixed(2) + ' KB';
                    if (file.size > 1024 * 1024) {
                        fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                    }
                    
                    fileDetails.innerHTML = `
                        <div class="file-icon"><i class="fas ${fileIcon}"></i></div>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${fileSize}</div>
                        </div>
                        <button class="remove-file-btn"><i class="fas fa-times"></i></button>
                    `;
                    
                    uploadedFiles.appendChild(fileDetails);
                    
                    // 添加删除文件的按钮事件
                    const removeBtn = fileDetails.querySelector('.remove-file-btn');
                    removeBtn.addEventListener('click', () => {
                        fileInput.value = '';
                        fileDetails.remove();
                        noFileSelected.style.display = 'block';
                    });
                }
            });
            
            // 拖放功能
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    fileInput.files = e.dataTransfer.files;
                    
                    // 触发change事件以更新UI
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            });
            
            // 替换按钮点击事件
            const confirmBtn = modal.querySelector('.btn-confirm');
            confirmBtn.addEventListener('click', () => {
                if (fileInput.files.length > 0) {
                    showNotification('课件替换成功', 'success');
                    modal.classList.remove('active');
                } else {
                    showNotification('请选择一个文件', 'warning');
                }
            });
        }
        
        // 显示模态框
        modal.classList.add('active');
    }
    
    // 全屏按钮功能
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                // 进入全屏 - 整个编辑器区域
                if (editorContent.requestFullscreen) {
                    editorContent.requestFullscreen();
                } else if (editorContent.mozRequestFullScreen) { // Firefox
                    editorContent.mozRequestFullScreen();
                } else if (editorContent.webkitRequestFullscreen) { // Chrome, Safari, Opera
                    editorContent.webkitRequestFullscreen();
                } else if (editorContent.msRequestFullscreen) { // IE/Edge
                    editorContent.msRequestFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenBtn.title = "退出全屏";
            } else {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        });
        
        // 监听全屏变化事件
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement && 
                !document.msFullscreenElement) {
                // 退出全屏
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        }
    }
}

/**
 * 初始化课堂小测功能
 */
function initQuizGenerator() {
    // 题型选择
    const quizTypes = document.querySelectorAll('.quiz-type');
    
    quizTypes.forEach(type => {
        type.addEventListener('click', function() {
            quizTypes.forEach(qt => qt.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换题型的逻辑
        });
    });
    
    // 生成方式选择
    const optionBtns = document.querySelectorAll('.option-btn');
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换生成方式的逻辑
        });
    });
    
    // 难度滑块
    const difficultySlider = document.getElementById('difficulty-slider');
    
    if (difficultySlider) {
        difficultySlider.addEventListener('input', function() {
            // 这里可以添加难度调整的逻辑
        });
    }
    
    // 生成按钮
    const generateBtn = document.querySelector('.generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            showNotification('正在生成题目...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                showNotification('题目生成成功！', 'success');
                
                // 显示题目结果和生成的题目列表
                const quizResult = document.querySelector('.quiz-result');
                const generatedQuestionsList = document.querySelector('.generated-questions-list');
                
                if (quizResult) {
                    quizResult.style.display = 'block';
                }
                
                if (generatedQuestionsList) {
                    // 清除之前的动画
                    generatedQuestionsList.classList.remove('visible');
                    
                    // 显示列表
                    generatedQuestionsList.style.display = 'block';
                    
                    // 触发重绘
                    void generatedQuestionsList.offsetWidth;
                    
                    // 添加动画类
                    generatedQuestionsList.classList.add('visible');
                    
                    // 滚动到题目列表
                    setTimeout(() => {
                        generatedQuestionsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
                
                // 这里可以添加实际的题目生成逻辑
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 这里可以添加结果操作逻辑（编辑、保存、重新生成等）
        });
    });
}

/**
 * 初始化知识拓展功能
 */
function initKnowledgeExpansion() {
    // 文化按钮选择
    const cultureBtns = document.querySelectorAll('.culture-btn');
    
    cultureBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cultureBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换文化类型的逻辑
        });
    });
    
    // 生成按钮
    const generateBtn = document.querySelector('.knowledge-generation .generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
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
 * 初始化思维导图的缩放和拖动功能
 * 使用鼠标中键滚动实现缩放，按住中键拖动实现平移
 */
function initZoomableMindmap() {
    // 在文档加载完毕后或在AI助教-课中页面初始化时调用
    document.addEventListener('DOMContentLoaded', setupMindmapZoom);
    // 也可以在切换到相应页面时初始化
    const aiInClassNav = document.querySelector('.nav-item[data-section="ai-in"]');
    if (aiInClassNav) {
        aiInClassNav.addEventListener('click', setupMindmapZoom);
    }
    
    function setupMindmapZoom() {
        const mindmapContainer = document.getElementById('zoomable-mindmap');
        if (!mindmapContainer) return;
        
        let scale = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;
        
        // 设置初始状态
        updateMindmapTransform();
        
        // 滚动缩放功能 - 不需要按住中键，直接滚动即可缩放
        mindmapContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const zoomSensitivity = 0.1;
            const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
            
            // 计算缩放的鼠标位置
            const rect = mindmapContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 更新缩放比例
            const newScale = Math.max(0.5, Math.min(3, scale + delta));
            
            // 根据鼠标位置计算新的平移值以保持鼠标下方的点不变
            if (scale !== newScale) {
                const scaleRatio = newScale / scale;
                translateX = mouseX - scaleRatio * (mouseX - translateX);
                translateY = mouseY - scaleRatio * (mouseY - translateY);
                scale = newScale;
                
                updateMindmapTransform();
            }
        });
        
        // 中键拖动功能
        mindmapContainer.addEventListener('mousedown', function(e) {
            // 检查是否是中键按下
            if (e.button === 1) {
                e.preventDefault();
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                
                // 改变鼠标指针样式
                mindmapContainer.style.cursor = 'grabbing';
            }
        });
        
        // 处理拖动移动
        window.addEventListener('mousemove', function(e) {
            if (isDragging) {
                e.preventDefault();
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateMindmapTransform();
            }
        });
        
        // 处理拖动结束
        window.addEventListener('mouseup', function(e) {
            if (isDragging && e.button === 1) {
                isDragging = false;
                mindmapContainer.style.cursor = 'default';
            }
        });
        
        // 更新思维导图的变换
        function updateMindmapTransform() {
            if (!mindmapContainer) return;
            mindmapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            mindmapContainer.style.transformOrigin = 'center';
            mindmapContainer.style.transition = isDragging ? 'none' : 'transform 0.2s ease-out';
        }
    }
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
 * 初始化章节滑动功能
 * 处理章节列表的水平滚动和导航按钮
 */
function initChapterSlider() {
    const chapterList = document.querySelector('.chapters-container');
    if (!chapterList) return;

    const prevBtn = document.querySelector('.chapter-nav-btn.prev-btn');
    const nextBtn = document.querySelector('.chapter-nav-btn.next-btn');
    
    if (!prevBtn || !nextBtn) return;
    
    // 初始状态下禁用上一页按钮
    prevBtn.classList.add('disabled');
    prevBtn.style.opacity = '0.5';
    prevBtn.style.cursor = 'not-allowed';
    
    // 卡片容器可见宽度
    const containerWidth = chapterList.offsetWidth;
    // 总内容宽度
    const scrollWidth = chapterList.scrollWidth;
    
    // 检查是否有溢出内容需要滚动
    if (scrollWidth <= containerWidth) {
        nextBtn.classList.add('disabled');
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
        return; // 如果没有滚动内容，不需要继续设置
    }

    // 设置滚动距离
    let cardWidth = 500; // 更新默认卡片宽度（包含外边距）
    const chapterCard = document.querySelector('.chapter-card');
    if (chapterCard) {
        cardWidth = chapterCard.offsetWidth + 20; // 加上外边距
    }
    const cardGap = 30; // 卡片之间的间距
    const scrollDistance = cardWidth + cardGap;

    // 更新按钮状态的函数
    function updateButtonStates() {
        if (!chapterList) return;
        
        const scrollPosition = chapterList.scrollLeft;
        const maxScroll = scrollWidth - containerWidth;
        
        // 根据滚动位置启用/禁用按钮
        if (scrollPosition <= 5) { // 添加少量容差
            prevBtn.classList.add('disabled');
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (scrollPosition >= maxScroll - 5) { // 添加容差值
            nextBtn.classList.add('disabled');
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    // 添加按钮点击事件
    prevBtn.addEventListener('click', function() {
        if (!prevBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    nextBtn.addEventListener('click', function() {
        if (!nextBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    // 监听滚动事件更新按钮状态
    chapterList.addEventListener('scroll', updateButtonStates);
    
    // 初始化按钮状态
    updateButtonStates();
    
    // 确保初始状态下正确设置按钮状态
    setTimeout(updateButtonStates, 100);
}

// 添加课程思政和实训任务部分的交互
function initIdeologyAndPractice() {
    // 思政部分多媒体上传选项切换
    const uploadOptions = document.querySelectorAll('.upload-option');
    if (uploadOptions.length > 0) {
        uploadOptions.forEach(option => {
            option.addEventListener('click', () => {
                uploadOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    // 实训任务选项卡切换
    const practiceTabs = document.querySelectorAll('.practice-tab');
    const practiceContents = document.querySelectorAll('.practice-content');
    
    if (practiceTabs.length > 0) {
        practiceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-practice-tab');
                
                // 更新选项卡状态
                practiceTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 更新内容显示
                practiceContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}-content`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // 虚拟角色选择
    const roleTypes = document.querySelectorAll('.role-type');
    if (roleTypes.length > 0) {
        roleTypes.forEach(role => {
            role.addEventListener('click', () => {
                roleTypes.forEach(r => r.classList.remove('active'));
                role.classList.add('active');
            });
        });
    }

    // 为生成按钮添加点击效果
    const generateButtons = document.querySelectorAll('.generate-btn');
    if (generateButtons.length > 0) {
        generateButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 模拟生成中状态
                const originalText = btn.innerHTML;
                btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span class="zh">生成中...</span><span class="en">Generating...</span>`;
                btn.disabled = true;
                
                // 模拟生成过程
                setTimeout(() => {
                    // 恢复按钮状态
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    
                    // 显示成功通知
                    showNotification('内容已成功生成！', 'success');
                    
                    // 刷新预览区域，这里可以根据实际需求进行更多处理
                    // 此处仅作为示例
                }, 1500);
            });
        });
    }
}

// 初始化最新动态过滤功能
function initActivityFilters() {
    const filterItems = document.querySelectorAll('.filter-item');
    const activityItems = document.querySelectorAll('.activity-item');
    
    if (filterItems.length > 0) {
        filterItems.forEach(item => {
            item.addEventListener('click', () => {
                // 更新过滤器样式
                filterItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const filterType = item.getAttribute('data-filter');
                
                // 显示/隐藏活动项
                activityItems.forEach(activity => {
                    if (filterType === 'all' || activity.classList.contains(filterType)) {
                        activity.style.display = 'flex';
                    } else {
                        activity.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // 查看更多按钮功能
    const moreBtn = document.querySelector('.more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            // 这里可以实现查看更多功能，例如加载更多活动或跳转到活动页面
            showNotification('加载更多动态...', 'info');
        });
    }
}

/**
 * 初始化AI助教-课中部分
 * 处理AI助教-课中部分的交互功能
 */
function initAIInClass() {
    // 初始化控制面板切换
    initClassroomControlPanel();
    
    // 初始化签到分组功能
    initCheckInAndGrouping();
    
    // 初始化课件展示功能
    initSlidesDisplay();
    
    // 初始化互动功能
    initClassInteraction();
    
    // 初始化课堂数据分析
    initClassDataAnalysis();
}

/**
 * 初始化课堂控制面板
 */
function initClassroomControlPanel() {
    const controlItems = document.querySelectorAll('.control-item');
    const classroomPanels = document.querySelectorAll('.classroom-panel');
    
    if (controlItems.length === 0 || classroomPanels.length === 0) return;
    
    controlItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 移除所有控制项的活动状态
            controlItems.forEach(i => i.classList.remove('active'));
            // 为当前点击的控制项添加活动状态
            item.classList.add('active');
            
            // 隐藏所有面板
            classroomPanels.forEach(panel => panel.classList.remove('active'));
            // 显示对应的面板
            if (index < classroomPanels.length) {
                classroomPanels[index].classList.add('active');
            }
        });
    });
    
    // 课堂计时器功能
    const pauseBtn = document.querySelector('.class-status .control-btn:nth-child(3)');
    const stopBtn = document.querySelector('.class-status .control-btn:nth-child(4)');
    const timeDisplay = document.querySelector('.class-time');
    const statusBadge = document.querySelector('.status-badge');
    
    if (pauseBtn && stopBtn && timeDisplay && statusBadge) {
        let isPaused = false;
        let classTime = 0; // 秒数
        let timerInterval;
        
        // 初始化计时器
        function startTimer() {
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    classTime++;
                    updateTimeDisplay();
                }
            }, 1000);
        }
        
        // 更新时间显示
        function updateTimeDisplay() {
            const hours = Math.floor(classTime / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((classTime % 3600) / 60).toString().padStart(2, '0');
            const seconds = (classTime % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // 暂停/继续按钮
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            
            if (isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂已暂停</span><span class="en">Class Paused</span>';
                statusBadge.classList.remove('active');
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂进行中</span><span class="en">Class in Progress</span>';
                statusBadge.classList.add('active');
            }
        });
        
        // 停止按钮
        stopBtn.addEventListener('click', () => {
            if (confirm('确定要结束当前课堂吗？')) {
                clearInterval(timerInterval);
                showNotification('课堂已结束', 'success');
                
                // 模拟导航到课后页面
                setTimeout(() => {
                    const aiPostNav = document.querySelector('.nav-item[data-section="ai-post"]');
                    if (aiPostNav) {
                        aiPostNav.click();
                    }
                }, 1500);
            }
        });
        
        // 启动计时器
        startTimer();
    }
}

/**
 * 初始化签到分组功能
 */
function initCheckInAndGrouping() {
    // 获取DOM元素
    const groupCountInput = document.getElementById('groupCount');
    const peoplePerGroupInput = document.getElementById('peoplePerGroup');
    const groupingMethodSelect = document.getElementById('groupingMethod');
    const groupBtn = document.querySelector('.panel-btn.group-action-btn');
    const groupList = document.querySelector('.group-list');
    
    // 签到二维码按钮
    const qrCodeBtn = document.querySelector('.panel-actions .panel-btn:not(.group-action-btn)');
    if (qrCodeBtn) {
        qrCodeBtn.addEventListener('click', () => {
            showNotification('签到二维码已显示', 'info');
        });
    }
    
    // 添加不同颜色样式到按钮
    if (groupBtn) {
        groupBtn.classList.add('primary-action');
    }
    
    // 数量增减控制
    function initNumberInput(input) {
        if (!input) return;
        
        const decreaseBtn = input.parentElement.querySelector('.decrease');
        const increaseBtn = input.parentElement.querySelector('.increase');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value > parseInt(input.min)) {
                    input.value = value - 1;
                    updateGroupSettings();
                }
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value < parseInt(input.max)) {
                    input.value = value + 1;
                    updateGroupSettings();
                }
            });
        }
        
        // 输入框值变化时更新
        input.addEventListener('change', updateGroupSettings);
    }
    
    // 初始化数量输入框
    initNumberInput(groupCountInput);
    initNumberInput(peoplePerGroupInput);
    
    // 更新分组设置
    function updateGroupSettings() {
        const totalStudents = 78; // 已签到学生数
        const groupCount = parseInt(groupCountInput.value);
        const peoplePerGroup = parseInt(peoplePerGroupInput.value);
        
        // 检查设置是否合理
        if (groupCount * peoplePerGroup > totalStudents) {
            showNotification('当前设置超出总人数,请调整', 'warning');
            return false;
        }
        
        return true;
    }
    
    // 分组按钮点击事件
    if (groupBtn) {
        groupBtn.addEventListener('click', () => {
            if (!updateGroupSettings()) return;
            
            const groupCount = parseInt(groupCountInput.value);
            const peoplePerGroup = parseInt(peoplePerGroupInput.value);
            const groupingMethod = groupingMethodSelect.value;
            
            // 生成模拟学生数据
            const students = generateMockStudents();
            
            // 根据不同方式分组
            const groups = groupStudents(students, groupCount, peoplePerGroup, groupingMethod);
            
            // 显示分组结果
            displayGroups(groups);
        });
    }
    
    // 生成模拟学生数据
    function generateMockStudents() {
        const names = ['张明', '李华', '王芳', '刘伟', '陈晓', '赵阳', '钱宇', '孙丽', '周红', '吴勇', 
                      '郑军', '冯敏', '陈刚', '徐静', '杨光', '朱峰', '秦莉', '许涛', '潘婷', '马超'];
        
        return Array.from({length: 78}, (_, i) => ({
            id: i + 1,
            name: names[i % names.length] + (Math.floor(i / names.length) + 1),
            grade: Math.floor(Math.random() * 40) + 60, // 60-100分
            activity: Math.floor(Math.random() * 100) // 0-100活跃度
        }));
    }
    
    // 根据不同方式分组
    function groupStudents(students, groupCount, peoplePerGroup, method) {
        let groupedStudents = [];
        
        switch (method) {
            case 'balanced': // 成绩均衡
                students.sort((a, b) => b.grade - a.grade);
                break;
            case 'activity': // 活跃度均衡
                students.sort((a, b) => b.activity - a.activity);
                break;
            default: // 随机
                students.sort(() => Math.random() - 0.5);
        }
        
        // 创建分组
        for (let i = 0; i < groupCount; i++) {
            groupedStudents.push([]);
        }
        
        // 蛇形分配,确保每组能力均衡
        let groupIndex = 0;
        let direction = 1;
        
        students.forEach((student, index) => {
            if (groupedStudents[groupIndex].length < peoplePerGroup) {
                groupedStudents[groupIndex].push(student);
            }
            
            groupIndex += direction;
            
            if (groupIndex >= groupCount - 1) {
                direction = -1;
            } else if (groupIndex <= 0) {
                direction = 1;
            }
        });
        
        return groupedStudents;
    }
    
    // 显示分组结果
    function displayGroups(groups) {
        if (!groupList) return;
        
        groupList.innerHTML = '';
        
        groups.forEach((group, index) => {
            if (group.length === 0) return;
            
            const groupItem = document.createElement('div');
            groupItem.className = 'group-item';
            
            groupItem.innerHTML = `
                <div class="group-header">
                    <h4 class="zh">第${index + 1}组 (${group.length}人)</h4>
                    <h4 class="en">Group ${index + 1} (${group.length} Students)</h4>
                    <div class="group-actions">
                        <button class="group-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="group-btn">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </div>
                <div class="student-tags">
                    ${group.slice(0, 5).map(student => `
                        <span class="student-tag" title="成绩:${student.grade} 活跃度:${student.activity}">
                            ${student.name}
                        </span>
                    `).join('')}
                    ${group.length > 5 ? `<span class="student-tag">+${group.length - 5}</span>` : ''}
                </div>
            `;
            
            // 添加编辑和消息按钮事件
            const editBtn = groupItem.querySelector('.group-btn:nth-child(1)');
            const messageBtn = groupItem.querySelector('.group-btn:nth-child(2)');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showNotification(`正在编辑第${index + 1}组`, 'info');
                });
            }
            
            if (messageBtn) {
                messageBtn.addEventListener('click', () => {
                    showNotification(`已向第${index + 1}组发送消息`, 'success');
                });
            }
            
            groupList.appendChild(groupItem);
        });
        
        showNotification('分组完成', 'success');
    }
}

/**
 * 初始化课件展示功能
 */
function initSlidesDisplay() {
    // 幻灯片控制按钮
    const prevSlideBtn = document.querySelector('.slide-control-btn:nth-child(1)');
    const playSlideBtn = document.querySelector('.slide-control-btn:nth-child(2)');
    const nextSlideBtn = document.querySelector('.slide-control-btn:nth-child(3)');
    const slideCounter = document.querySelector('.slide-counter');
    
    if (prevSlideBtn && playSlideBtn && nextSlideBtn && slideCounter) {
        let currentSlide = 15;
        const totalSlides = 45;
        let isPlaying = false;
        let slideInterval;
        
        // 上一张幻灯片
        prevSlideBtn.addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                updateSlideDisplay();
            }
        });
        
        // 播放/暂停幻灯片
        playSlideBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playSlideBtn.innerHTML = '<i class="fas fa-pause"></i>';
                slideInterval = setInterval(() => {
                    if (currentSlide < totalSlides) {
                        currentSlide++;
                        updateSlideDisplay();
                    } else {
                        clearInterval(slideInterval);
                        isPlaying = false;
                        playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }, 3000);
            } else {
                playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                clearInterval(slideInterval);
            }
        });
        
        // 下一张幻灯片
        nextSlideBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlideDisplay();
            }
        });
        
        // 更新幻灯片显示
        function updateSlideDisplay() {
            slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
            
            // 这里可以添加切换幻灯片图片的逻辑
            const slideImg = document.querySelector('.current-slide');
            if (slideImg) {
                slideImg.style.opacity = '0';
                
                setTimeout(() => {
                    slideImg.style.opacity = '1';
                }, 300);
            }
            
            // 更新缩略图选中状态
            const thumbnails = document.querySelectorAll('.slide-thumbnail');
            if (thumbnails.length > 0) {
                thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
                
                // 假设缩略图的顺序与幻灯片顺序对应，选中当前幻灯片的缩略图
                // 由于示例中只有几个缩略图，这里只是模拟效果
                const idx = (currentSlide - 13) % thumbnails.length;
                if (idx >= 0 && idx < thumbnails.length) {
                    thumbnails[idx].classList.add('active');
                }
            }
        }
        
        // 缩略图点击事件
        const thumbnails = document.querySelectorAll('.slide-thumbnail');
        if (thumbnails.length > 0) {
            thumbnails.forEach((thumbnail, idx) => {
                thumbnail.addEventListener('click', () => {
                    // 修改: 避免读取不存在的元素
                    currentSlide = 13 + idx;
                    updateSlideDisplay();
                });
            });
        }
    }
    
    // 全屏和批注按钮
    const fullscreenBtn = document.querySelector('#slides-panel .panel-btn:nth-child(1)');
    const annotateBtn = document.querySelector('#slides-panel .panel-btn:nth-child(2)');
    const slidePreview = document.querySelector('.slide-preview');
    
    if (fullscreenBtn && annotateBtn && slidePreview) {
        fullscreenBtn.addEventListener('click', () => {
            toggleFullscreen();
        });
        
        annotateBtn.addEventListener('click', () => {
            showNotification('已启用批注模式', 'info');
        });
        
        // 全屏切换函数
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                slidePreview.requestFullscreen().catch(err => {
                    showNotification('全屏模式失败: ' + err.message, 'error');
                });
                slidePreview.classList.add('fullscreen');
            } else {
                document.exitFullscreen();
                slidePreview.classList.remove('fullscreen');
            }
        }
        
        // 全屏状态变化监听
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                slidePreview.classList.remove('fullscreen');
            }
        });
        
        // 初始化全屏互动工具
        initFullscreenInteractionTools();
    }
}

/**
 * 初始化全屏模式下的互动工具
 */
function initFullscreenInteractionTools() {
    const interactionTools = document.querySelectorAll('.fullscreen-tool');
    const interactionModal = document.getElementById('interaction-modal');
    const closeInteractionBtn = document.querySelector('.close-interaction-btn');
    
    // 互动工具点击事件
    if (interactionTools.length > 0) {
        interactionTools.forEach(tool => {
            tool.addEventListener('click', () => {
                if (document.fullscreenElement) {
                    // 先退出全屏，再显示互动弹窗
                    document.exitFullscreen().then(() => {
                        setTimeout(() => {
                            openInteractionModal(tool.getAttribute('data-interaction'));
                        }, 300);
                    });
                } else {
                    openInteractionModal(tool.getAttribute('data-interaction'));
                }
            });
        });
    }
    
    // 关闭互动弹窗
    if (closeInteractionBtn) {
        closeInteractionBtn.addEventListener('click', () => {
            interactionModal.classList.remove('active');
        });
    }
    
    // 初始化显示答案按钮事件
    initShowAnswerButtons();
    
    // 打开互动弹窗并显示对应内容
    function openInteractionModal(interactionType) {
        if (!interactionModal) return;
        
        // 隐藏所有互动内容区域
        const interactionSections = interactionModal.querySelectorAll('.interaction-section');
        interactionSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // 根据互动类型显示对应内容
        const targetSection = document.getElementById(`${interactionType}-interaction`);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // 更新弹窗标题
            const headerZh = interactionModal.querySelector('.interaction-header .zh');
            const headerEn = interactionModal.querySelector('.interaction-header .en');
            
            if (headerZh && headerEn) {
                if (interactionType === 'quiz') {
                    headerZh.textContent = '课堂小测';
                    headerEn.textContent = 'Quiz';
                    
                    // 初始化题目导航
                    setTimeout(() => {
                        initQuizNavigation();
                    }, 100);
                } else if (interactionType === 'knowledge') {
                    headerZh.textContent = '知识拓展';
                    headerEn.textContent = 'Knowledge Expansion';
                } else if (interactionType === 'ideology') {
                    headerZh.textContent = '课程思政';
                    headerEn.textContent = 'Ideological Discussion';
                }
            }
            
            // 重置答案显示状态
            const answerContainers = targetSection.querySelectorAll('.answer-container');
            const showAnswerBtns = targetSection.querySelectorAll('.show-answer-btn');
            
            answerContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            showAnswerBtns.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
            });
            
            interactionModal.classList.add('active');
        }
    }
}

/**
 * 初始化显示答案按钮事件
 */
function initShowAnswerButtons() {
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.show-answer-btn')) {
            const btn = e.target.closest('.show-answer-btn');
            const answerContainer = btn.nextElementSibling;
            
            if (answerContainer && answerContainer.classList.contains('answer-container')) {
                if (answerContainer.style.display === 'none') {
                    // 显示答案
                    answerContainer.style.display = 'block';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i><span class="zh">隐藏答案</span><span class="en">Hide Answer</span>';
                } else {
                    // 隐藏答案
                    answerContainer.style.display = 'none';
                    btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
                }
            }
        }
    });
}

/**
 * 初始化互动功能
 */
function initClassInteraction() {
    // 互动类型切换
    const interactionTypes = document.querySelectorAll('.interaction-type');
    
    if (interactionTypes.length > 0) {
        interactionTypes.forEach(type => {
            type.addEventListener('click', () => {
                interactionTypes.forEach(t => t.classList.remove('active'));
                type.classList.add('active');
                
                const typeName = type.querySelector('.zh').textContent;
                showNotification(`已切换到: ${typeName}`, 'info');
            });
        });
    }
    
    // 发起互动按钮
    const startInteractionBtn = document.querySelector('.panel-btn.primary');
    
    if (startInteractionBtn) {
        startInteractionBtn.addEventListener('click', () => {
            const activeType = document.querySelector('.interaction-type.active');
            if (activeType) {
                const typeName = activeType.querySelector('.zh').textContent;
                showNotification(`正在发起: ${typeName}`, 'success');
            }
        });
    }
    
    // 弹幕发送功能
    const danmakuInput = document.querySelector('.danmaku-input.zh');
    const sendDanmakuBtn = document.querySelector('.send-danmaku-btn');
    const danmakuScreen = document.querySelector('.danmaku-screen');
    const sentimentBtns = document.querySelectorAll('.sentiment-btn');
    
    if (danmakuInput && sendDanmakuBtn && danmakuScreen && sentimentBtns.length > 0) {
        // 情感按钮切换
        sentimentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sentimentBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // 发送弹幕
        function sendDanmaku() {
            const content = danmakuInput.value.trim();
            if (content) {
                const danmaku = document.createElement('div');
                danmaku.classList.add('danmaku-item');
                
                // 添加情感类型
                const activeSentiment = document.querySelector('.sentiment-btn.active');
                if (activeSentiment) {
                    if (activeSentiment.classList.contains('agree')) {
                        danmaku.classList.add('agree');
                    } else if (activeSentiment.classList.contains('disagree')) {
                        danmaku.classList.add('disagree');
                    }
                }
                
                danmaku.textContent = content;
                
                // 随机高度
                const top = Math.floor(Math.random() * 150) + 10;
                danmaku.style.top = `${top}px`;
                
                danmakuScreen.appendChild(danmaku);
                danmakuInput.value = '';
                
                // 弹幕动画结束后移除元素
                danmaku.addEventListener('animationend', () => {
                    danmaku.remove();
                });
            }
        }
        
        // 点击发送按钮
        sendDanmakuBtn.addEventListener('click', sendDanmaku);
        
        // 按下回车键发送
        danmakuInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendDanmaku();
            }
        });
        
        // 弹幕设置按钮
        const danmakuSettingBtns = document.querySelectorAll('.danmaku-setting-btn');
        
        if (danmakuSettingBtns.length >= 3) {
            // 设置按钮
            danmakuSettingBtns[0].addEventListener('click', () => {
                showNotification('弹幕设置已打开', 'info');
            });
            
            // 暂停/继续按钮
            let isPaused = false;
            danmakuSettingBtns[1].addEventListener('click', () => {
                isPaused = !isPaused;
                
                if (isPaused) {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-play"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'paused';
                    });
                    showNotification('弹幕已暂停', 'info');
                } else {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-pause"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'running';
                    });
                    showNotification('弹幕已继续', 'info');
                }
            });
            
            // 清空按钮
            danmakuSettingBtns[2].addEventListener('click', () => {
                danmakuScreen.innerHTML = '';
                showNotification('弹幕已清空', 'info');
            });
        }
    }
}

/**
 * 初始化课堂数据分析
 */
function initClassDataAnalysis() {
    // 导出数据按钮
    const exportDataBtn = document.querySelector('#class-data-panel .panel-btn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            showNotification('正在导出课堂数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('课堂数据已导出', 'success');
            }, 800);
        });
    }
    
    // 这里可以添加图表初始化代码，但由于示例中使用的是占位图像，暂不实现
}

/**
 * 初始化学情画像功能
 * 处理学生数据的筛选、排序、查询等交互功能
 */
function initStudentProfile() {
    // 初始化筛选功能
    initProfileFilters();
    
    // 初始化表格操作和分页功能
    initProfileTable();
    
    // 初始化搜索和批量操作功能
    initProfileSearch();
    
    // 初始化表格内操作按钮功能
    initTableActions();
}

/**
 * 初始化筛选功能
 */
function initProfileFilters() {
    const classSelect = document.getElementById('class-select');
    const dateFilter = document.querySelector('.filter-date');
    const filterBtn = document.querySelector('.filter-btn:not(.reset)');
    const resetBtn = document.querySelector('.filter-btn.reset');
    
    if (!classSelect || !dateFilter || !filterBtn || !resetBtn) return;
    
    // 筛选按钮点击事件
    filterBtn.addEventListener('click', () => {
        const selectedClass = classSelect.value;
        const selectedDate = dateFilter.value;
        
        // 模拟筛选操作
        showNotification('正在应用筛选条件...', 'info');
        
        // 这里可以添加实际的筛选逻辑，向后端发送请求等
        setTimeout(() => {
            let message = '';
            
            if (selectedClass !== 'all') {
                const classText = document.querySelector(`#class-select option[value="${selectedClass}"]`).textContent;
                const className = document.body.classList.contains('en-mode') ? 
                    classText.trim() : classText.trim();
                message += `班级: ${className}, `;
            }
            
            if (selectedDate) {
                const dateObj = new Date(selectedDate);
                const formattedDate = dateObj.toLocaleDateString();
                message += `截止日期: ${formattedDate}`;
            }
            
            if (message) {
                showNotification(`筛选已应用: ${message}`, 'success');
            } else {
                showNotification('筛选已应用', 'success');
            }
        }, 500);
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', () => {
        classSelect.value = 'all';
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateFilter.value = `${year}-${month}-${day}`;
        
        showNotification('筛选条件已重置', 'info');
    });
}

/**
 * 初始化表格操作和分页功能
 */
function initProfileTable() {
    const selectAll = document.getElementById('select-all');
    const studentCheckboxes = document.querySelectorAll('.student-checkbox');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const paginationSelect = document.querySelector('.pagination-select');
    
    if (!selectAll || studentCheckboxes.length === 0) return;
    
    // 全选/取消全选
    selectAll.addEventListener('change', () => {
        studentCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    });
    
    // 单个复选框更新全选状态
    studentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(studentCheckboxes).every(cb => cb.checked);
            const anyChecked = Array.from(studentCheckboxes).some(cb => cb.checked);
            
            selectAll.checked = allChecked;
            selectAll.indeterminate = anyChecked && !allChecked;
        });
    });
    
    // 分页按钮点击
    if (paginationBtns.length > 0) {
        paginationBtns.forEach(btn => {
            if (!btn.disabled && !btn.classList.contains('active')) {
                btn.addEventListener('click', () => {
                    // 获取页码
                    const page = btn.textContent;
                    if (!isNaN(page)) {
                        // 数字页码按钮
                        paginationBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        showNotification(`已切换到第 ${page} 页`, 'info');
                    } else if (btn.querySelector('i.fa-chevron-left')) {
                        // 上一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.previousElementSibling && 
                            activePage.previousElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.previousElementSibling.classList.add('active');
                            showNotification(`已切换到上一页`, 'info');
                        }
                    } else if (btn.querySelector('i.fa-chevron-right')) {
                        // 下一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.nextElementSibling && 
                            activePage.nextElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.nextElementSibling.classList.add('active');
                            showNotification(`已切换到下一页`, 'info');
                        }
                    }
                });
            }
        });
    }
    
    // 每页显示数量选择
    if (paginationSelect) {
        paginationSelect.addEventListener('change', () => {
            const perPage = paginationSelect.value;
            showNotification(`每页显示数量已更改为 ${perPage}`, 'info');
        });
    }
}

/**
 * 初始化搜索和批量操作功能
 */
function initProfileSearch() {
    const searchInputs = document.querySelectorAll('.profile-search .search-input');
    const exportBtn = document.querySelector('.action-btn.export');
    const batchBtn = document.querySelector('.action-btn.batch');
    
    // 搜索功能
    if (searchInputs.length > 0) {
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = input.value.trim();
                    if (searchTerm) {
                        showNotification(`正在搜索: ${searchTerm}`, 'info');
                        
                        // 这里可以添加实际的搜索逻辑
                        setTimeout(() => {
                            showNotification(`已找到与 "${searchTerm}" 相关的结果`, 'success');
                        }, 500);
                    }
                }
            });
        });
    }
    
    // 导出数据按钮
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showNotification('正在准备导出数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('数据已成功导出', 'success');
            }, 800);
        });
    }
    
    // 批量操作按钮
    if (batchBtn) {
        batchBtn.addEventListener('click', () => {
            const checkedStudents = document.querySelectorAll('.student-checkbox:checked');
            
            if (checkedStudents.length === 0) {
                showNotification('请先选择学生', 'warning');
                return;
            }
            
            showNotification(`已选择 ${checkedStudents.length} 名学生，准备批量操作`, 'info');
            
            // 这里可以添加实际的批量操作逻辑，例如显示操作菜单等
        });
    }
}

/**
 * 初始化表格内操作按钮功能
 */
function initTableActions() {
    const viewBtns = document.querySelectorAll('.table-btn.view');
    const gradeBtns = document.querySelectorAll('.table-btn.grade');
    const messageBtns = document.querySelectorAll('.table-btn.message');
    
    // 查看学生画像
    if (viewBtns.length > 0) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                const studentId = row.cells[2].textContent;
                
                showNotification(`查看学生画像: ${studentName} (${studentId})`, 'info');
                
                // 这里可以添加打开学生详情模态框的逻辑
            });
        });
    }
    
    // 批阅作业
    if (gradeBtns.length > 0) {
        gradeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`正在批阅 ${studentName} 的作业`, 'info');
                
                // 这里可以添加打开批阅界面的逻辑
            });
        });
    }
    
    // 发送消息
    if (messageBtns.length > 0) {
        messageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`发送消息给 ${studentName}`, 'info');
                
                // 这里可以添加打开消息对话框的逻辑
            });
        });
    }
}

/**
 * 初始化中国文化演化模块
 * 处理文化演化模块中的视图切换、交互等功能
 */
function initCultureEvolution() {
    // 初始化视图切换
    initViewModes();
    
    // 初始化时间轴功能
    initTimelineView();
    
    // 初始化地图视图功能
    initMapView();
    
    // 初始化关系图视图功能
    initRelationView();
    
    // 初始化文化元素卡片功能
    initElementCard();
}

/**
 * 初始化视图模式切换功能
 */
function initViewModes() {
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const evolutionViews = document.querySelectorAll('.evolution-view');
    
    if (viewModeBtns.length === 0 || evolutionViews.length === 0) return;
    
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的活动状态
            viewModeBtns.forEach(b => b.classList.remove('active'));
            // 为当前点击的按钮添加活动状态
            btn.classList.add('active');
            
            // 获取要显示的视图模式
            const viewMode = btn.getAttribute('data-mode');
            
            // 隐藏所有视图
            evolutionViews.forEach(view => view.classList.remove('active'));
            
            // 显示对应的视图
            document.querySelector(`.${viewMode}-view`).classList.add('active');
            
            // 视图切换通知
            const modeName = btn.querySelector('.zh').textContent;
            showNotification(`已切换到${modeName}视图`, 'info');
        });
    });
    
    // 类别和朝代筛选下拉框
    const filterSelects = document.querySelectorAll('.evolution-filters .filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            const filterType = select.querySelector('option:checked').classList.contains('zh') ? 
                select.previousElementSibling.querySelector('.zh').textContent : 
                select.previousElementSibling.querySelector('.en').textContent;
            
            const selectedValue = select.value;
            const selectedText = select.querySelector(`option[value="${selectedValue}"]`).textContent;
            
            showNotification(`已筛选${filterType}: ${selectedText}`, 'info');
            
            // 根据视图模式应用不同的筛选逻辑
            const activeView = document.querySelector('.evolution-view.active');
            
            if (activeView.classList.contains('timeline-view')) {
                applyTimelineFilter(selectedValue);
            } else if (activeView.classList.contains('map-view')) {
                applyMapFilter(selectedValue);
            } else if (activeView.classList.contains('relation-view')) {
                applyRelationFilter(selectedValue);
            }
        });
    });
}

/**
 * 应用时间轴视图筛选
 * @param {string} filter - 筛选条件
 */
function applyTimelineFilter(filter) {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    if (filter === 'all') {
        // 显示所有节点
        timelineNodes.forEach(node => {
            node.style.display = 'block';
        });
        return;
    }
    
    // 筛选节点
    timelineNodes.forEach(node => {
        // 检查节点是否符合筛选条件（类别或朝代）
        const nodeCategory = node.getAttribute('data-category');
        
        if (nodeCategory === filter) {
            node.style.display = 'block';
        } else {
            node.style.display = 'none';
        }
    });
}

/**
 * 应用地图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyMapFilter(filter) {
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    if (filter === 'all') {
        // 显示所有标记
        mapMarkers.forEach(marker => {
            marker.style.display = 'block';
        });
        return;
    }
    
    // 筛选标记
    mapMarkers.forEach(marker => {
        // 检查标记是否符合筛选条件（朝代）
        const markerEra = marker.getAttribute('data-era');
        
        if (markerEra === filter) {
            marker.style.display = 'block';
        } else {
            marker.style.display = 'none';
        }
    });
}

/**
 * 应用关系图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyRelationFilter(filter) {
    // 这里通常会与可视化库（如D3.js）集成
    // 目前仅显示通知
    showNotification(`关系图筛选已应用: ${filter}`, 'info');
}

/**
 * 初始化时间轴视图功能
 */
function initTimelineView() {
    // 缩放控制
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    const zoomSlider = document.querySelector('.zoom-slider input');
    
    if (zoomSlider) {
        // 缩放滑块
        zoomSlider.addEventListener('input', () => {
            const zoomLevel = zoomSlider.value;
            applyTimelineZoom(zoomLevel);
        });
        
        // 缩放按钮
        if (zoomButtons.length >= 2) {
            // 缩小按钮
            zoomButtons[0].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.max(1, currentZoom - 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
            
            // 放大按钮
            zoomButtons[1].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.min(10, currentZoom + 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
        }
    }
    
    // 时间轴导航
    const navigationButtons = document.querySelectorAll('.navigation-btn');
    const timelineEras = document.querySelectorAll('.timeline-era');
    let currentEraIndex = 2; // 默认选中"秦汉"时期
    
    if (navigationButtons.length >= 2 && timelineEras.length > 0) {
        // 上一个时期按钮
        navigationButtons[0].addEventListener('click', () => {
            if (currentEraIndex > 0) {
                currentEraIndex--;
                updateActiveEra();
            }
        });
        
        // 下一个时期按钮
        navigationButtons[1].addEventListener('click', () => {
            if (currentEraIndex < timelineEras.length - 1) {
                currentEraIndex++;
                updateActiveEra();
            }
        });
        
        // 时期点击事件
        timelineEras.forEach((era, index) => {
            era.addEventListener('click', () => {
                currentEraIndex = index;
                updateActiveEra();
            });
        });
        
        // 更新活动时期
        function updateActiveEra() {
            // 更新时期高亮
            timelineEras.forEach(era => era.classList.remove('active'));
            timelineEras[currentEraIndex].classList.add('active');
            
            // 更新导航信息
            const eraLabelZh = timelineEras[currentEraIndex].querySelector('.era-label .zh').textContent;
            const eraLabelEn = timelineEras[currentEraIndex].querySelector('.era-label .en').textContent;
            
            // 模拟不同时期的年代范围
            const eraDates = [
                {zh: '史前时期 (约公元前8000年-前2070年)', en: 'Prehistoric Period (ca. 8000-2070 BC)'},
                {zh: '夏商周时期 (约公元前2070年-前221年)', en: 'Xia-Shang-Zhou Period (ca. 2070-221 BC)'},
                {zh: '秦汉时期 (公元前221年-公元220年)', en: 'Qin-Han Period (221 BC-220 AD)'},
                {zh: '隋唐时期 (公元581年-907年)', en: 'Sui-Tang Period (581-907 AD)'},
                {zh: '宋元时期 (公元960年-1368年)', en: 'Song-Yuan Period (960-1368 AD)'},
                {zh: '明清时期 (公元1368年-1912年)', en: 'Ming-Qing Period (1368-1912 AD)'},
                {zh: '近现代 (公元1912年至今)', en: 'Modern Period (1912-Present)'}
            ];
            
            const navigationInfoZh = document.querySelector('.navigation-info.zh');
            const navigationInfoEn = document.querySelector('.navigation-info.en');
            
            if (navigationInfoZh && navigationInfoEn) {
                navigationInfoZh.textContent = eraDates[currentEraIndex].zh;
                navigationInfoEn.textContent = eraDates[currentEraIndex].en;
            }
            
            // 通知
            showNotification(`已切换到${eraLabelZh}时期`, 'info');
            
            // 更新时间轴上显示的节点
            updateVisibleTimelineNodes();
        }
        
        // 更新可见的时间轴节点
        function updateVisibleTimelineNodes() {
            // 这里可以根据当前选中的时期，显示/隐藏相应的节点
            // 现在简单模拟这个效果
            const eraLeftPosition = [10, 25, 45, 65, 80, 90, 95]; // 时期的大致位置百分比
            const timelineNodes = document.querySelectorAll('.timeline-node');
            
            timelineNodes.forEach(node => {
                const nodeLeft = parseFloat(node.style.left);
                
                // 简单判断节点是否应该在当前时期显示
                // 实际应用中可以使用具体的时间数据来判断
                const lowerBound = currentEraIndex > 0 ? eraLeftPosition[currentEraIndex - 1] : 0;
                const upperBound = currentEraIndex < eraLeftPosition.length - 1 ? eraLeftPosition[currentEraIndex + 1] : 100;
                
                if (nodeLeft >= lowerBound && nodeLeft <= upperBound) {
                    node.style.display = 'block';
                } else {
                    node.style.display = 'none';
                }
            });
        }
    }
    
    // 绑定节点点击事件
    bindTimelineNodeEvents();
}

/**
 * 应用时间轴缩放
 * @param {number} level - 缩放级别
 */
function applyTimelineZoom(level) {
    const timelineItems = document.querySelector('.timeline-items');
    
    if (!timelineItems) return;
    
    // 缩放效果，基础高度为300px，最大可以放大到700px
    const newHeight = 300 + level * 40;
    timelineItems.style.height = `${newHeight}px`;
    
    // 通知
    showNotification(`时间轴缩放级别: ${level}`, 'info');
}

/**
 * 绑定时间轴节点点击事件
 */
function bindTimelineNodeEvents() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    timelineNodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeTitle = node.querySelector('.node-title .zh').textContent;
            
            // 显示文化元素详情卡片
            showElementCard(nodeTitle, node.getAttribute('data-category'));
        });
    });
}

/**
 * 初始化地图视图功能
 */
function initMapView() {
    // 地图标记点点击事件
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const markerLabel = marker.querySelector('.marker-label .zh').textContent;
            
            // 显示地点信息面板
            showLocationInfo(markerLabel);
        });
    });
    
    // 信息面板关闭按钮
    const closeInfoBtn = document.querySelector('.map-info-panel .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoPanel = document.querySelector('.map-info-panel');
            
            if (infoPanel) {
                infoPanel.style.display = 'none';
            }
        });
    }
}

/**
 * 显示地点信息
 * @param {string} location - 地点名称
 */
function showLocationInfo(location) {
    const infoPanel = document.querySelector('.map-info-panel');
    const infoItems = document.querySelectorAll('.info-item');
    
    if (!infoPanel || infoItems.length === 0) return;
    
    // 显示信息面板
    infoPanel.style.display = 'block';
    
    // 根据地点名称匹配相应的信息项
    let found = false;
    
    infoItems.forEach(item => {
        const itemLocation = item.getAttribute('data-location');
        
        if (itemLocation && (itemLocation === location.toLowerCase() || itemLocation.includes(location.toLowerCase()))) {
            // 显示匹配的信息项
            infoItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            found = true;
        }
    });
    
    // 如果没有找到匹配的信息项，使用第一个作为默认
    if (!found && infoItems.length > 0) {
        infoItems.forEach(i => i.classList.remove('active'));
        infoItems[0].classList.add('active');
    }
    
    // 通知
    showNotification(`正在查看: ${location}`, 'info');
}

/**
 * 初始化关系图视图功能
 */
function initRelationView() {
    // 信息框关闭按钮
    const closeInfoBtn = document.querySelector('.graph-info-box .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoBox = document.querySelector('.graph-info-box');
            
            if (infoBox) {
                infoBox.style.display = 'none';
            }
        });
    }
    
    // 关系图点击（使用占位图像模拟）
    const graphPlaceholder = document.querySelector('.graph-placeholder');
    
    if (graphPlaceholder) {
        graphPlaceholder.addEventListener('click', event => {
            // 获取点击位置相对于图像的坐标
            const rect = graphPlaceholder.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // 显示信息框
            showGraphInfo(x, y);
        });
    }
}

/**
 * 显示关系图信息
 * @param {number} x - 点击X坐标
 * @param {number} y - 点击Y坐标
 */
function showGraphInfo(x, y) {
    const infoBox = document.querySelector('.graph-info-box');
    
    if (!infoBox) return;
    
    // 显示信息框
    infoBox.style.display = 'block';
    
    // 通知
    showNotification('已选择关系图元素', 'info');
}

/**
 * 初始化文化元素卡片功能
 */
function initElementCard() {
    // 卡片关闭按钮
    const closeCardBtn = document.querySelector('.culture-element-card .close-card-btn');
    
    if (closeCardBtn) {
        closeCardBtn.addEventListener('click', () => {
            hideElementCard();
        });
    }
    
    // 卡片操作按钮
    const elementBtns = document.querySelectorAll('.element-actions .element-btn');
    
    elementBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const btnText = btn.querySelector('.zh').textContent;
            showNotification(`执行操作: ${btnText}`, 'info');
        });
    });
    
    // 相关元素标签点击
    const elementTags = document.querySelectorAll('.element-tags li');
    
    elementTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.querySelector('.zh').textContent;
            showNotification(`正在查看: ${tagText}`, 'info');
            
            // 模拟加载新的元素详情
            setTimeout(() => {
                showElementCard(tagText);
            }, 500);
        });
    });
}

/**
 * 显示文化元素详情卡片
 * @param {string} elementName - 元素名称
 * @param {string} category - 元素类别
 */
function showElementCard(elementName, category = 'material') {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 更新卡片类别
    const elementCategory = elementCard.querySelector('.element-category');
    
    if (elementCategory) {
        // 移除之前的类别
        elementCategory.classList.remove('material', 'institutional', 'spiritual');
        
        // 添加新的类别
        elementCategory.classList.add(category);
        
        // 更新类别文本
        const categoryTextZh = elementCategory.querySelector('.zh');
        const categoryTextEn = elementCategory.querySelector('.en');
        
        if (categoryTextZh && categoryTextEn) {
            switch (category) {
                case 'material':
                    categoryTextZh.textContent = '物质文化';
                    categoryTextEn.textContent = 'Material Culture';
                    break;
                case 'institutional':
                    categoryTextZh.textContent = '制度文化';
                    categoryTextEn.textContent = 'Institutional Culture';
                    break;
                case 'spiritual':
                    categoryTextZh.textContent = '精神文化';
                    categoryTextEn.textContent = 'Spiritual Culture';
                    break;
            }
        }
    }
    
    // 显示卡片
    elementCard.classList.add('show');
    
    // 通知
    showNotification(`正在查看文化元素: ${elementName}`, 'info');
}

/**
 * 隐藏文化元素详情卡片
 */
function hideElementCard() {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 隐藏卡片
    elementCard.classList.remove('show');
}

/**
 * 初始化内容生成弹窗
 * 处理内容生成弹窗的打开、关闭和交互
 */
function initContentGenerateModal() {
    const modal = document.getElementById('contentGenerateModal');
    const openBtn = document.querySelector('.action-button:nth-child(2)'); // 内容生成按钮
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const generateBtn = modal.querySelector('.generate-btn');
    const tabBtns = modal.querySelectorAll('.generate-tab-btn');
    const tabContents = modal.querySelectorAll('.generate-tab-content');
    const styleBtns = modal.querySelectorAll('.style-btn');
    const sizeBtns = modal.querySelectorAll('.size-btn');
    
    // 打开弹窗
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    }
    
    // 关闭弹窗
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
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
            
            // 模拟生成过程
            setTimeout(() => {
                resultPlaceholder.style.display = 'none';
                
                if (activeTab.id === 'text2text-content') {
                    // 文生文结果
                    const generatedText = activeTab.querySelector('.generated-text');
                    generatedText.style.display = 'block';
                    generatedText.innerHTML = `<h3>中国传统绘画的特点与技法</h3>
<p>中国传统绘画是中华文明的重要组成部分，具有悠久的历史和独特的艺术魅力。以下从几个方面介绍中国传统绘画的主要特点与技法：</p>

<h4>一、中国传统绘画的特点</h4>

<p>1. <strong>以线造型</strong>：中国画以线条为主要表现手段，讲究"线条用笔"，通过不同的线条变化来表现物象的形态和质感。</p>

<p>2. <strong>写意精神</strong>：强调艺术家的主观表达，不追求对客观对象的完全模仿，而是追求"神似"而非"形似"。</p>

<p>3. <strong>虚实结合</strong>：画面中有意识地留白，使实与虚、有与无相互映衬，达到"虚实相生"的艺术效果。</p>

<p>4. <strong>诗书画印结合</strong>：中国画常与诗文、书法、印章相结合，形成独特的综合艺术形式。</p>

<h4>二、主要技法</h4>

<p>1. <strong>用笔技法</strong>：</p>
<ul>
    <li>钩勒：以线条勾画轮廓</li>
    <li>皴法：表现山石纹理的技法</li>
    <li>点法：用笔尖点画，表现叶、花等</li>
    <li>擦法：用侧锋轻擦，表现烟云等</li>
</ul>

<p>2. <strong>用墨技法</strong>：</p>
<ul>
    <li>焦墨：墨色浓重</li>
    <li>浓墨：墨色较重</li>
    <li>淡墨：墨色较淡</li>
    <li>破墨：墨色深浅相间</li>
    <li>渴墨：干笔擦出的效果</li>
</ul>

<p>3. <strong>设色技法</strong>：</p>
<ul>
    <li>工笔重彩：精细描绘，色彩浓重</li>
    <li>淡彩：颜色淡雅</li>
    <li>水墨渲染：水墨晕染效果</li>
    <li>泼墨泼彩：随意挥洒墨与彩</li>
</ul>

<h4>三、主要流派</h4>

<p>1. <strong>北宋山水画</strong>：以范宽、郭熙、李成为代表，追求雄伟壮丽的山水风貌。</p>

<p>2. <strong>南宋院体画</strong>：以马远、夏圭为代表，形成"马一角"、"夏半边"的构图特点。</p>

<p>3. <strong>元代文人画</strong>：以黄公望、吴镇、倪瓒、王蒙"元四家"为代表，重视个人情感表达。</p>

<p>4. <strong>明清写意画</strong>：以徐渭、八大山人、石涛等为代表，笔墨更加随意奔放。</p>

<p>通过学习和掌握这些特点与技法，可以更好地理解和欣赏中国传统绘画的艺术魅力，也为创作实践提供参考和指导。</p>`;
                } else {
                    // 文生图结果
                    const generatedImages = activeTab.querySelector('.generated-images');
                    generatedImages.style.display = 'flex';
                    generatedImages.innerHTML = `
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=中国山水画" alt="生成的图像1">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=青山绿水" alt="生成的图像2">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=亭台楼阁" alt="生成的图像3">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=飞鸟山水" alt="生成的图像4">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                    `;
                    
                    // 给生成的图片添加悬停效果和按钮功能
                    const imageActions = document.querySelectorAll('.image-actions button');
                    imageActions.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            showNotification('图片操作成功', 'success');
                        });
                    });
                }
                
                // 添加结果操作按钮事件
                const actionBtns = activeTab.querySelectorAll('.result-action-btn');
                actionBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (btn.classList.contains('regenerate')) {
                            showNotification('正在重新生成内容...', 'info');
                        } else if (btn.classList.contains('copy')) {
                            showNotification('内容已复制到剪贴板', 'success');
                        } else if (btn.classList.contains('download')) {
                            showNotification('图片已下载', 'success');
                        } else if (btn.classList.contains('insert')) {
                            showNotification('内容已插入到课件', 'success');
                            closeModal();
                        }
                    });
                });
                
            }, 2000);
        });
    }
}

/**
 * 处理标签切换，包括隐藏生成的题目列表
 */
function initTabSwitching() {
    // 标签按钮点击事件
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动标签
            tabBtns.forEach(tb => tb.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // 激活目标标签
            this.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
            
            // 隐藏生成的题目列表，除非是在 quiz 标签中
            const generatedQuestionsList = document.querySelector('.generated-questions-list');
            if (generatedQuestionsList) {
                if (targetTab === 'quiz') {
                    // 只有在生成过题目后才显示题目列表
                    const quizResult = document.querySelector('.quiz-result');
                    if (quizResult && window.getComputedStyle(quizResult).display !== 'none') {
                        generatedQuestionsList.style.display = 'block';
                    } else {
                        generatedQuestionsList.style.display = 'none';
                    }
                } else {
                    generatedQuestionsList.style.display = 'none';
                }
            }
        });
    });
}

/**
 * 初始化内容区域功能
 */
function initContentSections() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitles = document.querySelectorAll('.current-page-title');
    
    // 在页面加载时隐藏生成的题目列表
    const generatedQuestionsList = document.querySelector('.generated-questions-list');
    if (generatedQuestionsList) {
        generatedQuestionsList.style.display = 'none';
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 更新导航项目状态
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // 更新页面标题
            const sectionName = this.querySelector('.nav-text.zh').textContent;
            pageTitles.forEach(title => {
                if (title.classList.contains('zh')) {
                    title.textContent = sectionName;
                } else {
                    title.textContent = this.querySelector('.nav-text.en').textContent;
                }
            });
            
            // 更新内容部分
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('id') === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
            
            // 隐藏生成的题目列表（如果不在相关部分）
            if (generatedQuestionsList) {
                generatedQuestionsList.style.display = 'none';
            }
        });
    });
}

/**
 * 初始化课程思政功能
 */
function initIdeology() {
    // 思政案例生成按钮
    const ideologyGenerateBtn = document.querySelector('.ideology-generation .generate-btn');
    
    if (ideologyGenerateBtn) {
        ideologyGenerateBtn.addEventListener('click', function() {
            showNotification('正在生成思政案例...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                // 获取表单内容
                const themeInput = document.querySelector('.ideology-generation .prompt-input.zh');
                const caseType = document.querySelector('.ideology-generation .ideology-select:first-of-type');
                const caseLength = document.querySelector('.ideology-generation .ideology-select:last-of-type');
                
                // 生成案例内容（这里是示例内容）
                let generatedCase = '';
                if (themeInput && themeInput.value) {
                    const theme = themeInput.value;
                    const type = caseType ? caseType.options[caseType.selectedIndex].text : '故事型案例';
                    const length = caseLength ? caseLength.options[caseLength.selectedIndex].text : '中等';
                    
                    generatedCase = `【${type}】关于"${theme}"的思政案例\n\n`;
                    generatedCase += `这是一个${length}的思政案例示例，主题围绕"${theme}"展开。\n\n`;
                    generatedCase += `在中华优秀传统文化的传承与创新中，"${theme}"始终是一个重要的思想内核。`;
                    generatedCase += `本案例通过具体的历史事件和现代案例，深入阐述了"${theme}"在当代中国发展中的重要意义。`;
                    generatedCase += `学生通过学习本案例，可以更好地理解中华文化的精髓，增强文化自信。`;
                } else {
                    generatedCase = '请先输入思政案例主题...';
                }
                
                // 更新结果区域
                const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
                if (caseTextarea) {
                    caseTextarea.value = generatedCase;
                }
                
                // 显示结果区域
                const ideologyResult = document.querySelector('.ideology-result');
                if (ideologyResult) {
                    ideologyResult.style.display = 'block';
                }
                
                showNotification('思政案例生成成功！', 'success');
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.ideology-result .result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span.zh').textContent;
            const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
            
            switch (action) {
                case '编辑':
                    if (caseTextarea) {
                        caseTextarea.readOnly = false;
                        caseTextarea.focus();
                        showNotification('您可以编辑思政案例内容', 'info');
                    }
                    break;
                    
                case '复制':
                    if (caseTextarea) {
                        caseTextarea.select();
                        document.execCommand('copy');
                        showNotification('案例内容已复制到剪贴板', 'success');
                    }
                    break;
                    
                case '重新生成':
                    showNotification('正在重新生成案例...', 'info');
                    document.querySelector('.ideology-generation .generate-btn').click();
                    break;
            }
        });
    });
}

// 新建思政案例功能
document.addEventListener('DOMContentLoaded', function() {
    const createCaseBtn = document.getElementById('createCaseBtn');
    const createCaseModal = document.getElementById('createCaseModal');
    const closeBtn = createCaseModal.querySelector('.close-btn');
    const cancelBtn = createCaseModal.querySelector('.btn-cancel');
    const saveBtn = document.getElementById('saveNewCaseBtn');
    
    // 打开模态框
    createCaseBtn.addEventListener('click', function() {
        createCaseModal.classList.add('active');
    });
    
    // 关闭模态框
    function closeModal() {
        createCaseModal.classList.remove('active');
        // 清空表单
        document.getElementById('caseTitleInput').value = '';
        document.getElementById('caseContentInput').value = '';
        // 重置复选框
        const checkboxes = document.querySelectorAll('input[name="resourceType"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 保存新案例
    saveBtn.addEventListener('click', function() {
        const title = document.getElementById('caseTitleInput').value.trim();
        const content = document.getElementById('caseContentInput').value.trim();
        const selectedResources = [];
        
        document.querySelectorAll('input[name="resourceType"]:checked').forEach(checkbox => {
            selectedResources.push(checkbox.value);
        });
        
        if (title === '') {
            alert('请输入案例标题');
            return;
        }
        
        if (content === '') {
            alert('请输入案例内容');
            return;
        }
        
        // 这里可以添加保存逻辑，如API调用或本地存储
        
        // 模拟添加到列表
        addNewCaseToList(title, selectedResources);
        
        // 关闭模态框
        closeModal();
    });
    
    // 添加新案例到列表
    function addNewCaseToList(title, resources) {
        const casesTable = document.querySelector('.cases-table tbody');
        const rowCount = casesTable.querySelectorAll('tr').length + 1;
        
        const newRow = document.createElement('tr');
        
        // 创建序号单元格
        const numCell = document.createElement('td');
        numCell.textContent = rowCount;
        
        // 创建标题单元格
        const titleCell = document.createElement('td');
        const zhTitle = document.createElement('p');
        zhTitle.className = 'zh';
        zhTitle.textContent = title;
        const enTitle = document.createElement('p');
        enTitle.className = 'en';
        enTitle.textContent = title; // 在实际应用中可能需要翻译
        titleCell.appendChild(zhTitle);
        titleCell.appendChild(enTitle);
        
        // 创建资源标签单元格
        const resourceCell = document.createElement('td');
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'resource-tags';
        
        resources.forEach(resource => {
            const tagSpan = document.createElement('span');
            tagSpan.className = `resource-tag ${resource}`;
            const icon = document.createElement('i');
            
            if (resource === 'image') {
                icon.className = 'fas fa-image';
            } else if (resource === 'video') {
                icon.className = 'fas fa-video';
            } else if (resource === 'link') {
                icon.className = 'fas fa-link';
            }
            
            tagSpan.appendChild(icon);
            tagsDiv.appendChild(tagSpan);
        });
        
        resourceCell.appendChild(tagsDiv);
        
        // 创建操作按钮单元格
        const actionCell = document.createElement('td');
        
        const viewBtn = document.createElement('button');
        viewBtn.className = 'case-action-btn view';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'case-action-btn edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'case-action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        actionCell.appendChild(viewBtn);
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        
        // 将所有单元格添加到行
        newRow.appendChild(numCell);
        newRow.appendChild(titleCell);
        newRow.appendChild(resourceCell);
        newRow.appendChild(actionCell);
        
        // 将行添加到表格
        casesTable.appendChild(newRow);
    }
}); 

// 全屏功能
function initFullscreenButton() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            editorContent.classList.toggle('fullscreen');
            
            // 切换全屏按钮图标
            const icon = fullscreenBtn.querySelector('i');
            if (editorContent.classList.contains('fullscreen')) {
                icon.classList.remove('fa-expand');
                icon.classList.add('fa-compress');
            } else {
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
        
        // ESC键退出全屏
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && editorContent.classList.contains('fullscreen')) {
                editorContent.classList.remove('fullscreen');
                const icon = fullscreenBtn.querySelector('i');
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
    }
}

// 在页面加载完成后初始化全屏按钮
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initFullscreenButton();
}); 

// 二维码弹窗功能
function initQrcodeModal() {
    // 更新选择器，确保准确找到签到二维码按钮
    const qrcodeBtn = document.querySelector('.panel-btn:not(.group-action-btn)');
    const qrcodeModal = document.getElementById('qrcodeModal');
    
    // 如果找不到相关元素，直接返回
    if (!qrcodeBtn || !qrcodeModal) {
        console.warn('签到二维码相关元素未找到');
        return;
    }
    
    const closeBtn = qrcodeModal.querySelector('.close-btn');
    const refreshBtn = qrcodeModal.querySelector('.refresh-btn');
    const downloadBtn = qrcodeModal.querySelector('.download-btn');
    
    // 确保二维码弹窗默认隐藏
    qrcodeModal.style.display = 'none';
    qrcodeModal.classList.remove('show');
    
    // 显示二维码弹窗
    qrcodeBtn.addEventListener('click', function() {
        qrcodeModal.style.display = 'flex';
        setTimeout(() => {
            qrcodeModal.classList.add('show');
        }, 10);
        generateQRCode();
        showNotification('二维码已生成，有效期5分钟', 'success');
    });
    
    // 关闭二维码弹窗
    closeBtn.addEventListener('click', function() {
        qrcodeModal.classList.remove('show');
        setTimeout(() => {
            qrcodeModal.style.display = 'none';
        }, 300);
    });
    
    // 点击弹窗外部关闭
    qrcodeModal.addEventListener('click', function(e) {
        if (e.target === qrcodeModal) {
            qrcodeModal.classList.remove('show');
            setTimeout(() => {
                qrcodeModal.style.display = 'none';
            }, 300);
        }
    });
    
    // 刷新二维码
    refreshBtn.addEventListener('click', function() {
        generateQRCode();
        showNotification('二维码已刷新，有效期重置为5分钟', 'info');
    });
    
    // 下载二维码
    downloadBtn.addEventListener('click', function() {
        // 获取二维码图片
        const qrImg = document.getElementById('checkinQRCode');
        
        // 创建一个临时链接
        const a = document.createElement('a');
        a.href = qrImg.src;
        a.download = '签到二维码.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('二维码已下载', 'success');
    });
}

// 模拟生成二维码的功能
function generateQRCode() {
    // 实际应用中，这里应该调用后端API生成真实的二维码
    // 此处仅做演示，随机更新二维码图片
    const qrImg = document.getElementById('checkinQRCode');
    const randomId = Math.floor(Math.random() * 1000);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=checkin_session_${randomId}`;
}

// 在文档加载完成后初始化二维码功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化其他功能...
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
}); 

// 初始化替换课件模态框
function initReplaceCoursewareModal() {
    // 此功能已移除
}

// 一键生成幻灯片功能
function initOneClickGeneration() {
    const oneClickGenBtn = document.querySelector('.js-one-click-generate');
    const oneClickModal = document.getElementById('oneClickGenerateModal');
    
    if (!oneClickGenBtn || !oneClickModal) return;
    
    const closeBtn = oneClickModal.querySelector('.modal-close');
    const generateBtn = oneClickModal.querySelector('.js-generate-slides');
    const cancelBtn = oneClickModal.querySelector('.js-cancel');
    const topicInput = oneClickModal.querySelector('#slideTopic');
    const slideCountSelect = oneClickModal.querySelector('#slideCount');
    const styleSelect = oneClickModal.querySelector('#slideStyle');
    const resultArea = oneClickModal.querySelector('.generation-result');
    const loadingIndicator = oneClickModal.querySelector('.loading-indicator');
    
    // 打开模态框
    oneClickGenBtn.addEventListener('click', () => {
        oneClickModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭模态框的函数
    function closeModal() {
        oneClickModal.classList.remove('show');
        document.body.style.overflow = '';
        // 重置表单
        resultArea.innerHTML = '';
        resultArea.style.display = 'none';
        loadingIndicator.style.display = 'none';
    }
    
    // 关闭模态框的事件
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 生成幻灯片
    generateBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        const slideCount = slideCountSelect.value;
        const style = styleSelect.value;
        
        if (!topic) {
            alert('请输入课件主题');
            return;
        }
        
        // 显示加载指示器
        loadingIndicator.style.display = 'flex';
        resultArea.style.display = 'none';
        
        // 模拟生成过程
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            resultArea.style.display = 'block';
            
            // 生成幻灯片预览
            displayGeneratedSlides(topic, slideCount, style);
        }, 3000);
    });
    
    // 显示生成的幻灯片预览
    function displayGeneratedSlides(topic, count, style) {
        const slides = generateSlideStructure(topic, count, style);
        
        let slidesPreviewHTML = `
            <div class="generation-header">
                <h3>已生成 ${count} 张幻灯片</h3>
                <div class="result-actions">
                    <button class="action-btn js-regenerate"><i class="fa fa-refresh"></i> 重新生成</button>
                    <button class="action-btn primary js-import-slides"><i class="fa fa-download"></i> 导入课件</button>
                </div>
            </div>
            <div class="slides-preview">
        `;
        
        slides.forEach((slide, index) => {
            slidesPreviewHTML += `
                <div class="slide-preview-item">
                    <div class="slide-number">${index + 1}</div>
                    <div class="slide-content" style="background-color: ${style === 'modern' ? '#f5f5f5' : style === 'traditional' ? '#f8f4e8' : '#fff'}">
                        <h4>${slide.title}</h4>
                        <div class="slide-body">
                            ${slide.content}
                        </div>
                    </div>
                </div>
            `;
        });
        
        slidesPreviewHTML += `</div>`;
        resultArea.innerHTML = slidesPreviewHTML;
        
        // 添加事件监听器
        const regenerateBtn = resultArea.querySelector('.js-regenerate');
        const importBtn = resultArea.querySelector('.js-import-slides');
        
        regenerateBtn.addEventListener('click', () => {
            loadingIndicator.style.display = 'flex';
            resultArea.style.display = 'none';
            
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                resultArea.style.display = 'block';
                displayGeneratedSlides(topic, count, style);
            }, 2000);
        });
        
        importBtn.addEventListener('click', () => {
            // 导入幻灯片到编辑器
            importGeneratedSlides(slides, styleType);
            closeModal();
        });
    }
    
    // 生成幻灯片结构
    function generateSlideStructure(topic, count, style) {
        const slides = [];
        
        // 添加封面
        slides.push({
            title: topic,
            content: `<div class="cover-slide"><p class="presenter">讲师: 李明</p><p class="date">2023年10月</p></div>`
        });
        
        // 添加目录
        if (count >= 5) {
            slides.push({
                title: "目录",
                content: `<ul class="toc">
                    <li>引言</li>
                    <li>主要内容</li>
                    <li>实例分析</li>
                    <li>总结与展望</li>
                </ul>`
            });
        }
        
        // 根据不同主题生成不同内容
        const topics = {
            "中国传统文化": [
                { title: "中国传统文化概述", content: `<p>中国传统文化源远流长，包含哲学、宗教、文学、艺术、建筑等多个方面。</p><ul><li>儒家思想</li><li>道家思想</li><li>佛教文化</li></ul>` },
                { title: "传统艺术", content: `<div class="two-column"><div><p>中国传统艺术形式多样：</p><ul><li>书法</li><li>绘画</li><li>戏曲</li></ul></div><div class="image-placeholder"></div></div>` },
                { title: "传统节日", content: `<table class="simple-table"><tr><th>节日</th><th>时间</th><th>习俗</th></tr><tr><td>春节</td><td>农历正月初一</td><td>贴春联、放鞭炮</td></tr><tr><td>端午节</td><td>农历五月初五</td><td>赛龙舟、吃粽子</td></tr></table>` },
                { title: "传统美德", content: `<p>中华民族传统美德:</p><div class="center-content"><div class="virtue">仁爱</div><div class="virtue">诚信</div><div class="virtue">礼义</div><div class="virtue">孝道</div></div>` }
            ],
            "人工智能基础": [
                { title: "什么是人工智能", content: `<p>人工智能(AI)是计算机科学的一个分支，致力于创造能够模拟人类智能的系统。</p><div class="image-placeholder"></div>` },
                { title: "机器学习基础", content: `<div class="two-column"><div><p>机器学习类型：</p><ul><li>监督学习</li><li>无监督学习</li><li>强化学习</li></ul></div><div class="image-placeholder"></div></div>` },
                { title: "神经网络结构", content: `<div class="center-content"><div class="image-placeholder"></div><p>神经网络由输入层、隐藏层和输出层组成</p></div>` },
                { title: "AI应用场景", content: `<table class="simple-table"><tr><th>领域</th><th>应用</th></tr><tr><td>医疗</td><td>疾病诊断、药物研发</td></tr><tr><td>金融</td><td>风险评估、算法交易</td></tr><tr><td>教育</td><td>个性化学习、智能评估</td></tr></table>` }
            ]
        };
        
        // 获取最接近的主题
        let bestMatch = "中国传统文化";
        if (topic.includes("智能") || topic.includes("AI") || topic.includes("机器学习")) {
            bestMatch = "人工智能基础";
        }
        
        // 添加主题相关幻灯片
        const relevantSlides = topics[bestMatch];
        const slidesToAdd = Math.min(relevantSlides.length, count - slides.length - 1); // 减去封面和结尾
        
        for (let i = 0; i < slidesToAdd; i++) {
            slides.push(relevantSlides[i]);
        }
        
        // 如果还需要更多幻灯片，添加占位符
        while (slides.length < count - 1) {
            slides.push({
                title: `${topic} - 补充内容 ${slides.length - 1}`,
                content: `<div class="placeholder-content"><p>这里是关于${topic}的补充内容</p><div class="image-placeholder"></div></div>`
            });
        }
        
        // 添加结尾幻灯片
        slides.push({
            title: "谢谢观看",
            content: `<div class="thank-you-slide"><p>感谢您的关注！</p><p>有任何问题请随时提问</p></div>`
        });
        
        return slides;
    }
    
    // 导入生成的幻灯片到编辑器
    function importGeneratedSlides(slides, styleType) {
        const thumbnailContainer = document.querySelector('.slide-thumbnails');
        const editorArea = document.querySelector('.slide-editor');
        
        if (!thumbnailContainer || !editorArea) return;
        
        // 清空现有幻灯片
        thumbnailContainer.innerHTML = '';
        
        // 添加新幻灯片
        slides.forEach((slide, index) => {
            // 创建缩略图
            const thumbnail = document.createElement('div');
            thumbnail.className = 'slide-thumbnail';
            thumbnail.setAttribute('data-slide-id', index);
            if (index === 0) thumbnail.classList.add('active');
            
            thumbnail.innerHTML = `
                <div class="thumbnail-number">${index + 1}</div>
                <div class="thumbnail-preview" style="background-color: ${styleType === 'modern' ? '#f5f5f5' : styleType === 'traditional' ? '#f8f4e8' : '#fff'}">
                    <div class="thumbnail-title">${slide.title}</div>
                </div>
            `;
            
            thumbnailContainer.appendChild(thumbnail);
            
            // 添加点击事件
            thumbnail.addEventListener('click', function() {
                document.querySelectorAll('.slide-thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                updateEditorContent(slide, index, styleType);
            });
        });
        
        // 更新编辑区域为第一张幻灯片
        updateEditorContent(slides[0], 0, styleType);
        
        // 显示成功消息
        showNotification('幻灯片已成功导入');
    }
    
    // 更新编辑区域内容
    function updateEditorContent(slide, index, styleType) {
        const editorArea = document.querySelector('.slide-editor');
        if (!editorArea) return;
        
        const slideContent = document.createElement('div');
        slideContent.className = 'slide-content-editor';
        slideContent.style.backgroundColor = styleType === 'modern' ? '#f5f5f5' : styleType === 'traditional' ? '#f8f4e8' : '#fff';
        
        slideContent.innerHTML = `
            <h2 class="slide-title-editor" contenteditable="true">${slide.title}</h2>
            <div class="slide-body-editor" contenteditable="true">
                ${slide.content}
            </div>
        `;
        
        editorArea.innerHTML = '';
        editorArea.appendChild(slideContent);
    }
    
    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        }, 100);
    }
}

/**
 * 初始化课堂小测题目导航功能
 */
function initQuizNavigation() {
    // 模拟的题目数据，实际应从服务端获取
    const quizQuestions = [
        {
            number: 1,
            type: '单选题',
            typeEn: 'Single Choice',
            text: '下列哪个元素不属于中国园林的基本要素？',
            options: [
                { label: 'A', text: '假山' },
                { label: 'B', text: '水体' },
                { label: 'C', text: '植物' },
                { label: 'D', text: '喷泉' }
            ],
            answer: 'D',
            explanation: '喷泉是西方园林常见的景观元素，中国传统园林则讲究自然山水的模拟与再现，主要以假山、水体、植物和建筑为基本要素，形成"虽由人作，宛自天开"的艺术效果。'
        },
        {
            number: 2,
            type: '多选题',
            typeEn: 'Multiple Choice',
            text: '中国古典园林的设计理念包括以下哪些？',
            options: [
                { label: 'A', text: '虽由人作，宛自天开' },
                { label: 'B', text: '藏露结合' },
                { label: 'C', text: '几何对称布局' },
                { label: 'D', text: '移步换景' }
            ],
            answer: 'ABD',
            explanation: '中国古典园林讲究自然山水的模拟与再现，主要设计理念包括"虽由人作，宛自天开"、"藏露结合"、"移步换景"等，而几何对称布局则是西式园林的特点。'
        },
        {
            number: 3,
            type: '单选题',
            typeEn: 'Single Choice',
            text: '下列哪个园林不位于苏州？',
            options: [
                { label: 'A', text: '拙政园' },
                { label: 'B', text: '留园' },
                { label: 'C', text: '圆明园' },
                { label: 'D', text: '网师园' }
            ],
            answer: 'C',
            explanation: '圆明园位于北京，是清代著名的皇家园林。而拙政园、留园和网师园都位于苏州，是著名的江南私家园林代表作。'
        },
        {
            number: 4,
            type: '简答题',
            typeEn: 'Short Answer',
            text: '简述中国园林与西方园林的主要区别。',
            answer: '中西方园林的主要区别体现在：\n1. 布局方式：中国园林强调自然曲线和不规则布局，西方园林多采用几何对称布局\n2. 设计理念：中国园林讲究"虽由人作，宛自天开"，西方园林则展示人对自然的控制与改造\n3. 游览方式：中国园林采用"移步换景"的游览方式，西方园林则强调整体观赏\n4. 景观元素：中国园林多用山水、植物等自然元素，西方园林则常用喷泉、雕塑等人工景观',
            explanation: '中西方园林的区别反映了不同文化背景下人与自然关系的处理方式。中国园林受道家"天人合一"思想影响，强调与自然和谐共处；西方园林则更多体现人对自然的驾驭和改造。'
        },
        {
            number: 5,
            type: '讨论题',
            typeEn: 'Discussion',
            text: '中国古典园林的"借景"手法在现代景观设计中有何应用价值？',
            answer: '无标准答案',
            explanation: '借景是中国古典园林的重要手法，通过"框景"、"漏景"等方式将远景纳入园林视野，扩展空间感，增加景观层次。在现代景观设计中，借景理念有助于突破场地局限，增强空间的开放性和连续性，创造更具深度和趣味性的景观体验。此外，借景手法的应用也有助于促进城市空间的整体协调和资源共享。'
        }
    ];
    
    let currentQuestionIndex = 0;
    
    // 获取相关DOM元素
    const prevBtn = document.querySelector('.prev-question-btn');
    const nextBtn = document.querySelector('.next-question-btn');
    const currentQuestionSpan = document.querySelector('.current-question');
    const totalQuestionsSpan = document.querySelector('.total-questions');
    const dotContainer = document.querySelector('.quiz-nav-dots');
    const dots = document.querySelectorAll('.quiz-dot');
    
    if (!prevBtn || !nextBtn || !currentQuestionSpan || !totalQuestionsSpan || !dotContainer) return;
    
    // 初始化题目总数
    totalQuestionsSpan.textContent = quizQuestions.length;
    
    // 上一题按钮点击事件
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestionDisplay();
        }
    });
    
    // 下一题按钮点击事件
    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            updateQuestionDisplay();
        }
    });
    
    // 点击导航点切换题目
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentQuestionIndex = index;
            updateQuestionDisplay();
        });
    });
    
    // 更新题目显示
    function updateQuestionDisplay() {
        // 更新当前题目计数
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        
        // 更新导航点状态
        dots.forEach((dot, index) => {
            if (index === currentQuestionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 更新按钮状态
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === quizQuestions.length - 1;
        
        // 获取当前题目数据
        const currentQuestion = quizQuestions[currentQuestionIndex];
        
        // 更新题目内容
        const questionItem = document.querySelector('.question-item');
        if (questionItem) {
            // 更新题号和类型
            const questionNumber = questionItem.querySelector('.question-number');
            const questionTypeZh = questionItem.querySelector('.question-type.zh');
            const questionTypeEn = questionItem.querySelector('.question-type.en');
            
            if (questionNumber) questionNumber.textContent = `Q${currentQuestion.number}`;
            if (questionTypeZh) questionTypeZh.textContent = currentQuestion.type;
            if (questionTypeEn) questionTypeEn.textContent = currentQuestion.typeEn;
            
            // 更新题目文本
            const questionText = questionItem.querySelector('.question-text');
            if (questionText) questionText.textContent = currentQuestion.text;
            
            // 更新选项（如果有）
            const optionsContainer = questionItem.querySelector('.question-options');
/**
 * 中国文化人工智能课程平台 - 教师端
 * 主脚本文件
 */

// 在文件顶部，DOMContentLoaded事件监听器之前添加标记变量
// 全局变量，用于跟踪按钮是否已经绑定事件
let contentGenBtnInitialized = false;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航系统
    initNavigation();
    
    // 初始化语言切换
    initLanguageToggle();
    
    // 初始化章节模态框
    initChapterModal();
    
    // 初始化章节卡片交互
    initChapterCards();
    
    // 更新当前日期显示
    updateCurrentDate();
    
    // 初始化内容生成弹窗
    initContentGenerateModal();
    
    // 初始化AI助教-课前部分
    initAIPre();
    
    // 初始化AI助教-课中部分
    initAIInClass();
    
    // 初始化章节滑动功能
    initChapterSlider();
    
    // 初始化课程思政和实训任务部分
    initIdeologyAndPractice();
    
    // 初始化最新动态过滤功能
    initActivityFilters();
    
    // 初始化学情画像部分
    initStudentProfile();
    
    // 初始化中国文化演化部分
    initCultureEvolution();
    
    // 初始化一键生成功能
    initOneClickGeneration();
    
    // 初始化各个模块
    initContentSections();
    initTabSwitching();
    initQuizGenerator();
    initKnowledgeExpansion(); // 添加知识拓展初始化
    // ... 其他初始化函数
    
    // 在页面加载时隐藏知识拓展列表
    const knowledgeExpansionList = document.querySelector('.knowledge-expansion-list');
    if (knowledgeExpansionList) {
        knowledgeExpansionList.style.display = 'none';
    }
    
    // 设置默认激活的标签
    const defaultTabBtn = document.querySelector('.tab-btn[data-tab="courseware"]');
    if (defaultTabBtn) {
        defaultTabBtn.click();
    }
    
    initIdeology(); // 初始化思政功能
    
    // 全屏功能
    initFullscreenButton();
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
    
    // 初始化课程思政多媒体标签页和案例/讨论题切换功能
    initIdeologyMediaTabs();
    
    initMediaTabs();
    initCaseNavigation();
    initDiscussionNavigation();
    initClassSelection(); // 初始化班级选择功能
    
    // 初始化课后总结部分
    initPostClass();
    
    // 知识图谱功能
    initKnowledgeGraph();
    
    // 获取章节列表数据
    fetchChapters();
    
    // 直接调用更新课程统计数据
    updateCourseStatsCount();
    
    // 新建章节按钮点击事件
    document.getElementById('newChapterBtn').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.add('active');
    });
    
    // 关闭模态框按钮点击事件
    document.getElementById('closeNewChapterModal').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 取消按钮点击事件
    document.getElementById('cancelNewChapter').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 提交表单事件
    document.getElementById('submitNewChapter').addEventListener('click', () => {
        submitNewChapter();
    });
    
    // 文件上传预览
    document.getElementById('coverImage').addEventListener('change', (e) => {
        const fileInput = e.target;
        const filePreview = fileInput.parentElement.querySelector('.file-preview');
        
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            reader.readAsDataURL(fileInput.files[0]);
            
            // 这里应该上传文件到服务器，然后获取文件路径
            // 简化处理：假设上传成功并返回路径
            document.getElementById('coverImagePath').value = `../picture/uploads/${fileInput.files[0].name}`;
        }
    });
    
    // 初始化PPTist iframe集成
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
            document.getElementById(sectionId).classList.add('active');
            
            // 更新页面标题
            const navTextZh = this.querySelector('.nav-text.zh').textContent;
            const navTextEn = this.querySelector('.nav-text.en').textContent;
            pageTitleZh.textContent = navTextZh;
            pageTitleEn.textContent = navTextEn;
            
            // 添加动态效果
            animateContentChange(document.getElementById(sectionId));
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
 * 处理打开和关闭模态框的交互
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
    
    // 确认按钮
    confirmBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 模拟创建章节
            const titleInputZh = modal.querySelector('.form-input.zh');
            const titleInputEn = modal.querySelector('.form-input.en');
            
            if (titleInputZh.value.trim() !== '' || titleInputEn.value.trim() !== '') {
                showNotification('章节创建成功！', 'success');
                closeModal();
                
                // 这里可以添加实际创建章节的代码
            } else {
                showNotification('请填写章节标题', 'warning');
            }
        });
    });
    
    // 文件上传预览
    const fileInputs = modal.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileCount = this.files.length;
            const filePreview = this.closest('.form-group').querySelector('.uploaded-files');
            
            if (filePreview) {
                const textZh = filePreview.querySelector('.zh');
                const textEn = filePreview.querySelector('.en');
                
                if (textZh) textZh.textContent = `已上传: ${fileCount} 个文件`;
                if (textEn) textEn.textContent = `Uploaded: ${fileCount} files`;
            }
        });
    });
}

/**
 * 初始化章节卡片交互
 * 添加章节卡片上的按钮点击事件
 */
function initChapterCards() {
    const editBtns = document.querySelectorAll('.chapter-action-btn.edit');
    const prepareBtns = document.querySelectorAll('.chapter-action-btn.prepare');
    const teachBtns = document.querySelectorAll('.chapter-action-btn.teach');
    
    // 编辑按钮
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            showNotification(`正在编辑${chapterTitle}...`, 'info');
            // 这里可以添加实际的编辑功能
        });
    });
    
    // 备课按钮
    prepareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取章节信息
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            const chapterTitleEn = chapterCard.querySelector('.chapter-title.en').textContent;
            
            // 提取章节序号（从标题中获取第X章）
            const chapterMatch = chapterTitle.match(/第(\d+)章/);
            if (chapterMatch && chapterMatch[1]) {
                const chapterNumber = chapterMatch[1];
                
                // 切换到AI助教-课前界面
                const aiPreNavItem = document.querySelector('.nav-item[data-section="ai-pre"]');
                if (aiPreNavItem) {
                    // 触发点击事件，切换到AI助教-课前界面
                    aiPreNavItem.click();
                    
                    // 延迟一下，等待界面切换完成后设置章节选择器的值
                    setTimeout(() => {
                        // 设置章节选择器
                        const chapterSelect = document.getElementById('chapter-select');
                        if (chapterSelect) {
                            // 查找对应章节的选项
                            const options = chapterSelect.options;
                            for (let i = 0; i < options.length; i++) {
                                if (options[i].value === chapterNumber) {
                                    chapterSelect.selectedIndex = i;
                                    // 手动触发变更事件
                                    const event = new Event('change');
                                    chapterSelect.dispatchEvent(event);
                                    break;
                                }
                            }
                        }
                        
                        showNotification(`正在准备${chapterTitle}的课前内容...`, 'success');
                    }, 300);
                }
            } else {
                showNotification(`无法确定章节编号，请手动选择章节`, 'warning');
            }
        });
    });
    
    // 上课按钮
    teachBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            
            // 切换到"AI助教-课中"界面
            const aiInNavItem = document.querySelector('.nav-item[data-section="ai-in"]');
            if (aiInNavItem) {
                aiInNavItem.click();
                
                showNotification(`开始${chapterTitle}的课堂教学`, 'success');
            }
        });
    });
    
    // 整个卡片点击事件
    const chapterCards = document.querySelectorAll('.chapter-card');
    chapterCards.forEach(card => {
        card.addEventListener('click', function() {
            const chapterTitle = this.querySelector('.chapter-title.zh').textContent;
            showNotification(`查看章节详情: ${chapterTitle}`, 'info');
            
            // 这里可以添加显示章节详情的代码
        });
    });
}

/**
 * 为内容区域添加切换动画
 * @param {HTMLElement} section - 要添加动画的内容区域
 */
function animateContentChange(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    }, 50);
}

/**
 * 创建通知提示
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (success, warning, error, info)
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 添加图标
    const icon = document.createElement('i');
    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            icon.className = 'fas fa-times-circle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    // 添加消息文本
    const text = document.createElement('span');
    text.textContent = message;
    
    // 添加关闭按钮
    const closeBtn = document.createElement('i');
    closeBtn.className = 'fas fa-times close-notification';
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 组装通知元素
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加进入动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动消失
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * 当前日期显示
 * 更新首页欢迎横幅中的日期显示
 */
function updateCurrentDate() {
    const dateElementZh = document.getElementById('current-date-zh');
    const dateElementEn = document.getElementById('current-date-en');
    
    if (dateElementZh && dateElementEn) {
        const now = new Date();
        
        // 中文日期格式
        const zhOptions = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
        let zhDate = now.toLocaleDateString('zh-CN', zhOptions);
        // 进一步格式化中文日期，确保格式为：2023年3月23日 星期四
        zhDate = zhDate.replace(/\//g, '年') + '日';
        zhDate = zhDate.replace(/年(\d+)年/, '年$1月');
        zhDate = zhDate.replace(/星期(.+)日/, '星期$1'); // 去掉星期后面的"日"字
        dateElementZh.textContent = `今天是 ${zhDate}`; // 删除平台口号
        
        // 英文日期格式
        const enOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElementEn.textContent = `Today is ${now.toLocaleDateString('en-US', enOptions)}`;
    }
}

/**
 * 初始化AI助教-课前部分
 */
function initAIPre() {
    // 初始化标签页切换
    initAIPreTabs();
    
    // 初始化课件设计
    initCoursewareDesign();
    
    // 初始化小测题目导航
    initQuizNavigation();
    
    // 初始化可缩放思维导图
    initZoomableMindmap();
    
    // 初始化章节选择器
    initChapterSelector();
}

/**
 * 初始化AI助教-课前选项卡切换
 */
function initAIPreTabs() {
    const tabBtns = document.querySelectorAll('.ai-pre-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.ai-pre-tabs .tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有选项卡的活动状态
            tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
            
            // 为当前点击的选项卡添加活动状态
            this.classList.add('active');
            
            // 获取要显示的内容区域的ID
            const contentId = this.getAttribute('data-tab') + '-content';
            
            // 隐藏所有内容区域
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 显示对应的内容区域
            document.getElementById(contentId).classList.add('active');
            
            // 添加动态效果
            animateTabContentChange(document.getElementById(contentId));
        });
    });
}

/**
 * 初始化课件设计功能
 */
function initCoursewareDesign() {
    const coursewareContent = document.getElementById('courseware-content');
    if (!coursewareContent) return;

    const actionButtons = coursewareContent.querySelectorAll('.action-button');
    const genBtn = actionButtons[0]; // 内容生成按钮是第一个按钮
    const replaceBtn = actionButtons[1]; // 替换课件按钮是第二个按钮
    
    // 内容生成按钮初始化
    if (genBtn && !contentGenBtnInitialized) {
        // 先移除可能已经存在的所有点击事件处理器
        const newGenBtn = genBtn.cloneNode(true);
        genBtn.parentNode.replaceChild(newGenBtn, genBtn);
        
        // 为新的按钮添加单一事件监听器
        newGenBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            // 显示内容生成模态框
            const modal = document.getElementById('contentGenerateModal');
            if (modal) {
                modal.classList.add('active');
            }
        });
        
        contentGenBtnInitialized = true;
        console.log("内容生成按钮已初始化");
    }
    
    // 替换课件按钮初始化
    if (replaceBtn) {
        // 先移除可能已经存在的所有点击事件处理器
        const newReplaceBtn = replaceBtn.cloneNode(true);
        replaceBtn.parentNode.replaceChild(newReplaceBtn, replaceBtn);
        
        // 为新的按钮添加单一事件监听器
        newReplaceBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            
            // 显示替换课件弹窗
            showReplaceCoursewareModal();
        });
        
        console.log("替换课件按钮已初始化");
    }
    
    // 幻灯片缩略图交互
    const thumbnails = coursewareContent.querySelectorAll('.thumbnail-item');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 显示替换课件模态框
    function showReplaceCoursewareModal() {
        // 创建模态框
        let modal = document.getElementById('replaceCoursewareModal');
        
        // 如果模态框不存在，创建一个新的
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'replaceCoursewareModal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="zh">替换课件</h3>
                        <h3 class="en">Replace Courseware</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="file-upload-section">
                            <div class="upload-instructions">
                                <p class="zh">请选择要上传的课件文件，支持PPT、PPTX或PDF格式</p>
                                <p class="en">Please select courseware file to upload, supports PPT, PPTX or PDF formats</p>
                            </div>
                            <div class="file-upload-large">
                                <div class="file-preview-large">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p class="zh">拖放文件到此处或点击上传</p>
                                    <p class="en">Drag and drop files here or click to upload</p>
                                    <p class="file-types zh">支持的格式: PPT, PPTX, PDF</p>
                                    <p class="file-types en">Supported formats: PPT, PPTX, PDF</p>
                                </div>
                                <input type="file" class="file-input" accept=".ppt,.pptx,.pdf">
                            </div>
                            <div class="uploaded-files">
                                <h4 class="zh">已选择文件</h4>
                                <h4 class="en">Selected Files</h4>
                                <div class="no-file-selected">
                                    <p class="zh">未选择任何文件</p>
                                    <p class="en">No file selected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel">
                            <span class="zh">取消</span>
                            <span class="en">Cancel</span>
                        </button>
                        <button class="btn-confirm">
                            <span class="zh">替换</span>
                            <span class="en">Replace</span>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 关闭按钮
            const closeBtn = modal.querySelector('.close-btn');
            const cancelBtn = modal.querySelector('.btn-cancel');
            
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            cancelBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            // 文件上传功能
            const fileInput = modal.querySelector('.file-input');
            const uploadArea = modal.querySelector('.file-preview-large');
            const noFileSelected = modal.querySelector('.no-file-selected');
            const uploadedFiles = modal.querySelector('.uploaded-files');
            
            // 文件上传区域点击触发文件选择
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            // 监听文件选择变化
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    
                    // 处理已选择的文件
                    noFileSelected.style.display = 'none';
                    
                    // 移除旧的文件详情
                    const oldFileDetails = uploadedFiles.querySelector('.file-details');
                    if (oldFileDetails) {
                        oldFileDetails.remove();
                    }
                    
                    // 创建文件详情显示
                    const fileDetails = document.createElement('div');
                    fileDetails.className = 'file-details';
                    
                    // 根据文件类型显示不同的图标
                    let fileIcon = 'fa-file';
                    if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
                        fileIcon = 'fa-file-powerpoint';
                    } else if (file.name.endsWith('.pdf')) {
                        fileIcon = 'fa-file-pdf';
                    }
                    
                    // 计算文件大小显示
                    let fileSize = (file.size / 1024).toFixed(2) + ' KB';
                    if (file.size > 1024 * 1024) {
                        fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                    }
                    
                    fileDetails.innerHTML = `
                        <div class="file-icon"><i class="fas ${fileIcon}"></i></div>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${fileSize}</div>
                        </div>
                        <button class="remove-file-btn"><i class="fas fa-times"></i></button>
                    `;
                    
                    uploadedFiles.appendChild(fileDetails);
                    
                    // 添加删除文件的按钮事件
                    const removeBtn = fileDetails.querySelector('.remove-file-btn');
                    removeBtn.addEventListener('click', () => {
                        fileInput.value = '';
                        fileDetails.remove();
                        noFileSelected.style.display = 'block';
                    });
                }
            });
            
            // 拖放功能
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    fileInput.files = e.dataTransfer.files;
                    
                    // 触发change事件以更新UI
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            });
            
            // 替换按钮点击事件
            const confirmBtn = modal.querySelector('.btn-confirm');
            confirmBtn.addEventListener('click', () => {
                if (fileInput.files.length > 0) {
                    showNotification('课件替换成功', 'success');
                    modal.classList.remove('active');
                } else {
                    showNotification('请选择一个文件', 'warning');
                }
            });
        }
        
        // 显示模态框
        modal.classList.add('active');
    }
    
    // 全屏按钮功能
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                // 进入全屏 - 整个编辑器区域
                if (editorContent.requestFullscreen) {
                    editorContent.requestFullscreen();
                } else if (editorContent.mozRequestFullScreen) { // Firefox
                    editorContent.mozRequestFullScreen();
                } else if (editorContent.webkitRequestFullscreen) { // Chrome, Safari, Opera
                    editorContent.webkitRequestFullscreen();
                } else if (editorContent.msRequestFullscreen) { // IE/Edge
                    editorContent.msRequestFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenBtn.title = "退出全屏";
            } else {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        });
        
        // 监听全屏变化事件
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement && 
                !document.msFullscreenElement) {
                // 退出全屏
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        }
    }
}

/**
 * 初始化课堂小测功能
 */
function initQuizGenerator() {
    // 题型选择
    const quizTypes = document.querySelectorAll('.quiz-type');
    
    quizTypes.forEach(type => {
        type.addEventListener('click', function() {
            quizTypes.forEach(qt => qt.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换题型的逻辑
        });
    });
    
    // 生成方式选择
    const optionBtns = document.querySelectorAll('.option-btn');
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换生成方式的逻辑
        });
    });
    
    // 难度滑块
    const difficultySlider = document.getElementById('difficulty-slider');
    
    if (difficultySlider) {
        difficultySlider.addEventListener('input', function() {
            // 这里可以添加难度调整的逻辑
        });
    }
    
    // 生成按钮
    const generateBtn = document.querySelector('.generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            showNotification('正在生成题目...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                showNotification('题目生成成功！', 'success');
                
                // 显示题目结果和生成的题目列表
                const quizResult = document.querySelector('.quiz-result');
                const generatedQuestionsList = document.querySelector('.generated-questions-list');
                
                if (quizResult) {
                    quizResult.style.display = 'block';
                }
                
                if (generatedQuestionsList) {
                    // 清除之前的动画
                    generatedQuestionsList.classList.remove('visible');
                    
                    // 显示列表
                    generatedQuestionsList.style.display = 'block';
                    
                    // 触发重绘
                    void generatedQuestionsList.offsetWidth;
                    
                    // 添加动画类
                    generatedQuestionsList.classList.add('visible');
                    
                    // 滚动到题目列表
                    setTimeout(() => {
                        generatedQuestionsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
                
                // 这里可以添加实际的题目生成逻辑
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 这里可以添加结果操作逻辑（编辑、保存、重新生成等）
        });
    });
}

/**
 * 初始化知识拓展功能
 */
function initKnowledgeExpansion() {
    // 文化按钮选择
    const cultureBtns = document.querySelectorAll('.culture-btn');
    
    cultureBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cultureBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换文化类型的逻辑
        });
    });
    
    // 生成按钮
    const generateBtn = document.querySelector('.knowledge-generation .generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
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
 * 初始化思维导图的缩放和拖动功能
 * 使用鼠标中键滚动实现缩放，按住中键拖动实现平移
 */
function initZoomableMindmap() {
    // 在文档加载完毕后或在AI助教-课中页面初始化时调用
    document.addEventListener('DOMContentLoaded', setupMindmapZoom);
    // 也可以在切换到相应页面时初始化
    const aiInClassNav = document.querySelector('.nav-item[data-section="ai-in"]');
    if (aiInClassNav) {
        aiInClassNav.addEventListener('click', setupMindmapZoom);
    }
    
    function setupMindmapZoom() {
        const mindmapContainer = document.getElementById('zoomable-mindmap');
        if (!mindmapContainer) return;
        
        let scale = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;
        
        // 设置初始状态
        updateMindmapTransform();
        
        // 滚动缩放功能 - 不需要按住中键，直接滚动即可缩放
        mindmapContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const zoomSensitivity = 0.1;
            const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
            
            // 计算缩放的鼠标位置
            const rect = mindmapContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 更新缩放比例
            const newScale = Math.max(0.5, Math.min(3, scale + delta));
            
            // 根据鼠标位置计算新的平移值以保持鼠标下方的点不变
            if (scale !== newScale) {
                const scaleRatio = newScale / scale;
                translateX = mouseX - scaleRatio * (mouseX - translateX);
                translateY = mouseY - scaleRatio * (mouseY - translateY);
                scale = newScale;
                
                updateMindmapTransform();
            }
        });
        
        // 中键拖动功能
        mindmapContainer.addEventListener('mousedown', function(e) {
            // 检查是否是中键按下
            if (e.button === 1) {
                e.preventDefault();
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                
                // 改变鼠标指针样式
                mindmapContainer.style.cursor = 'grabbing';
            }
        });
        
        // 处理拖动移动
        window.addEventListener('mousemove', function(e) {
            if (isDragging) {
                e.preventDefault();
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateMindmapTransform();
            }
        });
        
        // 处理拖动结束
        window.addEventListener('mouseup', function(e) {
            if (isDragging && e.button === 1) {
                isDragging = false;
                mindmapContainer.style.cursor = 'default';
            }
        });
        
        // 更新思维导图的变换
        function updateMindmapTransform() {
            if (!mindmapContainer) return;
            mindmapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            mindmapContainer.style.transformOrigin = 'center';
            mindmapContainer.style.transition = isDragging ? 'none' : 'transform 0.2s ease-out';
        }
    }
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
 * 初始化章节滑动功能
 * 处理章节列表的水平滚动和导航按钮
 */
function initChapterSlider() {
    const chapterList = document.querySelector('.chapters-container');
    if (!chapterList) return;

    const prevBtn = document.querySelector('.chapter-nav-btn.prev-btn');
    const nextBtn = document.querySelector('.chapter-nav-btn.next-btn');
    
    if (!prevBtn || !nextBtn) return;
    
    // 初始状态下禁用上一页按钮
    prevBtn.classList.add('disabled');
    prevBtn.style.opacity = '0.5';
    prevBtn.style.cursor = 'not-allowed';
    
    // 卡片容器可见宽度
    const containerWidth = chapterList.offsetWidth;
    // 总内容宽度
    const scrollWidth = chapterList.scrollWidth;
    
    // 检查是否有溢出内容需要滚动
    if (scrollWidth <= containerWidth) {
        nextBtn.classList.add('disabled');
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
        return; // 如果没有滚动内容，不需要继续设置
    }

    // 设置滚动距离
    let cardWidth = 500; // 更新默认卡片宽度（包含外边距）
    const chapterCard = document.querySelector('.chapter-card');
    if (chapterCard) {
        cardWidth = chapterCard.offsetWidth + 20; // 加上外边距
    }
    const cardGap = 30; // 卡片之间的间距
    const scrollDistance = cardWidth + cardGap;

    // 更新按钮状态的函数
    function updateButtonStates() {
        if (!chapterList) return;
        
        const scrollPosition = chapterList.scrollLeft;
        const maxScroll = scrollWidth - containerWidth;
        
        // 根据滚动位置启用/禁用按钮
        if (scrollPosition <= 5) { // 添加少量容差
            prevBtn.classList.add('disabled');
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (scrollPosition >= maxScroll - 5) { // 添加容差值
            nextBtn.classList.add('disabled');
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    // 添加按钮点击事件
    prevBtn.addEventListener('click', function() {
        if (!prevBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    nextBtn.addEventListener('click', function() {
        if (!nextBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    // 监听滚动事件更新按钮状态
    chapterList.addEventListener('scroll', updateButtonStates);
    
    // 初始化按钮状态
    updateButtonStates();
    
    // 确保初始状态下正确设置按钮状态
    setTimeout(updateButtonStates, 100);
}

// 添加课程思政和实训任务部分的交互
function initIdeologyAndPractice() {
    // 思政部分多媒体上传选项切换
    const uploadOptions = document.querySelectorAll('.upload-option');
    if (uploadOptions.length > 0) {
        uploadOptions.forEach(option => {
            option.addEventListener('click', () => {
                uploadOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    // 实训任务选项卡切换
    const practiceTabs = document.querySelectorAll('.practice-tab');
    const practiceContents = document.querySelectorAll('.practice-content');
    
    if (practiceTabs.length > 0) {
        practiceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-practice-tab');
                
                // 更新选项卡状态
                practiceTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 更新内容显示
                practiceContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}-content`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // 虚拟角色选择
    const roleTypes = document.querySelectorAll('.role-type');
    if (roleTypes.length > 0) {
        roleTypes.forEach(role => {
            role.addEventListener('click', () => {
                roleTypes.forEach(r => r.classList.remove('active'));
                role.classList.add('active');
            });
        });
    }

    // 为生成按钮添加点击效果
    const generateButtons = document.querySelectorAll('.generate-btn');
    if (generateButtons.length > 0) {
        generateButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 模拟生成中状态
                const originalText = btn.innerHTML;
                btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span class="zh">生成中...</span><span class="en">Generating...</span>`;
                btn.disabled = true;
                
                // 模拟生成过程
                setTimeout(() => {
                    // 恢复按钮状态
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    
                    // 显示成功通知
                    showNotification('内容已成功生成！', 'success');
                    
                    // 刷新预览区域，这里可以根据实际需求进行更多处理
                    // 此处仅作为示例
                }, 1500);
            });
        });
    }
}

// 初始化最新动态过滤功能
function initActivityFilters() {
    const filterItems = document.querySelectorAll('.filter-item');
    const activityItems = document.querySelectorAll('.activity-item');
    
    if (filterItems.length > 0) {
        filterItems.forEach(item => {
            item.addEventListener('click', () => {
                // 更新过滤器样式
                filterItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const filterType = item.getAttribute('data-filter');
                
                // 显示/隐藏活动项
                activityItems.forEach(activity => {
                    if (filterType === 'all' || activity.classList.contains(filterType)) {
                        activity.style.display = 'flex';
                    } else {
                        activity.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // 查看更多按钮功能
    const moreBtn = document.querySelector('.more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            // 这里可以实现查看更多功能，例如加载更多活动或跳转到活动页面
            showNotification('加载更多动态...', 'info');
        });
    }
}

/**
 * 初始化AI助教-课中部分
 * 处理AI助教-课中部分的交互功能
 */
function initAIInClass() {
    // 初始化控制面板切换
    initClassroomControlPanel();
    
    // 初始化签到分组功能
    initCheckInAndGrouping();
    
    // 初始化课件展示功能
    initSlidesDisplay();
    
    // 初始化互动功能
    initClassInteraction();
    
    // 初始化课堂数据分析
    initClassDataAnalysis();
}

/**
 * 初始化课堂控制面板
 */
function initClassroomControlPanel() {
    const controlItems = document.querySelectorAll('.control-item');
    const classroomPanels = document.querySelectorAll('.classroom-panel');
    
    if (controlItems.length === 0 || classroomPanels.length === 0) return;
    
    controlItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 移除所有控制项的活动状态
            controlItems.forEach(i => i.classList.remove('active'));
            // 为当前点击的控制项添加活动状态
            item.classList.add('active');
            
            // 隐藏所有面板
            classroomPanels.forEach(panel => panel.classList.remove('active'));
            // 显示对应的面板
            if (index < classroomPanels.length) {
                classroomPanels[index].classList.add('active');
            }
        });
    });
    
    // 课堂计时器功能
    const pauseBtn = document.querySelector('.class-status .control-btn:nth-child(3)');
    const stopBtn = document.querySelector('.class-status .control-btn:nth-child(4)');
    const timeDisplay = document.querySelector('.class-time');
    const statusBadge = document.querySelector('.status-badge');
    
    if (pauseBtn && stopBtn && timeDisplay && statusBadge) {
        let isPaused = false;
        let classTime = 0; // 秒数
        let timerInterval;
        
        // 初始化计时器
        function startTimer() {
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    classTime++;
                    updateTimeDisplay();
                }
            }, 1000);
        }
        
        // 更新时间显示
        function updateTimeDisplay() {
            const hours = Math.floor(classTime / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((classTime % 3600) / 60).toString().padStart(2, '0');
            const seconds = (classTime % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // 暂停/继续按钮
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            
            if (isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂已暂停</span><span class="en">Class Paused</span>';
                statusBadge.classList.remove('active');
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂进行中</span><span class="en">Class in Progress</span>';
                statusBadge.classList.add('active');
            }
        });
        
        // 停止按钮
        stopBtn.addEventListener('click', () => {
            if (confirm('确定要结束当前课堂吗？')) {
                clearInterval(timerInterval);
                showNotification('课堂已结束', 'success');
                
                // 模拟导航到课后页面
                setTimeout(() => {
                    const aiPostNav = document.querySelector('.nav-item[data-section="ai-post"]');
                    if (aiPostNav) {
                        aiPostNav.click();
                    }
                }, 1500);
            }
        });
        
        // 启动计时器
        startTimer();
    }
}

/**
 * 初始化签到分组功能
 */
function initCheckInAndGrouping() {
    // 获取DOM元素
    const groupCountInput = document.getElementById('groupCount');
    const peoplePerGroupInput = document.getElementById('peoplePerGroup');
    const groupingMethodSelect = document.getElementById('groupingMethod');
    const groupBtn = document.querySelector('.panel-btn.group-action-btn');
    const groupList = document.querySelector('.group-list');
    
    // 签到二维码按钮
    const qrCodeBtn = document.querySelector('.panel-actions .panel-btn:not(.group-action-btn)');
    if (qrCodeBtn) {
        qrCodeBtn.addEventListener('click', () => {
            showNotification('签到二维码已显示', 'info');
        });
    }
    
    // 添加不同颜色样式到按钮
    if (groupBtn) {
        groupBtn.classList.add('primary-action');
    }
    
    // 数量增减控制
    function initNumberInput(input) {
        if (!input) return;
        
        const decreaseBtn = input.parentElement.querySelector('.decrease');
        const increaseBtn = input.parentElement.querySelector('.increase');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value > parseInt(input.min)) {
                    input.value = value - 1;
                    updateGroupSettings();
                }
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value < parseInt(input.max)) {
                    input.value = value + 1;
                    updateGroupSettings();
                }
            });
        }
        
        // 输入框值变化时更新
        input.addEventListener('change', updateGroupSettings);
    }
    
    // 初始化数量输入框
    initNumberInput(groupCountInput);
    initNumberInput(peoplePerGroupInput);
    
    // 更新分组设置
    function updateGroupSettings() {
        const totalStudents = 78; // 已签到学生数
        const groupCount = parseInt(groupCountInput.value);
        const peoplePerGroup = parseInt(peoplePerGroupInput.value);
        
        // 检查设置是否合理
        if (groupCount * peoplePerGroup > totalStudents) {
            showNotification('当前设置超出总人数,请调整', 'warning');
            return false;
        }
        
        return true;
    }
    
    // 分组按钮点击事件
    if (groupBtn) {
        groupBtn.addEventListener('click', () => {
            if (!updateGroupSettings()) return;
            
            const groupCount = parseInt(groupCountInput.value);
            const peoplePerGroup = parseInt(peoplePerGroupInput.value);
            const groupingMethod = groupingMethodSelect.value;
            
            // 生成模拟学生数据
            const students = generateMockStudents();
            
            // 根据不同方式分组
            const groups = groupStudents(students, groupCount, peoplePerGroup, groupingMethod);
            
            // 显示分组结果
            displayGroups(groups);
        });
    }
    
    // 生成模拟学生数据
    function generateMockStudents() {
        const names = ['张明', '李华', '王芳', '刘伟', '陈晓', '赵阳', '钱宇', '孙丽', '周红', '吴勇', 
                      '郑军', '冯敏', '陈刚', '徐静', '杨光', '朱峰', '秦莉', '许涛', '潘婷', '马超'];
        
        return Array.from({length: 78}, (_, i) => ({
            id: i + 1,
            name: names[i % names.length] + (Math.floor(i / names.length) + 1),
            grade: Math.floor(Math.random() * 40) + 60, // 60-100分
            activity: Math.floor(Math.random() * 100) // 0-100活跃度
        }));
    }
    
    // 根据不同方式分组
    function groupStudents(students, groupCount, peoplePerGroup, method) {
        let groupedStudents = [];
        
        switch (method) {
            case 'balanced': // 成绩均衡
                students.sort((a, b) => b.grade - a.grade);
                break;
            case 'activity': // 活跃度均衡
                students.sort((a, b) => b.activity - a.activity);
                break;
            default: // 随机
                students.sort(() => Math.random() - 0.5);
        }
        
        // 创建分组
        for (let i = 0; i < groupCount; i++) {
            groupedStudents.push([]);
        }
        
        // 蛇形分配,确保每组能力均衡
        let groupIndex = 0;
        let direction = 1;
        
        students.forEach((student, index) => {
            if (groupedStudents[groupIndex].length < peoplePerGroup) {
                groupedStudents[groupIndex].push(student);
            }
            
            groupIndex += direction;
            
            if (groupIndex >= groupCount - 1) {
                direction = -1;
            } else if (groupIndex <= 0) {
                direction = 1;
            }
        });
        
        return groupedStudents;
    }
    
    // 显示分组结果
    function displayGroups(groups) {
        if (!groupList) return;
        
        groupList.innerHTML = '';
        
        groups.forEach((group, index) => {
            if (group.length === 0) return;
            
            const groupItem = document.createElement('div');
            groupItem.className = 'group-item';
            
            groupItem.innerHTML = `
                <div class="group-header">
                    <h4 class="zh">第${index + 1}组 (${group.length}人)</h4>
                    <h4 class="en">Group ${index + 1} (${group.length} Students)</h4>
                    <div class="group-actions">
                        <button class="group-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="group-btn">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </div>
                <div class="student-tags">
                    ${group.slice(0, 5).map(student => `
                        <span class="student-tag" title="成绩:${student.grade} 活跃度:${student.activity}">
                            ${student.name}
                        </span>
                    `).join('')}
                    ${group.length > 5 ? `<span class="student-tag">+${group.length - 5}</span>` : ''}
                </div>
            `;
            
            // 添加编辑和消息按钮事件
            const editBtn = groupItem.querySelector('.group-btn:nth-child(1)');
            const messageBtn = groupItem.querySelector('.group-btn:nth-child(2)');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showNotification(`正在编辑第${index + 1}组`, 'info');
                });
            }
            
            if (messageBtn) {
                messageBtn.addEventListener('click', () => {
                    showNotification(`已向第${index + 1}组发送消息`, 'success');
                });
            }
            
            groupList.appendChild(groupItem);
        });
        
        showNotification('分组完成', 'success');
    }
}

/**
 * 初始化课件展示功能
 */
function initSlidesDisplay() {
    // 幻灯片控制按钮
    const prevSlideBtn = document.querySelector('.slide-control-btn:nth-child(1)');
    const playSlideBtn = document.querySelector('.slide-control-btn:nth-child(2)');
    const nextSlideBtn = document.querySelector('.slide-control-btn:nth-child(3)');
    const slideCounter = document.querySelector('.slide-counter');
    
    if (prevSlideBtn && playSlideBtn && nextSlideBtn && slideCounter) {
        let currentSlide = 15;
        const totalSlides = 45;
        let isPlaying = false;
        let slideInterval;
        
        // 上一张幻灯片
        prevSlideBtn.addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                updateSlideDisplay();
            }
        });
        
        // 播放/暂停幻灯片
        playSlideBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playSlideBtn.innerHTML = '<i class="fas fa-pause"></i>';
                slideInterval = setInterval(() => {
                    if (currentSlide < totalSlides) {
                        currentSlide++;
                        updateSlideDisplay();
                    } else {
                        clearInterval(slideInterval);
                        isPlaying = false;
                        playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }, 3000);
            } else {
                playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                clearInterval(slideInterval);
            }
        });
        
        // 下一张幻灯片
        nextSlideBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlideDisplay();
            }
        });
        
        // 更新幻灯片显示
        function updateSlideDisplay() {
            slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
            
            // 这里可以添加切换幻灯片图片的逻辑
            const slideImg = document.querySelector('.current-slide');
            if (slideImg) {
                slideImg.style.opacity = '0';
                
                setTimeout(() => {
                    slideImg.style.opacity = '1';
                }, 300);
            }
            
            // 更新缩略图选中状态
            const thumbnails = document.querySelectorAll('.slide-thumbnail');
            if (thumbnails.length > 0) {
                thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
                
                // 假设缩略图的顺序与幻灯片顺序对应，选中当前幻灯片的缩略图
                // 由于示例中只有几个缩略图，这里只是模拟效果
                const idx = (currentSlide - 13) % thumbnails.length;
                if (idx >= 0 && idx < thumbnails.length) {
                    thumbnails[idx].classList.add('active');
                }
            }
        }
        
        // 缩略图点击事件
        const thumbnails = document.querySelectorAll('.slide-thumbnail');
        if (thumbnails.length > 0) {
            thumbnails.forEach((thumbnail, idx) => {
                thumbnail.addEventListener('click', () => {
                    // 修改: 避免读取不存在的元素
                    currentSlide = 13 + idx;
                    updateSlideDisplay();
                });
            });
        }
    }
    
    // 全屏和批注按钮
    const fullscreenBtn = document.querySelector('#slides-panel .panel-btn:nth-child(1)');
    const annotateBtn = document.querySelector('#slides-panel .panel-btn:nth-child(2)');
    const slidePreview = document.querySelector('.slide-preview');
    
    if (fullscreenBtn && annotateBtn && slidePreview) {
        fullscreenBtn.addEventListener('click', () => {
            toggleFullscreen();
        });
        
        annotateBtn.addEventListener('click', () => {
            showNotification('已启用批注模式', 'info');
        });
        
        // 全屏切换函数
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                slidePreview.requestFullscreen().catch(err => {
                    showNotification('全屏模式失败: ' + err.message, 'error');
                });
                slidePreview.classList.add('fullscreen');
            } else {
                document.exitFullscreen();
                slidePreview.classList.remove('fullscreen');
            }
        }
        
        // 全屏状态变化监听
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                slidePreview.classList.remove('fullscreen');
            }
        });
        
        // 初始化全屏互动工具
        initFullscreenInteractionTools();
    }
}

/**
 * 初始化全屏模式下的互动工具
 */
function initFullscreenInteractionTools() {
    const interactionTools = document.querySelectorAll('.fullscreen-tool');
    const interactionModal = document.getElementById('interaction-modal');
    const closeInteractionBtn = document.querySelector('.close-interaction-btn');
    
    // 互动工具点击事件
    if (interactionTools.length > 0) {
        interactionTools.forEach(tool => {
            tool.addEventListener('click', () => {
                if (document.fullscreenElement) {
                    // 先退出全屏，再显示互动弹窗
                    document.exitFullscreen().then(() => {
                        setTimeout(() => {
                            openInteractionModal(tool.getAttribute('data-interaction'));
                        }, 300);
                    });
                } else {
                    openInteractionModal(tool.getAttribute('data-interaction'));
                }
            });
        });
    }
    
    // 关闭互动弹窗
    if (closeInteractionBtn) {
        closeInteractionBtn.addEventListener('click', () => {
            interactionModal.classList.remove('active');
        });
    }
    
    // 初始化显示答案按钮事件
    initShowAnswerButtons();
    
    // 打开互动弹窗并显示对应内容
    function openInteractionModal(interactionType) {
        if (!interactionModal) return;
        
        // 隐藏所有互动内容区域
        const interactionSections = interactionModal.querySelectorAll('.interaction-section');
        interactionSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // 根据互动类型显示对应内容
        const targetSection = document.getElementById(`${interactionType}-interaction`);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // 更新弹窗标题
            const headerZh = interactionModal.querySelector('.interaction-header .zh');
            const headerEn = interactionModal.querySelector('.interaction-header .en');
            
            if (headerZh && headerEn) {
                if (interactionType === 'quiz') {
                    headerZh.textContent = '课堂小测';
                    headerEn.textContent = 'Quiz';
                    
                    // 初始化题目导航
                    setTimeout(() => {
                        initQuizNavigation();
                    }, 100);
                } else if (interactionType === 'knowledge') {
                    headerZh.textContent = '知识拓展';
                    headerEn.textContent = 'Knowledge Expansion';
                } else if (interactionType === 'ideology') {
                    headerZh.textContent = '课程思政';
                    headerEn.textContent = 'Ideological Discussion';
                }
            }
            
            // 重置答案显示状态
            const answerContainers = targetSection.querySelectorAll('.answer-container');
            const showAnswerBtns = targetSection.querySelectorAll('.show-answer-btn');
            
            answerContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            showAnswerBtns.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
            });
            
            interactionModal.classList.add('active');
        }
    }
}

/**
 * 初始化显示答案按钮事件
 */
function initShowAnswerButtons() {
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.show-answer-btn')) {
            const btn = e.target.closest('.show-answer-btn');
            const answerContainer = btn.nextElementSibling;
            
            if (answerContainer && answerContainer.classList.contains('answer-container')) {
                if (answerContainer.style.display === 'none') {
                    // 显示答案
                    answerContainer.style.display = 'block';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i><span class="zh">隐藏答案</span><span class="en">Hide Answer</span>';
                } else {
                    // 隐藏答案
                    answerContainer.style.display = 'none';
                    btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
                }
            }
        }
    });
}

/**
 * 初始化互动功能
 */
function initClassInteraction() {
    // 互动类型切换
    const interactionTypes = document.querySelectorAll('.interaction-type');
    
    if (interactionTypes.length > 0) {
        interactionTypes.forEach(type => {
            type.addEventListener('click', () => {
                interactionTypes.forEach(t => t.classList.remove('active'));
                type.classList.add('active');
                
                const typeName = type.querySelector('.zh').textContent;
                showNotification(`已切换到: ${typeName}`, 'info');
            });
        });
    }
    
    // 发起互动按钮
    const startInteractionBtn = document.querySelector('.panel-btn.primary');
    
    if (startInteractionBtn) {
        startInteractionBtn.addEventListener('click', () => {
            const activeType = document.querySelector('.interaction-type.active');
            if (activeType) {
                const typeName = activeType.querySelector('.zh').textContent;
                showNotification(`正在发起: ${typeName}`, 'success');
            }
        });
    }
    
    // 弹幕发送功能
    const danmakuInput = document.querySelector('.danmaku-input.zh');
    const sendDanmakuBtn = document.querySelector('.send-danmaku-btn');
    const danmakuScreen = document.querySelector('.danmaku-screen');
    const sentimentBtns = document.querySelectorAll('.sentiment-btn');
    
    if (danmakuInput && sendDanmakuBtn && danmakuScreen && sentimentBtns.length > 0) {
        // 情感按钮切换
        sentimentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sentimentBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // 发送弹幕
        function sendDanmaku() {
            const content = danmakuInput.value.trim();
            if (content) {
                const danmaku = document.createElement('div');
                danmaku.classList.add('danmaku-item');
                
                // 添加情感类型
                const activeSentiment = document.querySelector('.sentiment-btn.active');
                if (activeSentiment) {
                    if (activeSentiment.classList.contains('agree')) {
                        danmaku.classList.add('agree');
                    } else if (activeSentiment.classList.contains('disagree')) {
                        danmaku.classList.add('disagree');
                    }
                }
                
                danmaku.textContent = content;
                
                // 随机高度
                const top = Math.floor(Math.random() * 150) + 10;
                danmaku.style.top = `${top}px`;
                
                danmakuScreen.appendChild(danmaku);
                danmakuInput.value = '';
                
                // 弹幕动画结束后移除元素
                danmaku.addEventListener('animationend', () => {
                    danmaku.remove();
                });
            }
        }
        
        // 点击发送按钮
        sendDanmakuBtn.addEventListener('click', sendDanmaku);
        
        // 按下回车键发送
        danmakuInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendDanmaku();
            }
        });
        
        // 弹幕设置按钮
        const danmakuSettingBtns = document.querySelectorAll('.danmaku-setting-btn');
        
        if (danmakuSettingBtns.length >= 3) {
            // 设置按钮
            danmakuSettingBtns[0].addEventListener('click', () => {
                showNotification('弹幕设置已打开', 'info');
            });
            
            // 暂停/继续按钮
            let isPaused = false;
            danmakuSettingBtns[1].addEventListener('click', () => {
                isPaused = !isPaused;
                
                if (isPaused) {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-play"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'paused';
                    });
                    showNotification('弹幕已暂停', 'info');
                } else {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-pause"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'running';
                    });
                    showNotification('弹幕已继续', 'info');
                }
            });
            
            // 清空按钮
            danmakuSettingBtns[2].addEventListener('click', () => {
                danmakuScreen.innerHTML = '';
                showNotification('弹幕已清空', 'info');
            });
        }
    }
}

/**
 * 初始化课堂数据分析
 */
function initClassDataAnalysis() {
    // 导出数据按钮
    const exportDataBtn = document.querySelector('#class-data-panel .panel-btn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            showNotification('正在导出课堂数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('课堂数据已导出', 'success');
            }, 800);
        });
    }
    
    // 这里可以添加图表初始化代码，但由于示例中使用的是占位图像，暂不实现
}

/**
 * 初始化学情画像功能
 * 处理学生数据的筛选、排序、查询等交互功能
 */
function initStudentProfile() {
    // 初始化筛选功能
    initProfileFilters();
    
    // 初始化表格操作和分页功能
    initProfileTable();
    
    // 初始化搜索和批量操作功能
    initProfileSearch();
    
    // 初始化表格内操作按钮功能
    initTableActions();
}

/**
 * 初始化筛选功能
 */
function initProfileFilters() {
    const classSelect = document.getElementById('class-select');
    const dateFilter = document.querySelector('.filter-date');
    const filterBtn = document.querySelector('.filter-btn:not(.reset)');
    const resetBtn = document.querySelector('.filter-btn.reset');
    
    if (!classSelect || !dateFilter || !filterBtn || !resetBtn) return;
    
    // 筛选按钮点击事件
    filterBtn.addEventListener('click', () => {
        const selectedClass = classSelect.value;
        const selectedDate = dateFilter.value;
        
        // 模拟筛选操作
        showNotification('正在应用筛选条件...', 'info');
        
        // 这里可以添加实际的筛选逻辑，向后端发送请求等
        setTimeout(() => {
            let message = '';
            
            if (selectedClass !== 'all') {
                const classText = document.querySelector(`#class-select option[value="${selectedClass}"]`).textContent;
                const className = document.body.classList.contains('en-mode') ? 
                    classText.trim() : classText.trim();
                message += `班级: ${className}, `;
            }
            
            if (selectedDate) {
                const dateObj = new Date(selectedDate);
                const formattedDate = dateObj.toLocaleDateString();
                message += `截止日期: ${formattedDate}`;
            }
            
            if (message) {
                showNotification(`筛选已应用: ${message}`, 'success');
            } else {
                showNotification('筛选已应用', 'success');
            }
        }, 500);
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', () => {
        classSelect.value = 'all';
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateFilter.value = `${year}-${month}-${day}`;
        
        showNotification('筛选条件已重置', 'info');
    });
}

/**
 * 初始化表格操作和分页功能
 */
function initProfileTable() {
    const selectAll = document.getElementById('select-all');
    const studentCheckboxes = document.querySelectorAll('.student-checkbox');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const paginationSelect = document.querySelector('.pagination-select');
    
    if (!selectAll || studentCheckboxes.length === 0) return;
    
    // 全选/取消全选
    selectAll.addEventListener('change', () => {
        studentCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    });
    
    // 单个复选框更新全选状态
    studentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(studentCheckboxes).every(cb => cb.checked);
            const anyChecked = Array.from(studentCheckboxes).some(cb => cb.checked);
            
            selectAll.checked = allChecked;
            selectAll.indeterminate = anyChecked && !allChecked;
        });
    });
    
    // 分页按钮点击
    if (paginationBtns.length > 0) {
        paginationBtns.forEach(btn => {
            if (!btn.disabled && !btn.classList.contains('active')) {
                btn.addEventListener('click', () => {
                    // 获取页码
                    const page = btn.textContent;
                    if (!isNaN(page)) {
                        // 数字页码按钮
                        paginationBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        showNotification(`已切换到第 ${page} 页`, 'info');
                    } else if (btn.querySelector('i.fa-chevron-left')) {
                        // 上一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.previousElementSibling && 
                            activePage.previousElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.previousElementSibling.classList.add('active');
                            showNotification(`已切换到上一页`, 'info');
                        }
                    } else if (btn.querySelector('i.fa-chevron-right')) {
                        // 下一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.nextElementSibling && 
                            activePage.nextElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.nextElementSibling.classList.add('active');
                            showNotification(`已切换到下一页`, 'info');
                        }
                    }
                });
            }
        });
    }
    
    // 每页显示数量选择
    if (paginationSelect) {
        paginationSelect.addEventListener('change', () => {
            const perPage = paginationSelect.value;
            showNotification(`每页显示数量已更改为 ${perPage}`, 'info');
        });
    }
}

/**
 * 初始化搜索和批量操作功能
 */
function initProfileSearch() {
    const searchInputs = document.querySelectorAll('.profile-search .search-input');
    const exportBtn = document.querySelector('.action-btn.export');
    const batchBtn = document.querySelector('.action-btn.batch');
    
    // 搜索功能
    if (searchInputs.length > 0) {
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = input.value.trim();
                    if (searchTerm) {
                        showNotification(`正在搜索: ${searchTerm}`, 'info');
                        
                        // 这里可以添加实际的搜索逻辑
                        setTimeout(() => {
                            showNotification(`已找到与 "${searchTerm}" 相关的结果`, 'success');
                        }, 500);
                    }
                }
            });
        });
    }
    
    // 导出数据按钮
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showNotification('正在准备导出数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('数据已成功导出', 'success');
            }, 800);
        });
    }
    
    // 批量操作按钮
    if (batchBtn) {
        batchBtn.addEventListener('click', () => {
            const checkedStudents = document.querySelectorAll('.student-checkbox:checked');
            
            if (checkedStudents.length === 0) {
                showNotification('请先选择学生', 'warning');
                return;
            }
            
            showNotification(`已选择 ${checkedStudents.length} 名学生，准备批量操作`, 'info');
            
            // 这里可以添加实际的批量操作逻辑，例如显示操作菜单等
        });
    }
}

/**
 * 初始化表格内操作按钮功能
 */
function initTableActions() {
    const viewBtns = document.querySelectorAll('.table-btn.view');
    const gradeBtns = document.querySelectorAll('.table-btn.grade');
    const messageBtns = document.querySelectorAll('.table-btn.message');
    
    // 查看学生画像
    if (viewBtns.length > 0) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                const studentId = row.cells[2].textContent;
                
                showNotification(`查看学生画像: ${studentName} (${studentId})`, 'info');
                
                // 这里可以添加打开学生详情模态框的逻辑
            });
        });
    }
    
    // 批阅作业
    if (gradeBtns.length > 0) {
        gradeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`正在批阅 ${studentName} 的作业`, 'info');
                
                // 这里可以添加打开批阅界面的逻辑
            });
        });
    }
    
    // 发送消息
    if (messageBtns.length > 0) {
        messageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`发送消息给 ${studentName}`, 'info');
                
                // 这里可以添加打开消息对话框的逻辑
            });
        });
    }
}

/**
 * 初始化中国文化演化模块
 * 处理文化演化模块中的视图切换、交互等功能
 */
function initCultureEvolution() {
    // 初始化视图切换
    initViewModes();
    
    // 初始化时间轴功能
    initTimelineView();
    
    // 初始化地图视图功能
    initMapView();
    
    // 初始化关系图视图功能
    initRelationView();
    
    // 初始化文化元素卡片功能
    initElementCard();
}

/**
 * 初始化视图模式切换功能
 */
function initViewModes() {
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const evolutionViews = document.querySelectorAll('.evolution-view');
    
    if (viewModeBtns.length === 0 || evolutionViews.length === 0) return;
    
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的活动状态
            viewModeBtns.forEach(b => b.classList.remove('active'));
            // 为当前点击的按钮添加活动状态
            btn.classList.add('active');
            
            // 获取要显示的视图模式
            const viewMode = btn.getAttribute('data-mode');
            
            // 隐藏所有视图
            evolutionViews.forEach(view => view.classList.remove('active'));
            
            // 显示对应的视图
            document.querySelector(`.${viewMode}-view`).classList.add('active');
            
            // 视图切换通知
            const modeName = btn.querySelector('.zh').textContent;
            showNotification(`已切换到${modeName}视图`, 'info');
        });
    });
    
    // 类别和朝代筛选下拉框
    const filterSelects = document.querySelectorAll('.evolution-filters .filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            const filterType = select.querySelector('option:checked').classList.contains('zh') ? 
                select.previousElementSibling.querySelector('.zh').textContent : 
                select.previousElementSibling.querySelector('.en').textContent;
            
            const selectedValue = select.value;
            const selectedText = select.querySelector(`option[value="${selectedValue}"]`).textContent;
            
            showNotification(`已筛选${filterType}: ${selectedText}`, 'info');
            
            // 根据视图模式应用不同的筛选逻辑
            const activeView = document.querySelector('.evolution-view.active');
            
            if (activeView.classList.contains('timeline-view')) {
                applyTimelineFilter(selectedValue);
            } else if (activeView.classList.contains('map-view')) {
                applyMapFilter(selectedValue);
            } else if (activeView.classList.contains('relation-view')) {
                applyRelationFilter(selectedValue);
            }
        });
    });
}

/**
 * 应用时间轴视图筛选
 * @param {string} filter - 筛选条件
 */
function applyTimelineFilter(filter) {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    if (filter === 'all') {
        // 显示所有节点
        timelineNodes.forEach(node => {
            node.style.display = 'block';
        });
        return;
    }
    
    // 筛选节点
    timelineNodes.forEach(node => {
        // 检查节点是否符合筛选条件（类别或朝代）
        const nodeCategory = node.getAttribute('data-category');
        
        if (nodeCategory === filter) {
            node.style.display = 'block';
        } else {
            node.style.display = 'none';
        }
    });
}

/**
 * 应用地图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyMapFilter(filter) {
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    if (filter === 'all') {
        // 显示所有标记
        mapMarkers.forEach(marker => {
            marker.style.display = 'block';
        });
        return;
    }
    
    // 筛选标记
    mapMarkers.forEach(marker => {
        // 检查标记是否符合筛选条件（朝代）
        const markerEra = marker.getAttribute('data-era');
        
        if (markerEra === filter) {
            marker.style.display = 'block';
        } else {
            marker.style.display = 'none';
        }
    });
}

/**
 * 应用关系图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyRelationFilter(filter) {
    // 这里通常会与可视化库（如D3.js）集成
    // 目前仅显示通知
    showNotification(`关系图筛选已应用: ${filter}`, 'info');
}

/**
 * 初始化时间轴视图功能
 */
function initTimelineView() {
    // 缩放控制
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    const zoomSlider = document.querySelector('.zoom-slider input');
    
    if (zoomSlider) {
        // 缩放滑块
        zoomSlider.addEventListener('input', () => {
            const zoomLevel = zoomSlider.value;
            applyTimelineZoom(zoomLevel);
        });
        
        // 缩放按钮
        if (zoomButtons.length >= 2) {
            // 缩小按钮
            zoomButtons[0].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.max(1, currentZoom - 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
            
            // 放大按钮
            zoomButtons[1].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.min(10, currentZoom + 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
        }
    }
    
    // 时间轴导航
    const navigationButtons = document.querySelectorAll('.navigation-btn');
    const timelineEras = document.querySelectorAll('.timeline-era');
    let currentEraIndex = 2; // 默认选中"秦汉"时期
    
    if (navigationButtons.length >= 2 && timelineEras.length > 0) {
        // 上一个时期按钮
        navigationButtons[0].addEventListener('click', () => {
            if (currentEraIndex > 0) {
                currentEraIndex--;
                updateActiveEra();
            }
        });
        
        // 下一个时期按钮
        navigationButtons[1].addEventListener('click', () => {
            if (currentEraIndex < timelineEras.length - 1) {
                currentEraIndex++;
                updateActiveEra();
            }
        });
        
        // 时期点击事件
        timelineEras.forEach((era, index) => {
            era.addEventListener('click', () => {
                currentEraIndex = index;
                updateActiveEra();
            });
        });
        
        // 更新活动时期
        function updateActiveEra() {
            // 更新时期高亮
            timelineEras.forEach(era => era.classList.remove('active'));
            timelineEras[currentEraIndex].classList.add('active');
            
            // 更新导航信息
            const eraLabelZh = timelineEras[currentEraIndex].querySelector('.era-label .zh').textContent;
            const eraLabelEn = timelineEras[currentEraIndex].querySelector('.era-label .en').textContent;
            
            // 模拟不同时期的年代范围
            const eraDates = [
                {zh: '史前时期 (约公元前8000年-前2070年)', en: 'Prehistoric Period (ca. 8000-2070 BC)'},
                {zh: '夏商周时期 (约公元前2070年-前221年)', en: 'Xia-Shang-Zhou Period (ca. 2070-221 BC)'},
                {zh: '秦汉时期 (公元前221年-公元220年)', en: 'Qin-Han Period (221 BC-220 AD)'},
                {zh: '隋唐时期 (公元581年-907年)', en: 'Sui-Tang Period (581-907 AD)'},
                {zh: '宋元时期 (公元960年-1368年)', en: 'Song-Yuan Period (960-1368 AD)'},
                {zh: '明清时期 (公元1368年-1912年)', en: 'Ming-Qing Period (1368-1912 AD)'},
                {zh: '近现代 (公元1912年至今)', en: 'Modern Period (1912-Present)'}
            ];
            
            const navigationInfoZh = document.querySelector('.navigation-info.zh');
            const navigationInfoEn = document.querySelector('.navigation-info.en');
            
            if (navigationInfoZh && navigationInfoEn) {
                navigationInfoZh.textContent = eraDates[currentEraIndex].zh;
                navigationInfoEn.textContent = eraDates[currentEraIndex].en;
            }
            
            // 通知
            showNotification(`已切换到${eraLabelZh}时期`, 'info');
            
            // 更新时间轴上显示的节点
            updateVisibleTimelineNodes();
        }
        
        // 更新可见的时间轴节点
        function updateVisibleTimelineNodes() {
            // 这里可以根据当前选中的时期，显示/隐藏相应的节点
            // 现在简单模拟这个效果
            const eraLeftPosition = [10, 25, 45, 65, 80, 90, 95]; // 时期的大致位置百分比
            const timelineNodes = document.querySelectorAll('.timeline-node');
            
            timelineNodes.forEach(node => {
                const nodeLeft = parseFloat(node.style.left);
                
                // 简单判断节点是否应该在当前时期显示
                // 实际应用中可以使用具体的时间数据来判断
                const lowerBound = currentEraIndex > 0 ? eraLeftPosition[currentEraIndex - 1] : 0;
                const upperBound = currentEraIndex < eraLeftPosition.length - 1 ? eraLeftPosition[currentEraIndex + 1] : 100;
                
                if (nodeLeft >= lowerBound && nodeLeft <= upperBound) {
                    node.style.display = 'block';
                } else {
                    node.style.display = 'none';
                }
            });
        }
    }
    
    // 绑定节点点击事件
    bindTimelineNodeEvents();
}

/**
 * 应用时间轴缩放
 * @param {number} level - 缩放级别
 */
function applyTimelineZoom(level) {
    const timelineItems = document.querySelector('.timeline-items');
    
    if (!timelineItems) return;
    
    // 缩放效果，基础高度为300px，最大可以放大到700px
    const newHeight = 300 + level * 40;
    timelineItems.style.height = `${newHeight}px`;
    
    // 通知
    showNotification(`时间轴缩放级别: ${level}`, 'info');
}

/**
 * 绑定时间轴节点点击事件
 */
function bindTimelineNodeEvents() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    timelineNodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeTitle = node.querySelector('.node-title .zh').textContent;
            
            // 显示文化元素详情卡片
            showElementCard(nodeTitle, node.getAttribute('data-category'));
        });
    });
}

/**
 * 初始化地图视图功能
 */
function initMapView() {
    // 地图标记点点击事件
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const markerLabel = marker.querySelector('.marker-label .zh').textContent;
            
            // 显示地点信息面板
            showLocationInfo(markerLabel);
        });
    });
    
    // 信息面板关闭按钮
    const closeInfoBtn = document.querySelector('.map-info-panel .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoPanel = document.querySelector('.map-info-panel');
            
            if (infoPanel) {
                infoPanel.style.display = 'none';
            }
        });
    }
}

/**
 * 显示地点信息
 * @param {string} location - 地点名称
 */
function showLocationInfo(location) {
    const infoPanel = document.querySelector('.map-info-panel');
    const infoItems = document.querySelectorAll('.info-item');
    
    if (!infoPanel || infoItems.length === 0) return;
    
    // 显示信息面板
    infoPanel.style.display = 'block';
    
    // 根据地点名称匹配相应的信息项
    let found = false;
    
    infoItems.forEach(item => {
        const itemLocation = item.getAttribute('data-location');
        
        if (itemLocation && (itemLocation === location.toLowerCase() || itemLocation.includes(location.toLowerCase()))) {
            // 显示匹配的信息项
            infoItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            found = true;
        }
    });
    
    // 如果没有找到匹配的信息项，使用第一个作为默认
    if (!found && infoItems.length > 0) {
        infoItems.forEach(i => i.classList.remove('active'));
        infoItems[0].classList.add('active');
    }
    
    // 通知
    showNotification(`正在查看: ${location}`, 'info');
}

/**
 * 初始化关系图视图功能
 */
function initRelationView() {
    // 信息框关闭按钮
    const closeInfoBtn = document.querySelector('.graph-info-box .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoBox = document.querySelector('.graph-info-box');
            
            if (infoBox) {
                infoBox.style.display = 'none';
            }
        });
    }
    
    // 关系图点击（使用占位图像模拟）
    const graphPlaceholder = document.querySelector('.graph-placeholder');
    
    if (graphPlaceholder) {
        graphPlaceholder.addEventListener('click', event => {
            // 获取点击位置相对于图像的坐标
            const rect = graphPlaceholder.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // 显示信息框
            showGraphInfo(x, y);
        });
    }
}

/**
 * 显示关系图信息
 * @param {number} x - 点击X坐标
 * @param {number} y - 点击Y坐标
 */
function showGraphInfo(x, y) {
    const infoBox = document.querySelector('.graph-info-box');
    
    if (!infoBox) return;
    
    // 显示信息框
    infoBox.style.display = 'block';
    
    // 通知
    showNotification('已选择关系图元素', 'info');
}

/**
 * 初始化文化元素卡片功能
 */
function initElementCard() {
    // 卡片关闭按钮
    const closeCardBtn = document.querySelector('.culture-element-card .close-card-btn');
    
    if (closeCardBtn) {
        closeCardBtn.addEventListener('click', () => {
            hideElementCard();
        });
    }
    
    // 卡片操作按钮
    const elementBtns = document.querySelectorAll('.element-actions .element-btn');
    
    elementBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const btnText = btn.querySelector('.zh').textContent;
            showNotification(`执行操作: ${btnText}`, 'info');
        });
    });
    
    // 相关元素标签点击
    const elementTags = document.querySelectorAll('.element-tags li');
    
    elementTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.querySelector('.zh').textContent;
            showNotification(`正在查看: ${tagText}`, 'info');
            
            // 模拟加载新的元素详情
            setTimeout(() => {
                showElementCard(tagText);
            }, 500);
        });
    });
}

/**
 * 显示文化元素详情卡片
 * @param {string} elementName - 元素名称
 * @param {string} category - 元素类别
 */
function showElementCard(elementName, category = 'material') {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 更新卡片类别
    const elementCategory = elementCard.querySelector('.element-category');
    
    if (elementCategory) {
        // 移除之前的类别
        elementCategory.classList.remove('material', 'institutional', 'spiritual');
        
        // 添加新的类别
        elementCategory.classList.add(category);
        
        // 更新类别文本
        const categoryTextZh = elementCategory.querySelector('.zh');
        const categoryTextEn = elementCategory.querySelector('.en');
        
        if (categoryTextZh && categoryTextEn) {
            switch (category) {
                case 'material':
                    categoryTextZh.textContent = '物质文化';
                    categoryTextEn.textContent = 'Material Culture';
                    break;
                case 'institutional':
                    categoryTextZh.textContent = '制度文化';
                    categoryTextEn.textContent = 'Institutional Culture';
                    break;
                case 'spiritual':
                    categoryTextZh.textContent = '精神文化';
                    categoryTextEn.textContent = 'Spiritual Culture';
                    break;
            }
        }
    }
    
    // 显示卡片
    elementCard.classList.add('show');
    
    // 通知
    showNotification(`正在查看文化元素: ${elementName}`, 'info');
}

/**
 * 隐藏文化元素详情卡片
 */
function hideElementCard() {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 隐藏卡片
    elementCard.classList.remove('show');
}

/**
 * 初始化内容生成弹窗
 * 处理内容生成弹窗的打开、关闭和交互
 */
function initContentGenerateModal() {
    const modal = document.getElementById('contentGenerateModal');
    const openBtn = document.querySelector('.action-button:nth-child(2)'); // 内容生成按钮
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const generateBtn = modal.querySelector('.generate-btn');
    const tabBtns = modal.querySelectorAll('.generate-tab-btn');
    const tabContents = modal.querySelectorAll('.generate-tab-content');
    const styleBtns = modal.querySelectorAll('.style-btn');
    const sizeBtns = modal.querySelectorAll('.size-btn');
    
    // 打开弹窗
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    }
    
    // 关闭弹窗
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
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
            
            // 模拟生成过程
            setTimeout(() => {
                resultPlaceholder.style.display = 'none';
                
                if (activeTab.id === 'text2text-content') {
                    // 文生文结果
                    const generatedText = activeTab.querySelector('.generated-text');
                    generatedText.style.display = 'block';
                    generatedText.innerHTML = `<h3>中国传统绘画的特点与技法</h3>
<p>中国传统绘画是中华文明的重要组成部分，具有悠久的历史和独特的艺术魅力。以下从几个方面介绍中国传统绘画的主要特点与技法：</p>

<h4>一、中国传统绘画的特点</h4>

<p>1. <strong>以线造型</strong>：中国画以线条为主要表现手段，讲究"线条用笔"，通过不同的线条变化来表现物象的形态和质感。</p>

<p>2. <strong>写意精神</strong>：强调艺术家的主观表达，不追求对客观对象的完全模仿，而是追求"神似"而非"形似"。</p>

<p>3. <strong>虚实结合</strong>：画面中有意识地留白，使实与虚、有与无相互映衬，达到"虚实相生"的艺术效果。</p>

<p>4. <strong>诗书画印结合</strong>：中国画常与诗文、书法、印章相结合，形成独特的综合艺术形式。</p>

<h4>二、主要技法</h4>

<p>1. <strong>用笔技法</strong>：</p>
<ul>
    <li>钩勒：以线条勾画轮廓</li>
    <li>皴法：表现山石纹理的技法</li>
    <li>点法：用笔尖点画，表现叶、花等</li>
    <li>擦法：用侧锋轻擦，表现烟云等</li>
</ul>

<p>2. <strong>用墨技法</strong>：</p>
<ul>
    <li>焦墨：墨色浓重</li>
    <li>浓墨：墨色较重</li>
    <li>淡墨：墨色较淡</li>
    <li>破墨：墨色深浅相间</li>
    <li>渴墨：干笔擦出的效果</li>
</ul>

<p>3. <strong>设色技法</strong>：</p>
<ul>
    <li>工笔重彩：精细描绘，色彩浓重</li>
    <li>淡彩：颜色淡雅</li>
    <li>水墨渲染：水墨晕染效果</li>
    <li>泼墨泼彩：随意挥洒墨与彩</li>
</ul>

<h4>三、主要流派</h4>

<p>1. <strong>北宋山水画</strong>：以范宽、郭熙、李成为代表，追求雄伟壮丽的山水风貌。</p>

<p>2. <strong>南宋院体画</strong>：以马远、夏圭为代表，形成"马一角"、"夏半边"的构图特点。</p>

<p>3. <strong>元代文人画</strong>：以黄公望、吴镇、倪瓒、王蒙"元四家"为代表，重视个人情感表达。</p>

<p>4. <strong>明清写意画</strong>：以徐渭、八大山人、石涛等为代表，笔墨更加随意奔放。</p>

<p>通过学习和掌握这些特点与技法，可以更好地理解和欣赏中国传统绘画的艺术魅力，也为创作实践提供参考和指导。</p>`;
                } else {
                    // 文生图结果
                    const generatedImages = activeTab.querySelector('.generated-images');
                    generatedImages.style.display = 'flex';
                    generatedImages.innerHTML = `
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=中国山水画" alt="生成的图像1">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=青山绿水" alt="生成的图像2">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=亭台楼阁" alt="生成的图像3">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=飞鸟山水" alt="生成的图像4">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                    `;
                    
                    // 给生成的图片添加悬停效果和按钮功能
                    const imageActions = document.querySelectorAll('.image-actions button');
                    imageActions.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            showNotification('图片操作成功', 'success');
                        });
                    });
                }
                
                // 添加结果操作按钮事件
                const actionBtns = activeTab.querySelectorAll('.result-action-btn');
                actionBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (btn.classList.contains('regenerate')) {
                            showNotification('正在重新生成内容...', 'info');
                        } else if (btn.classList.contains('copy')) {
                            showNotification('内容已复制到剪贴板', 'success');
                        } else if (btn.classList.contains('download')) {
                            showNotification('图片已下载', 'success');
                        } else if (btn.classList.contains('insert')) {
                            showNotification('内容已插入到课件', 'success');
                            closeModal();
                        }
                    });
                });
                
            }, 2000);
        });
    }
}

/**
 * 处理标签切换，包括隐藏生成的题目列表
 */
function initTabSwitching() {
    // 标签按钮点击事件
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动标签
            tabBtns.forEach(tb => tb.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // 激活目标标签
            this.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
            
            // 隐藏生成的题目列表，除非是在 quiz 标签中
            const generatedQuestionsList = document.querySelector('.generated-questions-list');
            if (generatedQuestionsList) {
                if (targetTab === 'quiz') {
                    // 只有在生成过题目后才显示题目列表
                    const quizResult = document.querySelector('.quiz-result');
                    if (quizResult && window.getComputedStyle(quizResult).display !== 'none') {
                        generatedQuestionsList.style.display = 'block';
                    } else {
                        generatedQuestionsList.style.display = 'none';
                    }
                } else {
                    generatedQuestionsList.style.display = 'none';
                }
            }
        });
    });
}

/**
 * 初始化内容区域功能
 */
function initContentSections() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitles = document.querySelectorAll('.current-page-title');
    
    // 在页面加载时隐藏生成的题目列表
    const generatedQuestionsList = document.querySelector('.generated-questions-list');
    if (generatedQuestionsList) {
        generatedQuestionsList.style.display = 'none';
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 更新导航项目状态
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // 更新页面标题
            const sectionName = this.querySelector('.nav-text.zh').textContent;
            pageTitles.forEach(title => {
                if (title.classList.contains('zh')) {
                    title.textContent = sectionName;
                } else {
                    title.textContent = this.querySelector('.nav-text.en').textContent;
                }
            });
            
            // 更新内容部分
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('id') === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
            
            // 隐藏生成的题目列表（如果不在相关部分）
            if (generatedQuestionsList) {
                generatedQuestionsList.style.display = 'none';
            }
        });
    });
}

/**
 * 初始化课程思政功能
 */
function initIdeology() {
    // 思政案例生成按钮
    const ideologyGenerateBtn = document.querySelector('.ideology-generation .generate-btn');
    
    if (ideologyGenerateBtn) {
        ideologyGenerateBtn.addEventListener('click', function() {
            showNotification('正在生成思政案例...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                // 获取表单内容
                const themeInput = document.querySelector('.ideology-generation .prompt-input.zh');
                const caseType = document.querySelector('.ideology-generation .ideology-select:first-of-type');
                const caseLength = document.querySelector('.ideology-generation .ideology-select:last-of-type');
                
                // 生成案例内容（这里是示例内容）
                let generatedCase = '';
                if (themeInput && themeInput.value) {
                    const theme = themeInput.value;
                    const type = caseType ? caseType.options[caseType.selectedIndex].text : '故事型案例';
                    const length = caseLength ? caseLength.options[caseLength.selectedIndex].text : '中等';
                    
                    generatedCase = `【${type}】关于"${theme}"的思政案例\n\n`;
                    generatedCase += `这是一个${length}的思政案例示例，主题围绕"${theme}"展开。\n\n`;
                    generatedCase += `在中华优秀传统文化的传承与创新中，"${theme}"始终是一个重要的思想内核。`;
                    generatedCase += `本案例通过具体的历史事件和现代案例，深入阐述了"${theme}"在当代中国发展中的重要意义。`;
                    generatedCase += `学生通过学习本案例，可以更好地理解中华文化的精髓，增强文化自信。`;
                } else {
                    generatedCase = '请先输入思政案例主题...';
                }
                
                // 更新结果区域
                const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
                if (caseTextarea) {
                    caseTextarea.value = generatedCase;
                }
                
                // 显示结果区域
                const ideologyResult = document.querySelector('.ideology-result');
                if (ideologyResult) {
                    ideologyResult.style.display = 'block';
                }
                
                showNotification('思政案例生成成功！', 'success');
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.ideology-result .result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span.zh').textContent;
            const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
            
            switch (action) {
                case '编辑':
                    if (caseTextarea) {
                        caseTextarea.readOnly = false;
                        caseTextarea.focus();
                        showNotification('您可以编辑思政案例内容', 'info');
                    }
                    break;
                    
                case '复制':
                    if (caseTextarea) {
                        caseTextarea.select();
                        document.execCommand('copy');
                        showNotification('案例内容已复制到剪贴板', 'success');
                    }
                    break;
                    
                case '重新生成':
                    showNotification('正在重新生成案例...', 'info');
                    document.querySelector('.ideology-generation .generate-btn').click();
                    break;
            }
        });
    });
}

// 新建思政案例功能
document.addEventListener('DOMContentLoaded', function() {
    const createCaseBtn = document.getElementById('createCaseBtn');
    const createCaseModal = document.getElementById('createCaseModal');
    const closeBtn = createCaseModal.querySelector('.close-btn');
    const cancelBtn = createCaseModal.querySelector('.btn-cancel');
    const saveBtn = document.getElementById('saveNewCaseBtn');
    
    // 打开模态框
    createCaseBtn.addEventListener('click', function() {
        createCaseModal.classList.add('active');
    });
    
    // 关闭模态框
    function closeModal() {
        createCaseModal.classList.remove('active');
        // 清空表单
        document.getElementById('caseTitleInput').value = '';
        document.getElementById('caseContentInput').value = '';
        // 重置复选框
        const checkboxes = document.querySelectorAll('input[name="resourceType"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 保存新案例
    saveBtn.addEventListener('click', function() {
        const title = document.getElementById('caseTitleInput').value.trim();
        const content = document.getElementById('caseContentInput').value.trim();
        const selectedResources = [];
        
        document.querySelectorAll('input[name="resourceType"]:checked').forEach(checkbox => {
            selectedResources.push(checkbox.value);
        });
        
        if (title === '') {
            alert('请输入案例标题');
            return;
        }
        
        if (content === '') {
            alert('请输入案例内容');
            return;
        }
        
        // 这里可以添加保存逻辑，如API调用或本地存储
        
        // 模拟添加到列表
        addNewCaseToList(title, selectedResources);
        
        // 关闭模态框
        closeModal();
    });
    
    // 添加新案例到列表
    function addNewCaseToList(title, resources) {
        const casesTable = document.querySelector('.cases-table tbody');
        const rowCount = casesTable.querySelectorAll('tr').length + 1;
        
        const newRow = document.createElement('tr');
        
        // 创建序号单元格
        const numCell = document.createElement('td');
        numCell.textContent = rowCount;
        
        // 创建标题单元格
        const titleCell = document.createElement('td');
        const zhTitle = document.createElement('p');
        zhTitle.className = 'zh';
        zhTitle.textContent = title;
        const enTitle = document.createElement('p');
        enTitle.className = 'en';
        enTitle.textContent = title; // 在实际应用中可能需要翻译
        titleCell.appendChild(zhTitle);
        titleCell.appendChild(enTitle);
        
        // 创建资源标签单元格
        const resourceCell = document.createElement('td');
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'resource-tags';
        
        resources.forEach(resource => {
            const tagSpan = document.createElement('span');
            tagSpan.className = `resource-tag ${resource}`;
            const icon = document.createElement('i');
            
            if (resource === 'image') {
                icon.className = 'fas fa-image';
            } else if (resource === 'video') {
                icon.className = 'fas fa-video';
            } else if (resource === 'link') {
                icon.className = 'fas fa-link';
            }
            
            tagSpan.appendChild(icon);
            tagsDiv.appendChild(tagSpan);
        });
        
        resourceCell.appendChild(tagsDiv);
        
        // 创建操作按钮单元格
        const actionCell = document.createElement('td');
        
        const viewBtn = document.createElement('button');
        viewBtn.className = 'case-action-btn view';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'case-action-btn edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'case-action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        actionCell.appendChild(viewBtn);
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        
        // 将所有单元格添加到行
        newRow.appendChild(numCell);
        newRow.appendChild(titleCell);
        newRow.appendChild(resourceCell);
        newRow.appendChild(actionCell);
        
        // 将行添加到表格
        casesTable.appendChild(newRow);
    }
}); 

// 全屏功能
function initFullscreenButton() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            editorContent.classList.toggle('fullscreen');
            
            // 切换全屏按钮图标
            const icon = fullscreenBtn.querySelector('i');
            if (editorContent.classList.contains('fullscreen')) {
                icon.classList.remove('fa-expand');
                icon.classList.add('fa-compress');
            } else {
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
        
        // ESC键退出全屏
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && editorContent.classList.contains('fullscreen')) {
                editorContent.classList.remove('fullscreen');
                const icon = fullscreenBtn.querySelector('i');
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
    }
}

// 在页面加载完成后初始化全屏按钮
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initFullscreenButton();
}); 

// 二维码弹窗功能
function initQrcodeModal() {
    // 更新选择器，确保准确找到签到二维码按钮
    const qrcodeBtn = document.querySelector('.panel-btn:not(.group-action-btn)');
    const qrcodeModal = document.getElementById('qrcodeModal');
    
    // 如果找不到相关元素，直接返回
    if (!qrcodeBtn || !qrcodeModal) {
        console.warn('签到二维码相关元素未找到');
        return;
    }
    
    const closeBtn = qrcodeModal.querySelector('.close-btn');
    const refreshBtn = qrcodeModal.querySelector('.refresh-btn');
    const downloadBtn = qrcodeModal.querySelector('.download-btn');
    
    // 确保二维码弹窗默认隐藏
    qrcodeModal.style.display = 'none';
    qrcodeModal.classList.remove('show');
    
    // 显示二维码弹窗
    qrcodeBtn.addEventListener('click', function() {
        qrcodeModal.style.display = 'flex';
        setTimeout(() => {
            qrcodeModal.classList.add('show');
        }, 10);
        generateQRCode();
        showNotification('二维码已生成，有效期5分钟', 'success');
    });
    
    // 关闭二维码弹窗
    closeBtn.addEventListener('click', function() {
        qrcodeModal.classList.remove('show');
        setTimeout(() => {
            qrcodeModal.style.display = 'none';
        }, 300);
    });
    
    // 点击弹窗外部关闭
    qrcodeModal.addEventListener('click', function(e) {
        if (e.target === qrcodeModal) {
            qrcodeModal.classList.remove('show');
            setTimeout(() => {
                qrcodeModal.style.display = 'none';
            }, 300);
        }
    });
    
    // 刷新二维码
    refreshBtn.addEventListener('click', function() {
        generateQRCode();
        showNotification('二维码已刷新，有效期重置为5分钟', 'info');
    });
    
    // 下载二维码
    downloadBtn.addEventListener('click', function() {
        // 获取二维码图片
        const qrImg = document.getElementById('checkinQRCode');
        
        // 创建一个临时链接
        const a = document.createElement('a');
        a.href = qrImg.src;
        a.download = '签到二维码.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('二维码已下载', 'success');
    });
}

// 模拟生成二维码的功能
function generateQRCode() {
    // 实际应用中，这里应该调用后端API生成真实的二维码
    // 此处仅做演示，随机更新二维码图片
    const qrImg = document.getElementById('checkinQRCode');
    const randomId = Math.floor(Math.random() * 1000);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=checkin_session_${randomId}`;
}

// 在文档加载完成后初始化二维码功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化其他功能...
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
}); 

// 初始化替换课件模态框
function initReplaceCoursewareModal() {
    // 此功能已移除
}

// 一键生成幻灯片功能
function initOneClickGeneration() {
    const oneClickGenBtn = document.querySelector('.js-one-click-generate');
    const oneClickModal = document.getElementById('oneClickGenerateModal');
    
    if (!oneClickGenBtn || !oneClickModal) return;
    
    const closeBtn = oneClickModal.querySelector('.modal-close');
    const generateBtn = oneClickModal.querySelector('.js-generate-slides');
    const cancelBtn = oneClickModal.querySelector('.js-cancel');
    const topicInput = oneClickModal.querySelector('#slideTopic');
    const slideCountSelect = oneClickModal.querySelector('#slideCount');
    const styleSelect = oneClickModal.querySelector('#slideStyle');
    const resultArea = oneClickModal.querySelector('.generation-result');
    const loadingIndicator = oneClickModal.querySelector('.loading-indicator');
    
    // 打开模态框
    oneClickGenBtn.addEventListener('click', () => {
        oneClickModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭模态框的函数
    function closeModal() {
        oneClickModal.classList.remove('show');
        document.body.style.overflow = '';
        // 重置表单
        resultArea.innerHTML = '';
        resultArea.style.display = 'none';
        loadingIndicator.style.display = 'none';
    }
    
    // 关闭模态框的事件
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 生成幻灯片
    generateBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        const slideCount = slideCountSelect.value;
        const style = styleSelect.value;
        
        if (!topic) {
            alert('请输入课件主题');
            return;
        }
        
        // 显示加载指示器
        loadingIndicator.style.display = 'flex';
        resultArea.style.display = 'none';
        
        // 模拟生成过程
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            resultArea.style.display = 'block';
            
            // 生成幻灯片预览
            displayGeneratedSlides(topic, slideCount, style);
        }, 3000);
    });
    
    // 显示生成的幻灯片预览
    function displayGeneratedSlides(topic, count, style) {
        const slides = generateSlideStructure(topic, count, style);
        
        let slidesPreviewHTML = `
            <div class="generation-header">
                <h3>已生成 ${count} 张幻灯片</h3>
                <div class="result-actions">
                    <button class="action-btn js-regenerate"><i class="fa fa-refresh"></i> 重新生成</button>
                    <button class="action-btn primary js-import-slides"><i class="fa fa-download"></i> 导入课件</button>
                </div>
            </div>
            <div class="slides-preview">
        `;
        
        slides.forEach((slide, index) => {
            slidesPreviewHTML += `
                <div class="slide-preview-item">
                    <div class="slide-number">${index + 1}</div>
                    <div class="slide-content" style="background-color: ${style === 'modern' ? '#f5f5f5' : style === 'traditional' ? '#f8f4e8' : '#fff'}">
                        <h4>${slide.title}</h4>
                        <div class="slide-body">
                            ${slide.content}
                        </div>
                    </div>
                </div>
            `;
        });
        
        slidesPreviewHTML += `</div>`;
        resultArea.innerHTML = slidesPreviewHTML;
        
        // 添加事件监听器
        const regenerateBtn = resultArea.querySelector('.js-regenerate');
        const importBtn = resultArea.querySelector('.js-import-slides');
        
        regenerateBtn.addEventListener('click', () => {
            loadingIndicator.style.display = 'flex';
            resultArea.style.display = 'none';
            
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                resultArea.style.display = 'block';
                displayGeneratedSlides(topic, count, style);
            }, 2000);
        });
        
        importBtn.addEventListener('click', () => {
            // 导入幻灯片到编辑器
            importGeneratedSlides(slides, styleType);
            closeModal();
        });
    }
    
    // 生成幻灯片结构
    function generateSlideStructure(topic, count, style) {
        const slides = [];
        
        // 添加封面
        slides.push({
            title: topic,
            content: `<div class="cover-slide"><p class="presenter">讲师: 李明</p><p class="date">2023年10月</p></div>`
        });
        
        // 添加目录
        if (count >= 5) {
            slides.push({
                title: "目录",
                content: `<ul class="toc">
                    <li>引言</li>
                    <li>主要内容</li>
                    <li>实例分析</li>
                    <li>总结与展望</li>
                </ul>`
            });
        }
        
        // 根据不同主题生成不同内容
        const topics = {
            "中国传统文化": [
                { title: "中国传统文化概述", content: `<p>中国传统文化源远流长，包含哲学、宗教、文学、艺术、建筑等多个方面。</p><ul><li>儒家思想</li><li>道家思想</li><li>佛教文化</li></ul>` },
                { title: "传统艺术", content: `<div class="two-column"><div><p>中国传统艺术形式多样：</p><ul><li>书法</li><li>绘画</li><li>戏曲</li></ul></div><div class="image-placeholder"></div></div>` },
                { title: "传统节日", content: `<table class="simple-table"><tr><th>节日</th><th>时间</th><th>习俗</th></tr><tr><td>春节</td><td>农历正月初一</td><td>贴春联、放鞭炮</td></tr><tr><td>端午节</td><td>农历五月初五</td><td>赛龙舟、吃粽子</td></tr></table>` },
                { title: "传统美德", content: `<p>中华民族传统美德:</p><div class="center-content"><div class="virtue">仁爱</div><div class="virtue">诚信</div><div class="virtue">礼义</div><div class="virtue">孝道</div></div>` }
            ],
            "人工智能基础": [
                { title: "什么是人工智能", content: `<p>人工智能(AI)是计算机科学的一个分支，致力于创造能够模拟人类智能的系统。</p><div class="image-placeholder"></div>` },
                { title: "机器学习基础", content: `<div class="two-column"><div><p>机器学习类型：</p><ul><li>监督学习</li><li>无监督学习</li><li>强化学习</li></ul></div><div class="image-placeholder"></div></div>` },
                { title: "神经网络结构", content: `<div class="center-content"><div class="image-placeholder"></div><p>神经网络由输入层、隐藏层和输出层组成</p></div>` },
                { title: "AI应用场景", content: `<table class="simple-table"><tr><th>领域</th><th>应用</th></tr><tr><td>医疗</td><td>疾病诊断、药物研发</td></tr><tr><td>金融</td><td>风险评估、算法交易</td></tr><tr><td>教育</td><td>个性化学习、智能评估</td></tr></table>` }
            ]
        };
        
        // 获取最接近的主题
        let bestMatch = "中国传统文化";
        if (topic.includes("智能") || topic.includes("AI") || topic.includes("机器学习")) {
            bestMatch = "人工智能基础";
        }
        
        // 添加主题相关幻灯片
        const relevantSlides = topics[bestMatch];
        const slidesToAdd = Math.min(relevantSlides.length, count - slides.length - 1); // 减去封面和结尾
        
        for (let i = 0; i < slidesToAdd; i++) {
            slides.push(relevantSlides[i]);
        }
        
        // 如果还需要更多幻灯片，添加占位符
        while (slides.length < count - 1) {
            slides.push({
                title: `${topic} - 补充内容 ${slides.length - 1}`,
                content: `<div class="placeholder-content"><p>这里是关于${topic}的补充内容</p><div class="image-placeholder"></div></div>`
            });
        }
        
        // 添加结尾幻灯片
        slides.push({
            title: "谢谢观看",
            content: `<div class="thank-you-slide"><p>感谢您的关注！</p><p>有任何问题请随时提问</p></div>`
        });
        
        return slides;
    }
    
    // 导入生成的幻灯片到编辑器
    function importGeneratedSlides(slides, styleType) {
        const thumbnailContainer = document.querySelector('.slide-thumbnails');
        const editorArea = document.querySelector('.slide-editor');
        
        if (!thumbnailContainer || !editorArea) return;
        
        // 清空现有幻灯片
        thumbnailContainer.innerHTML = '';
        
        // 添加新幻灯片
        slides.forEach((slide, index) => {
            // 创建缩略图
            const thumbnail = document.createElement('div');
            thumbnail.className = 'slide-thumbnail';
            thumbnail.setAttribute('data-slide-id', index);
            if (index === 0) thumbnail.classList.add('active');
            
            thumbnail.innerHTML = `
                <div class="thumbnail-number">${index + 1}</div>
                <div class="thumbnail-preview" style="background-color: ${styleType === 'modern' ? '#f5f5f5' : styleType === 'traditional' ? '#f8f4e8' : '#fff'}">
                    <div class="thumbnail-title">${slide.title}</div>
                </div>
            `;
            
            thumbnailContainer.appendChild(thumbnail);
            
            // 添加点击事件
            thumbnail.addEventListener('click', function() {
                document.querySelectorAll('.slide-thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                updateEditorContent(slide, index, styleType);
            });
        });
        
        // 更新编辑区域为第一张幻灯片
        updateEditorContent(slides[0], 0, styleType);
        
        // 显示成功消息
        showNotification('幻灯片已成功导入');
    }
    
    // 更新编辑区域内容
    function updateEditorContent(slide, index, styleType) {
        const editorArea = document.querySelector('.slide-editor');
        if (!editorArea) return;
        
        const slideContent = document.createElement('div');
        slideContent.className = 'slide-content-editor';
        slideContent.style.backgroundColor = styleType === 'modern' ? '#f5f5f5' : styleType === 'traditional' ? '#f8f4e8' : '#fff';
        
        slideContent.innerHTML = `
            <h2 class="slide-title-editor" contenteditable="true">${slide.title}</h2>
            <div class="slide-body-editor" contenteditable="true">
                ${slide.content}
            </div>
        `;
        
        editorArea.innerHTML = '';
        editorArea.appendChild(slideContent);
    }
    
    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        }, 100);
    }
}

/**
 * 初始化课堂小测题目导航功能
 */
function initQuizNavigation() {
    // 模拟的题目数据，实际应从服务端获取
    const quizQuestions = [
        {
            number: 1,
            type: '单选题',
            typeEn: 'Single Choice',
            text: '下列哪个元素不属于中国园林的基本要素？',
            options: [
                { label: 'A', text: '假山' },
                { label: 'B', text: '水体' },
                { label: 'C', text: '植物' },
                { label: 'D', text: '喷泉' }
            ],
            answer: 'D',
            explanation: '喷泉是西方园林常见的景观元素，中国传统园林则讲究自然山水的模拟与再现，主要以假山、水体、植物和建筑为基本要素，形成"虽由人作，宛自天开"的艺术效果。'
        },
        {
            number: 2,
            type: '多选题',
            typeEn: 'Multiple Choice',
            text: '中国古典园林的设计理念包括以下哪些？',
            options: [
                { label: 'A', text: '虽由人作，宛自天开' },
                { label: 'B', text: '藏露结合' },
                { label: 'C', text: '几何对称布局' },
                { label: 'D', text: '移步换景' }
            ],
            answer: 'ABD',
            explanation: '中国古典园林讲究自然山水的模拟与再现，主要设计理念包括"虽由人作，宛自天开"、"藏露结合"、"移步换景"等，而几何对称布局则是西式园林的特点。'
        },
        {
            number: 3,
            type: '单选题',
            typeEn: 'Single Choice',
            text: '下列哪个园林不位于苏州？',
            options: [
                { label: 'A', text: '拙政园' },
                { label: 'B', text: '留园' },
                { label: 'C', text: '圆明园' },
                { label: 'D', text: '网师园' }
            ],
            answer: 'C',
            explanation: '圆明园位于北京，是清代著名的皇家园林。而拙政园、留园和网师园都位于苏州，是著名的江南私家园林代表作。'
        },
        {
            number: 4,
            type: '简答题',
            typeEn: 'Short Answer',
            text: '简述中国园林与西方园林的主要区别。',
            answer: '中西方园林的主要区别体现在：\n1. 布局方式：中国园林强调自然曲线和不规则布局，西方园林多采用几何对称布局\n2. 设计理念：中国园林讲究"虽由人作，宛自天开"，西方园林则展示人对自然的控制与改造\n3. 游览方式：中国园林采用"移步换景"的游览方式，西方园林则强调整体观赏\n4. 景观元素：中国园林多用山水、植物等自然元素，西方园林则常用喷泉、雕塑等人工景观',
            explanation: '中西方园林的区别反映了不同文化背景下人与自然关系的处理方式。中国园林受道家"天人合一"思想影响，强调与自然和谐共处；西方园林则更多体现人对自然的驾驭和改造。'
        },
        {
            number: 5,
            type: '讨论题',
            typeEn: 'Discussion',
            text: '中国古典园林的"借景"手法在现代景观设计中有何应用价值？',
            answer: '无标准答案',
            explanation: '借景是中国古典园林的重要手法，通过"框景"、"漏景"等方式将远景纳入园林视野，扩展空间感，增加景观层次。在现代景观设计中，借景理念有助于突破场地局限，增强空间的开放性和连续性，创造更具深度和趣味性的景观体验。此外，借景手法的应用也有助于促进城市空间的整体协调和资源共享。'
        }
    ];
    
    let currentQuestionIndex = 0;
    
    // 获取相关DOM元素
    const prevBtn = document.querySelector('.prev-question-btn');
    const nextBtn = document.querySelector('.next-question-btn');
    const currentQuestionSpan = document.querySelector('.current-question');
    const totalQuestionsSpan = document.querySelector('.total-questions');
    const dotContainer = document.querySelector('.quiz-nav-dots');
    const dots = document.querySelectorAll('.quiz-dot');
    
    if (!prevBtn || !nextBtn || !currentQuestionSpan || !totalQuestionsSpan || !dotContainer) return;
    
    // 初始化题目总数
    totalQuestionsSpan.textContent = quizQuestions.length;
    
    // 上一题按钮点击事件
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestionDisplay();
        }
    });
    
    // 下一题按钮点击事件
    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            updateQuestionDisplay();
        }
    });
    
    // 点击导航点切换题目
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentQuestionIndex = index;
            updateQuestionDisplay();
        });
    });
    
    // 更新题目显示
    function updateQuestionDisplay() {
        // 更新当前题目计数
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        
        // 更新导航点状态
        dots.forEach((dot, index) => {
            if (index === currentQuestionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 更新按钮状态
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === quizQuestions.length - 1;
        
        // 获取当前题目数据
        const currentQuestion = quizQuestions[currentQuestionIndex];
        
        // 更新题目内容
        const questionItem = document.querySelector('.question-item');
        if (questionItem) {
            // 更新题号和类型
            const questionNumber = questionItem.querySelector('.question-number');
            const questionTypeZh = questionItem.querySelector('.question-type.zh');
            const questionTypeEn = questionItem.querySelector('.question-type.en');
            
            if (questionNumber) questionNumber.textContent = `Q${currentQuestion.number}`;
            if (questionTypeZh) questionTypeZh.textContent = currentQuestion.type;
            if (questionTypeEn) questionTypeEn.textContent = currentQuestion.typeEn;
            
            // 更新题目文本
            const questionText = questionItem.querySelector('.question-text');
            if (questionText) questionText.textContent = currentQuestion.text;
            
            // 更新选项（如果有）
            const optionsContainer = questionItem.querySelector('.question-options');
            if (optionsContainer) {
                // 清空现有选项
                optionsContainer.innerHTML = '';
                
                // 仅对单选和多选题显示选项
                if (currentQuestion.type === '单选题' || currentQuestion.type === '多选题') {
                    optionsContainer.style.display = 'block';
                    
                    // 添加新选项
                    currentQuestion.options.forEach(option => {
                        const optionDiv = document.createElement('div');
                        optionDiv.className = 'option';
                        
                        const labelSpan = document.createElement('span');
                        labelSpan.className = 'option-label';
                        labelSpan.textContent = option.label + '.';
                        
                        const textSpan = document.createElement('span');
                        textSpan.textContent = option.text;
                        
                        optionDiv.appendChild(labelSpan);
                        optionDiv.appendChild(textSpan);
                        optionsContainer.appendChild(optionDiv);
                    });
                } else {
                    optionsContainer.style.display = 'none';
                }
            }
            
            // 更新答案和解析
            const answerContainer = questionItem.querySelector('.answer-container');
            if (answerContainer) {
                const answerContent = answerContainer.querySelector('.answer-content');
                const explanationText = answerContainer.querySelector('.question-explanation p');
                
                if (answerContent) answerContent.textContent = currentQuestion.answer;
                if (explanationText) explanationText.textContent = currentQuestion.explanation;
                
                // 重置显示状态
                answerContainer.style.display = 'none';
                const showAnswerBtn = questionItem.querySelector('.show-answer-btn');
                if (showAnswerBtn) {
                    showAnswerBtn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
                }
            }
        }
    }
    
    // 初始化第一题的显示
    updateQuestionDisplay();
}

// 在页面加载完成后初始化题目导航
document.addEventListener('DOMContentLoaded', function() {
    // 执行其他初始化函数...
    
    // 初始化题目导航
    initQuizNavigation();
});

// 初始化课程思政多媒体标签页和案例/讨论题切换功能
function initIdeologyMediaTabs() {
    // 监听互动弹窗显示事件
    const interactionModal = document.getElementById('interaction-modal');
    if (interactionModal) {
        interactionModal.addEventListener('click', function(e) {
            // 检查是否点击了某个全屏工具
            if (e.target.closest('.fullscreen-tool[data-interaction="ideology"]')) {
                // 初始化多媒体标签页
                initMediaTabs();
                // 初始化案例和讨论题切换功能
                initCaseNavigation();
                initDiscussionNavigation();
            }
        });
    }
    
    // 查找课程思政部分的元素
    const ideologySection = document.getElementById('ideology-interaction');
    if (ideologySection) {
        // 在该部分显示时初始化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style' &&
                    ideologySection.style.display !== 'none') {
                    // 初始化多媒体标签页
                    initMediaTabs();
                    // 初始化案例和讨论题切换功能
                    initCaseNavigation();
                    initDiscussionNavigation();
                }
            });
        });
        
        observer.observe(ideologySection, { attributes: true });
    }
}

// 初始化多媒体标签页切换功能
function initMediaTabs() {
    const mediaTabs = document.querySelectorAll('.media-tab');
    const mediaContents = document.querySelectorAll('.media-content');
    
    mediaTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签页的激活状态
            mediaTabs.forEach(t => t.classList.remove('active'));
            // 激活当前点击的标签页
            this.classList.add('active');
            
            // 获取要显示的媒体类型
            const mediaType = this.getAttribute('data-media');
            // 隐藏所有内容
            mediaContents.forEach(content => content.classList.remove('active'));
            // 显示对应内容
            document.getElementById(`${mediaType}-content`).classList.add('active');
        });
    });
}

// 初始化案例切换功能
function initCaseNavigation() {
    const prevCaseBtn = document.querySelector('.prev-case');
    const nextCaseBtn = document.querySelector('.next-case');
    const currentCaseElem = document.querySelector('.current-case');
    const totalCasesElem = document.querySelector('.total-cases');
    
    // 模拟案例数据
    const totalCases = 3;
    let currentCase = 1;
    
    // 更新显示
    function updateCaseDisplay() {
        if (currentCaseElem) currentCaseElem.textContent = currentCase;
        if (totalCasesElem) totalCasesElem.textContent = totalCases;
        
        // 禁用/启用按钮
        if (prevCaseBtn) prevCaseBtn.disabled = currentCase <= 1;
        if (nextCaseBtn) nextCaseBtn.disabled = currentCase >= totalCases;
    }
    
    // 初始更新
    updateCaseDisplay();
    
    // 绑定事件
    if (prevCaseBtn) {
        prevCaseBtn.addEventListener('click', function() {
            if (currentCase > 1) {
                currentCase--;
                updateCaseDisplay();
                // 这里应该添加实际的案例内容切换逻辑
                showNotification('加载上一个案例...', 'info');
            }
        });
    }
    
    if (nextCaseBtn) {
        nextCaseBtn.addEventListener('click', function() {
            if (currentCase < totalCases) {
                currentCase++;
                updateCaseDisplay();
                // 这里应该添加实际的案例内容切换逻辑
                showNotification('加载下一个案例...', 'info');
            }
        });
    }
}

// 初始化讨论题切换功能
function initDiscussionNavigation() {
    const prevDiscussionBtn = document.querySelector('.prev-discussion');
    const nextDiscussionBtn = document.querySelector('.next-discussion');
    const currentDiscussionElem = document.querySelector('.current-discussion');
    const totalDiscussionsElem = document.querySelector('.total-discussions');
    
    // 模拟讨论题数据
    const totalDiscussions = 3;
    let currentDiscussion = 1;
    
    // 更新显示
    function updateDiscussionDisplay() {
        if (currentDiscussionElem) currentDiscussionElem.textContent = currentDiscussion;
        if (totalDiscussionsElem) totalDiscussionsElem.textContent = totalDiscussions;
        
        // 禁用/启用按钮
        if (prevDiscussionBtn) prevDiscussionBtn.disabled = currentDiscussion <= 1;
        if (nextDiscussionBtn) nextDiscussionBtn.disabled = currentDiscussion >= totalDiscussions;
    }
    
    // 初始更新
    updateDiscussionDisplay();
    
    // 绑定事件
    if (prevDiscussionBtn) {
        prevDiscussionBtn.addEventListener('click', function() {
            if (currentDiscussion > 1) {
                currentDiscussion--;
                updateDiscussionDisplay();
                // 这里应该添加实际的讨论题内容切换逻辑
                showNotification('加载上一个讨论题...', 'info');
            }
        });
    }
    
    if (nextDiscussionBtn) {
        nextDiscussionBtn.addEventListener('click', function() {
            if (currentDiscussion < totalDiscussions) {
                currentDiscussion++;
                updateDiscussionDisplay();
                // 这里应该添加实际的讨论题内容切换逻辑
                showNotification('加载下一个讨论题...', 'info');
            }
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化课程思政多媒体标签页和导航功能
    initIdeologyMediaTabs();
});

/**
 * 初始化课堂班级选择下拉框
 */
function initClassSelection() {
    const classSelect = document.getElementById('class-select');
    if (!classSelect) return;
    
    // 当切换语言模式时更新下拉框显示选项
    document.body.addEventListener('langchange', function() {
        const isEnglish = document.body.classList.contains('en-mode');
        Array.from(classSelect.options).forEach(option => {
            if (isEnglish) {
                if (option.classList.contains('en')) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            } else {
                if (option.classList.contains('zh')) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            }
        });
    });
    
    // 处理班级切换事件
    classSelect.addEventListener('change', function() {
        const classId = this.value;
        console.log('班级已切换为ID:', classId);
        
        // 这里可以添加更新班级相关数据的代码
        // 例如更新签到状态、学生名单等
        updateClassData(classId);
    });
}

/**
 * 更新班级相关数据
 * @param {string} classId - 班级ID
 */
function updateClassData(classId) {
    // 模拟不同班级的签到数据
    const mockData = {
        '1': { total: 86, checkedIn: 78, absent: 8, rate: '91%' },
        '2': { total: 92, checkedIn: 85, absent: 7, rate: '92%' },
        '3': { total: 68, checkedIn: 60, absent: 8, rate: '88%' },
        '4': { total: 55, checkedIn: 52, absent: 3, rate: '95%' }
    };
    
    // 获取当前选中的班级数据
    const data = mockData[classId] || mockData['1'];
    
    // 更新签到统计数据
    const statBoxes = document.querySelectorAll('.check-in-stats .stat-box .stat-value');
    if (statBoxes.length >= 4) {
        statBoxes[0].textContent = data.total;
        statBoxes[1].textContent = data.checkedIn;
        statBoxes[2].textContent = data.absent;
        statBoxes[3].textContent = data.rate;
    }
    
    // 这里可以添加更多班级数据更新逻辑
}

// 初始化课后总结功能
function initPostClass() {
    // 获取标签页按钮和内容区域
    const tabBtns = document.querySelectorAll('.post-class-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.post-class-tabs .tab-content');
    
    // 默认激活第一个标签页（课程小结）
    if(tabBtns.length > 0 && tabContents.length > 0) {
        // 移除所有激活状态
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // 激活第一个标签页（课程小结）
        tabBtns[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
    
    // 绑定标签页点击事件
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取目标标签页
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有激活状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 激活当前点击的标签页
            this.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 执行其他初始化函数...
    
    // 初始化课后总结部分
    initPostClass();
});

/**
 * 初始化知识图谱交互功能
 * 实现节点点击、拖拽、缩放等交互效果
 */
function initKnowledgeGraph() {
    // 获取DOM元素
    const graphDisplay = document.getElementById('graphDisplay');
    const nodeDetailPanel = document.querySelector('.node-detail-panel');
    const closeDetailBtn = document.querySelector('.close-detail-btn');
    const graphControlBtns = document.querySelectorAll('.graph-control-btn');
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const filterOptions = document.querySelectorAll('.filter-option input');
    const strengthSlider = document.getElementById('strengthSlider');
    
    // 如果页面上没有图谱，直接返回
    if (!graphDisplay) return;
    
    // 获取图谱中的所有节点和连接线
    const nodes = document.querySelectorAll('.knowledge-graph-svg .node');
    const links = document.querySelectorAll('.knowledge-graph-svg .link');
    
    // 中键拖动相关变量
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let svgElement = document.querySelector('.knowledge-graph-svg');
    let svgViewBox = svgElement ? svgElement.viewBox.baseVal : null;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    
    // 节点点击事件 - 显示详情面板
    nodes.forEach(node => {
        // 单击事件 - 高亮节点及相关连接
        node.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 移除其他节点的选中状态
            document.querySelectorAll('.node.selected').forEach(n => {
                if (n !== this) n.classList.remove('selected');
            });
            
            // 为当前节点添加选中状态
            this.classList.toggle('selected');
            
            // 高亮与该节点连接的线
            highlightConnectedLinks(this);
            
            // 不在单击时显示侧边详情面板，而是等待双击事件
            if (this.classList.contains('selected')) {
                // 只高亮连接线，不显示侧边详情
                console.log('节点已选中:', this.querySelector('text').textContent);
            } else {
                nodeDetailPanel.classList.remove('active');
            }
        });
        
        // 添加双击事件 - 显示详情弹窗
        node.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // 获取节点信息
            const nodeName = this.querySelector('text').textContent;
            const nodeType = Array.from(this.classList)
                .find(cls => ['concept', 'courseware', 'quiz', 'resource', 'keyword'].includes(cls)) || 'concept';
            
            // 显示详情弹窗
            showNodeDetailModal(nodeName, nodeType, this);
        });
        
        // 添加右键菜单事件 - 添加子节点
        node.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 显示添加子节点的菜单
            showAddChildNodeMenu(e, this);
        });
        
        // 鼠标悬停效果
        node.addEventListener('mouseenter', function() {
            links.forEach(link => {
                // 判断链接是否与当前节点相连
                if (isLinkConnectedToNode(link, this)) {
                    link.classList.add('highlighted');
                }
            });
        });
        
        node.addEventListener('mouseleave', function() {
            links.forEach(link => {
                // 如果没有节点被选中，则移除高亮效果
                if (!document.querySelector('.node.selected')) {
                    link.classList.remove('highlighted');
                }
            });
        });
    });
    
    // 设置中键拖动功能
    if (svgElement) {
        // 鼠标按下事件
        svgElement.addEventListener('mousedown', function(e) {
            // 检查是否为中键 (button 1)
            if (e.button === 1) {
                e.preventDefault();
                isDragging = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                svgElement.style.cursor = 'grabbing';
            }
        });
        
        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const dx = e.clientX - dragStartX;
                const dy = e.clientY - dragStartY;
                
                // 更新拖动起点为当前位置
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                
                // 更新当前平移值
                currentTranslateX += dx;
                currentTranslateY += dy;
                
                // 应用变换
                const svgNodes = document.querySelectorAll('.knowledge-graph-svg .node');
                svgNodes.forEach(node => {
                    const transform = node.getAttribute('transform');
                    const translatePattern = /translate\(([^,]+),([^)]+)\)/;
                    const match = transform.match(translatePattern);
                    
                    if (match) {
                        const x = parseFloat(match[1]);
                        const y = parseFloat(match[2]);
                        node.setAttribute('transform', `translate(${x + dx},${y + dy})`);
                    }
                });
                
                // 更新连接线
                const svgLinks = document.querySelectorAll('.knowledge-graph-svg .link');
                svgLinks.forEach(link => {
                    const x1 = parseFloat(link.getAttribute('x1'));
                    const y1 = parseFloat(link.getAttribute('y1'));
                    const x2 = parseFloat(link.getAttribute('x2'));
                    const y2 = parseFloat(link.getAttribute('y2'));
                    
                    link.setAttribute('x1', x1 + dx);
                    link.setAttribute('y1', y1 + dy);
                    link.setAttribute('x2', x2 + dx);
                    link.setAttribute('y2', y2 + dy);
                });
            }
        });
        
        // 鼠标松开事件
        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                isDragging = false;
                svgElement.style.cursor = 'default';
            }
        });
        
        // 阻止默认的中键滚动行为
        svgElement.addEventListener('auxclick', function(e) {
            if (e.button === 1) {
                e.preventDefault();
            }
        });
    }
    
    /**
     * 显示添加子节点菜单
     * @param {Event} event - 鼠标事件
     * @param {Element} parentNode - 父节点元素
     */
    function showAddChildNodeMenu(event, parentNode) {
        // 移除现有菜单
        const existingMenu = document.querySelector('.node-context-menu');
        if (existingMenu) {
            document.body.removeChild(existingMenu);
        }
        
        // 创建右键菜单
        const menuElement = document.createElement('div');
        menuElement.className = 'node-context-menu';
        
        // 设置菜单样式
        menuElement.style.position = 'fixed';
        menuElement.style.left = `${event.clientX}px`;
        menuElement.style.top = `${event.clientY}px`;
        menuElement.style.backgroundColor = 'white';
        menuElement.style.border = '1px solid #ccc';
        menuElement.style.borderRadius = '4px';
        menuElement.style.padding = '5px 0';
        menuElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        menuElement.style.zIndex = '1000';
        
        // 设置菜单内容
        menuElement.innerHTML = `
            <div class="menu-item" data-type="concept">
                <i class="fas fa-lightbulb"></i> 添加概念节点
            </div>
            <div class="menu-item" data-type="courseware">
                <i class="fas fa-book-open"></i> 添加课件节点
            </div>
            <div class="menu-item" data-type="quiz">
                <i class="fas fa-question-circle"></i> 添加习题节点
            </div>
            <div class="menu-item" data-type="resource">
                <i class="fas fa-file-alt"></i> 添加资源节点
            </div>
            <div class="menu-item" data-type="keyword">
                <i class="fas fa-tag"></i> 添加关键词节点
            </div>
        `;
        
        // 设置菜单项样式
        const menuItems = menuElement.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.style.padding = '8px 15px';
            item.style.cursor = 'pointer';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.fontSize = '14px';
            
            // 图标样式
            const icon = item.querySelector('i');
            if (icon) {
                icon.style.marginRight = '8px';
                icon.style.width = '16px';
                icon.style.textAlign = 'center';
            }
            
            // 悬停效果
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f0f0f0';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            // 点击事件
            item.addEventListener('click', function() {
                const nodeType = this.getAttribute('data-type');
                addChildNode(parentNode, nodeType);
                document.body.removeChild(menuElement);
            });
        });
        
        // 添加菜单到页面
        document.body.appendChild(menuElement);
        
        // 点击其他区域关闭菜单
        document.addEventListener('click', function closeMenu(e) {
            if (!menuElement.contains(e.target)) {
                if (document.body.contains(menuElement)) {
                    document.body.removeChild(menuElement);
                }
                document.removeEventListener('click', closeMenu);
            }
        });
    }
    
    /**
     * 添加子节点
     * @param {Element} parentNode - 父节点元素
     * @param {string} nodeType - 节点类型
     */
    function addChildNode(parentNode, nodeType) {
        // 获取父节点位置
        const parentTransform = parentNode.getAttribute('transform');
        const parentX = parseFloat(parentTransform.split('translate(')[1].split(',')[0]);
        const parentY = parseFloat(parentTransform.split(',')[1].split(')')[0]);
        
        // 计算子节点位置 (偏移量)
        const angle = Math.random() * Math.PI * 2; // 随机角度
        const distance = 100 + Math.random() * 50; // 随机距离
        const childX = parentX + Math.cos(angle) * distance;
        const childY = parentY + Math.sin(angle) * distance;
        
        // 确定节点视觉属性
        let circleRadius = 25;
        let fillColor = '#2196f3';  // 默认蓝色
        let nodeIcon = 'fa-lightbulb';
        
        switch(nodeType) {
            case 'concept':
                circleRadius = 30;
                fillColor = '#e91e63';  // 粉色
                nodeIcon = 'fa-lightbulb';
                break;
            case 'courseware':
                fillColor = '#2196f3';  // 蓝色
                nodeIcon = 'fa-book-open';
                break;
            case 'quiz':
                fillColor = '#4caf50';  // 绿色
                nodeIcon = 'fa-question-circle';
                break;
            case 'resource':
                fillColor = '#9c27b0';  // 紫色
                nodeIcon = 'fa-file-alt';
                break;
            case 'keyword':
                circleRadius = 20;
                fillColor = '#ff9800';  // 橙色
                nodeIcon = 'fa-tag';
                break;
        }
        
        // 创建新节点输入弹窗
        const dialogElement = document.createElement('div');
        dialogElement.className = 'node-input-dialog';
        dialogElement.style.position = 'fixed';
        dialogElement.style.left = '50%';
        dialogElement.style.top = '50%';
        dialogElement.style.transform = 'translate(-50%, -50%)';
        dialogElement.style.backgroundColor = 'white';
        dialogElement.style.borderRadius = '8px';
        dialogElement.style.padding = '20px';
        dialogElement.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        dialogElement.style.zIndex = '1001';
        dialogElement.style.width = '400px';
        dialogElement.style.maxWidth = '90vw';
        
        // 设置弹窗内容
        dialogElement.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">添加${getNodeTypeName(nodeType)}节点</h3>
            <div style="margin-bottom: 15px;">
                <label for="nodeNameZh" style="display: block; margin-bottom: 5px; font-weight: 500;">中文名称</label>
                <input type="text" id="nodeNameZh" class="node-name-input" placeholder="输入节点中文名称" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
            </div>
            <div style="margin-bottom: 20px;">
                <label for="nodeNameEn" style="display: block; margin-bottom: 5px; font-weight: 500;">英文名称</label>
                <input type="text" id="nodeNameEn" class="node-name-input" placeholder="Input node English name" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
            </div>
            <div style="text-align: right;">
                <button id="cancelAddNode" style="padding: 8px 15px; background: none; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px; cursor: pointer;">取消</button>
                <button id="confirmAddNode" style="padding: 8px 15px; background-color: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">确认添加</button>
            </div>
        `;
        
        // 添加弹窗到页面
        document.body.appendChild(dialogElement);
        
        // 取消按钮事件
        dialogElement.querySelector('#cancelAddNode').addEventListener('click', function() {
            document.body.removeChild(dialogElement);
        });
        
        // 确认按钮事件
        dialogElement.querySelector('#confirmAddNode').addEventListener('click', function() {
            const nameZh = dialogElement.querySelector('#nodeNameZh').value.trim();
            const nameEn = dialogElement.querySelector('#nodeNameEn').value.trim();
            
            if (nameZh === '' && nameEn === '') {
                alert('请至少输入一种语言的节点名称');
                return;
            }
            
            // 创建新节点
            createNewNode(nodeType, childX, childY, circleRadius, fillColor, nameZh, nameEn);
            
            // 创建连接线
            createNewLink(parentX, parentY, childX, childY, 'medium');
            
            // 关闭弹窗
            document.body.removeChild(dialogElement);
            
            // 显示成功提示
            showNotification('已添加新节点', 'success');
        });
        
        // 聚焦到第一个输入框
        setTimeout(() => {
            dialogElement.querySelector('#nodeNameZh').focus();
        }, 100);
    }
    
    /**
     * 获取节点类型名称
     * @param {string} nodeType - 节点类型代码
     * @returns {string} - 节点类型名称
     */
    function getNodeTypeName(nodeType) {
        switch(nodeType) {
            case 'concept': return '概念';
            case 'courseware': return '课件';
            case 'quiz': return '习题';
            case 'resource': return '资源';
            case 'keyword': return '关键词';
            default: return '未知类型';
        }
    }
    
    /**
     * 创建新节点
     * @param {string} nodeType - 节点类型
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} radius - 圆形半径
     * @param {string} fillColor - 填充颜色
     * @param {string} nameZh - 中文名称
     * @param {string} nameEn - 英文名称
     */
    function createNewNode(nodeType, x, y, radius, fillColor, nameZh, nameEn) {
        const svgElement = document.querySelector('.knowledge-graph-svg');
        const nodesGroup = svgElement.querySelector('.nodes') || svgElement;
        
        // 创建新的节点组
        const newNodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        newNodeGroup.classList.add('node', nodeType);
        newNodeGroup.setAttribute('transform', `translate(${x},${y})`);
        
        // 创建圆形
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', fillColor);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        
        // 创建中文文本
        const textZh = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textZh.setAttribute('fill', '#fff');
        textZh.setAttribute('text-anchor', 'middle');
        textZh.setAttribute('dy', '.3em');
        textZh.setAttribute('font-size', radius > 25 ? '12' : '10');
        textZh.classList.add('zh');
        textZh.textContent = nameZh;
        
        // 创建英文文本
        const textEn = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEn.setAttribute('fill', '#fff');
        textEn.setAttribute('text-anchor', 'middle');
        textEn.setAttribute('dy', '.3em');
        textEn.setAttribute('font-size', radius > 25 ? '12' : '10');
        textEn.classList.add('en');
        textEn.textContent = nameEn;
        
        // 添加元素到组
        newNodeGroup.appendChild(circle);
        newNodeGroup.appendChild(textZh);
        newNodeGroup.appendChild(textEn);
        
        // 添加到SVG
        nodesGroup.appendChild(newNodeGroup);
        
        // 添加事件监听
        addNodeEventListeners(newNodeGroup);
    }
    
    /**
     * 为新节点添加事件监听器
     * @param {Element} node - 节点元素
     */
    function addNodeEventListeners(node) {
        // 单击事件
        node.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 移除其他节点的选中状态
            document.querySelectorAll('.node.selected').forEach(n => {
                if (n !== this) n.classList.remove('selected');
            });
            
            // 为当前节点添加选中状态
            this.classList.toggle('selected');
            
            // 高亮与该节点连接的线
            highlightConnectedLinks(this);
            
            // 不在单击时显示侧边详情面板
            if (this.classList.contains('selected')) {
                console.log('节点已选中:', this.querySelector('text').textContent);
            } else {
                nodeDetailPanel.classList.remove('active');
            }
        });
        
        // 双击事件
        node.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // 获取节点信息
            const nodeName = this.querySelector('text').textContent;
            const nodeType = Array.from(this.classList)
                .find(cls => ['concept', 'courseware', 'quiz', 'resource', 'keyword'].includes(cls)) || 'concept';
            
            // 显示详情弹窗
            showNodeDetailModal(nodeName, nodeType, this);
        });
        
        // 右键菜单事件
        node.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 显示添加子节点的菜单
            showAddChildNodeMenu(e, this);
        });
        
        // 悬停事件
        node.addEventListener('mouseenter', function() {
            const links = document.querySelectorAll('.knowledge-graph-svg .link');
            links.forEach(link => {
                if (isLinkConnectedToNode(link, this)) {
                    link.classList.add('highlighted');
                }
            });
        });
        
        node.addEventListener('mouseleave', function() {
            const links = document.querySelectorAll('.knowledge-graph-svg .link');
            links.forEach(link => {
                if (!document.querySelector('.node.selected')) {
                    link.classList.remove('highlighted');
                }
            });
        });
    }
    
    /**
     * 创建新连接线
     * @param {number} x1 - 起始点X坐标
     * @param {number} y1 - 起始点Y坐标
     * @param {number} x2 - 结束点X坐标
     * @param {number} y2 - 结束点Y坐标
     * @param {string} strength - 连接强度 (strong, medium, weak)
     */
    function createNewLink(x1, y1, x2, y2, strength) {
        const svgElement = document.querySelector('.knowledge-graph-svg');
        const linksGroup = svgElement.querySelector('.links') || svgElement;
        
        // 创建连接线
        const newLink = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLink.classList.add('link', strength);
        newLink.setAttribute('x1', x1);
        newLink.setAttribute('y1', y1);
        newLink.setAttribute('x2', x2);
        newLink.setAttribute('y2', y2);
        
        // 设置连接线样式
        switch(strength) {
            case 'strong':
                newLink.setAttribute('stroke', 'rgba(0, 0, 0, 0.7)');
                newLink.setAttribute('stroke-width', '2.5');
                break;
            case 'medium':
                newLink.setAttribute('stroke', 'rgba(0, 0, 0, 0.5)');
                newLink.setAttribute('stroke-width', '1.5');
                break;
            case 'weak':
                newLink.setAttribute('stroke', 'rgba(0, 0, 0, 0.3)');
                newLink.setAttribute('stroke-width', '1');
                break;
        }
        
        // 添加到SVG
        linksGroup.appendChild(newLink);
    }
    
    // 关闭详情按钮事件
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', function() {
            nodeDetailPanel.classList.remove('active');
            document.querySelectorAll('.node.selected').forEach(node => {
                node.classList.remove('selected');
            });
        });
    }
    
    // 视图模式切换
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewModeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const mode = this.getAttribute('data-mode');
            changeGraphLayout(mode);
        });
    });
    
    // 过滤器点击事件
    filterOptions.forEach(option => {
        option.addEventListener('change', function() {
            filterNodes();
        });
    });
    
    // 关系强度滑块事件
    if (strengthSlider) {
        strengthSlider.addEventListener('input', function() {
            filterLinksByStrength(this.value);
        });
    }
    
    // 缩放控制按钮事件
    graphControlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('title');
            if (action === '放大') {
                zoomGraph(1.2);
            } else if (action === '缩小') {
                zoomGraph(0.8);
            } else if (action === '重置视图') {
                resetGraph();
            }
        });
    });
    
    // 点击空白区域取消选中
    graphDisplay.addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('graph-display') || e.target.tagName === 'svg') {
            document.querySelectorAll('.node.selected').forEach(node => {
                node.classList.remove('selected');
            });
            // 移除所有连接线的高亮效果
            links.forEach(link => link.classList.remove('highlighted'));
            nodeDetailPanel.classList.remove('active');
        }
    });
    
    /**
     * 判断连接线是否与指定节点相连
     * @param {Element} link - 连接线元素
     * @param {Element} node - 节点元素
     * @returns {boolean} - 是否相连
     */
    function isLinkConnectedToNode(link, node) {
        const nodeTransform = node.getAttribute('transform');
        const nodeX = parseFloat(nodeTransform.split('translate(')[1].split(',')[0]);
        const nodeY = parseFloat(nodeTransform.split(',')[1].split(')')[0]);
        
        const x1 = parseFloat(link.getAttribute('x1'));
        const y1 = parseFloat(link.getAttribute('y1'));
        const x2 = parseFloat(link.getAttribute('x2'));
        const y2 = parseFloat(link.getAttribute('y2'));
        
        // 判断节点坐标是否与连接线的起点或终点接近
        const threshold = 5;
        return (Math.abs(nodeX - x1) < threshold && Math.abs(nodeY - y1) < threshold) || 
               (Math.abs(nodeX - x2) < threshold && Math.abs(nodeY - y2) < threshold);
    }
    
    /**
     * 高亮与选中节点连接的线
     * @param {Element} node - 选中的节点元素
     */
    function highlightConnectedLinks(node) {
        links.forEach(link => {
            link.classList.remove('highlighted');
            if (isLinkConnectedToNode(link, node)) {
                link.classList.add('highlighted');
            }
        });
    }
    
/**
 * 中国文化人工智能课程平台 - 教师端
 * 主脚本文件
 */

// 在文件顶部，DOMContentLoaded事件监听器之前添加标记变量
// 全局变量，用于跟踪按钮是否已经绑定事件
let contentGenBtnInitialized = false;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航系统
    initNavigation();
    
    // 初始化语言切换
    initLanguageToggle();
    
    // 初始化章节模态框
    initChapterModal();
    
    // 初始化章节卡片交互
    initChapterCards();
    
    // 更新当前日期显示
    updateCurrentDate();
    
    // 初始化内容生成弹窗
    initContentGenerateModal();
    
    // 初始化AI助教-课前部分
    initAIPre();
    
    // 初始化AI助教-课中部分
    initAIInClass();
    
    // 初始化章节滑动功能
    initChapterSlider();
    
    // 初始化课程思政和实训任务部分
    initIdeologyAndPractice();
    
    // 初始化最新动态过滤功能
    initActivityFilters();
    
    // 初始化学情画像部分
    initStudentProfile();
    
    // 初始化中国文化演化部分
    initCultureEvolution();
    
    // 初始化一键生成功能
    initOneClickGeneration();
    
    // 初始化各个模块
    initContentSections();
    initTabSwitching();
    initQuizGenerator();
    initKnowledgeExpansion(); // 添加知识拓展初始化
    // ... 其他初始化函数
    
    // 在页面加载时隐藏知识拓展列表
    const knowledgeExpansionList = document.querySelector('.knowledge-expansion-list');
    if (knowledgeExpansionList) {
        knowledgeExpansionList.style.display = 'none';
    }
    
    // 设置默认激活的标签
    const defaultTabBtn = document.querySelector('.tab-btn[data-tab="courseware"]');
    if (defaultTabBtn) {
        defaultTabBtn.click();
    }
    
    initIdeology(); // 初始化思政功能
    
    // 全屏功能
    initFullscreenButton();
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
    
    // 初始化课程思政多媒体标签页和案例/讨论题切换功能
    initIdeologyMediaTabs();
    
    initMediaTabs();
    initCaseNavigation();
    initDiscussionNavigation();
    initClassSelection(); // 初始化班级选择功能
    
    // 初始化课后总结部分
    initPostClass();
    
    // 知识图谱功能
    initKnowledgeGraph();
    
    // 获取章节列表数据
    fetchChapters();
    
    // 直接调用更新课程统计数据
    updateCourseStatsCount();
    
    // 新建章节按钮点击事件
    document.getElementById('newChapterBtn').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.add('active');
    });
    
    // 关闭模态框按钮点击事件
    document.getElementById('closeNewChapterModal').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 取消按钮点击事件
    document.getElementById('cancelNewChapter').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 提交表单事件
    document.getElementById('submitNewChapter').addEventListener('click', () => {
        submitNewChapter();
    });
    
    // 文件上传预览
    document.getElementById('coverImage').addEventListener('change', (e) => {
        const fileInput = e.target;
        const filePreview = fileInput.parentElement.querySelector('.file-preview');
        
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            reader.readAsDataURL(fileInput.files[0]);
            
            // 这里应该上传文件到服务器，然后获取文件路径
            // 简化处理：假设上传成功并返回路径
            document.getElementById('coverImagePath').value = `../picture/uploads/${fileInput.files[0].name}`;
        }
    });
    
    // 初始化PPTist iframe集成
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
            document.getElementById(sectionId).classList.add('active');
            
            // 更新页面标题
            const navTextZh = this.querySelector('.nav-text.zh').textContent;
            const navTextEn = this.querySelector('.nav-text.en').textContent;
            pageTitleZh.textContent = navTextZh;
            pageTitleEn.textContent = navTextEn;
            
            // 添加动态效果
            animateContentChange(document.getElementById(sectionId));
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
 * 处理打开和关闭模态框的交互
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
    
    // 确认按钮
    confirmBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 模拟创建章节
            const titleInputZh = modal.querySelector('.form-input.zh');
            const titleInputEn = modal.querySelector('.form-input.en');
            
            if (titleInputZh.value.trim() !== '' || titleInputEn.value.trim() !== '') {
                showNotification('章节创建成功！', 'success');
                closeModal();
                
                // 这里可以添加实际创建章节的代码
            } else {
                showNotification('请填写章节标题', 'warning');
            }
        });
    });
    
    // 文件上传预览
    const fileInputs = modal.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileCount = this.files.length;
            const filePreview = this.closest('.form-group').querySelector('.uploaded-files');
            
            if (filePreview) {
                const textZh = filePreview.querySelector('.zh');
                const textEn = filePreview.querySelector('.en');
                
                if (textZh) textZh.textContent = `已上传: ${fileCount} 个文件`;
                if (textEn) textEn.textContent = `Uploaded: ${fileCount} files`;
            }
        });
    });
}

/**
 * 初始化章节卡片交互
 * 添加章节卡片上的按钮点击事件
 */
function initChapterCards() {
    const editBtns = document.querySelectorAll('.chapter-action-btn.edit');
    const prepareBtns = document.querySelectorAll('.chapter-action-btn.prepare');
    const teachBtns = document.querySelectorAll('.chapter-action-btn.teach');
    
    // 编辑按钮
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            showNotification(`正在编辑${chapterTitle}...`, 'info');
            // 这里可以添加实际的编辑功能
        });
    });
    
    // 备课按钮
    prepareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取章节信息
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            const chapterTitleEn = chapterCard.querySelector('.chapter-title.en').textContent;
            
            // 提取章节序号（从标题中获取第X章）
            const chapterMatch = chapterTitle.match(/第(\d+)章/);
            if (chapterMatch && chapterMatch[1]) {
                const chapterNumber = chapterMatch[1];
                
                // 切换到AI助教-课前界面
                const aiPreNavItem = document.querySelector('.nav-item[data-section="ai-pre"]');
                if (aiPreNavItem) {
                    // 触发点击事件，切换到AI助教-课前界面
                    aiPreNavItem.click();
                    
                    // 延迟一下，等待界面切换完成后设置章节选择器的值
                    setTimeout(() => {
                        // 设置章节选择器
                        const chapterSelect = document.getElementById('chapter-select');
                        if (chapterSelect) {
                            // 查找对应章节的选项
                            const options = chapterSelect.options;
                            for (let i = 0; i < options.length; i++) {
                                if (options[i].value === chapterNumber) {
                                    chapterSelect.selectedIndex = i;
                                    // 手动触发变更事件
                                    const event = new Event('change');
                                    chapterSelect.dispatchEvent(event);
                                    break;
                                }
                            }
                        }
                        
                        showNotification(`正在准备${chapterTitle}的课前内容...`, 'success');
                    }, 300);
                }
            } else {
                showNotification(`无法确定章节编号，请手动选择章节`, 'warning');
            }
        });
    });
    
    // 上课按钮
    teachBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            
            // 切换到"AI助教-课中"界面
            const aiInNavItem = document.querySelector('.nav-item[data-section="ai-in"]');
            if (aiInNavItem) {
                aiInNavItem.click();
                
                showNotification(`开始${chapterTitle}的课堂教学`, 'success');
            }
        });
    });
    
    // 整个卡片点击事件
    const chapterCards = document.querySelectorAll('.chapter-card');
    chapterCards.forEach(card => {
        card.addEventListener('click', function() {
            const chapterTitle = this.querySelector('.chapter-title.zh').textContent;
            showNotification(`查看章节详情: ${chapterTitle}`, 'info');
            
            // 这里可以添加显示章节详情的代码
        });
    });
}

/**
 * 为内容区域添加切换动画
 * @param {HTMLElement} section - 要添加动画的内容区域
 */
function animateContentChange(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    }, 50);
}

/**
 * 创建通知提示
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (success, warning, error, info)
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 添加图标
    const icon = document.createElement('i');
    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            icon.className = 'fas fa-times-circle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    // 添加消息文本
    const text = document.createElement('span');
    text.textContent = message;
    
    // 添加关闭按钮
    const closeBtn = document.createElement('i');
    closeBtn.className = 'fas fa-times close-notification';
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 组装通知元素
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加进入动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动消失
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * 当前日期显示
 * 更新首页欢迎横幅中的日期显示
 */
function updateCurrentDate() {
    const dateElementZh = document.getElementById('current-date-zh');
    const dateElementEn = document.getElementById('current-date-en');
    
    if (dateElementZh && dateElementEn) {
        const now = new Date();
        
        // 中文日期格式
        const zhOptions = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
        let zhDate = now.toLocaleDateString('zh-CN', zhOptions);
        // 进一步格式化中文日期，确保格式为：2023年3月23日 星期四
        zhDate = zhDate.replace(/\//g, '年') + '日';
        zhDate = zhDate.replace(/年(\d+)年/, '年$1月');
        zhDate = zhDate.replace(/星期(.+)日/, '星期$1'); // 去掉星期后面的"日"字
        dateElementZh.textContent = `今天是 ${zhDate}`; // 删除平台口号
        
        // 英文日期格式
        const enOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElementEn.textContent = `Today is ${now.toLocaleDateString('en-US', enOptions)}`;
    }
}

/**
 * 初始化AI助教-课前部分
 */
function initAIPre() {
    // 初始化标签页切换
    initAIPreTabs();
    
    // 初始化课件设计
    initCoursewareDesign();
    
    // 初始化小测题目导航
    initQuizNavigation();
    
    // 初始化可缩放思维导图
    initZoomableMindmap();
    
    // 初始化章节选择器
    initChapterSelector();
}

/**
 * 初始化AI助教-课前选项卡切换
 */
function initAIPreTabs() {
    const tabBtns = document.querySelectorAll('.ai-pre-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.ai-pre-tabs .tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有选项卡的活动状态
            tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
            
            // 为当前点击的选项卡添加活动状态
            this.classList.add('active');
            
            // 获取要显示的内容区域的ID
            const contentId = this.getAttribute('data-tab') + '-content';
            
            // 隐藏所有内容区域
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 显示对应的内容区域
            document.getElementById(contentId).classList.add('active');
            
            // 添加动态效果
            animateTabContentChange(document.getElementById(contentId));
        });
    });
}

/**
 * 初始化课件设计功能
 */
function initCoursewareDesign() {
    const coursewareContent = document.getElementById('courseware-content');
    if (!coursewareContent) return;

    const actionButtons = coursewareContent.querySelectorAll('.action-button');
    const genBtn = actionButtons[0]; // 内容生成按钮是第一个按钮
    const replaceBtn = actionButtons[1]; // 替换课件按钮是第二个按钮
    
    // 内容生成按钮初始化
    if (genBtn && !contentGenBtnInitialized) {
        // 先移除可能已经存在的所有点击事件处理器
        const newGenBtn = genBtn.cloneNode(true);
        genBtn.parentNode.replaceChild(newGenBtn, genBtn);
        
        // 为新的按钮添加单一事件监听器
        newGenBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            // 显示内容生成模态框
            const modal = document.getElementById('contentGenerateModal');
            if (modal) {
                modal.classList.add('active');
            }
        });
        
        contentGenBtnInitialized = true;
        console.log("内容生成按钮已初始化");
    }
    
    // 替换课件按钮初始化
    if (replaceBtn) {
        // 先移除可能已经存在的所有点击事件处理器
        const newReplaceBtn = replaceBtn.cloneNode(true);
        replaceBtn.parentNode.replaceChild(newReplaceBtn, replaceBtn);
        
        // 为新的按钮添加单一事件监听器
        newReplaceBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            
            // 显示替换课件弹窗
            showReplaceCoursewareModal();
        });
        
        console.log("替换课件按钮已初始化");
    }
    
    // 幻灯片缩略图交互
    const thumbnails = coursewareContent.querySelectorAll('.thumbnail-item');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 显示替换课件模态框
    function showReplaceCoursewareModal() {
        // 创建模态框
        let modal = document.getElementById('replaceCoursewareModal');
        
        // 如果模态框不存在，创建一个新的
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'replaceCoursewareModal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="zh">替换课件</h3>
                        <h3 class="en">Replace Courseware</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="file-upload-section">
                            <div class="upload-instructions">
                                <p class="zh">请选择要上传的课件文件，支持PPT、PPTX或PDF格式</p>
                                <p class="en">Please select courseware file to upload, supports PPT, PPTX or PDF formats</p>
                            </div>
                            <div class="file-upload-large">
                                <div class="file-preview-large">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p class="zh">拖放文件到此处或点击上传</p>
                                    <p class="en">Drag and drop files here or click to upload</p>
                                    <p class="file-types zh">支持的格式: PPT, PPTX, PDF</p>
                                    <p class="file-types en">Supported formats: PPT, PPTX, PDF</p>
                                </div>
                                <input type="file" class="file-input" accept=".ppt,.pptx,.pdf">
                            </div>
                            <div class="uploaded-files">
                                <h4 class="zh">已选择文件</h4>
                                <h4 class="en">Selected Files</h4>
                                <div class="no-file-selected">
                                    <p class="zh">未选择任何文件</p>
                                    <p class="en">No file selected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel">
                            <span class="zh">取消</span>
                            <span class="en">Cancel</span>
                        </button>
                        <button class="btn-confirm">
                            <span class="zh">替换</span>
                            <span class="en">Replace</span>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 关闭按钮
            const closeBtn = modal.querySelector('.close-btn');
            const cancelBtn = modal.querySelector('.btn-cancel');
            
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            cancelBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            // 文件上传功能
            const fileInput = modal.querySelector('.file-input');
            const uploadArea = modal.querySelector('.file-preview-large');
            const noFileSelected = modal.querySelector('.no-file-selected');
            const uploadedFiles = modal.querySelector('.uploaded-files');
            
            // 文件上传区域点击触发文件选择
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            // 监听文件选择变化
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    
                    // 处理已选择的文件
                    noFileSelected.style.display = 'none';
                    
                    // 移除旧的文件详情
                    const oldFileDetails = uploadedFiles.querySelector('.file-details');
                    if (oldFileDetails) {
                        oldFileDetails.remove();
                    }
                    
                    // 创建文件详情显示
                    const fileDetails = document.createElement('div');
                    fileDetails.className = 'file-details';
                    
                    // 根据文件类型显示不同的图标
                    let fileIcon = 'fa-file';
                    if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
                        fileIcon = 'fa-file-powerpoint';
                    } else if (file.name.endsWith('.pdf')) {
                        fileIcon = 'fa-file-pdf';
                    }
                    
                    // 计算文件大小显示
                    let fileSize = (file.size / 1024).toFixed(2) + ' KB';
                    if (file.size > 1024 * 1024) {
                        fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                    }
                    
                    fileDetails.innerHTML = `
                        <div class="file-icon"><i class="fas ${fileIcon}"></i></div>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${fileSize}</div>
                        </div>
                        <button class="remove-file-btn"><i class="fas fa-times"></i></button>
                    `;
                    
                    uploadedFiles.appendChild(fileDetails);
                    
                    // 添加删除文件的按钮事件
                    const removeBtn = fileDetails.querySelector('.remove-file-btn');
                    removeBtn.addEventListener('click', () => {
                        fileInput.value = '';
                        fileDetails.remove();
                        noFileSelected.style.display = 'block';
                    });
                }
            });
            
            // 拖放功能
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    fileInput.files = e.dataTransfer.files;
                    
                    // 触发change事件以更新UI
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            });
            
            // 替换按钮点击事件
            const confirmBtn = modal.querySelector('.btn-confirm');
            confirmBtn.addEventListener('click', () => {
                if (fileInput.files.length > 0) {
                    showNotification('课件替换成功', 'success');
                    modal.classList.remove('active');
                } else {
                    showNotification('请选择一个文件', 'warning');
                }
            });
        }
        
        // 显示模态框
        modal.classList.add('active');
    }
    
    // 全屏按钮功能
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                // 进入全屏 - 整个编辑器区域
                if (editorContent.requestFullscreen) {
                    editorContent.requestFullscreen();
                } else if (editorContent.mozRequestFullScreen) { // Firefox
                    editorContent.mozRequestFullScreen();
                } else if (editorContent.webkitRequestFullscreen) { // Chrome, Safari, Opera
                    editorContent.webkitRequestFullscreen();
                } else if (editorContent.msRequestFullscreen) { // IE/Edge
                    editorContent.msRequestFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenBtn.title = "退出全屏";
            } else {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        });
        
        // 监听全屏变化事件
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement && 
                !document.msFullscreenElement) {
                // 退出全屏
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        }
    }
}

/**
 * 初始化课堂小测功能
 */
function initQuizGenerator() {
    // 题型选择
    const quizTypes = document.querySelectorAll('.quiz-type');
    
    quizTypes.forEach(type => {
        type.addEventListener('click', function() {
            quizTypes.forEach(qt => qt.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换题型的逻辑
        });
    });
    
    // 生成方式选择
    const optionBtns = document.querySelectorAll('.option-btn');
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换生成方式的逻辑
        });
    });
    
    // 难度滑块
    const difficultySlider = document.getElementById('difficulty-slider');
    
    if (difficultySlider) {
        difficultySlider.addEventListener('input', function() {
            // 这里可以添加难度调整的逻辑
        });
    }
    
    // 生成按钮
    const generateBtn = document.querySelector('.generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            showNotification('正在生成题目...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                showNotification('题目生成成功！', 'success');
                
                // 显示题目结果和生成的题目列表
                const quizResult = document.querySelector('.quiz-result');
                const generatedQuestionsList = document.querySelector('.generated-questions-list');
                
                if (quizResult) {
                    quizResult.style.display = 'block';
                }
                
                if (generatedQuestionsList) {
                    // 清除之前的动画
                    generatedQuestionsList.classList.remove('visible');
                    
                    // 显示列表
                    generatedQuestionsList.style.display = 'block';
                    
                    // 触发重绘
                    void generatedQuestionsList.offsetWidth;
                    
                    // 添加动画类
                    generatedQuestionsList.classList.add('visible');
                    
                    // 滚动到题目列表
                    setTimeout(() => {
                        generatedQuestionsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
                
                // 这里可以添加实际的题目生成逻辑
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 这里可以添加结果操作逻辑（编辑、保存、重新生成等）
        });
    });
}

/**
 * 初始化知识拓展功能
 */
function initKnowledgeExpansion() {
    // 文化按钮选择
    const cultureBtns = document.querySelectorAll('.culture-btn');
    
    cultureBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cultureBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换文化类型的逻辑
        });
    });
    
    // 生成按钮
    const generateBtn = document.querySelector('.knowledge-generation .generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
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
 * 初始化思维导图的缩放和拖动功能
 * 使用鼠标中键滚动实现缩放，按住中键拖动实现平移
 */
function initZoomableMindmap() {
    // 在文档加载完毕后或在AI助教-课中页面初始化时调用
    document.addEventListener('DOMContentLoaded', setupMindmapZoom);
    // 也可以在切换到相应页面时初始化
    const aiInClassNav = document.querySelector('.nav-item[data-section="ai-in"]');
    if (aiInClassNav) {
        aiInClassNav.addEventListener('click', setupMindmapZoom);
    }
    
    function setupMindmapZoom() {
        const mindmapContainer = document.getElementById('zoomable-mindmap');
        if (!mindmapContainer) return;
        
        let scale = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;
        
        // 设置初始状态
        updateMindmapTransform();
        
        // 滚动缩放功能 - 不需要按住中键，直接滚动即可缩放
        mindmapContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const zoomSensitivity = 0.1;
            const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
            
            // 计算缩放的鼠标位置
            const rect = mindmapContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 更新缩放比例
            const newScale = Math.max(0.5, Math.min(3, scale + delta));
            
            // 根据鼠标位置计算新的平移值以保持鼠标下方的点不变
            if (scale !== newScale) {
                const scaleRatio = newScale / scale;
                translateX = mouseX - scaleRatio * (mouseX - translateX);
                translateY = mouseY - scaleRatio * (mouseY - translateY);
                scale = newScale;
                
                updateMindmapTransform();
            }
        });
        
        // 中键拖动功能
        mindmapContainer.addEventListener('mousedown', function(e) {
            // 检查是否是中键按下
            if (e.button === 1) {
                e.preventDefault();
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                
                // 改变鼠标指针样式
                mindmapContainer.style.cursor = 'grabbing';
            }
        });
        
        // 处理拖动移动
        window.addEventListener('mousemove', function(e) {
            if (isDragging) {
                e.preventDefault();
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateMindmapTransform();
            }
        });
        
        // 处理拖动结束
        window.addEventListener('mouseup', function(e) {
            if (isDragging && e.button === 1) {
                isDragging = false;
                mindmapContainer.style.cursor = 'default';
            }
        });
        
        // 更新思维导图的变换
        function updateMindmapTransform() {
            if (!mindmapContainer) return;
            mindmapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            mindmapContainer.style.transformOrigin = 'center';
            mindmapContainer.style.transition = isDragging ? 'none' : 'transform 0.2s ease-out';
        }
    }
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
 * 初始化章节滑动功能
 * 处理章节列表的水平滚动和导航按钮
 */
function initChapterSlider() {
    const chapterList = document.querySelector('.chapters-container');
    if (!chapterList) return;

    const prevBtn = document.querySelector('.chapter-nav-btn.prev-btn');
    const nextBtn = document.querySelector('.chapter-nav-btn.next-btn');
    
    if (!prevBtn || !nextBtn) return;
    
    // 初始状态下禁用上一页按钮
    prevBtn.classList.add('disabled');
    prevBtn.style.opacity = '0.5';
    prevBtn.style.cursor = 'not-allowed';
    
    // 卡片容器可见宽度
    const containerWidth = chapterList.offsetWidth;
    // 总内容宽度
    const scrollWidth = chapterList.scrollWidth;
    
    // 检查是否有溢出内容需要滚动
    if (scrollWidth <= containerWidth) {
        nextBtn.classList.add('disabled');
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
        return; // 如果没有滚动内容，不需要继续设置
    }

    // 设置滚动距离
    let cardWidth = 500; // 更新默认卡片宽度（包含外边距）
    const chapterCard = document.querySelector('.chapter-card');
    if (chapterCard) {
        cardWidth = chapterCard.offsetWidth + 20; // 加上外边距
    }
    const cardGap = 30; // 卡片之间的间距
    const scrollDistance = cardWidth + cardGap;

    // 更新按钮状态的函数
    function updateButtonStates() {
        if (!chapterList) return;
        
        const scrollPosition = chapterList.scrollLeft;
        const maxScroll = scrollWidth - containerWidth;
        
        // 根据滚动位置启用/禁用按钮
        if (scrollPosition <= 5) { // 添加少量容差
            prevBtn.classList.add('disabled');
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (scrollPosition >= maxScroll - 5) { // 添加容差值
            nextBtn.classList.add('disabled');
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    // 添加按钮点击事件
    prevBtn.addEventListener('click', function() {
        if (!prevBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    nextBtn.addEventListener('click', function() {
        if (!nextBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    // 监听滚动事件更新按钮状态
    chapterList.addEventListener('scroll', updateButtonStates);
    
    // 初始化按钮状态
    updateButtonStates();
    
    // 确保初始状态下正确设置按钮状态
    setTimeout(updateButtonStates, 100);
}

// 添加课程思政和实训任务部分的交互
function initIdeologyAndPractice() {
    // 思政部分多媒体上传选项切换
    const uploadOptions = document.querySelectorAll('.upload-option');
    if (uploadOptions.length > 0) {
        uploadOptions.forEach(option => {
            option.addEventListener('click', () => {
                uploadOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    // 实训任务选项卡切换
    const practiceTabs = document.querySelectorAll('.practice-tab');
    const practiceContents = document.querySelectorAll('.practice-content');
    
    if (practiceTabs.length > 0) {
        practiceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-practice-tab');
                
                // 更新选项卡状态
                practiceTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 更新内容显示
                practiceContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}-content`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // 虚拟角色选择
    const roleTypes = document.querySelectorAll('.role-type');
    if (roleTypes.length > 0) {
        roleTypes.forEach(role => {
            role.addEventListener('click', () => {
                roleTypes.forEach(r => r.classList.remove('active'));
                role.classList.add('active');
            });
        });
    }

    // 为生成按钮添加点击效果
    const generateButtons = document.querySelectorAll('.generate-btn');
    if (generateButtons.length > 0) {
        generateButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 模拟生成中状态
                const originalText = btn.innerHTML;
                btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span class="zh">生成中...</span><span class="en">Generating...</span>`;
                btn.disabled = true;
                
                // 模拟生成过程
                setTimeout(() => {
                    // 恢复按钮状态
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    
                    // 显示成功通知
                    showNotification('内容已成功生成！', 'success');
                    
                    // 刷新预览区域，这里可以根据实际需求进行更多处理
                    // 此处仅作为示例
                }, 1500);
            });
        });
    }
}

// 初始化最新动态过滤功能
function initActivityFilters() {
    const filterItems = document.querySelectorAll('.filter-item');
    const activityItems = document.querySelectorAll('.activity-item');
    
    if (filterItems.length > 0) {
        filterItems.forEach(item => {
            item.addEventListener('click', () => {
                // 更新过滤器样式
                filterItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const filterType = item.getAttribute('data-filter');
                
                // 显示/隐藏活动项
                activityItems.forEach(activity => {
                    if (filterType === 'all' || activity.classList.contains(filterType)) {
                        activity.style.display = 'flex';
                    } else {
                        activity.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // 查看更多按钮功能
    const moreBtn = document.querySelector('.more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            // 这里可以实现查看更多功能，例如加载更多活动或跳转到活动页面
            showNotification('加载更多动态...', 'info');
        });
    }
}

/**
 * 初始化AI助教-课中部分
 * 处理AI助教-课中部分的交互功能
 */
function initAIInClass() {
    // 初始化控制面板切换
    initClassroomControlPanel();
    
    // 初始化签到分组功能
    initCheckInAndGrouping();
    
    // 初始化课件展示功能
    initSlidesDisplay();
    
    // 初始化互动功能
    initClassInteraction();
    
    // 初始化课堂数据分析
    initClassDataAnalysis();
}

/**
 * 初始化课堂控制面板
 */
function initClassroomControlPanel() {
    const controlItems = document.querySelectorAll('.control-item');
    const classroomPanels = document.querySelectorAll('.classroom-panel');
    
    if (controlItems.length === 0 || classroomPanels.length === 0) return;
    
    controlItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 移除所有控制项的活动状态
            controlItems.forEach(i => i.classList.remove('active'));
            // 为当前点击的控制项添加活动状态
            item.classList.add('active');
            
            // 隐藏所有面板
            classroomPanels.forEach(panel => panel.classList.remove('active'));
            // 显示对应的面板
            if (index < classroomPanels.length) {
                classroomPanels[index].classList.add('active');
            }
        });
    });
    
    // 课堂计时器功能
    const pauseBtn = document.querySelector('.class-status .control-btn:nth-child(3)');
    const stopBtn = document.querySelector('.class-status .control-btn:nth-child(4)');
    const timeDisplay = document.querySelector('.class-time');
    const statusBadge = document.querySelector('.status-badge');
    
    if (pauseBtn && stopBtn && timeDisplay && statusBadge) {
        let isPaused = false;
        let classTime = 0; // 秒数
        let timerInterval;
        
        // 初始化计时器
        function startTimer() {
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    classTime++;
                    updateTimeDisplay();
                }
            }, 1000);
        }
        
        // 更新时间显示
        function updateTimeDisplay() {
            const hours = Math.floor(classTime / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((classTime % 3600) / 60).toString().padStart(2, '0');
            const seconds = (classTime % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // 暂停/继续按钮
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            
            if (isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂已暂停</span><span class="en">Class Paused</span>';
                statusBadge.classList.remove('active');
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂进行中</span><span class="en">Class in Progress</span>';
                statusBadge.classList.add('active');
            }
        });
        
        // 停止按钮
        stopBtn.addEventListener('click', () => {
            if (confirm('确定要结束当前课堂吗？')) {
                clearInterval(timerInterval);
                showNotification('课堂已结束', 'success');
                
                // 模拟导航到课后页面
                setTimeout(() => {
                    const aiPostNav = document.querySelector('.nav-item[data-section="ai-post"]');
                    if (aiPostNav) {
                        aiPostNav.click();
                    }
                }, 1500);
            }
        });
        
        // 启动计时器
        startTimer();
    }
}

/**
 * 初始化签到分组功能
 */
function initCheckInAndGrouping() {
    // 获取DOM元素
    const groupCountInput = document.getElementById('groupCount');
    const peoplePerGroupInput = document.getElementById('peoplePerGroup');
    const groupingMethodSelect = document.getElementById('groupingMethod');
    const groupBtn = document.querySelector('.panel-btn.group-action-btn');
    const groupList = document.querySelector('.group-list');
    
    // 签到二维码按钮
    const qrCodeBtn = document.querySelector('.panel-actions .panel-btn:not(.group-action-btn)');
    if (qrCodeBtn) {
        qrCodeBtn.addEventListener('click', () => {
            showNotification('签到二维码已显示', 'info');
        });
    }
    
    // 添加不同颜色样式到按钮
    if (groupBtn) {
        groupBtn.classList.add('primary-action');
    }
    
    // 数量增减控制
    function initNumberInput(input) {
        if (!input) return;
        
        const decreaseBtn = input.parentElement.querySelector('.decrease');
        const increaseBtn = input.parentElement.querySelector('.increase');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value > parseInt(input.min)) {
                    input.value = value - 1;
                    updateGroupSettings();
                }
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value < parseInt(input.max)) {
                    input.value = value + 1;
                    updateGroupSettings();
                }
            });
        }
        
        // 输入框值变化时更新
        input.addEventListener('change', updateGroupSettings);
    }
    
    // 初始化数量输入框
    initNumberInput(groupCountInput);
    initNumberInput(peoplePerGroupInput);
    
    // 更新分组设置
    function updateGroupSettings() {
        const totalStudents = 78; // 已签到学生数
        const groupCount = parseInt(groupCountInput.value);
        const peoplePerGroup = parseInt(peoplePerGroupInput.value);
        
        // 检查设置是否合理
        if (groupCount * peoplePerGroup > totalStudents) {
            showNotification('当前设置超出总人数,请调整', 'warning');
            return false;
        }
        
        return true;
    }
    
    // 分组按钮点击事件
    if (groupBtn) {
        groupBtn.addEventListener('click', () => {
            if (!updateGroupSettings()) return;
            
            const groupCount = parseInt(groupCountInput.value);
            const peoplePerGroup = parseInt(peoplePerGroupInput.value);
            const groupingMethod = groupingMethodSelect.value;
            
            // 生成模拟学生数据
            const students = generateMockStudents();
            
            // 根据不同方式分组
            const groups = groupStudents(students, groupCount, peoplePerGroup, groupingMethod);
            
            // 显示分组结果
            displayGroups(groups);
        });
    }
    
    // 生成模拟学生数据
    function generateMockStudents() {
        const names = ['张明', '李华', '王芳', '刘伟', '陈晓', '赵阳', '钱宇', '孙丽', '周红', '吴勇', 
                      '郑军', '冯敏', '陈刚', '徐静', '杨光', '朱峰', '秦莉', '许涛', '潘婷', '马超'];
        
        return Array.from({length: 78}, (_, i) => ({
            id: i + 1,
            name: names[i % names.length] + (Math.floor(i / names.length) + 1),
            grade: Math.floor(Math.random() * 40) + 60, // 60-100分
            activity: Math.floor(Math.random() * 100) // 0-100活跃度
        }));
    }
    
    // 根据不同方式分组
    function groupStudents(students, groupCount, peoplePerGroup, method) {
        let groupedStudents = [];
        
        switch (method) {
            case 'balanced': // 成绩均衡
                students.sort((a, b) => b.grade - a.grade);
                break;
            case 'activity': // 活跃度均衡
                students.sort((a, b) => b.activity - a.activity);
                break;
            default: // 随机
                students.sort(() => Math.random() - 0.5);
        }
        
        // 创建分组
        for (let i = 0; i < groupCount; i++) {
            groupedStudents.push([]);
        }
        
        // 蛇形分配,确保每组能力均衡
        let groupIndex = 0;
        let direction = 1;
        
        students.forEach((student, index) => {
            if (groupedStudents[groupIndex].length < peoplePerGroup) {
                groupedStudents[groupIndex].push(student);
            }
            
            groupIndex += direction;
            
            if (groupIndex >= groupCount - 1) {
                direction = -1;
            } else if (groupIndex <= 0) {
                direction = 1;
            }
        });
        
        return groupedStudents;
    }
    
    // 显示分组结果
    function displayGroups(groups) {
        if (!groupList) return;
        
        groupList.innerHTML = '';
        
        groups.forEach((group, index) => {
            if (group.length === 0) return;
            
            const groupItem = document.createElement('div');
            groupItem.className = 'group-item';
            
            groupItem.innerHTML = `
                <div class="group-header">
                    <h4 class="zh">第${index + 1}组 (${group.length}人)</h4>
                    <h4 class="en">Group ${index + 1} (${group.length} Students)</h4>
                    <div class="group-actions">
                        <button class="group-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="group-btn">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </div>
                <div class="student-tags">
                    ${group.slice(0, 5).map(student => `
                        <span class="student-tag" title="成绩:${student.grade} 活跃度:${student.activity}">
                            ${student.name}
                        </span>
                    `).join('')}
                    ${group.length > 5 ? `<span class="student-tag">+${group.length - 5}</span>` : ''}
                </div>
            `;
            
            // 添加编辑和消息按钮事件
            const editBtn = groupItem.querySelector('.group-btn:nth-child(1)');
            const messageBtn = groupItem.querySelector('.group-btn:nth-child(2)');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showNotification(`正在编辑第${index + 1}组`, 'info');
                });
            }
            
            if (messageBtn) {
                messageBtn.addEventListener('click', () => {
                    showNotification(`已向第${index + 1}组发送消息`, 'success');
                });
            }
            
            groupList.appendChild(groupItem);
        });
        
        showNotification('分组完成', 'success');
    }
}

/**
 * 初始化课件展示功能
 */
function initSlidesDisplay() {
    // 幻灯片控制按钮
    const prevSlideBtn = document.querySelector('.slide-control-btn:nth-child(1)');
    const playSlideBtn = document.querySelector('.slide-control-btn:nth-child(2)');
    const nextSlideBtn = document.querySelector('.slide-control-btn:nth-child(3)');
    const slideCounter = document.querySelector('.slide-counter');
    
    if (prevSlideBtn && playSlideBtn && nextSlideBtn && slideCounter) {
        let currentSlide = 15;
        const totalSlides = 45;
        let isPlaying = false;
        let slideInterval;
        
        // 上一张幻灯片
        prevSlideBtn.addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                updateSlideDisplay();
            }
        });
        
        // 播放/暂停幻灯片
        playSlideBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playSlideBtn.innerHTML = '<i class="fas fa-pause"></i>';
                slideInterval = setInterval(() => {
                    if (currentSlide < totalSlides) {
                        currentSlide++;
                        updateSlideDisplay();
                    } else {
                        clearInterval(slideInterval);
                        isPlaying = false;
                        playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }, 3000);
            } else {
                playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                clearInterval(slideInterval);
            }
        });
        
        // 下一张幻灯片
        nextSlideBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlideDisplay();
            }
        });
        
        // 更新幻灯片显示
        function updateSlideDisplay() {
            slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
            
            // 这里可以添加切换幻灯片图片的逻辑
            const slideImg = document.querySelector('.current-slide');
            if (slideImg) {
                slideImg.style.opacity = '0';
                
                setTimeout(() => {
                    slideImg.style.opacity = '1';
                }, 300);
            }
            
            // 更新缩略图选中状态
            const thumbnails = document.querySelectorAll('.slide-thumbnail');
            if (thumbnails.length > 0) {
                thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
                
                // 假设缩略图的顺序与幻灯片顺序对应，选中当前幻灯片的缩略图
                // 由于示例中只有几个缩略图，这里只是模拟效果
                const idx = (currentSlide - 13) % thumbnails.length;
                if (idx >= 0 && idx < thumbnails.length) {
                    thumbnails[idx].classList.add('active');
                }
            }
        }
        
        // 缩略图点击事件
        const thumbnails = document.querySelectorAll('.slide-thumbnail');
        if (thumbnails.length > 0) {
            thumbnails.forEach((thumbnail, idx) => {
                thumbnail.addEventListener('click', () => {
                    // 修改: 避免读取不存在的元素
                    currentSlide = 13 + idx;
                    updateSlideDisplay();
                });
            });
        }
    }
    
    // 全屏和批注按钮
    const fullscreenBtn = document.querySelector('#slides-panel .panel-btn:nth-child(1)');
    const annotateBtn = document.querySelector('#slides-panel .panel-btn:nth-child(2)');
    const slidePreview = document.querySelector('.slide-preview');
    
    if (fullscreenBtn && annotateBtn && slidePreview) {
        fullscreenBtn.addEventListener('click', () => {
            toggleFullscreen();
        });
        
        annotateBtn.addEventListener('click', () => {
            showNotification('已启用批注模式', 'info');
        });
        
        // 全屏切换函数
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                slidePreview.requestFullscreen().catch(err => {
                    showNotification('全屏模式失败: ' + err.message, 'error');
                });
                slidePreview.classList.add('fullscreen');
            } else {
                document.exitFullscreen();
                slidePreview.classList.remove('fullscreen');
            }
        }
        
        // 全屏状态变化监听
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                slidePreview.classList.remove('fullscreen');
            }
        });
        
        // 初始化全屏互动工具
        initFullscreenInteractionTools();
    }
}

/**
 * 初始化全屏模式下的互动工具
 */
function initFullscreenInteractionTools() {
    const interactionTools = document.querySelectorAll('.fullscreen-tool');
    const interactionModal = document.getElementById('interaction-modal');
    const closeInteractionBtn = document.querySelector('.close-interaction-btn');
    
    // 互动工具点击事件
    if (interactionTools.length > 0) {
        interactionTools.forEach(tool => {
            tool.addEventListener('click', () => {
                if (document.fullscreenElement) {
                    // 先退出全屏，再显示互动弹窗
                    document.exitFullscreen().then(() => {
                        setTimeout(() => {
                            openInteractionModal(tool.getAttribute('data-interaction'));
                        }, 300);
                    });
                } else {
                    openInteractionModal(tool.getAttribute('data-interaction'));
                }
            });
        });
    }
    
    // 关闭互动弹窗
    if (closeInteractionBtn) {
        closeInteractionBtn.addEventListener('click', () => {
            interactionModal.classList.remove('active');
        });
    }
    
    // 初始化显示答案按钮事件
    initShowAnswerButtons();
    
    // 打开互动弹窗并显示对应内容
    function openInteractionModal(interactionType) {
        if (!interactionModal) return;
        
        // 隐藏所有互动内容区域
        const interactionSections = interactionModal.querySelectorAll('.interaction-section');
        interactionSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // 根据互动类型显示对应内容
        const targetSection = document.getElementById(`${interactionType}-interaction`);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // 更新弹窗标题
            const headerZh = interactionModal.querySelector('.interaction-header .zh');
            const headerEn = interactionModal.querySelector('.interaction-header .en');
            
            if (headerZh && headerEn) {
                if (interactionType === 'quiz') {
                    headerZh.textContent = '课堂小测';
                    headerEn.textContent = 'Quiz';
                    
                    // 初始化题目导航
                    setTimeout(() => {
                        initQuizNavigation();
                    }, 100);
                } else if (interactionType === 'knowledge') {
                    headerZh.textContent = '知识拓展';
                    headerEn.textContent = 'Knowledge Expansion';
                } else if (interactionType === 'ideology') {
                    headerZh.textContent = '课程思政';
                    headerEn.textContent = 'Ideological Discussion';
                }
            }
            
            // 重置答案显示状态
            const answerContainers = targetSection.querySelectorAll('.answer-container');
            const showAnswerBtns = targetSection.querySelectorAll('.show-answer-btn');
            
            answerContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            showAnswerBtns.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
            });
            
            interactionModal.classList.add('active');
        }
    }
}

/**
 * 初始化显示答案按钮事件
 */
function initShowAnswerButtons() {
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.show-answer-btn')) {
            const btn = e.target.closest('.show-answer-btn');
            const answerContainer = btn.nextElementSibling;
            
            if (answerContainer && answerContainer.classList.contains('answer-container')) {
                if (answerContainer.style.display === 'none') {
                    // 显示答案
                    answerContainer.style.display = 'block';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i><span class="zh">隐藏答案</span><span class="en">Hide Answer</span>';
                } else {
                    // 隐藏答案
                    answerContainer.style.display = 'none';
                    btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
                }
            }
        }
    });
}

/**
 * 初始化互动功能
 */
function initClassInteraction() {
    // 互动类型切换
    const interactionTypes = document.querySelectorAll('.interaction-type');
    
    if (interactionTypes.length > 0) {
        interactionTypes.forEach(type => {
            type.addEventListener('click', () => {
                interactionTypes.forEach(t => t.classList.remove('active'));
                type.classList.add('active');
                
                const typeName = type.querySelector('.zh').textContent;
                showNotification(`已切换到: ${typeName}`, 'info');
            });
        });
    }
    
    // 发起互动按钮
    const startInteractionBtn = document.querySelector('.panel-btn.primary');
    
    if (startInteractionBtn) {
        startInteractionBtn.addEventListener('click', () => {
            const activeType = document.querySelector('.interaction-type.active');
            if (activeType) {
                const typeName = activeType.querySelector('.zh').textContent;
                showNotification(`正在发起: ${typeName}`, 'success');
            }
        });
    }
    
    // 弹幕发送功能
    const danmakuInput = document.querySelector('.danmaku-input.zh');
    const sendDanmakuBtn = document.querySelector('.send-danmaku-btn');
    const danmakuScreen = document.querySelector('.danmaku-screen');
    const sentimentBtns = document.querySelectorAll('.sentiment-btn');
    
    if (danmakuInput && sendDanmakuBtn && danmakuScreen && sentimentBtns.length > 0) {
        // 情感按钮切换
        sentimentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sentimentBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // 发送弹幕
        function sendDanmaku() {
            const content = danmakuInput.value.trim();
            if (content) {
                const danmaku = document.createElement('div');
                danmaku.classList.add('danmaku-item');
                
                // 添加情感类型
                const activeSentiment = document.querySelector('.sentiment-btn.active');
                if (activeSentiment) {
                    if (activeSentiment.classList.contains('agree')) {
                        danmaku.classList.add('agree');
                    } else if (activeSentiment.classList.contains('disagree')) {
                        danmaku.classList.add('disagree');
                    }
                }
                
                danmaku.textContent = content;
                
                // 随机高度
                const top = Math.floor(Math.random() * 150) + 10;
                danmaku.style.top = `${top}px`;
                
                danmakuScreen.appendChild(danmaku);
                danmakuInput.value = '';
                
                // 弹幕动画结束后移除元素
                danmaku.addEventListener('animationend', () => {
                    danmaku.remove();
                });
            }
        }
        
        // 点击发送按钮
        sendDanmakuBtn.addEventListener('click', sendDanmaku);
        
        // 按下回车键发送
        danmakuInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendDanmaku();
            }
        });
        
        // 弹幕设置按钮
        const danmakuSettingBtns = document.querySelectorAll('.danmaku-setting-btn');
        
        if (danmakuSettingBtns.length >= 3) {
            // 设置按钮
            danmakuSettingBtns[0].addEventListener('click', () => {
                showNotification('弹幕设置已打开', 'info');
            });
            
            // 暂停/继续按钮
            let isPaused = false;
            danmakuSettingBtns[1].addEventListener('click', () => {
                isPaused = !isPaused;
                
                if (isPaused) {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-play"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'paused';
                    });
                    showNotification('弹幕已暂停', 'info');
                } else {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-pause"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'running';
                    });
                    showNotification('弹幕已继续', 'info');
                }
            });
            
            // 清空按钮
            danmakuSettingBtns[2].addEventListener('click', () => {
                danmakuScreen.innerHTML = '';
                showNotification('弹幕已清空', 'info');
            });
        }
    }
}

/**
 * 初始化课堂数据分析
 */
function initClassDataAnalysis() {
    // 导出数据按钮
    const exportDataBtn = document.querySelector('#class-data-panel .panel-btn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            showNotification('正在导出课堂数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('课堂数据已导出', 'success');
            }, 800);
        });
    }
    
    // 这里可以添加图表初始化代码，但由于示例中使用的是占位图像，暂不实现
}

/**
 * 初始化学情画像功能
 * 处理学生数据的筛选、排序、查询等交互功能
 */
function initStudentProfile() {
    // 初始化筛选功能
    initProfileFilters();
    
    // 初始化表格操作和分页功能
    initProfileTable();
    
    // 初始化搜索和批量操作功能
    initProfileSearch();
    
    // 初始化表格内操作按钮功能
    initTableActions();
}

/**
 * 初始化筛选功能
 */
function initProfileFilters() {
    const classSelect = document.getElementById('class-select');
    const dateFilter = document.querySelector('.filter-date');
    const filterBtn = document.querySelector('.filter-btn:not(.reset)');
    const resetBtn = document.querySelector('.filter-btn.reset');
    
    if (!classSelect || !dateFilter || !filterBtn || !resetBtn) return;
    
    // 筛选按钮点击事件
    filterBtn.addEventListener('click', () => {
        const selectedClass = classSelect.value;
        const selectedDate = dateFilter.value;
        
        // 模拟筛选操作
        showNotification('正在应用筛选条件...', 'info');
        
        // 这里可以添加实际的筛选逻辑，向后端发送请求等
        setTimeout(() => {
            let message = '';
            
            if (selectedClass !== 'all') {
                const classText = document.querySelector(`#class-select option[value="${selectedClass}"]`).textContent;
                const className = document.body.classList.contains('en-mode') ? 
                    classText.trim() : classText.trim();
                message += `班级: ${className}, `;
            }
            
            if (selectedDate) {
                const dateObj = new Date(selectedDate);
                const formattedDate = dateObj.toLocaleDateString();
                message += `截止日期: ${formattedDate}`;
            }
            
            if (message) {
                showNotification(`筛选已应用: ${message}`, 'success');
            } else {
                showNotification('筛选已应用', 'success');
            }
        }, 500);
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', () => {
        classSelect.value = 'all';
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateFilter.value = `${year}-${month}-${day}`;
        
        showNotification('筛选条件已重置', 'info');
    });
}

/**
 * 初始化表格操作和分页功能
 */
function initProfileTable() {
    const selectAll = document.getElementById('select-all');
    const studentCheckboxes = document.querySelectorAll('.student-checkbox');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const paginationSelect = document.querySelector('.pagination-select');
    
    if (!selectAll || studentCheckboxes.length === 0) return;
    
    // 全选/取消全选
    selectAll.addEventListener('change', () => {
        studentCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    });
    
    // 单个复选框更新全选状态
    studentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(studentCheckboxes).every(cb => cb.checked);
            const anyChecked = Array.from(studentCheckboxes).some(cb => cb.checked);
            
            selectAll.checked = allChecked;
            selectAll.indeterminate = anyChecked && !allChecked;
        });
    });
    
    // 分页按钮点击
    if (paginationBtns.length > 0) {
        paginationBtns.forEach(btn => {
            if (!btn.disabled && !btn.classList.contains('active')) {
                btn.addEventListener('click', () => {
                    // 获取页码
                    const page = btn.textContent;
                    if (!isNaN(page)) {
                        // 数字页码按钮
                        paginationBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        showNotification(`已切换到第 ${page} 页`, 'info');
                    } else if (btn.querySelector('i.fa-chevron-left')) {
                        // 上一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.previousElementSibling && 
                            activePage.previousElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.previousElementSibling.classList.add('active');
                            showNotification(`已切换到上一页`, 'info');
                        }
                    } else if (btn.querySelector('i.fa-chevron-right')) {
                        // 下一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.nextElementSibling && 
                            activePage.nextElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.nextElementSibling.classList.add('active');
                            showNotification(`已切换到下一页`, 'info');
                        }
                    }
                });
            }
        });
    }
    
    // 每页显示数量选择
    if (paginationSelect) {
        paginationSelect.addEventListener('change', () => {
            const perPage = paginationSelect.value;
            showNotification(`每页显示数量已更改为 ${perPage}`, 'info');
        });
    }
}

/**
 * 初始化搜索和批量操作功能
 */
function initProfileSearch() {
    const searchInputs = document.querySelectorAll('.profile-search .search-input');
    const exportBtn = document.querySelector('.action-btn.export');
    const batchBtn = document.querySelector('.action-btn.batch');
    
    // 搜索功能
    if (searchInputs.length > 0) {
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = input.value.trim();
                    if (searchTerm) {
                        showNotification(`正在搜索: ${searchTerm}`, 'info');
                        
                        // 这里可以添加实际的搜索逻辑
                        setTimeout(() => {
                            showNotification(`已找到与 "${searchTerm}" 相关的结果`, 'success');
                        }, 500);
                    }
                }
            });
        });
    }
    
    // 导出数据按钮
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showNotification('正在准备导出数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('数据已成功导出', 'success');
            }, 800);
        });
    }
    
    // 批量操作按钮
    if (batchBtn) {
        batchBtn.addEventListener('click', () => {
            const checkedStudents = document.querySelectorAll('.student-checkbox:checked');
            
            if (checkedStudents.length === 0) {
                showNotification('请先选择学生', 'warning');
                return;
            }
            
            showNotification(`已选择 ${checkedStudents.length} 名学生，准备批量操作`, 'info');
            
            // 这里可以添加实际的批量操作逻辑，例如显示操作菜单等
        });
    }
}

/**
 * 初始化表格内操作按钮功能
 */
function initTableActions() {
    const viewBtns = document.querySelectorAll('.table-btn.view');
    const gradeBtns = document.querySelectorAll('.table-btn.grade');
    const messageBtns = document.querySelectorAll('.table-btn.message');
    
    // 查看学生画像
    if (viewBtns.length > 0) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                const studentId = row.cells[2].textContent;
                
                showNotification(`查看学生画像: ${studentName} (${studentId})`, 'info');
                
                // 这里可以添加打开学生详情模态框的逻辑
            });
        });
    }
    
    // 批阅作业
    if (gradeBtns.length > 0) {
        gradeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`正在批阅 ${studentName} 的作业`, 'info');
                
                // 这里可以添加打开批阅界面的逻辑
            });
        });
    }
    
    // 发送消息
    if (messageBtns.length > 0) {
        messageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`发送消息给 ${studentName}`, 'info');
                
                // 这里可以添加打开消息对话框的逻辑
            });
        });
    }
}

/**
 * 初始化中国文化演化模块
 * 处理文化演化模块中的视图切换、交互等功能
 */
function initCultureEvolution() {
    // 初始化视图切换
    initViewModes();
    
    // 初始化时间轴功能
    initTimelineView();
    
    // 初始化地图视图功能
    initMapView();
    
    // 初始化关系图视图功能
    initRelationView();
    
    // 初始化文化元素卡片功能
    initElementCard();
}

/**
 * 初始化视图模式切换功能
 */
function initViewModes() {
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const evolutionViews = document.querySelectorAll('.evolution-view');
    
    if (viewModeBtns.length === 0 || evolutionViews.length === 0) return;
    
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的活动状态
            viewModeBtns.forEach(b => b.classList.remove('active'));
            // 为当前点击的按钮添加活动状态
            btn.classList.add('active');
            
            // 获取要显示的视图模式
            const viewMode = btn.getAttribute('data-mode');
            
            // 隐藏所有视图
            evolutionViews.forEach(view => view.classList.remove('active'));
            
            // 显示对应的视图
            document.querySelector(`.${viewMode}-view`).classList.add('active');
            
            // 视图切换通知
            const modeName = btn.querySelector('.zh').textContent;
            showNotification(`已切换到${modeName}视图`, 'info');
        });
    });
    
    // 类别和朝代筛选下拉框
    const filterSelects = document.querySelectorAll('.evolution-filters .filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            const filterType = select.querySelector('option:checked').classList.contains('zh') ? 
                select.previousElementSibling.querySelector('.zh').textContent : 
                select.previousElementSibling.querySelector('.en').textContent;
            
            const selectedValue = select.value;
            const selectedText = select.querySelector(`option[value="${selectedValue}"]`).textContent;
            
            showNotification(`已筛选${filterType}: ${selectedText}`, 'info');
            
            // 根据视图模式应用不同的筛选逻辑
            const activeView = document.querySelector('.evolution-view.active');
            
            if (activeView.classList.contains('timeline-view')) {
                applyTimelineFilter(selectedValue);
            } else if (activeView.classList.contains('map-view')) {
                applyMapFilter(selectedValue);
            } else if (activeView.classList.contains('relation-view')) {
                applyRelationFilter(selectedValue);
            }
        });
    });
}

/**
 * 应用时间轴视图筛选
 * @param {string} filter - 筛选条件
 */
function applyTimelineFilter(filter) {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    if (filter === 'all') {
        // 显示所有节点
        timelineNodes.forEach(node => {
            node.style.display = 'block';
        });
        return;
    }
    
    // 筛选节点
    timelineNodes.forEach(node => {
        // 检查节点是否符合筛选条件（类别或朝代）
        const nodeCategory = node.getAttribute('data-category');
        
        if (nodeCategory === filter) {
            node.style.display = 'block';
        } else {
            node.style.display = 'none';
        }
    });
}

/**
 * 应用地图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyMapFilter(filter) {
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    if (filter === 'all') {
        // 显示所有标记
        mapMarkers.forEach(marker => {
            marker.style.display = 'block';
        });
        return;
    }
    
    // 筛选标记
    mapMarkers.forEach(marker => {
        // 检查标记是否符合筛选条件（朝代）
        const markerEra = marker.getAttribute('data-era');
        
        if (markerEra === filter) {
            marker.style.display = 'block';
        } else {
            marker.style.display = 'none';
        }
    });
}

/**
 * 应用关系图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyRelationFilter(filter) {
    // 这里通常会与可视化库（如D3.js）集成
    // 目前仅显示通知
    showNotification(`关系图筛选已应用: ${filter}`, 'info');
}

/**
 * 初始化时间轴视图功能
 */
function initTimelineView() {
    // 缩放控制
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    const zoomSlider = document.querySelector('.zoom-slider input');
    
    if (zoomSlider) {
        // 缩放滑块
        zoomSlider.addEventListener('input', () => {
            const zoomLevel = zoomSlider.value;
            applyTimelineZoom(zoomLevel);
        });
        
        // 缩放按钮
        if (zoomButtons.length >= 2) {
            // 缩小按钮
            zoomButtons[0].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.max(1, currentZoom - 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
            
            // 放大按钮
            zoomButtons[1].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.min(10, currentZoom + 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
        }
    }
    
    // 时间轴导航
    const navigationButtons = document.querySelectorAll('.navigation-btn');
    const timelineEras = document.querySelectorAll('.timeline-era');
    let currentEraIndex = 2; // 默认选中"秦汉"时期
    
    if (navigationButtons.length >= 2 && timelineEras.length > 0) {
        // 上一个时期按钮
        navigationButtons[0].addEventListener('click', () => {
            if (currentEraIndex > 0) {
                currentEraIndex--;
                updateActiveEra();
            }
        });
        
        // 下一个时期按钮
        navigationButtons[1].addEventListener('click', () => {
            if (currentEraIndex < timelineEras.length - 1) {
                currentEraIndex++;
                updateActiveEra();
            }
        });
        
        // 时期点击事件
        timelineEras.forEach((era, index) => {
            era.addEventListener('click', () => {
                currentEraIndex = index;
                updateActiveEra();
            });
        });
        
        // 更新活动时期
        function updateActiveEra() {
            // 更新时期高亮
            timelineEras.forEach(era => era.classList.remove('active'));
            timelineEras[currentEraIndex].classList.add('active');
            
            // 更新导航信息
            const eraLabelZh = timelineEras[currentEraIndex].querySelector('.era-label .zh').textContent;
            const eraLabelEn = timelineEras[currentEraIndex].querySelector('.era-label .en').textContent;
            
            // 模拟不同时期的年代范围
            const eraDates = [
                {zh: '史前时期 (约公元前8000年-前2070年)', en: 'Prehistoric Period (ca. 8000-2070 BC)'},
                {zh: '夏商周时期 (约公元前2070年-前221年)', en: 'Xia-Shang-Zhou Period (ca. 2070-221 BC)'},
                {zh: '秦汉时期 (公元前221年-公元220年)', en: 'Qin-Han Period (221 BC-220 AD)'},
                {zh: '隋唐时期 (公元581年-907年)', en: 'Sui-Tang Period (581-907 AD)'},
                {zh: '宋元时期 (公元960年-1368年)', en: 'Song-Yuan Period (960-1368 AD)'},
                {zh: '明清时期 (公元1368年-1912年)', en: 'Ming-Qing Period (1368-1912 AD)'},
                {zh: '近现代 (公元1912年至今)', en: 'Modern Period (1912-Present)'}
            ];
            
            const navigationInfoZh = document.querySelector('.navigation-info.zh');
            const navigationInfoEn = document.querySelector('.navigation-info.en');
            
            if (navigationInfoZh && navigationInfoEn) {
                navigationInfoZh.textContent = eraDates[currentEraIndex].zh;
                navigationInfoEn.textContent = eraDates[currentEraIndex].en;
            }
            
            // 通知
            showNotification(`已切换到${eraLabelZh}时期`, 'info');
            
            // 更新时间轴上显示的节点
            updateVisibleTimelineNodes();
        }
        
        // 更新可见的时间轴节点
        function updateVisibleTimelineNodes() {
            // 这里可以根据当前选中的时期，显示/隐藏相应的节点
            // 现在简单模拟这个效果
            const eraLeftPosition = [10, 25, 45, 65, 80, 90, 95]; // 时期的大致位置百分比
            const timelineNodes = document.querySelectorAll('.timeline-node');
            
            timelineNodes.forEach(node => {
                const nodeLeft = parseFloat(node.style.left);
                
                // 简单判断节点是否应该在当前时期显示
                // 实际应用中可以使用具体的时间数据来判断
                const lowerBound = currentEraIndex > 0 ? eraLeftPosition[currentEraIndex - 1] : 0;
                const upperBound = currentEraIndex < eraLeftPosition.length - 1 ? eraLeftPosition[currentEraIndex + 1] : 100;
                
                if (nodeLeft >= lowerBound && nodeLeft <= upperBound) {
                    node.style.display = 'block';
                } else {
                    node.style.display = 'none';
                }
            });
        }
    }
    
    // 绑定节点点击事件
    bindTimelineNodeEvents();
}

/**
 * 应用时间轴缩放
 * @param {number} level - 缩放级别
 */
function applyTimelineZoom(level) {
    const timelineItems = document.querySelector('.timeline-items');
    
    if (!timelineItems) return;
    
    // 缩放效果，基础高度为300px，最大可以放大到700px
    const newHeight = 300 + level * 40;
    timelineItems.style.height = `${newHeight}px`;
    
    // 通知
    showNotification(`时间轴缩放级别: ${level}`, 'info');
}

/**
 * 绑定时间轴节点点击事件
 */
function bindTimelineNodeEvents() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    timelineNodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeTitle = node.querySelector('.node-title .zh').textContent;
            
            // 显示文化元素详情卡片
            showElementCard(nodeTitle, node.getAttribute('data-category'));
        });
    });
}

/**
 * 初始化地图视图功能
 */
function initMapView() {
    // 地图标记点点击事件
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const markerLabel = marker.querySelector('.marker-label .zh').textContent;
            
            // 显示地点信息面板
            showLocationInfo(markerLabel);
        });
    });
    
    // 信息面板关闭按钮
    const closeInfoBtn = document.querySelector('.map-info-panel .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoPanel = document.querySelector('.map-info-panel');
            
            if (infoPanel) {
                infoPanel.style.display = 'none';
            }
        });
    }
}

/**
 * 显示地点信息
 * @param {string} location - 地点名称
 */
function showLocationInfo(location) {
    const infoPanel = document.querySelector('.map-info-panel');
    const infoItems = document.querySelectorAll('.info-item');
    
    if (!infoPanel || infoItems.length === 0) return;
    
    // 显示信息面板
    infoPanel.style.display = 'block';
    
    // 根据地点名称匹配相应的信息项
    let found = false;
    
    infoItems.forEach(item => {
        const itemLocation = item.getAttribute('data-location');
        
        if (itemLocation && (itemLocation === location.toLowerCase() || itemLocation.includes(location.toLowerCase()))) {
            // 显示匹配的信息项
            infoItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            found = true;
        }
    });
    
    // 如果没有找到匹配的信息项，使用第一个作为默认
    if (!found && infoItems.length > 0) {
        infoItems.forEach(i => i.classList.remove('active'));
        infoItems[0].classList.add('active');
    }
    
    // 通知
    showNotification(`正在查看: ${location}`, 'info');
}

/**
 * 初始化关系图视图功能
 */
function initRelationView() {
    // 信息框关闭按钮
    const closeInfoBtn = document.querySelector('.graph-info-box .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoBox = document.querySelector('.graph-info-box');
            
            if (infoBox) {
                infoBox.style.display = 'none';
            }
        });
    }
    
    // 关系图点击（使用占位图像模拟）
    const graphPlaceholder = document.querySelector('.graph-placeholder');
    
    if (graphPlaceholder) {
        graphPlaceholder.addEventListener('click', event => {
            // 获取点击位置相对于图像的坐标
            const rect = graphPlaceholder.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // 显示信息框
            showGraphInfo(x, y);
        });
    }
}

/**
 * 显示关系图信息
 * @param {number} x - 点击X坐标
 * @param {number} y - 点击Y坐标
 */
function showGraphInfo(x, y) {
    const infoBox = document.querySelector('.graph-info-box');
    
    if (!infoBox) return;
    
    // 显示信息框
    infoBox.style.display = 'block';
    
    // 通知
    showNotification('已选择关系图元素', 'info');
}

/**
 * 初始化文化元素卡片功能
 */
function initElementCard() {
    // 卡片关闭按钮
    const closeCardBtn = document.querySelector('.culture-element-card .close-card-btn');
    
    if (closeCardBtn) {
        closeCardBtn.addEventListener('click', () => {
            hideElementCard();
        });
    }
    
    // 卡片操作按钮
    const elementBtns = document.querySelectorAll('.element-actions .element-btn');
    
    elementBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const btnText = btn.querySelector('.zh').textContent;
            showNotification(`执行操作: ${btnText}`, 'info');
        });
    });
    
    // 相关元素标签点击
    const elementTags = document.querySelectorAll('.element-tags li');
    
    elementTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.querySelector('.zh').textContent;
            showNotification(`正在查看: ${tagText}`, 'info');
            
            // 模拟加载新的元素详情
            setTimeout(() => {
                showElementCard(tagText);
            }, 500);
        });
    });
}

/**
 * 显示文化元素详情卡片
 * @param {string} elementName - 元素名称
 * @param {string} category - 元素类别
 */
function showElementCard(elementName, category = 'material') {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 更新卡片类别
    const elementCategory = elementCard.querySelector('.element-category');
    
    if (elementCategory) {
        // 移除之前的类别
        elementCategory.classList.remove('material', 'institutional', 'spiritual');
        
        // 添加新的类别
        elementCategory.classList.add(category);
        
        // 更新类别文本
        const categoryTextZh = elementCategory.querySelector('.zh');
        const categoryTextEn = elementCategory.querySelector('.en');
        
        if (categoryTextZh && categoryTextEn) {
            switch (category) {
                case 'material':
                    categoryTextZh.textContent = '物质文化';
                    categoryTextEn.textContent = 'Material Culture';
                    break;
                case 'institutional':
                    categoryTextZh.textContent = '制度文化';
                    categoryTextEn.textContent = 'Institutional Culture';
                    break;
                case 'spiritual':
                    categoryTextZh.textContent = '精神文化';
                    categoryTextEn.textContent = 'Spiritual Culture';
                    break;
            }
        }
    }
    
    // 显示卡片
    elementCard.classList.add('show');
    
    // 通知
    showNotification(`正在查看文化元素: ${elementName}`, 'info');
}

/**
 * 隐藏文化元素详情卡片
 */
function hideElementCard() {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 隐藏卡片
    elementCard.classList.remove('show');
}

/**
 * 初始化内容生成弹窗
 * 处理内容生成弹窗的打开、关闭和交互
 */
function initContentGenerateModal() {
    const modal = document.getElementById('contentGenerateModal');
    const openBtn = document.querySelector('.action-button:nth-child(2)'); // 内容生成按钮
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const generateBtn = modal.querySelector('.generate-btn');
    const tabBtns = modal.querySelectorAll('.generate-tab-btn');
    const tabContents = modal.querySelectorAll('.generate-tab-content');
    const styleBtns = modal.querySelectorAll('.style-btn');
    const sizeBtns = modal.querySelectorAll('.size-btn');
    
    // 打开弹窗
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    }
    
    // 关闭弹窗
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
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
            
            // 模拟生成过程
            setTimeout(() => {
                resultPlaceholder.style.display = 'none';
                
                if (activeTab.id === 'text2text-content') {
                    // 文生文结果
                    const generatedText = activeTab.querySelector('.generated-text');
                    generatedText.style.display = 'block';
                    generatedText.innerHTML = `<h3>中国传统绘画的特点与技法</h3>
<p>中国传统绘画是中华文明的重要组成部分，具有悠久的历史和独特的艺术魅力。以下从几个方面介绍中国传统绘画的主要特点与技法：</p>

<h4>一、中国传统绘画的特点</h4>

<p>1. <strong>以线造型</strong>：中国画以线条为主要表现手段，讲究"线条用笔"，通过不同的线条变化来表现物象的形态和质感。</p>

<p>2. <strong>写意精神</strong>：强调艺术家的主观表达，不追求对客观对象的完全模仿，而是追求"神似"而非"形似"。</p>

<p>3. <strong>虚实结合</strong>：画面中有意识地留白，使实与虚、有与无相互映衬，达到"虚实相生"的艺术效果。</p>

<p>4. <strong>诗书画印结合</strong>：中国画常与诗文、书法、印章相结合，形成独特的综合艺术形式。</p>

<h4>二、主要技法</h4>

<p>1. <strong>用笔技法</strong>：</p>
<ul>
    <li>钩勒：以线条勾画轮廓</li>
    <li>皴法：表现山石纹理的技法</li>
    <li>点法：用笔尖点画，表现叶、花等</li>
    <li>擦法：用侧锋轻擦，表现烟云等</li>
</ul>

<p>2. <strong>用墨技法</strong>：</p>
<ul>
    <li>焦墨：墨色浓重</li>
    <li>浓墨：墨色较重</li>
    <li>淡墨：墨色较淡</li>
    <li>破墨：墨色深浅相间</li>
    <li>渴墨：干笔擦出的效果</li>
</ul>

<p>3. <strong>设色技法</strong>：</p>
<ul>
    <li>工笔重彩：精细描绘，色彩浓重</li>
    <li>淡彩：颜色淡雅</li>
    <li>水墨渲染：水墨晕染效果</li>
    <li>泼墨泼彩：随意挥洒墨与彩</li>
</ul>

<h4>三、主要流派</h4>

<p>1. <strong>北宋山水画</strong>：以范宽、郭熙、李成为代表，追求雄伟壮丽的山水风貌。</p>

<p>2. <strong>南宋院体画</strong>：以马远、夏圭为代表，形成"马一角"、"夏半边"的构图特点。</p>

<p>3. <strong>元代文人画</strong>：以黄公望、吴镇、倪瓒、王蒙"元四家"为代表，重视个人情感表达。</p>

<p>4. <strong>明清写意画</strong>：以徐渭、八大山人、石涛等为代表，笔墨更加随意奔放。</p>

<p>通过学习和掌握这些特点与技法，可以更好地理解和欣赏中国传统绘画的艺术魅力，也为创作实践提供参考和指导。</p>`;
                } else {
                    // 文生图结果
                    const generatedImages = activeTab.querySelector('.generated-images');
                    generatedImages.style.display = 'flex';
                    generatedImages.innerHTML = `
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=中国山水画" alt="生成的图像1">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=青山绿水" alt="生成的图像2">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=亭台楼阁" alt="生成的图像3">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=飞鸟山水" alt="生成的图像4">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                    `;
                    
                    // 给生成的图片添加悬停效果和按钮功能
                    const imageActions = document.querySelectorAll('.image-actions button');
                    imageActions.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            showNotification('图片操作成功', 'success');
                        });
                    });
                }
                
                // 添加结果操作按钮事件
                const actionBtns = activeTab.querySelectorAll('.result-action-btn');
                actionBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (btn.classList.contains('regenerate')) {
                            showNotification('正在重新生成内容...', 'info');
                        } else if (btn.classList.contains('copy')) {
                            showNotification('内容已复制到剪贴板', 'success');
                        } else if (btn.classList.contains('download')) {
                            showNotification('图片已下载', 'success');
                        } else if (btn.classList.contains('insert')) {
                            showNotification('内容已插入到课件', 'success');
                            closeModal();
                        }
                    });
                });
                
            }, 2000);
        });
    }
}

/**
 * 处理标签切换，包括隐藏生成的题目列表
 */
function initTabSwitching() {
    // 标签按钮点击事件
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动标签
            tabBtns.forEach(tb => tb.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // 激活目标标签
            this.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
            
            // 隐藏生成的题目列表，除非是在 quiz 标签中
            const generatedQuestionsList = document.querySelector('.generated-questions-list');
            if (generatedQuestionsList) {
                if (targetTab === 'quiz') {
                    // 只有在生成过题目后才显示题目列表
                    const quizResult = document.querySelector('.quiz-result');
                    if (quizResult && window.getComputedStyle(quizResult).display !== 'none') {
                        generatedQuestionsList.style.display = 'block';
                    } else {
                        generatedQuestionsList.style.display = 'none';
                    }
                } else {
                    generatedQuestionsList.style.display = 'none';
                }
            }
        });
    });
}

/**
 * 初始化内容区域功能
 */
function initContentSections() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitles = document.querySelectorAll('.current-page-title');
    
    // 在页面加载时隐藏生成的题目列表
    const generatedQuestionsList = document.querySelector('.generated-questions-list');
    if (generatedQuestionsList) {
        generatedQuestionsList.style.display = 'none';
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 更新导航项目状态
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // 更新页面标题
            const sectionName = this.querySelector('.nav-text.zh').textContent;
            pageTitles.forEach(title => {
                if (title.classList.contains('zh')) {
                    title.textContent = sectionName;
                } else {
                    title.textContent = this.querySelector('.nav-text.en').textContent;
                }
            });
            
            // 更新内容部分
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('id') === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
            
            // 隐藏生成的题目列表（如果不在相关部分）
            if (generatedQuestionsList) {
                generatedQuestionsList.style.display = 'none';
            }
        });
    });
}

/**
 * 初始化课程思政功能
 */
function initIdeology() {
    // 思政案例生成按钮
    const ideologyGenerateBtn = document.querySelector('.ideology-generation .generate-btn');
    
    if (ideologyGenerateBtn) {
        ideologyGenerateBtn.addEventListener('click', function() {
            showNotification('正在生成思政案例...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                // 获取表单内容
                const themeInput = document.querySelector('.ideology-generation .prompt-input.zh');
                const caseType = document.querySelector('.ideology-generation .ideology-select:first-of-type');
                const caseLength = document.querySelector('.ideology-generation .ideology-select:last-of-type');
                
                // 生成案例内容（这里是示例内容）
                let generatedCase = '';
                if (themeInput && themeInput.value) {
                    const theme = themeInput.value;
                    const type = caseType ? caseType.options[caseType.selectedIndex].text : '故事型案例';
                    const length = caseLength ? caseLength.options[caseLength.selectedIndex].text : '中等';
                    
                    generatedCase = `【${type}】关于"${theme}"的思政案例\n\n`;
                    generatedCase += `这是一个${length}的思政案例示例，主题围绕"${theme}"展开。\n\n`;
                    generatedCase += `在中华优秀传统文化的传承与创新中，"${theme}"始终是一个重要的思想内核。`;
                    generatedCase += `本案例通过具体的历史事件和现代案例，深入阐述了"${theme}"在当代中国发展中的重要意义。`;
                    generatedCase += `学生通过学习本案例，可以更好地理解中华文化的精髓，增强文化自信。`;
                } else {
                    generatedCase = '请先输入思政案例主题...';
                }
                
                // 更新结果区域
                const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
                if (caseTextarea) {
                    caseTextarea.value = generatedCase;
                }
                
                // 显示结果区域
                const ideologyResult = document.querySelector('.ideology-result');
                if (ideologyResult) {
                    ideologyResult.style.display = 'block';
                }
                
                showNotification('思政案例生成成功！', 'success');
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.ideology-result .result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span.zh').textContent;
            const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
            
            switch (action) {
                case '编辑':
                    if (caseTextarea) {
                        caseTextarea.readOnly = false;
                        caseTextarea.focus();
                        showNotification('您可以编辑思政案例内容', 'info');
                    }
                    break;
                    
                case '复制':
                    if (caseTextarea) {
                        caseTextarea.select();
                        document.execCommand('copy');
                        showNotification('案例内容已复制到剪贴板', 'success');
                    }
                    break;
                    
                case '重新生成':
                    showNotification('正在重新生成案例...', 'info');
                    document.querySelector('.ideology-generation .generate-btn').click();
                    break;
            }
        });
    });
}

// 新建思政案例功能
document.addEventListener('DOMContentLoaded', function() {
    const createCaseBtn = document.getElementById('createCaseBtn');
    const createCaseModal = document.getElementById('createCaseModal');
    const closeBtn = createCaseModal.querySelector('.close-btn');
    const cancelBtn = createCaseModal.querySelector('.btn-cancel');
    const saveBtn = document.getElementById('saveNewCaseBtn');
    
    // 打开模态框
    createCaseBtn.addEventListener('click', function() {
        createCaseModal.classList.add('active');
    });
    
    // 关闭模态框
    function closeModal() {
        createCaseModal.classList.remove('active');
        // 清空表单
        document.getElementById('caseTitleInput').value = '';
        document.getElementById('caseContentInput').value = '';
        // 重置复选框
        const checkboxes = document.querySelectorAll('input[name="resourceType"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 保存新案例
    saveBtn.addEventListener('click', function() {
        const title = document.getElementById('caseTitleInput').value.trim();
        const content = document.getElementById('caseContentInput').value.trim();
        const selectedResources = [];
        
        document.querySelectorAll('input[name="resourceType"]:checked').forEach(checkbox => {
            selectedResources.push(checkbox.value);
        });
        
        if (title === '') {
            alert('请输入案例标题');
            return;
        }
        
        if (content === '') {
            alert('请输入案例内容');
            return;
        }
        
        // 这里可以添加保存逻辑，如API调用或本地存储
        
        // 模拟添加到列表
        addNewCaseToList(title, selectedResources);
        
        // 关闭模态框
        closeModal();
    });
    
    // 添加新案例到列表
    function addNewCaseToList(title, resources) {
        const casesTable = document.querySelector('.cases-table tbody');
        const rowCount = casesTable.querySelectorAll('tr').length + 1;
        
        const newRow = document.createElement('tr');
        
        // 创建序号单元格
        const numCell = document.createElement('td');
        numCell.textContent = rowCount;
        
        // 创建标题单元格
        const titleCell = document.createElement('td');
        const zhTitle = document.createElement('p');
        zhTitle.className = 'zh';
        zhTitle.textContent = title;
        const enTitle = document.createElement('p');
        enTitle.className = 'en';
        enTitle.textContent = title; // 在实际应用中可能需要翻译
        titleCell.appendChild(zhTitle);
        titleCell.appendChild(enTitle);
        
        // 创建资源标签单元格
        const resourceCell = document.createElement('td');
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'resource-tags';
        
        resources.forEach(resource => {
            const tagSpan = document.createElement('span');
            tagSpan.className = `resource-tag ${resource}`;
            const icon = document.createElement('i');
            
            if (resource === 'image') {
                icon.className = 'fas fa-image';
            } else if (resource === 'video') {
                icon.className = 'fas fa-video';
            } else if (resource === 'link') {
                icon.className = 'fas fa-link';
            }
            
            tagSpan.appendChild(icon);
            tagsDiv.appendChild(tagSpan);
        });
        
        resourceCell.appendChild(tagsDiv);
        
        // 创建操作按钮单元格
        const actionCell = document.createElement('td');
        
        const viewBtn = document.createElement('button');
        viewBtn.className = 'case-action-btn view';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'case-action-btn edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'case-action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        actionCell.appendChild(viewBtn);
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        
        // 将所有单元格添加到行
        newRow.appendChild(numCell);
        newRow.appendChild(titleCell);
        newRow.appendChild(resourceCell);
        newRow.appendChild(actionCell);
        
        // 将行添加到表格
        casesTable.appendChild(newRow);
    }
}); 

// 全屏功能
function initFullscreenButton() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            editorContent.classList.toggle('fullscreen');
            
            // 切换全屏按钮图标
            const icon = fullscreenBtn.querySelector('i');
            if (editorContent.classList.contains('fullscreen')) {
                icon.classList.remove('fa-expand');
                icon.classList.add('fa-compress');
            } else {
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
        
        // ESC键退出全屏
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && editorContent.classList.contains('fullscreen')) {
                editorContent.classList.remove('fullscreen');
                const icon = fullscreenBtn.querySelector('i');
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
    }
}

// 在页面加载完成后初始化全屏按钮
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initFullscreenButton();
}); 

// 二维码弹窗功能
function initQrcodeModal() {
    // 更新选择器，确保准确找到签到二维码按钮
    const qrcodeBtn = document.querySelector('.panel-btn:not(.group-action-btn)');
    const qrcodeModal = document.getElementById('qrcodeModal');
    
    // 如果找不到相关元素，直接返回
    if (!qrcodeBtn || !qrcodeModal) {
        console.warn('签到二维码相关元素未找到');
        return;
    }
    
    const closeBtn = qrcodeModal.querySelector('.close-btn');
    const refreshBtn = qrcodeModal.querySelector('.refresh-btn');
    const downloadBtn = qrcodeModal.querySelector('.download-btn');
    
    // 确保二维码弹窗默认隐藏
    qrcodeModal.style.display = 'none';
    qrcodeModal.classList.remove('show');
    
    // 显示二维码弹窗
    qrcodeBtn.addEventListener('click', function() {
        qrcodeModal.style.display = 'flex';
        setTimeout(() => {
            qrcodeModal.classList.add('show');
        }, 10);
        generateQRCode();
        showNotification('二维码已生成，有效期5分钟', 'success');
    });
    
    // 关闭二维码弹窗
    closeBtn.addEventListener('click', function() {
        qrcodeModal.classList.remove('show');
        setTimeout(() => {
            qrcodeModal.style.display = 'none';
        }, 300);
    });
    
    // 点击弹窗外部关闭
    qrcodeModal.addEventListener('click', function(e) {
        if (e.target === qrcodeModal) {
            qrcodeModal.classList.remove('show');
            setTimeout(() => {
                qrcodeModal.style.display = 'none';
            }, 300);
        }
    });
    
    // 刷新二维码
    refreshBtn.addEventListener('click', function() {
        generateQRCode();
        showNotification('二维码已刷新，有效期重置为5分钟', 'info');
    });
    
    // 下载二维码
    downloadBtn.addEventListener('click', function() {
        // 获取二维码图片
        const qrImg = document.getElementById('checkinQRCode');
        
        // 创建一个临时链接
        const a = document.createElement('a');
        a.href = qrImg.src;
        a.download = '签到二维码.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('二维码已下载', 'success');
    });
}

// 模拟生成二维码的功能
function generateQRCode() {
    // 实际应用中，这里应该调用后端API生成真实的二维码
    // 此处仅做演示，随机更新二维码图片
    const qrImg = document.getElementById('checkinQRCode');
    const randomId = Math.floor(Math.random() * 1000);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=checkin_session_${randomId}`;
}

// 在文档加载完成后初始化二维码功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化其他功能...
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
}); 

// 初始化替换课件模态框
function initReplaceCoursewareModal() {
    // 此功能已移除
}

/**
 * 中国文化人工智能课程平台 - 教师端
 * 主脚本文件
 */

// 在文件顶部，DOMContentLoaded事件监听器之前添加标记变量
// 全局变量，用于跟踪按钮是否已经绑定事件
let contentGenBtnInitialized = false;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航系统
    initNavigation();
    
    // 初始化语言切换
    initLanguageToggle();
    
    // 初始化章节模态框
    initChapterModal();
    
    // 初始化章节卡片交互
    initChapterCards();
    
    // 更新当前日期显示
    updateCurrentDate();
    
    // 初始化内容生成弹窗
    initContentGenerateModal();
    
    // 初始化AI助教-课前部分
    initAIPre();
    
    // 初始化AI助教-课中部分
    initAIInClass();
    
    // 初始化章节滑动功能
    initChapterSlider();
    
    // 初始化课程思政和实训任务部分
    initIdeologyAndPractice();
    
    // 初始化最新动态过滤功能
    initActivityFilters();
    
    // 初始化学情画像部分
    initStudentProfile();
    
    // 初始化中国文化演化部分
    initCultureEvolution();
    
    // 初始化一键生成功能
    initOneClickGeneration();
    
    // 初始化各个模块
    initContentSections();
    initTabSwitching();
    initQuizGenerator();
    initKnowledgeExpansion(); // 添加知识拓展初始化
    // ... 其他初始化函数
    
    // 在页面加载时隐藏知识拓展列表
    const knowledgeExpansionList = document.querySelector('.knowledge-expansion-list');
    if (knowledgeExpansionList) {
        knowledgeExpansionList.style.display = 'none';
    }
    
    // 设置默认激活的标签
    const defaultTabBtn = document.querySelector('.tab-btn[data-tab="courseware"]');
    if (defaultTabBtn) {
        defaultTabBtn.click();
    }
    
    initIdeology(); // 初始化思政功能
    
    // 全屏功能
    initFullscreenButton();
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
    
    // 初始化课程思政多媒体标签页和案例/讨论题切换功能
    initIdeologyMediaTabs();
    
    initMediaTabs();
    initCaseNavigation();
    initDiscussionNavigation();
    initClassSelection(); // 初始化班级选择功能
    
    // 初始化课后总结部分
    initPostClass();
    
    // 知识图谱功能
    initKnowledgeGraph();
    
    // 获取章节列表数据
    fetchChapters();
    
    // 直接调用更新课程统计数据
    updateCourseStatsCount();
    
    // 新建章节按钮点击事件
    document.getElementById('newChapterBtn').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.add('active');
    });
    
    // 关闭模态框按钮点击事件
    document.getElementById('closeNewChapterModal').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 取消按钮点击事件
    document.getElementById('cancelNewChapter').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 提交表单事件
    document.getElementById('submitNewChapter').addEventListener('click', () => {
        submitNewChapter();
    });
    
    // 文件上传预览
    document.getElementById('coverImage').addEventListener('change', (e) => {
        const fileInput = e.target;
        const filePreview = fileInput.parentElement.querySelector('.file-preview');
        
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            reader.readAsDataURL(fileInput.files[0]);
            
            // 这里应该上传文件到服务器，然后获取文件路径
            // 简化处理：假设上传成功并返回路径
            document.getElementById('coverImagePath').value = `../picture/uploads/${fileInput.files[0].name}`;
        }
    });
    
    // 初始化PPTist iframe集成
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
            document.getElementById(sectionId).classList.add('active');
            
            // 更新页面标题
            const navTextZh = this.querySelector('.nav-text.zh').textContent;
            const navTextEn = this.querySelector('.nav-text.en').textContent;
            pageTitleZh.textContent = navTextZh;
            pageTitleEn.textContent = navTextEn;
            
            // 添加动态效果
            animateContentChange(document.getElementById(sectionId));
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
 * 处理打开和关闭模态框的交互
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
    
    // 确认按钮
    confirmBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 模拟创建章节
            const titleInputZh = modal.querySelector('.form-input.zh');
            const titleInputEn = modal.querySelector('.form-input.en');
            
            if (titleInputZh.value.trim() !== '' || titleInputEn.value.trim() !== '') {
                showNotification('章节创建成功！', 'success');
                closeModal();
                
                // 这里可以添加实际创建章节的代码
            } else {
                showNotification('请填写章节标题', 'warning');
            }
        });
    });
    
    // 文件上传预览
    const fileInputs = modal.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileCount = this.files.length;
            const filePreview = this.closest('.form-group').querySelector('.uploaded-files');
            
            if (filePreview) {
                const textZh = filePreview.querySelector('.zh');
                const textEn = filePreview.querySelector('.en');
                
                if (textZh) textZh.textContent = `已上传: ${fileCount} 个文件`;
                if (textEn) textEn.textContent = `Uploaded: ${fileCount} files`;
            }
        });
    });
}

/**
 * 初始化章节卡片交互
 * 添加章节卡片上的按钮点击事件
 */
function initChapterCards() {
    const editBtns = document.querySelectorAll('.chapter-action-btn.edit');
    const prepareBtns = document.querySelectorAll('.chapter-action-btn.prepare');
    const teachBtns = document.querySelectorAll('.chapter-action-btn.teach');
    
    // 编辑按钮
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            showNotification(`正在编辑${chapterTitle}...`, 'info');
            // 这里可以添加实际的编辑功能
        });
    });
    
    // 备课按钮
    prepareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取章节信息
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            const chapterTitleEn = chapterCard.querySelector('.chapter-title.en').textContent;
            
            // 提取章节序号（从标题中获取第X章）
            const chapterMatch = chapterTitle.match(/第(\d+)章/);
            if (chapterMatch && chapterMatch[1]) {
                const chapterNumber = chapterMatch[1];
                
                // 切换到AI助教-课前界面
                const aiPreNavItem = document.querySelector('.nav-item[data-section="ai-pre"]');
                if (aiPreNavItem) {
                    // 触发点击事件，切换到AI助教-课前界面
                    aiPreNavItem.click();
                    
                    // 延迟一下，等待界面切换完成后设置章节选择器的值
                    setTimeout(() => {
                        // 设置章节选择器
                        const chapterSelect = document.getElementById('chapter-select');
                        if (chapterSelect) {
                            // 查找对应章节的选项
                            const options = chapterSelect.options;
                            for (let i = 0; i < options.length; i++) {
                                if (options[i].value === chapterNumber) {
                                    chapterSelect.selectedIndex = i;
                                    // 手动触发变更事件
                                    const event = new Event('change');
                                    chapterSelect.dispatchEvent(event);
                                    break;
                                }
                            }
                        }
                        
                        showNotification(`正在准备${chapterTitle}的课前内容...`, 'success');
                    }, 300);
                }
            } else {
                showNotification(`无法确定章节编号，请手动选择章节`, 'warning');
            }
        });
    });
    
    // 上课按钮
    teachBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            
            // 切换到"AI助教-课中"界面
            const aiInNavItem = document.querySelector('.nav-item[data-section="ai-in"]');
            if (aiInNavItem) {
                aiInNavItem.click();
                
                showNotification(`开始${chapterTitle}的课堂教学`, 'success');
            }
        });
    });
    
    // 整个卡片点击事件
    const chapterCards = document.querySelectorAll('.chapter-card');
    chapterCards.forEach(card => {
        card.addEventListener('click', function() {
            const chapterTitle = this.querySelector('.chapter-title.zh').textContent;
            showNotification(`查看章节详情: ${chapterTitle}`, 'info');
            
            // 这里可以添加显示章节详情的代码
        });
    });
}

/**
 * 为内容区域添加切换动画
 * @param {HTMLElement} section - 要添加动画的内容区域
 */
function animateContentChange(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    }, 50);
}

/**
 * 创建通知提示
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (success, warning, error, info)
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 添加图标
    const icon = document.createElement('i');
    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            icon.className = 'fas fa-times-circle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    // 添加消息文本
    const text = document.createElement('span');
    text.textContent = message;
    
    // 添加关闭按钮
    const closeBtn = document.createElement('i');
    closeBtn.className = 'fas fa-times close-notification';
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 组装通知元素
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加进入动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动消失
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * 当前日期显示
 * 更新首页欢迎横幅中的日期显示
 */
function updateCurrentDate() {
    const dateElementZh = document.getElementById('current-date-zh');
    const dateElementEn = document.getElementById('current-date-en');
    
    if (dateElementZh && dateElementEn) {
        const now = new Date();
        
        // 中文日期格式
        const zhOptions = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
        let zhDate = now.toLocaleDateString('zh-CN', zhOptions);
        // 进一步格式化中文日期，确保格式为：2023年3月23日 星期四
        zhDate = zhDate.replace(/\//g, '年') + '日';
        zhDate = zhDate.replace(/年(\d+)年/, '年$1月');
        zhDate = zhDate.replace(/星期(.+)日/, '星期$1'); // 去掉星期后面的"日"字
        dateElementZh.textContent = `今天是 ${zhDate}`; // 删除平台口号
        
        // 英文日期格式
        const enOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElementEn.textContent = `Today is ${now.toLocaleDateString('en-US', enOptions)}`;
    }
}

/**
 * 初始化AI助教-课前部分
 */
function initAIPre() {
    // 初始化标签页切换
    initAIPreTabs();
    
    // 初始化课件设计
    initCoursewareDesign();
    
    // 初始化小测题目导航
    initQuizNavigation();
    
    // 初始化可缩放思维导图
    initZoomableMindmap();
    
    // 初始化章节选择器
    initChapterSelector();
}

/**
 * 初始化AI助教-课前选项卡切换
 */
function initAIPreTabs() {
    const tabBtns = document.querySelectorAll('.ai-pre-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.ai-pre-tabs .tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有选项卡的活动状态
            tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
            
            // 为当前点击的选项卡添加活动状态
            this.classList.add('active');
            
            // 获取要显示的内容区域的ID
            const contentId = this.getAttribute('data-tab') + '-content';
            
            // 隐藏所有内容区域
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 显示对应的内容区域
            document.getElementById(contentId).classList.add('active');
            
            // 添加动态效果
            animateTabContentChange(document.getElementById(contentId));
        });
    });
}

/**
 * 初始化课件设计功能
 */
function initCoursewareDesign() {
    const coursewareContent = document.getElementById('courseware-content');
    if (!coursewareContent) return;

    const actionButtons = coursewareContent.querySelectorAll('.action-button');
    const genBtn = actionButtons[0]; // 内容生成按钮是第一个按钮
    const replaceBtn = actionButtons[1]; // 替换课件按钮是第二个按钮
    
    // 内容生成按钮初始化
    if (genBtn && !contentGenBtnInitialized) {
        // 先移除可能已经存在的所有点击事件处理器
        const newGenBtn = genBtn.cloneNode(true);
        genBtn.parentNode.replaceChild(newGenBtn, genBtn);
        
        // 为新的按钮添加单一事件监听器
        newGenBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            // 显示内容生成模态框
            const modal = document.getElementById('contentGenerateModal');
            if (modal) {
                modal.classList.add('active');
            }
        });
        
        contentGenBtnInitialized = true;
        console.log("内容生成按钮已初始化");
    }
    
    // 替换课件按钮初始化
    if (replaceBtn) {
        // 先移除可能已经存在的所有点击事件处理器
        const newReplaceBtn = replaceBtn.cloneNode(true);
        replaceBtn.parentNode.replaceChild(newReplaceBtn, replaceBtn);
        
        // 为新的按钮添加单一事件监听器
        newReplaceBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            
            // 显示替换课件弹窗
            showReplaceCoursewareModal();
        });
        
        console.log("替换课件按钮已初始化");
    }
    
    // 幻灯片缩略图交互
    const thumbnails = coursewareContent.querySelectorAll('.thumbnail-item');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 显示替换课件模态框
    function showReplaceCoursewareModal() {
        // 创建模态框
        let modal = document.getElementById('replaceCoursewareModal');
        
        // 如果模态框不存在，创建一个新的
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'replaceCoursewareModal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="zh">替换课件</h3>
                        <h3 class="en">Replace Courseware</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="file-upload-section">
                            <div class="upload-instructions">
                                <p class="zh">请选择要上传的课件文件，支持PPT、PPTX或PDF格式</p>
                                <p class="en">Please select courseware file to upload, supports PPT, PPTX or PDF formats</p>
                            </div>
                            <div class="file-upload-large">
                                <div class="file-preview-large">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p class="zh">拖放文件到此处或点击上传</p>
                                    <p class="en">Drag and drop files here or click to upload</p>
                                    <p class="file-types zh">支持的格式: PPT, PPTX, PDF</p>
                                    <p class="file-types en">Supported formats: PPT, PPTX, PDF</p>
                                </div>
                                <input type="file" class="file-input" accept=".ppt,.pptx,.pdf">
                            </div>
                            <div class="uploaded-files">
                                <h4 class="zh">已选择文件</h4>
                                <h4 class="en">Selected Files</h4>
                                <div class="no-file-selected">
                                    <p class="zh">未选择任何文件</p>
                                    <p class="en">No file selected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel">
                            <span class="zh">取消</span>
                            <span class="en">Cancel</span>
                        </button>
                        <button class="btn-confirm">
                            <span class="zh">替换</span>
                            <span class="en">Replace</span>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 关闭按钮
            const closeBtn = modal.querySelector('.close-btn');
            const cancelBtn = modal.querySelector('.btn-cancel');
            
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            cancelBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            // 文件上传功能
            const fileInput = modal.querySelector('.file-input');
            const uploadArea = modal.querySelector('.file-preview-large');
            const noFileSelected = modal.querySelector('.no-file-selected');
            const uploadedFiles = modal.querySelector('.uploaded-files');
            
            // 文件上传区域点击触发文件选择
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            // 监听文件选择变化
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    
                    // 处理已选择的文件
                    noFileSelected.style.display = 'none';
                    
                    // 移除旧的文件详情
                    const oldFileDetails = uploadedFiles.querySelector('.file-details');
                    if (oldFileDetails) {
                        oldFileDetails.remove();
                    }
                    
                    // 创建文件详情显示
                    const fileDetails = document.createElement('div');
                    fileDetails.className = 'file-details';
                    
                    // 根据文件类型显示不同的图标
                    let fileIcon = 'fa-file';
                    if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
                        fileIcon = 'fa-file-powerpoint';
                    } else if (file.name.endsWith('.pdf')) {
                        fileIcon = 'fa-file-pdf';
                    }
                    
                    // 计算文件大小显示
                    let fileSize = (file.size / 1024).toFixed(2) + ' KB';
                    if (file.size > 1024 * 1024) {
                        fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                    }
                    
                    fileDetails.innerHTML = `
                        <div class="file-icon"><i class="fas ${fileIcon}"></i></div>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${fileSize}</div>
                        </div>
                        <button class="remove-file-btn"><i class="fas fa-times"></i></button>
                    `;
                    
                    uploadedFiles.appendChild(fileDetails);
                    
                    // 添加删除文件的按钮事件
                    const removeBtn = fileDetails.querySelector('.remove-file-btn');
                    removeBtn.addEventListener('click', () => {
                        fileInput.value = '';
                        fileDetails.remove();
                        noFileSelected.style.display = 'block';
                    });
                }
            });
            
            // 拖放功能
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    fileInput.files = e.dataTransfer.files;
                    
                    // 触发change事件以更新UI
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            });
            
            // 替换按钮点击事件
            const confirmBtn = modal.querySelector('.btn-confirm');
            confirmBtn.addEventListener('click', () => {
                if (fileInput.files.length > 0) {
                    showNotification('课件替换成功', 'success');
                    modal.classList.remove('active');
                } else {
                    showNotification('请选择一个文件', 'warning');
                }
            });
        }
        
        // 显示模态框
        modal.classList.add('active');
    }
    
    // 全屏按钮功能
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                // 进入全屏 - 整个编辑器区域
                if (editorContent.requestFullscreen) {
                    editorContent.requestFullscreen();
                } else if (editorContent.mozRequestFullScreen) { // Firefox
                    editorContent.mozRequestFullScreen();
                } else if (editorContent.webkitRequestFullscreen) { // Chrome, Safari, Opera
                    editorContent.webkitRequestFullscreen();
                } else if (editorContent.msRequestFullscreen) { // IE/Edge
                    editorContent.msRequestFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenBtn.title = "退出全屏";
            } else {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        });
        
        // 监听全屏变化事件
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement && 
                !document.msFullscreenElement) {
                // 退出全屏
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        }
    }
}

/**
 * 初始化课堂小测功能
 */
function initQuizGenerator() {
    // 题型选择
    const quizTypes = document.querySelectorAll('.quiz-type');
    
    quizTypes.forEach(type => {
        type.addEventListener('click', function() {
            quizTypes.forEach(qt => qt.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换题型的逻辑
        });
    });
    
    // 生成方式选择
    const optionBtns = document.querySelectorAll('.option-btn');
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换生成方式的逻辑
        });
    });
    
    // 难度滑块
    const difficultySlider = document.getElementById('difficulty-slider');
    
    if (difficultySlider) {
        difficultySlider.addEventListener('input', function() {
            // 这里可以添加难度调整的逻辑
        });
    }
    
    // 生成按钮
    const generateBtn = document.querySelector('.generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            showNotification('正在生成题目...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                showNotification('题目生成成功！', 'success');
                
                // 显示题目结果和生成的题目列表
                const quizResult = document.querySelector('.quiz-result');
                const generatedQuestionsList = document.querySelector('.generated-questions-list');
                
                if (quizResult) {
                    quizResult.style.display = 'block';
                }
                
                if (generatedQuestionsList) {
                    // 清除之前的动画
                    generatedQuestionsList.classList.remove('visible');
                    
                    // 显示列表
                    generatedQuestionsList.style.display = 'block';
                    
                    // 触发重绘
                    void generatedQuestionsList.offsetWidth;
                    
                    // 添加动画类
                    generatedQuestionsList.classList.add('visible');
                    
                    // 滚动到题目列表
                    setTimeout(() => {
                        generatedQuestionsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
                
                // 这里可以添加实际的题目生成逻辑
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 这里可以添加结果操作逻辑（编辑、保存、重新生成等）
        });
    });
}

/**
 * 初始化知识拓展功能
 */
function initKnowledgeExpansion() {
    // 文化按钮选择
    const cultureBtns = document.querySelectorAll('.culture-btn');
    
    cultureBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cultureBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换文化类型的逻辑
        });
    });
    
    // 生成按钮
    const generateBtn = document.querySelector('.knowledge-generation .generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
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
 * 初始化思维导图的缩放和拖动功能
 * 使用鼠标中键滚动实现缩放，按住中键拖动实现平移
 */
function initZoomableMindmap() {
    // 在文档加载完毕后或在AI助教-课中页面初始化时调用
    document.addEventListener('DOMContentLoaded', setupMindmapZoom);
    // 也可以在切换到相应页面时初始化
    const aiInClassNav = document.querySelector('.nav-item[data-section="ai-in"]');
    if (aiInClassNav) {
        aiInClassNav.addEventListener('click', setupMindmapZoom);
    }
    
    function setupMindmapZoom() {
        const mindmapContainer = document.getElementById('zoomable-mindmap');
        if (!mindmapContainer) return;
        
        let scale = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;
        
        // 设置初始状态
        updateMindmapTransform();
        
        // 滚动缩放功能 - 不需要按住中键，直接滚动即可缩放
        mindmapContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const zoomSensitivity = 0.1;
            const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
            
            // 计算缩放的鼠标位置
            const rect = mindmapContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 更新缩放比例
            const newScale = Math.max(0.5, Math.min(3, scale + delta));
            
            // 根据鼠标位置计算新的平移值以保持鼠标下方的点不变
            if (scale !== newScale) {
                const scaleRatio = newScale / scale;
                translateX = mouseX - scaleRatio * (mouseX - translateX);
                translateY = mouseY - scaleRatio * (mouseY - translateY);
                scale = newScale;
                
                updateMindmapTransform();
            }
        });
        
        // 中键拖动功能
        mindmapContainer.addEventListener('mousedown', function(e) {
            // 检查是否是中键按下
            if (e.button === 1) {
                e.preventDefault();
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                
                // 改变鼠标指针样式
                mindmapContainer.style.cursor = 'grabbing';
            }
        });
        
        // 处理拖动移动
        window.addEventListener('mousemove', function(e) {
            if (isDragging) {
                e.preventDefault();
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateMindmapTransform();
            }
        });
        
        // 处理拖动结束
        window.addEventListener('mouseup', function(e) {
            if (isDragging && e.button === 1) {
                isDragging = false;
                mindmapContainer.style.cursor = 'default';
            }
        });
        
        // 更新思维导图的变换
        function updateMindmapTransform() {
            if (!mindmapContainer) return;
            mindmapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            mindmapContainer.style.transformOrigin = 'center';
            mindmapContainer.style.transition = isDragging ? 'none' : 'transform 0.2s ease-out';
        }
    }
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
 * 初始化章节滑动功能
 * 处理章节列表的水平滚动和导航按钮
 */
function initChapterSlider() {
    const chapterList = document.querySelector('.chapters-container');
    if (!chapterList) return;

    const prevBtn = document.querySelector('.chapter-nav-btn.prev-btn');
    const nextBtn = document.querySelector('.chapter-nav-btn.next-btn');
    
    if (!prevBtn || !nextBtn) return;
    
    // 初始状态下禁用上一页按钮
    prevBtn.classList.add('disabled');
    prevBtn.style.opacity = '0.5';
    prevBtn.style.cursor = 'not-allowed';
    
    // 卡片容器可见宽度
    const containerWidth = chapterList.offsetWidth;
    // 总内容宽度
    const scrollWidth = chapterList.scrollWidth;
    
    // 检查是否有溢出内容需要滚动
    if (scrollWidth <= containerWidth) {
        nextBtn.classList.add('disabled');
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
        return; // 如果没有滚动内容，不需要继续设置
    }

    // 设置滚动距离
    let cardWidth = 500; // 更新默认卡片宽度（包含外边距）
    const chapterCard = document.querySelector('.chapter-card');
    if (chapterCard) {
        cardWidth = chapterCard.offsetWidth + 20; // 加上外边距
    }
    const cardGap = 30; // 卡片之间的间距
    const scrollDistance = cardWidth + cardGap;

    // 更新按钮状态的函数
    function updateButtonStates() {
        if (!chapterList) return;
        
        const scrollPosition = chapterList.scrollLeft;
        const maxScroll = scrollWidth - containerWidth;
        
        // 根据滚动位置启用/禁用按钮
        if (scrollPosition <= 5) { // 添加少量容差
            prevBtn.classList.add('disabled');
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (scrollPosition >= maxScroll - 5) { // 添加容差值
            nextBtn.classList.add('disabled');
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    // 添加按钮点击事件
    prevBtn.addEventListener('click', function() {
        if (!prevBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    nextBtn.addEventListener('click', function() {
        if (!nextBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    // 监听滚动事件更新按钮状态
    chapterList.addEventListener('scroll', updateButtonStates);
    
    // 初始化按钮状态
    updateButtonStates();
    
    // 确保初始状态下正确设置按钮状态
    setTimeout(updateButtonStates, 100);
}

// 添加课程思政和实训任务部分的交互
function initIdeologyAndPractice() {
    // 思政部分多媒体上传选项切换
    const uploadOptions = document.querySelectorAll('.upload-option');
    if (uploadOptions.length > 0) {
        uploadOptions.forEach(option => {
            option.addEventListener('click', () => {
                uploadOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    // 实训任务选项卡切换
    const practiceTabs = document.querySelectorAll('.practice-tab');
    const practiceContents = document.querySelectorAll('.practice-content');
    
    if (practiceTabs.length > 0) {
        practiceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-practice-tab');
                
                // 更新选项卡状态
                practiceTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 更新内容显示
                practiceContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}-content`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // 虚拟角色选择
    const roleTypes = document.querySelectorAll('.role-type');
    if (roleTypes.length > 0) {
        roleTypes.forEach(role => {
            role.addEventListener('click', () => {
                roleTypes.forEach(r => r.classList.remove('active'));
                role.classList.add('active');
            });
        });
    }

    // 为生成按钮添加点击效果
    const generateButtons = document.querySelectorAll('.generate-btn');
    if (generateButtons.length > 0) {
        generateButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 模拟生成中状态
                const originalText = btn.innerHTML;
                btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span class="zh">生成中...</span><span class="en">Generating...</span>`;
                btn.disabled = true;
                
                // 模拟生成过程
                setTimeout(() => {
                    // 恢复按钮状态
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    
                    // 显示成功通知
                    showNotification('内容已成功生成！', 'success');
                    
                    // 刷新预览区域，这里可以根据实际需求进行更多处理
                    // 此处仅作为示例
                }, 1500);
            });
        });
    }
}

// 初始化最新动态过滤功能
function initActivityFilters() {
    const filterItems = document.querySelectorAll('.filter-item');
    const activityItems = document.querySelectorAll('.activity-item');
    
    if (filterItems.length > 0) {
        filterItems.forEach(item => {
            item.addEventListener('click', () => {
                // 更新过滤器样式
                filterItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const filterType = item.getAttribute('data-filter');
                
                // 显示/隐藏活动项
                activityItems.forEach(activity => {
                    if (filterType === 'all' || activity.classList.contains(filterType)) {
                        activity.style.display = 'flex';
                    } else {
                        activity.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // 查看更多按钮功能
    const moreBtn = document.querySelector('.more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            // 这里可以实现查看更多功能，例如加载更多活动或跳转到活动页面
            showNotification('加载更多动态...', 'info');
        });
    }
}

/**
 * 初始化AI助教-课中部分
 * 处理AI助教-课中部分的交互功能
 */
function initAIInClass() {
    // 初始化控制面板切换
    initClassroomControlPanel();
    
    // 初始化签到分组功能
    initCheckInAndGrouping();
    
    // 初始化课件展示功能
    initSlidesDisplay();
    
    // 初始化互动功能
    initClassInteraction();
    
    // 初始化课堂数据分析
    initClassDataAnalysis();
}

/**
 * 初始化课堂控制面板
 */
function initClassroomControlPanel() {
    const controlItems = document.querySelectorAll('.control-item');
    const classroomPanels = document.querySelectorAll('.classroom-panel');
    
    if (controlItems.length === 0 || classroomPanels.length === 0) return;
    
    controlItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 移除所有控制项的活动状态
            controlItems.forEach(i => i.classList.remove('active'));
            // 为当前点击的控制项添加活动状态
            item.classList.add('active');
            
            // 隐藏所有面板
            classroomPanels.forEach(panel => panel.classList.remove('active'));
            // 显示对应的面板
            if (index < classroomPanels.length) {
                classroomPanels[index].classList.add('active');
            }
        });
    });
    
    // 课堂计时器功能
    const pauseBtn = document.querySelector('.class-status .control-btn:nth-child(3)');
    const stopBtn = document.querySelector('.class-status .control-btn:nth-child(4)');
    const timeDisplay = document.querySelector('.class-time');
    const statusBadge = document.querySelector('.status-badge');
    
    if (pauseBtn && stopBtn && timeDisplay && statusBadge) {
        let isPaused = false;
        let classTime = 0; // 秒数
        let timerInterval;
        
        // 初始化计时器
        function startTimer() {
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    classTime++;
                    updateTimeDisplay();
                }
            }, 1000);
        }
        
        // 更新时间显示
        function updateTimeDisplay() {
            const hours = Math.floor(classTime / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((classTime % 3600) / 60).toString().padStart(2, '0');
            const seconds = (classTime % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // 暂停/继续按钮
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            
            if (isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂已暂停</span><span class="en">Class Paused</span>';
                statusBadge.classList.remove('active');
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂进行中</span><span class="en">Class in Progress</span>';
                statusBadge.classList.add('active');
            }
        });
        
        // 停止按钮
        stopBtn.addEventListener('click', () => {
            if (confirm('确定要结束当前课堂吗？')) {
                clearInterval(timerInterval);
                showNotification('课堂已结束', 'success');
                
                // 模拟导航到课后页面
                setTimeout(() => {
                    const aiPostNav = document.querySelector('.nav-item[data-section="ai-post"]');
                    if (aiPostNav) {
                        aiPostNav.click();
                    }
                }, 1500);
            }
        });
        
        // 启动计时器
        startTimer();
    }
}

/**
 * 初始化签到分组功能
 */
function initCheckInAndGrouping() {
    // 获取DOM元素
    const groupCountInput = document.getElementById('groupCount');
    const peoplePerGroupInput = document.getElementById('peoplePerGroup');
    const groupingMethodSelect = document.getElementById('groupingMethod');
    const groupBtn = document.querySelector('.panel-btn.group-action-btn');
    const groupList = document.querySelector('.group-list');
    
    // 签到二维码按钮
    const qrCodeBtn = document.querySelector('.panel-actions .panel-btn:not(.group-action-btn)');
    if (qrCodeBtn) {
        qrCodeBtn.addEventListener('click', () => {
            showNotification('签到二维码已显示', 'info');
        });
    }
    
    // 添加不同颜色样式到按钮
    if (groupBtn) {
        groupBtn.classList.add('primary-action');
    }
    
    // 数量增减控制
    function initNumberInput(input) {
        if (!input) return;
        
        const decreaseBtn = input.parentElement.querySelector('.decrease');
        const increaseBtn = input.parentElement.querySelector('.increase');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value > parseInt(input.min)) {
                    input.value = value - 1;
                    updateGroupSettings();
                }
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value < parseInt(input.max)) {
                    input.value = value + 1;
                    updateGroupSettings();
                }
            });
        }
        
        // 输入框值变化时更新
        input.addEventListener('change', updateGroupSettings);
    }
    
    // 初始化数量输入框
    initNumberInput(groupCountInput);
    initNumberInput(peoplePerGroupInput);
    
    // 更新分组设置
    function updateGroupSettings() {
        const totalStudents = 78; // 已签到学生数
        const groupCount = parseInt(groupCountInput.value);
        const peoplePerGroup = parseInt(peoplePerGroupInput.value);
        
        // 检查设置是否合理
        if (groupCount * peoplePerGroup > totalStudents) {
            showNotification('当前设置超出总人数,请调整', 'warning');
            return false;
        }
        
        return true;
    }
    
    // 分组按钮点击事件
    if (groupBtn) {
        groupBtn.addEventListener('click', () => {
            if (!updateGroupSettings()) return;
            
            const groupCount = parseInt(groupCountInput.value);
            const peoplePerGroup = parseInt(peoplePerGroupInput.value);
            const groupingMethod = groupingMethodSelect.value;
            
            // 生成模拟学生数据
            const students = generateMockStudents();
            
            // 根据不同方式分组
            const groups = groupStudents(students, groupCount, peoplePerGroup, groupingMethod);
            
            // 显示分组结果
            displayGroups(groups);
        });
    }
    
    // 生成模拟学生数据
    function generateMockStudents() {
        const names = ['张明', '李华', '王芳', '刘伟', '陈晓', '赵阳', '钱宇', '孙丽', '周红', '吴勇', 
                      '郑军', '冯敏', '陈刚', '徐静', '杨光', '朱峰', '秦莉', '许涛', '潘婷', '马超'];
        
        return Array.from({length: 78}, (_, i) => ({
            id: i + 1,
            name: names[i % names.length] + (Math.floor(i / names.length) + 1),
            grade: Math.floor(Math.random() * 40) + 60, // 60-100分
            activity: Math.floor(Math.random() * 100) // 0-100活跃度
        }));
    }
    
    // 根据不同方式分组
    function groupStudents(students, groupCount, peoplePerGroup, method) {
        let groupedStudents = [];
        
        switch (method) {
            case 'balanced': // 成绩均衡
                students.sort((a, b) => b.grade - a.grade);
                break;
            case 'activity': // 活跃度均衡
                students.sort((a, b) => b.activity - a.activity);
                break;
            default: // 随机
                students.sort(() => Math.random() - 0.5);
        }
        
        // 创建分组
        for (let i = 0; i < groupCount; i++) {
            groupedStudents.push([]);
        }
        
        // 蛇形分配,确保每组能力均衡
        let groupIndex = 0;
        let direction = 1;
        
        students.forEach((student, index) => {
            if (groupedStudents[groupIndex].length < peoplePerGroup) {
                groupedStudents[groupIndex].push(student);
            }
            
            groupIndex += direction;
            
            if (groupIndex >= groupCount - 1) {
                direction = -1;
            } else if (groupIndex <= 0) {
                direction = 1;
            }
        });
        
        return groupedStudents;
    }
    
    // 显示分组结果
    function displayGroups(groups) {
        if (!groupList) return;
        
        groupList.innerHTML = '';
        
        groups.forEach((group, index) => {
            if (group.length === 0) return;
            
            const groupItem = document.createElement('div');
            groupItem.className = 'group-item';
            
            groupItem.innerHTML = `
                <div class="group-header">
                    <h4 class="zh">第${index + 1}组 (${group.length}人)</h4>
                    <h4 class="en">Group ${index + 1} (${group.length} Students)</h4>
                    <div class="group-actions">
                        <button class="group-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="group-btn">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </div>
                <div class="student-tags">
                    ${group.slice(0, 5).map(student => `
                        <span class="student-tag" title="成绩:${student.grade} 活跃度:${student.activity}">
                            ${student.name}
                        </span>
                    `).join('')}
                    ${group.length > 5 ? `<span class="student-tag">+${group.length - 5}</span>` : ''}
                </div>
            `;
            
            // 添加编辑和消息按钮事件
            const editBtn = groupItem.querySelector('.group-btn:nth-child(1)');
            const messageBtn = groupItem.querySelector('.group-btn:nth-child(2)');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showNotification(`正在编辑第${index + 1}组`, 'info');
                });
            }
            
            if (messageBtn) {
                messageBtn.addEventListener('click', () => {
                    showNotification(`已向第${index + 1}组发送消息`, 'success');
                });
            }
            
            groupList.appendChild(groupItem);
        });
        
        showNotification('分组完成', 'success');
    }
}

/**
 * 初始化课件展示功能
 */
function initSlidesDisplay() {
    // 幻灯片控制按钮
    const prevSlideBtn = document.querySelector('.slide-control-btn:nth-child(1)');
    const playSlideBtn = document.querySelector('.slide-control-btn:nth-child(2)');
    const nextSlideBtn = document.querySelector('.slide-control-btn:nth-child(3)');
    const slideCounter = document.querySelector('.slide-counter');
    
    if (prevSlideBtn && playSlideBtn && nextSlideBtn && slideCounter) {
        let currentSlide = 15;
        const totalSlides = 45;
        let isPlaying = false;
        let slideInterval;
        
        // 上一张幻灯片
        prevSlideBtn.addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                updateSlideDisplay();
            }
        });
        
        // 播放/暂停幻灯片
        playSlideBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playSlideBtn.innerHTML = '<i class="fas fa-pause"></i>';
                slideInterval = setInterval(() => {
                    if (currentSlide < totalSlides) {
                        currentSlide++;
                        updateSlideDisplay();
                    } else {
                        clearInterval(slideInterval);
                        isPlaying = false;
                        playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }, 3000);
            } else {
                playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                clearInterval(slideInterval);
            }
        });
        
        // 下一张幻灯片
        nextSlideBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlideDisplay();
            }
        });
        
        // 更新幻灯片显示
        function updateSlideDisplay() {
            slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
            
            // 这里可以添加切换幻灯片图片的逻辑
            const slideImg = document.querySelector('.current-slide');
            if (slideImg) {
                slideImg.style.opacity = '0';
                
                setTimeout(() => {
                    slideImg.style.opacity = '1';
                }, 300);
            }
            
            // 更新缩略图选中状态
            const thumbnails = document.querySelectorAll('.slide-thumbnail');
            if (thumbnails.length > 0) {
                thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
                
                // 假设缩略图的顺序与幻灯片顺序对应，选中当前幻灯片的缩略图
                // 由于示例中只有几个缩略图，这里只是模拟效果
                const idx = (currentSlide - 13) % thumbnails.length;
                if (idx >= 0 && idx < thumbnails.length) {
                    thumbnails[idx].classList.add('active');
                }
            }
        }
        
        // 缩略图点击事件
        const thumbnails = document.querySelectorAll('.slide-thumbnail');
        if (thumbnails.length > 0) {
            thumbnails.forEach((thumbnail, idx) => {
                thumbnail.addEventListener('click', () => {
                    // 修改: 避免读取不存在的元素
                    currentSlide = 13 + idx;
                    updateSlideDisplay();
                });
            });
        }
    }
    
    // 全屏和批注按钮
    const fullscreenBtn = document.querySelector('#slides-panel .panel-btn:nth-child(1)');
    const annotateBtn = document.querySelector('#slides-panel .panel-btn:nth-child(2)');
    const slidePreview = document.querySelector('.slide-preview');
    
    if (fullscreenBtn && annotateBtn && slidePreview) {
        fullscreenBtn.addEventListener('click', () => {
            toggleFullscreen();
        });
        
        annotateBtn.addEventListener('click', () => {
            showNotification('已启用批注模式', 'info');
        });
        
        // 全屏切换函数
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                slidePreview.requestFullscreen().catch(err => {
                    showNotification('全屏模式失败: ' + err.message, 'error');
                });
                slidePreview.classList.add('fullscreen');
            } else {
                document.exitFullscreen();
                slidePreview.classList.remove('fullscreen');
            }
        }
        
        // 全屏状态变化监听
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                slidePreview.classList.remove('fullscreen');
            }
        });
        
        // 初始化全屏互动工具
        initFullscreenInteractionTools();
    }
}

/**
 * 初始化全屏模式下的互动工具
 */
function initFullscreenInteractionTools() {
    const interactionTools = document.querySelectorAll('.fullscreen-tool');
    const interactionModal = document.getElementById('interaction-modal');
    const closeInteractionBtn = document.querySelector('.close-interaction-btn');
    
    // 互动工具点击事件
    if (interactionTools.length > 0) {
        interactionTools.forEach(tool => {
            tool.addEventListener('click', () => {
                if (document.fullscreenElement) {
                    // 先退出全屏，再显示互动弹窗
                    document.exitFullscreen().then(() => {
                        setTimeout(() => {
                            openInteractionModal(tool.getAttribute('data-interaction'));
                        }, 300);
                    });
                } else {
                    openInteractionModal(tool.getAttribute('data-interaction'));
                }
            });
        });
    }
    
    // 关闭互动弹窗
    if (closeInteractionBtn) {
        closeInteractionBtn.addEventListener('click', () => {
            interactionModal.classList.remove('active');
        });
    }
    
    // 初始化显示答案按钮事件
    initShowAnswerButtons();
    
    // 打开互动弹窗并显示对应内容
    function openInteractionModal(interactionType) {
        if (!interactionModal) return;
        
        // 隐藏所有互动内容区域
        const interactionSections = interactionModal.querySelectorAll('.interaction-section');
        interactionSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // 根据互动类型显示对应内容
        const targetSection = document.getElementById(`${interactionType}-interaction`);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // 更新弹窗标题
            const headerZh = interactionModal.querySelector('.interaction-header .zh');
            const headerEn = interactionModal.querySelector('.interaction-header .en');
            
            if (headerZh && headerEn) {
                if (interactionType === 'quiz') {
                    headerZh.textContent = '课堂小测';
                    headerEn.textContent = 'Quiz';
                    
                    // 初始化题目导航
                    setTimeout(() => {
                        initQuizNavigation();
                    }, 100);
                } else if (interactionType === 'knowledge') {
                    headerZh.textContent = '知识拓展';
                    headerEn.textContent = 'Knowledge Expansion';
                } else if (interactionType === 'ideology') {
                    headerZh.textContent = '课程思政';
                    headerEn.textContent = 'Ideological Discussion';
                }
            }
            
            // 重置答案显示状态
            const answerContainers = targetSection.querySelectorAll('.answer-container');
            const showAnswerBtns = targetSection.querySelectorAll('.show-answer-btn');
            
            answerContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            showAnswerBtns.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
            });
            
            interactionModal.classList.add('active');
        }
    }
}

/**
 * 初始化显示答案按钮事件
 */
function initShowAnswerButtons() {
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.show-answer-btn')) {
            const btn = e.target.closest('.show-answer-btn');
            const answerContainer = btn.nextElementSibling;
            
            if (answerContainer && answerContainer.classList.contains('answer-container')) {
                if (answerContainer.style.display === 'none') {
                    // 显示答案
                    answerContainer.style.display = 'block';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i><span class="zh">隐藏答案</span><span class="en">Hide Answer</span>';
                } else {
                    // 隐藏答案
                    answerContainer.style.display = 'none';
                    btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
                }
            }
        }
    });
}

/**
 * 初始化互动功能
 */
function initClassInteraction() {
    // 互动类型切换
    const interactionTypes = document.querySelectorAll('.interaction-type');
    
    if (interactionTypes.length > 0) {
        interactionTypes.forEach(type => {
            type.addEventListener('click', () => {
                interactionTypes.forEach(t => t.classList.remove('active'));
                type.classList.add('active');
                
                const typeName = type.querySelector('.zh').textContent;
                showNotification(`已切换到: ${typeName}`, 'info');
            });
        });
    }
    
    // 发起互动按钮
    const startInteractionBtn = document.querySelector('.panel-btn.primary');
    
    if (startInteractionBtn) {
        startInteractionBtn.addEventListener('click', () => {
            const activeType = document.querySelector('.interaction-type.active');
            if (activeType) {
                const typeName = activeType.querySelector('.zh').textContent;
                showNotification(`正在发起: ${typeName}`, 'success');
            }
        });
    }
    
    // 弹幕发送功能
    const danmakuInput = document.querySelector('.danmaku-input.zh');
    const sendDanmakuBtn = document.querySelector('.send-danmaku-btn');
    const danmakuScreen = document.querySelector('.danmaku-screen');
    const sentimentBtns = document.querySelectorAll('.sentiment-btn');
    
    if (danmakuInput && sendDanmakuBtn && danmakuScreen && sentimentBtns.length > 0) {
        // 情感按钮切换
        sentimentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sentimentBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // 发送弹幕
        function sendDanmaku() {
            const content = danmakuInput.value.trim();
            if (content) {
                const danmaku = document.createElement('div');
                danmaku.classList.add('danmaku-item');
                
                // 添加情感类型
                const activeSentiment = document.querySelector('.sentiment-btn.active');
                if (activeSentiment) {
                    if (activeSentiment.classList.contains('agree')) {
                        danmaku.classList.add('agree');
                    } else if (activeSentiment.classList.contains('disagree')) {
                        danmaku.classList.add('disagree');
                    }
                }
                
                danmaku.textContent = content;
                
                // 随机高度
                const top = Math.floor(Math.random() * 150) + 10;
                danmaku.style.top = `${top}px`;
                
                danmakuScreen.appendChild(danmaku);
                danmakuInput.value = '';
                
                // 弹幕动画结束后移除元素
                danmaku.addEventListener('animationend', () => {
                    danmaku.remove();
                });
            }
        }
        
        // 点击发送按钮
        sendDanmakuBtn.addEventListener('click', sendDanmaku);
        
        // 按下回车键发送
        danmakuInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendDanmaku();
            }
        });
        
        // 弹幕设置按钮
        const danmakuSettingBtns = document.querySelectorAll('.danmaku-setting-btn');
        
        if (danmakuSettingBtns.length >= 3) {
            // 设置按钮
            danmakuSettingBtns[0].addEventListener('click', () => {
                showNotification('弹幕设置已打开', 'info');
            });
            
            // 暂停/继续按钮
            let isPaused = false;
            danmakuSettingBtns[1].addEventListener('click', () => {
                isPaused = !isPaused;
                
                if (isPaused) {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-play"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'paused';
                    });
                    showNotification('弹幕已暂停', 'info');
                } else {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-pause"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'running';
                    });
                    showNotification('弹幕已继续', 'info');
                }
            });
            
            // 清空按钮
            danmakuSettingBtns[2].addEventListener('click', () => {
                danmakuScreen.innerHTML = '';
                showNotification('弹幕已清空', 'info');
            });
        }
    }
}

/**
 * 初始化课堂数据分析
 */
function initClassDataAnalysis() {
    // 导出数据按钮
    const exportDataBtn = document.querySelector('#class-data-panel .panel-btn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            showNotification('正在导出课堂数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('课堂数据已导出', 'success');
            }, 800);
        });
    }
    
    // 这里可以添加图表初始化代码，但由于示例中使用的是占位图像，暂不实现
}

/**
 * 初始化学情画像功能
 * 处理学生数据的筛选、排序、查询等交互功能
 */
function initStudentProfile() {
    // 初始化筛选功能
    initProfileFilters();
    
    // 初始化表格操作和分页功能
    initProfileTable();
    
    // 初始化搜索和批量操作功能
    initProfileSearch();
    
    // 初始化表格内操作按钮功能
    initTableActions();
}

/**
 * 初始化筛选功能
 */
function initProfileFilters() {
    const classSelect = document.getElementById('class-select');
    const dateFilter = document.querySelector('.filter-date');
    const filterBtn = document.querySelector('.filter-btn:not(.reset)');
    const resetBtn = document.querySelector('.filter-btn.reset');
    
    if (!classSelect || !dateFilter || !filterBtn || !resetBtn) return;
    
    // 筛选按钮点击事件
    filterBtn.addEventListener('click', () => {
        const selectedClass = classSelect.value;
        const selectedDate = dateFilter.value;
        
        // 模拟筛选操作
        showNotification('正在应用筛选条件...', 'info');
        
        // 这里可以添加实际的筛选逻辑，向后端发送请求等
        setTimeout(() => {
            let message = '';
            
            if (selectedClass !== 'all') {
                const classText = document.querySelector(`#class-select option[value="${selectedClass}"]`).textContent;
                const className = document.body.classList.contains('en-mode') ? 
                    classText.trim() : classText.trim();
                message += `班级: ${className}, `;
            }
            
            if (selectedDate) {
                const dateObj = new Date(selectedDate);
                const formattedDate = dateObj.toLocaleDateString();
                message += `截止日期: ${formattedDate}`;
            }
            
            if (message) {
                showNotification(`筛选已应用: ${message}`, 'success');
            } else {
                showNotification('筛选已应用', 'success');
            }
        }, 500);
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', () => {
        classSelect.value = 'all';
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateFilter.value = `${year}-${month}-${day}`;
        
        showNotification('筛选条件已重置', 'info');
    });
}

/**
 * 初始化表格操作和分页功能
 */
function initProfileTable() {
    const selectAll = document.getElementById('select-all');
    const studentCheckboxes = document.querySelectorAll('.student-checkbox');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const paginationSelect = document.querySelector('.pagination-select');
    
    if (!selectAll || studentCheckboxes.length === 0) return;
    
    // 全选/取消全选
    selectAll.addEventListener('change', () => {
        studentCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    });
    
    // 单个复选框更新全选状态
    studentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(studentCheckboxes).every(cb => cb.checked);
            const anyChecked = Array.from(studentCheckboxes).some(cb => cb.checked);
            
            selectAll.checked = allChecked;
            selectAll.indeterminate = anyChecked && !allChecked;
        });
    });
    
    // 分页按钮点击
    if (paginationBtns.length > 0) {
        paginationBtns.forEach(btn => {
            if (!btn.disabled && !btn.classList.contains('active')) {
                btn.addEventListener('click', () => {
                    // 获取页码
                    const page = btn.textContent;
                    if (!isNaN(page)) {
                        // 数字页码按钮
                        paginationBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        showNotification(`已切换到第 ${page} 页`, 'info');
                    } else if (btn.querySelector('i.fa-chevron-left')) {
                        // 上一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.previousElementSibling && 
                            activePage.previousElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.previousElementSibling.classList.add('active');
                            showNotification(`已切换到上一页`, 'info');
                        }
                    } else if (btn.querySelector('i.fa-chevron-right')) {
                        // 下一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.nextElementSibling && 
                            activePage.nextElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.nextElementSibling.classList.add('active');
                            showNotification(`已切换到下一页`, 'info');
                        }
                    }
                });
            }
        });
    }
    
    // 每页显示数量选择
    if (paginationSelect) {
        paginationSelect.addEventListener('change', () => {
            const perPage = paginationSelect.value;
            showNotification(`每页显示数量已更改为 ${perPage}`, 'info');
        });
    }
}

/**
 * 初始化搜索和批量操作功能
 */
function initProfileSearch() {
    const searchInputs = document.querySelectorAll('.profile-search .search-input');
    const exportBtn = document.querySelector('.action-btn.export');
    const batchBtn = document.querySelector('.action-btn.batch');
    
    // 搜索功能
    if (searchInputs.length > 0) {
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = input.value.trim();
                    if (searchTerm) {
                        showNotification(`正在搜索: ${searchTerm}`, 'info');
                        
                        // 这里可以添加实际的搜索逻辑
                        setTimeout(() => {
                            showNotification(`已找到与 "${searchTerm}" 相关的结果`, 'success');
                        }, 500);
                    }
                }
            });
        });
    }
    
    // 导出数据按钮
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showNotification('正在准备导出数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('数据已成功导出', 'success');
            }, 800);
        });
    }
    
    // 批量操作按钮
    if (batchBtn) {
        batchBtn.addEventListener('click', () => {
            const checkedStudents = document.querySelectorAll('.student-checkbox:checked');
            
            if (checkedStudents.length === 0) {
                showNotification('请先选择学生', 'warning');
                return;
            }
            
            showNotification(`已选择 ${checkedStudents.length} 名学生，准备批量操作`, 'info');
            
            // 这里可以添加实际的批量操作逻辑，例如显示操作菜单等
        });
    }
}

/**
 * 初始化表格内操作按钮功能
 */
function initTableActions() {
    const viewBtns = document.querySelectorAll('.table-btn.view');
    const gradeBtns = document.querySelectorAll('.table-btn.grade');
    const messageBtns = document.querySelectorAll('.table-btn.message');
    
    // 查看学生画像
    if (viewBtns.length > 0) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                const studentId = row.cells[2].textContent;
                
                showNotification(`查看学生画像: ${studentName} (${studentId})`, 'info');
                
                // 这里可以添加打开学生详情模态框的逻辑
            });
        });
    }
    
    // 批阅作业
    if (gradeBtns.length > 0) {
        gradeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`正在批阅 ${studentName} 的作业`, 'info');
                
                // 这里可以添加打开批阅界面的逻辑
            });
        });
    }
    
    // 发送消息
    if (messageBtns.length > 0) {
        messageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`发送消息给 ${studentName}`, 'info');
                
                // 这里可以添加打开消息对话框的逻辑
            });
        });
    }
}

/**
 * 初始化中国文化演化模块
 * 处理文化演化模块中的视图切换、交互等功能
 */
function initCultureEvolution() {
    // 初始化视图切换
    initViewModes();
    
    // 初始化时间轴功能
    initTimelineView();
    
    // 初始化地图视图功能
    initMapView();
    
    // 初始化关系图视图功能
    initRelationView();
    
    // 初始化文化元素卡片功能
    initElementCard();
}

/**
 * 初始化视图模式切换功能
 */
function initViewModes() {
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const evolutionViews = document.querySelectorAll('.evolution-view');
    
    if (viewModeBtns.length === 0 || evolutionViews.length === 0) return;
    
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的活动状态
            viewModeBtns.forEach(b => b.classList.remove('active'));
            // 为当前点击的按钮添加活动状态
            btn.classList.add('active');
            
            // 获取要显示的视图模式
            const viewMode = btn.getAttribute('data-mode');
            
            // 隐藏所有视图
            evolutionViews.forEach(view => view.classList.remove('active'));
            
            // 显示对应的视图
            document.querySelector(`.${viewMode}-view`).classList.add('active');
            
            // 视图切换通知
            const modeName = btn.querySelector('.zh').textContent;
            showNotification(`已切换到${modeName}视图`, 'info');
        });
    });
    
    // 类别和朝代筛选下拉框
    const filterSelects = document.querySelectorAll('.evolution-filters .filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            const filterType = select.querySelector('option:checked').classList.contains('zh') ? 
                select.previousElementSibling.querySelector('.zh').textContent : 
                select.previousElementSibling.querySelector('.en').textContent;
            
            const selectedValue = select.value;
            const selectedText = select.querySelector(`option[value="${selectedValue}"]`).textContent;
            
            showNotification(`已筛选${filterType}: ${selectedText}`, 'info');
            
            // 根据视图模式应用不同的筛选逻辑
            const activeView = document.querySelector('.evolution-view.active');
            
            if (activeView.classList.contains('timeline-view')) {
                applyTimelineFilter(selectedValue);
            } else if (activeView.classList.contains('map-view')) {
                applyMapFilter(selectedValue);
            } else if (activeView.classList.contains('relation-view')) {
                applyRelationFilter(selectedValue);
            }
        });
    });
}

/**
 * 应用时间轴视图筛选
 * @param {string} filter - 筛选条件
 */
function applyTimelineFilter(filter) {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    if (filter === 'all') {
        // 显示所有节点
        timelineNodes.forEach(node => {
            node.style.display = 'block';
        });
        return;
    }
    
    // 筛选节点
    timelineNodes.forEach(node => {
        // 检查节点是否符合筛选条件（类别或朝代）
        const nodeCategory = node.getAttribute('data-category');
        
        if (nodeCategory === filter) {
            node.style.display = 'block';
        } else {
            node.style.display = 'none';
        }
    });
}

/**
 * 应用地图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyMapFilter(filter) {
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    if (filter === 'all') {
        // 显示所有标记
        mapMarkers.forEach(marker => {
            marker.style.display = 'block';
        });
        return;
    }
    
    // 筛选标记
    mapMarkers.forEach(marker => {
        // 检查标记是否符合筛选条件（朝代）
        const markerEra = marker.getAttribute('data-era');
        
        if (markerEra === filter) {
            marker.style.display = 'block';
        } else {
            marker.style.display = 'none';
        }
    });
}

/**
 * 应用关系图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyRelationFilter(filter) {
    // 这里通常会与可视化库（如D3.js）集成
    // 目前仅显示通知
    showNotification(`关系图筛选已应用: ${filter}`, 'info');
}

/**
 * 初始化时间轴视图功能
 */
function initTimelineView() {
    // 缩放控制
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    const zoomSlider = document.querySelector('.zoom-slider input');
    
    if (zoomSlider) {
        // 缩放滑块
        zoomSlider.addEventListener('input', () => {
            const zoomLevel = zoomSlider.value;
            applyTimelineZoom(zoomLevel);
        });
        
        // 缩放按钮
        if (zoomButtons.length >= 2) {
            // 缩小按钮
            zoomButtons[0].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.max(1, currentZoom - 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
            
            // 放大按钮
            zoomButtons[1].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.min(10, currentZoom + 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
        }
    }
    
    // 时间轴导航
    const navigationButtons = document.querySelectorAll('.navigation-btn');
    const timelineEras = document.querySelectorAll('.timeline-era');
    let currentEraIndex = 2; // 默认选中"秦汉"时期
    
    if (navigationButtons.length >= 2 && timelineEras.length > 0) {
        // 上一个时期按钮
        navigationButtons[0].addEventListener('click', () => {
            if (currentEraIndex > 0) {
                currentEraIndex--;
                updateActiveEra();
            }
        });
        
        // 下一个时期按钮
        navigationButtons[1].addEventListener('click', () => {
            if (currentEraIndex < timelineEras.length - 1) {
                currentEraIndex++;
                updateActiveEra();
            }
        });
        
        // 时期点击事件
        timelineEras.forEach((era, index) => {
            era.addEventListener('click', () => {
                currentEraIndex = index;
                updateActiveEra();
            });
        });
        
        // 更新活动时期
        function updateActiveEra() {
            // 更新时期高亮
            timelineEras.forEach(era => era.classList.remove('active'));
            timelineEras[currentEraIndex].classList.add('active');
            
            // 更新导航信息
            const eraLabelZh = timelineEras[currentEraIndex].querySelector('.era-label .zh').textContent;
            const eraLabelEn = timelineEras[currentEraIndex].querySelector('.era-label .en').textContent;
            
            // 模拟不同时期的年代范围
            const eraDates = [
                {zh: '史前时期 (约公元前8000年-前2070年)', en: 'Prehistoric Period (ca. 8000-2070 BC)'},
                {zh: '夏商周时期 (约公元前2070年-前221年)', en: 'Xia-Shang-Zhou Period (ca. 2070-221 BC)'},
                {zh: '秦汉时期 (公元前221年-公元220年)', en: 'Qin-Han Period (221 BC-220 AD)'},
                {zh: '隋唐时期 (公元581年-907年)', en: 'Sui-Tang Period (581-907 AD)'},
                {zh: '宋元时期 (公元960年-1368年)', en: 'Song-Yuan Period (960-1368 AD)'},
                {zh: '明清时期 (公元1368年-1912年)', en: 'Ming-Qing Period (1368-1912 AD)'},
                {zh: '近现代 (公元1912年至今)', en: 'Modern Period (1912-Present)'}
            ];
            
            const navigationInfoZh = document.querySelector('.navigation-info.zh');
            const navigationInfoEn = document.querySelector('.navigation-info.en');
            
            if (navigationInfoZh && navigationInfoEn) {
                navigationInfoZh.textContent = eraDates[currentEraIndex].zh;
                navigationInfoEn.textContent = eraDates[currentEraIndex].en;
            }
            
            // 通知
            showNotification(`已切换到${eraLabelZh}时期`, 'info');
            
            // 更新时间轴上显示的节点
            updateVisibleTimelineNodes();
        }
        
        // 更新可见的时间轴节点
        function updateVisibleTimelineNodes() {
            // 这里可以根据当前选中的时期，显示/隐藏相应的节点
            // 现在简单模拟这个效果
            const eraLeftPosition = [10, 25, 45, 65, 80, 90, 95]; // 时期的大致位置百分比
            const timelineNodes = document.querySelectorAll('.timeline-node');
            
            timelineNodes.forEach(node => {
                const nodeLeft = parseFloat(node.style.left);
                
                // 简单判断节点是否应该在当前时期显示
                // 实际应用中可以使用具体的时间数据来判断
                const lowerBound = currentEraIndex > 0 ? eraLeftPosition[currentEraIndex - 1] : 0;
                const upperBound = currentEraIndex < eraLeftPosition.length - 1 ? eraLeftPosition[currentEraIndex + 1] : 100;
                
                if (nodeLeft >= lowerBound && nodeLeft <= upperBound) {
                    node.style.display = 'block';
                } else {
                    node.style.display = 'none';
                }
            });
        }
    }
    
    // 绑定节点点击事件
    bindTimelineNodeEvents();
}

/**
 * 应用时间轴缩放
 * @param {number} level - 缩放级别
 */
function applyTimelineZoom(level) {
    const timelineItems = document.querySelector('.timeline-items');
    
    if (!timelineItems) return;
    
    // 缩放效果，基础高度为300px，最大可以放大到700px
    const newHeight = 300 + level * 40;
    timelineItems.style.height = `${newHeight}px`;
    
    // 通知
    showNotification(`时间轴缩放级别: ${level}`, 'info');
}

/**
 * 绑定时间轴节点点击事件
 */
function bindTimelineNodeEvents() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    timelineNodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeTitle = node.querySelector('.node-title .zh').textContent;
            
            // 显示文化元素详情卡片
            showElementCard(nodeTitle, node.getAttribute('data-category'));
        });
    });
}

/**
 * 初始化地图视图功能
 */
function initMapView() {
    // 地图标记点点击事件
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const markerLabel = marker.querySelector('.marker-label .zh').textContent;
            
            // 显示地点信息面板
            showLocationInfo(markerLabel);
        });
    });
    
    // 信息面板关闭按钮
    const closeInfoBtn = document.querySelector('.map-info-panel .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoPanel = document.querySelector('.map-info-panel');
            
            if (infoPanel) {
                infoPanel.style.display = 'none';
            }
        });
    }
}

/**
 * 显示地点信息
 * @param {string} location - 地点名称
 */
function showLocationInfo(location) {
    const infoPanel = document.querySelector('.map-info-panel');
    const infoItems = document.querySelectorAll('.info-item');
    
    if (!infoPanel || infoItems.length === 0) return;
    
    // 显示信息面板
    infoPanel.style.display = 'block';
    
    // 根据地点名称匹配相应的信息项
    let found = false;
    
    infoItems.forEach(item => {
        const itemLocation = item.getAttribute('data-location');
        
        if (itemLocation && (itemLocation === location.toLowerCase() || itemLocation.includes(location.toLowerCase()))) {
            // 显示匹配的信息项
            infoItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            found = true;
        }
    });
    
    // 如果没有找到匹配的信息项，使用第一个作为默认
    if (!found && infoItems.length > 0) {
        infoItems.forEach(i => i.classList.remove('active'));
        infoItems[0].classList.add('active');
    }
    
    // 通知
    showNotification(`正在查看: ${location}`, 'info');
}

/**
 * 初始化关系图视图功能
 */
function initRelationView() {
    // 信息框关闭按钮
    const closeInfoBtn = document.querySelector('.graph-info-box .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoBox = document.querySelector('.graph-info-box');
            
            if (infoBox) {
                infoBox.style.display = 'none';
            }
        });
    }
    
    // 关系图点击（使用占位图像模拟）
    const graphPlaceholder = document.querySelector('.graph-placeholder');
    
    if (graphPlaceholder) {
        graphPlaceholder.addEventListener('click', event => {
            // 获取点击位置相对于图像的坐标
            const rect = graphPlaceholder.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // 显示信息框
            showGraphInfo(x, y);
        });
    }
}

/**
 * 显示关系图信息
 * @param {number} x - 点击X坐标
 * @param {number} y - 点击Y坐标
 */
function showGraphInfo(x, y) {
    const infoBox = document.querySelector('.graph-info-box');
    
    if (!infoBox) return;
    
    // 显示信息框
    infoBox.style.display = 'block';
    
    // 通知
    showNotification('已选择关系图元素', 'info');
}

/**
 * 初始化文化元素卡片功能
 */
function initElementCard() {
    // 卡片关闭按钮
    const closeCardBtn = document.querySelector('.culture-element-card .close-card-btn');
    
    if (closeCardBtn) {
        closeCardBtn.addEventListener('click', () => {
            hideElementCard();
        });
    }
    
    // 卡片操作按钮
    const elementBtns = document.querySelectorAll('.element-actions .element-btn');
    
    elementBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const btnText = btn.querySelector('.zh').textContent;
            showNotification(`执行操作: ${btnText}`, 'info');
        });
    });
    
    // 相关元素标签点击
    const elementTags = document.querySelectorAll('.element-tags li');
    
    elementTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.querySelector('.zh').textContent;
            showNotification(`正在查看: ${tagText}`, 'info');
            
            // 模拟加载新的元素详情
            setTimeout(() => {
                showElementCard(tagText);
            }, 500);
        });
    });
}

/**
 * 显示文化元素详情卡片
 * @param {string} elementName - 元素名称
 * @param {string} category - 元素类别
 */
function showElementCard(elementName, category = 'material') {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 更新卡片类别
    const elementCategory = elementCard.querySelector('.element-category');
    
    if (elementCategory) {
        // 移除之前的类别
        elementCategory.classList.remove('material', 'institutional', 'spiritual');
        
        // 添加新的类别
        elementCategory.classList.add(category);
        
        // 更新类别文本
        const categoryTextZh = elementCategory.querySelector('.zh');
        const categoryTextEn = elementCategory.querySelector('.en');
        
        if (categoryTextZh && categoryTextEn) {
            switch (category) {
                case 'material':
                    categoryTextZh.textContent = '物质文化';
                    categoryTextEn.textContent = 'Material Culture';
                    break;
                case 'institutional':
                    categoryTextZh.textContent = '制度文化';
                    categoryTextEn.textContent = 'Institutional Culture';
                    break;
                case 'spiritual':
                    categoryTextZh.textContent = '精神文化';
                    categoryTextEn.textContent = 'Spiritual Culture';
                    break;
            }
        }
    }
    
    // 显示卡片
    elementCard.classList.add('show');
    
    // 通知
    showNotification(`正在查看文化元素: ${elementName}`, 'info');
}

/**
 * 隐藏文化元素详情卡片
 */
function hideElementCard() {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 隐藏卡片
    elementCard.classList.remove('show');
}

/**
 * 初始化内容生成弹窗
 * 处理内容生成弹窗的打开、关闭和交互
 */
function initContentGenerateModal() {
    const modal = document.getElementById('contentGenerateModal');
    const openBtn = document.querySelector('.action-button:nth-child(2)'); // 内容生成按钮
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const generateBtn = modal.querySelector('.generate-btn');
    const tabBtns = modal.querySelectorAll('.generate-tab-btn');
    const tabContents = modal.querySelectorAll('.generate-tab-content');
    const styleBtns = modal.querySelectorAll('.style-btn');
    const sizeBtns = modal.querySelectorAll('.size-btn');
    
    // 打开弹窗
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    }
    
    // 关闭弹窗
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
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
            
            // 模拟生成过程
            setTimeout(() => {
                resultPlaceholder.style.display = 'none';
                
                if (activeTab.id === 'text2text-content') {
                    // 文生文结果
                    const generatedText = activeTab.querySelector('.generated-text');
                    generatedText.style.display = 'block';
                    generatedText.innerHTML = `<h3>中国传统绘画的特点与技法</h3>
<p>中国传统绘画是中华文明的重要组成部分，具有悠久的历史和独特的艺术魅力。以下从几个方面介绍中国传统绘画的主要特点与技法：</p>

<h4>一、中国传统绘画的特点</h4>

<p>1. <strong>以线造型</strong>：中国画以线条为主要表现手段，讲究"线条用笔"，通过不同的线条变化来表现物象的形态和质感。</p>

<p>2. <strong>写意精神</strong>：强调艺术家的主观表达，不追求对客观对象的完全模仿，而是追求"神似"而非"形似"。</p>

<p>3. <strong>虚实结合</strong>：画面中有意识地留白，使实与虚、有与无相互映衬，达到"虚实相生"的艺术效果。</p>

<p>4. <strong>诗书画印结合</strong>：中国画常与诗文、书法、印章相结合，形成独特的综合艺术形式。</p>

<h4>二、主要技法</h4>

<p>1. <strong>用笔技法</strong>：</p>
<ul>
    <li>钩勒：以线条勾画轮廓</li>
    <li>皴法：表现山石纹理的技法</li>
    <li>点法：用笔尖点画，表现叶、花等</li>
    <li>擦法：用侧锋轻擦，表现烟云等</li>
</ul>

<p>2. <strong>用墨技法</strong>：</p>
<ul>
    <li>焦墨：墨色浓重</li>
    <li>浓墨：墨色较重</li>
    <li>淡墨：墨色较淡</li>
    <li>破墨：墨色深浅相间</li>
    <li>渴墨：干笔擦出的效果</li>
</ul>

<p>3. <strong>设色技法</strong>：</p>
<ul>
    <li>工笔重彩：精细描绘，色彩浓重</li>
    <li>淡彩：颜色淡雅</li>
    <li>水墨渲染：水墨晕染效果</li>
    <li>泼墨泼彩：随意挥洒墨与彩</li>
</ul>

<h4>三、主要流派</h4>

<p>1. <strong>北宋山水画</strong>：以范宽、郭熙、李成为代表，追求雄伟壮丽的山水风貌。</p>

<p>2. <strong>南宋院体画</strong>：以马远、夏圭为代表，形成"马一角"、"夏半边"的构图特点。</p>

<p>3. <strong>元代文人画</strong>：以黄公望、吴镇、倪瓒、王蒙"元四家"为代表，重视个人情感表达。</p>

<p>4. <strong>明清写意画</strong>：以徐渭、八大山人、石涛等为代表，笔墨更加随意奔放。</p>

<p>通过学习和掌握这些特点与技法，可以更好地理解和欣赏中国传统绘画的艺术魅力，也为创作实践提供参考和指导。</p>`;
                } else {
                    // 文生图结果
                    const generatedImages = activeTab.querySelector('.generated-images');
                    generatedImages.style.display = 'flex';
                    generatedImages.innerHTML = `
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=中国山水画" alt="生成的图像1">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=青山绿水" alt="生成的图像2">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=亭台楼阁" alt="生成的图像3">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=飞鸟山水" alt="生成的图像4">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                    `;
                    
                    // 给生成的图片添加悬停效果和按钮功能
                    const imageActions = document.querySelectorAll('.image-actions button');
                    imageActions.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            showNotification('图片操作成功', 'success');
                        });
                    });
                }
                
                // 添加结果操作按钮事件
                const actionBtns = activeTab.querySelectorAll('.result-action-btn');
                actionBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (btn.classList.contains('regenerate')) {
                            showNotification('正在重新生成内容...', 'info');
                        } else if (btn.classList.contains('copy')) {
                            showNotification('内容已复制到剪贴板', 'success');
                        } else if (btn.classList.contains('download')) {
                            showNotification('图片已下载', 'success');
                        } else if (btn.classList.contains('insert')) {
                            showNotification('内容已插入到课件', 'success');
                            closeModal();
                        }
                    });
                });
                
            }, 2000);
        });
    }
}

/**
 * 处理标签切换，包括隐藏生成的题目列表
 */
function initTabSwitching() {
    // 标签按钮点击事件
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动标签
            tabBtns.forEach(tb => tb.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // 激活目标标签
            this.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
            
            // 隐藏生成的题目列表，除非是在 quiz 标签中
            const generatedQuestionsList = document.querySelector('.generated-questions-list');
            if (generatedQuestionsList) {
                if (targetTab === 'quiz') {
                    // 只有在生成过题目后才显示题目列表
                    const quizResult = document.querySelector('.quiz-result');
                    if (quizResult && window.getComputedStyle(quizResult).display !== 'none') {
                        generatedQuestionsList.style.display = 'block';
                    } else {
                        generatedQuestionsList.style.display = 'none';
                    }
                } else {
                    generatedQuestionsList.style.display = 'none';
                }
            }
        });
    });
}

/**
 * 初始化内容区域功能
 */
function initContentSections() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitles = document.querySelectorAll('.current-page-title');
    
    // 在页面加载时隐藏生成的题目列表
    const generatedQuestionsList = document.querySelector('.generated-questions-list');
    if (generatedQuestionsList) {
        generatedQuestionsList.style.display = 'none';
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 更新导航项目状态
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // 更新页面标题
            const sectionName = this.querySelector('.nav-text.zh').textContent;
            pageTitles.forEach(title => {
                if (title.classList.contains('zh')) {
                    title.textContent = sectionName;
                } else {
                    title.textContent = this.querySelector('.nav-text.en').textContent;
                }
            });
            
            // 更新内容部分
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('id') === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
            
            // 隐藏生成的题目列表（如果不在相关部分）
            if (generatedQuestionsList) {
                generatedQuestionsList.style.display = 'none';
            }
        });
    });
}

/**
 * 初始化课程思政功能
 */
function initIdeology() {
    // 思政案例生成按钮
    const ideologyGenerateBtn = document.querySelector('.ideology-generation .generate-btn');
    
    if (ideologyGenerateBtn) {
        ideologyGenerateBtn.addEventListener('click', function() {
            showNotification('正在生成思政案例...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                // 获取表单内容
                const themeInput = document.querySelector('.ideology-generation .prompt-input.zh');
                const caseType = document.querySelector('.ideology-generation .ideology-select:first-of-type');
                const caseLength = document.querySelector('.ideology-generation .ideology-select:last-of-type');
                
                // 生成案例内容（这里是示例内容）
                let generatedCase = '';
                if (themeInput && themeInput.value) {
                    const theme = themeInput.value;
                    const type = caseType ? caseType.options[caseType.selectedIndex].text : '故事型案例';
                    const length = caseLength ? caseLength.options[caseLength.selectedIndex].text : '中等';
                    
                    generatedCase = `【${type}】关于"${theme}"的思政案例\n\n`;
                    generatedCase += `这是一个${length}的思政案例示例，主题围绕"${theme}"展开。\n\n`;
                    generatedCase += `在中华优秀传统文化的传承与创新中，"${theme}"始终是一个重要的思想内核。`;
                    generatedCase += `本案例通过具体的历史事件和现代案例，深入阐述了"${theme}"在当代中国发展中的重要意义。`;
                    generatedCase += `学生通过学习本案例，可以更好地理解中华文化的精髓，增强文化自信。`;
                } else {
                    generatedCase = '请先输入思政案例主题...';
                }
                
                // 更新结果区域
                const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
                if (caseTextarea) {
                    caseTextarea.value = generatedCase;
                }
                
                // 显示结果区域
                const ideologyResult = document.querySelector('.ideology-result');
                if (ideologyResult) {
                    ideologyResult.style.display = 'block';
                }
                
                showNotification('思政案例生成成功！', 'success');
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.ideology-result .result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span.zh').textContent;
            const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
            
            switch (action) {
                case '编辑':
                    if (caseTextarea) {
                        caseTextarea.readOnly = false;
                        caseTextarea.focus();
                        showNotification('您可以编辑思政案例内容', 'info');
                    }
                    break;
                    
                case '复制':
                    if (caseTextarea) {
                        caseTextarea.select();
                        document.execCommand('copy');
                        showNotification('案例内容已复制到剪贴板', 'success');
                    }
                    break;
                    
                case '重新生成':
                    showNotification('正在重新生成案例...', 'info');
                    document.querySelector('.ideology-generation .generate-btn').click();
                    break;
            }
        });
    });
}

// 新建思政案例功能
document.addEventListener('DOMContentLoaded', function() {
    const createCaseBtn = document.getElementById('createCaseBtn');
    const createCaseModal = document.getElementById('createCaseModal');
    const closeBtn = createCaseModal.querySelector('.close-btn');
    const cancelBtn = createCaseModal.querySelector('.btn-cancel');
    const saveBtn = document.getElementById('saveNewCaseBtn');
    
    // 打开模态框
    createCaseBtn.addEventListener('click', function() {
        createCaseModal.classList.add('active');
    });
    
    // 关闭模态框
    function closeModal() {
        createCaseModal.classList.remove('active');
        // 清空表单
        document.getElementById('caseTitleInput').value = '';
        document.getElementById('caseContentInput').value = '';
        // 重置复选框
        const checkboxes = document.querySelectorAll('input[name="resourceType"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 保存新案例
    saveBtn.addEventListener('click', function() {
        const title = document.getElementById('caseTitleInput').value.trim();
        const content = document.getElementById('caseContentInput').value.trim();
        const selectedResources = [];
        
        document.querySelectorAll('input[name="resourceType"]:checked').forEach(checkbox => {
            selectedResources.push(checkbox.value);
        });
        
        if (title === '') {
            alert('请输入案例标题');
            return;
        }
        
        if (content === '') {
            alert('请输入案例内容');
            return;
        }
        
        // 这里可以添加保存逻辑，如API调用或本地存储
        
        // 模拟添加到列表
        addNewCaseToList(title, selectedResources);
        
        // 关闭模态框
        closeModal();
    });
    
    // 添加新案例到列表
    function addNewCaseToList(title, resources) {
        const casesTable = document.querySelector('.cases-table tbody');
        const rowCount = casesTable.querySelectorAll('tr').length + 1;
        
        const newRow = document.createElement('tr');
        
        // 创建序号单元格
        const numCell = document.createElement('td');
        numCell.textContent = rowCount;
        
        // 创建标题单元格
        const titleCell = document.createElement('td');
        const zhTitle = document.createElement('p');
        zhTitle.className = 'zh';
        zhTitle.textContent = title;
        const enTitle = document.createElement('p');
        enTitle.className = 'en';
        enTitle.textContent = title; // 在实际应用中可能需要翻译
        titleCell.appendChild(zhTitle);
        titleCell.appendChild(enTitle);
        
        // 创建资源标签单元格
        const resourceCell = document.createElement('td');
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'resource-tags';
        
        resources.forEach(resource => {
            const tagSpan = document.createElement('span');
            tagSpan.className = `resource-tag ${resource}`;
            const icon = document.createElement('i');
            
            if (resource === 'image') {
                icon.className = 'fas fa-image';
            } else if (resource === 'video') {
                icon.className = 'fas fa-video';
            } else if (resource === 'link') {
                icon.className = 'fas fa-link';
            }
            
            tagSpan.appendChild(icon);
            tagsDiv.appendChild(tagSpan);
        });
        
        resourceCell.appendChild(tagsDiv);
        
        // 创建操作按钮单元格
        const actionCell = document.createElement('td');
        
        const viewBtn = document.createElement('button');
        viewBtn.className = 'case-action-btn view';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'case-action-btn edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'case-action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        actionCell.appendChild(viewBtn);
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        
        // 将所有单元格添加到行
        newRow.appendChild(numCell);
        newRow.appendChild(titleCell);
        newRow.appendChild(resourceCell);
        newRow.appendChild(actionCell);
        
        // 将行添加到表格
        casesTable.appendChild(newRow);
    }
}); 

// 全屏功能
function initFullscreenButton() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            editorContent.classList.toggle('fullscreen');
            
            // 切换全屏按钮图标
            const icon = fullscreenBtn.querySelector('i');
            if (editorContent.classList.contains('fullscreen')) {
                icon.classList.remove('fa-expand');
                icon.classList.add('fa-compress');
            } else {
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
        
        // ESC键退出全屏
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && editorContent.classList.contains('fullscreen')) {
                editorContent.classList.remove('fullscreen');
                const icon = fullscreenBtn.querySelector('i');
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
    }
}

// 在页面加载完成后初始化全屏按钮
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initFullscreenButton();
}); 

// 二维码弹窗功能
function initQrcodeModal() {
    // 更新选择器，确保准确找到签到二维码按钮
    const qrcodeBtn = document.querySelector('.panel-btn:not(.group-action-btn)');
    const qrcodeModal = document.getElementById('qrcodeModal');
    
    // 如果找不到相关元素，直接返回
    if (!qrcodeBtn || !qrcodeModal) {
        console.warn('签到二维码相关元素未找到');
        return;
    }
    
    const closeBtn = qrcodeModal.querySelector('.close-btn');
    const refreshBtn = qrcodeModal.querySelector('.refresh-btn');
    const downloadBtn = qrcodeModal.querySelector('.download-btn');
    
    // 确保二维码弹窗默认隐藏
    qrcodeModal.style.display = 'none';
    qrcodeModal.classList.remove('show');
    
    // 显示二维码弹窗
    qrcodeBtn.addEventListener('click', function() {
        qrcodeModal.style.display = 'flex';
        setTimeout(() => {
            qrcodeModal.classList.add('show');
        }, 10);
        generateQRCode();
        showNotification('二维码已生成，有效期5分钟', 'success');
    });
    
    // 关闭二维码弹窗
    closeBtn.addEventListener('click', function() {
        qrcodeModal.classList.remove('show');
        setTimeout(() => {
            qrcodeModal.style.display = 'none';
        }, 300);
    });
    
    // 点击弹窗外部关闭
    qrcodeModal.addEventListener('click', function(e) {
        if (e.target === qrcodeModal) {
            qrcodeModal.classList.remove('show');
            setTimeout(() => {
                qrcodeModal.style.display = 'none';
            }, 300);
        }
    });
    
    // 刷新二维码
    refreshBtn.addEventListener('click', function() {
        generateQRCode();
        showNotification('二维码已刷新，有效期重置为5分钟', 'info');
    });
    
    // 下载二维码
    downloadBtn.addEventListener('click', function() {
        // 获取二维码图片
        const qrImg = document.getElementById('checkinQRCode');
        
        // 创建一个临时链接
        const a = document.createElement('a');
        a.href = qrImg.src;
        a.download = '签到二维码.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('二维码已下载', 'success');
    });
}

// 模拟生成二维码的功能
function generateQRCode() {
    // 实际应用中，这里应该调用后端API生成真实的二维码
    // 此处仅做演示，随机更新二维码图片
    const qrImg = document.getElementById('checkinQRCode');
    const randomId = Math.floor(Math.random() * 1000);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=checkin_session_${randomId}`;
}

// 在文档加载完成后初始化二维码功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化其他功能...
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
}); 

// 初始化替换课件模态框
function initReplaceCoursewareModal() {
    // 此功能已移除
}

// 一键生成幻灯片功能
function initOneClickGeneration() {
    const oneClickGenBtn = document.querySelector('.js-one-click-generate');
    const oneClickModal = document.getElementById('oneClickGenerateModal');
    
    if (!oneClickGenBtn || !oneClickModal) return;
    
    const closeBtn = oneClickModal.querySelector('.modal-close');
    const generateBtn = oneClickModal.querySelector('.js-generate-slides');
    const cancelBtn = oneClickModal.querySelector('.js-cancel');
    const topicInput = oneClickModal.querySelector('#slideTopic');
    const slideCountSelect = oneClickModal.querySelector('#slideCount');
    const styleSelect = oneClickModal.querySelector('#slideStyle');
    const resultArea = oneClickModal.querySelector('.generation-result');
    const loadingIndicator = oneClickModal.querySelector('.loading-indicator');
    
    // 打开模态框
    oneClickGenBtn.addEventListener('click', () => {
        oneClickModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭模态框的函数
    function closeModal() {
        oneClickModal.classList.remove('show');
        document.body.style.overflow = '';
        // 重置表单
        resultArea.innerHTML = '';
        resultArea.style.display = 'none';
        loadingIndicator.style.display = 'none';
    }
    
    // 关闭模态框的事件
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 生成幻灯片
    generateBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        const slideCount = slideCountSelect.value;
        const style = styleSelect.value;
        
        if (!topic) {
            alert('请输入课件主题');
            return;
        }
        
        // 显示加载指示器
        loadingIndicator.style.display = 'flex';
        resultArea.style.display = 'none';
        
        // 模拟生成过程
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            resultArea.style.display = 'block';
            
            // 生成幻灯片预览
            displayGeneratedSlides(topic, slideCount, style);
        }, 3000);
    });
    
    // 显示生成的幻灯片预览
    function displayGeneratedSlides(topic, count, style) {
        const slides = generateSlideStructure(topic, count, style);
        
        let slidesPreviewHTML = `
            <div class="generation-header">
                <h3>已生成 ${count} 张幻灯片</h3>
                <div class="result-actions">
                    <button class="action-btn js-regenerate"><i class="fa fa-refresh"></i> 重新生成</button>
                    <button class="action-btn primary js-import-slides"><i class="fa fa-download"></i> 导入课件</button>
                </div>
            </div>
            <div class="slides-preview">
        `;
        
        slides.forEach((slide, index) => {
            slidesPreviewHTML += `
                <div class="slide-preview-item">
                    <div class="slide-number">${index + 1}</div>
                    <div class="slide-content" style="background-color: ${style === 'modern' ? '#f5f5f5' : style === 'traditional' ? '#f8f4e8' : '#fff'}">
                        <h4>${slide.title}</h4>
                        <div class="slide-body">
                            ${slide.content}
                        </div>
                    </div>
                </div>
            `;
        });
        
        slidesPreviewHTML += `</div>`;
        resultArea.innerHTML = slidesPreviewHTML;
        
        // 添加事件监听器
        const regenerateBtn = resultArea.querySelector('.js-regenerate');
        const importBtn = resultArea.querySelector('.js-import-slides');
        
        regenerateBtn.addEventListener('click', () => {
            loadingIndicator.style.display = 'flex';
            resultArea.style.display = 'none';
            
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                resultArea.style.display = 'block';
                displayGeneratedSlides(topic, count, style);
            }, 2000);
        });
        
        importBtn.addEventListener('click', () => {
            // 导入幻灯片到编辑器
            importGeneratedSlides(slides, styleType);
            closeModal();
        });
    }
    
    // 生成幻灯片结构
    function generateSlideStructure(topic, count, style) {
        const slides = [];
        
        // 添加封面
        slides.push({
            title: topic,
            content: `<div class="cover-slide"><p class="presenter">讲师: 李明</p><p class="date">2023年10月</p></div>`
        });
        
        // 添加目录
        if (count >= 5) {
            slides.push({
                title: "目录",
                content: `<ul class="toc">
                    <li>引言</li>
                    <li>主要内容</li>
                    <li>实例分析</li>
                    <li>总结与展望</li>
                </ul>`
            });
        }
        
        // 根据不同主题生成不同内容
        const topics = {
            "中国传统文化": [
                { title: "中国传统文化概述", content: `<p>中国传统文化源远流长，包含哲学、宗教、文学、艺术、建筑等多个方面。</p><ul><li>儒家思想</li><li>道家思想</li><li>佛教文化</li></ul>` },
                { title: "传统艺术", content: `<div class="two-column"><div><p>中国传统艺术形式多样：</p><ul><li>书法</li><li>绘画</li><li>戏曲</li></ul></div><div class="image-placeholder"></div></div>` },
                { title: "传统节日", content: `<table class="simple-table"><tr><th>节日</th><th>时间</th><th>习俗</th></tr><tr><td>春节</td><td>农历正月初一</td><td>贴春联、放鞭炮</td></tr><tr><td>端午节</td><td>农历五月初五</td><td>赛龙舟、吃粽子</td></tr></table>` },
                { title: "传统美德", content: `<p>中华民族传统美德:</p><div class="center-content"><div class="virtue">仁爱</div><div class="virtue">诚信</div><div class="virtue">礼义</div><div class="virtue">孝道</div></div>` }
            ],
            "人工智能基础": [
                { title: "什么是人工智能", content: `<p>人工智能(AI)是计算机科学的一个分支，致力于创造能够模拟人类智能的系统。</p><div class="image-placeholder"></div>` },
                { title: "机器学习基础", content: `<div class="two-column"><div><p>机器学习类型：</p><ul><li>监督学习</li><li>无监督学习</li><li>强化学习</li></ul></div><div class="image-placeholder"></div></div>` },
                { title: "神经网络结构", content: `<div class="center-content"><div class="image-placeholder"></div><p>神经网络由输入层、隐藏层和输出层组成</p></div>` },
                { title: "AI应用场景", content: `<table class="simple-table"><tr><th>领域</th><th>应用</th></tr><tr><td>医疗</td><td>疾病诊断、药物研发</td></tr><tr><td>金融</td><td>风险评估、算法交易</td></tr><tr><td>教育</td><td>个性化学习、智能评估</td></tr></table>` }
            ]
        };
        
        // 获取最接近的主题
        let bestMatch = "中国传统文化";
        if (topic.includes("智能") || topic.includes("AI") || topic.includes("机器学习")) {
            bestMatch = "人工智能基础";
        }
        
        // 添加主题相关幻灯片
        const relevantSlides = topics[bestMatch];
        const slidesToAdd = Math.min(relevantSlides.length, count - slides.length - 1); // 减去封面和结尾
        
        for (let i = 0; i < slidesToAdd; i++) {
            slides.push(relevantSlides[i]);
        }
        
        // 如果还需要更多幻灯片，添加占位符
        while (slides.length < count - 1) {
            slides.push({
                title: `${topic} - 补充内容 ${slides.length - 1}`,
                content: `<div class="placeholder-content"><p>这里是关于${topic}的补充内容</p><div class="image-placeholder"></div></div>`
            });
        }
        
        // 添加结尾幻灯片
        slides.push({
            title: "谢谢观看",
            content: `<div class="thank-you-slide"><p>感谢您的关注！</p><p>有任何问题请随时提问</p></div>`
        });
        
        return slides;
    }
    
    // 导入生成的幻灯片到编辑器
    function importGeneratedSlides(slides, styleType) {
        const thumbnailContainer = document.querySelector('.slide-thumbnails');
        const editorArea = document.querySelector('.slide-editor');
        
        if (!thumbnailContainer || !editorArea) return;
        
        // 清空现有幻灯片
        thumbnailContainer.innerHTML = '';
        
        // 添加新幻灯片
        slides.forEach((slide, index) => {
            // 创建缩略图
            const thumbnail = document.createElement('div');
            thumbnail.className = 'slide-thumbnail';
            thumbnail.setAttribute('data-slide-id', index);
            if (index === 0) thumbnail.classList.add('active');
            
            thumbnail.innerHTML = `
                <div class="thumbnail-number">${index + 1}</div>
                <div class="thumbnail-preview" style="background-color: ${styleType === 'modern' ? '#f5f5f5' : styleType === 'traditional' ? '#f8f4e8' : '#fff'}">
                    <div class="thumbnail-title">${slide.title}</div>
                </div>
            `;
            
            thumbnailContainer.appendChild(thumbnail);
            
            // 添加点击事件
            thumbnail.addEventListener('click', function() {
                document.querySelectorAll('.slide-thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                updateEditorContent(slide, index, styleType);
            });
        });
        
        // 更新编辑区域为第一张幻灯片
        updateEditorContent(slides[0], 0, styleType);
        
        // 显示成功消息
        showNotification('幻灯片已成功导入');
    }
    
    // 更新编辑区域内容
    function updateEditorContent(slide, index, styleType) {
        const editorArea = document.querySelector('.slide-editor');
        if (!editorArea) return;
        
        const slideContent = document.createElement('div');
        slideContent.className = 'slide-content-editor';
        slideContent.style.backgroundColor = styleType === 'modern' ? '#f5f5f5' : styleType === 'traditional' ? '#f8f4e8' : '#fff';
        
        slideContent.innerHTML = `
            <h2 class="slide-title-editor" contenteditable="true">${slide.title}</h2>
            <div class="slide-body-editor" contenteditable="true">
                ${slide.content}
            </div>
        `;
        
        editorArea.innerHTML = '';
        editorArea.appendChild(slideContent);
    }
    
    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        }, 100);
    }
}

/**
 * 初始化课堂小测题目导航功能
 */
function initQuizNavigation() {
    // 模拟的题目数据，实际应从服务端获取
    const quizQuestions = [
        {
            number: 1,
            type: '单选题',
            typeEn: 'Single Choice',
            text: '下列哪个元素不属于中国园林的基本要素？',
            options: [
                { label: 'A', text: '假山' },
                { label: 'B', text: '水体' },
                { label: 'C', text: '植物' },
                { label: 'D', text: '喷泉' }
            ],
            answer: 'D',
            explanation: '喷泉是西方园林常见的景观元素，中国传统园林则讲究自然山水的模拟与再现，主要以假山、水体、植物和建筑为基本要素，形成"虽由人作，宛自天开"的艺术效果。'
        },
        {
            number: 2,
            type: '多选题',
            typeEn: 'Multiple Choice',
            text: '中国古典园林的设计理念包括以下哪些？',
            options: [
                { label: 'A', text: '虽由人作，宛自天开' },
                { label: 'B', text: '藏露结合' },
                { label: 'C', text: '几何对称布局' },
                { label: 'D', text: '移步换景' }
            ],
            answer: 'ABD',
            explanation: '中国古典园林讲究自然山水的模拟与再现，主要设计理念包括"虽由人作，宛自天开"、"藏露结合"、"移步换景"等，而几何对称布局则是西式园林的特点。'
        },
        {
            number: 3,
            type: '单选题',
            typeEn: 'Single Choice',
            text: '下列哪个园林不位于苏州？',
            options: [
                { label: 'A', text: '拙政园' },
                { label: 'B', text: '留园' },
                { label: 'C', text: '圆明园' },
                { label: 'D', text: '网师园' }
            ],
            answer: 'C',
            explanation: '圆明园位于北京，是清代著名的皇家园林。而拙政园、留园和网师园都位于苏州，是著名的江南私家园林代表作。'
        },
        {
            number: 4,
            type: '简答题',
            typeEn: 'Short Answer',
            text: '简述中国园林与西方园林的主要区别。',
            answer: '中西方园林的主要区别体现在：\n1. 布局方式：中国园林强调自然曲线和不规则布局，西方园林多采用几何对称布局\n2. 设计理念：中国园林讲究"虽由人作，宛自天开"，西方园林则展示人对自然的控制与改造\n3. 游览方式：中国园林采用"移步换景"的游览方式，西方园林则强调整体观赏\n4. 景观元素：中国园林多用山水、植物等自然元素，西方园林则常用喷泉、雕塑等人工景观',
            explanation: '中西方园林的区别反映了不同文化背景下人与自然关系的处理方式。中国园林受道家"天人合一"思想影响，强调与自然和谐共处；西方园林则更多体现人对自然的驾驭和改造。'
        },
        {
            number: 5,
            type: '讨论题',
            typeEn: 'Discussion',
            text: '中国古典园林的"借景"手法在现代景观设计中有何应用价值？',
            answer: '无标准答案',
            explanation: '借景是中国古典园林的重要手法，通过"框景"、"漏景"等方式将远景纳入园林视野，扩展空间感，增加景观层次。在现代景观设计中，借景理念有助于突破场地局限，增强空间的开放性和连续性，创造更具深度和趣味性的景观体验。此外，借景手法的应用也有助于促进城市空间的整体协调和资源共享。'
        }
    ];
    
    let currentQuestionIndex = 0;
    
    // 获取相关DOM元素
    const prevBtn = document.querySelector('.prev-question-btn');
    const nextBtn = document.querySelector('.next-question-btn');
    const currentQuestionSpan = document.querySelector('.current-question');
    const totalQuestionsSpan = document.querySelector('.total-questions');
    const dotContainer = document.querySelector('.quiz-nav-dots');
    const dots = document.querySelectorAll('.quiz-dot');
    
    if (!prevBtn || !nextBtn || !currentQuestionSpan || !totalQuestionsSpan || !dotContainer) return;
    
    // 初始化题目总数
    totalQuestionsSpan.textContent = quizQuestions.length;
    
    // 上一题按钮点击事件
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestionDisplay();
        }
    });
    
    // 下一题按钮点击事件
    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            updateQuestionDisplay();
        }
    });
    
    // 点击导航点切换题目
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentQuestionIndex = index;
            updateQuestionDisplay();
        });
    });
    
    // 更新题目显示
    function updateQuestionDisplay() {
        // 更新当前题目计数
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        
        // 更新导航点状态
        dots.forEach((dot, index) => {
            if (index === currentQuestionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 更新按钮状态
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === quizQuestions.length - 1;
        
        // 获取当前题目数据
        const currentQuestion = quizQuestions[currentQuestionIndex];
        
        // 更新题目内容
        const questionItem = document.querySelector('.question-item');
        if (questionItem) {
            // 更新题号和类型
            const questionNumber = questionItem.querySelector('.question-number');
            const questionTypeZh = questionItem.querySelector('.question-type.zh');
            const questionTypeEn = questionItem.querySelector('.question-type.en');
            
            if (questionNumber) questionNumber.textContent = `Q${currentQuestion.number}`;
            if (questionTypeZh) questionTypeZh.textContent = currentQuestion.type;
            if (questionTypeEn) questionTypeEn.textContent = currentQuestion.typeEn;
            
            // 更新题目文本
            const questionText = questionItem.querySelector('.question-text');
            if (questionText) questionText.textContent = currentQuestion.text;
            
            // 更新选项（如果有）
            const optionsContainer = questionItem.querySelector('.question-options');
/**
 * 中国文化人工智能课程平台 - 教师端
 * 主脚本文件
 */

// 在文件顶部，DOMContentLoaded事件监听器之前添加标记变量
// 全局变量，用于跟踪按钮是否已经绑定事件
let contentGenBtnInitialized = false;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航系统
    initNavigation();
    
    // 初始化语言切换
    initLanguageToggle();
    
    // 初始化章节模态框
    initChapterModal();
    
    // 初始化章节卡片交互
    initChapterCards();
    
    // 更新当前日期显示
    updateCurrentDate();
    
    // 初始化内容生成弹窗
    initContentGenerateModal();
    
    // 初始化AI助教-课前部分
    initAIPre();
    
    // 初始化AI助教-课中部分
    initAIInClass();
    
    // 初始化章节滑动功能
    initChapterSlider();
    
    // 初始化课程思政和实训任务部分
    initIdeologyAndPractice();
    
    // 初始化最新动态过滤功能
    initActivityFilters();
    
    // 初始化学情画像部分
    initStudentProfile();
    
    // 初始化中国文化演化部分
    initCultureEvolution();
    
    // 初始化一键生成功能
    initOneClickGeneration();
    
    // 初始化各个模块
    initContentSections();
    initTabSwitching();
    initQuizGenerator();
    initKnowledgeExpansion(); // 添加知识拓展初始化
    // ... 其他初始化函数
    
    // 在页面加载时隐藏知识拓展列表
    const knowledgeExpansionList = document.querySelector('.knowledge-expansion-list');
    if (knowledgeExpansionList) {
        knowledgeExpansionList.style.display = 'none';
    }
    
    // 设置默认激活的标签
    const defaultTabBtn = document.querySelector('.tab-btn[data-tab="courseware"]');
    if (defaultTabBtn) {
        defaultTabBtn.click();
    }
    
    initIdeology(); // 初始化思政功能
    
    // 全屏功能
    initFullscreenButton();
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
    
    // 初始化课程思政多媒体标签页和案例/讨论题切换功能
    initIdeologyMediaTabs();
    
    initMediaTabs();
    initCaseNavigation();
    initDiscussionNavigation();
    initClassSelection(); // 初始化班级选择功能
    
    // 初始化课后总结部分
    initPostClass();
    
    // 知识图谱功能
    initKnowledgeGraph();
    
    // 获取章节列表数据
    fetchChapters();
    
    // 直接调用更新课程统计数据
    updateCourseStatsCount();
    
    // 新建章节按钮点击事件
    document.getElementById('newChapterBtn').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.add('active');
    });
    
    // 关闭模态框按钮点击事件
    document.getElementById('closeNewChapterModal').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 取消按钮点击事件
    document.getElementById('cancelNewChapter').addEventListener('click', () => {
        document.getElementById('newChapterModal').classList.remove('active');
    });
    
    // 提交表单事件
    document.getElementById('submitNewChapter').addEventListener('click', () => {
        submitNewChapter();
    });
    
    // 文件上传预览
    document.getElementById('coverImage').addEventListener('change', (e) => {
        const fileInput = e.target;
        const filePreview = fileInput.parentElement.querySelector('.file-preview');
        
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            reader.readAsDataURL(fileInput.files[0]);
            
            // 这里应该上传文件到服务器，然后获取文件路径
            // 简化处理：假设上传成功并返回路径
            document.getElementById('coverImagePath').value = `../picture/uploads/${fileInput.files[0].name}`;
        }
    });
    
    // 初始化PPTist iframe集成
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
            document.getElementById(sectionId).classList.add('active');
            
            // 更新页面标题
            const navTextZh = this.querySelector('.nav-text.zh').textContent;
            const navTextEn = this.querySelector('.nav-text.en').textContent;
            pageTitleZh.textContent = navTextZh;
            pageTitleEn.textContent = navTextEn;
            
            // 添加动态效果
            animateContentChange(document.getElementById(sectionId));
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
 * 处理打开和关闭模态框的交互
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
    
    // 确认按钮
    confirmBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 模拟创建章节
            const titleInputZh = modal.querySelector('.form-input.zh');
            const titleInputEn = modal.querySelector('.form-input.en');
            
            if (titleInputZh.value.trim() !== '' || titleInputEn.value.trim() !== '') {
                showNotification('章节创建成功！', 'success');
                closeModal();
                
                // 这里可以添加实际创建章节的代码
            } else {
                showNotification('请填写章节标题', 'warning');
            }
        });
    });
    
    // 文件上传预览
    const fileInputs = modal.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileCount = this.files.length;
            const filePreview = this.closest('.form-group').querySelector('.uploaded-files');
            
            if (filePreview) {
                const textZh = filePreview.querySelector('.zh');
                const textEn = filePreview.querySelector('.en');
                
                if (textZh) textZh.textContent = `已上传: ${fileCount} 个文件`;
                if (textEn) textEn.textContent = `Uploaded: ${fileCount} files`;
            }
        });
    });
}

/**
 * 初始化章节卡片交互
 * 添加章节卡片上的按钮点击事件
 */
function initChapterCards() {
    const editBtns = document.querySelectorAll('.chapter-action-btn.edit');
    const prepareBtns = document.querySelectorAll('.chapter-action-btn.prepare');
    const teachBtns = document.querySelectorAll('.chapter-action-btn.teach');
    
    // 编辑按钮
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            showNotification(`正在编辑${chapterTitle}...`, 'info');
            // 这里可以添加实际的编辑功能
        });
    });
    
    // 备课按钮
    prepareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取章节信息
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            const chapterTitleEn = chapterCard.querySelector('.chapter-title.en').textContent;
            
            // 提取章节序号（从标题中获取第X章）
            const chapterMatch = chapterTitle.match(/第(\d+)章/);
            if (chapterMatch && chapterMatch[1]) {
                const chapterNumber = chapterMatch[1];
                
                // 切换到AI助教-课前界面
                const aiPreNavItem = document.querySelector('.nav-item[data-section="ai-pre"]');
                if (aiPreNavItem) {
                    // 触发点击事件，切换到AI助教-课前界面
                    aiPreNavItem.click();
                    
                    // 延迟一下，等待界面切换完成后设置章节选择器的值
                    setTimeout(() => {
                        // 设置章节选择器
                        const chapterSelect = document.getElementById('chapter-select');
                        if (chapterSelect) {
                            // 查找对应章节的选项
                            const options = chapterSelect.options;
                            for (let i = 0; i < options.length; i++) {
                                if (options[i].value === chapterNumber) {
                                    chapterSelect.selectedIndex = i;
                                    // 手动触发变更事件
                                    const event = new Event('change');
                                    chapterSelect.dispatchEvent(event);
                                    break;
                                }
                            }
                        }
                        
                        showNotification(`正在准备${chapterTitle}的课前内容...`, 'success');
                    }, 300);
                }
            } else {
                showNotification(`无法确定章节编号，请手动选择章节`, 'warning');
            }
        });
    });
    
    // 上课按钮
    teachBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            
            // 切换到"AI助教-课中"界面
            const aiInNavItem = document.querySelector('.nav-item[data-section="ai-in"]');
            if (aiInNavItem) {
                aiInNavItem.click();
                
                showNotification(`开始${chapterTitle}的课堂教学`, 'success');
            }
        });
    });
    
    // 整个卡片点击事件
    const chapterCards = document.querySelectorAll('.chapter-card');
    chapterCards.forEach(card => {
        card.addEventListener('click', function() {
            const chapterTitle = this.querySelector('.chapter-title.zh').textContent;
            showNotification(`查看章节详情: ${chapterTitle}`, 'info');
            
            // 这里可以添加显示章节详情的代码
        });
    });
}

/**
 * 为内容区域添加切换动画
 * @param {HTMLElement} section - 要添加动画的内容区域
 */
function animateContentChange(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    }, 50);
}

/**
 * 创建通知提示
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (success, warning, error, info)
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 添加图标
    const icon = document.createElement('i');
    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            icon.className = 'fas fa-times-circle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    // 添加消息文本
    const text = document.createElement('span');
    text.textContent = message;
    
    // 添加关闭按钮
    const closeBtn = document.createElement('i');
    closeBtn.className = 'fas fa-times close-notification';
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 组装通知元素
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加进入动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动消失
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * 当前日期显示
 * 更新首页欢迎横幅中的日期显示
 */
function updateCurrentDate() {
    const dateElementZh = document.getElementById('current-date-zh');
    const dateElementEn = document.getElementById('current-date-en');
    
    if (dateElementZh && dateElementEn) {
        const now = new Date();
        
        // 中文日期格式
        const zhOptions = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
        let zhDate = now.toLocaleDateString('zh-CN', zhOptions);
        // 进一步格式化中文日期，确保格式为：2023年3月23日 星期四
        zhDate = zhDate.replace(/\//g, '年') + '日';
        zhDate = zhDate.replace(/年(\d+)年/, '年$1月');
        zhDate = zhDate.replace(/星期(.+)日/, '星期$1'); // 去掉星期后面的"日"字
        dateElementZh.textContent = `今天是 ${zhDate}`; // 删除平台口号
        
        // 英文日期格式
        const enOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElementEn.textContent = `Today is ${now.toLocaleDateString('en-US', enOptions)}`;
    }
}

/**
 * 初始化AI助教-课前部分
 */
function initAIPre() {
    // 初始化标签页切换
    initAIPreTabs();
    
    // 初始化课件设计
    initCoursewareDesign();
    
    // 初始化小测题目导航
    initQuizNavigation();
    
    // 初始化可缩放思维导图
    initZoomableMindmap();
    
    // 初始化章节选择器
    initChapterSelector();
}

/**
 * 初始化AI助教-课前选项卡切换
 */
function initAIPreTabs() {
    const tabBtns = document.querySelectorAll('.ai-pre-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.ai-pre-tabs .tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有选项卡的活动状态
            tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
            
            // 为当前点击的选项卡添加活动状态
            this.classList.add('active');
            
            // 获取要显示的内容区域的ID
            const contentId = this.getAttribute('data-tab') + '-content';
            
            // 隐藏所有内容区域
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 显示对应的内容区域
            document.getElementById(contentId).classList.add('active');
            
            // 添加动态效果
            animateTabContentChange(document.getElementById(contentId));
        });
    });
}

/**
 * 初始化课件设计功能
 */
function initCoursewareDesign() {
    const coursewareContent = document.getElementById('courseware-content');
    if (!coursewareContent) return;

    const actionButtons = coursewareContent.querySelectorAll('.action-button');
    const genBtn = actionButtons[0]; // 内容生成按钮是第一个按钮
    const replaceBtn = actionButtons[1]; // 替换课件按钮是第二个按钮
    
    // 内容生成按钮初始化
    if (genBtn && !contentGenBtnInitialized) {
        // 先移除可能已经存在的所有点击事件处理器
        const newGenBtn = genBtn.cloneNode(true);
        genBtn.parentNode.replaceChild(newGenBtn, genBtn);
        
        // 为新的按钮添加单一事件监听器
        newGenBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            // 显示内容生成模态框
            const modal = document.getElementById('contentGenerateModal');
            if (modal) {
                modal.classList.add('active');
            }
        });
        
        contentGenBtnInitialized = true;
        console.log("内容生成按钮已初始化");
    }
    
    // 替换课件按钮初始化
    if (replaceBtn) {
        // 先移除可能已经存在的所有点击事件处理器
        const newReplaceBtn = replaceBtn.cloneNode(true);
        replaceBtn.parentNode.replaceChild(newReplaceBtn, replaceBtn);
        
        // 为新的按钮添加单一事件监听器
        newReplaceBtn.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
            
            // 显示替换课件弹窗
            showReplaceCoursewareModal();
        });
        
        console.log("替换课件按钮已初始化");
    }
    
    // 幻灯片缩略图交互
    const thumbnails = coursewareContent.querySelectorAll('.thumbnail-item');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 显示替换课件模态框
    function showReplaceCoursewareModal() {
        // 创建模态框
        let modal = document.getElementById('replaceCoursewareModal');
        
        // 如果模态框不存在，创建一个新的
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'replaceCoursewareModal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="zh">替换课件</h3>
                        <h3 class="en">Replace Courseware</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="file-upload-section">
                            <div class="upload-instructions">
                                <p class="zh">请选择要上传的课件文件，支持PPT、PPTX或PDF格式</p>
                                <p class="en">Please select courseware file to upload, supports PPT, PPTX or PDF formats</p>
                            </div>
                            <div class="file-upload-large">
                                <div class="file-preview-large">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p class="zh">拖放文件到此处或点击上传</p>
                                    <p class="en">Drag and drop files here or click to upload</p>
                                    <p class="file-types zh">支持的格式: PPT, PPTX, PDF</p>
                                    <p class="file-types en">Supported formats: PPT, PPTX, PDF</p>
                                </div>
                                <input type="file" class="file-input" accept=".ppt,.pptx,.pdf">
                            </div>
                            <div class="uploaded-files">
                                <h4 class="zh">已选择文件</h4>
                                <h4 class="en">Selected Files</h4>
                                <div class="no-file-selected">
                                    <p class="zh">未选择任何文件</p>
                                    <p class="en">No file selected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel">
                            <span class="zh">取消</span>
                            <span class="en">Cancel</span>
                        </button>
                        <button class="btn-confirm">
                            <span class="zh">替换</span>
                            <span class="en">Replace</span>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 关闭按钮
            const closeBtn = modal.querySelector('.close-btn');
            const cancelBtn = modal.querySelector('.btn-cancel');
            
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            cancelBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            // 文件上传功能
            const fileInput = modal.querySelector('.file-input');
            const uploadArea = modal.querySelector('.file-preview-large');
            const noFileSelected = modal.querySelector('.no-file-selected');
            const uploadedFiles = modal.querySelector('.uploaded-files');
            
            // 文件上传区域点击触发文件选择
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            // 监听文件选择变化
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    
                    // 处理已选择的文件
                    noFileSelected.style.display = 'none';
                    
                    // 移除旧的文件详情
                    const oldFileDetails = uploadedFiles.querySelector('.file-details');
                    if (oldFileDetails) {
                        oldFileDetails.remove();
                    }
                    
                    // 创建文件详情显示
                    const fileDetails = document.createElement('div');
                    fileDetails.className = 'file-details';
                    
                    // 根据文件类型显示不同的图标
                    let fileIcon = 'fa-file';
                    if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
                        fileIcon = 'fa-file-powerpoint';
                    } else if (file.name.endsWith('.pdf')) {
                        fileIcon = 'fa-file-pdf';
                    }
                    
                    // 计算文件大小显示
                    let fileSize = (file.size / 1024).toFixed(2) + ' KB';
                    if (file.size > 1024 * 1024) {
                        fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                    }
                    
                    fileDetails.innerHTML = `
                        <div class="file-icon"><i class="fas ${fileIcon}"></i></div>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${fileSize}</div>
                        </div>
                        <button class="remove-file-btn"><i class="fas fa-times"></i></button>
                    `;
                    
                    uploadedFiles.appendChild(fileDetails);
                    
                    // 添加删除文件的按钮事件
                    const removeBtn = fileDetails.querySelector('.remove-file-btn');
                    removeBtn.addEventListener('click', () => {
                        fileInput.value = '';
                        fileDetails.remove();
                        noFileSelected.style.display = 'block';
                    });
                }
            });
            
            // 拖放功能
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    fileInput.files = e.dataTransfer.files;
                    
                    // 触发change事件以更新UI
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            });
            
            // 替换按钮点击事件
            const confirmBtn = modal.querySelector('.btn-confirm');
            confirmBtn.addEventListener('click', () => {
                if (fileInput.files.length > 0) {
                    showNotification('课件替换成功', 'success');
                    modal.classList.remove('active');
                } else {
                    showNotification('请选择一个文件', 'warning');
                }
            });
        }
        
        // 显示模态框
        modal.classList.add('active');
    }
    
    // 全屏按钮功能
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                // 进入全屏 - 整个编辑器区域
                if (editorContent.requestFullscreen) {
                    editorContent.requestFullscreen();
                } else if (editorContent.mozRequestFullScreen) { // Firefox
                    editorContent.mozRequestFullScreen();
                } else if (editorContent.webkitRequestFullscreen) { // Chrome, Safari, Opera
                    editorContent.webkitRequestFullscreen();
                } else if (editorContent.msRequestFullscreen) { // IE/Edge
                    editorContent.msRequestFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenBtn.title = "退出全屏";
            } else {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
                
                // 切换图标
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        });
        
        // 监听全屏变化事件
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement && 
                !document.msFullscreenElement) {
                // 退出全屏
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = "全屏编辑";
            }
        }
    }
}

/**
 * 初始化课堂小测功能
 */
function initQuizGenerator() {
    // 题型选择
    const quizTypes = document.querySelectorAll('.quiz-type');
    
    quizTypes.forEach(type => {
        type.addEventListener('click', function() {
            quizTypes.forEach(qt => qt.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换题型的逻辑
        });
    });
    
    // 生成方式选择
    const optionBtns = document.querySelectorAll('.option-btn');
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换生成方式的逻辑
        });
    });
    
    // 难度滑块
    const difficultySlider = document.getElementById('difficulty-slider');
    
    if (difficultySlider) {
        difficultySlider.addEventListener('input', function() {
            // 这里可以添加难度调整的逻辑
        });
    }
    
    // 生成按钮
    const generateBtn = document.querySelector('.generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            showNotification('正在生成题目...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                showNotification('题目生成成功！', 'success');
                
                // 显示题目结果和生成的题目列表
                const quizResult = document.querySelector('.quiz-result');
                const generatedQuestionsList = document.querySelector('.generated-questions-list');
                
                if (quizResult) {
                    quizResult.style.display = 'block';
                }
                
                if (generatedQuestionsList) {
                    // 清除之前的动画
                    generatedQuestionsList.classList.remove('visible');
                    
                    // 显示列表
                    generatedQuestionsList.style.display = 'block';
                    
                    // 触发重绘
                    void generatedQuestionsList.offsetWidth;
                    
                    // 添加动画类
                    generatedQuestionsList.classList.add('visible');
                    
                    // 滚动到题目列表
                    setTimeout(() => {
                        generatedQuestionsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
                
                // 这里可以添加实际的题目生成逻辑
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 这里可以添加结果操作逻辑（编辑、保存、重新生成等）
        });
    });
}

/**
 * 初始化知识拓展功能
 */
function initKnowledgeExpansion() {
    // 文化按钮选择
    const cultureBtns = document.querySelectorAll('.culture-btn');
    
    cultureBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cultureBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换文化类型的逻辑
        });
    });
    
    // 生成按钮
    const generateBtn = document.querySelector('.knowledge-generation .generate-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
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
 * 初始化思维导图的缩放和拖动功能
 * 使用鼠标中键滚动实现缩放，按住中键拖动实现平移
 */
function initZoomableMindmap() {
    // 在文档加载完毕后或在AI助教-课中页面初始化时调用
    document.addEventListener('DOMContentLoaded', setupMindmapZoom);
    // 也可以在切换到相应页面时初始化
    const aiInClassNav = document.querySelector('.nav-item[data-section="ai-in"]');
    if (aiInClassNav) {
        aiInClassNav.addEventListener('click', setupMindmapZoom);
    }
    
    function setupMindmapZoom() {
        const mindmapContainer = document.getElementById('zoomable-mindmap');
        if (!mindmapContainer) return;
        
        let scale = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;
        
        // 设置初始状态
        updateMindmapTransform();
        
        // 滚动缩放功能 - 不需要按住中键，直接滚动即可缩放
        mindmapContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const zoomSensitivity = 0.1;
            const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
            
            // 计算缩放的鼠标位置
            const rect = mindmapContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 更新缩放比例
            const newScale = Math.max(0.5, Math.min(3, scale + delta));
            
            // 根据鼠标位置计算新的平移值以保持鼠标下方的点不变
            if (scale !== newScale) {
                const scaleRatio = newScale / scale;
                translateX = mouseX - scaleRatio * (mouseX - translateX);
                translateY = mouseY - scaleRatio * (mouseY - translateY);
                scale = newScale;
                
                updateMindmapTransform();
            }
        });
        
        // 中键拖动功能
        mindmapContainer.addEventListener('mousedown', function(e) {
            // 检查是否是中键按下
            if (e.button === 1) {
                e.preventDefault();
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                
                // 改变鼠标指针样式
                mindmapContainer.style.cursor = 'grabbing';
            }
        });
        
        // 处理拖动移动
        window.addEventListener('mousemove', function(e) {
            if (isDragging) {
                e.preventDefault();
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateMindmapTransform();
            }
        });
        
        // 处理拖动结束
        window.addEventListener('mouseup', function(e) {
            if (isDragging && e.button === 1) {
                isDragging = false;
                mindmapContainer.style.cursor = 'default';
            }
        });
        
        // 更新思维导图的变换
        function updateMindmapTransform() {
            if (!mindmapContainer) return;
            mindmapContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            mindmapContainer.style.transformOrigin = 'center';
            mindmapContainer.style.transition = isDragging ? 'none' : 'transform 0.2s ease-out';
        }
    }
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
 * 初始化章节滑动功能
 * 处理章节列表的水平滚动和导航按钮
 */
function initChapterSlider() {
    const chapterList = document.querySelector('.chapters-container');
    if (!chapterList) return;

    const prevBtn = document.querySelector('.chapter-nav-btn.prev-btn');
    const nextBtn = document.querySelector('.chapter-nav-btn.next-btn');
    
    if (!prevBtn || !nextBtn) return;
    
    // 初始状态下禁用上一页按钮
    prevBtn.classList.add('disabled');
    prevBtn.style.opacity = '0.5';
    prevBtn.style.cursor = 'not-allowed';
    
    // 卡片容器可见宽度
    const containerWidth = chapterList.offsetWidth;
    // 总内容宽度
    const scrollWidth = chapterList.scrollWidth;
    
    // 检查是否有溢出内容需要滚动
    if (scrollWidth <= containerWidth) {
        nextBtn.classList.add('disabled');
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
        return; // 如果没有滚动内容，不需要继续设置
    }

    // 设置滚动距离
    let cardWidth = 500; // 更新默认卡片宽度（包含外边距）
    const chapterCard = document.querySelector('.chapter-card');
    if (chapterCard) {
        cardWidth = chapterCard.offsetWidth + 20; // 加上外边距
    }
    const cardGap = 30; // 卡片之间的间距
    const scrollDistance = cardWidth + cardGap;

    // 更新按钮状态的函数
    function updateButtonStates() {
        if (!chapterList) return;
        
        const scrollPosition = chapterList.scrollLeft;
        const maxScroll = scrollWidth - containerWidth;
        
        // 根据滚动位置启用/禁用按钮
        if (scrollPosition <= 5) { // 添加少量容差
            prevBtn.classList.add('disabled');
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (scrollPosition >= maxScroll - 5) { // 添加容差值
            nextBtn.classList.add('disabled');
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    // 添加按钮点击事件
    prevBtn.addEventListener('click', function() {
        if (!prevBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    nextBtn.addEventListener('click', function() {
        if (!nextBtn.classList.contains('disabled') && chapterList) {
            chapterList.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        }
    });

    // 监听滚动事件更新按钮状态
    chapterList.addEventListener('scroll', updateButtonStates);
    
    // 初始化按钮状态
    updateButtonStates();
    
    // 确保初始状态下正确设置按钮状态
    setTimeout(updateButtonStates, 100);
}

// 添加课程思政和实训任务部分的交互
function initIdeologyAndPractice() {
    // 思政部分多媒体上传选项切换
    const uploadOptions = document.querySelectorAll('.upload-option');
    if (uploadOptions.length > 0) {
        uploadOptions.forEach(option => {
            option.addEventListener('click', () => {
                uploadOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    // 实训任务选项卡切换
    const practiceTabs = document.querySelectorAll('.practice-tab');
    const practiceContents = document.querySelectorAll('.practice-content');
    
    if (practiceTabs.length > 0) {
        practiceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-practice-tab');
                
                // 更新选项卡状态
                practiceTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 更新内容显示
                practiceContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}-content`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // 虚拟角色选择
    const roleTypes = document.querySelectorAll('.role-type');
    if (roleTypes.length > 0) {
        roleTypes.forEach(role => {
            role.addEventListener('click', () => {
                roleTypes.forEach(r => r.classList.remove('active'));
                role.classList.add('active');
            });
        });
    }

    // 为生成按钮添加点击效果
    const generateButtons = document.querySelectorAll('.generate-btn');
    if (generateButtons.length > 0) {
        generateButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 模拟生成中状态
                const originalText = btn.innerHTML;
                btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span class="zh">生成中...</span><span class="en">Generating...</span>`;
                btn.disabled = true;
                
                // 模拟生成过程
                setTimeout(() => {
                    // 恢复按钮状态
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    
                    // 显示成功通知
                    showNotification('内容已成功生成！', 'success');
                    
                    // 刷新预览区域，这里可以根据实际需求进行更多处理
                    // 此处仅作为示例
                }, 1500);
            });
        });
    }
}

// 初始化最新动态过滤功能
function initActivityFilters() {
    const filterItems = document.querySelectorAll('.filter-item');
    const activityItems = document.querySelectorAll('.activity-item');
    
    if (filterItems.length > 0) {
        filterItems.forEach(item => {
            item.addEventListener('click', () => {
                // 更新过滤器样式
                filterItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const filterType = item.getAttribute('data-filter');
                
                // 显示/隐藏活动项
                activityItems.forEach(activity => {
                    if (filterType === 'all' || activity.classList.contains(filterType)) {
                        activity.style.display = 'flex';
                    } else {
                        activity.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // 查看更多按钮功能
    const moreBtn = document.querySelector('.more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            // 这里可以实现查看更多功能，例如加载更多活动或跳转到活动页面
            showNotification('加载更多动态...', 'info');
        });
    }
}

/**
 * 初始化AI助教-课中部分
 * 处理AI助教-课中部分的交互功能
 */
function initAIInClass() {
    // 初始化控制面板切换
    initClassroomControlPanel();
    
    // 初始化签到分组功能
    initCheckInAndGrouping();
    
    // 初始化课件展示功能
    initSlidesDisplay();
    
    // 初始化互动功能
    initClassInteraction();
    
    // 初始化课堂数据分析
    initClassDataAnalysis();
}

/**
 * 初始化课堂控制面板
 */
function initClassroomControlPanel() {
    const controlItems = document.querySelectorAll('.control-item');
    const classroomPanels = document.querySelectorAll('.classroom-panel');
    
    if (controlItems.length === 0 || classroomPanels.length === 0) return;
    
    controlItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 移除所有控制项的活动状态
            controlItems.forEach(i => i.classList.remove('active'));
            // 为当前点击的控制项添加活动状态
            item.classList.add('active');
            
            // 隐藏所有面板
            classroomPanels.forEach(panel => panel.classList.remove('active'));
            // 显示对应的面板
            if (index < classroomPanels.length) {
                classroomPanels[index].classList.add('active');
            }
        });
    });
    
    // 课堂计时器功能
    const pauseBtn = document.querySelector('.class-status .control-btn:nth-child(3)');
    const stopBtn = document.querySelector('.class-status .control-btn:nth-child(4)');
    const timeDisplay = document.querySelector('.class-time');
    const statusBadge = document.querySelector('.status-badge');
    
    if (pauseBtn && stopBtn && timeDisplay && statusBadge) {
        let isPaused = false;
        let classTime = 0; // 秒数
        let timerInterval;
        
        // 初始化计时器
        function startTimer() {
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    classTime++;
                    updateTimeDisplay();
                }
            }, 1000);
        }
        
        // 更新时间显示
        function updateTimeDisplay() {
            const hours = Math.floor(classTime / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((classTime % 3600) / 60).toString().padStart(2, '0');
            const seconds = (classTime % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // 暂停/继续按钮
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            
            if (isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂已暂停</span><span class="en">Class Paused</span>';
                statusBadge.classList.remove('active');
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                statusBadge.innerHTML = '<i class="fas fa-circle"></i><span class="zh">课堂进行中</span><span class="en">Class in Progress</span>';
                statusBadge.classList.add('active');
            }
        });
        
        // 停止按钮
        stopBtn.addEventListener('click', () => {
            if (confirm('确定要结束当前课堂吗？')) {
                clearInterval(timerInterval);
                showNotification('课堂已结束', 'success');
                
                // 模拟导航到课后页面
                setTimeout(() => {
                    const aiPostNav = document.querySelector('.nav-item[data-section="ai-post"]');
                    if (aiPostNav) {
                        aiPostNav.click();
                    }
                }, 1500);
            }
        });
        
        // 启动计时器
        startTimer();
    }
}

/**
 * 初始化签到分组功能
 */
function initCheckInAndGrouping() {
    // 获取DOM元素
    const groupCountInput = document.getElementById('groupCount');
    const peoplePerGroupInput = document.getElementById('peoplePerGroup');
    const groupingMethodSelect = document.getElementById('groupingMethod');
    const groupBtn = document.querySelector('.panel-btn.group-action-btn');
    const groupList = document.querySelector('.group-list');
    
    // 签到二维码按钮
    const qrCodeBtn = document.querySelector('.panel-actions .panel-btn:not(.group-action-btn)');
    if (qrCodeBtn) {
        qrCodeBtn.addEventListener('click', () => {
            showNotification('签到二维码已显示', 'info');
        });
    }
    
    // 添加不同颜色样式到按钮
    if (groupBtn) {
        groupBtn.classList.add('primary-action');
    }
    
    // 数量增减控制
    function initNumberInput(input) {
        if (!input) return;
        
        const decreaseBtn = input.parentElement.querySelector('.decrease');
        const increaseBtn = input.parentElement.querySelector('.increase');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value > parseInt(input.min)) {
                    input.value = value - 1;
                    updateGroupSettings();
                }
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                let value = parseInt(input.value);
                if (value < parseInt(input.max)) {
                    input.value = value + 1;
                    updateGroupSettings();
                }
            });
        }
        
        // 输入框值变化时更新
        input.addEventListener('change', updateGroupSettings);
    }
    
    // 初始化数量输入框
    initNumberInput(groupCountInput);
    initNumberInput(peoplePerGroupInput);
    
    // 更新分组设置
    function updateGroupSettings() {
        const totalStudents = 78; // 已签到学生数
        const groupCount = parseInt(groupCountInput.value);
        const peoplePerGroup = parseInt(peoplePerGroupInput.value);
        
        // 检查设置是否合理
        if (groupCount * peoplePerGroup > totalStudents) {
            showNotification('当前设置超出总人数,请调整', 'warning');
            return false;
        }
        
        return true;
    }
    
    // 分组按钮点击事件
    if (groupBtn) {
        groupBtn.addEventListener('click', () => {
            if (!updateGroupSettings()) return;
            
            const groupCount = parseInt(groupCountInput.value);
            const peoplePerGroup = parseInt(peoplePerGroupInput.value);
            const groupingMethod = groupingMethodSelect.value;
            
            // 生成模拟学生数据
            const students = generateMockStudents();
            
            // 根据不同方式分组
            const groups = groupStudents(students, groupCount, peoplePerGroup, groupingMethod);
            
            // 显示分组结果
            displayGroups(groups);
        });
    }
    
    // 生成模拟学生数据
    function generateMockStudents() {
        const names = ['张明', '李华', '王芳', '刘伟', '陈晓', '赵阳', '钱宇', '孙丽', '周红', '吴勇', 
                      '郑军', '冯敏', '陈刚', '徐静', '杨光', '朱峰', '秦莉', '许涛', '潘婷', '马超'];
        
        return Array.from({length: 78}, (_, i) => ({
            id: i + 1,
            name: names[i % names.length] + (Math.floor(i / names.length) + 1),
            grade: Math.floor(Math.random() * 40) + 60, // 60-100分
            activity: Math.floor(Math.random() * 100) // 0-100活跃度
        }));
    }
    
    // 根据不同方式分组
    function groupStudents(students, groupCount, peoplePerGroup, method) {
        let groupedStudents = [];
        
        switch (method) {
            case 'balanced': // 成绩均衡
                students.sort((a, b) => b.grade - a.grade);
                break;
            case 'activity': // 活跃度均衡
                students.sort((a, b) => b.activity - a.activity);
                break;
            default: // 随机
                students.sort(() => Math.random() - 0.5);
        }
        
        // 创建分组
        for (let i = 0; i < groupCount; i++) {
            groupedStudents.push([]);
        }
        
        // 蛇形分配,确保每组能力均衡
        let groupIndex = 0;
        let direction = 1;
        
        students.forEach((student, index) => {
            if (groupedStudents[groupIndex].length < peoplePerGroup) {
                groupedStudents[groupIndex].push(student);
            }
            
            groupIndex += direction;
            
            if (groupIndex >= groupCount - 1) {
                direction = -1;
            } else if (groupIndex <= 0) {
                direction = 1;
            }
        });
        
        return groupedStudents;
    }
    
    // 显示分组结果
    function displayGroups(groups) {
        if (!groupList) return;
        
        groupList.innerHTML = '';
        
        groups.forEach((group, index) => {
            if (group.length === 0) return;
            
            const groupItem = document.createElement('div');
            groupItem.className = 'group-item';
            
            groupItem.innerHTML = `
                <div class="group-header">
                    <h4 class="zh">第${index + 1}组 (${group.length}人)</h4>
                    <h4 class="en">Group ${index + 1} (${group.length} Students)</h4>
                    <div class="group-actions">
                        <button class="group-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="group-btn">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </div>
                <div class="student-tags">
                    ${group.slice(0, 5).map(student => `
                        <span class="student-tag" title="成绩:${student.grade} 活跃度:${student.activity}">
                            ${student.name}
                        </span>
                    `).join('')}
                    ${group.length > 5 ? `<span class="student-tag">+${group.length - 5}</span>` : ''}
                </div>
            `;
            
            // 添加编辑和消息按钮事件
            const editBtn = groupItem.querySelector('.group-btn:nth-child(1)');
            const messageBtn = groupItem.querySelector('.group-btn:nth-child(2)');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showNotification(`正在编辑第${index + 1}组`, 'info');
                });
            }
            
            if (messageBtn) {
                messageBtn.addEventListener('click', () => {
                    showNotification(`已向第${index + 1}组发送消息`, 'success');
                });
            }
            
            groupList.appendChild(groupItem);
        });
        
        showNotification('分组完成', 'success');
    }
}

/**
 * 初始化课件展示功能
 */
function initSlidesDisplay() {
    // 幻灯片控制按钮
    const prevSlideBtn = document.querySelector('.slide-control-btn:nth-child(1)');
    const playSlideBtn = document.querySelector('.slide-control-btn:nth-child(2)');
    const nextSlideBtn = document.querySelector('.slide-control-btn:nth-child(3)');
    const slideCounter = document.querySelector('.slide-counter');
    
    if (prevSlideBtn && playSlideBtn && nextSlideBtn && slideCounter) {
        let currentSlide = 15;
        const totalSlides = 45;
        let isPlaying = false;
        let slideInterval;
        
        // 上一张幻灯片
        prevSlideBtn.addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                updateSlideDisplay();
            }
        });
        
        // 播放/暂停幻灯片
        playSlideBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playSlideBtn.innerHTML = '<i class="fas fa-pause"></i>';
                slideInterval = setInterval(() => {
                    if (currentSlide < totalSlides) {
                        currentSlide++;
                        updateSlideDisplay();
                    } else {
                        clearInterval(slideInterval);
                        isPlaying = false;
                        playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }, 3000);
            } else {
                playSlideBtn.innerHTML = '<i class="fas fa-play"></i>';
                clearInterval(slideInterval);
            }
        });
        
        // 下一张幻灯片
        nextSlideBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlideDisplay();
            }
        });
        
        // 更新幻灯片显示
        function updateSlideDisplay() {
            slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
            
            // 这里可以添加切换幻灯片图片的逻辑
            const slideImg = document.querySelector('.current-slide');
            if (slideImg) {
                slideImg.style.opacity = '0';
                
                setTimeout(() => {
                    slideImg.style.opacity = '1';
                }, 300);
            }
            
            // 更新缩略图选中状态
            const thumbnails = document.querySelectorAll('.slide-thumbnail');
            if (thumbnails.length > 0) {
                thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
                
                // 假设缩略图的顺序与幻灯片顺序对应，选中当前幻灯片的缩略图
                // 由于示例中只有几个缩略图，这里只是模拟效果
                const idx = (currentSlide - 13) % thumbnails.length;
                if (idx >= 0 && idx < thumbnails.length) {
                    thumbnails[idx].classList.add('active');
                }
            }
        }
        
        // 缩略图点击事件
        const thumbnails = document.querySelectorAll('.slide-thumbnail');
        if (thumbnails.length > 0) {
            thumbnails.forEach((thumbnail, idx) => {
                thumbnail.addEventListener('click', () => {
                    // 修改: 避免读取不存在的元素
                    currentSlide = 13 + idx;
                    updateSlideDisplay();
                });
            });
        }
    }
    
    // 全屏和批注按钮
    const fullscreenBtn = document.querySelector('#slides-panel .panel-btn:nth-child(1)');
    const annotateBtn = document.querySelector('#slides-panel .panel-btn:nth-child(2)');
    const slidePreview = document.querySelector('.slide-preview');
    
    if (fullscreenBtn && annotateBtn && slidePreview) {
        fullscreenBtn.addEventListener('click', () => {
            toggleFullscreen();
        });
        
        annotateBtn.addEventListener('click', () => {
            showNotification('已启用批注模式', 'info');
        });
        
        // 全屏切换函数
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                slidePreview.requestFullscreen().catch(err => {
                    showNotification('全屏模式失败: ' + err.message, 'error');
                });
                slidePreview.classList.add('fullscreen');
            } else {
                document.exitFullscreen();
                slidePreview.classList.remove('fullscreen');
            }
        }
        
        // 全屏状态变化监听
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                slidePreview.classList.remove('fullscreen');
            }
        });
        
        // 初始化全屏互动工具
        initFullscreenInteractionTools();
    }
}

/**
 * 初始化全屏模式下的互动工具
 */
function initFullscreenInteractionTools() {
    const interactionTools = document.querySelectorAll('.fullscreen-tool');
    const interactionModal = document.getElementById('interaction-modal');
    const closeInteractionBtn = document.querySelector('.close-interaction-btn');
    
    // 互动工具点击事件
    if (interactionTools.length > 0) {
        interactionTools.forEach(tool => {
            tool.addEventListener('click', () => {
                if (document.fullscreenElement) {
                    // 先退出全屏，再显示互动弹窗
                    document.exitFullscreen().then(() => {
                        setTimeout(() => {
                            openInteractionModal(tool.getAttribute('data-interaction'));
                        }, 300);
                    });
                } else {
                    openInteractionModal(tool.getAttribute('data-interaction'));
                }
            });
        });
    }
    
    // 关闭互动弹窗
    if (closeInteractionBtn) {
        closeInteractionBtn.addEventListener('click', () => {
            interactionModal.classList.remove('active');
        });
    }
    
    // 初始化显示答案按钮事件
    initShowAnswerButtons();
    
    // 打开互动弹窗并显示对应内容
    function openInteractionModal(interactionType) {
        if (!interactionModal) return;
        
        // 隐藏所有互动内容区域
        const interactionSections = interactionModal.querySelectorAll('.interaction-section');
        interactionSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // 根据互动类型显示对应内容
        const targetSection = document.getElementById(`${interactionType}-interaction`);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // 更新弹窗标题
            const headerZh = interactionModal.querySelector('.interaction-header .zh');
            const headerEn = interactionModal.querySelector('.interaction-header .en');
            
            if (headerZh && headerEn) {
                if (interactionType === 'quiz') {
                    headerZh.textContent = '课堂小测';
                    headerEn.textContent = 'Quiz';
                    
                    // 初始化题目导航
                    setTimeout(() => {
                        initQuizNavigation();
                    }, 100);
                } else if (interactionType === 'knowledge') {
                    headerZh.textContent = '知识拓展';
                    headerEn.textContent = 'Knowledge Expansion';
                } else if (interactionType === 'ideology') {
                    headerZh.textContent = '课程思政';
                    headerEn.textContent = 'Ideological Discussion';
                }
            }
            
            // 重置答案显示状态
            const answerContainers = targetSection.querySelectorAll('.answer-container');
            const showAnswerBtns = targetSection.querySelectorAll('.show-answer-btn');
            
            answerContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            showAnswerBtns.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
            });
            
            interactionModal.classList.add('active');
        }
    }
}

/**
 * 初始化显示答案按钮事件
 */
function initShowAnswerButtons() {
    document.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.show-answer-btn')) {
            const btn = e.target.closest('.show-answer-btn');
            const answerContainer = btn.nextElementSibling;
            
            if (answerContainer && answerContainer.classList.contains('answer-container')) {
                if (answerContainer.style.display === 'none') {
                    // 显示答案
                    answerContainer.style.display = 'block';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i><span class="zh">隐藏答案</span><span class="en">Hide Answer</span>';
                } else {
                    // 隐藏答案
                    answerContainer.style.display = 'none';
                    btn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
                }
            }
        }
    });
}

/**
 * 初始化互动功能
 */
function initClassInteraction() {
    // 互动类型切换
    const interactionTypes = document.querySelectorAll('.interaction-type');
    
    if (interactionTypes.length > 0) {
        interactionTypes.forEach(type => {
            type.addEventListener('click', () => {
                interactionTypes.forEach(t => t.classList.remove('active'));
                type.classList.add('active');
                
                const typeName = type.querySelector('.zh').textContent;
                showNotification(`已切换到: ${typeName}`, 'info');
            });
        });
    }
    
    // 发起互动按钮
    const startInteractionBtn = document.querySelector('.panel-btn.primary');
    
    if (startInteractionBtn) {
        startInteractionBtn.addEventListener('click', () => {
            const activeType = document.querySelector('.interaction-type.active');
            if (activeType) {
                const typeName = activeType.querySelector('.zh').textContent;
                showNotification(`正在发起: ${typeName}`, 'success');
            }
        });
    }
    
    // 弹幕发送功能
    const danmakuInput = document.querySelector('.danmaku-input.zh');
    const sendDanmakuBtn = document.querySelector('.send-danmaku-btn');
    const danmakuScreen = document.querySelector('.danmaku-screen');
    const sentimentBtns = document.querySelectorAll('.sentiment-btn');
    
    if (danmakuInput && sendDanmakuBtn && danmakuScreen && sentimentBtns.length > 0) {
        // 情感按钮切换
        sentimentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sentimentBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // 发送弹幕
        function sendDanmaku() {
            const content = danmakuInput.value.trim();
            if (content) {
                const danmaku = document.createElement('div');
                danmaku.classList.add('danmaku-item');
                
                // 添加情感类型
                const activeSentiment = document.querySelector('.sentiment-btn.active');
                if (activeSentiment) {
                    if (activeSentiment.classList.contains('agree')) {
                        danmaku.classList.add('agree');
                    } else if (activeSentiment.classList.contains('disagree')) {
                        danmaku.classList.add('disagree');
                    }
                }
                
                danmaku.textContent = content;
                
                // 随机高度
                const top = Math.floor(Math.random() * 150) + 10;
                danmaku.style.top = `${top}px`;
                
                danmakuScreen.appendChild(danmaku);
                danmakuInput.value = '';
                
                // 弹幕动画结束后移除元素
                danmaku.addEventListener('animationend', () => {
                    danmaku.remove();
                });
            }
        }
        
        // 点击发送按钮
        sendDanmakuBtn.addEventListener('click', sendDanmaku);
        
        // 按下回车键发送
        danmakuInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendDanmaku();
            }
        });
        
        // 弹幕设置按钮
        const danmakuSettingBtns = document.querySelectorAll('.danmaku-setting-btn');
        
        if (danmakuSettingBtns.length >= 3) {
            // 设置按钮
            danmakuSettingBtns[0].addEventListener('click', () => {
                showNotification('弹幕设置已打开', 'info');
            });
            
            // 暂停/继续按钮
            let isPaused = false;
            danmakuSettingBtns[1].addEventListener('click', () => {
                isPaused = !isPaused;
                
                if (isPaused) {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-play"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'paused';
                    });
                    showNotification('弹幕已暂停', 'info');
                } else {
                    danmakuSettingBtns[1].innerHTML = '<i class="fas fa-pause"></i>';
                    danmakuScreen.querySelectorAll('.danmaku-item').forEach(item => {
                        item.style.animationPlayState = 'running';
                    });
                    showNotification('弹幕已继续', 'info');
                }
            });
            
            // 清空按钮
            danmakuSettingBtns[2].addEventListener('click', () => {
                danmakuScreen.innerHTML = '';
                showNotification('弹幕已清空', 'info');
            });
        }
    }
}

/**
 * 初始化课堂数据分析
 */
function initClassDataAnalysis() {
    // 导出数据按钮
    const exportDataBtn = document.querySelector('#class-data-panel .panel-btn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            showNotification('正在导出课堂数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('课堂数据已导出', 'success');
            }, 800);
        });
    }
    
    // 这里可以添加图表初始化代码，但由于示例中使用的是占位图像，暂不实现
}

/**
 * 初始化学情画像功能
 * 处理学生数据的筛选、排序、查询等交互功能
 */
function initStudentProfile() {
    // 初始化筛选功能
    initProfileFilters();
    
    // 初始化表格操作和分页功能
    initProfileTable();
    
    // 初始化搜索和批量操作功能
    initProfileSearch();
    
    // 初始化表格内操作按钮功能
    initTableActions();
}

/**
 * 初始化筛选功能
 */
function initProfileFilters() {
    const classSelect = document.getElementById('class-select');
    const dateFilter = document.querySelector('.filter-date');
    const filterBtn = document.querySelector('.filter-btn:not(.reset)');
    const resetBtn = document.querySelector('.filter-btn.reset');
    
    if (!classSelect || !dateFilter || !filterBtn || !resetBtn) return;
    
    // 筛选按钮点击事件
    filterBtn.addEventListener('click', () => {
        const selectedClass = classSelect.value;
        const selectedDate = dateFilter.value;
        
        // 模拟筛选操作
        showNotification('正在应用筛选条件...', 'info');
        
        // 这里可以添加实际的筛选逻辑，向后端发送请求等
        setTimeout(() => {
            let message = '';
            
            if (selectedClass !== 'all') {
                const classText = document.querySelector(`#class-select option[value="${selectedClass}"]`).textContent;
                const className = document.body.classList.contains('en-mode') ? 
                    classText.trim() : classText.trim();
                message += `班级: ${className}, `;
            }
            
            if (selectedDate) {
                const dateObj = new Date(selectedDate);
                const formattedDate = dateObj.toLocaleDateString();
                message += `截止日期: ${formattedDate}`;
            }
            
            if (message) {
                showNotification(`筛选已应用: ${message}`, 'success');
            } else {
                showNotification('筛选已应用', 'success');
            }
        }, 500);
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', () => {
        classSelect.value = 'all';
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateFilter.value = `${year}-${month}-${day}`;
        
        showNotification('筛选条件已重置', 'info');
    });
}

/**
 * 初始化表格操作和分页功能
 */
function initProfileTable() {
    const selectAll = document.getElementById('select-all');
    const studentCheckboxes = document.querySelectorAll('.student-checkbox');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const paginationSelect = document.querySelector('.pagination-select');
    
    if (!selectAll || studentCheckboxes.length === 0) return;
    
    // 全选/取消全选
    selectAll.addEventListener('change', () => {
        studentCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    });
    
    // 单个复选框更新全选状态
    studentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(studentCheckboxes).every(cb => cb.checked);
            const anyChecked = Array.from(studentCheckboxes).some(cb => cb.checked);
            
            selectAll.checked = allChecked;
            selectAll.indeterminate = anyChecked && !allChecked;
        });
    });
    
    // 分页按钮点击
    if (paginationBtns.length > 0) {
        paginationBtns.forEach(btn => {
            if (!btn.disabled && !btn.classList.contains('active')) {
                btn.addEventListener('click', () => {
                    // 获取页码
                    const page = btn.textContent;
                    if (!isNaN(page)) {
                        // 数字页码按钮
                        paginationBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        showNotification(`已切换到第 ${page} 页`, 'info');
                    } else if (btn.querySelector('i.fa-chevron-left')) {
                        // 上一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.previousElementSibling && 
                            activePage.previousElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.previousElementSibling.classList.add('active');
                            showNotification(`已切换到上一页`, 'info');
                        }
                    } else if (btn.querySelector('i.fa-chevron-right')) {
                        // 下一页按钮
                        const activePage = document.querySelector('.pagination-btn.active');
                        if (activePage && activePage.nextElementSibling && 
                            activePage.nextElementSibling.classList.contains('pagination-btn')) {
                            activePage.classList.remove('active');
                            activePage.nextElementSibling.classList.add('active');
                            showNotification(`已切换到下一页`, 'info');
                        }
                    }
                });
            }
        });
    }
    
    // 每页显示数量选择
    if (paginationSelect) {
        paginationSelect.addEventListener('change', () => {
            const perPage = paginationSelect.value;
            showNotification(`每页显示数量已更改为 ${perPage}`, 'info');
        });
    }
}

/**
 * 初始化搜索和批量操作功能
 */
function initProfileSearch() {
    const searchInputs = document.querySelectorAll('.profile-search .search-input');
    const exportBtn = document.querySelector('.action-btn.export');
    const batchBtn = document.querySelector('.action-btn.batch');
    
    // 搜索功能
    if (searchInputs.length > 0) {
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = input.value.trim();
                    if (searchTerm) {
                        showNotification(`正在搜索: ${searchTerm}`, 'info');
                        
                        // 这里可以添加实际的搜索逻辑
                        setTimeout(() => {
                            showNotification(`已找到与 "${searchTerm}" 相关的结果`, 'success');
                        }, 500);
                    }
                }
            });
        });
    }
    
    // 导出数据按钮
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showNotification('正在准备导出数据...', 'info');
            
            // 模拟导出过程
            setTimeout(() => {
                showNotification('数据已成功导出', 'success');
            }, 800);
        });
    }
    
    // 批量操作按钮
    if (batchBtn) {
        batchBtn.addEventListener('click', () => {
            const checkedStudents = document.querySelectorAll('.student-checkbox:checked');
            
            if (checkedStudents.length === 0) {
                showNotification('请先选择学生', 'warning');
                return;
            }
            
            showNotification(`已选择 ${checkedStudents.length} 名学生，准备批量操作`, 'info');
            
            // 这里可以添加实际的批量操作逻辑，例如显示操作菜单等
        });
    }
}

/**
 * 初始化表格内操作按钮功能
 */
function initTableActions() {
    const viewBtns = document.querySelectorAll('.table-btn.view');
    const gradeBtns = document.querySelectorAll('.table-btn.grade');
    const messageBtns = document.querySelectorAll('.table-btn.message');
    
    // 查看学生画像
    if (viewBtns.length > 0) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                const studentId = row.cells[2].textContent;
                
                showNotification(`查看学生画像: ${studentName} (${studentId})`, 'info');
                
                // 这里可以添加打开学生详情模态框的逻辑
            });
        });
    }
    
    // 批阅作业
    if (gradeBtns.length > 0) {
        gradeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`正在批阅 ${studentName} 的作业`, 'info');
                
                // 这里可以添加打开批阅界面的逻辑
            });
        });
    }
    
    // 发送消息
    if (messageBtns.length > 0) {
        messageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const studentName = row.cells[1].textContent;
                
                showNotification(`发送消息给 ${studentName}`, 'info');
                
                // 这里可以添加打开消息对话框的逻辑
            });
        });
    }
}

/**
 * 初始化中国文化演化模块
 * 处理文化演化模块中的视图切换、交互等功能
 */
function initCultureEvolution() {
    // 初始化视图切换
    initViewModes();
    
    // 初始化时间轴功能
    initTimelineView();
    
    // 初始化地图视图功能
    initMapView();
    
    // 初始化关系图视图功能
    initRelationView();
    
    // 初始化文化元素卡片功能
    initElementCard();
}

/**
 * 初始化视图模式切换功能
 */
function initViewModes() {
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const evolutionViews = document.querySelectorAll('.evolution-view');
    
    if (viewModeBtns.length === 0 || evolutionViews.length === 0) return;
    
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的活动状态
            viewModeBtns.forEach(b => b.classList.remove('active'));
            // 为当前点击的按钮添加活动状态
            btn.classList.add('active');
            
            // 获取要显示的视图模式
            const viewMode = btn.getAttribute('data-mode');
            
            // 隐藏所有视图
            evolutionViews.forEach(view => view.classList.remove('active'));
            
            // 显示对应的视图
            document.querySelector(`.${viewMode}-view`).classList.add('active');
            
            // 视图切换通知
            const modeName = btn.querySelector('.zh').textContent;
            showNotification(`已切换到${modeName}视图`, 'info');
        });
    });
    
    // 类别和朝代筛选下拉框
    const filterSelects = document.querySelectorAll('.evolution-filters .filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            const filterType = select.querySelector('option:checked').classList.contains('zh') ? 
                select.previousElementSibling.querySelector('.zh').textContent : 
                select.previousElementSibling.querySelector('.en').textContent;
            
            const selectedValue = select.value;
            const selectedText = select.querySelector(`option[value="${selectedValue}"]`).textContent;
            
            showNotification(`已筛选${filterType}: ${selectedText}`, 'info');
            
            // 根据视图模式应用不同的筛选逻辑
            const activeView = document.querySelector('.evolution-view.active');
            
            if (activeView.classList.contains('timeline-view')) {
                applyTimelineFilter(selectedValue);
            } else if (activeView.classList.contains('map-view')) {
                applyMapFilter(selectedValue);
            } else if (activeView.classList.contains('relation-view')) {
                applyRelationFilter(selectedValue);
            }
        });
    });
}

/**
 * 应用时间轴视图筛选
 * @param {string} filter - 筛选条件
 */
function applyTimelineFilter(filter) {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    if (filter === 'all') {
        // 显示所有节点
        timelineNodes.forEach(node => {
            node.style.display = 'block';
        });
        return;
    }
    
    // 筛选节点
    timelineNodes.forEach(node => {
        // 检查节点是否符合筛选条件（类别或朝代）
        const nodeCategory = node.getAttribute('data-category');
        
        if (nodeCategory === filter) {
            node.style.display = 'block';
        } else {
            node.style.display = 'none';
        }
    });
}

/**
 * 应用地图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyMapFilter(filter) {
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    if (filter === 'all') {
        // 显示所有标记
        mapMarkers.forEach(marker => {
            marker.style.display = 'block';
        });
        return;
    }
    
    // 筛选标记
    mapMarkers.forEach(marker => {
        // 检查标记是否符合筛选条件（朝代）
        const markerEra = marker.getAttribute('data-era');
        
        if (markerEra === filter) {
            marker.style.display = 'block';
        } else {
            marker.style.display = 'none';
        }
    });
}

/**
 * 应用关系图视图筛选
 * @param {string} filter - 筛选条件
 */
function applyRelationFilter(filter) {
    // 这里通常会与可视化库（如D3.js）集成
    // 目前仅显示通知
    showNotification(`关系图筛选已应用: ${filter}`, 'info');
}

/**
 * 初始化时间轴视图功能
 */
function initTimelineView() {
    // 缩放控制
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    const zoomSlider = document.querySelector('.zoom-slider input');
    
    if (zoomSlider) {
        // 缩放滑块
        zoomSlider.addEventListener('input', () => {
            const zoomLevel = zoomSlider.value;
            applyTimelineZoom(zoomLevel);
        });
        
        // 缩放按钮
        if (zoomButtons.length >= 2) {
            // 缩小按钮
            zoomButtons[0].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.max(1, currentZoom - 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
            
            // 放大按钮
            zoomButtons[1].addEventListener('click', () => {
                const currentZoom = parseInt(zoomSlider.value);
                const newZoom = Math.min(10, currentZoom + 1);
                zoomSlider.value = newZoom;
                applyTimelineZoom(newZoom);
            });
        }
    }
    
    // 时间轴导航
    const navigationButtons = document.querySelectorAll('.navigation-btn');
    const timelineEras = document.querySelectorAll('.timeline-era');
    let currentEraIndex = 2; // 默认选中"秦汉"时期
    
    if (navigationButtons.length >= 2 && timelineEras.length > 0) {
        // 上一个时期按钮
        navigationButtons[0].addEventListener('click', () => {
            if (currentEraIndex > 0) {
                currentEraIndex--;
                updateActiveEra();
            }
        });
        
        // 下一个时期按钮
        navigationButtons[1].addEventListener('click', () => {
            if (currentEraIndex < timelineEras.length - 1) {
                currentEraIndex++;
                updateActiveEra();
            }
        });
        
        // 时期点击事件
        timelineEras.forEach((era, index) => {
            era.addEventListener('click', () => {
                currentEraIndex = index;
                updateActiveEra();
            });
        });
        
        // 更新活动时期
        function updateActiveEra() {
            // 更新时期高亮
            timelineEras.forEach(era => era.classList.remove('active'));
            timelineEras[currentEraIndex].classList.add('active');
            
            // 更新导航信息
            const eraLabelZh = timelineEras[currentEraIndex].querySelector('.era-label .zh').textContent;
            const eraLabelEn = timelineEras[currentEraIndex].querySelector('.era-label .en').textContent;
            
            // 模拟不同时期的年代范围
            const eraDates = [
                {zh: '史前时期 (约公元前8000年-前2070年)', en: 'Prehistoric Period (ca. 8000-2070 BC)'},
                {zh: '夏商周时期 (约公元前2070年-前221年)', en: 'Xia-Shang-Zhou Period (ca. 2070-221 BC)'},
                {zh: '秦汉时期 (公元前221年-公元220年)', en: 'Qin-Han Period (221 BC-220 AD)'},
                {zh: '隋唐时期 (公元581年-907年)', en: 'Sui-Tang Period (581-907 AD)'},
                {zh: '宋元时期 (公元960年-1368年)', en: 'Song-Yuan Period (960-1368 AD)'},
                {zh: '明清时期 (公元1368年-1912年)', en: 'Ming-Qing Period (1368-1912 AD)'},
                {zh: '近现代 (公元1912年至今)', en: 'Modern Period (1912-Present)'}
            ];
            
            const navigationInfoZh = document.querySelector('.navigation-info.zh');
            const navigationInfoEn = document.querySelector('.navigation-info.en');
            
            if (navigationInfoZh && navigationInfoEn) {
                navigationInfoZh.textContent = eraDates[currentEraIndex].zh;
                navigationInfoEn.textContent = eraDates[currentEraIndex].en;
            }
            
            // 通知
            showNotification(`已切换到${eraLabelZh}时期`, 'info');
            
            // 更新时间轴上显示的节点
            updateVisibleTimelineNodes();
        }
        
        // 更新可见的时间轴节点
        function updateVisibleTimelineNodes() {
            // 这里可以根据当前选中的时期，显示/隐藏相应的节点
            // 现在简单模拟这个效果
            const eraLeftPosition = [10, 25, 45, 65, 80, 90, 95]; // 时期的大致位置百分比
            const timelineNodes = document.querySelectorAll('.timeline-node');
            
            timelineNodes.forEach(node => {
                const nodeLeft = parseFloat(node.style.left);
                
                // 简单判断节点是否应该在当前时期显示
                // 实际应用中可以使用具体的时间数据来判断
                const lowerBound = currentEraIndex > 0 ? eraLeftPosition[currentEraIndex - 1] : 0;
                const upperBound = currentEraIndex < eraLeftPosition.length - 1 ? eraLeftPosition[currentEraIndex + 1] : 100;
                
                if (nodeLeft >= lowerBound && nodeLeft <= upperBound) {
                    node.style.display = 'block';
                } else {
                    node.style.display = 'none';
                }
            });
        }
    }
    
    // 绑定节点点击事件
    bindTimelineNodeEvents();
}

/**
 * 应用时间轴缩放
 * @param {number} level - 缩放级别
 */
function applyTimelineZoom(level) {
    const timelineItems = document.querySelector('.timeline-items');
    
    if (!timelineItems) return;
    
    // 缩放效果，基础高度为300px，最大可以放大到700px
    const newHeight = 300 + level * 40;
    timelineItems.style.height = `${newHeight}px`;
    
    // 通知
    showNotification(`时间轴缩放级别: ${level}`, 'info');
}

/**
 * 绑定时间轴节点点击事件
 */
function bindTimelineNodeEvents() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    
    timelineNodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeTitle = node.querySelector('.node-title .zh').textContent;
            
            // 显示文化元素详情卡片
            showElementCard(nodeTitle, node.getAttribute('data-category'));
        });
    });
}

/**
 * 初始化地图视图功能
 */
function initMapView() {
    // 地图标记点点击事件
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const markerLabel = marker.querySelector('.marker-label .zh').textContent;
            
            // 显示地点信息面板
            showLocationInfo(markerLabel);
        });
    });
    
    // 信息面板关闭按钮
    const closeInfoBtn = document.querySelector('.map-info-panel .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoPanel = document.querySelector('.map-info-panel');
            
            if (infoPanel) {
                infoPanel.style.display = 'none';
            }
        });
    }
}

/**
 * 显示地点信息
 * @param {string} location - 地点名称
 */
function showLocationInfo(location) {
    const infoPanel = document.querySelector('.map-info-panel');
    const infoItems = document.querySelectorAll('.info-item');
    
    if (!infoPanel || infoItems.length === 0) return;
    
    // 显示信息面板
    infoPanel.style.display = 'block';
    
    // 根据地点名称匹配相应的信息项
    let found = false;
    
    infoItems.forEach(item => {
        const itemLocation = item.getAttribute('data-location');
        
        if (itemLocation && (itemLocation === location.toLowerCase() || itemLocation.includes(location.toLowerCase()))) {
            // 显示匹配的信息项
            infoItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            found = true;
        }
    });
    
    // 如果没有找到匹配的信息项，使用第一个作为默认
    if (!found && infoItems.length > 0) {
        infoItems.forEach(i => i.classList.remove('active'));
        infoItems[0].classList.add('active');
    }
    
    // 通知
    showNotification(`正在查看: ${location}`, 'info');
}

/**
 * 初始化关系图视图功能
 */
function initRelationView() {
    // 信息框关闭按钮
    const closeInfoBtn = document.querySelector('.graph-info-box .close-info-btn');
    
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', () => {
            const infoBox = document.querySelector('.graph-info-box');
            
            if (infoBox) {
                infoBox.style.display = 'none';
            }
        });
    }
    
    // 关系图点击（使用占位图像模拟）
    const graphPlaceholder = document.querySelector('.graph-placeholder');
    
    if (graphPlaceholder) {
        graphPlaceholder.addEventListener('click', event => {
            // 获取点击位置相对于图像的坐标
            const rect = graphPlaceholder.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // 显示信息框
            showGraphInfo(x, y);
        });
    }
}

/**
 * 显示关系图信息
 * @param {number} x - 点击X坐标
 * @param {number} y - 点击Y坐标
 */
function showGraphInfo(x, y) {
    const infoBox = document.querySelector('.graph-info-box');
    
    if (!infoBox) return;
    
    // 显示信息框
    infoBox.style.display = 'block';
    
    // 通知
    showNotification('已选择关系图元素', 'info');
}

/**
 * 初始化文化元素卡片功能
 */
function initElementCard() {
    // 卡片关闭按钮
    const closeCardBtn = document.querySelector('.culture-element-card .close-card-btn');
    
    if (closeCardBtn) {
        closeCardBtn.addEventListener('click', () => {
            hideElementCard();
        });
    }
    
    // 卡片操作按钮
    const elementBtns = document.querySelectorAll('.element-actions .element-btn');
    
    elementBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const btnText = btn.querySelector('.zh').textContent;
            showNotification(`执行操作: ${btnText}`, 'info');
        });
    });
    
    // 相关元素标签点击
    const elementTags = document.querySelectorAll('.element-tags li');
    
    elementTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.querySelector('.zh').textContent;
            showNotification(`正在查看: ${tagText}`, 'info');
            
            // 模拟加载新的元素详情
            setTimeout(() => {
                showElementCard(tagText);
            }, 500);
        });
    });
}

/**
 * 显示文化元素详情卡片
 * @param {string} elementName - 元素名称
 * @param {string} category - 元素类别
 */
function showElementCard(elementName, category = 'material') {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 更新卡片类别
    const elementCategory = elementCard.querySelector('.element-category');
    
    if (elementCategory) {
        // 移除之前的类别
        elementCategory.classList.remove('material', 'institutional', 'spiritual');
        
        // 添加新的类别
        elementCategory.classList.add(category);
        
        // 更新类别文本
        const categoryTextZh = elementCategory.querySelector('.zh');
        const categoryTextEn = elementCategory.querySelector('.en');
        
        if (categoryTextZh && categoryTextEn) {
            switch (category) {
                case 'material':
                    categoryTextZh.textContent = '物质文化';
                    categoryTextEn.textContent = 'Material Culture';
                    break;
                case 'institutional':
                    categoryTextZh.textContent = '制度文化';
                    categoryTextEn.textContent = 'Institutional Culture';
                    break;
                case 'spiritual':
                    categoryTextZh.textContent = '精神文化';
                    categoryTextEn.textContent = 'Spiritual Culture';
                    break;
            }
        }
    }
    
    // 显示卡片
    elementCard.classList.add('show');
    
    // 通知
    showNotification(`正在查看文化元素: ${elementName}`, 'info');
}

/**
 * 隐藏文化元素详情卡片
 */
function hideElementCard() {
    const elementCard = document.querySelector('.culture-element-card');
    
    if (!elementCard) return;
    
    // 隐藏卡片
    elementCard.classList.remove('show');
}

/**
 * 初始化内容生成弹窗
 * 处理内容生成弹窗的打开、关闭和交互
 */
function initContentGenerateModal() {
    const modal = document.getElementById('contentGenerateModal');
    const openBtn = document.querySelector('.action-button:nth-child(2)'); // 内容生成按钮
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const generateBtn = modal.querySelector('.generate-btn');
    const tabBtns = modal.querySelectorAll('.generate-tab-btn');
    const tabContents = modal.querySelectorAll('.generate-tab-content');
    const styleBtns = modal.querySelectorAll('.style-btn');
    const sizeBtns = modal.querySelectorAll('.size-btn');
    
    // 打开弹窗
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    }
    
    // 关闭弹窗
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
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
            
            // 模拟生成过程
            setTimeout(() => {
                resultPlaceholder.style.display = 'none';
                
                if (activeTab.id === 'text2text-content') {
                    // 文生文结果
                    const generatedText = activeTab.querySelector('.generated-text');
                    generatedText.style.display = 'block';
                    generatedText.innerHTML = `<h3>中国传统绘画的特点与技法</h3>
<p>中国传统绘画是中华文明的重要组成部分，具有悠久的历史和独特的艺术魅力。以下从几个方面介绍中国传统绘画的主要特点与技法：</p>

<h4>一、中国传统绘画的特点</h4>

<p>1. <strong>以线造型</strong>：中国画以线条为主要表现手段，讲究"线条用笔"，通过不同的线条变化来表现物象的形态和质感。</p>

<p>2. <strong>写意精神</strong>：强调艺术家的主观表达，不追求对客观对象的完全模仿，而是追求"神似"而非"形似"。</p>

<p>3. <strong>虚实结合</strong>：画面中有意识地留白，使实与虚、有与无相互映衬，达到"虚实相生"的艺术效果。</p>

<p>4. <strong>诗书画印结合</strong>：中国画常与诗文、书法、印章相结合，形成独特的综合艺术形式。</p>

<h4>二、主要技法</h4>

<p>1. <strong>用笔技法</strong>：</p>
<ul>
    <li>钩勒：以线条勾画轮廓</li>
    <li>皴法：表现山石纹理的技法</li>
    <li>点法：用笔尖点画，表现叶、花等</li>
    <li>擦法：用侧锋轻擦，表现烟云等</li>
</ul>

<p>2. <strong>用墨技法</strong>：</p>
<ul>
    <li>焦墨：墨色浓重</li>
    <li>浓墨：墨色较重</li>
    <li>淡墨：墨色较淡</li>
    <li>破墨：墨色深浅相间</li>
    <li>渴墨：干笔擦出的效果</li>
</ul>

<p>3. <strong>设色技法</strong>：</p>
<ul>
    <li>工笔重彩：精细描绘，色彩浓重</li>
    <li>淡彩：颜色淡雅</li>
    <li>水墨渲染：水墨晕染效果</li>
    <li>泼墨泼彩：随意挥洒墨与彩</li>
</ul>

<h4>三、主要流派</h4>

<p>1. <strong>北宋山水画</strong>：以范宽、郭熙、李成为代表，追求雄伟壮丽的山水风貌。</p>

<p>2. <strong>南宋院体画</strong>：以马远、夏圭为代表，形成"马一角"、"夏半边"的构图特点。</p>

<p>3. <strong>元代文人画</strong>：以黄公望、吴镇、倪瓒、王蒙"元四家"为代表，重视个人情感表达。</p>

<p>4. <strong>明清写意画</strong>：以徐渭、八大山人、石涛等为代表，笔墨更加随意奔放。</p>

<p>通过学习和掌握这些特点与技法，可以更好地理解和欣赏中国传统绘画的艺术魅力，也为创作实践提供参考和指导。</p>`;
                } else {
                    // 文生图结果
                    const generatedImages = activeTab.querySelector('.generated-images');
                    generatedImages.style.display = 'flex';
                    generatedImages.innerHTML = `
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=中国山水画" alt="生成的图像1">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=青山绿水" alt="生成的图像2">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=亭台楼阁" alt="生成的图像3">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                        <div class="generated-image">
                            <img src="https://via.placeholder.com/300x168?text=飞鸟山水" alt="生成的图像4">
                            <div class="image-actions">
                                <button class="image-action-btn"><i class="fas fa-download"></i></button>
                                <button class="image-action-btn"><i class="fas fa-file-import"></i></button>
                            </div>
                        </div>
                    `;
                    
                    // 给生成的图片添加悬停效果和按钮功能
                    const imageActions = document.querySelectorAll('.image-actions button');
                    imageActions.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            showNotification('图片操作成功', 'success');
                        });
                    });
                }
                
                // 添加结果操作按钮事件
                const actionBtns = activeTab.querySelectorAll('.result-action-btn');
                actionBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (btn.classList.contains('regenerate')) {
                            showNotification('正在重新生成内容...', 'info');
                        } else if (btn.classList.contains('copy')) {
                            showNotification('内容已复制到剪贴板', 'success');
                        } else if (btn.classList.contains('download')) {
                            showNotification('图片已下载', 'success');
                        } else if (btn.classList.contains('insert')) {
                            showNotification('内容已插入到课件', 'success');
                            closeModal();
                        }
                    });
                });
                
            }, 2000);
        });
    }
}

/**
 * 处理标签切换，包括隐藏生成的题目列表
 */
function initTabSwitching() {
    // 标签按钮点击事件
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动标签
            tabBtns.forEach(tb => tb.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // 激活目标标签
            this.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
            
            // 隐藏生成的题目列表，除非是在 quiz 标签中
            const generatedQuestionsList = document.querySelector('.generated-questions-list');
            if (generatedQuestionsList) {
                if (targetTab === 'quiz') {
                    // 只有在生成过题目后才显示题目列表
                    const quizResult = document.querySelector('.quiz-result');
                    if (quizResult && window.getComputedStyle(quizResult).display !== 'none') {
                        generatedQuestionsList.style.display = 'block';
                    } else {
                        generatedQuestionsList.style.display = 'none';
                    }
                } else {
                    generatedQuestionsList.style.display = 'none';
                }
            }
        });
    });
}

/**
 * 初始化内容区域功能
 */
function initContentSections() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitles = document.querySelectorAll('.current-page-title');
    
    // 在页面加载时隐藏生成的题目列表
    const generatedQuestionsList = document.querySelector('.generated-questions-list');
    if (generatedQuestionsList) {
        generatedQuestionsList.style.display = 'none';
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 更新导航项目状态
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // 更新页面标题
            const sectionName = this.querySelector('.nav-text.zh').textContent;
            pageTitles.forEach(title => {
                if (title.classList.contains('zh')) {
                    title.textContent = sectionName;
                } else {
                    title.textContent = this.querySelector('.nav-text.en').textContent;
                }
            });
            
            // 更新内容部分
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('id') === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
            
            // 隐藏生成的题目列表（如果不在相关部分）
            if (generatedQuestionsList) {
                generatedQuestionsList.style.display = 'none';
            }
        });
    });
}

/**
 * 初始化课程思政功能
 */
function initIdeology() {
    // 思政案例生成按钮
    const ideologyGenerateBtn = document.querySelector('.ideology-generation .generate-btn');
    
    if (ideologyGenerateBtn) {
        ideologyGenerateBtn.addEventListener('click', function() {
            showNotification('正在生成思政案例...', 'info');
            
            // 模拟生成过程
            setTimeout(() => {
                // 获取表单内容
                const themeInput = document.querySelector('.ideology-generation .prompt-input.zh');
                const caseType = document.querySelector('.ideology-generation .ideology-select:first-of-type');
                const caseLength = document.querySelector('.ideology-generation .ideology-select:last-of-type');
                
                // 生成案例内容（这里是示例内容）
                let generatedCase = '';
                if (themeInput && themeInput.value) {
                    const theme = themeInput.value;
                    const type = caseType ? caseType.options[caseType.selectedIndex].text : '故事型案例';
                    const length = caseLength ? caseLength.options[caseLength.selectedIndex].text : '中等';
                    
                    generatedCase = `【${type}】关于"${theme}"的思政案例\n\n`;
                    generatedCase += `这是一个${length}的思政案例示例，主题围绕"${theme}"展开。\n\n`;
                    generatedCase += `在中华优秀传统文化的传承与创新中，"${theme}"始终是一个重要的思想内核。`;
                    generatedCase += `本案例通过具体的历史事件和现代案例，深入阐述了"${theme}"在当代中国发展中的重要意义。`;
                    generatedCase += `学生通过学习本案例，可以更好地理解中华文化的精髓，增强文化自信。`;
                } else {
                    generatedCase = '请先输入思政案例主题...';
                }
                
                // 更新结果区域
                const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
                if (caseTextarea) {
                    caseTextarea.value = generatedCase;
                }
                
                // 显示结果区域
                const ideologyResult = document.querySelector('.ideology-result');
                if (ideologyResult) {
                    ideologyResult.style.display = 'block';
                }
                
                showNotification('思政案例生成成功！', 'success');
            }, 1500);
        });
    }
    
    // 结果操作按钮
    const resultActionBtns = document.querySelectorAll('.ideology-result .result-action-btn');
    
    resultActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span.zh').textContent;
            const caseTextarea = document.querySelector('.ideology-result .case-content-textarea.zh');
            
            switch (action) {
                case '编辑':
                    if (caseTextarea) {
                        caseTextarea.readOnly = false;
                        caseTextarea.focus();
                        showNotification('您可以编辑思政案例内容', 'info');
                    }
                    break;
                    
                case '复制':
                    if (caseTextarea) {
                        caseTextarea.select();
                        document.execCommand('copy');
                        showNotification('案例内容已复制到剪贴板', 'success');
                    }
                    break;
                    
                case '重新生成':
                    showNotification('正在重新生成案例...', 'info');
                    document.querySelector('.ideology-generation .generate-btn').click();
                    break;
            }
        });
    });
}

// 新建思政案例功能
document.addEventListener('DOMContentLoaded', function() {
    const createCaseBtn = document.getElementById('createCaseBtn');
    const createCaseModal = document.getElementById('createCaseModal');
    const closeBtn = createCaseModal.querySelector('.close-btn');
    const cancelBtn = createCaseModal.querySelector('.btn-cancel');
    const saveBtn = document.getElementById('saveNewCaseBtn');
    
    // 打开模态框
    createCaseBtn.addEventListener('click', function() {
        createCaseModal.classList.add('active');
    });
    
    // 关闭模态框
    function closeModal() {
        createCaseModal.classList.remove('active');
        // 清空表单
        document.getElementById('caseTitleInput').value = '';
        document.getElementById('caseContentInput').value = '';
        // 重置复选框
        const checkboxes = document.querySelectorAll('input[name="resourceType"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 保存新案例
    saveBtn.addEventListener('click', function() {
        const title = document.getElementById('caseTitleInput').value.trim();
        const content = document.getElementById('caseContentInput').value.trim();
        const selectedResources = [];
        
        document.querySelectorAll('input[name="resourceType"]:checked').forEach(checkbox => {
            selectedResources.push(checkbox.value);
        });
        
        if (title === '') {
            alert('请输入案例标题');
            return;
        }
        
        if (content === '') {
            alert('请输入案例内容');
            return;
        }
        
        // 这里可以添加保存逻辑，如API调用或本地存储
        
        // 模拟添加到列表
        addNewCaseToList(title, selectedResources);
        
        // 关闭模态框
        closeModal();
    });
    
    // 添加新案例到列表
    function addNewCaseToList(title, resources) {
        const casesTable = document.querySelector('.cases-table tbody');
        const rowCount = casesTable.querySelectorAll('tr').length + 1;
        
        const newRow = document.createElement('tr');
        
        // 创建序号单元格
        const numCell = document.createElement('td');
        numCell.textContent = rowCount;
        
        // 创建标题单元格
        const titleCell = document.createElement('td');
        const zhTitle = document.createElement('p');
        zhTitle.className = 'zh';
        zhTitle.textContent = title;
        const enTitle = document.createElement('p');
        enTitle.className = 'en';
        enTitle.textContent = title; // 在实际应用中可能需要翻译
        titleCell.appendChild(zhTitle);
        titleCell.appendChild(enTitle);
        
        // 创建资源标签单元格
        const resourceCell = document.createElement('td');
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'resource-tags';
        
        resources.forEach(resource => {
            const tagSpan = document.createElement('span');
            tagSpan.className = `resource-tag ${resource}`;
            const icon = document.createElement('i');
            
            if (resource === 'image') {
                icon.className = 'fas fa-image';
            } else if (resource === 'video') {
                icon.className = 'fas fa-video';
            } else if (resource === 'link') {
                icon.className = 'fas fa-link';
            }
            
            tagSpan.appendChild(icon);
            tagsDiv.appendChild(tagSpan);
        });
        
        resourceCell.appendChild(tagsDiv);
        
        // 创建操作按钮单元格
        const actionCell = document.createElement('td');
        
        const viewBtn = document.createElement('button');
        viewBtn.className = 'case-action-btn view';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'case-action-btn edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'case-action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        actionCell.appendChild(viewBtn);
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        
        // 将所有单元格添加到行
        newRow.appendChild(numCell);
        newRow.appendChild(titleCell);
        newRow.appendChild(resourceCell);
        newRow.appendChild(actionCell);
        
        // 将行添加到表格
        casesTable.appendChild(newRow);
    }
}); 

// 全屏功能
function initFullscreenButton() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const editorContent = document.querySelector('.editor-content');
    
    if (fullscreenBtn && editorContent) {
        fullscreenBtn.addEventListener('click', function() {
            editorContent.classList.toggle('fullscreen');
            
            // 切换全屏按钮图标
            const icon = fullscreenBtn.querySelector('i');
            if (editorContent.classList.contains('fullscreen')) {
                icon.classList.remove('fa-expand');
                icon.classList.add('fa-compress');
            } else {
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
        
        // ESC键退出全屏
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && editorContent.classList.contains('fullscreen')) {
                editorContent.classList.remove('fullscreen');
                const icon = fullscreenBtn.querySelector('i');
                icon.classList.remove('fa-compress');
                icon.classList.add('fa-expand');
            }
        });
    }
}

// 在页面加载完成后初始化全屏按钮
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initFullscreenButton();
}); 

// 二维码弹窗功能
function initQrcodeModal() {
    // 更新选择器，确保准确找到签到二维码按钮
    const qrcodeBtn = document.querySelector('.panel-btn:not(.group-action-btn)');
    const qrcodeModal = document.getElementById('qrcodeModal');
    
    // 如果找不到相关元素，直接返回
    if (!qrcodeBtn || !qrcodeModal) {
        console.warn('签到二维码相关元素未找到');
        return;
    }
    
    const closeBtn = qrcodeModal.querySelector('.close-btn');
    const refreshBtn = qrcodeModal.querySelector('.refresh-btn');
    const downloadBtn = qrcodeModal.querySelector('.download-btn');
    
    // 确保二维码弹窗默认隐藏
    qrcodeModal.style.display = 'none';
    qrcodeModal.classList.remove('show');
    
    // 显示二维码弹窗
    qrcodeBtn.addEventListener('click', function() {
        qrcodeModal.style.display = 'flex';
        setTimeout(() => {
            qrcodeModal.classList.add('show');
        }, 10);
        generateQRCode();
        showNotification('二维码已生成，有效期5分钟', 'success');
    });
    
    // 关闭二维码弹窗
    closeBtn.addEventListener('click', function() {
        qrcodeModal.classList.remove('show');
        setTimeout(() => {
            qrcodeModal.style.display = 'none';
        }, 300);
    });
    
    // 点击弹窗外部关闭
    qrcodeModal.addEventListener('click', function(e) {
        if (e.target === qrcodeModal) {
            qrcodeModal.classList.remove('show');
            setTimeout(() => {
                qrcodeModal.style.display = 'none';
            }, 300);
        }
    });
    
    // 刷新二维码
    refreshBtn.addEventListener('click', function() {
        generateQRCode();
        showNotification('二维码已刷新，有效期重置为5分钟', 'info');
    });
    
    // 下载二维码
    downloadBtn.addEventListener('click', function() {
        // 获取二维码图片
        const qrImg = document.getElementById('checkinQRCode');
        
        // 创建一个临时链接
        const a = document.createElement('a');
        a.href = qrImg.src;
        a.download = '签到二维码.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('二维码已下载', 'success');
    });
}

// 模拟生成二维码的功能
function generateQRCode() {
    // 实际应用中，这里应该调用后端API生成真实的二维码
    // 此处仅做演示，随机更新二维码图片
    const qrImg = document.getElementById('checkinQRCode');
    const randomId = Math.floor(Math.random() * 1000);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=checkin_session_${randomId}`;
}

// 在文档加载完成后初始化二维码功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化其他功能...
    
    // 初始化二维码弹窗功能
    initQrcodeModal();
}); 

// 初始化替换课件模态框
function initReplaceCoursewareModal() {
    // 此功能已移除
}

// 一键生成幻灯片功能
function initOneClickGeneration() {
    const oneClickGenBtn = document.querySelector('.js-one-click-generate');
    const oneClickModal = document.getElementById('oneClickGenerateModal');
    
    if (!oneClickGenBtn || !oneClickModal) return;
    
    const closeBtn = oneClickModal.querySelector('.modal-close');
    const generateBtn = oneClickModal.querySelector('.js-generate-slides');
    const cancelBtn = oneClickModal.querySelector('.js-cancel');
    const topicInput = oneClickModal.querySelector('#slideTopic');
    const slideCountSelect = oneClickModal.querySelector('#slideCount');
    const styleSelect = oneClickModal.querySelector('#slideStyle');
    const resultArea = oneClickModal.querySelector('.generation-result');
    const loadingIndicator = oneClickModal.querySelector('.loading-indicator');
    
    // 打开模态框
    oneClickGenBtn.addEventListener('click', () => {
        oneClickModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭模态框的函数
    function closeModal() {
        oneClickModal.classList.remove('show');
        document.body.style.overflow = '';
        // 重置表单
        resultArea.innerHTML = '';
        resultArea.style.display = 'none';
        loadingIndicator.style.display = 'none';
    }
    
    // 关闭模态框的事件
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 生成幻灯片
    generateBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        const slideCount = slideCountSelect.value;
        const style = styleSelect.value;
        
        if (!topic) {
            alert('请输入课件主题');
            return;
        }
        
        // 显示加载指示器
        loadingIndicator.style.display = 'flex';
        resultArea.style.display = 'none';
        
        // 模拟生成过程
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            resultArea.style.display = 'block';
            
            // 生成幻灯片预览
            displayGeneratedSlides(topic, slideCount, style);
        }, 3000);
    });
    
    // 显示生成的幻灯片预览
    function displayGeneratedSlides(topic, count, style) {
        const slides = generateSlideStructure(topic, count, style);
        
        let slidesPreviewHTML = `
            <div class="generation-header">
                <h3>已生成 ${count} 张幻灯片</h3>
                <div class="result-actions">
                    <button class="action-btn js-regenerate"><i class="fa fa-refresh"></i> 重新生成</button>
                    <button class="action-btn primary js-import-slides"><i class="fa fa-download"></i> 导入课件</button>
                </div>
            </div>
            <div class="slides-preview">
        `;
        
        slides.forEach((slide, index) => {
            slidesPreviewHTML += `
                <div class="slide-preview-item">
                    <div class="slide-number">${index + 1}</div>
                    <div class="slide-content" style="background-color: ${style === 'modern' ? '#f5f5f5' : style === 'traditional' ? '#f8f4e8' : '#fff'}">
                        <h4>${slide.title}</h4>
                        <div class="slide-body">
                            ${slide.content}
                        </div>
                    </div>
                </div>
            `;
        });
        
        slidesPreviewHTML += `</div>`;
        resultArea.innerHTML = slidesPreviewHTML;
        
        // 添加事件监听器
        const regenerateBtn = resultArea.querySelector('.js-regenerate');
        const importBtn = resultArea.querySelector('.js-import-slides');
        
        regenerateBtn.addEventListener('click', () => {
            loadingIndicator.style.display = 'flex';
            resultArea.style.display = 'none';
            
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                resultArea.style.display = 'block';
                displayGeneratedSlides(topic, count, style);
            }, 2000);
        });
        
        importBtn.addEventListener('click', () => {
            // 导入幻灯片到编辑器
            importGeneratedSlides(slides, styleType);
            closeModal();
        });
    }
    
    // 生成幻灯片结构
    function generateSlideStructure(topic, count, style) {
        const slides = [];
        
        // 添加封面
        slides.push({
            title: topic,
            content: `<div class="cover-slide"><p class="presenter">讲师: 李明</p><p class="date">2023年10月</p></div>`
        });
        
        // 添加目录
        if (count >= 5) {
            slides.push({
                title: "目录",
                content: `<ul class="toc">
                    <li>引言</li>
                    <li>主要内容</li>
                    <li>实例分析</li>
                    <li>总结与展望</li>
                </ul>`
            });
        }
        
        // 根据不同主题生成不同内容
        const topics = {
            "中国传统文化": [
                { title: "中国传统文化概述", content: `<p>中国传统文化源远流长，包含哲学、宗教、文学、艺术、建筑等多个方面。</p><ul><li>儒家思想</li><li>道家思想</li><li>佛教文化</li></ul>` },
                { title: "传统艺术", content: `<div class="two-column"><div><p>中国传统艺术形式多样：</p><ul><li>书法</li><li>绘画</li><li>戏曲</li></ul></div><div class="image-placeholder"></div></div>` },
                { title: "传统节日", content: `<table class="simple-table"><tr><th>节日</th><th>时间</th><th>习俗</th></tr><tr><td>春节</td><td>农历正月初一</td><td>贴春联、放鞭炮</td></tr><tr><td>端午节</td><td>农历五月初五</td><td>赛龙舟、吃粽子</td></tr></table>` },
                { title: "传统美德", content: `<p>中华民族传统美德:</p><div class="center-content"><div class="virtue">仁爱</div><div class="virtue">诚信</div><div class="virtue">礼义</div><div class="virtue">孝道</div></div>` }
            ],
            "人工智能基础": [
                { title: "什么是人工智能", content: `<p>人工智能(AI)是计算机科学的一个分支，致力于创造能够模拟人类智能的系统。</p><div class="image-placeholder"></div>` },
                { title: "机器学习基础", content: `<div class="two-column"><div><p>机器学习类型：</p><ul><li>监督学习</li><li>无监督学习</li><li>强化学习</li></ul></div><div class="image-placeholder"></div></div>` },
                { title: "神经网络结构", content: `<div class="center-content"><div class="image-placeholder"></div><p>神经网络由输入层、隐藏层和输出层组成</p></div>` },
                { title: "AI应用场景", content: `<table class="simple-table"><tr><th>领域</th><th>应用</th></tr><tr><td>医疗</td><td>疾病诊断、药物研发</td></tr><tr><td>金融</td><td>风险评估、算法交易</td></tr><tr><td>教育</td><td>个性化学习、智能评估</td></tr></table>` }
            ]
        };
        
        // 获取最接近的主题
        let bestMatch = "中国传统文化";
        if (topic.includes("智能") || topic.includes("AI") || topic.includes("机器学习")) {
            bestMatch = "人工智能基础";
        }
        
        // 添加主题相关幻灯片
        const relevantSlides = topics[bestMatch];
        const slidesToAdd = Math.min(relevantSlides.length, count - slides.length - 1); // 减去封面和结尾
        
        for (let i = 0; i < slidesToAdd; i++) {
            slides.push(relevantSlides[i]);
        }
        
        // 如果还需要更多幻灯片，添加占位符
        while (slides.length < count - 1) {
            slides.push({
                title: `${topic} - 补充内容 ${slides.length - 1}`,
                content: `<div class="placeholder-content"><p>这里是关于${topic}的补充内容</p><div class="image-placeholder"></div></div>`
            });
        }
        
        // 添加结尾幻灯片
        slides.push({
            title: "谢谢观看",
            content: `<div class="thank-you-slide"><p>感谢您的关注！</p><p>有任何问题请随时提问</p></div>`
        });
        
        return slides;
    }
    
    // 导入生成的幻灯片到编辑器
    function importGeneratedSlides(slides, styleType) {
        const thumbnailContainer = document.querySelector('.slide-thumbnails');
        const editorArea = document.querySelector('.slide-editor');
        
        if (!thumbnailContainer || !editorArea) return;
        
        // 清空现有幻灯片
        thumbnailContainer.innerHTML = '';
        
        // 添加新幻灯片
        slides.forEach((slide, index) => {
            // 创建缩略图
            const thumbnail = document.createElement('div');
            thumbnail.className = 'slide-thumbnail';
            thumbnail.setAttribute('data-slide-id', index);
            if (index === 0) thumbnail.classList.add('active');
            
            thumbnail.innerHTML = `
                <div class="thumbnail-number">${index + 1}</div>
                <div class="thumbnail-preview" style="background-color: ${styleType === 'modern' ? '#f5f5f5' : styleType === 'traditional' ? '#f8f4e8' : '#fff'}">
                    <div class="thumbnail-title">${slide.title}</div>
                </div>
            `;
            
            thumbnailContainer.appendChild(thumbnail);
            
            // 添加点击事件
            thumbnail.addEventListener('click', function() {
                document.querySelectorAll('.slide-thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                updateEditorContent(slide, index, styleType);
            });
        });
        
        // 更新编辑区域为第一张幻灯片
        updateEditorContent(slides[0], 0, styleType);
        
        // 显示成功消息
        showNotification('幻灯片已成功导入');
    }
    
    // 更新编辑区域内容
    function updateEditorContent(slide, index, styleType) {
        const editorArea = document.querySelector('.slide-editor');
        if (!editorArea) return;
        
        const slideContent = document.createElement('div');
        slideContent.className = 'slide-content-editor';
        slideContent.style.backgroundColor = styleType === 'modern' ? '#f5f5f5' : styleType === 'traditional' ? '#f8f4e8' : '#fff';
        
        slideContent.innerHTML = `
            <h2 class="slide-title-editor" contenteditable="true">${slide.title}</h2>
            <div class="slide-body-editor" contenteditable="true">
                ${slide.content}
            </div>
        `;
        
        editorArea.innerHTML = '';
        editorArea.appendChild(slideContent);
    }
    
    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 2000);
        }, 100);
    }
}

/**
 * 初始化课堂小测题目导航功能
 */
function initQuizNavigation() {
    // 模拟的题目数据，实际应从服务端获取
    const quizQuestions = [
        {
            number: 1,
            type: '单选题',
            typeEn: 'Single Choice',
            text: '下列哪个元素不属于中国园林的基本要素？',
            options: [
                { label: 'A', text: '假山' },
                { label: 'B', text: '水体' },
                { label: 'C', text: '植物' },
                { label: 'D', text: '喷泉' }
            ],
            answer: 'D',
            explanation: '喷泉是西方园林常见的景观元素，中国传统园林则讲究自然山水的模拟与再现，主要以假山、水体、植物和建筑为基本要素，形成"虽由人作，宛自天开"的艺术效果。'
        },
        {
            number: 2,
            type: '多选题',
            typeEn: 'Multiple Choice',
            text: '中国古典园林的设计理念包括以下哪些？',
            options: [
                { label: 'A', text: '虽由人作，宛自天开' },
                { label: 'B', text: '藏露结合' },
                { label: 'C', text: '几何对称布局' },
                { label: 'D', text: '移步换景' }
            ],
            answer: 'ABD',
            explanation: '中国古典园林讲究自然山水的模拟与再现，主要设计理念包括"虽由人作，宛自天开"、"藏露结合"、"移步换景"等，而几何对称布局则是西式园林的特点。'
        },
        {
            number: 3,
            type: '单选题',
            typeEn: 'Single Choice',
            text: '下列哪个园林不位于苏州？',
            options: [
                { label: 'A', text: '拙政园' },
                { label: 'B', text: '留园' },
                { label: 'C', text: '圆明园' },
                { label: 'D', text: '网师园' }
            ],
            answer: 'C',
            explanation: '圆明园位于北京，是清代著名的皇家园林。而拙政园、留园和网师园都位于苏州，是著名的江南私家园林代表作。'
        },
        {
            number: 4,
            type: '简答题',
            typeEn: 'Short Answer',
            text: '简述中国园林与西方园林的主要区别。',
            answer: '中西方园林的主要区别体现在：\n1. 布局方式：中国园林强调自然曲线和不规则布局，西方园林多采用几何对称布局\n2. 设计理念：中国园林讲究"虽由人作，宛自天开"，西方园林则展示人对自然的控制与改造\n3. 游览方式：中国园林采用"移步换景"的游览方式，西方园林则强调整体观赏\n4. 景观元素：中国园林多用山水、植物等自然元素，西方园林则常用喷泉、雕塑等人工景观',
            explanation: '中西方园林的区别反映了不同文化背景下人与自然关系的处理方式。中国园林受道家"天人合一"思想影响，强调与自然和谐共处；西方园林则更多体现人对自然的驾驭和改造。'
        },
        {
            number: 5,
            type: '讨论题',
            typeEn: 'Discussion',
            text: '中国古典园林的"借景"手法在现代景观设计中有何应用价值？',
            answer: '无标准答案',
            explanation: '借景是中国古典园林的重要手法，通过"框景"、"漏景"等方式将远景纳入园林视野，扩展空间感，增加景观层次。在现代景观设计中，借景理念有助于突破场地局限，增强空间的开放性和连续性，创造更具深度和趣味性的景观体验。此外，借景手法的应用也有助于促进城市空间的整体协调和资源共享。'
        }
    ];
    
    let currentQuestionIndex = 0;
    
    // 获取相关DOM元素
    const prevBtn = document.querySelector('.prev-question-btn');
    const nextBtn = document.querySelector('.next-question-btn');
    const currentQuestionSpan = document.querySelector('.current-question');
    const totalQuestionsSpan = document.querySelector('.total-questions');
    const dotContainer = document.querySelector('.quiz-nav-dots');
    const dots = document.querySelectorAll('.quiz-dot');
    
    if (!prevBtn || !nextBtn || !currentQuestionSpan || !totalQuestionsSpan || !dotContainer) return;
    
    // 初始化题目总数
    totalQuestionsSpan.textContent = quizQuestions.length;
    
    // 上一题按钮点击事件
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestionDisplay();
        }
    });
    
    // 下一题按钮点击事件
    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            updateQuestionDisplay();
        }
    });
    
    // 点击导航点切换题目
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentQuestionIndex = index;
            updateQuestionDisplay();
        });
    });
    
    // 更新题目显示
    function updateQuestionDisplay() {
        // 更新当前题目计数
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        
        // 更新导航点状态
        dots.forEach((dot, index) => {
            if (index === currentQuestionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 更新按钮状态
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === quizQuestions.length - 1;
        
        // 获取当前题目数据
        const currentQuestion = quizQuestions[currentQuestionIndex];
        
        // 更新题目内容
        const questionItem = document.querySelector('.question-item');
        if (questionItem) {
            // 更新题号和类型
            const questionNumber = questionItem.querySelector('.question-number');
            const questionTypeZh = questionItem.querySelector('.question-type.zh');
            const questionTypeEn = questionItem.querySelector('.question-type.en');
            
            if (questionNumber) questionNumber.textContent = `Q${currentQuestion.number}`;
            if (questionTypeZh) questionTypeZh.textContent = currentQuestion.type;
            if (questionTypeEn) questionTypeEn.textContent = currentQuestion.typeEn;
            
            // 更新题目文本
            const questionText = questionItem.querySelector('.question-text');
            if (questionText) questionText.textContent = currentQuestion.text;
            
            // 更新选项（如果有）
            const optionsContainer = questionItem.querySelector('.question-options');
            if (optionsContainer) {
                // 清空现有选项
                optionsContainer.innerHTML = '';
                
                // 仅对单选和多选题显示选项
                if (currentQuestion.type === '单选题' || currentQuestion.type === '多选题') {
                    optionsContainer.style.display = 'block';
                    
                    // 添加新选项
                    currentQuestion.options.forEach(option => {
                        const optionDiv = document.createElement('div');
                        optionDiv.className = 'option';
                        
                        const labelSpan = document.createElement('span');
                        labelSpan.className = 'option-label';
                        labelSpan.textContent = option.label + '.';
                        
                        const textSpan = document.createElement('span');
                        textSpan.textContent = option.text;
                        
                        optionDiv.appendChild(labelSpan);
                        optionDiv.appendChild(textSpan);
                        optionsContainer.appendChild(optionDiv);
                    });
                } else {
                    optionsContainer.style.display = 'none';
                }
            }
            
            // 更新答案和解析
            const answerContainer = questionItem.querySelector('.answer-container');
            if (answerContainer) {
                const answerContent = answerContainer.querySelector('.answer-content');
                const explanationText = answerContainer.querySelector('.question-explanation p');
                
                if (answerContent) answerContent.textContent = currentQuestion.answer;
                if (explanationText) explanationText.textContent = currentQuestion.explanation;
                
                // 重置显示状态
                answerContainer.style.display = 'none';
                const showAnswerBtn = questionItem.querySelector('.show-answer-btn');
                if (showAnswerBtn) {
                    showAnswerBtn.innerHTML = '<i class="fas fa-eye"></i><span class="zh">显示答案</span><span class="en">Show Answer</span>';
                }
            }
        }
    }
    
    // 初始化第一题的显示
    updateQuestionDisplay();
}

// 在页面加载完成后初始化题目导航
document.addEventListener('DOMContentLoaded', function() {
    // 执行其他初始化函数...
    
    // 初始化题目导航
    initQuizNavigation();
});

// 初始化课程思政多媒体标签页和案例/讨论题切换功能
function initIdeologyMediaTabs() {
    // 监听互动弹窗显示事件
    const interactionModal = document.getElementById('interaction-modal');
    if (interactionModal) {
        interactionModal.addEventListener('click', function(e) {
            // 检查是否点击了某个全屏工具
            if (e.target.closest('.fullscreen-tool[data-interaction="ideology"]')) {
                // 初始化多媒体标签页
                initMediaTabs();
                // 初始化案例和讨论题切换功能
                initCaseNavigation();
                initDiscussionNavigation();
            }
        });
    }
    
    // 查找课程思政部分的元素
    const ideologySection = document.getElementById('ideology-interaction');
    if (ideologySection) {
        // 在该部分显示时初始化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style' &&
                    ideologySection.style.display !== 'none') {
                    // 初始化多媒体标签页
                    initMediaTabs();
                    // 初始化案例和讨论题切换功能
                    initCaseNavigation();
                    initDiscussionNavigation();
                }
            });
        });
        
        observer.observe(ideologySection, { attributes: true });
    }
}

// 初始化多媒体标签页切换功能
function initMediaTabs() {
    const mediaTabs = document.querySelectorAll('.media-tab');
    const mediaContents = document.querySelectorAll('.media-content');
    
    mediaTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签页的激活状态
            mediaTabs.forEach(t => t.classList.remove('active'));
            // 激活当前点击的标签页
            this.classList.add('active');
            
            // 获取要显示的媒体类型
            const mediaType = this.getAttribute('data-media');
            // 隐藏所有内容
            mediaContents.forEach(content => content.classList.remove('active'));
            // 显示对应内容
            document.getElementById(`${mediaType}-content`).classList.add('active');
        });
    });
}

// 初始化案例切换功能
function initCaseNavigation() {
    const prevCaseBtn = document.querySelector('.prev-case');
    const nextCaseBtn = document.querySelector('.next-case');
    const currentCaseElem = document.querySelector('.current-case');
    const totalCasesElem = document.querySelector('.total-cases');
    
    // 模拟案例数据
    const totalCases = 3;
    let currentCase = 1;
    
    // 更新显示
    function updateCaseDisplay() {
        if (currentCaseElem) currentCaseElem.textContent = currentCase;
        if (totalCasesElem) totalCasesElem.textContent = totalCases;
        
        // 禁用/启用按钮
        if (prevCaseBtn) prevCaseBtn.disabled = currentCase <= 1;
        if (nextCaseBtn) nextCaseBtn.disabled = currentCase >= totalCases;
    }
    
    // 初始更新
    updateCaseDisplay();
    
    // 绑定事件
    if (prevCaseBtn) {
        prevCaseBtn.addEventListener('click', function() {
            if (currentCase > 1) {
                currentCase--;
                updateCaseDisplay();
                // 这里应该添加实际的案例内容切换逻辑
                showNotification('加载上一个案例...', 'info');
            }
        });
    }
    
    if (nextCaseBtn) {
        nextCaseBtn.addEventListener('click', function() {
            if (currentCase < totalCases) {
                currentCase++;
                updateCaseDisplay();
                // 这里应该添加实际的案例内容切换逻辑
                showNotification('加载下一个案例...', 'info');
            }
        });
    }
}

// 初始化讨论题切换功能
function initDiscussionNavigation() {
    const prevDiscussionBtn = document.querySelector('.prev-discussion');
    const nextDiscussionBtn = document.querySelector('.next-discussion');
    const currentDiscussionElem = document.querySelector('.current-discussion');
    const totalDiscussionsElem = document.querySelector('.total-discussions');
    
    // 模拟讨论题数据
    const totalDiscussions = 3;
    let currentDiscussion = 1;
    
    // 更新显示
    function updateDiscussionDisplay() {
        if (currentDiscussionElem) currentDiscussionElem.textContent = currentDiscussion;
        if (totalDiscussionsElem) totalDiscussionsElem.textContent = totalDiscussions;
        
        // 禁用/启用按钮
        if (prevDiscussionBtn) prevDiscussionBtn.disabled = currentDiscussion <= 1;
        if (nextDiscussionBtn) nextDiscussionBtn.disabled = currentDiscussion >= totalDiscussions;
    }
    
    // 初始更新
    updateDiscussionDisplay();
    
    // 绑定事件
    if (prevDiscussionBtn) {
        prevDiscussionBtn.addEventListener('click', function() {
            if (currentDiscussion > 1) {
                currentDiscussion--;
                updateDiscussionDisplay();
                // 这里应该添加实际的讨论题内容切换逻辑
                showNotification('加载上一个讨论题...', 'info');
            }
        });
    }
    
    if (nextDiscussionBtn) {
        nextDiscussionBtn.addEventListener('click', function() {
            if (currentDiscussion < totalDiscussions) {
                currentDiscussion++;
                updateDiscussionDisplay();
                // 这里应该添加实际的讨论题内容切换逻辑
                showNotification('加载下一个讨论题...', 'info');
            }
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化课程思政多媒体标签页和导航功能
    initIdeologyMediaTabs();
});

/**
 * 初始化课堂班级选择下拉框
 */
function initClassSelection() {
    const classSelect = document.getElementById('class-select');
    if (!classSelect) return;
    
    // 当切换语言模式时更新下拉框显示选项
    document.body.addEventListener('langchange', function() {
        const isEnglish = document.body.classList.contains('en-mode');
        Array.from(classSelect.options).forEach(option => {
            if (isEnglish) {
                if (option.classList.contains('en')) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            } else {
                if (option.classList.contains('zh')) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            }
        });
    });
    
    // 处理班级切换事件
    classSelect.addEventListener('change', function() {
        const classId = this.value;
        console.log('班级已切换为ID:', classId);
        
        // 这里可以添加更新班级相关数据的代码
        // 例如更新签到状态、学生名单等
        updateClassData(classId);
    });
}

/**
 * 更新班级相关数据
 * @param {string} classId - 班级ID
 */
function updateClassData(classId) {
    // 模拟不同班级的签到数据
    const mockData = {
        '1': { total: 86, checkedIn: 78, absent: 8, rate: '91%' },
        '2': { total: 92, checkedIn: 85, absent: 7, rate: '92%' },
        '3': { total: 68, checkedIn: 60, absent: 8, rate: '88%' },
        '4': { total: 55, checkedIn: 52, absent: 3, rate: '95%' }
    };
    
    // 获取当前选中的班级数据
    const data = mockData[classId] || mockData['1'];
    
    // 更新签到统计数据
    const statBoxes = document.querySelectorAll('.check-in-stats .stat-box .stat-value');
    if (statBoxes.length >= 4) {
        statBoxes[0].textContent = data.total;
        statBoxes[1].textContent = data.checkedIn;
        statBoxes[2].textContent = data.absent;
        statBoxes[3].textContent = data.rate;
    }
    
    // 这里可以添加更多班级数据更新逻辑
}

// 初始化课后总结功能
function initPostClass() {
    // 获取标签页按钮和内容区域
    const tabBtns = document.querySelectorAll('.post-class-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.post-class-tabs .tab-content');
    
    // 默认激活第一个标签页（课程小结）
    if(tabBtns.length > 0 && tabContents.length > 0) {
        // 移除所有激活状态
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // 激活第一个标签页（课程小结）
        tabBtns[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
    
    // 绑定标签页点击事件
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取目标标签页
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有激活状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 激活当前点击的标签页
            this.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 执行其他初始化函数...
    
    // 初始化课后总结部分
    initPostClass();
});

/**
 * 初始化知识图谱交互功能
 * 实现节点点击、拖拽、缩放等交互效果
 */
function initKnowledgeGraph() {
    // 获取DOM元素
    const graphDisplay = document.getElementById('graphDisplay');
    const nodeDetailPanel = document.querySelector('.node-detail-panel');
    const closeDetailBtn = document.querySelector('.close-detail-btn');
    const graphControlBtns = document.querySelectorAll('.graph-control-btn');
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const filterOptions = document.querySelectorAll('.filter-option input');
    const strengthSlider = document.getElementById('strengthSlider');
    
    // 如果页面上没有图谱，直接返回
    if (!graphDisplay) return;
    
    // 获取图谱中的所有节点和连接线
    const nodes = document.querySelectorAll('.knowledge-graph-svg .node');
    const links = document.querySelectorAll('.knowledge-graph-svg .link');
    
    // 中键拖动相关变量
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let svgElement = document.querySelector('.knowledge-graph-svg');
    let svgViewBox = svgElement ? svgElement.viewBox.baseVal : null;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    
    // 节点点击事件 - 显示详情面板
    nodes.forEach(node => {
        // 单击事件 - 高亮节点及相关连接
        node.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 移除其他节点的选中状态
            document.querySelectorAll('.node.selected').forEach(n => {
                if (n !== this) n.classList.remove('selected');
            });
            
            // 为当前节点添加选中状态
            this.classList.toggle('selected');
            
            // 高亮与该节点连接的线
            highlightConnectedLinks(this);
            
            // 不在单击时显示侧边详情面板，而是等待双击事件
            if (this.classList.contains('selected')) {
                // 只高亮连接线，不显示侧边详情
                console.log('节点已选中:', this.querySelector('text').textContent);
            } else {
                nodeDetailPanel.classList.remove('active');
            }
        });
        
        // 添加双击事件 - 显示详情弹窗
        node.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // 获取节点信息
            const nodeName = this.querySelector('text').textContent;
            const nodeType = Array.from(this.classList)
                .find(cls => ['concept', 'courseware', 'quiz', 'resource', 'keyword'].includes(cls)) || 'concept';
            
            // 显示详情弹窗
            showNodeDetailModal(nodeName, nodeType, this);
        });
        
        // 添加右键菜单事件 - 添加子节点
        node.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 显示添加子节点的菜单
            showAddChildNodeMenu(e, this);
        });
        
        // 鼠标悬停效果
        node.addEventListener('mouseenter', function() {
            links.forEach(link => {
                // 判断链接是否与当前节点相连
                if (isLinkConnectedToNode(link, this)) {
                    link.classList.add('highlighted');
                }
            });
        });
        
        node.addEventListener('mouseleave', function() {
            links.forEach(link => {
                // 如果没有节点被选中，则移除高亮效果
                if (!document.querySelector('.node.selected')) {
                    link.classList.remove('highlighted');
                }
            });
        });
    });
    
    // 设置中键拖动功能
    if (svgElement) {
        // 鼠标按下事件
        svgElement.addEventListener('mousedown', function(e) {
            // 检查是否为中键 (button 1)
            if (e.button === 1) {
                e.preventDefault();
                isDragging = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                svgElement.style.cursor = 'grabbing';
            }
        });
        
        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const dx = e.clientX - dragStartX;
                const dy = e.clientY - dragStartY;
                
                // 更新拖动起点为当前位置
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                
                // 更新当前平移值
                currentTranslateX += dx;
                currentTranslateY += dy;
                
                // 应用变换
                const svgNodes = document.querySelectorAll('.knowledge-graph-svg .node');
                svgNodes.forEach(node => {
                    const transform = node.getAttribute('transform');
                    const translatePattern = /translate\(([^,]+),([^)]+)\)/;
                    const match = transform.match(translatePattern);
                    
                    if (match) {
                        const x = parseFloat(match[1]);
                        const y = parseFloat(match[2]);
                        node.setAttribute('transform', `translate(${x + dx},${y + dy})`);
                    }
                });
                
                // 更新连接线
                const svgLinks = document.querySelectorAll('.knowledge-graph-svg .link');
                svgLinks.forEach(link => {
                    const x1 = parseFloat(link.getAttribute('x1'));
                    const y1 = parseFloat(link.getAttribute('y1'));
                    const x2 = parseFloat(link.getAttribute('x2'));
                    const y2 = parseFloat(link.getAttribute('y2'));
                    
                    link.setAttribute('x1', x1 + dx);
                    link.setAttribute('y1', y1 + dy);
                    link.setAttribute('x2', x2 + dx);
                    link.setAttribute('y2', y2 + dy);
                });
            }
        });
        
        // 鼠标松开事件
        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                isDragging = false;
                svgElement.style.cursor = 'default';
            }
        });
        
        // 阻止默认的中键滚动行为
        svgElement.addEventListener('auxclick', function(e) {
            if (e.button === 1) {
                e.preventDefault();
            }
        });
    }
    
    /**
     * 显示添加子节点菜单
     * @param {Event} event - 鼠标事件
     * @param {Element} parentNode - 父节点元素
     */
    function showAddChildNodeMenu(event, parentNode) {
        // 移除现有菜单
        const existingMenu = document.querySelector('.node-context-menu');
        if (existingMenu) {
            document.body.removeChild(existingMenu);
        }
        
        // 创建右键菜单
        const menuElement = document.createElement('div');
        menuElement.className = 'node-context-menu';
        
        // 设置菜单样式
        menuElement.style.position = 'fixed';
        menuElement.style.left = `${event.clientX}px`;
        menuElement.style.top = `${event.clientY}px`;
        menuElement.style.backgroundColor = 'white';
        menuElement.style.border = '1px solid #ccc';
        menuElement.style.borderRadius = '4px';
        menuElement.style.padding = '5px 0';
        menuElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        menuElement.style.zIndex = '1000';
        
        // 设置菜单内容
        menuElement.innerHTML = `
            <div class="menu-item" data-type="concept">
                <i class="fas fa-lightbulb"></i> 添加概念节点
            </div>
            <div class="menu-item" data-type="courseware">
                <i class="fas fa-book-open"></i> 添加课件节点
            </div>
            <div class="menu-item" data-type="quiz">
                <i class="fas fa-question-circle"></i> 添加习题节点
            </div>
            <div class="menu-item" data-type="resource">
                <i class="fas fa-file-alt"></i> 添加资源节点
            </div>
            <div class="menu-item" data-type="keyword">
                <i class="fas fa-tag"></i> 添加关键词节点
            </div>
        `;
        
        // 设置菜单项样式
        const menuItems = menuElement.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.style.padding = '8px 15px';
            item.style.cursor = 'pointer';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.fontSize = '14px';
            
            // 图标样式
            const icon = item.querySelector('i');
            if (icon) {
                icon.style.marginRight = '8px';
                icon.style.width = '16px';
                icon.style.textAlign = 'center';
            }
            
            // 悬停效果
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f0f0f0';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            // 点击事件
            item.addEventListener('click', function() {
                const nodeType = this.getAttribute('data-type');
                addChildNode(parentNode, nodeType);
                document.body.removeChild(menuElement);
            });
        });
        
        // 添加菜单到页面
        document.body.appendChild(menuElement);
        
        // 点击其他区域关闭菜单
        document.addEventListener('click', function closeMenu(e) {
            if (!menuElement.contains(e.target)) {
                if (document.body.contains(menuElement)) {
                    document.body.removeChild(menuElement);
                }
                document.removeEventListener('click', closeMenu);
            }
        });
    }
    
    /**
     * 添加子节点
     * @param {Element} parentNode - 父节点元素
     * @param {string} nodeType - 节点类型
     */
    function addChildNode(parentNode, nodeType) {
        // 获取父节点位置
        const parentTransform = parentNode.getAttribute('transform');
        const parentX = parseFloat(parentTransform.split('translate(')[1].split(',')[0]);
        const parentY = parseFloat(parentTransform.split(',')[1].split(')')[0]);
        
        // 计算子节点位置 (偏移量)
        const angle = Math.random() * Math.PI * 2; // 随机角度
        const distance = 100 + Math.random() * 50; // 随机距离
        const childX = parentX + Math.cos(angle) * distance;
        const childY = parentY + Math.sin(angle) * distance;
        
        // 确定节点视觉属性
        let circleRadius = 25;
        let fillColor = '#2196f3';  // 默认蓝色
        let nodeIcon = 'fa-lightbulb';
        
        switch(nodeType) {
            case 'concept':
                circleRadius = 30;
                fillColor = '#e91e63';  // 粉色
                nodeIcon = 'fa-lightbulb';
                break;
            case 'courseware':
                fillColor = '#2196f3';  // 蓝色
                nodeIcon = 'fa-book-open';
                break;
            case 'quiz':
                fillColor = '#4caf50';  // 绿色
                nodeIcon = 'fa-question-circle';
                break;
            case 'resource':
                fillColor = '#9c27b0';  // 紫色
                nodeIcon = 'fa-file-alt';
                break;
            case 'keyword':
                circleRadius = 20;
                fillColor = '#ff9800';  // 橙色
                nodeIcon = 'fa-tag';
                break;
        }
        
        // 创建新节点输入弹窗
        const dialogElement = document.createElement('div');
        dialogElement.className = 'node-input-dialog';
        dialogElement.style.position = 'fixed';
        dialogElement.style.left = '50%';
        dialogElement.style.top = '50%';
        dialogElement.style.transform = 'translate(-50%, -50%)';
        dialogElement.style.backgroundColor = 'white';
        dialogElement.style.borderRadius = '8px';
        dialogElement.style.padding = '20px';
        dialogElement.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        dialogElement.style.zIndex = '1001';
        dialogElement.style.width = '400px';
        dialogElement.style.maxWidth = '90vw';
        
        // 设置弹窗内容
        dialogElement.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">添加${getNodeTypeName(nodeType)}节点</h3>
            <div style="margin-bottom: 15px;">
                <label for="nodeNameZh" style="display: block; margin-bottom: 5px; font-weight: 500;">中文名称</label>
                <input type="text" id="nodeNameZh" class="node-name-input" placeholder="输入节点中文名称" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
            </div>
            <div style="margin-bottom: 20px;">
                <label for="nodeNameEn" style="display: block; margin-bottom: 5px; font-weight: 500;">英文名称</label>
                <input type="text" id="nodeNameEn" class="node-name-input" placeholder="Input node English name" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
            </div>
            <div style="text-align: right;">
                <button id="cancelAddNode" style="padding: 8px 15px; background: none; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px; cursor: pointer;">取消</button>
                <button id="confirmAddNode" style="padding: 8px 15px; background-color: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">确认添加</button>
            </div>
        `;
        
        // 添加弹窗到页面
        document.body.appendChild(dialogElement);
        
        // 取消按钮事件
        dialogElement.querySelector('#cancelAddNode').addEventListener('click', function() {
            document.body.removeChild(dialogElement);
        });
        
        // 确认按钮事件
        dialogElement.querySelector('#confirmAddNode').addEventListener('click', function() {
            const nameZh = dialogElement.querySelector('#nodeNameZh').value.trim();
            const nameEn = dialogElement.querySelector('#nodeNameEn').value.trim();
            
            if (nameZh === '' && nameEn === '') {
                alert('请至少输入一种语言的节点名称');
                return;
            }
            
            // 创建新节点
            createNewNode(nodeType, childX, childY, circleRadius, fillColor, nameZh, nameEn);
            
            // 创建连接线
            createNewLink(parentX, parentY, childX, childY, 'medium');
            
            // 关闭弹窗
            document.body.removeChild(dialogElement);
            
            // 显示成功提示
            showNotification('已添加新节点', 'success');
        });
        
        // 聚焦到第一个输入框
        setTimeout(() => {
            dialogElement.querySelector('#nodeNameZh').focus();
        }, 100);
    }
    
    /**
     * 获取节点类型名称
     * @param {string} nodeType - 节点类型代码
     * @returns {string} - 节点类型名称
     */
    function getNodeTypeName(nodeType) {
        switch(nodeType) {
            case 'concept': return '概念';
            case 'courseware': return '课件';
            case 'quiz': return '习题';
            case 'resource': return '资源';
            case 'keyword': return '关键词';
            default: return '未知类型';
        }
    }
    
    /**
     * 创建新节点
     * @param {string} nodeType - 节点类型
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} radius - 圆形半径
     * @param {string} fillColor - 填充颜色
     * @param {string} nameZh - 中文名称
     * @param {string} nameEn - 英文名称
     */
    function createNewNode(nodeType, x, y, radius, fillColor, nameZh, nameEn) {
        const svgElement = document.querySelector('.knowledge-graph-svg');
        const nodesGroup = svgElement.querySelector('.nodes') || svgElement;
        
        // 创建新的节点组
        const newNodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        newNodeGroup.classList.add('node', nodeType);
        newNodeGroup.setAttribute('transform', `translate(${x},${y})`);
        
        // 创建圆形
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', fillColor);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        
        // 创建中文文本
        const textZh = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textZh.setAttribute('fill', '#fff');
        textZh.setAttribute('text-anchor', 'middle');
        textZh.setAttribute('dy', '.3em');
        textZh.setAttribute('font-size', radius > 25 ? '12' : '10');
        textZh.classList.add('zh');
        textZh.textContent = nameZh;
        
        // 创建英文文本
        const textEn = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEn.setAttribute('fill', '#fff');
        textEn.setAttribute('text-anchor', 'middle');
        textEn.setAttribute('dy', '.3em');
        textEn.setAttribute('font-size', radius > 25 ? '12' : '10');
        textEn.classList.add('en');
        textEn.textContent = nameEn;
        
        // 添加元素到组
        newNodeGroup.appendChild(circle);
        newNodeGroup.appendChild(textZh);
        newNodeGroup.appendChild(textEn);
        
        // 添加到SVG
        nodesGroup.appendChild(newNodeGroup);
        
        // 添加事件监听
        addNodeEventListeners(newNodeGroup);
    }
    
    /**
     * 为新节点添加事件监听器
     * @param {Element} node - 节点元素
     */
    function addNodeEventListeners(node) {
        // 单击事件
        node.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 移除其他节点的选中状态
            document.querySelectorAll('.node.selected').forEach(n => {
                if (n !== this) n.classList.remove('selected');
            });
            
            // 为当前节点添加选中状态
            this.classList.toggle('selected');
            
            // 高亮与该节点连接的线
            highlightConnectedLinks(this);
            
            // 不在单击时显示侧边详情面板
            if (this.classList.contains('selected')) {
                console.log('节点已选中:', this.querySelector('text').textContent);
            } else {
                nodeDetailPanel.classList.remove('active');
            }
        });
        
        // 双击事件
        node.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // 获取节点信息
            const nodeName = this.querySelector('text').textContent;
            const nodeType = Array.from(this.classList)
                .find(cls => ['concept', 'courseware', 'quiz', 'resource', 'keyword'].includes(cls)) || 'concept';
            
            // 显示详情弹窗
            showNodeDetailModal(nodeName, nodeType, this);
        });
        
        // 右键菜单事件
        node.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 显示添加子节点的菜单
            showAddChildNodeMenu(e, this);
        });
        
        // 悬停事件
        node.addEventListener('mouseenter', function() {
            const links = document.querySelectorAll('.knowledge-graph-svg .link');
            links.forEach(link => {
                if (isLinkConnectedToNode(link, this)) {
                    link.classList.add('highlighted');
                }
            });
        });
        
        node.addEventListener('mouseleave', function() {
            const links = document.querySelectorAll('.knowledge-graph-svg .link');
            links.forEach(link => {
                if (!document.querySelector('.node.selected')) {
                    link.classList.remove('highlighted');
                }
            });
        });
    }
    
    /**
     * 创建新连接线
     * @param {number} x1 - 起始点X坐标
     * @param {number} y1 - 起始点Y坐标
     * @param {number} x2 - 结束点X坐标
     * @param {number} y2 - 结束点Y坐标
     * @param {string} strength - 连接强度 (strong, medium, weak)
     */
    function createNewLink(x1, y1, x2, y2, strength) {
        const svgElement = document.querySelector('.knowledge-graph-svg');
        const linksGroup = svgElement.querySelector('.links') || svgElement;
        
        // 创建连接线
        const newLink = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLink.classList.add('link', strength);
        newLink.setAttribute('x1', x1);
        newLink.setAttribute('y1', y1);
        newLink.setAttribute('x2', x2);
        newLink.setAttribute('y2', y2);
        
        // 设置连接线样式
        switch(strength) {
            case 'strong':
                newLink.setAttribute('stroke', 'rgba(0, 0, 0, 0.7)');
                newLink.setAttribute('stroke-width', '2.5');
                break;
            case 'medium':
                newLink.setAttribute('stroke', 'rgba(0, 0, 0, 0.5)');
                newLink.setAttribute('stroke-width', '1.5');
                break;
            case 'weak':
                newLink.setAttribute('stroke', 'rgba(0, 0, 0, 0.3)');
                newLink.setAttribute('stroke-width', '1');
                break;
        }
        
        // 添加到SVG
        linksGroup.appendChild(newLink);
    }
    
    // 关闭详情按钮事件
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', function() {
            nodeDetailPanel.classList.remove('active');
            document.querySelectorAll('.node.selected').forEach(node => {
                node.classList.remove('selected');
            });
        });
    }
    
    // 视图模式切换
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewModeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const mode = this.getAttribute('data-mode');
            changeGraphLayout(mode);
        });
    });
    
    // 过滤器点击事件
    filterOptions.forEach(option => {
        option.addEventListener('change', function() {
            filterNodes();
        });
    });
    
    // 关系强度滑块事件
    if (strengthSlider) {
        strengthSlider.addEventListener('input', function() {
            filterLinksByStrength(this.value);
        });
    }
    
    // 缩放控制按钮事件
    graphControlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('title');
            if (action === '放大') {
                zoomGraph(1.2);
            } else if (action === '缩小') {
                zoomGraph(0.8);
            } else if (action === '重置视图') {
                resetGraph();
            }
        });
    });
    
    // 点击空白区域取消选中
    graphDisplay.addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('graph-display') || e.target.tagName === 'svg') {
            document.querySelectorAll('.node.selected').forEach(node => {
                node.classList.remove('selected');
            });
            // 移除所有连接线的高亮效果
            links.forEach(link => link.classList.remove('highlighted'));
            nodeDetailPanel.classList.remove('active');
        }
    });
    
    /**
     * 判断连接线是否与指定节点相连
     * @param {Element} link - 连接线元素
     * @param {Element} node - 节点元素
     * @returns {boolean} - 是否相连
     */
    function isLinkConnectedToNode(link, node) {
        const nodeTransform = node.getAttribute('transform');
        const nodeX = parseFloat(nodeTransform.split('translate(')[1].split(',')[0]);
        const nodeY = parseFloat(nodeTransform.split(',')[1].split(')')[0]);
        
        const x1 = parseFloat(link.getAttribute('x1'));
        const y1 = parseFloat(link.getAttribute('y1'));
        const x2 = parseFloat(link.getAttribute('x2'));
        const y2 = parseFloat(link.getAttribute('y2'));
        
        // 判断节点坐标是否与连接线的起点或终点接近
        const threshold = 5;
        return (Math.abs(nodeX - x1) < threshold && Math.abs(nodeY - y1) < threshold) || 
               (Math.abs(nodeX - x2) < threshold && Math.abs(nodeY - y2) < threshold);
    }
    
    /**
     * 高亮与选中节点连接的线
     * @param {Element} node - 选中的节点元素
     */
    function highlightConnectedLinks(node) {
        links.forEach(link => {
            link.classList.remove('highlighted');
            if (isLinkConnectedToNode(link, node)) {
                link.classList.add('highlighted');
            }
        });
    }
    
    /**
     * 显示节点详情弹窗
     * @param {string} nodeName - 节点名称
     * @param {string} nodeType - 节点类型
     * @param {Element} nodeElement - 节点DOM元素
     */
    function showNodeDetailModal(nodeName, nodeType, nodeElement) {
        // 检查是否已存在弹窗，如果存在则先移除
        const existingModal = document.querySelector('.node-detail-modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        // 获取节点在视口中的位置
        const nodeRect = nodeElement.getBoundingClientRect();
        const centerX = nodeRect.left + nodeRect.width/2;
        const centerY = nodeRect.top + nodeRect.height/2;
        
        // 创建弹窗元素
        const modal = document.createElement('div');
        modal.className = 'node-detail-modal';
        
        // 设置弹窗样式和位置
        modal.style.position = 'fixed';       
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.animation = 'modalAppear 0.3s forwards';
       
        
        // 设置弹窗内容
        let iconClass = 'fas fa-lightbulb';
        let typeName = '概念';
        let typeColor = '#e91e63';
        
        if (nodeType === 'courseware') {
            iconClass = 'fas fa-book-open';
            typeName = '课件';
            typeColor = '#2196f3';
        } else if (nodeType === 'quiz') {
            iconClass = 'fas fa-question-circle';
            typeName = '习题';
            typeColor = '#4caf50';
        } else if (nodeType === 'resource') {
            iconClass = 'fas fa-file-alt';
            typeName = '资源';
            typeColor = '#9c27b0';
        } else if (nodeType === 'keyword') {
            iconClass = 'fas fa-tag';
            typeName = '关键词';
            typeColor = '#ff9800';
        }
        
        // 节点描述，实际应用中应从后端获取
        const nodeDescription = `这是关于"${nodeName}"的详细描述。此节点是${typeName}类型，包含相关的知识点和教学资源。
            ${nodeType === 'concept' ? '这一概念是中国传统文化中的重要组成部分，对学生理解相关知识点具有重要意义。' : ''}
            ${nodeType === 'courseware' ? '此课件详细讲解了相关概念和应用，包含丰富的图文资料和案例。' : ''}
            ${nodeType === 'quiz' ? '这组习题覆盖了核心知识点，难度适中，适合课堂检测和自我评估。' : ''}
            ${nodeType === 'resource' ? '此资源为教学提供了额外的参考材料，包括相关文献和多媒体内容。' : ''}
            ${nodeType === 'keyword' ? '这一关键词是理解相关概念的重要术语，在教学中需要重点解释。' : ''}`;
        
        // 构建弹窗HTML内容
        modal.innerHTML = `
            <div class="modal-header">
                <h3>节点详情</h3>
                <button class="close-modal-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                <div class="node-header">
                    <div class="node-icon" style="background-color: ${typeColor};">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="node-info">
                        <div class="node-name-wrapper">
                            <h4 class="node-name-display">${nodeName}</h4>
                            <input type="text" class="node-name-edit" value="${nodeName}" style="display: none;">
                            <button class="edit-name-btn"><i class="fas fa-edit"></i></button>
                        </div>
                        <span class="node-type-badge" style="background-color: ${typeColor};">${typeName}</span>
                    </div>
                </div>
                
                <div class="node-description">
                    <h5>描述</h5>
                    <div class="description-content">
                        <p class="description-text">${nodeDescription}</p>
                        <textarea class="description-edit" style="display: none;">${nodeDescription}</textarea>
                        <button class="edit-description-btn"><i class="fas fa-edit"></i></button>
                    </div>
                </div>
                
                <div class="node-connections">
                    <div class="connections-header">
                        <h5>关联节点</h5>
                        <button class="edit-connections-btn"><i class="fas fa-edit"></i></button>
                    </div>
                    <ul class="connection-list">
                        <li class="connection-item" data-node-id="central">
                            <span class="connection-strength high"></span>
                            <span class="connection-name">中国传统文化</span>
                            <span class="connection-type concept" data-target="concept">
                                <i class="fas fa-lightbulb"></i>
                            </span>
                        </li>
                        <li class="connection-item" data-node-id="courseware1">
                            <span class="connection-strength medium"></span>
                            <span class="connection-name">相关课件资源</span>
                            <span class="connection-type courseware" data-target="courseware">
                                <i class="fas fa-book-open"></i>
                            </span>
                        </li>
                        <li class="connection-item" data-node-id="quiz1">
                            <span class="connection-strength medium"></span>
                            <span class="connection-name">相关习题</span>
                            <span class="connection-type quiz" data-target="quiz">
                                <i class="fas fa-question-circle"></i>
                            </span>
                        </li>
                    </ul>
                    
                    <!-- 编辑关联节点面板 (默认隐藏) -->
                    <div class="connections-edit-panel" style="display: none;">
                        <div class="connection-edit-item">
                            <select class="node-selector">
                                <option value="central">中国传统文化</option>
                                <option value="concept1">儒家思想</option>
                                <option value="concept2">道家思想</option>
                                <option value="courseware1">传统礼仪课件</option>
                                <option value="courseware2">文学艺术课件</option>
                                <option value="quiz1">礼仪测验</option>
                                <option value="quiz2">文学测验</option>
                            </select>
                            <select class="strength-selector">
                                <option value="high">强关联</option>
                                <option value="medium" selected>中等关联</option>
                                <option value="low">弱关联</option>
                            </select>
                            <button class="remove-connection-btn"><i class="fas fa-trash"></i></button>
                        </div>
                        <button class="add-connection-btn"><i class="fas fa-plus"></i> 添加关联节点</button>
                        <div class="edit-actions">
                            <button class="save-connections-btn">保存关联</button>
                            <button class="cancel-connections-btn">取消</button>
                        </div>
                    </div>
                </div>
                
                <div class="node-actions">
                    <button class="edit-node-btn">
                        <i class="fas fa-edit"></i> 编辑节点
                    </button>
                    <button class="save-node-btn" style="display: none;">
                        <i class="fas fa-save"></i> 保存修改
                    </button>
                    <button class="cancel-edit-btn" style="display: none;">
                        <i class="fas fa-times"></i> 取消编辑
                    </button>
                </div>
            </div>
        `;
        
        // 添加弹窗到页面
        document.body.appendChild(modal);
        
        // 添加关闭弹窗事件
        modal.querySelector('.close-modal-btn').addEventListener('click', function() {
            modal.classList.add('disappear');
            setTimeout(() => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
            }, 300);
        });
        
        // 点击外部区域关闭弹窗
        document.addEventListener('click', function closeModalOutside(e) {
            if (!modal.contains(e.target) && e.target !== nodeElement && !nodeElement.contains(e.target)) {
                modal.classList.add('disappear');
                setTimeout(() => {
                    if (modal.parentNode) {
                        document.body.removeChild(modal);
                    }
                }, 300);
                document.removeEventListener('click', closeModalOutside);
            }
        });
        
        // 为关联节点图标添加点击事件
        const connectionIcons = modal.querySelectorAll('.connection-type');
        connectionIcons.forEach(icon => {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', function() {
                const targetType = this.getAttribute('data-target');
                const nodeName = this.parentNode.querySelector('.connection-name').textContent;
                
                // 导航到对应的资源页面
                navigateToResource(targetType, nodeName);
            });
        });
        
        // 节点编辑功能
        const editNodeBtn = modal.querySelector('.edit-node-btn');
        const saveNodeBtn = modal.querySelector('.save-node-btn');
        const cancelEditBtn = modal.querySelector('.cancel-edit-btn');
        
        // 名称编辑功能
        const nameDisplay = modal.querySelector('.node-name-display');
        const nameEdit = modal.querySelector('.node-name-edit');
        const editNameBtn = modal.querySelector('.edit-name-btn');
        
        editNameBtn.addEventListener('click', function() {
            if (nameEdit.style.display === 'none') {
                nameDisplay.style.display = 'none';
                nameEdit.style.display = 'block';
                nameEdit.focus();
            } else {
                nameDisplay.textContent = nameEdit.value;
                nameDisplay.style.display = 'block';
                nameEdit.style.display = 'none';
            }
        });
        
        // 描述编辑功能
        const descriptionText = modal.querySelector('.description-text');
        const descriptionEdit = modal.querySelector('.description-edit');
        const editDescriptionBtn = modal.querySelector('.edit-description-btn');
        
        editDescriptionBtn.addEventListener('click', function() {
            if (descriptionEdit.style.display === 'none') {
                descriptionText.style.display = 'none';
                descriptionEdit.style.display = 'block';
                descriptionEdit.focus();
            } else {
                descriptionText.textContent = descriptionEdit.value;
                descriptionText.style.display = 'block';
                descriptionEdit.style.display = 'none';
            }
        });
        
        // 关联节点编辑功能
        const connectionsPanel = modal.querySelector('.connection-list');
        const connectionsEditPanel = modal.querySelector('.connections-edit-panel');
        const editConnectionsBtn = modal.querySelector('.edit-connections-btn');
        const saveConnectionsBtn = modal.querySelector('.save-connections-btn');
        const cancelConnectionsBtn = modal.querySelector('.cancel-connections-btn');
        const addConnectionBtn = modal.querySelector('.add-connection-btn');
        
        editConnectionsBtn.addEventListener('click', function() {
            connectionsPanel.style.display = 'none';
            connectionsEditPanel.style.display = 'block';
        });
        
        saveConnectionsBtn.addEventListener('click', function() {
            // 保存关联节点的逻辑
            // 在实际应用中应该发送请求到后端保存更改
            connectionsPanel.style.display = 'block';
            connectionsEditPanel.style.display = 'none';
            
            console.log('已保存关联节点更改');
        });
        
        cancelConnectionsBtn.addEventListener('click', function() {
            connectionsPanel.style.display = 'block';
            connectionsEditPanel.style.display = 'none';
        });
        
        addConnectionBtn.addEventListener('click', function() {
            const connectionItem = document.createElement('div');
            connectionItem.className = 'connection-edit-item';
            connectionItem.innerHTML = `
                <select class="node-selector">
                    <option value="central">中国传统文化</option>
                    <option value="concept1">儒家思想</option>
                    <option value="concept2">道家思想</option>
                    <option value="courseware1">传统礼仪课件</option>
                    <option value="courseware2">文学艺术课件</option>
                    <option value="quiz1">礼仪测验</option>
                    <option value="quiz2">文学测验</option>
                </select>
                <select class="strength-selector">
                    <option value="high">强关联</option>
                    <option value="medium" selected>中等关联</option>
                    <option value="low">弱关联</option>
                </select>
                <button class="remove-connection-btn"><i class="fas fa-trash"></i></button>
            `;
            
            // 在添加按钮前插入新的关联项
            this.parentNode.insertBefore(connectionItem, this);
            
            // 添加删除关联项的事件
            connectionItem.querySelector('.remove-connection-btn').addEventListener('click', function() {
                connectionItem.parentNode.removeChild(connectionItem);
            });
        });
        
        // 为已有的删除关联按钮添加事件
        const removeConnectionBtns = modal.querySelectorAll('.remove-connection-btn');
        removeConnectionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.connection-edit-item').remove();
            });
        });
        
        // 整体编辑模式切换
        editNodeBtn.addEventListener('click', function() {
            // 显示编辑状态的按钮和输入框
            editNodeBtn.style.display = 'none';
            saveNodeBtn.style.display = 'inline-block';
            cancelEditBtn.style.display = 'inline-block';
            
            // 显示所有编辑界面
            nameDisplay.style.display = 'none';
            nameEdit.style.display = 'block';
            
            descriptionText.style.display = 'none';
            descriptionEdit.style.display = 'block';
            
            connectionsPanel.style.display = 'none';
            connectionsEditPanel.style.display = 'block';
            
            // 隐藏单独的编辑按钮
            editNameBtn.style.display = 'none';
            editDescriptionBtn.style.display = 'none';
            editConnectionsBtn.style.display = 'none';
        });
        
        saveNodeBtn.addEventListener('click', function() {
            // 保存所有更改
            nameDisplay.textContent = nameEdit.value;
            descriptionText.textContent = descriptionEdit.value;
            
            // 恢复显示状态
            nameDisplay.style.display = 'block';
            nameEdit.style.display = 'none';
            
            descriptionText.style.display = 'block';
            descriptionEdit.style.display = 'none';
            
            connectionsPanel.style.display = 'block';
            connectionsEditPanel.style.display = 'none';
            
            // 恢复按钮状态
            saveNodeBtn.style.display = 'none';
            cancelEditBtn.style.display = 'none';
            editNodeBtn.style.display = 'inline-block';
            
            // 显示单独的编辑按钮
            editNameBtn.style.display = 'inline-block';
            editDescriptionBtn.style.display = 'inline-block';
            editConnectionsBtn.style.display = 'inline-block';
            
            console.log('已保存节点更改：', nameEdit.value);
        });
        
        cancelEditBtn.addEventListener('click', function() {
            // 取消编辑，恢复原状
            nameEdit.value = nameDisplay.textContent;
            descriptionEdit.value = descriptionText.textContent;
            
            // 恢复显示状态
            nameDisplay.style.display = 'block';
            nameEdit.style.display = 'none';
            
            descriptionText.style.display = 'block';
            descriptionEdit.style.display = 'none';
            
            connectionsPanel.style.display = 'block';
            connectionsEditPanel.style.display = 'none';
            
            // 恢复按钮状态
            saveNodeBtn.style.display = 'none';
            cancelEditBtn.style.display = 'none';
            editNodeBtn.style.display = 'inline-block';
            
            // 显示单独的编辑按钮
            editNameBtn.style.display = 'inline-block';
            editDescriptionBtn.style.display = 'inline-block';
            editConnectionsBtn.style.display = 'inline-block';
        });
    }
    
    /**
     * 导航到对应的资源页面
     * @param {string} resourceType - 资源类型
     * @param {string} resourceName - 资源名称
     */
    function navigateToResource(resourceType, resourceName) {
        // 根据不同类型的资源跳转到不同的页面
        let targetSection = '';
        let targetTab = '';
        
        switch(resourceType) {
            case 'concept':
                // 概念节点导航到知识图谱
                targetSection = 'evolution';
                break;
            case 'courseware':
                // 课件节点导航到课件页面
                targetSection = 'ai-pre';
                targetTab = 'courseware';
                break;
            case 'quiz':
                // 习题节点导航到习题页面
                targetSection = 'ai-pre';
                targetTab = 'quiz';
                break;
            case 'resource':
                // 资源节点导航到资源页面
                targetSection = 'ai-post';
                break;
            case 'keyword':
                // 关键词节点导航到知识拓展
                targetSection = 'ai-pre';
                targetTab = 'knowledge';
                break;
            default:
                targetSection = 'evolution';
        }
        
        // 显示导航确认
        const resourceNameShort = resourceName.length > 20 ? resourceName.substring(0, 20) + '...' : resourceName;
        showNotification(`正在跳转到: ${resourceNameShort}`, 'info');
        
        // 切换到目标部分 - 实际应用中应该触发导航
        console.log(`导航到: ${targetSection} 部分${targetTab ? '，' + targetTab + ' 标签' : ''}`);
        
        // 模拟导航 - 实际项目中应该调用真实导航函数
        setTimeout(() => {
            // 这里是示例，实际应用中需要根据实际导航逻辑修改
            if (document.querySelector(`.nav-item[data-section="${targetSection}"]`)) {
                document.querySelector(`.nav-item[data-section="${targetSection}"]`).click();
                
                if (targetTab && document.querySelector(`.tab-btn[data-tab="${targetTab}"]`)) {
                    setTimeout(() => {
                        document.querySelector(`.tab-btn[data-tab="${targetTab}"]`).click();
                    }, 300);
                }
            }
        }, 500);
    }
    
    /**
     * 显示节点详情 (侧边栏)
     * @param {string} nodeId - 节点ID或名称
     */
    function showNodeDetails(nodeId) {
        // 模拟从后端获取节点详情的过程
        // 实际应用中应该从API获取数据
        console.log('显示节点详情:', nodeId);
        
        // 这里可以根据nodeId更新详情面板内容
        // 但在当前演示中，我们使用的是静态内容
        nodeDetailPanel.classList.add('active');
    }
    
    /**
     * 根据过滤条件筛选显示的节点
     */
    function filterNodes() {
        const selectedFilters = Array.from(filterOptions)
            .filter(opt => opt.checked)
            .map(opt => opt.getAttribute('data-filter'));
        
        nodes.forEach(node => {
            const nodeType = Array.from(node.classList)
                .find(cls => ['concept', 'courseware', 'quiz', 'resource', 'keyword'].includes(cls));
            
            if (selectedFilters.includes(nodeType)) {
                node.style.display = 'block';
            } else {
                node.style.display = 'none';
            }
        });
    }
    
    /**
     * 根据强度过滤连接线
     * @param {number} strength - 强度值 1-5
     */
    function filterLinksByStrength(strength) {
        const minStrength = parseInt(strength);
        
        links.forEach(link => {
            const linkStrength = link.classList.contains('strong') ? 5 : 
                                link.classList.contains('medium') ? 3 : 1;
            
            if (linkStrength >= minStrength) {
                link.style.display = 'block';
            } else {
                link.style.display = 'none';
            }
        });
    }
    
    /**
     * 更改图谱布局方式
     * @param {string} mode - 布局模式：force, cluster, hierarchy
     */
    function changeGraphLayout(mode) {
        // 实际应用中，这里应该调用力导向图算法重新布局
        // 但在当前演示中，我们只是改变节点的不透明度
        const svgElement = document.querySelector('.knowledge-graph-svg');
        
        // 移除之前的布局类
        svgElement.classList.remove('force-layout', 'cluster-layout', 'hierarchy-layout');
        svgElement.classList.add(`${mode}-layout`);
        
        // 为演示效果，我们简单地为节点添加过渡动画
        nodes.forEach(node => {
            node.style.transition = 'transform 0.5s ease-in-out';
        });
        
        // 模拟不同布局的效果
        if (mode === 'cluster') {
            // 聚类视图 - 将相似节点靠近摆放
            document.querySelectorAll('.node.concept').forEach(node => {
                const transform = node.getAttribute('transform');
                const x = parseFloat(transform.split('translate(')[1].split(',')[0]);
                const y = parseFloat(transform.split(',')[1].split(')')[0]);
                
                // 将概念节点向左上方移动
                node.setAttribute('transform', `translate(${x * 0.8},${y * 0.8})`);
            });
            
            document.querySelectorAll('.node.courseware').forEach(node => {
                const transform = node.getAttribute('transform');
                const x = parseFloat(transform.split('translate(')[1].split(',')[0]);
                const y = parseFloat(transform.split(',')[1].split(')')[0]);
                
                // 将课件节点向右上方移动
                node.setAttribute('transform', `translate(${x * 1.1},${y * 0.7})`);
            });
        } else if (mode === 'hierarchy') {
            // 层级视图 - 垂直树形结构
            document.querySelectorAll('.node').forEach((node, index) => {
                const isCentral = node.classList.contains('central-node');
                if (isCentral) {
                    node.setAttribute('transform', 'translate(400,100)');
                } else {
                    // 根据索引计算在树中的位置
                    const columnWidth = 150;
                    const x = 100 + (index % 4) * columnWidth;
                    const y = 200 + Math.floor(index / 4) * 100;
                    node.setAttribute('transform', `translate(${x},${y})`);
                }
            });
        } else {
            // 力导向图 - 恢复原始布局
            resetGraph();
        }
    }
    
    /**
     * 缩放图谱
     * @param {number} factor - 缩放因子
     */
    function zoomGraph(factor) {
        const svgElement = document.querySelector('.knowledge-graph-svg');
        const currentScale = svgElement.getAttribute('data-scale') || 1;
        const newScale = parseFloat(currentScale) * factor;
        
        // 限制缩放范围
        if (newScale >= 0.5 && newScale <= 2) {
            svgElement.setAttribute('data-scale', newScale);
            svgElement.style.transform = `scale(${newScale})`;
        }
    }
    
    /**
     * 重置图谱到初始状态
     */
    function resetGraph() {
        const svgElement = document.querySelector('.knowledge-graph-svg');
        svgElement.setAttribute('data-scale', 1);
        svgElement.style.transform = 'scale(1)';
        
        // 恢复原始节点位置
        document.querySelectorAll('.node.concept').forEach((node, index) => {
            if (index === 0) {
                node.setAttribute('transform', 'translate(550,200)');
            } else {
                node.setAttribute('transform', 'translate(250,200)');
            }
        });
        
        document.querySelectorAll('.node.courseware').forEach((node, index) => {
            if (index === 0) {
                node.setAttribute('transform', 'translate(550,400)');
            } else {
                node.setAttribute('transform', 'translate(250,400)');
            }
        });
        
        document.querySelectorAll('.node.central-node').forEach(node => {
            node.setAttribute('transform', 'translate(400,300)');
        });
        
        document.querySelectorAll('.node.keyword').forEach((node, index) => {
            if (index === 0) {
                node.setAttribute('transform', 'translate(700,150)');
            } else {
                node.setAttribute('transform', 'translate(100,150)');
            }
        });
        
        document.querySelectorAll('.node.quiz').forEach((node, index) => {
            if (index === 0) {
                node.setAttribute('transform', 'translate(700,450)');
            } else {
                node.setAttribute('transform', 'translate(100,450)');
            }
        });
    }
    
    // 初始显示所有节点
    filterNodes();
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化其他函数...
    
    // 初始化知识图谱
    initKnowledgeGraph();
});

/**
 * 初始化章节选择器
 */
function initChapterSelector() {
    const chapterSelect = document.getElementById('chapter-select');
    if (!chapterSelect) return;
    
    // 获取章节数据
    fetch('http://localhost:3000/api/chapters')
        .then(response => response.json())
        .then(result => {
            if (result.code === 200 && result.data && result.data.chapters) {
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
                    optionZh.textContent = `第${chapter.chapter_number}章：${chapter.title_zh}`;
                    optionZh.classList.add('zh');
                    chapterSelect.appendChild(optionZh);
                    
                    // 添加英文选项
                    const optionEn = document.createElement('option');
                    optionEn.value = chapter.chapter_number;
                    optionEn.textContent = `Chapter ${chapter.chapter_number}: ${chapter.title_en}`;
                    optionEn.classList.add('en');
                    chapterSelect.appendChild(optionEn);
                });
                
                console.log('章节选择器初始化完成');
            } else {
                // 使用备用数据或显示错误
                console.error('加载章节数据失败，使用默认选项');
                
                // 使用模拟数据初始化选择器
                initChapterSelectorWithMockData(chapterSelect);
            }
            
            // 添加选择器变更事件
            addChapterSelectChangeEvent(chapterSelect);
        })
        .catch(error => {
            console.error('获取章节数据出错:', error);
            
            // 使用模拟数据初始化选择器
            initChapterSelectorWithMockData(chapterSelect);
            
            // 添加选择器变更事件
            addChapterSelectChangeEvent(chapterSelect);
        });
}

/**
 * 使用模拟数据初始化章节选择器
 * @param {HTMLSelectElement} chapterSelect - 章节选择器元素
 */
function initChapterSelectorWithMockData(chapterSelect) {
    // 模拟数据
    const mockChapters = [
        { chapter_number: 1, title_zh: '中国文化概述', title_en: 'Overview of Chinese Culture' },
        { chapter_number: 2, title_zh: '中国哲学与思想', title_en: 'Chinese Philosophy and Thought' },
        { chapter_number: 3, title_zh: '中国文学艺术', title_en: 'Chinese Literature and Art' },
        { chapter_number: 4, title_zh: '中国传统艺术', title_en: 'Chinese Traditional Arts' },
        { chapter_number: 5, title_zh: '中国历史文化', title_en: 'Chinese Historical Culture' }
    ];
    
    // 清空现有选项
    chapterSelect.innerHTML = '';
    
    // 添加章节选项
    mockChapters.forEach(chapter => {
        // 添加中文选项
        const optionZh = document.createElement('option');
        optionZh.value = chapter.chapter_number;
        optionZh.textContent = `第${chapter.chapter_number}章：${chapter.title_zh}`;
        optionZh.classList.add('zh');
        chapterSelect.appendChild(optionZh);
        
        // 添加英文选项
        const optionEn = document.createElement('option');
        optionEn.value = chapter.chapter_number;
        optionEn.textContent = `Chapter ${chapter.chapter_number}: ${chapter.title_en}`;
        optionEn.classList.add('en');
        chapterSelect.appendChild(optionEn);
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

// 获取章节列表
async function fetchChapters() {
    const chaptersContainer = document.getElementById('chaptersContainer');
    const loadingIndicator = document.getElementById('chaptersLoading');
    
    try {
        // 显示加载指示器
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
        
        // 获取令牌
        const token = localStorage.getItem('token');
        
        // 调用API获取章节列表
        const response = await fetch('http://localhost:3000/api/chapters', {
            headers: token ? {
                'Authorization': 'Bearer ' + token // 有令牌时添加到请求头
            } : {}
        });
        
        // 处理响应，即使返回401也尝试解析
        if (response.status === 401) {
            // 如果接收到认证错误，尝试模拟数据（开发环境专用）
            console.warn('接收到认证错误，使用模拟数据');
            // 模拟数据
            const mockData = {
                code: 200,
                data: {
                    chapters: [
                        {
                            id: 'mock-1',
                            chapter_number: 1,
                            title_zh: '中国传统文化概述',
                            title_en: 'Overview of Chinese Traditional Culture',
                            description_zh: '本章介绍中国传统文化的基本概念和特点',
                            description_en: 'This chapter introduces the basic concepts and features of Chinese traditional culture',
                            cover_image: '../picture/banner.jpg',
                            updated_at: new Date(),
                            contents: [],
                            created_at: new Date()
                        }
                    ]
                }
            };
            renderChapters(mockData.data.chapters);
            
            // 计算今天新增的章节数量
            const todayNewChapters = countTodayNewChapters(mockData.data.chapters);
            
            // 更新统计数据
            const chapterCountElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
            if (chapterCountElement) {
                chapterCountElement.textContent = mockData.data.chapters.length;
            }
            
            // 更新新增章节数量显示
            updateChapterIncrease(todayNewChapters);
            
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            return;
        }
        
        const result = await response.json();
        
        if (result.code === 200) {
            // 隐藏加载指示器
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            
            // 渲染章节卡片
            renderChapters(result.data.chapters);
            
            // 计算今天新增的章节数量
            const todayNewChapters = countTodayNewChapters(result.data.chapters);
            
            // 更新统计数据
            const chapterCountElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
            if (chapterCountElement) {
                chapterCountElement.textContent = result.data.chapters.length;
            }
            
            // 更新新增章节数量显示
            updateChapterIncrease(todayNewChapters);
        } else {
            throw new Error(result.message || '获取章节失败');
        }
    } catch (error) {
        console.error('获取章节列表失败:', error);
        if (loadingIndicator) {
            loadingIndicator.innerHTML = `
                <p class="zh">加载失败，请重试</p>
                <p class="en">Loading failed, please try again</p>
            `;
        }
    }
}

/**
 * 计算今天新增的章节数量
 * @param {Array} chapters - 章节数据数组
 * @returns {number} - 今天新增的章节数量
 */
function countTodayNewChapters(chapters) {
    // 获取今天的日期（去掉时间部分）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 计算今天创建的章节数量
    return chapters.filter(chapter => {
        // 如果没有创建日期，尝试使用更新日期
        const createDate = chapter.created_at || chapter.updated_at;
        if (!createDate) return false;
        
        // 获取章节创建日期
        const createdAt = new Date(createDate);
        createdAt.setHours(0, 0, 0, 0);
        
        // 检查是否为今天创建
        return createdAt.getTime() === today.getTime();
    }).length;
}

// 更新统计卡片的新增数量显示
function updateChapterIncrease(count) {
    const chapterChangeElement = document.querySelector('.stat-card:nth-child(1) .stat-change');
    if (chapterChangeElement) {
        if (count > 0) {
            // 有新增时，显示增加标记
            chapterChangeElement.style.display = 'flex';
            const countSpan = chapterChangeElement.querySelector('span');
            if (countSpan) {
                countSpan.textContent = `+${count}`;
            }
        } else {
            // 无新增时，隐藏整个增加标记
            chapterChangeElement.style.display = 'none';
        }
    }
}

// 渲染章节卡片
function renderChapters(chapters) {
    const chaptersContainer = document.getElementById('chaptersContainer');
    
    // 如果找不到容器元素，直接返回
    if (!chaptersContainer) {
        console.error('找不到章节容器元素 #chaptersContainer');
        return;
    }
    
    // 清空容器
    chaptersContainer.innerHTML = '';
    
    if (chapters.length === 0) {
        chaptersContainer.innerHTML = `
            <div class="no-data-message">
                <p class="zh">暂无章节数据</p>
                <p class="en">No chapter data available</p>
            </div>
        `;
        return;
    }
    
    // 对章节按照章节编号排序，章节编号大的在后面
    chapters.sort((a, b) => a.chapter_number - b.chapter_number);
    
    // 渲染每个章节卡片
    chapters.forEach(chapter => {
        const chapterCard = document.createElement('div');
        chapterCard.className = 'chapter-card';
        
        // 获取相对时间
        const updateTime = getRelativeTime(new Date(chapter.updated_at));
        
        // 图片路径处理
        let coverImage = chapter.cover_image || '../picture/banner.jpg';
        
        // 确保路径正确，针对不同格式处理
        if (coverImage && coverImage.startsWith('/uploads/')) {
            // 保持原样，这是新上传的图片路径
        } else if (coverImage && !coverImage.startsWith('http') && !coverImage.startsWith('/') && !coverImage.startsWith('..')) {
            // 如果是相对路径但不是以../开头，添加/前缀
            coverImage = '/' + coverImage;
        }
        // 原有的 ../picture/ 开头的路径保持不变
        
        chapterCard.innerHTML = `
            <div class="chapter-cover">
                <img src="${coverImage}" alt="章节封面" class="chapter-img" onerror="this.src='../picture/banner.jpg'">
                <div class="chapter-actions">
                    <button class="chapter-action-btn edit" title="编辑章节" data-id="${chapter.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="chapter-action-btn prepare" title="备课" data-id="${chapter.id}">
                        <i class="fas fa-magic"></i>
                    </button>
                    <button class="chapter-action-btn teach" title="上课" data-id="${chapter.id}">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </button>
                </div>
            </div>
            <div class="chapter-info">
                <h3 class="chapter-title zh">第${chapter.chapter_number}章：${chapter.title_zh}</h3>
                <h3 class="chapter-title en">Chapter ${chapter.chapter_number}: ${chapter.title_en}</h3>
                <p class="chapter-desc zh">${chapter.description_zh || '本章介绍中国文化的基本概念、发展历程及其在世界文化中的地位和影响。深入探讨中国文化特点的形成、历史发展源流以及对当代中国文化的影响。'}</p>
                <p class="chapter-desc en">${chapter.description_en || ''}</p>
                <div class="chapter-meta">
                    <div class="meta-item update-time">
                        <i class="far fa-clock"></i>
                        <span class="zh">更新于 ${updateTime.zh}</span>
                        <span class="en">Updated ${updateTime.en}</span>
                    </div>
                    <div class="meta-item">
                        <i class="far fa-file-alt"></i>
                        <span>${chapter.contents ? chapter.contents.length : 0} 文件</span>
                    </div>
                </div>
            </div>
        `;
        
        chaptersContainer.appendChild(chapterCard);
    });
    
    // 添加章节卡片的点击事件
    attachChapterEvents();
    
    // 重新初始化章节滑动功能
    // 等待DOM更新后再初始化滑动功能
    setTimeout(() => {
        initChapterSlider();
        console.log('章节滑动功能已重新初始化');
    }, 100);
}

// 添加章节卡片的点击事件
function attachChapterEvents() {
    // 编辑按钮点击事件
    const editBtns = document.querySelectorAll('.chapter-action-btn.edit');
    if (editBtns && editBtns.length > 0) {
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                const chapterId = e.currentTarget.dataset.id;
                // TODO: 实现编辑章节功能
                console.log('编辑章节:', chapterId);
                
                // 显示编辑提示
                const chapterCard = e.currentTarget.closest('.chapter-card');
                const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
                showNotification(`正在编辑${chapterTitle}...`, 'info');
            });
        });
    }
    
    // 备课按钮点击事件
    const prepareBtns = document.querySelectorAll('.chapter-action-btn.prepare');
    if (prepareBtns && prepareBtns.length > 0) {
        prepareBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                
                // 获取章节信息
                const chapterCard = e.currentTarget.closest('.chapter-card');
                const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
                const chapterNumber = chapterCard.querySelector('.chapter-title.zh').textContent.match(/第(\d+)章/)[1];
                
                // 切换到AI助教-课前界面
                const aiPreNavItem = document.querySelector('.nav-item[data-section="ai-pre"]');
                if (aiPreNavItem) {
                    // 触发点击事件，切换到AI助教-课前界面
                    aiPreNavItem.click();
                    
                    // 等待界面切换和章节选择器初始化完成
                    setTimeout(() => {
                        // 找到章节选择器并选择相应章节
                        const chapterSelect = document.getElementById('chapter-select');
                        if (chapterSelect) {
                            // 寻找对应章节的选项
                            let found = false;
                            for (let i = 0; i < chapterSelect.options.length; i++) {
                                const option = chapterSelect.options[i];
                                if (option.value === chapterNumber && option.classList.contains('zh')) {
                                    chapterSelect.selectedIndex = i;
                                    // 手动触发变更事件
                                    const event = new Event('change');
                                    chapterSelect.dispatchEvent(event);
                                    found = true;
                                    break;
                                }
                            }
                            
                            if (!found) {
                                showNotification(`找不到章节${chapterNumber}，请手动选择`, 'warning');
                            } else {
                                showNotification(`正在准备${chapterTitle}的课前内容...`, 'success');
                            }
                        } else {
                            showNotification(`章节选择器未找到，请手动选择章节`, 'warning');
                        }
                    }, 500); // 增加延迟时间，确保选择器已初始化
                }
            });
        });
    }
    
    // 上课按钮点击事件
    const teachBtns = document.querySelectorAll('.chapter-action-btn.teach');
    if (teachBtns && teachBtns.length > 0) {
        teachBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                
                // 获取章节信息
                const chapterCard = e.currentTarget.closest('.chapter-card');
                const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
                
                // 切换到"AI助教-课中"界面
                const aiInNavItem = document.querySelector('.nav-item[data-section="ai-in"]');
                if (aiInNavItem) {
                    aiInNavItem.click();
                    
                    // 显示通知
                    showNotification(`开始${chapterTitle}的课堂教学`, 'success');
                }
            });
        });
    }
}

// 提交新建章节
async function submitNewChapter() {
    // 获取表单按钮并显示加载状态
    const submitBtn = document.querySelector('#newChapterForm button[type="submit"]') || 
                     document.getElementById('submitNewChapter');
    let originalBtnText = '';
    
    if (submitBtn) {
        originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
    }
    
    const form = document.getElementById('newChapterForm');
    if (!form) {
        console.error('找不到表单元素 #newChapterForm');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        showNotification('error', '系统错误：找不到表单', 'System error: Form not found');
        return;
    }
    
    const formData = new FormData(form);
    
    // 验证必填字段
    const titleZh = formData.get('title_zh');
    const titleEn = formData.get('title_en');
    
    if (!titleZh || !titleEn) {
        showNotification('error', '请填写必填字段', 'Please fill in required fields');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        return;
    }
    
    try {
        // 处理图片上传
        let coverImagePath = '';
        const coverImageFile = document.getElementById('coverImage').files[0];
        
        if (coverImageFile) {
            // 上传图片
            try {
                const imageFormData = new FormData();
                // 根据API要求，字段名为'file'而不是'image'
                imageFormData.append('file', coverImageFile);
                
                console.log('尝试上传图片...');
                
                // 上传图片 - 完全不使用认证
                const imageUploadResponse = await fetch('http://localhost:3000/api/upload/image', {
                    method: 'POST',
                    body: imageFormData
                });
                
                console.log('图片上传响应状态:', imageUploadResponse.status);
                
                if (!imageUploadResponse.ok) {
                    const errorText = await imageUploadResponse.text();
                    console.error('图片上传失败:', imageUploadResponse.status, errorText);
                    
                    // 使用默认图片，继续章节创建流程
                    showNotification('warning', '图片上传失败，将使用默认图片', 'Image upload failed, using default image');
                    coverImagePath = '../picture/banner.jpg';
                } else {
                    // 上传成功
                    const imageResult = await imageUploadResponse.json();
                    console.log('图片上传成功, 响应:', imageResult);
                    
                    // 返回的URL会是/uploads/images/xxxx.jpg格式，
                    // 但我们需要存储为../picture/xxxx.jpg格式以保持一致性
                    if (imageResult.data && imageResult.data.url) {
                        // 获取文件名
                        const fileName = imageResult.data.url.split('/').pop();
                        // 转换为与已有数据相同的格式
                        coverImagePath = `../picture/${fileName}`;
                        console.log('转换后的图片URL:', coverImagePath);
                        
                        // 复制上传的图片到admin/picture目录
                        try {
                            const copyResponse = await fetch('http://localhost:3000/api/admin/copy-image', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    sourceFileName: fileName
                                })
                            });
                            
                            if (!copyResponse.ok) {
                                console.warn('复制图片到admin/picture目录失败，但章节创建将继续');
                            }
                        } catch (copyError) {
                            console.error('复制图片时出错:', copyError);
                        }
                    } else if (imageResult.url) {
                        const fileName = imageResult.url.split('/').pop();
                        coverImagePath = `../picture/${fileName}`;
                        console.log('转换后的图片URL:', coverImagePath);
                    } else {
                        // 使用默认图片
                        coverImagePath = '../picture/banner.jpg';
                    }
                }
            } catch (error) {
                console.error('图片上传过程中出错:', error);
                // 使用默认图片但继续创建章节
                coverImagePath = '../picture/banner.jpg';
            }
        }
        
        // 获取已有章节以确定序号
        const chaptersResponse = await fetch('http://localhost:3000/api/chapters');
        const chaptersResult = await chaptersResponse.json();
        
        // 确定新章节序号
        let maxChapterNumber = 0;
        if (chaptersResult.code === 200 && chaptersResult.data && chaptersResult.data.chapters) {
            maxChapterNumber = chaptersResult.data.chapters.reduce((max, chapter) => 
                Math.max(max, chapter.chapter_number || 0), 0);
        }
        
        // 构建请求数据
        const chapterData = {
            chapter_number: parseInt(formData.get('chapter_number')) || maxChapterNumber + 1,
            title_zh: formData.get('title_zh'),
            title_en: formData.get('title_en'),
            description_zh: formData.get('description_zh') || '',
            description_en: formData.get('description_en') || '',
            cover_image: coverImagePath, // 使用上传后的图片路径
            is_published: document.getElementById('isPublished') ? document.getElementById('isPublished').checked : true
            // 移除 created_at 和 updated_at 字段，让后端自动处理
        };
        
        console.log('提交章节数据:', chapterData);
        
        // 发送请求创建章节 - 完全不使用认证
        const response = await fetch('http://localhost:3000/api/chapters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chapterData)
        });
        
        // 检查响应状态
        if (!response.ok) {
            const errorText = await response.text();
            console.error('创建章节失败:', response.status, errorText);
            throw new Error(`创建章节失败: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.code === 201 || result.code === 200) {
            // 创建成功
            showNotification('success', '章节创建成功', 'Chapter created successfully');
            
            // 关闭模态框并重新加载章节列表
            document.getElementById('newChapterModal').classList.remove('active');
            form.reset();
            
            // 先刷新章节列表
            await fetchChapters();
            
            // 不需要单独更新统计数据，因为fetchChapters现在会处理
            
            // 等待章节加载和DOM更新完成后，滚动到最后一个章节
            setTimeout(() => {
                const chaptersContainer = document.getElementById('chaptersContainer');
                if (chaptersContainer) {
                    const lastChapter = chaptersContainer.lastElementChild;
                    if (lastChapter) {
                        // 滚动到最后一个章节
                        chaptersContainer.scrollLeft = chaptersContainer.scrollWidth;
                        
                        // 高亮显示最后一个章节
                        lastChapter.classList.add('highlight-new');
                        // 2秒后移除高亮
                        setTimeout(() => {
                            lastChapter.classList.remove('highlight-new');
                        }, 2000);
                    }
                }
            }, 500);
        } else {
            throw new Error(result.message || '创建章节失败，服务器返回未知状态');
        }
    } catch (error) {
        console.error('创建章节失败:', error);
        showNotification('error', '创建章节失败: ' + error.message, 'Failed to create chapter: ' + error.message);
    } finally {
        // 恢复按钮状态
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}

// 显示通知
function showNotification(type, messageZh, messageEn) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span class="zh">${messageZh}</span>
        <span class="en">${messageEn}</span>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动关闭通知
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // 关闭按钮点击事件
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// 获取相对时间
function getRelativeTime(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    let zhText = '';
    let enText = '';
    
    if (diffMinutes < 60) {
        zhText = diffMinutes === 0 ? '刚刚' : `${diffMinutes}分钟前`;
        enText = diffMinutes === 0 ? 'just now' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
        zhText = `${diffHours}小时前`;
        enText = `${diffHours} hours ago`;
    } else if (diffDays < 7) {
        zhText = `${diffDays}天前`;
        enText = `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        zhText = `${weeks}周前`;
        enText = `${weeks} weeks ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        zhText = `${months}月前`;
        enText = `${months} months ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        zhText = `${years}年前`;
        enText = `${years} years ago`;
    }
    
    return { zh: zhText, en: enText };
}

// 只保留updateCourseStatsCount函数，删除重复的fetchChapters和submitNewChapter函数
async function updateCourseStatsCount() {
    try {
        // 获取章节数据
        const response = await fetch('http://localhost:3000/api/chapters');
        const result = await response.json();
        
        if (result.code === 200 && result.data && result.data.chapters) {
            // 更新章节数量显示
            const chapterCountElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
            if (chapterCountElement) {
                chapterCountElement.textContent = result.data.chapters.length;
            }
        }
    } catch (error) {
        console.error('获取章节数量统计失败:', error);
    }
}

// 在页面加载完成时加入调用
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他初始化代码 ...
    
    // 获取章节列表数据
    fetchChapters();
    
    // 直接调用更新课程统计数据
    updateCourseStatsCount();
    
    // ... 其他代码 ...
});

/**
 * 初始化PPTist iframe集成
 */
    // 获取相关DOM元素
    const newPPTBtn = document.getElementById('newPPTBtn');
    const replacePPTBtn = document.getElementById('replacePPTBtn');
    
        return;
    }
    
    // 新建PPT按钮点击事件
    newPPTBtn.addEventListener('click', () => {
        // 向iframe发送消息，触发AI生成PPT功能
            type: 'AI_GENERATE_PPT',
            data: {}
        }, '*');
        
        showNotification('正在初始化AI生成PPT...', 'info');
    });
    
    // 替换PPT按钮点击事件
    replacePPTBtn.addEventListener('click', () => {
        // 创建菜单
        const menu = document.createElement('div');
        menu.className = 'replace-ppt-menu';
        menu.innerHTML = `
            <div class="menu-item upload-new">上传新PPT</div>
            <div class="menu-item select-existing">选择已有PPT</div>
        `;
        
        // 设置菜单样式
        menu.style.position = 'absolute';
        menu.style.background = 'white';
        menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        menu.style.borderRadius = '4px';
        menu.style.zIndex = '9999';
        
        // 获取按钮位置
        const rect = replacePPTBtn.getBoundingClientRect();
        menu.style.top = (rect.bottom + 5) + 'px';
        menu.style.left = rect.left + 'px';
        
        // 添加菜单项样式
        const menuItemStyle = `
            .replace-ppt-menu .menu-item {
                padding: 8px 12px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .replace-ppt-menu .menu-item:hover {
                background-color: #f5f5f5;
            }
        `;
        const style = document.createElement('style');
        style.textContent = menuItemStyle;
        document.head.appendChild(style);
        
        // 添加到页面
        document.body.appendChild(menu);
        
        // 点击上传新PPT
        menu.querySelector('.upload-new').addEventListener('click', () => {
            menu.remove();
            style.remove();
            
            // 创建文件上传控件
            const input = document.createElement('input');
            input.type = 'file';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                // 读取文件内容
                const reader = new FileReader();
                reader.onload = (event) => {
                    // 向iframe发送文件数据
                        type: 'IMPORT_FILE',
                        data: {
                            name: file.name,
                            content: event.target.result
                        }
                    }, '*');
                    
                    showNotification(`正在导入文件: ${file.name}`, 'info');
                    
                    // 上传文件到服务器以便以后使用
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    fetch('http://localhost:3000/api/upload/ppt', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.code === 200) {
                            showNotification('PPT已保存到服务器', 'success');
                        } else {
                            showNotification('PPT保存到服务器失败: ' + data.message, 'error');
                        }
                    })
                    .catch(error => {
                        console.error('上传PPT到服务器失败:', error);
                        showNotification('上传PPT到服务器失败', 'error');
                    });
                };
                
                if (file.name.endsWith('.pptx')) {
                    reader.readAsArrayBuffer(file);
                } else {
                    reader.readAsText(file);
                }
            };
            
            input.click();
        });
        
        // 点击选择已有PPT
        menu.querySelector('.select-existing').addEventListener('click', () => {
            menu.remove();
            style.remove();
            
            // 首先尝试列出前端目录中的PPT文件
            fetch('./ppt/')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('无法访问前端PPT目录');
                    }
                    return response.text();
                })
                .then(html => {
                    // 解析目录HTML以获取文件列表
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const links = Array.from(doc.querySelectorAll('a'));
                    
                    const pptFiles = links
                        .map(link => link.href)
                        .map(href => {
                            const filename = href.substring(href.lastIndexOf('/') + 1);
                            return {
                                name: filename,
                                path: `./ppt/${filename}`,
                                source: 'local'
                            };
                        });
                    
                    if (pptFiles.length > 0) {
                        // 显示前端目录中的PPT文件
                        showPPTSelectionMenu(pptFiles);
                    } else {
                        // 如果前端目录中没有PPT文件，则尝试获取后端的PPT文件列表
                        loadPptList();
                    }
                })
                .catch(error => {
                    console.error('访问前端PPT目录失败:', error);
                    // 如果无法访问前端目录，则尝试获取后端的PPT文件列表
                    loadPptList();
                });
        });
        
        // 点击其他区域关闭菜单
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && e.target !== replacePPTBtn) {
                menu.remove();
                style.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    });
    
    // 监听来自iframe的消息
    window.addEventListener('message', (event) => {
        // 确保消息来自我们的iframe
        
        // 处理各种消息类型
        switch (event.data.type) {
            case 'PPT_SAVED':
                showNotification('PPT保存成功', 'success');
                break;
                
            case 'PPT_PREVIEW':
                showNotification('正在预览PPT', 'info');
                break;
                
            case 'PPT_EXPORTED':
                showNotification('PPT导出成功', 'success');
                break;
                
            case 'IMPORT_SUCCESS':
                showNotification(`导入文件成功: ${event.data.data.fileName}`, 'success');
                break;
                
            case 'ERROR':
                showNotification(event.data.message || '操作失败', 'error');
                break;
        }
    });
    
    // 检查iframe加载状态
        showNotification('PPT编辑器加载完成', 'success');
        
        // 初始化后可以发送一个初始化消息
        setTimeout(() => {
                type: 'INIT',
                data: {
                    theme: 'light', // 可以根据系统主题设置
                    language: 'zh' // 设置语言
                }
            }, '*');
            
            // 优先加载本地PPT文件
            loadLocalPPT();
        }, 500);
    };
    
    /**
     * 加载我的PPT内容
     */
    function loadMyPPT(filename = 'default.pptx') {
        // 这里可以从后端API获取PPT内容
        fetch(`http://localhost:3000/api/upload/getPPT/${filename}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络请求失败');
                }
                return response.blob();
            })
            .then(blob => {
                // 创建文件对象
                const file = new File([blob], 'my_presentation.pptx', { 
                    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
                });
                
                // 读取文件内容
                const reader = new FileReader();
                reader.onload = (event) => {
                    // 向iframe发送文件数据
                        type: 'IMPORT_FILE',
                        data: {
                            name: file.name,
                            content: event.target.result
                        }
                    }, '*');
                    
                    showNotification(`正在加载您的PPT内容...`, 'info');
                };
                
                reader.readAsArrayBuffer(file);
            })
            .catch(error => {
                console.error('加载PPT失败:', error);
                showNotification('加载PPT失败，请检查网络连接或API服务', 'error');
            });
    }
    
    /**
     * 从前端目录加载PPT文件
     */
    function loadLocalPPT() {
        // 指定要加载的PPT文件名（根据您的实际文件名修改）
        const pptFileName = 'default.pptx';
        const pptPath = `./ppt/${pptFileName}`;
        
        fetch(pptPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法加载本地PPT文件');
                }
                return response.blob();
            })
            .then(blob => {
                // 创建文件对象
                const file = new File([blob], pptFileName, { 
                    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                });
                
                // 读取文件内容
                const reader = new FileReader();
                reader.onload = (event) => {
                    // 向iframe发送文件数据
                        type: 'IMPORT_FILE',
                        data: {
                            name: file.name,
                            content: event.target.result
                        }
                    }, '*');
                    
                    showNotification(`正在加载本地PPT文件...`, 'info');
                };
                
                reader.readAsArrayBuffer(file);
            })
            .catch(error => {
                console.error('加载本地PPT文件失败:', error);
                showNotification('加载本地PPT文件失败，尝试其他方式加载', 'error');
                
                // 如果本地加载失败，尝试从后端加载
                loadMyPPT();
            });
    }
    
    /**
     * 显示PPT文件选择菜单
     * @param {Array} files PPT文件列表
     */
    function showPPTSelectionMenu(files) {
        // 创建PPT选择菜单
        const pptMenu = document.createElement('div');
        pptMenu.className = 'ppt-selection-menu';
        pptMenu.innerHTML = `
            <div class="ppt-menu-header">
                <h3>选择要加载的PPT</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="ppt-menu-body">
                <ul class="ppt-file-list">
                    ${files.map(file => `
                        <li class="ppt-file-item" data-filename="${file.name}" data-source="${file.source || 'server'}" data-path="${file.path || ''}">
                            <span class="ppt-file-icon">${file.type === 'pptx' ? '📊' : '📝'}</span>
                            <span class="ppt-file-name">${file.name}</span>
                            <span class="ppt-file-source">${file.source === 'local' ? '(本地)' : '(服务器)'}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        // 添加菜单到页面
        document.body.appendChild(pptMenu);
        
        // 设置菜单样式
        const style = document.createElement('style');
        style.textContent = `
            .ppt-selection-menu {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                width: 400px;
                max-height: 500px;
                z-index: 9999;
                overflow: hidden;
                font-family: Arial, sans-serif;
            }
            .ppt-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid #eee;
            }
            .ppt-menu-header h3 {
                margin: 0;
                font-size: 16px;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
            }
            .ppt-menu-body {
                padding: 16px;
                max-height: 400px;
                overflow-y: auto;
            }
            .ppt-file-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .ppt-file-item {
                display: flex;
                align-items: center;
                padding: 10px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .ppt-file-item:hover {
                background-color: #f5f5f5;
            }
            .ppt-file-icon {
                margin-right: 10px;
                font-size: 18px;
            }
            .ppt-file-name {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .ppt-file-source {
                color: #999;
                font-size: 12px;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);
        
        // 添加关闭事件
        pptMenu.querySelector('.close-btn').addEventListener('click', () => {
            pptMenu.remove();
            style.remove();
        });
        
        // 添加文件选择事件
        pptMenu.querySelectorAll('.ppt-file-item').forEach(item => {
            item.addEventListener('click', () => {
                const filename = item.getAttribute('data-filename');
                const source = item.getAttribute('data-source');
                const path = item.getAttribute('data-path');
                
                if (source === 'local') {
                    // 加载本地文件
                    loadLocalPPTByPath(path);
                } else {
                    // 加载服务器文件
                    loadMyPPT(filename);
                }
                
                pptMenu.remove();
                style.remove();
            });
        });
    }
    
    /**
     * 通过路径加载本地PPT文件
     * @param {string} path 文件路径
     */
    function loadLocalPPTByPath(path) {
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法加载本地PPT文件');
                }
                return response.blob();
            })
            .then(blob => {
                // 提取文件名
                const filename = path.substring(path.lastIndexOf('/') + 1);
                
                // 创建文件对象
                const file = new File([blob], filename, { 
                    type: filename.endsWith('.pptx') 
                        ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                        : 'application/json'
                });
                
                // 读取文件内容
                const reader = new FileReader();
                reader.onload = (event) => {
                    // 向iframe发送文件数据
                        type: 'IMPORT_FILE',
                        data: {
                            name: file.name,
                            content: event.target.result
                        }
                    }, '*');
                    
                    showNotification(`正在加载本地PPT文件: ${filename}`, 'info');
                };
                
                if (filename.endsWith('.pptx')) {
                    reader.readAsArrayBuffer(file);
                } else {
                    reader.readAsText(file);
                }
            })
            .catch(error => {
                console.error('加载本地PPT文件失败:', error);
                showNotification('加载本地PPT文件失败', 'error');
            });
    }
    
    /**
     * 加载PPT文件列表
     */
    function loadPptList() {
        fetch('http://localhost:3000/api/upload/listPPT')
            .then(response => response.json())
            .then(data => {
                const pptList = data.files || [];
                
                // 如果没有PPT文件，显示提示信息
                if (pptList.length === 0) {
                    showNotification('没有找到PPT文件，请先上传', 'info');
                    return;
                }
                
                // 添加source标记
                const files = pptList.map(file => ({
                    ...file,
                    source: 'server'
                }));
                
                // 显示PPT选择菜单
                showPPTSelectionMenu(files);
            })
            .catch(error => {
                console.error('获取PPT列表失败:', error);
                showNotification('获取PPT列表失败', 'error');
            });
    }
}