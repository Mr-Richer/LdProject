import { API_BASE_URL } from '../config';

/**
 * 思维导图相关API服务
 */
export const MindmapService = {
  /**
   * 创建思维导图
   * @param {Object} data - 思维导图数据
   * @returns {Promise} - 返回创建结果
   */
  createMindmap: async (data) => {
    console.log('MindmapService.createMindmap - 开始请求:', data);
    try {
      // 检查API基础URL是否有效
      if (!API_BASE_URL) {
        console.error('API_BASE_URL未定义');
        throw new Error('API配置错误: 服务器地址未定义');
      }
      
      console.log('发送POST请求到:', `${API_BASE_URL}/api/mindmap`);
      
      const response = await fetch(`${API_BASE_URL}/api/mindmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(data)
      });
      
      console.log('收到响应状态:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('请求失败:', response.status, errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `请求失败: ${response.status}`);
        } catch (parseError) {
          throw new Error(`创建思维导图失败: ${response.status} ${errorText || ''}`);
      }
      }
      
      const responseData = await response.json();
      console.log('请求成功, 返回数据:', responseData);
      return responseData;
    } catch (error) {
      console.error('创建思维导图出错:', error);
      // 抛出更友好的错误信息
      if (error.message.includes('Failed to fetch')) {
        throw new Error('无法连接到服务器，请检查网络连接');
      }
      throw error;
    }
  },

  /**
   * 获取思维导图列表
   * @param {number} userId - 可选的用户ID过滤
   * @returns {Promise} - 返回思维导图列表
   */
  getMindmaps: async (userId = null) => {
    console.log('MindmapService.getMindmaps - 开始请求');
    try {
      let url = `${API_BASE_URL}/api/mindmap`;
      if (userId) {
        url += `?userId=${userId}`;
      }
      
      console.log('请求URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      console.log('响应状态:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('获取列表失败:', response.status, errorText);
        throw new Error(`获取思维导图列表失败: ${response.status}`);
      }

      const data = await response.json();
      console.log('获取列表成功, 数据数量:', data?.length || 0);
      return data;
    } catch (error) {
      console.error('获取思维导图列表出错:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('无法连接到服务器，请检查网络连接');
      }
      throw error;
    }
  },

  /**
   * 获取特定思维导图
   * @param {number} id - 思维导图ID
   * @returns {Promise} - 返回思维导图详情
   */
  getMindmap: async (id) => {
    console.log('MindmapService.getMindmap - 开始请求, ID:', id);
    try {
      if (!id) {
        throw new Error('缺少思维导图ID');
      }
      
      const url = `${API_BASE_URL}/api/mindmap/${id}`;
      console.log('请求URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      console.log('响应状态:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('获取详情失败:', response.status, errorText);
        throw new Error(`获取思维导图详情失败: ${response.status}`);
      }

      const data = await response.json();
      console.log('获取详情成功, 数据:', data);
      return data;
    } catch (error) {
      console.error('获取思维导图详情出错:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('无法连接到服务器，请检查网络连接');
      }
      throw error;
    }
  },

  /**
   * 获取知识点列表
   * @param {string} category - 可选的分类过滤
   * @returns {Promise} - 返回知识点列表
   */
  getKnowledgePoints: async (category = null) => {
    console.log('MindmapService.getKnowledgePoints - 开始请求, 类别:', category);
    try {
      let url = `${API_BASE_URL}/api/mindmap/knowledge-points`;
      if (category) {
        url += `?category=${category}`;
      }
      
      console.log('请求URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      console.log('响应状态:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('获取知识点失败:', response.status, errorText);
        throw new Error(`获取知识点列表失败: ${response.status}`);
      }

      const data = await response.json();
      console.log('获取知识点成功, 数据数量:', data?.length || 0);
      return data;
    } catch (error) {
      console.error('获取知识点列表出错:', error);
      // 如果错误是因网络问题导致的，返回空数组以避免阻断主流程
      if (error.message.includes('Failed to fetch')) {
        console.warn('网络错误，返回空数组');
        return [];
      }
      throw error;
    }
  },

  /**
   * 删除思维导图
   * @param {number} id - 思维导图ID
   * @returns {Promise} - 返回删除结果
   */
  deleteMindmap: async (id) => {
    console.log('MindmapService.deleteMindmap - 开始请求, ID:', id);
    try {
      if (!id) {
        throw new Error('缺少思维导图ID');
      }
      
      const url = `${API_BASE_URL}/api/mindmap/${id}`;
      console.log('请求URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      console.log('响应状态:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('删除失败:', response.status, errorText);
        throw new Error(`删除思维导图失败: ${response.status}`);
      }

      const data = await response.json();
      console.log('删除成功, 响应:', data);
      return data;
    } catch (error) {
      console.error('删除思维导图出错:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('无法连接到服务器，请检查网络连接');
      }
      throw error;
    }
  }
}; 