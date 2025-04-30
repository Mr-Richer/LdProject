/**
 * PptService.js
 * 负责与后端通信，获取PPT数据
 */

// 创建PptService命名空间
window.PptService = {
  // 获取基础URL
  getBaseUrl: function() {
    // 从全局配置中获取API基础URL，如果不存在则使用默认值
    return window.APP_CONFIG?.API_BASE_URL || 'http://localhost:3000';
  },

  /**
   * 根据章节ID获取PPT内容
   * @param {number} chapterId - 章节ID
   * @returns {Promise<Object>} PPT内容的JSON对象
   */
  getPPTContent: async function(chapterId) {
    if (!chapterId) {
      console.error('获取PPT内容失败: 缺少章节ID');
      throw new Error('缺少章节ID');
    }

    try {
      console.log(`正在获取章节${chapterId}的PPT内容...`);
      
      // 构建API URL
      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}/api/chapters/${chapterId}/ppt`;
      console.log('API请求URL:', url);
      
      // 调用后端API获取PPT内容
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('获取PPT内容失败:', errorText);
        throw new Error('获取PPT内容失败: ' + (response.statusText || '服务器错误'));
      }
      
      const data = await response.json();
      console.log(`成功获取章节${chapterId}的PPT内容`);
      
      return data;
    } catch (error) {
      console.error('获取PPT内容时出错:', error);
      throw error;
    }
  },

  /**
   * 保存PPT内容
   * @param {number} chapterId - 章节ID
   * @param {Object} pptData - PPT内容的JSON对象
   * @returns {Promise<Object>} 保存结果
   */
  savePPTContent: async function(chapterId, pptData) {
    if (!chapterId) {
      console.error('保存PPT内容失败: 缺少章节ID');
      throw new Error('缺少章节ID');
    }

    try {
      console.log(`正在保存章节${chapterId}的PPT内容...`);
      
      // 调用后端API保存PPT内容
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/chapters/${chapterId}/ppt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pptData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '保存PPT内容失败');
      }
      
      const data = await response.json();
      console.log(`成功保存章节${chapterId}的PPT内容`);
      
      return data;
    } catch (error) {
      console.error(`保存章节${chapterId}的PPT内容失败:`, error);
      throw error;
    }
  }
};

// 通知系统PptService已加载
console.log('PptService服务已加载'); 