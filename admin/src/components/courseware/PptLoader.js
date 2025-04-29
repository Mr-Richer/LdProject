/**
 * PptLoader.js
 * 负责加载和处理PPT内容
 */

// 创建全局命名空间
window.PptLoader = {};

// 内部函数：安全地调用通知
function safeShowNotification(message, type = 'info') {
  // 如果全局通知函数存在，使用它
  if (window.showNotification && typeof window.showNotification === 'function') {
    return window.showNotification(message, type);
  } else {
    // 否则只在控制台显示
    console.log(`[${type.toUpperCase()}] ${message}`);
    return null;
  }
}

// 检查PPTist编辑器iframe是否存在并可见
window.PptLoader.checkPPTistVisible = function() {
  // 使用PptistBridge的方法获取iframe
  if (window.PptistBridge && typeof window.PptistBridge.getPptistFrame === 'function') {
    const frame = window.PptistBridge.getPptistFrame();
    
    if (!frame) {
      console.error('PPTist iframe不存在');
      return false;
    }
    
    // 检查iframe是否可见
    const style = window.getComputedStyle(frame);
    const isVisible = style.display !== 'none' && 
                      style.visibility !== 'hidden' && 
                      style.opacity !== '0';
    
    if (!isVisible) {
      console.warn('PPTist iframe存在但不可见，可能需要切换到正确的选项卡');
    }
    
    return isVisible;
  }
  
  // 如果PptistBridge不可用，尝试直接查找
  const frame = document.getElementById('pptistFrame') || 
                document.querySelector('iframe[src*="pptist"]') ||
                document.querySelector('iframe.pptist-frame');
                
  if (!frame) {
    console.error('未找到PPTist iframe');
    return false;
  }
  
  const style = window.getComputedStyle(frame);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0';
}

// 加载章节PPT
window.PptLoader.loadChapterPPT = async function(chapterId, retryCount = 2) {
  if (!chapterId) {
    console.error('加载PPT失败: 无效的章节ID');
    safeShowNotification('无法加载PPT: 缺少章节ID', 'error');
    return false;
  }

  try {
    console.log(`正在加载章节${chapterId}的PPT...`);
    
    // 确认PPTist帧可见
    const isVisible = window.PptLoader.checkPPTistVisible();
    if (!isVisible) {
      console.warn('PPTist iframe不可见，尝试加载PPT可能失败');
      safeShowNotification('PPTist编辑器未处于活动状态，请先切换到"课件设计"选项卡', 'warning');
    }
    
    // 确保依赖模块已加载
    if (!window.PptService || !window.PptistBridge) {
      console.error('PPT依赖模块未加载，请确保PptService和PptistBridge已加载');
      safeShowNotification('PPT模块未完全加载，请刷新页面重试', 'error');
      return false;
    }
    
    // 等待PPTist编辑器就绪
    const isPPTistReady = await window.PptistBridge.waitForPPTistReady();
    if (!isPPTistReady) {
      // 如果等待失败但还有重试次数，则进行重试
      if (retryCount > 0) {
        console.warn(`PPTist编辑器未就绪，将在3秒后进行重试，剩余重试次数: ${retryCount}`);
        safeShowNotification('正在重新尝试连接PPTist编辑器...', 'info');
        
        // 延迟3秒后重试
        await new Promise(resolve => setTimeout(resolve, 3000));
        return window.PptLoader.loadChapterPPT(chapterId, retryCount - 1);
      }
      
      console.error('PPTist编辑器未就绪，无法加载PPT');
      safeShowNotification('无法连接到PPT编辑器，请检查编辑器是否正常加载', 'error');
      return false;
    }
    
    // 获取章节PPT内容
    console.log(`正在从服务器获取章节${chapterId}的PPT数据...`);
    safeShowNotification('正在获取PPT数据...', 'info');
    
    const pptContent = await window.PptService.getPPTContent(chapterId);
    
    if (!pptContent) {
      console.warn(`章节${chapterId}没有PPT内容，将使用默认模板`);
      safeShowNotification('未找到PPT内容，将使用默认模板', 'warning');
      // 可以在这里设置默认PPT模板
      return false;
    }
    
    // 发送PPT内容到PPTist
    console.log('正在将PPT数据发送到编辑器...');
    const success = window.PptistBridge.sendMessageToPPTist('load-ppt', pptContent);
    
    if (success) {
      console.log(`成功加载章节${chapterId}的PPT内容`);
      safeShowNotification('PPT加载成功', 'success');
      return true;
    } else {
      // 如果发送失败但还有重试次数，则进行重试
      if (retryCount > 0) {
        console.warn(`向PPTist发送PPT内容失败，将在3秒后进行重试，剩余重试次数: ${retryCount}`);
        safeShowNotification('正在重新尝试加载PPT...', 'info');
        
        // 延迟3秒后重试
        await new Promise(resolve => setTimeout(resolve, 3000));
        return window.PptLoader.loadChapterPPT(chapterId, retryCount - 1);
      }
      
      console.error(`向PPTist发送PPT内容失败`);
      safeShowNotification('无法向PPT编辑器发送内容，请检查编辑器是否正常运行', 'error');
      return false;
    }
  } catch (error) {
    console.error('加载章节PPT失败:', error);
    safeShowNotification(`加载PPT失败: ${error.message}`, 'error');
    return false;
  }
}

// 保存当前PPT内容
window.PptLoader.saveCurrentPPT = async function(chapterId, retryCount = 2) {
  if (!chapterId) {
    console.error('保存PPT失败: 无效的章节ID');
    safeShowNotification('无法保存PPT: 缺少章节ID', 'error');
    return false;
  }
  
  try {
    console.log(`正在保存章节${chapterId}的PPT...`);
    
    // 确保依赖模块已加载
    if (!window.PptService || !window.PptistBridge) {
      console.error('PPT依赖模块未加载，请确保PptService和PptistBridge已加载');
      safeShowNotification('PPT模块未完全加载，无法保存', 'error');
      return false;
    }
    
    // 检查PPTist是否就绪
    const isPPTistReady = await window.PptistBridge.waitForPPTistReady();
    if (!isPPTistReady) {
      // 如果等待失败但还有重试次数，则进行重试
      if (retryCount > 0) {
        console.warn(`PPTist编辑器未就绪，将在3秒后进行重试，剩余重试次数: ${retryCount}`);
        safeShowNotification('正在重新尝试连接PPTist编辑器...', 'info');
        
        // 延迟3秒后重试
        await new Promise(resolve => setTimeout(resolve, 3000));
        return window.PptLoader.saveCurrentPPT(chapterId, retryCount - 1);
      }
      
      console.error('PPTist编辑器未就绪，无法保存PPT');
      safeShowNotification('无法连接到PPT编辑器，请确保编辑器已加载', 'error');
      return false;
    }
    
    // 从PPTist获取当前PPT内容
    // 设置一个超时Promise，防止无限等待
    const getPptDataWithTimeout = () => {
      return new Promise((resolve, reject) => {
        // 设置响应处理函数
        const messageHandler = (event) => {
          if (event.data && 
              event.data.type === 'pptist-response' && 
              event.data.action === 'get-ppt-data') {
            window.removeEventListener('message', messageHandler);
            clearTimeout(timeoutId);
            resolve(event.data.data || {});
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // 发送请求获取PPT数据
        window.PptistBridge.sendMessageToPPTist('get-ppt-data', {});
        
        // 设置超时
        const timeoutId = setTimeout(() => {
          window.removeEventListener('message', messageHandler);
          reject(new Error('获取PPT数据超时'));
        }, 5000);
      });
    };
    
    let pptData;
    try {
      safeShowNotification('正在获取当前PPT内容...', 'info');
      pptData = await getPptDataWithTimeout();
      console.log('成功获取当前PPT数据');
    } catch (error) {
      console.error('获取PPT数据失败:', error);
      safeShowNotification('无法获取当前PPT内容', 'error');
      
      // 使用空对象作为备用
      pptData = {};
    }
    
    // 保存PPT内容
    safeShowNotification('正在保存PPT内容...', 'info');
    await window.PptService.savePPTContent(chapterId, pptData);
    
    console.log(`成功保存章节${chapterId}的PPT内容`);
    safeShowNotification('PPT已成功保存', 'success');
    return true;
  } catch (error) {
    console.error('保存章节PPT失败:', error);
    safeShowNotification(`保存PPT失败: ${error.message}`, 'error');
    return false;
  }
}

// 初始化自动加载PPT功能
window.PptLoader.initAutoLoadPPT = function() {
  console.log('初始化自动加载PPT功能...');
  
  // 获取章节选择器
  const chapterSelect = document.getElementById('chapter-select');
  if (!chapterSelect) {
    console.error('章节选择器未找到，无法初始化自动加载PPT功能');
    return;
  }
  
  // 添加章节变化监听器
  chapterSelect.addEventListener('change', async () => {
    const chapterId = chapterSelect.value;
    if (!chapterId) return;
    
    // 如果当前在课件设计选项卡，自动加载PPT
    const coursewareContent = document.getElementById('courseware-content');
    if (coursewareContent && coursewareContent.classList.contains('active')) {
      console.log('检测到章节变更，自动加载PPT...');
      safeShowNotification('正在重新加载章节PPT', 'info');
      await window.PptLoader.loadChapterPPT(chapterId);
    }
  });
  
  // 监听选项卡切换
  const tabBtns = document.querySelectorAll('.ai-pre-tabs .tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // 当切换到课件设计选项卡时，加载当前章节PPT
      if (tabId === 'courseware') {
        const chapterId = chapterSelect.value;
        if (chapterId) {
          console.log('检测到切换到课件设计选项卡，自动加载PPT...');
          safeShowNotification('正在加载章节PPT', 'info');
          window.PptLoader.loadChapterPPT(chapterId);
        }
      }
    });
  });
  
  // 页面加载完成后，自动加载当前选中章节的PPT
  setTimeout(() => {
    if (chapterSelect.value) {
      const coursewareContent = document.getElementById('courseware-content');
      if (coursewareContent && coursewareContent.classList.contains('active')) {
        console.log('页面加载完成，自动加载当前章节PPT...');
        window.PptLoader.loadChapterPPT(chapterSelect.value);
      }
    }
  }, 1000);
  
  console.log('自动加载PPT功能已初始化');
}

// 添加新的测试PPTist通信函数
window.PptLoader.testPPTistConnection = async function() {
  try {
    console.log('开始测试与PPTist的通信...');
    
    // 确保PptistBridge存在
    if (!window.PptistBridge) {
      console.error('PptistBridge模块未加载，无法测试通信');
      safeShowNotification('无法测试PPTist通信: 桥接模块未加载', 'error');
      return false;
    }
    
    // 检查iframe是否存在
    const frame = window.PptistBridge.getPptistFrame();
    if (!frame) {
      console.error('未找到PPTist iframe，无法建立通信');
      safeShowNotification('无法找到PPTist编辑器框架', 'error');
      return false;
    }
    
    console.log('PPTist iframe存在，检查可见性...');
    const isVisible = window.PptLoader.checkPPTistVisible();
    if (!isVisible) {
      console.warn('PPTist iframe不可见，可能导致通信问题');
      safeShowNotification('PPTist编辑器不可见，可能导致通信问题', 'warning');
    }
    
    // 测试ping通信
    console.log('测试ping通信...');
    const pingSuccess = await window.PptistBridge.pingPptist();
    
    if (pingSuccess) {
      console.log('Ping测试成功，PPTist已响应');
      safeShowNotification('PPTist通信测试成功', 'success');
      return true;
    } else {
      console.error('Ping测试失败，PPTist未响应');
      
      // 尝试发送一个普通命令测试
      console.log('尝试发送普通命令测试...');
      const sendResult = window.PptistBridge.sendMessageToPPTist('test-connection', { timestamp: Date.now() });
      
      if (sendResult) {
        console.log('命令发送成功，但未收到响应');
        safeShowNotification('可以向PPTist发送命令，但未收到响应', 'warning');
        return false;
      } else {
        console.error('无法发送命令到PPTist');
        safeShowNotification('无法向PPTist发送命令', 'error');
        return false;
      }
    }
  } catch (error) {
    console.error('测试PPTist通信时出错:', error);
    safeShowNotification(`测试PPTist通信失败: ${error.message}`, 'error');
    return false;
  }
}

console.log('PptLoader模块已加载'); 