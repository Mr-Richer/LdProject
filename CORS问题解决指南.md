# CORS问题解决指南

## 问题描述

在课堂小测题目生成功能中，我们遇到了跨域资源共享(CORS)问题，导致前端无法正常调用后端API。错误信息可能如下：

```
Access to fetch at 'http://localhost:3000/api/ai/quiz/generate-by-prompt' from origin 'null' has been blocked by CORS policy
```

## 原因分析

CORS是一种安全机制，用于限制网页从不同源加载资源。我们遇到的问题主要有两类：

1. **协议不同**：使用`file://`协议打开HTML文件，而API使用`http://`协议
2. **凭证问题**：发送凭证(credentials)的请求与服务器的CORS配置冲突

## 解决方案

### 解决方案一：修改前端代码

1. 在`quiz_button_fix.js`中，我们修改了以下内容：
   - 动态检测当前环境，自动设置正确的API基础URL
   - 移除了不必要的`credentials: 'include'`设置
   - A添加了更详细的错误处理

### 解决方案二：修改后端CORS配置

1. 在`main.ts`中，我们修改了CORS配置：
   - 设置`origin: '*'`允许所有来源访问
   - 移除了`credentials: true`设置，不再处理跨域凭证

### 解决方案三：使用相同域名访问

最彻底的解决方案是从同一个域名访问前端和API：

1. 确保后端服务器正常运行：
   ```bash
   cd backend
   npm run start
   ```

2. 通过后端服务器访问前端页面，而不是直接打开HTML文件：
   - 将前端文件放在后端的`public`目录下
   - 通过`http://localhost:3000`访问

## 测试CORS连接

我们提供了一个测试工具`test_cors.js`，用于测试CORS连接是否正常：

1. 将以下代码添加到HTML文件中：
   ```html
   <script src="test_cors.js"></script>
   ```

2. 页面加载后，右上角会显示测试面板
3. 点击"测试GET"、"测试POST"或"测试生成题目"按钮
4. 查看测试结果

## 常见问题

1. **问题**：修改后仍然提示CORS错误
   **解决**：检查浏览器缓存，按Ctrl+F5强制刷新，或清除浏览器缓存

2. **问题**：服务器未响应(ERR_CONNECTION_REFUSED)
   **解决**：确保后端服务器正在运行，检查端口是否正确

3. **问题**：提示"The value of the 'Access-Control-Allow-Origin' header"错误
   **解决**：检查是否同时使用了credentials模式和通配符origin

4. **问题**：使用localhost访问仍有CORS错误
   **解决**：尝试使用具体IP地址(127.0.0.1)代替localhost，或检查hosts文件

## 参考资源

- [MDN：跨源资源共享(CORS)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [NestJS CORS文档](https://docs.nestjs.com/security/cors) 