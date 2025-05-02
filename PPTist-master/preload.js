/**
 * 预加载脚本 - 用于在PPTist加载时处理外部消息
 */

// 在窗口加载完成后执行
window.addEventListener('load', function() {
    console.log('PPTist preload script initialized');
    
    // 通知父窗口PPTist已初始化
    sendMessageToParent('initialized');
    
    // 监听来自父窗口的消息
    window.addEventListener('message', function(event) {
        // 只处理命令类型的消息
        if (!event.data || event.data.type !== 'pptist-command') return;
        
        const action = event.data.action;
        const data = event.data.data || {};
        
        console.log('Received command from parent:', action, data);
        
        switch (action) {
            case 'load-ppt':
                // 加载PPT数据
                loadPptData(data.url);
                break;
                
            case 'navigate':
                // 导航幻灯片
                navigateSlide(data.direction);
                break;
                
            case 'goto-slide':
                // 跳转到指定幻灯片
                gotoSlide(data.index);
                break;
                
            case 'toggle-drawing':
                // 切换绘图模式
                toggleDrawing();
                break;
        }
    });
    
    // 监听幻灯片变化
    monitorSlideChanges();
});

/**
 * 向父窗口发送消息
 * @param {string} action 动作类型
 * @param {Object} data 附加数据
 */
function sendMessageToParent(action, data = {}) {
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'pptist-event',
            action: action,
            data: data
        }, '*');
    }
}

/**
 * 加载PPT数据
 * @param {string} url PPT数据URL或对象
 */
function loadPptData(url) {
    try {
        // 获取PPTist的Vue实例
        const app = getVueApp();
        if (!app) {
            console.error('Cannot find PPTist Vue instance');
            sendMessageToParent('ppt-load-error', { error: 'Cannot find PPTist application' });
            return;
        }
        
        // 实际数据加载可能需要根据PPTist的API进行调整
        console.log('Loading PPT data...');
        
        // 模拟PPT加载完成
        setTimeout(() => {
            // 获取幻灯片总数
            const totalSlides = getSlideCount();
            
            // 生成缩略图URL数组
            const thumbnails = generateThumbnailUrls(totalSlides);
            
            // 通知父窗口PPT加载完成
            sendMessageToParent('ppt-loaded', {
                totalSlides: totalSlides,
                thumbnails: thumbnails
            });
        }, 1000);
    } catch (error) {
        console.error('Error loading PPT:', error);
        sendMessageToParent('ppt-load-error', { error: error.message });
    }
}

/**
 * 导航幻灯片
 * @param {string} direction 导航方向: 'prev' 或 'next'
 */
function navigateSlide(direction) {
    try {
        // 获取PPTist的Vue实例或幻灯片控制器
        const app = getVueApp();
        if (!app) {
            console.error('Cannot find PPTist Vue instance');
            return;
        }
        
        // 根据PPTist实际API调用相应方法
        if (direction === 'prev') {
            // 上一张幻灯片
            console.log('Navigate to previous slide');
        } else if (direction === 'next') {
            // 下一张幻灯片
            console.log('Navigate to next slide');
        }
    } catch (error) {
        console.error('Error navigating slide:', error);
    }
}

/**
 * 跳转到指定幻灯片
 * @param {number} index 幻灯片索引
 */
function gotoSlide(index) {
    try {
        // 获取PPTist的Vue实例或幻灯片控制器
        const app = getVueApp();
        if (!app) {
            console.error('Cannot find PPTist Vue instance');
            return;
        }
        
        // 根据PPTist实际API调用相应方法
        console.log('Go to slide:', index);
    } catch (error) {
        console.error('Error going to slide:', error);
    }
}

/**
 * 切换绘图模式
 */
function toggleDrawing() {
    try {
        // 获取PPTist的Vue实例或绘图控制器
        const app = getVueApp();
        if (!app) {
            console.error('Cannot find PPTist Vue instance');
            return;
        }
        
        // 根据PPTist实际API调用相应方法
        console.log('Toggle drawing mode');
    } catch (error) {
        console.error('Error toggling drawing mode:', error);
    }
}

/**
 * 监听幻灯片变化
 */
function monitorSlideChanges() {
    // 定期检查当前幻灯片索引
    setInterval(() => {
        const currentIndex = getCurrentSlideIndex();
        const totalSlides = getSlideCount();
        
        if (currentIndex !== undefined && totalSlides !== undefined) {
            sendMessageToParent('slide-change', {
                currentIndex: currentIndex,
                totalSlides: totalSlides
            });
        }
    }, 500);
}

/**
 * 获取PPTist的Vue应用实例
 * @returns {Object} Vue应用实例
 */
function getVueApp() {
    // 为了支持模拟数据，返回一个简单对象
    return {
        name: 'PPTist',
        version: '1.0.0',
        mode: 'screen',
        simulate: true
    };
}

/**
 * 获取当前幻灯片索引
 * @returns {number} 当前幻灯片索引
 */
function getCurrentSlideIndex() {
    // 在真实环境中应该从Vue应用中获取
    // 这里为了演示，返回一个随机值或存储的静态值
    
    // 如果window上没有存储当前索引，初始化为0
    if (typeof window.currentSlideIndex === 'undefined') {
        window.currentSlideIndex = 0;
    }
    
    // 模拟幻灯片切换 - 每10秒增加1
    const now = new Date().getTime();
    if (!window.lastSlideChange || now - window.lastSlideChange > 10000) {
        window.lastSlideChange = now;
        window.currentSlideIndex = (window.currentSlideIndex + 1) % getSlideCount();
    }
    
    return window.currentSlideIndex;
}

/**
 * 获取幻灯片总数
 * @returns {number} 幻灯片总数
 */
function getSlideCount() {
    // 在真实环境中应该从Vue应用中获取
    // 这里返回一个固定值，用于演示
    return 10;
}

/**
 * 生成缩略图URL数组
 * @param {number} count 幻灯片数量
 * @returns {Array} 缩略图URL数组
 */
function generateThumbnailUrls(count) {
    const thumbnails = [];
    for (let i = 1; i <= count; i++) {
        thumbnails.push(`../picture/ppt/1/h${i}.jpg`);
    }
    return thumbnails;
} 