/**
 * 思政模块加载器
 * 负责加载思政案例和讨论题生成相关的模块
 */

// 模块列表及其路径
const MODULES = [
    {
        name: 'ideology-case-generator',
        path: '../src/js/modules/ideology-case-generator.js',
        initFn: 'initIdeologyCaseGenerator'
    },
    {
        name: 'discussion-generator',
        path: '../src/js/modules/discussion-generator.js',
        initFn: 'initDiscussionGenerator'
    }
];

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('思政模块加载器启动');
    loadIdeologyModules();
});

/**
 * 加载思政相关模块
 */
function loadIdeologyModules() {
    // 检查是否是思政相关页面
    const ideologyContent = document.getElementById('ideology-content');
    if (!ideologyContent) {
        console.log('非思政页面，不加载思政模块');
        return;
    }
    
    console.log('检测到思政页面，开始加载思政模块');
    
    // 加载所有模块
    MODULES.forEach(module => {
        loadModule(module);
    });
}

/**
 * 加载单个模块
 * @param {Object} module 模块配置
 */
function loadModule(module) {
    console.log(`开始加载模块: ${module.name}`);
    
    // 创建脚本元素
    const script = document.createElement('script');
    script.src = module.path;
    script.async = true;
    
    // 设置加载事件
    script.onload = function() {
        console.log(`模块 ${module.name} 已加载成功`);
        
        // 如果有初始化函数并且已加载到全局，则调用它
        if (module.initFn && typeof window[module.initFn] === 'function') {
            console.log(`调用模块 ${module.name} 的初始化函数: ${module.initFn}`);
            window[module.initFn]();
        }
    };
    
    // 设置错误处理
    script.onerror = function(error) {
        console.error(`加载模块 ${module.name} 失败:`, error);
    };
    
    // 添加到文档
    document.body.appendChild(script);
}

// 导出模块加载函数
window.loadIdeologyModules = loadIdeologyModules; 