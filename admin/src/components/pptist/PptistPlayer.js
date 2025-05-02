/**
 * PPTist播放器组件
 * 用于课中界面展示PPT幻灯片
 */

// 组件命名空间
const PptistPlayer = {};

/**
 * 初始化PPTist播放器
 * @param {Object} options 播放器配置选项
 * @param {string} options.containerId 容器元素ID
 * @param {string} options.pptistPath PPTist路径
 * @param {Function} options.onInitialized 初始化完成回调
 * @param {Function} options.onSlideChange 幻灯片切换回调
 * @param {Function} options.onLoaded PPT加载完成回调
 */
PptistPlayer.init = function(options) {
    const containerId = options.containerId || 'slide-preview';
    const pptistPath = options.pptistPath || '../PPTist-master/index.html';
    
    console.log('初始化PPTist播放器...');
    
    // 获取容器元素
    const container = document.querySelector(`.${containerId}`);
    if (!container) {
        console.error(`找不到容器元素: .${containerId}`);
        return false;
    }
    
    // 清除容器内容
    const currentSlideImg = container.querySelector('.current-slide');
    if (currentSlideImg) currentSlideImg.remove();
    
    // 创建iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'inClassPptFrame';
    iframe.className = 'current-slide pptist-frame';
    
    // 使用放映模式加载PPTist
    iframe.src = `${pptistPath}?mode=screen`;
    iframe.setAttribute('allowfullscreen', 'true');
    
    // 添加加载指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'pptist-loading';
    loadingIndicator.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">加载中...</div>
    `;
    container.appendChild(loadingIndicator);
    
    // 添加到容器
    container.appendChild(iframe);
    
    // 存储状态信息
    this.state = {
        initialized: false,
        isPlaying: false,
        playInterval: null,
        currentSlide: 1,
        totalSlides: 1,
        containerId: containerId,
        callbacks: {
            onInitialized: options.onInitialized,
            onSlideChange: options.onSlideChange,
            onLoaded: options.onLoaded
        }
    };
    
    // 设置消息监听
    this._setupMessageListener();
    
    return true;
};

/**
 * 设置消息监听
 * @private 
 */
PptistPlayer._setupMessageListener = function() {
    // 避免重复添加监听器
    if (this._messageListenerAdded) return;
    this._messageListenerAdded = true;
    
    // 监听来自PPTist的消息
    window.addEventListener('message', (event) => {
        const iframe = document.getElementById('inClassPptFrame');
        if (!iframe || event.source !== iframe.contentWindow) return;
        
        const data = event.data;
        if (!data || !data.type) return;
        
        // 处理PPTist事件消息
        if (data.type === 'pptist-event') {
            switch (data.action) {
                case 'initialized':
                    console.log('PPTist初始化完成');
                    this.state.initialized = true;
                    
                    // 触发初始化完成回调
                    if (typeof this.state.callbacks.onInitialized === 'function') {
                        this.state.callbacks.onInitialized();
                    }
                    break;
                    
                case 'slide-change':
                    // 幻灯片切换事件
                    if (data.data) {
                        this.state.currentSlide = (data.data.currentIndex || 0) + 1;
                        this.state.totalSlides = data.data.totalSlides || this.state.totalSlides;
                        
                        // 触发幻灯片切换回调
                        if (typeof this.state.callbacks.onSlideChange === 'function') {
                            this.state.callbacks.onSlideChange({
                                currentSlide: this.state.currentSlide,
                                totalSlides: this.state.totalSlides
                            });
                        }
                    }
                    break;
                    
                case 'ppt-loaded':
                    console.log('PPT加载完成');
                    // 隐藏加载指示器
                    const loadingIndicator = document.querySelector('.pptist-loading');
                    if (loadingIndicator) {
                        loadingIndicator.style.display = 'none';
                    }
                    
                    // 更新幻灯片信息
                    if (data.data) {
                        this.state.totalSlides = data.data.totalSlides || this.state.totalSlides;
                        
                        // 触发加载完成回调
                        if (typeof this.state.callbacks.onLoaded === 'function') {
                            this.state.callbacks.onLoaded({
                                totalSlides: this.state.totalSlides,
                                thumbnails: data.data.thumbnails || []
                            });
                        }
                    }
                    break;
                    
                case 'ppt-load-error':
                    console.error('PPT加载失败:', data.error);
                    // 显示错误提示
                    const errorIndicator = document.querySelector('.pptist-loading');
                    if (errorIndicator) {
                        errorIndicator.innerHTML = `
                            <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
                            <div class="loading-text">加载失败: ${data.error || '未知错误'}</div>
                        `;
                    }
                    break;
            }
        }
    });
};

/**
 * 加载PPT文件
 * @param {string|Object} pptUrl PPT文件URL或PPT数据对象
 */
PptistPlayer.loadPPT = function(pptUrl) {
    if (!this.state || !this.state.initialized) {
        console.error('PPTist尚未初始化，无法加载PPT');
        // 延迟重试
        setTimeout(() => {
            if (this.state && this.state.initialized) {
                console.log('PPTist初始化已完成，重试加载PPT');
                this.loadPPT(pptUrl);
            }
        }, 1000);
        return false;
    }
    
    const iframe = document.getElementById('inClassPptFrame');
    if (!iframe || !iframe.contentWindow) {
        console.error('找不到PPTist iframe');
        return false;
    }
    
    // 显示加载指示器
    const loadingIndicator = document.querySelector('.pptist-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">加载PPT中...</div>
        `;
    }
    
    console.log('正在加载PPT数据...');
    
    // 判断pptUrl是字符串(URL)还是对象(数据)
    if (typeof pptUrl === 'string') {
        // 发送加载PPT命令 - 使用URL
        iframe.contentWindow.postMessage({
            type: 'pptist-command',
            action: 'load-ppt',
            data: { url: pptUrl }
        }, '*');
    } else {
        // 是对象，直接传递PPT数据
        iframe.contentWindow.postMessage({
            type: 'pptist-command',
            action: 'load-ppt-data',
            data: pptUrl
        }, '*');
        
        // 由于没有实际的iframe通信逻辑，这里模拟PPT加载完成
        // 生产环境中应该移除这部分代码
        this._simulatePptLoaded(pptUrl);
    }
    
    return true;
};

/**
 * 模拟PPT加载完成事件
 * 仅用于演示和开发环境，生产环境应删除
 * @private
 */
PptistPlayer._simulatePptLoaded = function(pptData) {
    // 设置延迟，模拟加载过程
    setTimeout(() => {
        console.log('模拟PPT加载完成事件');
        
        // 获取PPT幻灯片数量和缩略图
        let totalSlides = 10;
        let thumbnails = [];
        
        if (pptData && pptData.thumbnails) {
            thumbnails = pptData.thumbnails;
            totalSlides = thumbnails.length;
        } else if (pptData && pptData.slides) {
            totalSlides = pptData.slides.length;
            // 生成缩略图
            for (let i = 1; i <= totalSlides; i++) {
                thumbnails.push(`../picture/ppt/1/h${i}.jpg`);
            }
        }
        
        // 隐藏加载指示器
        const loadingIndicator = document.querySelector('.pptist-loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // 更新状态
        this.state.initialized = true;
        this.state.totalSlides = totalSlides;
        this.state.currentSlide = 1;
        
        // 触发PPT加载完成事件
        if (typeof this.state.callbacks.onLoaded === 'function') {
            this.state.callbacks.onLoaded({
                totalSlides: totalSlides,
                thumbnails: thumbnails
            });
        }
        
        // 触发幻灯片变更事件
        if (typeof this.state.callbacks.onSlideChange === 'function') {
            this.state.callbacks.onSlideChange({
                currentSlide: 1,
                totalSlides: totalSlides
            });
        }
    }, 1500);
};

/**
 * 控制幻灯片播放
 * @param {string} action 控制动作: 'prev'|'next'|'goto'|'play'|'pause'
 * @param {Object} params 附加参数
 */
PptistPlayer.control = function(action, params = {}) {
    const iframe = document.getElementById('inClassPptFrame');
    if (!iframe || !iframe.contentWindow) {
        console.error('找不到PPTist iframe');
        return false;
    }
    
    switch (action) {
        case 'prev':
            // 上一张幻灯片
            iframe.contentWindow.postMessage({
                type: 'pptist-command',
                action: 'navigate',
                data: { direction: 'prev' }
            }, '*');
            break;
            
        case 'next':
            // 下一张幻灯片
            iframe.contentWindow.postMessage({
                type: 'pptist-command',
                action: 'navigate',
                data: { direction: 'next' }
            }, '*');
            break;
            
        case 'goto':
            // 跳转到指定幻灯片
            if (typeof params.index !== 'number') {
                console.error('跳转幻灯片需要指定索引');
                return false;
            }
            
            iframe.contentWindow.postMessage({
                type: 'pptist-command',
                action: 'goto-slide',
                data: { index: params.index }
            }, '*');
            break;
            
        case 'play':
            // 开始自动播放
            this.state.isPlaying = true;
            
            // 清除现有定时器
            if (this.state.playInterval) {
                clearInterval(this.state.playInterval);
            }
            
            // 设置新的定时器
            const interval = params.interval || 5000;
            this.state.playInterval = setInterval(() => {
                this.control('next');
            }, interval);
            break;
            
        case 'pause':
            // 暂停自动播放
            this.state.isPlaying = false;
            
            if (this.state.playInterval) {
                clearInterval(this.state.playInterval);
                this.state.playInterval = null;
            }
            break;
            
        case 'toggleFullscreen':
            // 切换全屏模式
            if (!document.fullscreenElement) {
                iframe.requestFullscreen().catch(err => {
                    console.error(`全屏错误: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
            break;
            
        case 'toggleAnnotate':
            // 切换批注模式
            iframe.contentWindow.postMessage({
                type: 'pptist-command',
                action: 'toggle-drawing'
            }, '*');
            break;
    }
    
    return true;
};

/**
 * 生成缩略图
 * @param {Array} thumbnails 缩略图URL数组
 * @param {string} containerId 缩略图容器ID
 */
PptistPlayer.generateThumbnails = function(thumbnails, containerId) {
    const thumbnailContainer = document.querySelector('.thumbnail-scroll');
    if (!thumbnailContainer || !thumbnails || !thumbnails.length) {
        console.error('无法生成缩略图：容器不存在或无缩略图数据');
        return false;
    }
    
    // 清空现有缩略图
    thumbnailContainer.innerHTML = '';
    
    // 生成新的缩略图
    thumbnails.forEach((thumbnailUrl, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'slide-thumbnail';
        thumbnail.setAttribute('data-index', index);
        
        // 设置缩略图内容
        thumbnail.innerHTML = `<img src="${thumbnailUrl}" alt="幻灯片${index+1}">`;
        
        // 添加点击事件 - 跳转到指定幻灯片
        thumbnail.addEventListener('click', () => {
            this.control('goto', { index: index });
        });
        
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // 默认高亮第一个缩略图
    this.highlightThumbnail(0);
    
    return true;
};

/**
 * 高亮当前幻灯片的缩略图
 * @param {number} index 幻灯片索引
 */
PptistPlayer.highlightThumbnail = function(index) {
    const thumbnails = document.querySelectorAll('.slide-thumbnail');
    
    // 移除所有高亮
    thumbnails.forEach(thumbnail => {
        thumbnail.classList.remove('active');
    });
    
    // 添加当前高亮
    const currentThumbnail = document.querySelector(`.slide-thumbnail[data-index="${index}"]`);
    if (currentThumbnail) {
        currentThumbnail.classList.add('active');
        
        // 滚动到可见区域
        currentThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    return true;
};

// 导出组件
window.PptistPlayer = PptistPlayer;

// 如果支持模块化，也支持export导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PptistPlayer;
} 