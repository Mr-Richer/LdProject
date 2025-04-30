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
        
        // 发送加载命令到PPTist - 修改为使用支持的命令类型
        iframe.contentWindow.postMessage({
            type: 'pptist-command',
            action: 'load-ppt',  // 改为load-ppt命令
            data: {  // 将URL包装在data对象中
                url: fullPptUrl
            }
        }, '*');
        
        console.log('PPT加载命令已发送到PPTist');
    } catch (error) {
        console.error('加载PPT到编辑器失败:', error);
        alert(`加载PPT失败: ${error.message}`);
    }
};

/**
 * 根据章节ID加载PPT
 * @param {string|number} chapterId - 章节ID或章节编号
 */
ChapterPptService.loadPptByChapterId = async function(chapterId) {
    try {
        // 显示加载中提示
        const container = document.querySelector('.pptist-container');
        if (container) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-indicator';
            loadingDiv.innerHTML = '<div class="spinner"></div><p>正在加载PPT，请稍候...</p>';
            loadingDiv.style.position = 'absolute';
            loadingDiv.style.top = '50%';
            loadingDiv.style.left = '50%';
            loadingDiv.style.transform = 'translate(-50%, -50%)';
            loadingDiv.style.zIndex = '1000';
            loadingDiv.style.background = 'rgba(255,255,255,0.8)';
            loadingDiv.style.padding = '20px';
            loadingDiv.style.borderRadius = '5px';
            container.style.position = 'relative';
            
            // 移除之前的loading
            const oldLoading = container.querySelector('.loading-indicator');
            if (oldLoading) container.removeChild(oldLoading);
            
            container.appendChild(loadingDiv);
        }
        
        console.log(`开始加载章节编号${chapterId}的PPT文件...`);
        
        // 获取PPT路径
        const pptPath = await this.getPptPathByChapterId(chapterId);
        
        // 加载PPT到编辑器
        this.loadPptToEditor(pptPath);
        
        // 移除加载提示
        setTimeout(() => {
            const loadingDiv = document.querySelector('.loading-indicator');
            if (loadingDiv && loadingDiv.parentNode) {
                loadingDiv.parentNode.removeChild(loadingDiv);
            }
        }, 2000);
        
    } catch (error) {
        console.error(`加载章节${chapterId}的PPT失败:`, error);
        alert(`加载章节PPT失败: ${error.message}`);
        
        // 移除加载提示
        const loadingDiv = document.querySelector('.loading-indicator');
        if (loadingDiv && loadingDiv.parentNode) {
            loadingDiv.parentNode.removeChild(loadingDiv);
        }
    }
};

/**
 * 监听来自PPTist的消息
 */
ChapterPptService.setupMessageListener = function() {
    window.addEventListener('message', function(event) {
        // 验证消息来源
        const iframe = document.getElementById('pptistFrame');
        if (!iframe || event.source !== iframe.contentWindow) return;
        
        // 处理消息
        if (event.data && event.data.type === 'pptist-event') {
            switch (event.data.action) {
                case 'ppt-loaded':
                    console.log('PPT模块加载成功');
                    break;
                    
                case 'ppt-load-error':
                    console.error('PPT加载失败:', event.data.error);
                    alert(`PPT加载失败: ${event.data.error || '未知错误'}`);
                    break;
                    
                case 'initialized':
                    // 自动加载当前选中章节的PPT
                    const chapterSelect = document.getElementById('chapter-select');
                    if (chapterSelect && chapterSelect.value) {
                        setTimeout(() => {
                            ChapterPptService.loadPptByChapterId(chapterSelect.value);
                        }, 1000);
                    }
                    break;
            }
        }
    });
};

// 导出服务
window.ChapterPptService = ChapterPptService;

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    ChapterPptService.init();
    ChapterPptService.setupMessageListener();
}); 