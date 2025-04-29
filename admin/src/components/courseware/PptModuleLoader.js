/**
 * PptModuleLoader.js
 * 负责动态加载和初始化PPT相关模块的统一加载器
 */

// 创建全局命名空间
window.PptModuleLoader = {};

// 安全地显示通知函数
function safeShowNotification(message, type = 'info') {
  if (window.showNotification && typeof window.showNotification === 'function') {
    return window.showNotification(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
    return null;
  }
}

/**
 * 加载PPT相关模块
 * 按顺序加载PptistBridge、ppt服务和PptLoader模块
 * @returns {Promise<boolean>} 加载是否成功
 */
window.PptModuleLoader.loadModules = function() {
  return new Promise((resolve, reject) => {
    try {
      console.log('加载PPT相关模块...');
      
      // 首先加载PptistBridge模块
      const bridgeScript = document.createElement('script');
      bridgeScript.src = '../src/components/courseware/PptistBridge.js';
      bridgeScript.type = 'text/javascript';
      
      bridgeScript.onload = () => {
        console.log('PptistBridge模块加载成功');
        
        // 然后加载服务模块
        const serviceScript = document.createElement('script');
        serviceScript.src = '../src/services/ppt.js';
        serviceScript.type = 'text/javascript';
        
        serviceScript.onload = () => {
          console.log('PPT服务模块加载成功');
          
          // 检查是否成功创建全局对象
          if (!window.PptistBridge) {
            console.error('PptistBridge全局对象未正确创建');
            reject(new Error('PptistBridge模块初始化失败'));
            return;
          }
          
          if (!window.PptService) {
            console.error('PptService全局对象未正确创建');
            reject(new Error('PPT服务模块初始化失败'));
            return;
          }
          
          // 最后加载PptLoader模块
          const loaderScript = document.createElement('script');
          loaderScript.src = '../src/components/courseware/PptLoader.js';
          loaderScript.type = 'text/javascript';
          
          loaderScript.onload = () => {
            console.log('PptLoader模块加载成功');
            
            // 所有模块已加载
            if (!window.PptLoader) {
              console.error('PptLoader全局对象未正确创建');
              reject(new Error('PptLoader模块初始化失败'));
              return;
            }
            
            console.log('所有PPT相关模块加载完成');
            resolve(true);
          };
          
          loaderScript.onerror = (error) => {
            console.error('加载PptLoader模块失败:', error);
            reject(new Error('无法加载PptLoader模块'));
          };
          
          document.head.appendChild(loaderScript);
        };
        
        serviceScript.onerror = (error) => {
          console.error('加载PPT服务模块失败:', error);
          reject(new Error('无法加载PPT服务模块'));
        };
        
        document.head.appendChild(serviceScript);
      };
      
      bridgeScript.onerror = (error) => {
        console.error('加载PptistBridge模块失败:', error);
        reject(new Error('无法加载PptistBridge模块'));
      };
      
      document.head.appendChild(bridgeScript);
      
    } catch (error) {
      console.error('加载PPT模块总体失败:', error);
      reject(error);
    }
  });
};

/**
 * 初始化PPT自动加载功能
 * 确保所有模块先加载完成，再初始化自动加载功能
 * @returns {Promise<boolean>} 初始化是否成功
 */
window.PptModuleLoader.initAutoLoad = async function() {
  try {
    // 确保所有模块已加载
    if (!window.PptLoader || !window.PptService || !window.PptistBridge) {
      console.log('PPT模块尚未加载，开始加载...');
      await window.PptModuleLoader.loadModules();
    }
    
    // 检查initAutoLoadPPT方法是否存在
    if (typeof window.PptLoader.initAutoLoadPPT !== 'function') {
      console.error('PPT加载器初始化失败：未找到initAutoLoadPPT方法');
      safeShowNotification('PPT功能初始化失败', 'error');
      return false;
    }
    
    // 等待短暂延时，确保DOM已完全加载
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 初始化自动加载功能
    try {
      window.PptLoader.initAutoLoadPPT();
      console.log('PPT自动加载功能已初始化');
      return true;
    } catch (error) {
      console.error('初始化PPT自动加载功能失败:', error);
      safeShowNotification('PPT自动加载功能初始化失败', 'error');
      return false;
    }
  } catch (error) {
    console.error('PPT模块初始化失败:', error);
    safeShowNotification('PPT功能初始化失败，请刷新页面重试', 'error');
    return false;
  }
};

// 提供简单的初始化方法
window.PptModuleLoader.init = async function() {
  try {
    await window.PptModuleLoader.loadModules();
    console.log('PPT模块加载完成，准备初始化自动加载功能');
    
    // 短暂延时后初始化自动加载
    setTimeout(async () => {
      const success = await window.PptModuleLoader.initAutoLoad();
      if (success) {
        safeShowNotification('PPT功能已准备就绪', 'success');
      }
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('PPT模块初始化失败:', error);
    safeShowNotification('PPT功能初始化失败，请刷新页面重试', 'error');
    return false;
  }
};

console.log('PPT模块加载器已加载'); 