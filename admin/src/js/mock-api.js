/**
 * Mock API模块
 * 此模块已被禁用，系统将始终使用真实API
 */

(function() {
    console.log('Mock API模块已被永久禁用，系统将始终使用真实后端API');
    
    // 将全局配置设置为false，确保不使用模拟API
    window.useMockApi = false;
    
    // 不再执行任何模拟API初始化代码
    return;
})(); 