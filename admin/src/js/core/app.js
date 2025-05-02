/**
 * 应用核心文件
 * 包含全局设置、配置和基础功能
 */

// 设置离线模式，使用模拟数据
window.isOfflineMode = false; // 设置为false，从API获取实际数据

// API配置
window.API_BASE_URL = 'http://localhost:3000'; // 开发环境

// 动态加载脚本
function loadScript(url) {
    return new Promise((resolve, reject) => {
        console.log(`开始加载脚本: ${url}`);
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            console.log(`脚本加载成功: ${url}`);
            resolve();
        };
        script.onerror = (error) => {
            console.error(`脚本加载失败: ${url}`, error);
            reject(new Error(`无法加载脚本: ${url}`));
        };
        document.head.appendChild(script);
    });
}

// 动态加载样式表
function loadStylesheet(url) {
    return new Promise((resolve, reject) => {
        console.log(`开始加载样式表: ${url}`);
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => {
            console.log(`样式表加载成功: ${url}`);
            resolve();
        };
        link.onerror = (error) => {
            console.error(`样式表加载失败: ${url}`, error);
            reject(new Error(`无法加载样式表: ${url}`));
        };
        document.head.appendChild(link);
    });
}

// 确保没有其他冲突脚本
function checkForConflictingScripts() {
    const scriptTags = document.querySelectorAll('script');
    for (const scriptTag of scriptTags) {
        const src = scriptTag.getAttribute('src');
        if (src && (src.includes('script_new.js') || src.includes('script.js.original'))) {
            console.warn(`发现可能的冲突脚本: ${src}，这可能导致重复创建章节`);
            return true;
        }
    }
    return false;
}

// 显示通知
function showNotification(message, type = 'info') {
    let notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 渐入效果
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 更新当前日期显示
function updateCurrentDate() {
    const currentDateZh = document.getElementById('current-date-zh');
    const currentDateEn = document.getElementById('current-date-en');
    
    if (currentDateZh && currentDateEn) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        currentDateZh.textContent = now.toLocaleDateString('zh-CN', options);
        currentDateEn.textContent = now.toLocaleDateString('en-US', options);
    }
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', async function() {
    // 检查是否存在冲突脚本
    const hasConflicts = checkForConflictingScripts();
    if (hasConflicts) {
        console.warn('检测到可能的脚本冲突，这可能导致重复创建章节。请检查HTML中是否加载了多个JS文件。');
    }
    
    // 更新日期显示
    updateCurrentDate();
    
    console.log('应用核心已初始化');
}); 