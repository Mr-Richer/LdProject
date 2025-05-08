/**
 * 思维导图控制器
 * 连接思维导图UI和后端API
 */

import { MindmapService } from '../services/mindmap.service.js';
import MindmapGenerator from '../components/mindmap/MindmapGenerator.js';

/**
 * 初始化思维导图功能
 */
export function initMindmapController() {
  console.log('初始化思维导图控制器...');

  // 获取DOM元素 - 增加多种选择器以适应不同的UI结构
  const generateBtn = document.querySelector('#knowledge-content .generate-btn') || 
                     document.querySelector('#knowledge-content .ai-generate-btn');
  const categoryButtons = document.querySelectorAll('.culture-btn');
  const promptInput = document.querySelector('#knowledge-content .prompt-input.zh');
  
  // 检查元素是否存在
  if (!generateBtn) {
    console.error('未找到生成按钮，请检查选择器或HTML结构');
    return;
  }
  
  if (!promptInput) {
    console.error('未找到输入框，请检查选择器或HTML结构');
    return;
  }
  
  // 寻找思维导图容器
  let mindmapContainer = document.querySelector('.mindmap-container');
  if (!mindmapContainer) {
    console.log('未找到思维导图容器，尝试创建...');
    // 如果找不到，尝试在结果内容中创建
    const resultContent = document.querySelector('.result-content');
    if (resultContent) {
      mindmapContainer = document.createElement('div');
      mindmapContainer.className = 'mindmap-container';
      resultContent.appendChild(mindmapContainer);
      console.log('已创建思维导图容器');
    } else {
      console.error('未找到结果内容区域，无法创建思维导图容器');
      return;
    }
  }
  
  const downloadBtn = document.querySelector('#knowledge-content .result-action-btn i.fa-download')?.parentElement;
  const saveBtn = document.querySelector('#knowledge-content .result-action-btn i.fa-save')?.parentElement;
  const editBtn = document.querySelector('#knowledge-content .result-action-btn i.fa-edit')?.parentElement;
  const knowledgeResult = document.querySelector('.knowledge-result');
  
  // 创建加载指示器
  const loadingEl = document.createElement('div');
  
  // 当前选择的类别
  let currentCategory = 'history'; // 默认为历史类别
  
  // 初始化加载元素
  loadingEl.className = 'loading-indicator';
  loadingEl.innerHTML = `
    <div class="spinner"></div>
    <p>正在生成思维导图，请稍候...</p>
  `;
  loadingEl.style.display = 'none';
  mindmapContainer.appendChild(loadingEl);
  
  // 创建思维导图生成器实例
  let mindmapDiv = document.createElement('div');
  mindmapDiv.id = 'echarts-mindmap';
  mindmapDiv.style.width = '100%';
  mindmapDiv.style.height = '500px';
  
  // 检查ECharts是否已加载
  if (typeof echarts === 'undefined') {
    console.error('未找到ECharts库。请确认已正确加载ECharts库');
    // 添加动态加载ECharts的逻辑
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
    document.head.appendChild(script);
    script.onload = () => {
      console.log('已动态加载ECharts库');
    };
    script.onerror = () => {
      console.error('加载ECharts库失败');
    };
  }
  
  // 初始化思维导图生成器
  console.log('初始化思维导图生成器...');
  let mindmapGenerator;
  try {
    mindmapGenerator = new MindmapGenerator('echarts-mindmap');
    console.log('思维导图生成器初始化成功');
  } catch (error) {
    console.error('初始化思维导图生成器失败:', error);
    return;
  }
  
  // 绑定类别按钮点击事件
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('类别按钮被点击');
      // 移除所有按钮的active类
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      // 给当前按钮添加active类
      this.classList.add('active');
      
      // 获取类别
      const categoryText = this.querySelector('.zh').textContent;
      switch(categoryText) {
        case '文化溯源':
          currentCategory = 'history';
          break;
        case '文化发展':
          currentCategory = 'development';
          break;
        case '文化创新':
          currentCategory = 'innovation';
          break;
        case '区域文化':
          currentCategory = 'regional';
          break;
        case '跨学科知识':
          currentCategory = 'interdisciplinary';
          break;
        case '中西文化对比':
          currentCategory = 'comparative';
          break;
        default:
          currentCategory = 'history';
      }
      console.log('已选择类别:', currentCategory);
      
      // 加载该类别的知识点
      loadKnowledgePoints(currentCategory);
    });
  });
  
  // 绑定生成按钮点击事件
  console.log('绑定生成按钮点击事件...');
  if (generateBtn) {
    generateBtn.addEventListener('click', async function() {
      console.log('生成按钮被点击');
      const topic = promptInput.value.trim();
      if (!topic) {
        alert('请输入要拓展的知识点');
        return;
      }
      
      try {
        // 显示加载指示器
        showLoading();
        console.log('正在处理输入:', topic);
        
        // 处理提示词，提取关键词
        const keywords = extractKeywords(topic);
        console.log('提取的关键词:', keywords);
        
        // 准备请求数据
        const requestData = {
          title: topic,
          central_topic: topic,
          selectedKnowledgePoints: await getSelectedKnowledgePointIds(currentCategory),
          keywords: keywords.join(','), // 使用提取的关键词
          style: 'standard', // 可以从UI中获取
          max_levels: 4 // 可以从UI中获取
        };
        
        console.log('准备发送请求数据:', requestData);
        
        // 调用API创建思维导图（使用AI模式）
        console.log('开始调用API创建思维导图...');
        const result = await MindmapService.createMindmap(requestData);
        console.log('API响应:', result);
        
        // 如果创建成功，获取思维导图详情
        if (result && result.id) {
          console.log('获取思维导图详情, ID:', result.id);
          const mindmapData = await MindmapService.getMindmap(result.id);
          console.log('获取到思维导图数据:', mindmapData);
          
          // 准备容器
          prepareContainer();
          
          // 渲染思维导图
          console.log('开始渲染思维导图...');
          await mindmapGenerator.generateMindmap(mindmapData);
          console.log('思维导图渲染完成');
          
          // 刷新思维导图列表
          refreshMindmapList();
        } else {
          console.error('API响应缺少ID或格式不正确:', result);
          alert('生成思维导图失败：API响应无效');
        }
      } catch (error) {
        console.error('生成思维导图失败:', error);
        alert(`生成失败: ${error.message || '未知错误'}`);
      } finally {
        // 隐藏加载指示器
        hideLoading();
      }
    });
    console.log('生成按钮事件绑定成功');
  } else {
    console.error('未找到生成按钮，无法绑定事件');
  }
  
  // 绑定下载按钮点击事件
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      console.log('下载按钮被点击');
      mindmapGenerator.downloadImage();
    });
  }
  
  // 绑定全屏按钮
  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.className = 'result-action-btn';
  fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i><span class="zh">全屏</span>';
  fullscreenBtn.addEventListener('click', function() {
    console.log('全屏按钮被点击');
    mindmapGenerator.toggleFullscreen();
    const icon = this.querySelector('i');
    if (icon.classList.contains('fa-expand')) {
      icon.classList.remove('fa-expand');
      icon.classList.add('fa-compress');
      this.querySelector('span').textContent = '退出全屏';
    } else {
      icon.classList.remove('fa-compress');
      icon.classList.add('fa-expand');
      this.querySelector('span').textContent = '全屏';
    }
  });
  
  if (knowledgeResult) {
    const actionContainer = knowledgeResult.querySelector('.result-actions');
    if (actionContainer) {
      actionContainer.appendChild(fullscreenBtn);
    }
  }
  
  /**
   * 从提示词中提取关键词
   * @param {string} prompt - 用户输入的提示词
   * @returns {Array<string>} 提取的关键词数组
   */
  function extractKeywords(prompt) {
    // 分割提示词，移除常见的停用词，提取关键词
    const stopWords = ['的', '和', '与', '在', '是', '了', '中', '对', '有', '及', '或'];
    let words = prompt.split(/[,，、\s]+/);
    
    // 过滤掉停用词和空字符串，限制最多10个关键词
    return words
      .filter(word => word && word.length > 1 && !stopWords.includes(word))
      .slice(0, 10);
  }
  
  /**
   * 显示加载指示器
   */
  function showLoading() {
    loadingEl.style.display = 'flex';
  }
  
  /**
   * 隐藏加载指示器
   */
  function hideLoading() {
    loadingEl.style.display = 'none';
  }
  
  /**
   * 准备思维导图容器
   */
  function prepareContainer() {
    console.log('准备思维导图容器');
    // 清空容器
    while (mindmapContainer.firstChild) {
      mindmapContainer.removeChild(mindmapContainer.firstChild);
    }
    
    // 添加ECharts容器
    mindmapContainer.appendChild(mindmapDiv);
    console.log('容器准备完成');
  }
  
  /**
   * 加载指定类别的知识点
   * @param {string} category 知识点类别
   */
  async function loadKnowledgePoints(category) {
    try {
      console.log(`加载${category}类别的知识点...`);
      // 调用API获取知识点
      const knowledgePoints = await MindmapService.getKnowledgePoints(category);
      console.log(`已加载${category}类别的知识点:`, knowledgePoints);
      
      // 这里可以显示知识点列表或进行其他操作
    } catch (error) {
      console.error('加载知识点失败:', error);
    }
  }
  
  /**
   * 获取选中类别的知识点ID
   * @param {string} category 知识点类别
   * @returns {Promise<Array>} 知识点ID数组
   */
  async function getSelectedKnowledgePointIds(category) {
    try {
      console.log(`获取${category}类别的知识点ID...`);
      // 获取该类别的所有知识点
      const knowledgePoints = await MindmapService.getKnowledgePoints(category);
      
      // 如果有知识点，返回最多3个知识点的ID
      if (knowledgePoints && knowledgePoints.length > 0) {
        const ids = knowledgePoints.slice(0, 3).map(kp => kp.id);
        console.log('获取到的知识点ID:', ids);
        return ids;
      }
      
      console.log('未找到知识点，返回空数组');
      return [];
    } catch (error) {
      console.error('获取知识点ID失败:', error);
      return [];
    }
  }
  
  /**
   * 刷新思维导图列表
   */
  async function refreshMindmapList() {
    try {
      console.log('刷新思维导图列表...');
      // 获取思维导图列表
      const mindmaps = await MindmapService.getMindmaps();
      console.log('获取到思维导图列表:', mindmaps);
      
      // 更新UI中的列表
      const expansionTable = document.querySelector('.expansion-table tbody');
      if (expansionTable && mindmaps && mindmaps.length > 0) {
        // 清空现有行
        expansionTable.innerHTML = '';
        
        // 添加新行
        mindmaps.forEach((mindmap, index) => {
          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>
                <p class="zh">${mindmap.title}</p>
                <p class="en">${mindmap.title}</p>
              </td>
              <td>
                <span class="expansion-badge ${getCategoryBadgeClass(mindmap)}">
                  <span class="zh">${getCategoryDisplayName(mindmap)}</span>
                  <span class="en">${getCategoryDisplayName(mindmap, true)}</span>
                </span>
              </td>
              <td class="table-actions">
                <button class="expansion-action-btn preview" title="预览" data-id="${mindmap.id}">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="expansion-action-btn edit" title="修改" data-id="${mindmap.id}">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          `;
          
          expansionTable.innerHTML += row;
        });
        
        // 绑定预览按钮事件
        document.querySelectorAll('.expansion-action-btn.preview').forEach(btn => {
          btn.addEventListener('click', async function() {
            const mindmapId = this.getAttribute('data-id');
            if (mindmapId) {
              try {
                showLoading();
                const mindmapData = await MindmapService.getMindmap(mindmapId);
                prepareContainer();
                await mindmapGenerator.generateMindmap(mindmapData);
              } catch (error) {
                console.error('预览思维导图失败:', error);
                alert(`预览失败: ${error.message}`);
              } finally {
                hideLoading();
              }
            }
          });
        });
        
        console.log('思维导图列表已刷新');
      } else {
        console.log('思维导图列表为空或未找到表格元素');
      }
    } catch (error) {
      console.error('刷新思维导图列表失败:', error);
    }
  }
  
  /**
   * 获取类别徽章的CSS类
   * @param {Object} mindmap 思维导图数据
   * @returns {string} CSS类名
   */
  function getCategoryBadgeClass(mindmap) {
    // 基于思维导图数据返回类别CSS类
    // 这里需要根据实际数据结构进行调整
    if (mindmap.knowledgePoints && mindmap.knowledgePoints[0]) {
      const category = mindmap.knowledgePoints[0].category;
      switch(category) {
        case 'history': return 'history';
        case 'art': return 'art';
        case 'literature': return 'literature';
        case 'science': return 'science';
        case 'geography': return 'geography';
        default: return 'regional';
      }
    }
    return 'regional';
  }
  
  /**
   * 获取类别的显示名称
   * @param {Object} mindmap 思维导图数据
   * @param {boolean} isEnglish 是否返回英文名称
   * @returns {string} 类别显示名称
   */
  function getCategoryDisplayName(mindmap, isEnglish = false) {
    // 基于思维导图数据返回类别名称
    if (mindmap.knowledgePoints && mindmap.knowledgePoints[0]) {
      const category = mindmap.knowledgePoints[0].category;
      if (isEnglish) {
        switch(category) {
          case 'history': return 'History';
          case 'art': return 'Art';
          case 'literature': return 'Literature';
          case 'science': return 'Science';
          case 'geography': return 'Geography';
          default: return 'Regional Culture';
        }
      } else {
        switch(category) {
          case 'history': return '历史文化';
          case 'art': return '艺术文化';
          case 'literature': return '文学文化';
          case 'science': return '科学文化';
          case 'geography': return '地理文化';
          default: return '区域文化';
        }
      }
    }
    return isEnglish ? 'Regional Culture' : '区域文化';
  }
  
  // 初始加载
  console.log('执行初始化加载...');
  loadKnowledgePoints(currentCategory);
  refreshMindmapList();
} 