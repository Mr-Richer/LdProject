/**
 * 章节模块
 * 包含章节加载、渲染、交互和导航功能
 */

// 初始化章节卡片交互
function initChapterCards() {
    // 为章节卡片添加点击事件
    document.addEventListener('click', function(event) {
        // 检查是否点击了章节卡片的可点击区域
        let clickedCard = event.target.closest('.chapter-card');
        
        // 防止重复点击或点击已经展开的卡片
        if (!clickedCard || event.target.closest('.chapter-action-btn')) {
            return;
        }
        
        // 获取所有卡片
        const allCards = document.querySelectorAll('.chapter-card');
        
        // 切换卡片的展开状态
        if (clickedCard.classList.contains('expanded')) {
            // 如果已经展开，则收起
            clickedCard.classList.remove('expanded');
        } else {
            // 收起所有其他卡片
            allCards.forEach(card => card.classList.remove('expanded'));
            
            // 展开当前点击的卡片
            clickedCard.classList.add('expanded');
        }
    });
}

// 初始化章节模态框
function initChapterModal() {
    const newChapterBtn = document.getElementById('newChapterBtn');
    const chapterModal = document.getElementById('chapterModal');
    const closeModalBtn = document.querySelector('#chapterModal .close-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // 打开模态框
    if (newChapterBtn) {
        newChapterBtn.addEventListener('click', () => {
            if (chapterModal) {
                chapterModal.classList.add('active');
                modalOverlay.classList.add('active');
            }
        });
    }
    
    // 关闭模态框的函数
    function closeModal() {
        if (chapterModal) {
            chapterModal.classList.remove('active');
            modalOverlay.classList.remove('active');
        }
    }
    
    // 点击关闭按钮
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // 点击遮罩层
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(event) {
            // 确保点击的是遮罩层而不是模态框内部
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // ESC键关闭
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && chapterModal && chapterModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // 初始化表单提交
    const chapterForm = document.getElementById('chapterForm');
    if (chapterForm) {
        chapterForm.addEventListener('submit', handleChapterFormSubmit);
    }
}

// 处理章节表单提交
async function handleChapterFormSubmit(event) {
    event.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(event.target);
    
    try {
        // 模拟API调用
        if (window.isOfflineMode) {
            // 延迟以模拟网络请求
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 模拟响应
            console.log('模拟创建章节', Object.fromEntries(formData));
            showNotification('章节创建成功（模拟模式）', 'success');
        } else {
            // 实际API调用
            const response = await fetch(`${window.API_BASE_URL}/api/chapters`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('章节创建成功', result);
            showNotification('章节创建成功', 'success');
        }
        
        // 关闭模态框
        const chapterModal = document.getElementById('chapterModal');
        const modalOverlay = document.querySelector('.modal-overlay');
        if (chapterModal) {
            chapterModal.classList.remove('active');
            modalOverlay.classList.remove('active');
        }
        
        // 重新加载章节列表
        loadChapters();
        
        // 重置表单
        event.target.reset();
    } catch (error) {
        console.error('章节创建失败', error);
        showNotification(`章节创建失败: ${error.message}`, 'error');
    }
}

// 加载课程章节数据
async function loadChapters() {
    const chaptersContainer = document.querySelector('.chapters-container .chapters-grid');
    if (!chaptersContainer) return;
    
    try {
        let chapters;
        
        if (window.isOfflineMode) {
            // 使用模拟数据
            chapters = [
                { id: 1, title: "第1章：中国古代文化概述", status: "published", image: "../picture/cn_culture1.jpg", progress: 100 },
                { id: 2, title: "第2章：先秦诸子百家", status: "published", image: "../picture/cn_culture2.jpg", progress: 85 },
                { id: 3, title: "第3章：汉唐文化辉煌", status: "draft", image: "../picture/cn_culture3.jpg", progress: 65 },
                { id: 4, title: "第4章：宋明理学", status: "draft", image: "../picture/cn_culture4.jpg", progress: 40 },
                { id: 5, title: "第5章：近现代文化变革", status: "planning", image: "../picture/cn_culture5.jpg", progress: 20 }
            ];
            
            // 延迟以模拟网络请求
            await new Promise(resolve => setTimeout(resolve, 800));
        } else {
            // 实际API调用
            const response = await fetch(`${window.API_BASE_URL}/api/chapters`);
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            chapters = await response.json();
        }
        
        // 更新统计数据
        updateChapterStats(chapters);
        
        // 渲染章节
        renderChapters(chapters);
        
        // 初始化章节导航按钮
        initChapterNavButtons();
    } catch (error) {
        console.error('加载章节失败', error);
        showNotification(`加载章节失败: ${error.message}`, 'error');
        
        // 显示错误状态
        chaptersContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p class="zh">加载章节数据失败</p>
                <p class="en">Failed to load chapters</p>
                <button class="retry-btn">
                    <i class="fas fa-redo"></i>
                    <span class="zh">重试</span>
                    <span class="en">Retry</span>
                </button>
            </div>
        `;
        
        // 添加重试按钮事件
        const retryBtn = chaptersContainer.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', loadChapters);
        }
    }
}

// 渲染章节列表
function renderChapters(chapters) {
    const chaptersContainer = document.querySelector('.chapters-container .chapters-grid');
    if (!chaptersContainer) return;
    
    if (!chapters || chapters.length === 0) {
        chaptersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book"></i>
                <p class="zh">暂无章节</p>
                <p class="en">No chapters yet</p>
            </div>
        `;
        return;
    }
    
    // 准备HTML
    let chaptersHTML = '';
    
    chapters.forEach(chapter => {
        // 处理图片路径
        const imagePath = processImageUrl(chapter.image);
        
        chaptersHTML += `
            <div class="chapter-card" data-id="${chapter.id}">
                <div class="chapter-header">
                    <div class="chapter-img-container">
                        <img src="${imagePath}" alt="${chapter.title}" class="chapter-img">
                    </div>
                    <div class="chapter-info">
                        <h3 class="chapter-title zh">${chapter.title}</h3>
                        <div class="chapter-status ${chapter.status}">
                            <span class="zh">${getStatusText(chapter.status, 'zh')}</span>
                            <span class="en">${getStatusText(chapter.status, 'en')}</span>
                        </div>
                    </div>
                </div>
                <div class="chapter-actions">
                    <button class="chapter-action-btn prepare">
                        <i class="fas fa-edit"></i>
                        <span class="zh">备课</span>
                        <span class="en">Prepare</span>
                    </button>
                    <button class="chapter-action-btn teach">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <span class="zh">上课</span>
                        <span class="en">Teach</span>
                    </button>
                </div>
                <div class="chapter-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${chapter.progress}%"></div>
                    </div>
                    <div class="progress-text">
                        <span class="zh">完成度：${chapter.progress}%</span>
                        <span class="en">Completion: ${chapter.progress}%</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    chaptersContainer.innerHTML = chaptersHTML;
}

// 处理图片URL
function processImageUrl(url) {
    // 如果是相对路径，调整为正确的相对路径
    if (url && url.startsWith('../picture/')) {
        // 从src/js/modules到admin/picture的路径
        return '../../../picture/' + url.split('/').pop();
    }
    
    // 返回原始URL或默认图片
    return url || '../../../picture/default-chapter.jpg';
}

// 获取状态文本
function getStatusText(status, lang) {
    if (lang === 'zh') {
        switch (status) {
            case 'published': return '已发布';
            case 'draft': return '草稿';
            case 'planning': return '计划中';
            default: return '未知状态';
        }
    } else {
        switch (status) {
            case 'published': return 'Published';
            case 'draft': return 'Draft';
            case 'planning': return 'Planning';
            default: return 'Unknown';
        }
    }
}

// 初始化章节导航按钮
function initChapterNavButtons() {
    const chaptersContainer = document.querySelector('.chapters-container');
    if (!chaptersContainer) return;
    
    // 创建导航按钮
    if (!document.querySelector('.chapter-nav-btn.prev-btn')) {
        const prevButton = document.createElement('button');
        prevButton.className = 'chapter-nav-btn prev-btn';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        chaptersContainer.appendChild(prevButton);
    }
    
    if (!document.querySelector('.chapter-nav-btn.next-btn')) {
        const nextButton = document.createElement('button');
        nextButton.className = 'chapter-nav-btn next-btn';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        chaptersContainer.appendChild(nextButton);
    }
    
    // 获取按钮元素
    const prevButton = document.querySelector('.chapter-nav-btn.prev-btn');
    const nextButton = document.querySelector('.chapter-nav-btn.next-btn');
    
    // 添加事件监听器
    prevButton.addEventListener('click', () => {
        chaptersContainer.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    nextButton.addEventListener('click', () => {
        chaptersContainer.scrollBy({ left: 300, behavior: 'smooth' });
    });
    
    // 监听滚动事件，更新按钮状态
    chaptersContainer.addEventListener('scroll', updateButtonsPosition);
    
    // 初始化按钮位置
    updateButtonsPosition();
    
    // 响应窗口大小变化
    window.addEventListener('resize', updateButtonsPosition);
    
    function updateButtonsPosition() {
        // 隐藏按钮的逻辑
        const scrollLeft = chaptersContainer.scrollLeft;
        const maxScrollLeft = chaptersContainer.scrollWidth - chaptersContainer.clientWidth;
        
        // 如果已经滚动到最左边，隐藏左按钮
        if (scrollLeft <= 10) {
            prevButton.classList.add('disabled');
        } else {
            prevButton.classList.remove('disabled');
        }
        
        // 如果已经滚动到最右边，隐藏右按钮
        if (scrollLeft >= maxScrollLeft - 10) {
            nextButton.classList.add('disabled');
        } else {
            nextButton.classList.remove('disabled');
        }
    }
}

// 更新章节统计信息
function updateChapterStats(chapters) {
    // 章节总数
    const totalChapters = chapters ? chapters.length : 0;
    const chapterCountElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
    if (chapterCountElement) {
        chapterCountElement.textContent = totalChapters;
    }
    
    // 已发布章节数
    const publishedChapters = chapters ? chapters.filter(chapter => chapter.status === 'published').length : 0;
    
    // 章节变化（简单模拟，实际应该从API获取）
    const chapterChange = document.querySelector('.stat-card:nth-child(1) .stat-change');
    if (chapterChange) {
        const changeSpan = chapterChange.querySelector('span');
        if (changeSpan) {
            // 这里简单模拟一个变化，实际中应该与前一次数据比较
            const change = Math.min(2, totalChapters);
            changeSpan.textContent = `+${change}`;
        }
    }
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initChapterCards();
    initChapterModal();
    loadChapters();
}); 