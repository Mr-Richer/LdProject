/**
 * 模块加载器 - 负责动态加载各个功能模块
 */

// 模块路径配置
const ModulePaths = {
    knowledgeExpansion: '../src/js/knowledge-expansion.js',
    quizGenerator: '../src/components/quizGenerator/QuizGenerator.js',
    chapterUpload: '../src/components/chapter/ChapterUpload.js',
    ideologyCase: '../src/js/ideology-case.js'
};

/**
 * 模块加载器对象
 */
const ModuleLoader = {
    /**
     * 已加载的模块
     */
    loadedModules: {},
    
    /**
     * 初始化模块加载器
     */
    init: function() {
        console.log('模块加载器初始化');
        // 监听DOM加载完成
        document.addEventListener('DOMContentLoaded', this.autoLoadModules.bind(this));
        return this;
    },
    
    /**
     * 根据页面需要自动加载相关模块
     */
    autoLoadModules: function() {
        console.log('检查需要自动加载的模块');
        
        // 如果存在知识拓展内容区域，加载知识拓展模块
        if (document.getElementById('knowledge-content')) {
            this.loadKnowledgeExpansionModule();
        }
        
        // 如果存在思政案例内容区域，加载思政案例模块
        if (document.getElementById('ideology-content')) {
            this.loadIdeologyCaseModule();
        }
        
        // 如果存在其他模块相关区域，可以在此添加更多自动加载逻辑
    },
    
    /**
     * 加载知识拓展模块
     * @returns {Promise} 加载结果Promise
     */
    loadKnowledgeExpansionModule: function() {
        return this.loadModule('knowledgeExpansion')
            .then(module => {
                console.log('知识拓展模块加载完成，开始初始化');
                if (window.KnowledgeExpansion && typeof window.KnowledgeExpansion.init === 'function') {
                    window.KnowledgeExpansion.init();
                    console.log('知识拓展模块初始化完成');
                } else {
                    console.error('知识拓展模块初始化失败: 模块未正确加载');
                }
                return module;
            })
            .catch(error => {
                console.error('加载知识拓展模块失败:', error);
                this.showNotification('知识拓展模块加载失败', 'error');
                throw error;
            });
    },
    
    /**
     * 加载思政案例模块
     * @returns {Promise} 加载结果Promise
     */
    loadIdeologyCaseModule: function() {
        return this.loadModule('ideologyCase')
            .then(module => {
                console.log('思政案例模块加载完成，开始初始化');
                if (window.IdeologyCaseManager && typeof window.IdeologyCaseManager.init === 'function') {
                    window.IdeologyCaseManager.init();
                    console.log('思政案例模块初始化完成');
                } else {
                    console.error('思政案例模块初始化失败: 模块未正确加载');
                }
                return module;
            })
            .catch(error => {
                console.error('加载思政案例模块失败:', error);
                this.showNotification('思政案例模块加载失败', 'error');
                throw error;
            });
    },
    
    /**
     * 加载指定模块
     * @param {string} moduleName - 模块名称
     * @returns {Promise} 加载结果Promise
     */
    loadModule: function(moduleName) {
        // 如果模块已加载，直接返回
        if (this.loadedModules[moduleName]) {
            console.log(`模块 ${moduleName} 已加载`);
            return Promise.resolve(this.loadedModules[moduleName]);
        }
        
        // 获取模块路径
        const modulePath = ModulePaths[moduleName];
        if (!modulePath) {
            console.error(`未知的模块: ${moduleName}`);
            return Promise.reject(new Error(`未知的模块: ${moduleName}`));
        }
        
        console.log(`开始加载模块: ${moduleName} - ${modulePath}`);
        
        // 加载脚本
        return this.loadScript(modulePath)
            .then(() => {
                // 保存到已加载模块
                this.loadedModules[moduleName] = true;
                console.log(`模块 ${moduleName} 加载成功`);
                return true;
            });
    },
    
    /**
     * 动态加载脚本
     * @param {string} src - 脚本路径
     * @returns {Promise} 加载结果Promise
     */
    loadScript: function(src) {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                console.log(`脚本 ${src} 已加载`);
                resolve();
                return;
            }
            
            console.log(`开始加载脚本: ${src}`);
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`脚本 ${src} 加载成功`);
                resolve();
            };
            script.onerror = (error) => {
                console.error(`脚本 ${src} 加载失败:`, error);
                reject(new Error(`无法加载脚本 ${src}`));
            };
            document.head.appendChild(script);
        });
    },
    
    /**
     * 显示通知消息
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型(success, error, info, warning)
     */
    showNotification: function(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
};

// 初始化模块加载器
window.ModuleLoader = ModuleLoader.init();

// 导出模块，可以在ES模块中使用
export default ModuleLoader; 