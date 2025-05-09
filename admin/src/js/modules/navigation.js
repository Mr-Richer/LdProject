/**
 * 导航模块
 * 处理侧边栏导航、语言切换和页面切换
 */

// 导航初始化函数
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
            
            // 获取目标内容区域的ID
            const targetSection = this.getAttribute('data-section');
            const targetContentId = `${targetSection}-section`;
            
            // 隐藏所有内容区域
            contentSections.forEach(section => {
                section.classList.remove('active');
                
                // 添加淡出效果
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
            });
            
            // 显示目标内容区域
            const targetContent = document.getElementById(targetContentId);
            if (targetContent) {
                setTimeout(() => {
                    targetContent.classList.add('active');
                    
                    // 添加淡入效果
                    setTimeout(() => {
                        targetContent.style.opacity = '1';
                        targetContent.style.transform = 'translateY(0)';
                    }, 50);
                }, 300); // 等待淡出效果完成
            }
            
            // 更新页面标题
            if (pageTitleZh && pageTitleEn) {
                const navTextZh = this.querySelector('.nav-text.zh').textContent;
                const navTextEn = this.querySelector('.nav-text.en').textContent;
                
                pageTitleZh.textContent = navTextZh;
                pageTitleEn.textContent = navTextEn;
            }
        });
    });
}

// 初始化语言切换功能
function initLanguageToggle() {
    const languageBtn = document.getElementById('langToggle');
    if (!languageBtn) return;
    
    // 从localStorage中获取语言设置，或默认为中文
    const storedLang = localStorage.getItem('preferred-language') || 'zh';
    document.documentElement.setAttribute('lang', storedLang);
    document.body.classList.toggle('en-mode', storedLang === 'en');
    
    languageBtn.addEventListener('click', function() {
        // 切换语言模式
        const isCurrentlyEnglish = document.body.classList.contains('en-mode');
        document.body.classList.toggle('en-mode');
        
        // 更新HTML语言属性
        const newLang = isCurrentlyEnglish ? 'zh' : 'en';
        document.documentElement.setAttribute('lang', newLang);
        
        // 保存语言偏好
        localStorage.setItem('preferred-language', newLang);
        
        // 触发语言更改事件
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

// 初始化选项卡切换
function initTabSwitching() {
    const tabGroups = document.querySelectorAll('.tab-group');
    
    tabGroups.forEach(group => {
        const tabs = group.querySelectorAll('.tab');
        const tabContents = group.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 获取目标内容ID
                const targetContentId = this.getAttribute('data-tab');
                
                // 移除所有标签和内容的活动状态
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.style.opacity = '0';
                });
                
                // 添加活动状态到当前标签
                this.classList.add('active');
                
                // 显示目标内容
                const targetContent = document.getElementById(targetContentId);
                if (targetContent) {
                    setTimeout(() => {
                        targetContent.classList.add('active');
                        
                        // 添加淡入效果
                        setTimeout(() => {
                            targetContent.style.opacity = '1';
                        }, 50);
                    }, 200);
                }
            });
        });
    });
}

// 内容区域动画
function animateContentChange(element) {
    if (!element) return;
    
    // 创建进入动画效果
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}

// 标签内容切换动画
function animateTabContentChange(content) {
    if (!content) return;
    
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 100);
}

// DOM加载完成后初始化导航
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initLanguageToggle();
    initTabSwitching();
}); 