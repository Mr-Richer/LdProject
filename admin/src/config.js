/**
 * 全局配置文件
 * 部署时只需修改此文件中的配置项
 */

// API服务器地址
const API_BASE_URL = 'http://localhost:3000';

// 上传文件配置
const UPLOAD_CONFIG = {
  // 图片上传
  image: {
    url: `${API_BASE_URL}/api/upload/image`,
    maxSize: 5 * 1024 * 1024, // 5MB
    supportedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    defaultImage: '../picture/banner.jpg'
  },
  
  // 课件上传
  courseware: {
    url: `${API_BASE_URL}/api/upload/ppt`,
    maxSize: 100 * 1024 * 1024, // 100MB
    supportedTypes: ['.ppt', '.pptx', '.pptist'],
    defaultPath: '',
    storagePath: '/uploads/ppt/', // 服务器存储路径
    clientPath: '/uploads/ppt/' // 客户端访问路径
  }
};

// 章节API配置
const CHAPTER_API = {
  list: `${API_BASE_URL}/api/chapters`,
  create: `${API_BASE_URL}/api/chapters`,
  update: (id) => `${API_BASE_URL}/api/chapters/${id}`,
  delete: (id) => `${API_BASE_URL}/api/chapters/${id}`,
  detail: (id) => `${API_BASE_URL}/api/chapters/${id}`,
  copyImage: `${API_BASE_URL}/api/admin/copy-image`
};

// 导出配置
window.APP_CONFIG = {
  API_BASE_URL,
  UPLOAD_CONFIG,
  CHAPTER_API
};

// 导出为模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    API_BASE_URL,
    UPLOAD_CONFIG,
    CHAPTER_API
  };
} 