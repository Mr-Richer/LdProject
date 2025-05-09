/**
 * AI助手模块
 * 处理AI助教相关功能，包括课前、课中和课后
 */

// 初始化AI助教-课前模块
function initAIPre() {
    // 初始化章节选择器
    initChapterSelector();
    
    // 初始化课件设计功能
    initCoursewareDesign();
    
    // 初始化知识拓展功能
    initKnowledgeExpansion();
    
    // 初始化教学助手交互
    initTeachingAssistant();
}

// 初始化AI助教-课中模块
function initAIInClass() {
    // 初始化课中章节选择器
    initInClassChapterSelector();
    
    // 初始化课堂控制面板
    initClassroomControlPanel();
    
    // 初始化签到二维码显示
    initQRCodeDisplay();
}

// 初始化AI助教-课前选项卡切换
function initAIPreTabs() {
    const tabs = document.querySelectorAll('#ai-pre-section .tab');
    const tabContents = document.querySelectorAll('#ai-pre-section .tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 获取目标内容ID
            const targetId = this.getAttribute('data-tab');
            
            // 移除所有标签的活动状态
            tabs.forEach(t => t.classList.remove('active'));
            
            // 添加活动状态到当前标签
            this.classList.add('active');
            
            // 隐藏所有内容
            tabContents.forEach(content => {
                content.classList.remove('active');
                // 添加淡出效果
                content.style.opacity = '0';
            });
            
            // 显示目标内容
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                setTimeout(() => {
                    targetContent.classList.add('active');
                    // 添加淡入效果
                    animateTabContentChange(targetContent);
                }, 300);
            }
        });
    });
}

// 初始化章节选择器
function initChapterSelector() {
    const chapterSelect = document.getElementById('chapter-select');
    if (!chapterSelect) return;
    
    // 清空现有选项
    chapterSelect.innerHTML = '';
    
    // 添加默认提示选项
    const defaultOptionZh = document.createElement('option');
    defaultOptionZh.value = '';
    defaultOptionZh.text = '请选择章节';
    defaultOptionZh.classList.add('zh');
    defaultOptionZh.disabled = true;
    defaultOptionZh.selected = true;
    chapterSelect.appendChild(defaultOptionZh);
    
    const defaultOptionEn = document.createElement('option');
    defaultOptionEn.value = '';
    defaultOptionEn.text = 'Select a chapter';
    defaultOptionEn.classList.add('en');
    defaultOptionEn.disabled = true;
    defaultOptionEn.selected = true;
    chapterSelect.appendChild(defaultOptionEn);
    
    // 模拟从API获取章节数据
    const chapters = window.isOfflineMode ? 
        [
            { id: 1, title: "第1章：中国古代文化概述", title_en: "Chapter 1: Overview of Ancient Chinese Culture" },
            { id: 2, title: "第2章：先秦诸子百家", title_en: "Chapter 2: Pre-Qin Schools of Thought" },
            { id: 3, title: "第3章：汉唐文化辉煌", title_en: "Chapter 3: Cultural Glory of Han and Tang Dynasties" },
            { id: 4, title: "第4章：宋明理学", title_en: "Chapter 4: Neo-Confucianism in Song and Ming Dynasties" },
            { id: 5, title: "第5章：近现代文化变革", title_en: "Chapter 5: Modern Cultural Transformations" }
        ] : 
        // 这里应该是从API获取的数据
        [];
    
    // 添加章节选项
    chapters.forEach(chapter => {
        // 从标题中提取章节号
        const chapterMatch = chapter.title.match(/第(\d+)章/);
        if (!chapterMatch || !chapterMatch[1]) return;
        
        const chapterNumber = chapterMatch[1];
        
        // 添加中文选项
        const optionZh = document.createElement('option');
        optionZh.value = chapterNumber;
        optionZh.text = chapter.title;
        optionZh.classList.add('zh');
        chapterSelect.appendChild(optionZh);
        
        // 添加英文选项
        const optionEn = document.createElement('option');
        optionEn.value = chapterNumber;
        optionEn.text = chapter.title_en || `Chapter ${chapterNumber}`;
        optionEn.classList.add('en');
        chapterSelect.appendChild(optionEn);
    });
    
    // 添加选择变更事件
    addChapterSelectChangeEvent(chapterSelect);
}

// 为章节选择器添加变更事件
function addChapterSelectChangeEvent(chapterSelect) {
    if (!chapterSelect) return;
    
    chapterSelect.addEventListener('change', function() {
        // 获取选择的章节号和语言
        const selectedOption = this.options[this.selectedIndex];
        const chapterNumber = selectedOption.value;
        const isEnglish = selectedOption.classList.contains('en');
        
        // 如果没有选择有效章节，返回
        if (!chapterNumber) return;
        
        // 获取章节标题
        const chapterTitle = selectedOption.text;
        
        // 根据当前语言更新内容
        updateAIPreContent(chapterNumber, chapterTitle, isEnglish ? 'en' : 'zh');
    });
}

// 更新AI助教-课前内容
function updateAIPreContent(chapterNumber, chapterTitle, lang = 'zh') {
    // 更新各个部分的内容
    
    // 1. 更新课件设计区域
    const slideTitle = document.querySelector('.slide-title-editor');
    if (slideTitle) {
        slideTitle.textContent = lang === 'zh' ? 
            `${chapterTitle} - 幻灯片标题` : 
            `${chapterTitle} - Slide Title`;
    }
    
    const slideBody = document.querySelector('.slide-body-editor');
    if (slideBody) {
        slideBody.innerHTML = lang === 'zh' ? 
            `<p>这里是${chapterTitle}的内容，请编辑...</p>` : 
            `<p>This is the content for ${chapterTitle}, please edit...</p>`;
    }
    
    // 2. 更新小测题目
    const questionText = document.querySelector('.question-text .' + lang);
    if (questionText) {
        questionText.textContent = lang === 'zh' ? 
            `关于${chapterTitle}的问题示例` : 
            `Sample question about ${chapterTitle}`;
    }
    
    // 3. 更新知识拓展
    const promptInput = document.querySelector('.knowledge-generation .prompt-input.' + lang);
    if (promptInput) {
        promptInput.placeholder = lang === 'zh' ? 
            `请输入关于${chapterTitle}的知识点...` : 
            `Enter knowledge points about ${chapterTitle}...`;
    }
    
    // 4. 显示通知
    showNotification(
        lang === 'zh' ? 
            `已切换到${chapterTitle}` : 
            `Switched to ${chapterTitle}`, 
        'info'
    );
}

// 添加语言切换事件监听
document.body.addEventListener('langchange', function() {
    const isEnglish = document.body.classList.contains('en-mode');
    const currentChapter = document.querySelector('.current-chapter-info');
    if (currentChapter) {
        const chapterTitle = currentChapter.textContent.split(': ')[1];
        updateAIPreContent(null, chapterTitle, isEnglish ? 'en' : 'zh');
    }
});

// 初始化课件设计功能
function initCoursewareDesign() {
    const newPPTBtn = document.getElementById('newPPTBtn');
    const replacePPTBtn = document.getElementById('replacePPTBtn');
    
    if (newPPTBtn) {
        newPPTBtn.addEventListener('click', () => {
            initContentGenerateModal();
        });
    }
    
    if (replacePPTBtn) {
        initReplaceButton(replacePPTBtn);
    }
}

// 初始化内容生成模态框
function initContentGenerateModal() {
    // 获取或创建模态框
    let contentModal = document.getElementById('contentGenerateModal');
    
    // 如果不存在，创建模态框
    if (!contentModal) {
        // 创建模态框和内容...
        showNotification('内容生成功能尚未实现', 'info');
        return;
    }
    
    // 显示模态框
    contentModal.classList.add('active');
    document.querySelector('.modal-overlay').classList.add('active');
    
    // 关闭模态框的函数
    function closeModal() {
        contentModal.classList.remove('active');
        document.querySelector('.modal-overlay').classList.remove('active');
    }
    
    // 绑定关闭按钮事件
    const closeBtn = contentModal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // ESC键关闭
    const escHandler = function(event) {
        if (event.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// 初始化课件替换按钮
function initReplaceButton(replaceBtn) {
    if (!replaceBtn) return;
    
    replaceBtn.addEventListener('click', function() {
        // 创建文件选择器
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pptx,.ppt,.pdf';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // 触发文件选择器点击
        fileInput.click();
        
        // 监听文件选择事件
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                showNotification(`选择了文件: ${file.name}`, 'info');
                
                // 这里应该实现文件上传和处理的逻辑...
                // 模拟上传进度
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    if (progress > 100) {
                        clearInterval(interval);
                        showNotification('课件替换成功', 'success');
                    }
                }, 300);
            }
            
            // 清理
            document.body.removeChild(fileInput);
        });
    });
}

// 初始化知识拓展功能
function initKnowledgeExpansion() {
    const promptInput = document.querySelector('.knowledge-generation .prompt-input');
    const generateBtn = document.querySelector('.knowledge-generation .generate-btn');
    const resultContainer = document.querySelector('.knowledge-generation .result-container');
    
    if (!promptInput || !generateBtn || !resultContainer) return;
    
    generateBtn.addEventListener('click', function() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            showNotification('请输入知识点', 'warning');
            return;
        }
        
        // 显示加载状态
        resultContainer.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p class="zh">正在生成知识拓展内容...</p>
                <p class="en">Generating knowledge expansion content...</p>
            </div>
        `;
        
        // 模拟知识点抽取
        extractKnowledgePoints(prompt, resultContainer);
    });
}

// 知识点抽取
function extractKnowledgePoints(text, container) {
    // 模拟延迟
    setTimeout(() => {
        // 模拟知识点结果
        const knowledgePoints = [
            { title: '文化溯源', content: '中国文化起源于黄河流域和长江流域的早期文明，距今已有五千多年的历史。' },
            { title: '文化特点', content: '中国文化具有包容性强、历史连续性好、重视伦理道德等特点。' },
            { title: '文化影响', content: '中国文化对东亚及世界文明产生了深远影响，包括哲学思想、科技发明和艺术成就等。' }
        ];
        
        // 构建知识点展示
        let html = `
            <div class="knowledge-map">
                <div class="knowledge-center">
                    <div class="center-text">${text}</div>
                </div>
        `;
        
        knowledgePoints.forEach((kp, index) => {
            const angle = (index * (360 / knowledgePoints.length)) * (Math.PI / 180);
            const x = Math.cos(angle) * 150;
            const y = Math.sin(angle) * 150;
            
            html += `
                <div class="knowledge-node" style="transform: translate(${x}px, ${y}px)">
                    <div class="node-title">${kp.title}</div>
                    <div class="node-content">${kp.content}</div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        // 更新结果容器
        container.innerHTML = html;
        
        // 添加节点点击事件
        const nodes = container.querySelectorAll('.knowledge-node');
        nodes.forEach(node => {
            node.addEventListener('click', function() {
                this.classList.toggle('expanded');
            });
        });
        
        // 显示通知
        showNotification('知识点拓展生成完成', 'success');
    }, 1500);
}

// 初始化教学助手交互
function initTeachingAssistant() {
    const chatInput = document.querySelector('.assistant-chat-input');
    const sendBtn = document.querySelector('.assistant-send-btn');
    const chatContainer = document.querySelector('.assistant-chat-container');
    
    if (!chatInput || !sendBtn || !chatContainer) return;
    
    sendBtn.addEventListener('click', function() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // 添加用户消息
        chatContainer.innerHTML += `
            <div class="chat-message user-message">
                <div class="message-content">${message}</div>
            </div>
        `;
        
        // 清空输入框
        chatInput.value = '';
        
        // 滚动到底部
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 生成助手回复
        generateAssistantResponse(message, chatContainer);
    });
    
    // 按Enter键发送消息
    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendBtn.click();
        }
    });
}

// 生成助手回复
function generateAssistantResponse(prompt, container) {
    // 添加助手消息占位符
    container.innerHTML += `
        <div class="chat-message assistant-message">
            <div class="message-avatar">AI</div>
            <div class="message-content thinking">
                <div class="thinking-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    
    // 滚动到底部
    container.scrollTop = container.scrollHeight;
    
    // 模拟延迟
    setTimeout(() => {
        // 示例回复（在实际应用中，这里应该调用AI接口）
        let response;
        
        if (prompt.includes('章节') || prompt.includes('内容')) {
            response = '您可以在左侧的章节选择器中选择想要准备的章节。每个章节都有相应的课件设计、小测题目和知识拓展功能。';
        } else if (prompt.includes('课件') || prompt.includes('幻灯片')) {
            response = '您可以点击"内容生成"按钮，AI将根据章节主题为您生成课件内容。或者点击"替换课件"上传您自己的课件文件。';
        } else if (prompt.includes('帮助') || prompt.includes('使用')) {
            response = '我是您的AI教学助手，可以帮助您准备课程内容、生成教学资源、回答关于教学的问题。请告诉我您需要什么帮助？';
        } else {
            response = '感谢您的提问。作为教学助手，我可以帮助您进行课前准备、内容生成和教学规划。请详细告诉我您需要什么帮助？';
        }
        
        // 更新助手消息
        const assistantMessage = container.querySelector('.assistant-message:last-child .message-content');
        if (assistantMessage) {
            assistantMessage.classList.remove('thinking');
            assistantMessage.textContent = response;
        }
        
        // 滚动到底部
        container.scrollTop = container.scrollHeight;
    }, 1000);
}

// 初始化签到二维码按钮
function initQRCodeDisplay() {
    const qrcodeBtn = document.getElementById('qrcodeBtn');
    if (!qrcodeBtn) return;
    
    qrcodeBtn.addEventListener('click', function() {
        showNotification('签到二维码已生成', 'success');
        
        // 这里应该实现二维码生成和显示的逻辑...
    });
}

// 初始化课堂控制面板
function initClassroomControlPanel() {
    const startBtn = document.getElementById('startClassBtn');
    const pauseBtn = document.getElementById('pauseClassBtn');
    const endBtn = document.getElementById('endClassBtn');
    const timeDisplay = document.querySelector('.class-time-display');
    
    if (!startBtn || !pauseBtn || !endBtn || !timeDisplay) return;
    
    let classInterval;
    let seconds = 0;
    let isRunning = false;
    
    // 开始上课
    startBtn.addEventListener('click', function() {
        if (isRunning) return;
        
        isRunning = true;
        this.disabled = true;
        pauseBtn.disabled = false;
        endBtn.disabled = false;
        
        // 开始计时
        classInterval = setInterval(updateTimeDisplay, 1000);
        
        showNotification('课堂已开始', 'success');
    });
    
    // 暂停上课
    pauseBtn.addEventListener('click', function() {
        if (!isRunning) {
            // 如果当前是暂停状态，恢复计时
            isRunning = true;
            this.innerHTML = '<i class="fas fa-pause"></i><span class="zh">暂停</span><span class="en">Pause</span>';
            classInterval = setInterval(updateTimeDisplay, 1000);
            showNotification('课堂已恢复', 'info');
        } else {
            // 暂停计时
            isRunning = false;
            this.innerHTML = '<i class="fas fa-play"></i><span class="zh">继续</span><span class="en">Resume</span>';
            clearInterval(classInterval);
            showNotification('课堂已暂停', 'warning');
        }
    });
    
    // 结束上课
    endBtn.addEventListener('click', function() {
        isRunning = false;
        clearInterval(classInterval);
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        endBtn.disabled = true;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span class="zh">暂停</span><span class="en">Pause</span>';
        
        // 弹出确认对话框
        const confirmEnd = confirm('确定要结束本次课堂吗？');
        if (confirmEnd) {
            seconds = 0;
            updateTimeDisplay();
            showNotification('课堂已结束', 'info');
        } else {
            // 如果取消，恢复计时
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            endBtn.disabled = false;
            isRunning = true;
            classInterval = setInterval(updateTimeDisplay, 1000);
        }
    });
    
    // 更新时间显示
    function updateTimeDisplay() {
        if (isRunning) {
            seconds++;
        }
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        timeDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 初始化时间显示
    updateTimeDisplay();
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initAIPre();
    initAIInClass();
    initAIPreTabs();
}); 