// API配置文件
const API_BASE_URL = 'http://localhost:3000'; // 后端服务器地址，根据实际部署情况修改

// 请求工具函数
async function request(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // 如果有token，添加到请求头
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, mergedOptions);
    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error(data.message || '请求失败');
    }
    
    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// API方法封装
const API = {
  // 用户认证
  auth: {
    login: (username, password) => 
      request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    logout: () => 
      request('/api/auth/logout', { method: 'POST' }),
  },

  // 章节管理
  chapters: {
    getList: () => request('/api/chapters'),
    getDetail: (id) => request(`/api/chapters/${id}`),
    create: (data) => 
      request('/api/chapters', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) => 
      request(`/api/chapters/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) => 
      request(`/api/chapters/${id}`, { method: 'DELETE' }),
  },

  // 首页数据
  statistics: {
    getSummary: () => request('/api/statistics/summary'),
  },
  
  activities: {
    getRecent: (type = 'all') => request(`/api/activities/recent?type=${type}`),
  },

  // AI助教功能
  ai: {
    generateCourseware: (data) => 
      request('/api/ai/courseware', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    generateQuiz: (data) => 
      request('/api/ai/quiz', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    expandKnowledge: (data) => 
      request('/api/ai/knowledge', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    // 生成单选题测验题目
    generateSingleChoiceQuestions: (chapterId, count = 5, difficulty = 'medium') => 
      request('/api/ai/quiz/generate', {
        method: 'POST',
        body: JSON.stringify({
          chapterId,
          questionType: 'single',
          count,
          difficulty
        }),
      }),
  },

  // 文件上传
  upload: {
    file: (formData) => 
      request('/api/upload/file', {
        method: 'POST',
        headers: {}, // 不设置Content-Type，让浏览器自动处理
        body: formData,
      }),
  },
};

// 导出API
window.API = API; 