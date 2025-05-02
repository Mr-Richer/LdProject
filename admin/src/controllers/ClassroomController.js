/**
 * 课中界面控制器
 * 负责初始化和管理课中界面的PPTist组件
 */

const ClassroomController = {
    // 状态对象
    state: {
        currentChapterId: null,
        pptLoaded: false,
        viewStartTime: null,
        isFullscreen: false,
        recordInterval: null
    },
    
    /**
     * 初始化课中界面控制器
     */
    init: function() {
        console.log('初始化课中界面控制器...');
        
        // 初始化界面控制按钮
        this.initControlButtons();
        
        // 初始化PPTist播放器组件
        this.initPptPlayer();
        
        // 设置章节选择变更监听
        this.setupChapterSelectListener();
        
        console.log('课中界面控制器初始化完成');
    },
    
    /**
     * 初始化界面控制按钮
     */
    initControlButtons: function() {
        // 获取控制按钮
        const prevButton = document.getElementById('prev-slide-btn');
        const nextButton = document.getElementById('next-slide-btn');
        const playButton = document.getElementById('play-slides-btn');
        const fullscreenButton = document.getElementById('fullscreen-btn');
        const annotateButton = document.getElementById('annotate-btn');
        
        // 监听上一张按钮点击
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (window.PptistPlayer && this.state.pptLoaded) {
                    window.PptistPlayer.control('prev');
                }
            });
        }
        
        // 监听下一张按钮点击
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (window.PptistPlayer && this.state.pptLoaded) {
                    window.PptistPlayer.control('next');
                }
            });
        }
        
        // 监听播放/暂停按钮点击
        if (playButton) {
            playButton.addEventListener('click', () => {
                if (!window.PptistPlayer || !this.state.pptLoaded) return;
                
                if (playButton.classList.contains('playing')) {
                    // 暂停播放
                    window.PptistPlayer.control('pause');
                    playButton.classList.remove('playing');
                    playButton.querySelector('i').className = 'fas fa-play';
                    playButton.setAttribute('title', '自动播放');
                } else {
                    // 开始播放
                    window.PptistPlayer.control('play', { interval: 5000 });
                    playButton.classList.add('playing');
                    playButton.querySelector('i').className = 'fas fa-pause';
                    playButton.setAttribute('title', '暂停播放');
                }
            });
        }
        
        // 监听全屏按钮点击
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', () => {
                if (window.PptistPlayer && this.state.pptLoaded) {
                    window.PptistPlayer.control('toggleFullscreen');
                    
                    // 切换按钮状态
                    this.state.isFullscreen = !this.state.isFullscreen;
                    if (this.state.isFullscreen) {
                        fullscreenButton.querySelector('i').className = 'fas fa-compress';
                        fullscreenButton.setAttribute('title', '退出全屏');
                    } else {
                        fullscreenButton.querySelector('i').className = 'fas fa-expand';
                        fullscreenButton.setAttribute('title', '全屏显示');
                    }
                }
            });
        }
        
        // 监听批注按钮点击
        if (annotateButton) {
            annotateButton.addEventListener('click', () => {
                if (window.PptistPlayer && this.state.pptLoaded) {
                    window.PptistPlayer.control('toggleAnnotate');
                    
                    // 切换按钮状态
                    annotateButton.classList.toggle('active');
                    if (annotateButton.classList.contains('active')) {
                        annotateButton.setAttribute('title', '关闭批注');
                    } else {
                        annotateButton.setAttribute('title', '开启批注');
                    }
                }
            });
        }
        
        // 监听全屏变化事件
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                // 退出全屏时更新按钮状态
                this.state.isFullscreen = false;
                if (fullscreenButton) {
                    fullscreenButton.querySelector('i').className = 'fas fa-expand';
                    fullscreenButton.setAttribute('title', '全屏显示');
                }
            }
        });
    },
    
    /**
     * 初始化PPTist播放器
     */
    initPptPlayer: function() {
        // 检查PPTist播放器是否可用
        if (typeof window.PptistPlayer === 'undefined') {
            console.error('PPTist播放器组件未加载');
            
            // 显示错误提示
            const slidePreview = document.querySelector('.slide-preview');
            if (slidePreview) {
                slidePreview.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>PPTist播放器组件未加载</p>
                    </div>
                `;
            }
            return;
        }
        
        // 初始化PPTist播放器
        window.PptistPlayer.init({
            containerId: 'slide-preview',
            pptistPath: '../PPTist-master/index.html',
            onInitialized: () => {
                console.log('PPTist播放器初始化完成');
                
                // 检查当前选中的章节，并加载对应的PPT
                const chapterSelect = document.getElementById('in-class-chapter-select');
                if (chapterSelect && chapterSelect.value) {
                    this.loadChapterPPT(chapterSelect.value);
                } else {
                    // 加载演示PPT
                    this.loadDemoPPT();
                }
            },
            onSlideChange: (slideInfo) => {
                console.log(`幻灯片变更: ${slideInfo.currentSlide}/${slideInfo.totalSlides}`);
                
                // 更新幻灯片指示器
                this.updateSlideIndicator(slideInfo.currentSlide, slideInfo.totalSlides);
                
                // 高亮当前幻灯片的缩略图
                if (window.PptistPlayer) {
                    window.PptistPlayer.highlightThumbnail(slideInfo.currentSlide - 1);
                }
            },
            onLoaded: (pptInfo) => {
                console.log(`PPT加载完成，共${pptInfo.totalSlides}张幻灯片`);
                
                // 更新状态
                this.state.pptLoaded = true;
                
                // 更新幻灯片指示器
                this.updateSlideIndicator(1, pptInfo.totalSlides);
                
                // 生成幻灯片缩略图
                if (pptInfo.thumbnails && pptInfo.thumbnails.length) {
                    window.PptistPlayer.generateThumbnails(pptInfo.thumbnails);
                }
                
                // 开始记录浏览时间
                this.startRecording();
            }
        });
    },
    
    /**
     * 设置章节选择变更监听
     */
    setupChapterSelectListener: function() {
        const chapterSelect = document.getElementById('in-class-chapter-select');
        if (!chapterSelect) {
            console.warn('课中章节选择器未找到');
            return;
        }
        
        // 监听章节选择变更
        chapterSelect.addEventListener('change', (event) => {
            const chapterId = event.target.value;
            if (!chapterId) return;
            
            // 加载章节PPT
            this.loadChapterPPT(chapterId);
        });
    },
    
    /**
     * 加载章节PPT
     * @param {string|number} chapterId 章节ID
     */
    loadChapterPPT: async function(chapterId) {
        if (!chapterId) {
            console.error('加载章节PPT：章节ID为空');
            return;
        }
        
        // 检查PPTist播放器和服务是否已加载
        if (typeof window.PptistPlayer === 'undefined') {
            console.error('PPTist播放器组件未加载');
            
            // 尝试延迟加载
            setTimeout(() => {
                if (typeof window.PptistPlayer !== 'undefined') {
                    console.log('PPTist播放器组件现在可用，重试加载');
                    this.loadChapterPPT(chapterId);
                } else {
                    this.updateSlideIndicator(0, 0, false, 'PPT播放器组件未加载');
                }
            }, 2000);
            return;
        }
        
        if (typeof window.PptistService === 'undefined') {
            console.error('PPTist服务组件未加载');
            
            // 尝试延迟加载
            setTimeout(() => {
                if (typeof window.PptistService !== 'undefined') {
                    console.log('PPTist服务组件现在可用，重试加载');
                    this.loadChapterPPT(chapterId);
                } else {
                    // 如果服务组件仍然不可用，尝试使用播放器直接加载演示数据
                    if (typeof window.PptistPlayer !== 'undefined') {
                        this.loadDemoPPT();
                    } else {
                        this.updateSlideIndicator(0, 0, false, 'PPT服务组件未加载');
                    }
                }
            }, 2000);
            return;
        }
        
        // 停止上一个章节的记录
        if (this.state.currentChapterId && this.state.currentChapterId !== chapterId) {
            this.stopRecording();
        }
        
        // 更新当前章节ID
        this.state.currentChapterId = chapterId;
        
        // 显示加载状态
        this.updateSlideIndicator(0, 0, true);
        
        try {
            console.log(`尝试加载章节 ${chapterId} 的PPT数据`);
            
            // 获取章节PPT数据
            const result = await window.PptistService.getChapterPPT(chapterId);
            
            if (result.code === 200 && result.data) {
                console.log('成功获取PPT数据:', result.data.title || '无标题');
                
                // 重置PPT加载状态
                this.state.pptLoaded = false;
                
                // 转换为PPTist格式
                const pptistData = window.PptistService.convertToPptistFormat(result.data);
                
                // 加载PPT数据
                const loadSuccess = window.PptistPlayer.loadPPT(pptistData);
                
                if (!loadSuccess) {
                    console.warn('PPT加载调用失败，5秒后重试');
                    setTimeout(() => {
                        if (window.PptistPlayer) {
                            window.PptistPlayer.loadPPT(pptistData);
                        }
                    }, 5000);
                }
            } else {
                console.error('加载章节PPT失败:', result.message);
                
                // 加载失败时显示错误提示
                this.updateSlideIndicator(0, 0, false, result.message || '加载PPT数据失败');
                
                // 加载演示PPT
                setTimeout(() => this.loadDemoPPT(), 1500);
            }
        } catch (error) {
            console.error('加载章节PPT出错:', error);
            
            // 加载失败时显示错误提示
            this.updateSlideIndicator(0, 0, false, error.message || '加载PPT时发生错误');
            
            // 加载演示PPT
            setTimeout(() => this.loadDemoPPT(), 1500);
        }
    },
    
    /**
     * 加载演示PPT
     */
    loadDemoPPT: function() {
        console.log('加载演示PPT数据');
        
        // 检查PPTist播放器和服务是否已加载
        if (typeof window.PptistPlayer === 'undefined') {
            console.error('PPTist播放器组件未加载，无法加载演示PPT');
            this.updateSlideIndicator(0, 0, false, 'PPT播放器组件未加载');
            return;
        }
        
        // 更新加载状态
        this.updateSlideIndicator(0, 0, true, '加载演示数据...');
        
        // 直接创建演示PPT数据
        const demoPPT = {
            slides: [],
            thumbnails: []
        };
        
        // 生成10张幻灯片的演示数据
        for (let i = 1; i <= 10; i++) {
            demoPPT.slides.push({
                id: i.toString(),
                elements: [
                    {
                        type: 'text',
                        id: `title-${i}`,
                        content: `演示幻灯片 ${i}`,
                        position: { x: 100, y: 50 },
                        width: 600,
                        height: 80,
                        style: {
                            fontSize: 32,
                            fontWeight: 'bold',
                            color: '#333333',
                            textAlign: 'center'
                        }
                    }
                ],
                background: {
                    type: 'image',
                    image: `../picture/ppt/1/h${i}.jpg`,
                    color: '#ffffff'
                }
            });
            
            demoPPT.thumbnails.push(`../picture/ppt/1/h${i}.jpg`);
        }
        
        // 重置PPT加载状态
        this.state.pptLoaded = false;
        
        try {
            // 加载PPT数据
            if (window.PptistPlayer.loadPPT(demoPPT)) {
                console.log('开始加载演示PPT');
            } else {
                console.error('加载演示PPT失败');
                this.updateSlideIndicator(0, 0, false, '加载演示PPT失败');
            }
        } catch (error) {
            console.error('加载演示PPT出错:', error);
            this.updateSlideIndicator(0, 0, false, '加载演示PPT时发生错误');
        }
    },
    
    /**
     * 更新幻灯片指示器
     * @param {number} current 当前幻灯片索引
     * @param {number} total 总幻灯片数
     * @param {boolean} loading 是否为加载状态
     * @param {string} errorMsg 错误消息
     */
    updateSlideIndicator: function(current, total, loading = false, errorMsg = null) {
        const slideIndicator = document.getElementById('slide-indicator');
        if (!slideIndicator) return;
        
        if (loading) {
            // 显示加载状态
            slideIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            slideIndicator.className = 'slide-indicator loading';
        } else if (errorMsg) {
            // 显示错误状态
            slideIndicator.innerHTML = `<i class="fas fa-exclamation-circle"></i> 错误: ${errorMsg}`;
            slideIndicator.className = 'slide-indicator error';
        } else if (total <= 0) {
            // 未加载状态
            slideIndicator.innerHTML = '<i class="fas fa-info-circle"></i> 未加载PPT';
            slideIndicator.className = 'slide-indicator empty';
        } else {
            // 正常显示
            slideIndicator.innerHTML = `<i class="fas fa-images"></i> ${current} / ${total}`;
            slideIndicator.className = 'slide-indicator';
        }
    },
    
    /**
     * 开始记录浏览时间
     */
    startRecording: function() {
        // 重置计时
        this.state.viewStartTime = new Date();
        
        // 清除现有定时器
        if (this.state.recordInterval) {
            clearInterval(this.state.recordInterval);
        }
        
        // 设置定时记录
        this.state.recordInterval = setInterval(() => {
            this.recordProgress();
        }, 60000); // 每分钟记录一次
    },
    
    /**
     * 停止记录
     */
    stopRecording: function() {
        // 记录最终进度
        this.recordProgress();
        
        // 清除定时器
        if (this.state.recordInterval) {
            clearInterval(this.state.recordInterval);
            this.state.recordInterval = null;
        }
        
        // 重置时间
        this.state.viewStartTime = null;
    },
    
    /**
     * 记录PPT浏览进度
     */
    recordProgress: function() {
        if (!this.state.currentChapterId || !this.state.viewStartTime || !this.state.pptLoaded) {
            return;
        }
        
        // 计算浏览时长（秒）
        const duration = Math.floor((new Date() - this.state.viewStartTime) / 1000);
        if (duration <= 0) return;
        
        // 获取当前进度
        const currentProgress = window.PptistPlayer ? 
            Math.min(window.PptistPlayer.state.currentSlide / window.PptistPlayer.state.totalSlides, 1) : 0;
        
        // 记录浏览数据
        if (typeof window.PptistService !== 'undefined') {
            window.PptistService.recordPPTView(this.state.currentChapterId, {
                progress: currentProgress,
                duration: duration
            });
        }
    }
};

// 将控制器挂载到window对象，使其可以作为全局对象访问
window.ClassroomController = ClassroomController;

// 如果支持模块化，也支持export导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClassroomController;
} 