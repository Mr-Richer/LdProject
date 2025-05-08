/**
 * 思维导图初始化脚本
 * 负责加载和初始化思维导图模块
 */

// 在页面加载完成后初始化思维导图功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化思维导图功能');
    
    // 确保配置文件已加载
    ensureConfigLoaded();
    
    // 确保ECharts库加载
    loadEChartsIfNeeded();
    
    // 检查思维导图相关元素
    checkMindmapElements();
    
    // 添加调试按钮
    addDebugTools();
});

/**
 * 确保配置已加载
 */
function ensureConfigLoaded() {
    // 内联配置文件，避免使用export语法
    if (!window.APP_CONFIG) {
        window.APP_CONFIG = {
            API_BASE_URL: 'http://localhost:3000',
            UPLOAD_CONFIG: {
                image: {
                    url: 'http://localhost:3000/api/upload/image',
                    maxSize: 5 * 1024 * 1024, // 5MB
                    supportedTypes: ['image/jpeg', 'image/png', 'image/gif'],
                    defaultImage: '../picture/banner.jpg'
                },
                courseware: {
                    url: 'http://localhost:3000/api/upload/ppt',
                    maxSize: 100 * 1024 * 1024, // 100MB
                    supportedTypes: ['.ppt', '.pptx', '.pptist'],
                    defaultPath: '',
                    storagePath: '/uploads/ppt/', // 服务器存储路径
                    clientPath: '/uploads/ppt/' // 客户端访问路径
                }
            },
            CHAPTER_API: {
                list: 'http://localhost:3000/api/chapters',
                create: 'http://localhost:3000/api/chapters',
                update: function(id) { return `http://localhost:3000/api/chapters/${id}`; },
                delete: function(id) { return `http://localhost:3000/api/chapters/${id}`; },
                detail: function(id) { return `http://localhost:3000/api/chapters/${id}`; },
                copyImage: 'http://localhost:3000/api/admin/copy-image'
            }
        };
        console.log('配置已加载:', window.APP_CONFIG);
    }
}

/**
 * 加载ECharts库
 */
function loadEChartsIfNeeded() {
    if (typeof echarts === 'undefined') {
        console.log('未找到ECharts库，正在动态加载...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
        script.onload = function() {
            console.log('ECharts库加载成功，初始化思维导图');
            initMindmap();
        };
        script.onerror = function(error) {
            console.error('ECharts库加载失败:', error);
            showErrorMessage('加载图表库失败，请刷新页面重试');
        };
        document.head.appendChild(script);
    } else {
        console.log('已找到ECharts库，直接初始化思维导图');
        initMindmap();
    }
}

/**
 * 检查思维导图相关元素
 */
function checkMindmapElements() {
    // 检查思维导图容器
    const mindmapContainers = document.querySelectorAll('.mindmap-container');
    console.log(`找到 ${mindmapContainers.length} 个思维导图容器`);
    
    // 检查生成按钮
    const generateButtons = document.querySelectorAll('.generate-btn, .ai-generate-btn, #mindmap-generate-btn');
    console.log(`找到 ${generateButtons.length} 个生成按钮`);
    
    // 检查标签按钮
    const tabButtons = document.querySelectorAll('.tab-btn');
    console.log(`找到 ${tabButtons.length} 个标签按钮`);
    
    // 如果找不到容器，尝试创建一个临时容器
    if (mindmapContainers.length === 0) {
        const knowledgeContent = document.querySelector('#knowledge-content');
        if (knowledgeContent) {
            console.log('找到知识内容区域，创建思维导图容器');
            const container = document.createElement('div');
            container.className = 'mindmap-container';
            container.style.width = '100%';
            container.style.height = '500px';
            container.style.backgroundColor = '#f5f5f5';
            container.style.border = '1px solid #ddd';
            container.style.borderRadius = '5px';
            container.style.margin = '20px 0';
            knowledgeContent.appendChild(container);
            console.log('已创建思维导图容器');
        }
    }
}

/**
 * 添加调试工具按钮
 */
function addDebugTools() {
    // 创建调试按钮
    const debugButton = document.createElement('button');
    debugButton.textContent = '调试思维导图';
    debugButton.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 3px; padding: 5px 10px; cursor: pointer; z-index: 9999;';
    
    // 添加点击事件
    debugButton.addEventListener('click', function() {
        // 显示隐藏的调试信息
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) {
            debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
        } else {
            alert('调试信息不可用，请先生成思维导图');
        }
        
        // 显示环境信息
        console.log('当前环境信息:', {
            'ECharts可用': typeof echarts !== 'undefined',
            '思维导图模块可用': typeof StandaloneMindmap !== 'undefined',
            'API基础URL': window.APP_CONFIG?.API_BASE_URL,
            '当前页面URL': window.location.href,
            '认证令牌存在': !!localStorage.getItem('token')
        });
    });
    
    // 添加到页面
    document.body.appendChild(debugButton);
}

/**
 * 显示错误信息
 */
function showErrorMessage(message) {
    alert(message);
    
    // 如果有调试区域，也在那里显示
    const debugContent = document.getElementById('debug-content');
    if (debugContent) {
        const errorElement = document.createElement('div');
        errorElement.style.color = 'red';
        errorElement.textContent = `错误: ${message}`;
        debugContent.appendChild(errorElement);
        
        // 显示调试区域
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) {
            debugInfo.style.display = 'block';
        }
    }
}

/**
 * 初始化思维导图
 */
function initMindmap() {
    // 1. 先检查StandaloneMindmap对象是否可用
    if (!window.StandaloneMindmap) {
        console.error('错误: StandaloneMindmap对象不可用，请确保先加载standalone-mindmap.js');
        
        // 尝试动态加载脚本
        const scriptSrc = '../js/standalone-mindmap.js';
        console.log('尝试动态加载思维导图脚本:', scriptSrc);
        
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.onload = function() {
            console.log('思维导图脚本加载成功，重新初始化');
            if (window.StandaloneMindmap) {
                console.log('StandaloneMindmap对象已可用');
                setTimeout(function() {
                    StandaloneMindmap.init('.mindmap-container');
                }, 300);
            } else {
                showErrorMessage('思维导图组件加载失败，请刷新页面重试');
            }
        };
        script.onerror = function(error) {
            console.error('思维导图脚本加载失败:', error);
            showErrorMessage('思维导图组件加载失败，请刷新页面重试');
        };
        document.head.appendChild(script);
        return;
    }
    
    // 2. 思维导图Tab页切换处理
    const tabButton = document.querySelector('.tab-btn[data-tab="knowledge"]');
    if (tabButton) {
        console.log('找到知识拓展标签按钮');
        
        // 移除可能的旧事件监听器（通过克隆节点）
        const cloneTabButton = tabButton.cloneNode(true);
        tabButton.parentNode.replaceChild(cloneTabButton, tabButton);
        
        // 添加新的事件监听器
        cloneTabButton.addEventListener('click', function() {
            console.log('知识拓展标签被点击');
            // 延迟初始化，确保DOM已更新
            setTimeout(function() {
                console.log('延迟后初始化思维导图');
                StandaloneMindmap.init('.mindmap-container');
            }, 300);
        });
        
        // 如果默认打开的是知识拓展Tab，立即初始化
        if (cloneTabButton.classList.contains('active')) {
            console.log('知识拓展标签默认激活，立即初始化');
            setTimeout(function() {
                StandaloneMindmap.init('.mindmap-container');
            }, 300);
        }
    } else {
        console.log('未找到知识拓展标签按钮，尝试直接初始化');
        
        // 找到所有标签按钮，记录调试信息
        const allTabButtons = document.querySelectorAll('.tab-btn');
        console.log('所有标签按钮:', Array.from(allTabButtons).map(btn => ({
            text: btn.textContent,
            dataset: btn.dataset,
            className: btn.className
        })));
        
        // 尝试直接初始化
        setTimeout(function() {
            const container = document.querySelector('.mindmap-container');
            if (container) {
                console.log('找到思维导图容器，直接初始化');
                StandaloneMindmap.init('.mindmap-container');
                
                // 确保容器可见
                const parent = container.closest('.tab-content');
                if (parent) {
                    parent.style.display = 'block';
                }
            } else {
                console.error('错误: 未找到思维导图容器');
            }
        }, 500);
    }
    
    // 3. 修复生成按钮问题
    fixGenerateButtons();
}

/**
 * 修复生成按钮问题
 */
function fixGenerateButtons() {
    setTimeout(function() {
        // 查找所有可能的生成按钮，使用标准CSS选择器
        const selectors = [
            '.generate-btn', 
            '.ai-generate-btn', 
            '#mindmap-generate-btn',
            'button[class*="generate"]',
            'button[id*="generate"]'
        ].join(',');
        
        const generateButtons = document.querySelectorAll(selectors);
        console.log('通过选择器找到生成按钮数量:', generateButtons.length);
        
        // 使用数组存储所有匹配的按钮
        let allMatchedButtons = Array.from(generateButtons);
        
        // 如果通过选择器找不到足够的按钮，尝试通过文本内容查找
        if (generateButtons.length === 0) {
            // 获取所有按钮，然后过滤包含特定文本的按钮
            const allButtons = document.querySelectorAll('button');
            console.log('页面上所有按钮总数:', allButtons.length);
            
            const textMatchedButtons = Array.from(allButtons).filter(btn => {
                const text = btn.textContent.trim();
                return text.includes('生成') || 
                       text.includes('思维导图') || 
                       text.includes('AI生成');
            });
            
            console.log('通过文本内容找到的按钮数量:', textMatchedButtons.length);
            allMatchedButtons = allMatchedButtons.concat(textMatchedButtons);
        }
        
        // 移除重复的按钮（可能通过不同方式找到相同按钮）
        const uniqueButtons = [...new Set(allMatchedButtons)];
        console.log('最终处理的唯一按钮数量:', uniqueButtons.length);
        
        // 为每个按钮绑定事件
        uniqueButtons.forEach(btn => {
            console.log('处理生成按钮:', { 
                text: btn.textContent.trim(), 
                id: btn.id, 
                class: btn.className 
            });
            
            // 解除现有的点击事件监听器（通过克隆节点）
            const clone = btn.cloneNode(true);
            if (btn.parentNode) {
                btn.parentNode.replaceChild(clone, btn);
                
                // 添加新的点击事件
                clone.addEventListener('click', function(e) {
                    e.preventDefault();  // 防止表单提交
                    console.log('生成按钮被点击 - 直接事件处理', e.target);
                    
                    // 确保StandaloneMindmap对象可用
                    if (window.StandaloneMindmap && typeof StandaloneMindmap.generateMindmap === 'function') {
                        console.log('调用StandaloneMindmap.generateMindmap()');
                        StandaloneMindmap.generateMindmap();
                    } else {
                        console.error('StandaloneMindmap对象或generateMindmap方法不可用');
                        alert('思维导图生成器未正确加载，请刷新页面重试');
                    }
                });
                
                console.log('按钮事件已重新绑定');
            } else {
                console.warn('按钮没有父节点，无法替换:', btn);
            }
        });
    }, 1000);  // 延迟1秒，确保DOM已完全加载
} 