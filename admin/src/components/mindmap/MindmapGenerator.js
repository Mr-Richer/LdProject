/**
 * 思维导图生成器
 * 负责思维导图的创建、渲染和交互
 */
class MindmapGenerator {
  /**
   * 构造函数
   * @param {string} containerId - 容器元素ID
   */
  constructor(containerId) {
    this.chart = null;
    this.chartOption = null;
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.selectedStyle = 'standard'; // 默认样式
    this.maxLevels = 4; // 默认最大层级

    if (!this.container) {
      console.error(`找不到思维导图容器元素 #${containerId}`);
    } else {
      console.log('已找到思维导图容器元素');
    }

    // 绑定方法
    this.generateMindmap = this.generateMindmap.bind(this);
    this.downloadImage = this.downloadImage.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  }

  /**
   * 初始化ECharts实例
   */
  initChart() {
    try {
      if (this.chart) {
        this.chart.dispose(); // 清除旧实例
      }
      
      if (typeof echarts === 'undefined') {
        throw new Error('ECharts库未加载，请检查依赖项');
      }
      
      this.chart = echarts.init(this.container);
      
      // 添加窗口调整事件
      window.addEventListener('resize', () => {
        if (this.chart) {
          this.chart.resize();
        }
      });
      
      console.log('ECharts实例初始化成功');
    } catch (error) {
      console.error('初始化图表时出错:', error);
      throw error;
    }
  }

  /**
   * 根据后端数据生成思维导图
   * @param {Object} mindmapData - 思维导图数据
   * @returns {Promise} 返回生成Promise
   */
  async generateMindmap(mindmapData) {
    return new Promise((resolve, reject) => {
      try {
        // 参数验证
        if (!mindmapData || !mindmapData.tree) {
          throw new Error('无效的思维导图数据');
        }

        // 设置配置
        this.selectedStyle = mindmapData.style || 'standard';
        this.maxLevels = mindmapData.max_levels || 4;

        // 初始化图表
        this.initChart();
        
        // 设置图表选项
        this.chartOption = this.getChartOption(mindmapData.tree);
        
        // 渲染图表
        this.chart.setOption(this.chartOption);
        
        // 完成
        resolve();
      } catch (error) {
        console.error('生成思维导图出错:', error);
        reject(error);
      }
    });
  }

  /**
   * 获取ECharts配置项
   * @param {Object} data 思维导图数据
   * @returns {Object} ECharts配置项
   */
  getChartOption(data) {
    // 基本配置
    const option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [data],
          top: '10%',
          left: '8%',
          bottom: '10%',
          right: '20%',
          symbolSize: 10,
          initialTreeDepth: -1, // 展开所有节点
          label: {
            position: 'inside',
            verticalAlign: 'middle',
            align: 'center',
            fontSize: 14,
            padding: 8
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
          animationDurationUpdate: 750
        }
      ]
    };

    // 根据选择的样式应用不同配置
    switch (this.selectedStyle) {
      case 'colorful':
        option.series[0].orient = 'horizontal';
        option.series[0].layout = 'orthogonal';
        this.applyColorfulStyle(option);
        break;
      case 'simple':
        option.series[0].orient = 'vertical';
        option.series[0].layout = 'orthogonal';
        this.applySimpleStyle(option);
        break;
      case 'standard':
      default:
        option.series[0].orient = 'horizontal';
        option.series[0].layout = 'radial';
        this.applyStandardStyle(option);
        break;
    }

    return option;
  }

  /**
   * 应用标准样式
   * @param {Object} option ECharts配置项
   */
  applyStandardStyle(option) {
    option.series[0].lineStyle = {
      color: '#999',
      width: 2,
      curveness: 0.3
    };
    
    // 添加节点格式化，应用不同样式
    option.series[0].itemStyle = {
      color: '#ddd'
    };
    
    option.series[0].label.formatter = (params) => {
      return `{style${this.getNodeLevel(params.treePathInfo)}|${params.name}}`;
    };
    
    option.series[0].label.rich = {
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
    };
  }

  /**
   * 应用多彩样式
   * @param {Object} option ECharts配置项
   */
  applyColorfulStyle(option) {
    option.series[0].lineStyle = {
      color: '#999',
      width: 2,
      curveness: 0.5
    };
    
    const colors = ['#3498DB', '#9B59B6', '#2ECC71', '#F1C40F', '#E67E22'];
    
    // 为不同层级节点设置不同颜色
    option.series[0].label.formatter = (params) => {
      const level = this.getNodeLevel(params.treePathInfo);
      const colorIndex = Math.min(level, colors.length - 1);
      return `{style${colorIndex}|${params.name}}`;
    };
    
    option.series[0].label.rich = {
      style0: {
        backgroundColor: '#131E40',
        color: '#fff',
        borderRadius: 10,
        padding: [10, 15]
      },
      style1: {
        backgroundColor: colors[0],
        color: '#fff',
        borderRadius: 8,
        padding: [8, 12]
      },
      style2: {
        backgroundColor: colors[1],
        color: '#fff',
        borderRadius: 8,
        padding: [6, 10]
      },
      style3: {
        backgroundColor: colors[2],
        color: '#fff',
        borderRadius: 6,
        padding: [6, 10]
      },
      style4: {
        backgroundColor: colors[3],
        color: '#333',
        borderRadius: 6,
        padding: [4, 8]
      }
    };
  }

  /**
   * 应用简约样式
   * @param {Object} option ECharts配置项
   */
  applySimpleStyle(option) {
    option.series[0].lineStyle = {
      color: '#aaa',
      width: 1,
      curveness: 0.1
    };
    
    // 简约样式使用更轻的颜色和更简单的形状
    option.series[0].label.formatter = (params) => {
      return `{style${this.getNodeLevel(params.treePathInfo)}|${params.name}}`;
    };
    
    option.series[0].label.rich = {
      style0: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 3,
        padding: [8, 12]
      },
      style1: {
        backgroundColor: '#666',
        color: '#fff',
        borderRadius: 3,
        padding: [6, 10]
      },
      style2: {
        backgroundColor: '#999',
        color: '#fff',
        borderRadius: 3,
        padding: [5, 8]
      },
      style3: {
        backgroundColor: '#ccc',
        color: '#333',
        borderRadius: 3,
        padding: [4, 8]
      },
      style4: {
        backgroundColor: '#eee',
        color: '#333',
        borderRadius: 3,
        padding: [3, 6]
      }
    };
  }

  /**
   * 获取节点的层级
   * @param {Array} treePathInfo 节点路径信息
   * @returns {number} 节点层级
   */
  getNodeLevel(treePathInfo) {
    return treePathInfo.length - 1;
  }

  /**
   * 下载思维导图为图片
   */
  downloadImage() {
    if (!this.chart) {
      console.error('图表未初始化，无法下载');
      return;
    }
    
    const url = this.chart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    
    const link = document.createElement('a');
    link.download = `思维导图_${new Date().getTime()}.png`;
    link.href = url;
    link.click();
  }

  /**
   * 切换全屏显示
   */
  toggleFullscreen() {
    this.container.classList.toggle('fullscreen-mode');
    if (this.chart) {
      setTimeout(() => {
        this.chart.resize();
      }, 300);
    }
  }
}

// 将类导出到全局作用域，便于HTML直接访问
window.MindmapGenerator = MindmapGenerator; 