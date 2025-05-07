// 章节加载器模块
(function() {
    'use strict';
    
    // 等待DOM加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化章节选择器
        initChapterSelectors();
    });
    
    // 初始化所有章节选择器
    function initChapterSelectors() {
        // 查找课前章节选择器
        const preClassSelector = document.getElementById('chapter-select');
        if (preClassSelector) {
            loadChaptersIntoSelector(preClassSelector, function() {
                // 在加载完成后，如果用户已选择章节，加载相应的题目
                if (preClassSelector.value) {
                    if (typeof window.loadChapterQuestions === 'function') {
                        window.loadChapterQuestions(preClassSelector.value);
                    } else {
                        console.warn('loadChapterQuestions函数未定义，无法加载题目');
                    }
                }
            });
            
            // 添加章节选择事件监听
            preClassSelector.addEventListener('change', function() {
                const selectedChapterId = this.value;
                if (selectedChapterId) {
                    console.log('章节选择变更:', selectedChapterId);
                    // 调用题目加载函数
                    if (typeof window.loadChapterQuestions === 'function') {
                        window.loadChapterQuestions(selectedChapterId);
                    } else {
                        console.warn('loadChapterQuestions函数未定义，无法加载题目');
                    }
                }
            });
        }
        
        // 查找课中章节选择器
        const inClassSelector = document.getElementById('in-class-chapter-select');
        if (inClassSelector) {
            loadChaptersIntoSelector(inClassSelector);
        }
    }
    
    // 加载章节数据到选择器中
    function loadChaptersIntoSelector(selector, callback) {
        if (!selector) return;
        
        // 显示加载中状态
        selector.innerHTML = '<option disabled selected class="zh">加载中...</option><option disabled selected class="en">Loading...</option>';
        
        // 获取API基础URL
        const apiBaseUrl = window.API_BASE_URL || 'http://localhost:3000';
        
        // 使用fetch获取章节数据
        fetch(`${apiBaseUrl}/api/chapters`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                if (result.code === 200 && result.data && result.data.chapters && result.data.chapters.length > 0) {
                    // 清空现有选项
                    selector.innerHTML = '';
                    
                    // 按章节编号排序
                    const sortedChapters = result.data.chapters.sort((a, b) => a.chapter_number - b.chapter_number);
                    
                    // 添加章节选项
                    sortedChapters.forEach(chapter => {
                        // 添加中文选项
                        const optionZh = document.createElement('option');
                        optionZh.value = chapter.chapter_number;
                        optionZh.textContent = `第${chapter.chapter_number}章：${chapter.title_zh || ''}`;
                        optionZh.classList.add('zh');
                        selector.appendChild(optionZh);
                        
                        // 添加英文选项
                        const optionEn = document.createElement('option');
                        optionEn.value = chapter.chapter_number;
                        optionEn.textContent = `Chapter ${chapter.chapter_number}: ${chapter.title_en || ''}`;
                        optionEn.classList.add('en');
                        selector.appendChild(optionEn);
                    });
                    
                    console.log(`章节选择器初始化完成，加载了${sortedChapters.length}个章节`);
                    
                    // 选择第一个章节（如果没有预选）
                    const currentLang = document.body.classList.contains('en-mode') ? 'en' : 'zh';
                    if (selector.selectedIndex === -1) {
                        const firstOption = selector.querySelector(`option.${currentLang}`);
                        if (firstOption) firstOption.selected = true;
                    }
                    
                    // 调用回调函数（如果提供）
                    if (typeof callback === 'function') {
                        callback();
                    }
                } else {
                    // 没有数据时显示提示
                    selector.innerHTML = '<option disabled selected class="zh">暂无章节数据</option><option disabled selected class="en">No chapters available</option>';
                    console.error('未获取到章节数据');
                    showChapterLoadError(selector.parentNode, '未获取到章节数据，请检查API连接');
                }
            })
            .catch(error => {
                console.error('获取章节数据出错:', error);
                selector.innerHTML = '<option disabled selected class="zh">获取数据失败</option><option disabled selected class="en">Failed to load data</option>';
                showChapterLoadError(selector.parentNode, `加载章节失败: ${error.message}`);
            });
    }
    
    // 显示章节加载错误
    function showChapterLoadError(container, message) {
        if (!container) return;
        
        // 检查是否已有错误消息
        const existingError = container.querySelector('.chapter-error');
        if (existingError) {
            existingError.remove();
        }
        
        // 创建错误消息
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chapter-error';
        errorDiv.innerHTML = `
            <div class="error-icon">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="error-content">
                <p>${message}</p>
            </div>
            <button class="retry-btn">
                <i class="fas fa-sync-alt"></i>
                <span class="zh">重试</span>
                <span class="en">Retry</span>
            </button>
        `;
        
        // 添加错误样式
        const style = document.createElement('style');
        style.textContent = `
            .chapter-error {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                margin: 10px 0;
                background-color: #ffebee;
                border-left: 4px solid #f44336;
                border-radius: 4px;
                color: #d32f2f;
            }
            .chapter-error .error-icon {
                margin-right: 10px;
                color: #f44336;
            }
            .chapter-error .error-content {
                flex: 1;
            }
            .chapter-error .retry-btn {
                padding: 5px 10px;
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 10px;
                font-size: 12px;
            }
            .chapter-error .retry-btn:hover {
                background-color: #d32f2f;
            }
            .chapter-error .retry-btn i {
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style);
        
        // 添加到容器
        container.appendChild(errorDiv);
        
        // 添加重试按钮事件
        const retryBtn = errorDiv.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', function() {
                errorDiv.remove();
                // 获取选择器并重新加载
                const selector = container.querySelector('select');
                if (selector) {
                    loadChaptersIntoSelector(selector, function() {
                        if (selector.value && typeof window.loadChapterQuestions === 'function') {
                            window.loadChapterQuestions(selector.value);
                        }
                    });
                }
            });
        }
    }
    
    // 将函数暴露到全局作用域，方便外部调用
    window.initChapterSelectors = initChapterSelectors;
    window.loadChaptersIntoSelector = loadChaptersIntoSelector;
})(); 