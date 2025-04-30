/**
 * ChapterPptService.js
 * 负责根据章节ID加载PPT内容到PPTist编辑器
 */

// 创建命名空间
const ChapterPptService = {};

// 备用API配置
const DEFAULT_CONFIG = {
  API_BASE_URL: 'http://localhost:3000',
  CHAPTER_API: {
    detail: (id) => `http://localhost:3000/api/chapters/${id}`
  }
};

/**
 * 初始化服务
 */
ChapterPptService.init = function() {
    // 检查全局配置是否存在
    if (!window.APP_CONFIG) {
        console.warn('全局配置不存在，使用默认配置');
        window.APP_CONFIG = DEFAULT_CONFIG;
    } else if (!window.APP_CONFIG.CHAPTER_API) {
        console.warn('API配置不存在，使用默认配置');
        window.APP_CONFIG.CHAPTER_API = DEFAULT_CONFIG.CHAPTER_API;
    }
    
    // 绑定章节选择器变更事件
    const chapterSelect = document.getElementById('chapter-select');
    if (chapterSelect) {
        chapterSelect.addEventListener('change', function() {
            const chapterId = this.value;
            if (chapterId) {
                ChapterPptService.loadPptByChapterId(chapterId);
            }
        });
    }
    
    // 绑定替换课件按钮事件
    const replacePPTBtn = document.getElementById('replacePPTBtn');
    if (replacePPTBtn) {
        replacePPTBtn.addEventListener('click', function() {
            const chapterSelect = document.getElementById('chapter-select');
            if (chapterSelect && chapterSelect.value) {
                ChapterPptService.loadPptByChapterId(chapterSelect.value);
            } else {
                alert('请先选择章节');
            }
        });
    }
};

/**
 * 根据章节ID获取PPT文件路径
 * @param {string|number} chapterId - 章节ID或章节编号
 * @returns {Promise<string>} PPT文件路径
 */
ChapterPptService.getPptPathByChapterId = async function(chapterId) {
    try {
        // 获取API URL配置
        const getDetailUrl = (window.APP_CONFIG && window.APP_CONFIG.CHAPTER_API && window.APP_CONFIG.CHAPTER_API.detail) 
            ? window.APP_CONFIG.CHAPTER_API.detail 
            : DEFAULT_CONFIG.CHAPTER_API.detail;
        
        // 构建API URL - 将chapterId作为chapter_number参数传递
        const apiUrl = `${window.APP_CONFIG?.API_BASE_URL || DEFAULT_CONFIG.API_BASE_URL}/api/chapters?chapter_number=${chapterId}`;
        
        // 发送请求
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`获取章节信息失败: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('章节数据:', result);
        
        // 提取章节数据
        let chapterData = null;
        
        // 检查返回格式，尝试获取章节数据
        if (result.code === 200 && result.data && result.data.chapters) {
            // 数据是章节列表，查找匹配的章节
            const chapters = result.data.chapters;
            chapterData = chapters.find(c => c.chapter_number == chapterId);
        } else if (result.data && result.data.chapter) {
            // 直接返回了单个章节
            chapterData = result.data.chapter;
        } else if (result.data) {
            // 数据直接在data中
            chapterData = result.data;
        } else {
            // 数据在顶层
            chapterData = result;
        }
        
        if (!chapterData) {
            throw new Error(`找不到章节编号为${chapterId}的数据`);
        }
        
        console.log('找到章节数据:', chapterData);
        
        // 提取PPT文件路径
        let pptFile = null;
        
        // 尝试从不同字段中获取PPT文件路径
        if (chapterData.ppt_file) {
            pptFile = chapterData.ppt_file;
        } else if (chapterData.pptFile) {
            pptFile = chapterData.pptFile;
        } else if (chapterData.ppt_path) {
            pptFile = chapterData.ppt_path;
        } else if (chapterData.pptPath) {
            pptFile = chapterData.pptPath;
        }
        
        // 如果找到PPT文件路径
        if (pptFile) {
            console.log(`找到章节${chapterId}的PPT文件路径:`, pptFile);
            
            // 确保路径格式正确
            // 如果pptFile不是以http开头，并且不是以/开头，则添加/
            if (!pptFile.startsWith('http') && !pptFile.startsWith('/')) {
                pptFile = '/' + pptFile;
            }
            
            return pptFile;
        } else {
            console.error('找不到PPT文件路径，章节数据:', chapterData);
            throw new Error('章节没有关联的PPT文件');
        }
    } catch (error) {
        console.error(`获取章节${chapterId}的PPT路径失败:`, error);
        throw error;
    }
};

/**
 * 创建并返回一个加载指示器元素
 * @param {string} message - 显示的消息
 * @returns {HTMLElement} 加载指示器元素
 */
ChapterPptService.createLoadingIndicator = function(message = '正在加载PPT，请稍候...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    
    // 添加样式
    loadingDiv.style.position = 'absolute';
    loadingDiv.style.top = '0';
    loadingDiv.style.left = '0';
    loadingDiv.style.width = '100%';
    loadingDiv.style.height = '100%';
    loadingDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    loadingDiv.style.display = 'flex';
    loadingDiv.style.flexDirection = 'column';
    loadingDiv.style.alignItems = 'center';
    loadingDiv.style.justifyContent = 'center';
    loadingDiv.style.zIndex = '1000';
    
    // 添加内容
    loadingDiv.innerHTML = `
        <div class="spinner" style="
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        "></div>
        <p style="
            font-size: 16px;
            color: #333;
            margin: 0;
            font-weight: bold;
        ">${message}</p>
        <p class="loading-status" style="
            font-size: 14px;
            color: #666;
            margin: 5px 0 0 0;
        ">准备中...</p>
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    return loadingDiv;
};

/**
 * 更新加载指示器状态
 * @param {HTMLElement} loadingDiv - 加载指示器元素
 * @param {string} status - 状态文本
 */
ChapterPptService.updateLoadingStatus = function(loadingDiv, status) {
    if (!loadingDiv) return;
    
    const statusElement = loadingDiv.querySelector('.loading-status');
    if (statusElement) {
        statusElement.textContent = status;
    }
};

/**
 * 显示加载指示器
 * @param {string} message - 显示的消息
 * @returns {HTMLElement} 加载指示器元素
 */
ChapterPptService.showLoading = function(message) {
    // 获取PPTist容器
    const container = document.querySelector('.pptist-container');
    if (!container) return null;
    
    // 确保容器有相对定位
    container.style.position = 'relative';
    
    // 移除已有的加载指示器
    const oldLoading = container.querySelector('.loading-indicator');
    if (oldLoading) container.removeChild(oldLoading);
    
    // 创建新的加载指示器
    const loadingDiv = this.createLoadingIndicator(message);
    container.appendChild(loadingDiv);
    
    return loadingDiv;
};

/**
 * 隐藏加载指示器
 * @param {HTMLElement} loadingDiv - 加载指示器元素
 * @param {boolean} success - 是否成功
 * @param {string} message - 显示的消息
 */
ChapterPptService.hideLoading = function(loadingDiv, success = true, message = '') {
    if (!loadingDiv) return;
    
    if (success) {
        // 成功时添加淡出动画
        loadingDiv.style.transition = 'opacity 0.3s ease';
        loadingDiv.style.opacity = '0';
        
        // 淡出后删除元素
        setTimeout(() => {
            if (loadingDiv.parentNode) {
                loadingDiv.parentNode.removeChild(loadingDiv);
            }
        }, 300);  // 从500ms减少到300ms
    } else {
        // 失败时显示错误信息
        loadingDiv.innerHTML = `
            <div style="
                color: #e74c3c;
                font-size: 40px;
                margin-bottom: 15px;
            ">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <p style="
                font-size: 16px;
                color: #e74c3c;
                margin: 0;
                font-weight: bold;
            ">加载失败</p>
            <p style="
                font-size: 14px;
                color: #666;
                margin: 5px 0 0 0;
                max-width: 80%;
                text-align: center;
            ">${message || '无法加载PPT文件'}</p>
        `;
        
        // 3秒后关闭
        setTimeout(() => {
            if (loadingDiv.parentNode) {
                loadingDiv.style.transition = 'opacity 0.5s ease';
                loadingDiv.style.opacity = '0';
                
                setTimeout(() => {
                    if (loadingDiv.parentNode) {
                        loadingDiv.parentNode.removeChild(loadingDiv);
                    }
                }, 300);  // 从500ms减少到300ms
            }
        }, 2000);  // 从3000ms减少到2000ms
    }
};

/**
 * 加载PPT文件到PPTist
 * @param {string} pptPath - PPT文件路径
 */
ChapterPptService.loadPptToEditor = function(pptPath) {
    try {
        // 获取PPTist iframe
        const iframe = document.getElementById('pptistFrame');
        if (!iframe || !iframe.contentWindow) {
            throw new Error('PPTist iframe不存在或未加载');
        }
        
        // 获取API基础URL
        const baseUrl = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) 
            ? window.APP_CONFIG.API_BASE_URL 
            : DEFAULT_CONFIG.API_BASE_URL;
        
        // 构建完整URL
        let fullPptUrl = pptPath;
        
        // 如果路径以/uploads/开头，则添加baseUrl
        if (pptPath.startsWith('/uploads/')) {
            fullPptUrl = baseUrl + pptPath;
        } 
        // 如果路径不是以http开头且以/开头，则添加baseUrl
        else if (!pptPath.startsWith('http') && pptPath.startsWith('/')) {
            fullPptUrl = baseUrl + pptPath;
        }
        
        console.log(`正在加载PPT文件: ${fullPptUrl}`);
        
        // 显示加载指示器
        const loadingIndicator = this.showLoading('正在加载PPT文件');
        this.updateLoadingStatus(loadingIndicator, '正在准备文件...');
        
        // 保存加载指示器引用，以便在消息监听器中使用
        this.currentLoadingIndicator = loadingIndicator;
        
        // 发送加载命令到PPTist - 修改为使用支持的命令类型
        iframe.contentWindow.postMessage({
            type: 'pptist-command',
            action: 'load-ppt',  // 改为load-ppt命令
            data: {  // 将URL包装在data对象中
                url: fullPptUrl
            }
        }, '*');
        
        console.log('PPT加载命令已发送到PPTist');
        this.updateLoadingStatus(loadingIndicator, '正在解析PPT文件...');
    } catch (error) {
        console.error('加载PPT到编辑器失败:', error);
        
        // 显示错误信息
        const loadingIndicator = this.currentLoadingIndicator || this.showLoading('加载失败');
        this.hideLoading(loadingIndicator, false, error.message);
        
        this.currentLoadingIndicator = null;
    }
};

/**
 * 根据章节ID加载PPT
 * @param {string|number} chapterId - 章节ID或章节编号
 */
ChapterPptService.loadPptByChapterId = async function(chapterId) {
    try {
        console.log(`开始加载章节编号${chapterId}的PPT文件...`);
        
        // 显示加载指示器
        const loadingIndicator = this.showLoading('正在获取章节PPT数据');
        this.updateLoadingStatus(loadingIndicator, '正在查询章节信息...');
        
        // 保存加载指示器引用
        this.currentLoadingIndicator = loadingIndicator;
        
        // 获取PPT路径
        const pptPath = await this.getPptPathByChapterId(chapterId);
        
        this.updateLoadingStatus(loadingIndicator, '已找到PPT文件，正在准备加载...');
        
        // 加载PPT到编辑器
        this.loadPptToEditor(pptPath);
    } catch (error) {
        console.error(`加载章节${chapterId}的PPT失败:`, error);
        
        // 显示错误信息
        const loadingIndicator = this.currentLoadingIndicator || this.showLoading('加载失败');
        this.hideLoading(loadingIndicator, false, `加载章节PPT失败: ${error.message}`);
        
        this.currentLoadingIndicator = null;
    }
};

/**
 * 监听来自PPTist的消息
 */
ChapterPptService.setupMessageListener = function() {
    // 保存loading状态的变量和超时清理
    let loadingTimeout = null;
    
    // 设置加载超时检测（防止长时间显示加载中状态）
    this.setupLoadingTimeout = function(timeout = 15000) {
        // 清除之前的超时
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }
        
        // 设置新的超时
        loadingTimeout = setTimeout(() => {
            console.log('加载超时，强制清除加载指示器');
            if (this.currentLoadingIndicator) {
                this.hideLoading(this.currentLoadingIndicator, true);
                this.currentLoadingIndicator = null;
            }
            loadingTimeout = null;
        }, timeout);
    };
    
    // 使用bind确保回调中的this指向ChapterPptService
    const messageHandler = function(event) {
        // 验证消息来源
        const iframe = document.getElementById('pptistFrame');
        if (!iframe || event.source !== iframe.contentWindow) return;
        
        // 处理消息
        if (event.data && event.data.type === 'pptist-event') {
            const { action, data, error } = event.data;
            console.log('收到PPTist事件:', action, data || error || '');
            
            switch (action) {
                case 'ppt-loading':
                    // PPTist开始加载PPT
                    if (this.currentLoadingIndicator) {
                        // 如果data包含stage信息，显示更详细的状态
                        if (data && data.stage) {
                            let statusText = '正在加载...';
                            
                            switch(data.stage) {
                                case 'fetching':
                                    statusText = '正在获取PPT文件...';
                                    break;
                                case 'processing':
                                    statusText = '正在处理PPT数据...';
                                    break;
                                case 'reading':
                                    statusText = '正在读取PPT内容...';
                                    break;
                                case 'importing':
                                    statusText = '正在导入PPT内容...';
                                    break;
                                case 'rendering':
                                    statusText = '正在渲染PPT...';
                                    break;
                                case 'parsing-pptx':
                                    statusText = '正在解析PPTX文件...';
                                    break;
                                case 'parsing-pptist':
                                    statusText = '正在解析PPTist文件...';
                                    break;
                                case 'finalizing':
                                    statusText = '正在完成加载...';
                                    break;
                                default:
                                    statusText = '正在加载PPT...';
                            }
                            
                            this.updateLoadingStatus(this.currentLoadingIndicator, statusText);
                        } else {
                            this.updateLoadingStatus(this.currentLoadingIndicator, '正在导入PPT文件...');
                        }
                        
                        // 设置加载超时保护（15秒）
                        this.setupLoadingTimeout();
                    }
                    break;
                    
                case 'ppt-loaded':
                    // PPT加载成功
                    console.log('PPT文件加载成功');
                    
                    // 清除加载超时
                    if (loadingTimeout) {
                        clearTimeout(loadingTimeout);
                        loadingTimeout = null;
                    }
                    
                    // 更新加载状态并添加成功动画
                    if (this.currentLoadingIndicator) {
                        this.updateLoadingStatus(this.currentLoadingIndicator, '加载成功，显示内容中...');
                        
                        // 确保有足够的时间让PPT实际渲染出来
                        // 如果PPT已经渲染完成，会快速隐藏加载指示器
                        // 如果渲染还在进行，会等待一会儿以确保用户体验良好
                        setTimeout(() => {
                            // 检查一下PPTist iframe是否真的渲染了内容
                            const iframe = document.getElementById('pptistFrame');
                            if (iframe && iframe.contentDocument) {
                                try {
                                    // 检查是否有slides元素作为渲染成功的标志
                                    const slideElements = iframe.contentDocument.querySelectorAll('.slide-content-element');
                                    // 检查是否有editor元素作为基本渲染的标志
                                    const editorElements = iframe.contentDocument.querySelectorAll('.editor');
                                    
                                    console.log(`检测到 ${slideElements.length} 个幻灯片元素和 ${editorElements.length} 个编辑器元素`);
                                    
                                    // 如果没有检测到渲染元素，可能需要额外延迟
                                    if (slideElements.length === 0 && editorElements.length === 0) {
                                        console.log('未检测到渲染元素，延长等待时间');
                                        // 再延长一些时间等待渲染
                                        setTimeout(() => {
                                            this.hideLoading(this.currentLoadingIndicator, true);
                                            this.currentLoadingIndicator = null;
                                        }, 1000);
                                        return;
                                    }
                                } catch (e) {
                                    console.warn('检查PPT渲染状态时出错', e);
                                }
                            }
                            
                            // 隐藏加载指示器
                            this.hideLoading(this.currentLoadingIndicator, true);
                            this.currentLoadingIndicator = null;
                        }, 800);
                    }
                    break;
                    
                case 'ppt-load-error':
                    // PPT加载失败
                    console.error('PPT加载失败:', error);
                    
                    // 清除加载超时
                    if (loadingTimeout) {
                        clearTimeout(loadingTimeout);
                        loadingTimeout = null;
                    }
                    
                    // 显示错误信息
                    if (this.currentLoadingIndicator) {
                        this.hideLoading(this.currentLoadingIndicator, false, error || '加载PPT文件失败');
                        this.currentLoadingIndicator = null;
                    }
                    break;
                    
                case 'initialized':
                    // PPTist初始化完成
                    console.log('PPTist编辑器初始化完成');
                    
                    // 自动加载当前选中章节的PPT
                    const chapterSelect = document.getElementById('chapter-select');
                    if (chapterSelect && chapterSelect.value) {
                        setTimeout(() => {
                            this.loadPptByChapterId(chapterSelect.value);
                        }, 1000);
                    }
                    break;
            }
        }
    }.bind(this);
    
    // 添加消息监听器
    window.addEventListener('message', messageHandler);
};

// 导出服务
window.ChapterPptService = ChapterPptService;

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    ChapterPptService.init();
    ChapterPptService.setupMessageListener();
}); 