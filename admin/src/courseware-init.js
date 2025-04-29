/**
 * courseware-init.js
 * 负责初始化课件相关模块的独立脚本
 * 可以直接通过script标签在HTML中引用
 */

(function() {
  // 执行初始化的主函数
  async function initCoursewareModules() {
    console.log('开始初始化课件模块...');
    
    try {
      // 加载PPT模块加载器
      await loadPptModuleLoader();
      
      // 初始化PPT模块
      if (window.PptModuleLoader) {
        console.log('PPT模块加载器已就绪，开始初始化...');
        const initSuccess = await window.PptModuleLoader.init();
        
        // 如果初始化失败，添加故障排除按钮
        if (!initSuccess) {
          addTroubleshootButton();
        }
      } else {
        console.error('PPT模块加载器未正确加载');
        showInitError('PPT模块加载失败');
      }
      
      // 这里可以加载其他课件相关模块
      
      // 绑定"替换课件"按钮事件
      bindReplaceButton();
      
      // 添加工具栏 - 测试连接按钮
      addTestConnectionButton();
      
      console.log('课件模块初始化完成');
    } catch (error) {
      console.error('初始化课件模块失败:', error);
      showInitError('课件初始化失败: ' + error.message);
    }
  }
  
  // 加载PPT模块加载器
  function loadPptModuleLoader() {
    return new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = '../src/components/courseware/PptModuleLoader.js';
        script.type = 'text/javascript';
        
        script.onload = () => {
          console.log('PPT模块加载器脚本加载成功');
          resolve();
        };
        
        script.onerror = (error) => {
          console.error('加载PPT模块加载器失败:', error);
          reject(new Error('无法加载PPT模块加载器'));
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('加载PPT模块加载器时出错:', error);
        reject(error);
      }
    });
  }
  
  // 添加故障排除按钮
  function addTroubleshootButton() {
    console.log('正在添加故障排除按钮...');
    
    const coursewareContent = document.getElementById('courseware-content');
    if (!coursewareContent) {
      console.error('无法找到课件内容区域，无法添加故障排除按钮');
      return;
    }
    
    // 检查是否已存在故障排除按钮
    if (document.getElementById('troubleshoot-btn')) {
      return;
    }
    
    // 创建故障排除按钮
    const troubleshootBtn = document.createElement('button');
    troubleshootBtn.id = 'troubleshoot-btn';
    troubleshootBtn.className = 'troubleshoot-btn';
    troubleshootBtn.innerHTML = '修复PPT连接问题';
    troubleshootBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #f44336;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      z-index: 100;
    `;
    
    troubleshootBtn.addEventListener('click', async function() {
      this.disabled = true;
      this.innerHTML = '正在修复...';
      
      try {
        // 尝试修复连接问题
        await fixPptistConnection();
        
        this.innerHTML = '修复成功';
        this.style.backgroundColor = '#4CAF50';
        
        // 3秒后隐藏按钮
        setTimeout(() => {
          this.style.display = 'none';
        }, 3000);
      } catch (error) {
        console.error('修复连接失败:', error);
        this.innerHTML = '修复失败';
        this.disabled = false;
        
        // 显示更详细的错误信息
        showInitError('无法修复PPT连接: ' + error.message);
      }
    });
    
    // 添加到课件内容区域
    coursewareContent.appendChild(troubleshootBtn);
  }
  
  // 修复PPTist连接问题
  async function fixPptistConnection() {
    console.log('尝试修复PPTist连接问题...');
    
    // 确保所有模块已加载
    if (!window.PptistBridge || !window.PptLoader) {
      console.log('模块未加载，尝试重新加载...');
      await window.PptModuleLoader.loadModules();
    }
    
    // 检查iframe是否存在
    const frame = window.PptistBridge.getPptistFrame();
    if (!frame) {
      throw new Error('找不到PPTist iframe元素');
    }
    
    // 检查iframe是否可见
    if (!window.PptLoader.checkPPTistVisible()) {
      // 尝试激活所在的选项卡
      const coursewareBtn = document.querySelector('.tab-btn[data-tab="courseware"]');
      if (coursewareBtn) {
        console.log('尝试激活课件设计选项卡...');
        coursewareBtn.click();
      }
    }
    
    // 尝试刷新iframe
    try {
      console.log('尝试刷新PPTist iframe...');
      
      // 备份原始src
      const originalSrc = frame.src;
      
      // 清空src后重新设置，强制刷新
      frame.src = '';
      await new Promise(resolve => setTimeout(resolve, 500));
      frame.src = originalSrc;
      
      // 等待iframe加载完成
      console.log('等待PPTist iframe重新加载...');
      const frameLoaded = await new Promise((resolve) => {
        const loadHandler = () => {
          frame.removeEventListener('load', loadHandler);
          resolve(true);
        };
        
        frame.addEventListener('load', loadHandler);
        
        // 设置超时
        setTimeout(() => {
          frame.removeEventListener('load', loadHandler);
          resolve(false);
        }, 10000);
      });
      
      if (!frameLoaded) {
        console.warn('PPTist iframe重新加载超时');
      } else {
        console.log('PPTist iframe已重新加载');
      }
      
      // 等待短时间让iframe完全初始化
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 重新初始化通信
      window.PptistBridge.initMessageReceiver();
      
      // 测试连接
      const testResult = await window.PptLoader.testPPTistConnection();
      if (!testResult) {
        throw new Error('测试连接失败，PPTist未响应');
      }
      
      // 显示成功通知
      if (window.showNotification) {
        window.showNotification('PPT连接已修复', 'success');
      }
      
      return true;
    } catch (error) {
      console.error('刷新iframe失败:', error);
      throw error;
    }
  }
  
  // 添加测试连接按钮
  function addTestConnectionButton() {
    // 等待DOM加载完成后添加
    const waitForToolbar = setInterval(() => {
      const toolbar = document.querySelector('.courseware-toolbar') || 
                     document.querySelector('.action-buttons');
      
      if (toolbar) {
        clearInterval(waitForToolbar);
        
        // 检查是否已存在按钮
        if (document.getElementById('test-pptist-btn')) {
          return;
        }
        
        // 创建测试按钮
        const testBtn = document.createElement('button');
        testBtn.id = 'test-pptist-btn';
        testBtn.className = 'action-button test';
        testBtn.innerHTML = '测试PPT连接';
        testBtn.style.marginLeft = '10px';
        
        testBtn.addEventListener('click', async function(e) {
          e.stopPropagation();
          
          // 显示加载状态
          this.disabled = true;
          const originalText = this.innerHTML;
          this.innerHTML = '正在测试...';
          
          try {
            // 测试连接
            const result = await window.PptLoader.testPPTistConnection();
            
            if (result) {
              this.innerHTML = '连接正常';
              this.style.backgroundColor = '#4CAF50';
              
              // 3秒后恢复原样
              setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
                this.disabled = false;
              }, 3000);
            } else {
              this.innerHTML = '连接失败';
              this.style.backgroundColor = '#f44336';
              
              // 添加修复按钮
              addTroubleshootButton();
              
              // 3秒后恢复原样
              setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
                this.disabled = false;
              }, 3000);
            }
          } catch (error) {
            console.error('测试连接时出错:', error);
            this.innerHTML = '测试错误';
            this.style.backgroundColor = '#f44336';
            
            setTimeout(() => {
              this.innerHTML = originalText;
              this.style.backgroundColor = '';
              this.disabled = false;
            }, 3000);
          }
        });
        
        // 添加到工具栏
        toolbar.appendChild(testBtn);
      }
    }, 500);
    
    // 超时清除
    setTimeout(() => {
      clearInterval(waitForToolbar);
    }, 10000);
  }
  
  // 显示初始化错误
  function showInitError(message) {
    // 显示在控制台
    console.error('课件初始化错误:', message);
    
    // 尝试使用通知系统
    if (window.showNotification && typeof window.showNotification === 'function') {
      window.showNotification(message, 'error');
    }
    
    // 在课件区域显示错误
    const coursewareContent = document.getElementById('courseware-content');
    if (coursewareContent) {
      const errorEl = document.createElement('div');
      errorEl.className = 'courseware-init-error';
      errorEl.innerHTML = `
        <div style="padding: 20px; background-color: #fff0f0; border: 1px solid #ffcccc; border-radius: 4px; margin: 10px;">
          <h3 style="color: #cc0000; margin-top: 0;">初始化错误</h3>
          <p>${message}</p>
          <button onclick="location.reload()" style="padding: 5px 10px; background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; cursor: pointer;">
            刷新页面
          </button>
        </div>
      `;
      
      // 如果已经有错误元素，替换它，否则添加新元素
      const existingError = coursewareContent.querySelector('.courseware-init-error');
      if (existingError) {
        coursewareContent.replaceChild(errorEl, existingError);
      } else {
        // 清空容器并添加错误信息
        coursewareContent.appendChild(errorEl);
      }
    }
  }
  
  // 绑定"替换课件"按钮事件
  function bindReplaceButton() {
    // 等待DOM加载完成后绑定
    const waitForButton = setInterval(() => {
      const replaceBtn = document.querySelector('.action-button.replace');
      if (replaceBtn) {
        clearInterval(waitForButton);
        
        // 移除旧事件并添加新事件
        const newBtn = replaceBtn.cloneNode(true);
        replaceBtn.parentNode.replaceChild(newBtn, replaceBtn);
        
        newBtn.addEventListener('click', function(e) {
          e.stopPropagation(); // 阻止事件冒泡
          console.log('触发替换课件功能');
          
          // 获取当前章节并加载其PPT
          const chapterSelect = document.getElementById('chapter-select');
          if (chapterSelect && chapterSelect.value) {
            if (window.PptLoader && typeof window.PptLoader.loadChapterPPT === 'function') {
              // 显示加载提示
              if (window.showNotification) {
                window.showNotification('正在重新加载章节PPT', 'info');
              }
              
              // 禁用按钮，显示加载状态
              this.disabled = true;
              const originalText = this.innerHTML;
              this.innerHTML = '加载中...';
              
              // 加载PPT
              window.PptLoader.loadChapterPPT(chapterSelect.value)
                .then(success => {
                  if (success && window.showNotification) {
                    window.showNotification('PPT已成功替换', 'success');
                    this.innerHTML = '替换成功';
                    this.style.backgroundColor = '#4CAF50';
                  } else {
                    this.innerHTML = '替换失败';
                    this.style.backgroundColor = '#f44336';
                  }
                  
                  // 恢复按钮状态
                  setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.backgroundColor = '';
                    this.disabled = false;
                  }, 3000);
                })
                .catch(error => {
                  console.error('加载PPT失败:', error);
                  if (window.showNotification) {
                    window.showNotification('替换PPT失败: ' + error.message, 'error');
                  }
                  
                  this.innerHTML = '替换失败';
                  this.style.backgroundColor = '#f44336';
                  
                  // 恢复按钮状态
                  setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.backgroundColor = '';
                    this.disabled = false;
                  }, 3000);
                  
                  // 添加故障排除按钮
                  addTroubleshootButton();
                });
            } else {
              console.error('PPT加载模块未就绪，无法加载章节PPT');
              if (window.showNotification) {
                window.showNotification('PPT替换失败: 加载模块未就绪', 'error');
              }
              
              // 添加故障排除按钮
              addTroubleshootButton();
            }
          } else {
            console.warn('未选择章节，无法加载PPT');
            if (window.showNotification) {
              window.showNotification('请先选择章节', 'warning');
            }
          }
        });
        
        console.log('替换课件按钮事件已绑定');
      }
    }, 500);
    
    // 设置超时，避免无限等待
    setTimeout(() => {
      clearInterval(waitForButton);
    }, 10000);
  }
  
  // 在DOM加载完成后执行初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCoursewareModules);
  } else {
    // 如果DOM已加载完成，立即执行
    initCoursewareModules();
  }
})(); 