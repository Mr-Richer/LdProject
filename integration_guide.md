# 前端和后端连接指南

本文档描述了如何连接中国文化人工智能课程平台的前端(`admin`)和后端(`server`)。

## 目录

1. [技术栈概述](#1-技术栈概述)
2. [前端设置](#2-前端设置)
3. [后端设置](#3-后端设置)
4. [API集成](#4-api集成)
5. [安全性](#5-安全性)
6. [部署注意事项](#6-部署注意事项)

## 1. 技术栈概述

### 前端
- HTML/CSS/JavaScript（原生）
- 文件结构：
  - `index.html`：主页面
  - `script.js`：主要JavaScript逻辑
  - `styles.css`：样式文件 
  - `api.js`：API请求封装（新增）

### 后端
- Node.js + NestJS框架
- TypeScript
- MySQL数据库
- JWT认证

## 2. 前端设置

### 2.1 创建API配置文件

在前端目录创建 `api.js` 文件，用于封装与后端的API通信：

```javascript
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
```

### 2.2 在HTML中引入API文件

在`index.html`的`<head>`部分添加：

```html
<!-- API配置文件 -->
<script src="api.js"></script>
```

### 2.3 添加登录功能

在`script.js`文件顶部添加登录相关函数：

```javascript
// 检查用户是否已登录
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        // 如果没有token，显示登录页面
        showLoginPage();
    } else {
        // 如果有token，尝试验证token
        validateToken(token)
            .then(isValid => {
                if (!isValid) {
                    showLoginPage();
                } else {
                    // Token有效，显示主应用
                    document.querySelector('.app-container').style.display = 'flex';
                }
            })
            .catch(() => showLoginPage());
    }
}

// 显示登录页面
function showLoginPage() {
    // 隐藏主应用
    document.querySelector('.app-container').style.display = 'none';
    
    // 如果登录页不存在，创建它
    if (!document.getElementById('login-page')) {
        const loginPage = document.createElement('div');
        loginPage.id = 'login-page';
        loginPage.innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <div class="login-logo">
                        <img src="./picture/icon.png" alt="Logo">
                        <h1 class="login-title zh">中国文化AI课程平台</h1>
                        <h1 class="login-title en">Chinese Culture AI Course Platform</h1>
                    </div>
                    <form id="login-form">
                        <div class="form-group">
                            <label class="zh">用户名</label>
                            <label class="en">Username</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label class="zh">密码</label>
                            <label class="en">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <div class="error-message" id="login-error"></div>
                        <button type="submit" class="login-btn">
                            <span class="zh">登录</span>
                            <span class="en">Login</span>
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(loginPage);
        
        // 绑定登录表单提交事件
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    } else {
        document.getElementById('login-page').style.display = 'block';
    }
}

// 处理登录
async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    // 清除之前的错误
    errorElement.textContent = '';
    
    // 显示加载状态
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    loginBtn.disabled = true;
    
    try {
        // 调用API登录
        const response = await API.auth.login(username, password);
        
        // 登录成功，保存token
        localStorage.setItem('token', response.data.token);
        
        // 保存用户信息
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // 隐藏登录页面
        document.getElementById('login-page').style.display = 'none';
        
        // 显示主应用
        document.querySelector('.app-container').style.display = 'flex';
        
        // 更新用户信息
        updateUserInfo(response.data.user);
    } catch (error) {
        // 显示错误消息
        errorElement.textContent = error.message || '登录失败，请检查用户名和密码';
    } finally {
        // 恢复按钮状态
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}

// 验证token
async function validateToken(token) {
    try {
        // 在实际应用中，这里应该调用API验证token
        // 这里简单返回true表示token有效
        return true;
    } catch (error) {
        return false;
    }
}

// 更新用户信息
function updateUserInfo(user) {
    const userNameEl = document.querySelector('.user-name.zh');
    const userNameEnEl = document.querySelector('.user-name.en');
    const userRoleEl = document.querySelector('.user-role.zh');
    const userRoleEnEl = document.querySelector('.user-role.en');
    const userAvatarEl = document.querySelector('.user-avatar');
    
    if (userNameEl) userNameEl.textContent = user.name;
    if (userNameEnEl) userNameEnEl.textContent = user.name;
    if (userRoleEl) userRoleEl.textContent = user.department;
    if (userRoleEnEl) userRoleEnEl.textContent = user.department;
    if (userAvatarEl && user.avatar) userAvatarEl.src = user.avatar;
    
    // 更新欢迎文本
    const welcomeTextZh = document.querySelector('.welcome-text h2.zh');
    const welcomeTextEn = document.querySelector('.welcome-text h2.en');
    
    if (welcomeTextZh) welcomeTextZh.textContent = `欢迎回来，${user.name}`;
    if (welcomeTextEn) welcomeTextEn.textContent = `Welcome back, ${user.name}`;
}
```

在`DOMContentLoaded`事件监听器中的第一行添加：

```javascript
// 检查登录状态
checkLoginStatus();
```

### 2.4 添加登录页面样式

在`styles.css`文件末尾添加登录样式：

```css
/* 登录页面样式 */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f3f4f6 0%, #e2e8f0 100%);
}

.login-box {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 400px;
    max-width: 90%;
}

.login-logo {
    text-align: center;
    margin-bottom: 30px;
}

.login-logo img {
    width: 80px;
    height: auto;
    margin-bottom: 15px;
}

.login-title {
    font-size: 1.5rem;
    color: #2d3748;
    margin: 10px 0;
}

.login-title.en {
    display: none;
}

body.en-mode .login-title.en {
    display: block;
}

body.en-mode .login-title.zh {
    display: none;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #4a5568;
}

.form-group label.en {
    display: none;
}

body.en-mode .form-group label.en {
    display: block;
}

body.en-mode .form-group label.zh {
    display: none;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.login-btn {
    width: 100%;
    padding: 12px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-btn:hover {
    background-color: var(--primary-color-dark);
}

.error-message {
    color: #e53e3e;
    margin-bottom: 15px;
    font-size: 0.875rem;
    min-height: 18px;
}

.login-btn span.en {
    display: none;
}

body.en-mode .login-btn span.en {
    display: inline;
}

body.en-mode .login-btn span.zh {
    display: none;
}
```

## 3. 后端设置

### 3.1 配置CORS

在后端创建CORS配置文件 `server/config/cors.js`：

```javascript
/**
 * CORS配置文件
 */
module.exports = {
  // 允许的来源，可以是具体的域名或通配符*（生产环境应该限制为具体域名）
  origin: process.env.NODE_ENV === 'production' ? ['https://your-frontend-domain.com'] : ['http://localhost:3000', 'http://localhost:5500', '*'],
  
  // 允许的HTTP方法
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  // 允许的请求头
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  // 是否允许发送凭证（如cookies）
  credentials: true,
  
  // 预检请求缓存时间（秒）
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 3600
};
```

### 3.2 确保JWT认证配置正确

确保JWT策略(`jwt.strategy.js`)和认证守卫(`jwtAuth.guard.js`)配置正确：

```javascript
// server/common/auth/jwt.strategy.js
const { Injectable } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { ExtractJwt, Strategy } = require('passport-jwt');

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload) {
    return { 
      userId: payload.sub, 
      username: payload.username,
      role: payload.role
    };
  }
}

module.exports = { JwtStrategy };
```

### 3.3 创建API控制器

为前端需要的API创建相应的控制器，例如统计数据控制器：

```javascript
// server/modules/statistics/statistics.controller.js
const { Controller, Get, UseGuards } = require('@nestjs/common');
const { JwtAuthGuard } = require('../auth/jwt-auth.guard');

@Controller('statistics')
class StatisticsController {
  constructor() {}

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  async getSummary() {
    // 这里是示例数据，实际应用中应该从数据库获取
    return {
      code: 200,
      data: {
        chapters: {
          count: 12,
          change: 2
        },
        students: {
          count: 128,
          change: 5
        },
        aigcUses: {
          count: 347,
          change: 24
        },
        engagement: {
          percentage: 87,
          change: 3
        }
      }
    };
  }
}

module.exports = { StatisticsController };
```

## 4. API集成

### 4.1 统一API响应格式

后端API响应应采用统一格式：

```javascript
{
  "code": 200, // 状态码，200表示成功
  "message": "操作成功", // 可选的消息
  "data": {
    // 实际数据
  }
}
```

### 4.2 错误处理

前端API请求工具已包含基本的错误处理。后端应确保所有API错误都返回合适的状态码和消息：

```javascript
{
  "code": 400, // 或其他错误码
  "message": "错误描述",
  "errors": [] // 可选的详细错误信息
}
```

### 4.3 接口鉴权

所有需要认证的API都应使用`JwtAuthGuard`进行保护：

```javascript
@UseGuards(JwtAuthGuard)
@Get('protected-resource')
getProtectedResource() {
  // ...
}
```

## 5. 安全性

### 5.1 JWT密钥

在生产环境中，应使用环境变量设置JWT密钥：

```
JWT_SECRET=your-very-secure-secret-key
```

### 5.2 API限速

考虑为关键API添加速率限制，防止暴力攻击。

### 5.3 HTTPS

在生产环境中，确保使用HTTPS协议。

## 6. 部署注意事项

### 6.1 环境变量

创建`.env`文件配置环境变量：

```
PORT=3000
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=culture_ai_platform
```

### 6.2 前端API地址

部署时，确保前端的`API_BASE_URL`设置为正确的后端地址。

### 6.3 静态文件服务

可以配置后端服务静态文件：

```javascript
// 在NestJS应用中
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'admin'),
    }),
    // 其他模块...
  ],
})
export class AppModule {}
```

或者使用Nginx等代理服务器配置前后端路由。

---

以上步骤完成后，前端将能够通过API与后端进行通信。确保在开发和测试过程中仔细检查API请求和响应，确保数据格式一致。 