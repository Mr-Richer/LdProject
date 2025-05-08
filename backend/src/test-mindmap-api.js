/**
 * 测试思维导图API接口
 */

// 使用CommonJS风格导入node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 配置
const API_BASE_URL = 'http://localhost:3000';
const TEST_TOPIC = '中国传统文化';

async function testMindmapAPI() {
  console.log('测试思维导图API...');
  
  try {
    console.log(`发送GET请求到 ${API_BASE_URL}/api/api/mindmap`);
    
    // 发送GET请求到/api/mindmap端点
    const response = await fetch(`${API_BASE_URL}/api/api/mindmap`);
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API响应状态码:', response.status);
    console.log('API响应结果:', data);
    
    if (data) {
      console.log('✅ 思维导图API测试成功!');
      return true;
    } else {
      console.error('❌ 响应格式不正确:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    return false;
  }
}

async function testGenerateMindmap() {
  console.log('测试生成思维导图API...');
  
  const requestData = {
    topic: TEST_TOPIC,
    depth: 3,
    language: 'zh'
  };
  
  try {
    console.log(`发送POST请求到 ${API_BASE_URL}/api/api/generate-mindmap`);
    console.log('请求数据:', requestData);
    
    // 发送POST请求
    const response = await fetch(`${API_BASE_URL}/api/api/generate-mindmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API响应状态码:', response.status);
    console.log('API响应结果:', data);
    
    if (data && data.code === 200 && data.data) {
      console.log('✅ 思维导图生成成功!');
      // 打印节点数量
      const nodeCount = countNodes(data.data);
      console.log(`生成的思维导图包含 ${nodeCount} 个节点`);
      return true;
    } else {
      console.error('❌ 响应格式不正确:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    return false;
  }
}

// 统计节点数量的辅助函数
function countNodes(node) {
  if (!node) return 0;
  
  let count = 1; // 当前节点
  
  if (node.children && Array.isArray(node.children)) {
    // 递归计算所有子节点
    node.children.forEach(child => {
      count += countNodes(child);
    });
  }
  
  return count;
}

// 测试端口可用性
async function testPortAvailability() {
  console.log('测试后端API服务器可用性...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (response.ok) {
      console.log('✅ 后端API服务器可用');
      return true;
    } else {
      console.log(`❌ 后端API服务器返回错误状态码: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ 无法连接到后端API服务器:', error.message);
    
    // 如果服务器没有health端点，尝试连接其他端点
    try {
      const fallbackResponse = await fetch(`${API_BASE_URL}/api/api/mindmap`);
      if (fallbackResponse.ok) {
        console.log('✅ 后端API服务器可用(通过备用端点)');
        return true;
      }
    } catch (fallbackError) {
      console.error('❌ 备用连接测试也失败');
    }
    
    return false;
  }
}

// 运行所有测试
async function runTests() {
  console.log('===== 开始测试思维导图API =====');
  
  // 先测试API服务器是否可用
  const isServerAvailable = await testPortAvailability();
  
  if (!isServerAvailable) {
    console.error('❌ 无法连接到后端API服务器，请确保服务器已启动');
    return;
  }
  
  // 测试思维导图API
  await testMindmapAPI();
  
  // 测试生成思维导图API
  await testGenerateMindmap();
  
  console.log('===== 测试完成 =====');
}

// 启动测试
runTests().catch(error => {
  console.error('测试过程中发生错误:', error);
}); 