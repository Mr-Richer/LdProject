/**
 * 独立思维导图生成器
 * 不依赖模块化导入，避免import语法错误
 */

// 全局配置 - 从全局配置对象获取基础URL
const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || 'http://localhost:3000';
const MINDMAP_API_URL = `${API_BASE_URL}/api/mindmap`;

// 初始化时输出配置信息
console.log('思维导图配置信息:', { 
  API_BASE_URL, 
  MINDMAP_API_URL,
  '当前页面URL': window.location.href
});

// 思维导图生成器
const StandaloneMindmap = {
  // 当前ECharts实例
  chart: null,
  
  // 初始化思维导图生成器
  init: function(containerSelector) {
    console.log('初始化独立思维导图生成器', { containerSelector });
    
    // 检查ECharts是否已加载，如果未加载则动态加载
    if (typeof echarts === 'undefined') {
      console.error('错误: 未找到ECharts库');
      this.loadECharts();
      return;
    }
    
    // 找到容器元素 - 支持类名或ID
    let container;
    if (containerSelector.startsWith('.')) {
      container = document.querySelector(containerSelector);
    } else if (containerSelector.startsWith('#')) {
      container = document.getElementById(containerSelector.substring(1));
    } else {
      container = document.getElementById(containerSelector) || document.querySelector('.' + containerSelector);
    }
    
    if (!container) {
      console.error(`错误: 未找到容器元素 ${containerSelector}`);
      // 记录所有可能的容器元素
      const possibleContainers = Array.from(document.querySelectorAll('.mindmap-container, .chart-container, [id*="mindmap"], [class*="mindmap"]'));
      console.log('页面上所有可能的容器元素:', possibleContainers.map(el => ({ id: el.id, className: el.className })));
      return;
    }
    
    console.log('找到思维导图容器:', { id: container.id, className: container.className });
    
    // 创建思维导图容器
    this.createMindmapContainer(container);
    
    // 绑定生成按钮事件
    this.bindGenerateButton();
    
    // 绑定下载按钮事件
    this.bindActionButtons();
    
    // 添加窗口调整事件
    window.addEventListener('resize', () => {
      if (this.chart) {
        this.chart.resize();
      }
    });
  },
  
  // 动态加载ECharts库
  loadECharts: function() {
    console.log('正在动态加载ECharts库...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
    script.onload = () => {
      console.log('ECharts库已成功加载');
      // 重新初始化
      setTimeout(() => this.init('.mindmap-container'), 500);
    };
    script.onerror = (error) => console.error('加载ECharts库失败:', error);
    document.head.appendChild(script);
  },
  
  // 绑定生成按钮
  bindGenerateButton: function() {
    // 在页面中查找所有可能的生成按钮
    console.log('开始寻找并绑定生成按钮...');
    
    const possibleSelectors = [
      '.generate-btn', 
      '.ai-generate-btn', 
      '#mindmap-generate-btn',
      'button[class*="generate"]', 
      'button[id*="generate"]'
    ];
    
    console.log('将使用以下选择器:', possibleSelectors);
    const possibleButtons = possibleSelectors.join(',');
    
    try {
      const generateButtons = document.querySelectorAll(possibleButtons);
      console.log(`通过选择器找到 ${generateButtons.length} 个生成按钮`);
      console.log('找到的所有可能生成按钮:', Array.from(generateButtons).map(btn => ({
        text: btn.textContent.trim(),
        className: btn.className,
        id: btn.id
      })));

      // 如果没有直接找到按钮，尝试通过文本内容查找
      if (generateButtons.length === 0) {
        console.log('通过选择器未找到按钮，尝试通过文本内容查找');
        // 查找所有按钮，然后过滤包含特定文本的按钮
        const allButtons = document.querySelectorAll('button');
        console.log(`页面上找到 ${allButtons.length} 个按钮元素`);
        
        const filteredButtons = Array.from(allButtons).filter(btn => {
          const text = btn.textContent.trim();
          const matched = text.includes('生成思维导图') || text.includes('AI生成思维导图');
          if (matched) {
            console.log('找到文本匹配的按钮:', text);
          }
          return matched;
        });
        
        console.log(`通过文本内容找到 ${filteredButtons.length} 个按钮`);
        
        // 为找到的每个按钮绑定事件
        filteredButtons.forEach(btn => this.bindButtonEvent(btn));
      } else {
        // 解除现有的点击事件并重新绑定
        generateButtons.forEach(btn => this.bindButtonEvent(btn));
      }
    } catch (error) {
      console.error('在查找生成按钮时发生错误:', error);
      this.showDebugInfo('在查找生成按钮时发生错误', error.message);
      
      // 尝试一种更简单的方法
      console.log('使用基本方法查找按钮...');
      try {
        const simpleButtons = document.querySelectorAll('.generate-btn, .ai-generate-btn, #mindmap-generate-btn');
        console.log(`使用简单选择器找到 ${simpleButtons.length} 个按钮`);
        simpleButtons.forEach(btn => this.bindButtonEvent(btn));
      } catch (e) {
        console.error('使用简单方法也失败了:', e);
      }
    }
  },
  
  // 绑定按钮事件（提取为单独函数，避免代码重复）
  bindButtonEvent: function(btn) {
    // 移除可能已有的事件监听器（通过复制按钮替换原按钮）
    const cloneBtn = btn.cloneNode(true);
    if (btn.parentNode) {
      btn.parentNode.replaceChild(cloneBtn, btn);
      
      // 添加新的点击事件
      cloneBtn.addEventListener('click', (e) => {
        console.log('生成按钮被点击 - 事件触发', e.target);
        this.generateMindmap();
      });
      
      console.log('思维导图生成按钮已绑定', {
        button: cloneBtn,
        text: cloneBtn.textContent
      });
    } else {
      console.warn('按钮没有父节点，无法替换:', btn);
    }
  },
  
  // 绑定其他动作按钮（下载、全屏等）
  bindActionButtons: function() {
    // 绑定下载按钮事件
    const downloadBtn = document.querySelector('.result-action-btn i.fa-download, .result-action-btn i.fas.fa-download')?.parentElement;
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadImage());
      console.log('下载按钮已绑定');
    }
    
    // 绑定全屏按钮
    let fullscreenBtn = document.querySelector('.result-action-btn i.fa-expand, .result-action-btn i.fas.fa-expand')?.parentElement;
    
    // 如果没有全屏按钮，创建一个
    if (!fullscreenBtn) {
      const actionArea = document.querySelector('.knowledge-result .result-actions');
      if (actionArea) {
        fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'result-action-btn';
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i><span class="zh">全屏</span>';
        actionArea.appendChild(fullscreenBtn);
        console.log('已创建全屏按钮');
      }
    }
    
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
        const icon = fullscreenBtn.querySelector('i');
        const text = fullscreenBtn.querySelector('span.zh');
        if (icon && icon.classList.contains('fa-expand')) {
          icon.classList.remove('fa-expand');
          icon.classList.add('fa-compress');
          if (text) text.textContent = '退出全屏';
        } else if (icon) {
          icon.classList.remove('fa-compress');
          icon.classList.add('fa-expand');
          if (text) text.textContent = '全屏';
        }
      });
      console.log('全屏按钮已绑定');
    }
  },
  
  // 创建思维导图容器
  createMindmapContainer: function(parentElement) {
    console.log('开始创建思维导图容器', parentElement);
    
    // 清空现有内容
    const existingChart = parentElement.querySelector('#echarts-mindmap');
    if (existingChart) {
      existingChart.remove();
      console.log('移除了已存在的图表容器');
    }
    
    // 清除占位符显示
    const placeholder = parentElement.querySelector('.mindmap-placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
      console.log('隐藏占位符');
    }
    
    // 创建新的图表容器
    const chartDiv = document.createElement('div');
    chartDiv.id = 'echarts-mindmap';
    chartDiv.style.width = '100%';
    chartDiv.style.height = '500px';
    chartDiv.style.backgroundColor = '#f5f5f5';
    
    // 创建加载指示器
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = `
      <div class="spinner"></div>
      <p>正在生成思维导图，请稍候...</p>
    `;
    loadingDiv.style.display = 'none';
    
    // 添加到父元素
    parentElement.appendChild(chartDiv);
    parentElement.appendChild(loadingDiv);
    console.log('已创建并添加图表容器和加载指示器');
    
    // 确保容器有尺寸
    parentElement.style.width = '100%';
    parentElement.style.height = '600px';
    chartDiv.style.width = '100%';
    chartDiv.style.height = '600px';
    
    // 初始化图表
    try {
      this.chart = echarts.init(chartDiv);
      console.log('ECharts实例初始化成功');
      
      // 显示一个基本图表，确认初始化成功
      this.chart.setOption({
        title: {
          text: '思维导图准备就绪',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        }
      });
    } catch (error) {
      console.error('初始化ECharts实例失败:', error);
      this.showDebugInfo('初始化ECharts实例失败', error.message);
    }
  },
  
  // 显示加载指示器
  showLoading: function() {
    const loadingEl = document.querySelector('.mindmap-container .loading-indicator');
    if (loadingEl) {
      loadingEl.style.display = 'flex';
      console.log('显示加载指示器');
    } else {
      console.warn('警告: 未找到加载指示器元素');
    }
    
    if (this.chart) {
      this.chart.showLoading({
        text: '正在生成思维导图...',
        color: '#1890ff',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.8)'
      });
    }
  },
  
  // 隐藏加载指示器
  hideLoading: function() {
    const loadingEl = document.querySelector('.mindmap-container .loading-indicator');
    if (loadingEl) {
      loadingEl.style.display = 'none';
      console.log('隐藏加载指示器');
    }
    
    if (this.chart) {
      this.chart.hideLoading();
    }
  },
  
  // 从提示词中提取关键词
  extractKeywords: function(prompt) {
    // 分割提示词，移除常见的停用词，提取关键词
    const stopWords = ['的', '和', '与', '在', '是', '了', '中', '对', '有', '及', '或'];
    let words = prompt.split(/[,，、\s]+/);
    
    // 过滤掉停用词和空字符串，限制最多10个关键词
    const keywords = words
      .filter(word => word && word.length > 1 && !stopWords.includes(word))
      .slice(0, 10);
      
    console.log('从输入中提取的关键词:', { 原始输入: prompt, 提取结果: keywords });
    return keywords;
  },
  
  // 显示调试信息
  showDebugInfo: function(message, data) {
    console.log(message, data);
    
    // 将调试信息添加到页面上的调试区域
    let debugInfo = document.getElementById('debug-info');
    let debugContent = document.getElementById('debug-content');
    
    // 如果调试区域不存在，创建一个
    if (!debugInfo) {
      console.log('创建调试信息区域');
      debugInfo = document.createElement('div');
      debugInfo.id = 'debug-info';
      debugInfo.style.cssText = 'position: fixed; bottom: 10px; right: 10px; width: 400px; max-height: 200px; overflow: auto; background: rgba(255,255,255,0.95); border: 1px solid #ddd; border-radius: 5px; padding: 10px; font-size: 12px; z-index: 9999; box-shadow: 0 0 10px rgba(0,0,0,0.1);';
      
      // 标题栏
      const titleBar = document.createElement('div');
      titleBar.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid #eee;';
      titleBar.innerHTML = '<strong>思维导图调试信息</strong>';
      
      // 添加关闭按钮
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '关闭';
      closeBtn.style.cssText = 'background: #f5f5f5; border: 1px solid #ddd; border-radius: 3px; padding: 2px 5px; cursor: pointer;';
      closeBtn.onclick = function() {
        debugInfo.style.display = 'none';
      };
      titleBar.appendChild(closeBtn);
      
      // 清空按钮
      const clearBtn = document.createElement('button');
      clearBtn.innerHTML = '清空';
      clearBtn.style.cssText = 'background: #f5f5f5; border: 1px solid #ddd; border-radius: 3px; padding: 2px 5px; margin-right: 5px; cursor: pointer;';
      clearBtn.onclick = function() {
        debugContent.innerHTML = '';
      };
      titleBar.appendChild(clearBtn);
      
      debugInfo.appendChild(titleBar);
      
      // 内容区域
      debugContent = document.createElement('div');
      debugContent.id = 'debug-content';
      debugContent.style.maxHeight = '150px';
      debugContent.style.overflow = 'auto';
      debugInfo.appendChild(debugContent);
      
      document.body.appendChild(debugInfo);
    } else if (debugInfo.style.display === 'none') {
      // 如果调试区域存在但被隐藏，则显示出来
      debugInfo.style.display = 'block';
    }
    
    if (debugContent) {
      // 显示调试区域
      debugInfo.style.display = 'block';
      
      // 创建新的日志条目
      const logItem = document.createElement('div');
      logItem.style.marginBottom = '8px';
      
      // 格式化时间
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      // 设置日志内容
      let logText = `<strong>${timeStr}</strong> - ${message}`;
      
      // 如果有数据，添加格式化的数据
      if (data !== undefined) {
        let dataStr;
        try {
          if (typeof data === 'object') {
            dataStr = JSON.stringify(data, null, 2);
          } else {
            dataStr = String(data);
          }
          logText += `<br><pre style="margin: 5px 0; padding: 5px; background: #f0f0f0; overflow: auto; max-height: 100px;">${dataStr}</pre>`;
        } catch (error) {
          logText += `<br><pre>无法显示数据: ${error.message}</pre>`;
        }
      }
      
      logItem.innerHTML = logText;
      debugContent.appendChild(logItem);
      
      // 如果日志条目太多，删除旧的
      if (debugContent.children.length > 10) {
        debugContent.removeChild(debugContent.firstChild);
      }
      
      // 滚动到底部
      debugInfo.scrollTop = debugInfo.scrollHeight;
    }
  },
  
  // 生成思维导图
  generateMindmap: function() {
    console.log('开始生成思维导图');
    this.showDebugInfo('开始生成思维导图');
    
    // 查找所有可能的输入框
    const promptInputs = document.querySelectorAll('.prompt-input.zh, #knowledge-content .prompt-input, textarea.prompt-input');
    this.showDebugInfo('找到输入框', promptInputs.length);
    
    // 尝试找到知识拓展输入框
    let promptInput = document.querySelector('#knowledge-content .prompt-input.zh');
    
    // 如果找不到特定的输入框，使用任何带有值的输入框
    if (!promptInput || !promptInput.value.trim()) {
      for (const input of promptInputs) {
        if (input.value && input.value.trim()) {
          promptInput = input;
          this.showDebugInfo('使用替代输入框', { id: input.id, className: input.className });
          break;
        }
      }
    }
    
    if (!promptInput) {
      this.showDebugInfo('错误: 未找到任何输入框');
      alert('错误: 未找到输入框，请检查页面结构');
      return;
    }
    
    const topic = (promptInput.value || '中国传统文化').trim();
    if (!topic) {
      this.showDebugInfo('警告: 输入为空，使用默认主题');
      alert('请输入要拓展的知识点');
      return;
    }
    
    this.showDebugInfo('用户输入主题', topic);
    
    // 显示加载指示器
    this.showLoading();
    
    try {
      // 提取关键词
      const keywords = this.extractKeywords(topic);
      this.showDebugInfo('提取的关键词', keywords);
      
      // 创建思维导图结构
      const mindmapData = this.createMindmapStructure(topic);
      
      // 渲染思维导图
      this.renderMindmap(mindmapData);
      this.showDebugInfo('思维导图渲染完成');
      
      // 尝试通过API创建思维导图（后台运行，不阻止UI显示）
      this.tryFetchFromAPI(topic, keywords);
    } catch (error) {
      this.showDebugInfo('生成思维导图失败', error.message);
      alert(`生成失败: ${error.message || '未知错误'}`);
    } finally {
      // 隐藏加载指示器
      this.hideLoading();
    }
  },
  
  // 创建思维导图结构
  createMindmapStructure: function(topic) {
    console.log('创建本地思维导图结构, 主题:', topic);
    
    // 解析主题，提取关键词
    let mainTopics = [];
    
    // 根据主题特点确定不同的主题分支
    if (topic.includes('历史') || topic.includes('文化') || topic.includes('艺术')) {
      mainTopics = ['起源背景', '发展历程', '主要特点', '代表人物', '现代影响'];
    } else if (topic.includes('科学') || topic.includes('技术')) {
      mainTopics = ['基本原理', '发展历程', '重要突破', '应用领域', '未来展望'];
    } else if (topic.includes('文学') || topic.includes('小说') || topic.includes('诗词')) {
      mainTopics = ['创作背景', '主要作品', '艺术特色', '社会影响', '后世评价'];
    } else {
      // 默认通用结构
      mainTopics = ['定义与起源', '基本要素', '发展历程', '主要特点', '现代应用'];
    }
    
    // 创建思维导图数据结构
    const mindmapData = {
      name: topic,
      children: []
    };
    
    // 添加主要分支
    mainTopics.forEach(mainTopic => {
      const branch = {
        name: mainTopic,
        children: []
      };
      
      // 为每个主要分支添加2-3个子分支
      if (mainTopic === '起源背景' || mainTopic === '定义与起源') {
        branch.children.push(
          { name: '历史背景' },
          { name: '产生原因' },
          { name: '早期形态' }
        );
      } else if (mainTopic === '发展历程') {
        branch.children.push(
          { name: '早期阶段' },
          { name: '成熟时期' },
          { name: '现代发展' }
        );
      } else if (mainTopic === '主要特点' || mainTopic === '基本要素') {
        branch.children.push(
          { name: '形式特征' },
          { name: '内容特点' },
          { name: '表现手法' }
        );
      } else if (mainTopic.includes('人物') || mainTopic.includes('作品')) {
        branch.children.push(
          { name: '代表人物/作品1' },
          { name: '代表人物/作品2' },
          { name: '代表人物/作品3' }
        );
      } else if (mainTopic.includes('影响') || mainTopic.includes('应用')) {
        branch.children.push(
          { name: '社会影响' },
          { name: '文化价值' },
          { name: '现代应用' }
        );
      } else {
        // 默认子分支
        branch.children.push(
          { name: `${mainTopic}的要素1` },
          { name: `${mainTopic}的要素2` }
        );
      }
      
      mindmapData.children.push(branch);
    });
    
    console.log('生成的思维导图结构:', mindmapData);
    return mindmapData;
  },
  
  // 尝试从API获取思维导图数据
  tryFetchFromAPI: function(topic, keywords) {
    // 准备请求数据
    const requestData = {
      title: topic,
      central_topic: topic,
      selectedKnowledgePoints: [],
      keywords: keywords.join(','),
      style: 'standard',
      max_levels: 4
    };
    
    // 获取认证令牌
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // 如果没有令牌，记录这个问题但继续使用本地生成的思维导图
      this.showDebugInfo('警告: 未找到认证令牌', '将使用本地生成的思维导图');
      console.warn('未找到认证令牌，API请求可能会因未授权而失败');
    }
    
    this.showDebugInfo('尝试通过API获取数据', { url: MINDMAP_API_URL });
    
    // 添加超时控制，避免长时间等待
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
    // 异步发送API请求，不等待结果
    fetch(MINDMAP_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
      signal: controller.signal
    }).then(response => {
      clearTimeout(timeoutId);
      this.showDebugInfo('API响应', { 
        状态码: response.status, 
        状态文本: response.statusText 
      });
      
      if (response.ok) {
        return response.json();
      } else {
        // 将详细的错误信息记录到控制台和调试信息
        console.warn(`API请求失败，状态码: ${response.status}`, response);
        this.showDebugInfo('API请求失败', `状态码: ${response.status} (${response.statusText})`);
        
        // 如果是401未授权错误，给出明确的提示
        if (response.status === 401) {
          this.showDebugInfo('未授权访问API', '请登录或确保有效的认证令牌');
          console.warn('API访问未授权，请确保用户已登录');
        }
        
        // 尝试读取响应内容
        return response.text().then(text => {
          try {
            // 尝试解析为JSON
            const jsonError = JSON.parse(text);
            throw new Error(`API请求失败: ${jsonError.message || response.statusText}`);
          } catch (e) {
            throw new Error(`API请求失败: ${response.status} - ${text || response.statusText}`);
          }
        });
      }
    }).then(result => {
      this.showDebugInfo('API返回数据成功', result);
      
      // 如果API返回了完整的数据结构，用它来更新图表
      if (result && result.data && result.data.mindmap) {
        this.renderMindmap(result.data.mindmap);
        this.showDebugInfo('使用API数据更新思维导图');
      } else {
        this.showDebugInfo('API返回数据格式不符合预期', result);
        console.warn('API响应格式不符合预期:', result);
      }
    }).catch(error => {
      clearTimeout(timeoutId);
      const errorMessage = error.name === 'AbortError' 
        ? 'API请求超时，已自动取消' 
        : `API请求异常: ${error.message}`;
        
      this.showDebugInfo('API请求异常', errorMessage);
      console.warn('获取思维导图API异常:', error);
      
      // 这里不需要处理，因为我们已经渲染了本地生成的思维导图
      this.showDebugInfo('继续使用本地生成的思维导图', '不阻止用户体验');
    });
  },
  
  // 渲染思维导图
  renderMindmap: function(treeData) {
    console.log('开始渲染思维导图', { 
      '是否有chart实例': !!this.chart,
      '树数据是否存在': !!treeData 
    });
    
    if (!this.chart) {
      console.error('错误: ECharts实例未初始化');
      return;
    }
    
    if (!treeData) {
      console.error('错误: 思维导图数据为空');
      return;
    }
    
    // 基本配置
    const option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [treeData],
          top: '10%',
          left: '8%',
          bottom: '10%',
          right: '20%',
          symbolSize: 10,
          initialTreeDepth: -1, // 展开所有节点
          layout: 'radial',
          orient: 'LR',
          label: {
            position: 'inside',
            verticalAlign: 'middle',
            align: 'center',
            fontSize: 14,
            padding: 8,
            formatter: function(params) {
              // 添加安全检查，防止params或treePathInfo是undefined
              if (!params || !params.treePathInfo || !Array.isArray(params.treePathInfo)) {
                console.warn('格式化标签时收到无效数据:', params);
                return params && params.name ? `{style0|${params.name}}` : '[错误数据]';
              }
              
              try {
                // 为不同层级设置不同样式
                const level = Math.min(params.treePathInfo.length - 1, 4); // 最大限制为4级
                return `{style${level}|${params.name || ''}}`;
              } catch (error) {
                console.error('格式化标签时出错:', error, params);
                return params && params.name ? `{style0|${params.name}}` : '[格式化错误]';
              }
            },
            rich: {
              style0: {
                backgroundColor: '#131E40',
                color: '#fff',
                borderRadius: 5,
                padding: [10, 15]
              },
              style1: {
                backgroundColor: '#E74C3C',
                color: '#fff',
                borderRadius: 5,
                padding: [8, 12]
              },
              style2: {
                backgroundColor: '#FADBD8',
                color: '#333',
                borderRadius: 5,
                padding: [6, 10]
              },
              style3: {
                backgroundColor: '#D5F5E3',
                color: '#333',
                borderRadius: 5,
                padding: [6, 10]
              },
              style4: {
                backgroundColor: '#FCF3CF',
                color: '#333',
                borderRadius: 5,
                padding: [4, 8]
              }
            }
          },
          leaves: {
            label: {
              position: 'inside',
              verticalAlign: 'middle',
              align: 'center'
            }
          },
          emphasis: {
            focus: 'descendant'
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
          lineStyle: {
            color: '#999',
            width: 2,
            curveness: 0.3
          }
        }
      ]
    };
    
    // 显示加载动画
    this.chart.showLoading();
    
    // 渲染图表
    try {
      this.chart.setOption(option);
      console.log('思维导图渲染完成');
    } catch (error) {
      console.error('渲染思维导图时出错:', error);
      this.showDebugInfo('渲染思维导图失败', error.message);
    } finally {
      // 隐藏加载动画
      this.chart.hideLoading();
    }
  },
  
  // 下载思维导图图片
  downloadImage: function() {
    console.log('下载思维导图图片');
    if (!this.chart) {
      console.error('错误: 没有可下载的思维导图');
      alert('错误: 没有可下载的思维导图');
      return;
    }
    
    try {
      // 获取图片数据
      const imgData = this.chart.getDataURL({
        type: 'png',
        backgroundColor: '#fff',
        pixelRatio: 2 // 高清图片
      });
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `mindmap_${new Date().getTime()}.png`;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('思维导图下载成功');
    } catch (error) {
      console.error('下载思维导图图片失败:', error);
      alert('下载失败: ' + (error.message || '未知错误'));
    }
  },
  
  // 切换全屏显示
  toggleFullscreen: function() {
    console.log('切换思维导图全屏显示');
    const chartContainer = document.getElementById('echarts-mindmap');
    if (!chartContainer) {
      console.error('错误: 找不到图表容器');
      return;
    }
    
    try {
      if (!document.fullscreenElement) {
        // 进入全屏
        if (chartContainer.requestFullscreen) {
          chartContainer.requestFullscreen();
        } else if (chartContainer.webkitRequestFullscreen) {
          chartContainer.webkitRequestFullscreen();
        } else if (chartContainer.msRequestFullscreen) {
          chartContainer.msRequestFullscreen();
        }
        console.log('进入全屏模式');
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        console.log('退出全屏模式');
      }
      
      // 调整图表大小
      setTimeout(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
    } catch (error) {
      console.error('切换全屏模式失败:', error);
    }
  }
};

// 暴露为全局变量
window.StandaloneMindmap = StandaloneMindmap;

// 输出初始状态
console.log('思维导图脚本已加载，当前环境:', {
  '当前URL': window.location.href,
  '是否有ECharts': typeof echarts !== 'undefined',
  'API基础地址': API_BASE_URL,
  '思维导图API地址': MINDMAP_API_URL
}); 