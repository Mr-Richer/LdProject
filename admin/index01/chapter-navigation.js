/**
 * 章节导航脚本 - 处理从首页跳转到备课和上课界面
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化课程章节导航
    initChapterNavigation();
});

/**
 * 初始化章节导航功能
 */
function initChapterNavigation() {
    // 获取所有备课按钮
    const prepareBtns = document.querySelectorAll('.chapter-action-btn.prepare');
    
    // 为每个备课按钮添加点击事件
    prepareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取章节信息
            const chapterCard = this.closest('.chapter-card');
            const chapterTitle = chapterCard.querySelector('.chapter-title.zh').textContent;
            
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
                                if (options[i].value === chapterNumber && options[i].classList.contains('zh')) {
                                    chapterSelect.selectedIndex = i;
                                    // 手动触发变更事件
                                    const event = new Event('change');
                                    chapterSelect.dispatchEvent(event);
                                    break;
                                }
                            }
                        }
                        
                        // 更新课件编辑器内容
                        updateUIForChapter(chapterTitle);
                        
                        // 显示通知
                        showNotification(`正在准备${chapterTitle}的课前内容...`, 'success');
                    }, 300);
                }
            } else {
                showNotification(`无法确定章节编号，请手动选择章节`, 'warning');
            }
        });
    });
    
    // 上课按钮点击事件
    const teachBtns = document.querySelectorAll('.chapter-action-btn.teach');
    teachBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterCard = this.closest('.chapter-card');
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

/**
 * 根据章节标题更新UI界面
 * @param {string} chapterTitle - 章节标题
 */
function updateUIForChapter(chapterTitle) {
    // 更新课件编辑器内容
    const slideTitle = document.querySelector('.slide-title-editor');
    if (slideTitle) {
        slideTitle.textContent = `${chapterTitle} - 幻灯片标题`;
    }
    
    const slideBody = document.querySelector('.slide-body-editor');
    if (slideBody) {
        slideBody.innerHTML = `<p>这里是${chapterTitle}的内容，请编辑...</p>`;
    }
    
    // 更新小测题目
    const questionText = document.querySelector('.question-text .zh');
    if (questionText) {
        questionText.textContent = `关于${chapterTitle}的问题示例`;
    }
    
    // 更新知识拓展
    const promptInput = document.querySelector('.knowledge-generation .prompt-input.zh');
    if (promptInput) {
        promptInput.placeholder = `请输入关于${chapterTitle}的知识点...`;
    }
}

/**
 * 显示通知
 * 重新实现，以防在script.js之前加载
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (info, success, warning, error)
 */
function showNotification(message, type = 'info') {
    // 如果全局已有showNotification，使用它
    if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // 否则创建一个简单的通知
    let notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 渐入效果
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
} 