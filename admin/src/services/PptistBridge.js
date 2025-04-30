/**
 * PptistBridge.js
 * 负责与PPTist iframe通信
 */

// 创建PptistBridge命名空间
window.PptistBridge = {};

/**
 * 获取PPTist iframe元素
 * @returns {HTMLIFrameElement|null} PPTist iframe元素或null
 */
window.PptistBridge.getPptistFrame = function() {
  // 常用的iframe id列表
  const possibleIds = ['pptistFrame', 'pptist-frame', 'coursewareFrame', 'pptistIframe'];
  
  // 首先尝试通过id获取
  for (const id of possibleIds) {
    const frame = document.getElementById(id);
    if (frame && frame.tagName === 'IFRAME') {
      return frame;
    }
  }
  
  // 如果没有找到，尝试查找courseware-preview下的iframe
  const previewContainer = document.querySelector('.courseware-preview');
  if (previewContainer) {
    const iframe = previewContainer.querySelector('iframe');
    if (iframe) {
      return iframe;
    }
  }
  
  // 最后尝试获取页面上的任何iframe
  const iframes = document.querySelectorAll('iframe');
  if (iframes.length > 0) {
    // 如果有多个iframe，尝试找到最可能是PPTist的那个
    for (const iframe of iframes) {
      const src = iframe.getAttribute('src') || '';
      if (src.includes('pptist') || src.includes('ppt') || src.includes('slideshow')) {
        return iframe;
      }
    }
    // 如果没有找到匹配的，返回第一个iframe
    return iframes[0];
  }
  
  console.error('找不到PPTist iframe元素');
  return null;
};

/**
 * 等待PPTist就绪
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<boolean>} PPTist是否就绪
 */
window.PptistBridge.waitForPPTistReady = function(timeout = 5000) {
  console.log('正在等待PPTist就绪...');
  
  return new Promise((resolve) => {
    const frame = window.PptistBridge.getPptistFrame();
    
    // 如果iframe不存在，直接返回false
    if (!frame) {
      console.error('PPTist iframe不存在');
      resolve(false);
      return;
    }
    
    // 检查iframe是否已加载
    const frameLoaded = !!(frame.contentWindow && frame.contentDocument);
    console.log('iframe是否已加载:', frameLoaded);
    
    // 如果PPTist已经就绪，直接返回true
    if (window.PPT_INITIALIZED) {
      console.log('PPTist已经就绪');
      resolve(true);
      return;
    }
    
    // 如果iframe已加载，发送ping消息
    if (frameLoaded) {
      try {
        // 创建消息响应处理
        const messageHandler = (event) => {
          // 检查消息来源和类型
          if (event.source !== frame.contentWindow) return;
          
          if (event.data && (
            (event.data.type === 'pong') || 
            (event.data.type === 'pptist-event' && event.data.action === 'initialized')
          )) {
            window.removeEventListener('message', messageHandler);
            window.PPT_INITIALIZED = true;
            console.log('PPTist已响应，确认就绪');
            resolve(true);
          }
        };
        
        // 添加消息监听
        window.addEventListener('message', messageHandler);
        
        // 发送ping消息
        console.log('发送ping消息到PPTist');
        frame.contentWindow.postMessage({ type: 'ping' }, '*');
        
        // 设置超时
        setTimeout(() => {
          window.removeEventListener('message', messageHandler);
          console.warn(`等待PPTist响应超时(${timeout}ms)`);
          
          // 虽然超时，但如果iframe已加载，我们仍可以尝试通信
          if (frameLoaded) {
            console.log('iframe已加载，假定PPTist可用');
            resolve(true);
          } else {
            resolve(false);
          }
        }, timeout);
        
      } catch (error) {
        console.error('与PPTist通信出错:', error);
        resolve(false);
      }
    } else {
      console.error('iframe未加载完成');
      resolve(false);
    }
  });
};

/**
 * 向PPTist发送消息
 * @param {string} action - 操作类型
 * @param {any} data - 要发送的数据
 * @returns {boolean} 是否成功发送消息
 */
window.PptistBridge.sendMessageToPPTist = function(action, data) {
  const frame = window.PptistBridge.getPptistFrame();
  
  if (!frame || !frame.contentWindow) {
    console.error('无法发送消息到PPTist: iframe或contentWindow不存在');
    return false;
  }
  
  try {
    console.log(`向PPTist发送[${action}]消息:`, data);
    
    // 发送消息
    frame.contentWindow.postMessage({
      type: 'pptist-command',
      action: action,
      data: data
    }, '*');
    
    return true;
  } catch (error) {
    console.error('发送消息到PPTist失败:', error);
    return false;
  }
};

/**
 * 向PPTist发送PPT数据
 * @param {Object} pptData - PPT数据
 * @returns {Promise<Object>} 加载结果
 */
window.PptistBridge.sendPPTToEditor = function(pptData) {
  return new Promise((resolve) => {
    const frame = window.PptistBridge.getPptistFrame();
    
    if (!frame || !frame.contentWindow) {
      console.error('无法发送PPT数据: iframe或contentWindow不存在');
      resolve({ success: false, error: 'PPTist编辑器不可用' });
      return;
    }
    
    try {
      // 创建消息处理器
      const messageHandler = (event) => {
        // 检查消息来源
        if (event.source !== frame.contentWindow) return;
        
        // 处理加载响应
        if (event.data && event.data.type === 'pptist-event') {
          if (event.data.action === 'ppt-loaded') {
            // 加载成功
            window.removeEventListener('message', messageHandler);
            resolve({ success: true });
          } else if (event.data.action === 'ppt-load-error') {
            // 加载失败
            window.removeEventListener('message', messageHandler);
            resolve({ success: false, error: event.data.error || '加载PPT失败' });
          }
        }
      };
      
      // 添加消息监听
      window.addEventListener('message', messageHandler);
      
      // 发送PPT数据
      console.log('向PPTist发送PPT数据');
      frame.contentWindow.postMessage({
        type: 'pptist-command',
        action: 'load-ppt',
        data: pptData
      }, '*');
      
      // 设置超时
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        console.warn('加载PPT响应超时');
        resolve({ success: false, error: '加载响应超时' });
      }, 10000); // 10秒超时
      
    } catch (error) {
      console.error('发送PPT数据到PPTist失败:', error);
      resolve({ success: false, error: error.message });
    }
  });
};

// 导出服务就绪状态
console.log('PptistBridge服务已加载'); 