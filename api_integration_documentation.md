# 中国文化人工智能课程平台 API 接口文档

## 1. 项目概述

该项目是一个中国文化人工智能课程平台，主要由三个部分组成：
- **admin**: 前端管理界面
- **backend**: 后端服务
- **PPTist-master**: 开源的PPT编辑器，用于课件编辑

## 2. 系统架构

系统采用前后端分离架构：
- 后端：基于NestJS框架
- 前端：课程管理平台（admin）+ PPTist编辑器（集成为iframe）
- 数据库：MySQL

## 3. 启动方式

系统支持以下几种启动模式：
1. 仅启动后端服务
2. 仅启动PPTist前端
3. 同时启动后端服务和PPTist前端
4. 启动全部服务（后端、PPTist和课程平台）

启动命令位于 `backend/start-server.bat`，在Windows环境下执行此批处理文件。

## 4. 前后端通信接口

### 4.1 通用API接口格式

所有API接口的响应格式统一为：

```json
{
  "code": 200,
  "message": "成功消息",
  "data": {
    // 具体数据...
  }
}
```

### 4.2 错误码说明

- 200: 成功
- 400: 请求参数错误
- 401: 未授权/登录过期
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误

## 5. 与PPTist集成的接口

### 5.1 文件上传接口

#### 5.1.1 上传PPT文件

- **接口**：`/api/upload/ppt`
- **方法**：POST
- **Content-Type**: `multipart/form-data`
- **请求参数**：
  - `file`: PPT文件（.pptx或.pptist格式）
- **响应**：
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "filename": "example.pptx",
    "originalname": "example.pptx",
    "mimetype": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "size": 12345,
    "url": "/uploads/ppt/example.pptx"
  }
}
```

#### 5.1.2 获取PPT文件列表

- **接口**：`/api/upload/listPPT`
- **方法**：GET
- **响应**：
```json
{
  "files": [
    {
      "name": "example.pptx",
      "path": "/api/upload/getPPT/example.pptx",
      "type": "pptx",
      "size": 12345,
      "lastModified": "2023-12-01T10:00:00Z"
    },
    {
      "name": "example.pptist",
      "path": "/api/upload/getPPT/example.pptist",
      "type": "pptist",
      "size": 5678,
      "lastModified": "2023-12-02T10:00:00Z"
    }
  ]
}
```

#### 5.1.3 获取指定PPT文件

- **接口**：`/api/upload/getPPT/:filename`
- **方法**：GET
- **请求参数**：
  - `filename`: 文件名
- **响应**：直接返回文件内容，根据文件后缀设置不同的Content-Type
  - `.pptx`: `application/vnd.openxmlformats-officedocument.presentationml.presentation`
  - `.pptist`: `application/json`

#### 5.1.4 获取默认PPT文件

- **接口**：`/api/upload/getPPT`
- **方法**：GET
- **响应**：直接返回默认PPT文件内容，Content-Type为`application/vnd.openxmlformats-officedocument.presentationml.presentation`

### 5.2 PPTist集成方式

PPTist作为一个独立的前端应用，通过iframe嵌入到课程平台中：

```html
<iframe id="pptistFrame" src="http://localhost:5173" frameborder="0" width="100%" height="600"></iframe>
```

前端可以通过刷新iframe来重新加载PPTist编辑器：

```javascript
const pptistFrame = document.getElementById('pptistFrame');
if (pptistFrame) {
  pptistFrame.src = pptistFrame.src;
}
```

## 6. PPTist接口说明

PPTist是一个独立的Web应用，主要通过以下方式与主系统集成：

### 6.1 PPTist服务端API

PPTist默认使用的服务端API基础URL为（见PPTist-master/vite.config.ts）:
```
target: 'https://server.pptist.cn'
```

在开发环境中会使用代理，请求会被转发到上述地址。

### 6.2 PPTist核心功能

PPTist支持以下关键功能：
1. 创建和编辑幻灯片
2. 导入导出特有的`.pptist`文件
3. 导出为PPT格式(.pptx)
4. 支持各种幻灯片元素的编辑

### 6.3 PPTist文件处理

通过后端的`/api/upload`接口，系统支持上传和获取PPTist创建的演示文稿：
1. 支持`.pptist`格式（PPTist特有格式，本质是JSON格式）
2. 支持`.pptx`格式（标准PowerPoint格式）

## 7. AI生成课件工作流

系统支持通过AI生成课件的完整工作流：

1. 用户在课程平台上选择章节并输入提示词
2. 调用AI接口生成内容：`/api/ai/courseware`
3. 获取生成的幻灯片内容
4. 通过将PPTist嵌入在iframe中，展示和编辑生成的幻灯片
5. 用户可以修改和保存幻灯片
6. 保存的幻灯片可以通过系统的`/api/upload/ppt`接口上传保存

## 8. 接口调用流程示例

### 8.1 生成和编辑课件流程

1. 调用AI接口生成课件内容
```javascript
const response = await fetch('/api/ai/courseware', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    chapterId: 'chapter123',
    topic: '中国传统文化中的礼仪',
    style: 'academic',
    slideCount: 10
  })
});
const data = await response.json();
// data.slides包含生成的幻灯片内容
```

2. 将生成的内容传递给PPTist编辑器（通过iframe通信）
```javascript
const pptistFrame = document.getElementById('pptistFrame');
pptistFrame.contentWindow.postMessage({
  type: 'IMPORT_SLIDES',
  payload: data.slides
}, 'http://localhost:5173');
```

3. 用户编辑完成后保存
```javascript
// 监听PPTist发送的保存消息
window.addEventListener('message', (event) => {
  if (event.origin === 'http://localhost:5173' && event.data.type === 'SAVE_SLIDES') {
    const slidesData = event.data.payload;
    // 保存到服务器
    saveSlides(slidesData);
  }
});

// 保存幻灯片函数
async function saveSlides(slidesData) {
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(slidesData)], { type: 'application/json' });
  formData.append('file', blob, 'presentation.pptist');
  
  const response = await fetch('/api/upload/ppt', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  const result = await response.json();
  // 处理上传结果
}
```

## 9. 完整API接口列表

### 9.1 用户认证

#### 9.1.1 登录

- **接口**：`/api/auth/login`
- **方法**：POST
- **请求参数**：
```json
{
  "username": "string", 
  "password": "string"
}
```
- **响应**：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "role": "string",
      "department": "string",
      "avatar": "string"
    }
  }
}
```

#### 9.1.2 登出

- **接口**：`/api/auth/logout`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "message": "登出成功"
}
```

### 9.2 章节管理

#### 9.2.1 获取章节列表

- **接口**：`/api/chapters`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "chapters": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "coverImage": "string",
        "progress": {
          "completed": 4,
          "total": 5
        },
        "studentCount": 128,
        "duration": "120分钟"
      }
    ]
  }
}
```

#### 9.2.2 创建章节

- **接口**：`/api/chapters`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "title": "string",
  "description": "string",
  "coverImage": "file"
}
```
- **响应**：
```json
{
  "code": 200,
  "message": "章节创建成功",
  "data": {
    "id": "string"
  }
}
```

### 9.3 AI助教功能

#### 9.3.1 生成课件

- **接口**：`/api/ai/courseware/generate`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "chapterId": "string",
  "topic": "string",
  "style": "academic|engaging|concise",
  "slideCount": 10
}
```
- **响应**：
```json
{
  "code": 200,
  "data": {
    "slides": [
      {
        "id": "string",
        "title": "string",
        "content": "string",
        "imageUrl": "string",
        "type": "title|content|image|two-column"
      }
    ]
  }
}
```

#### 9.3.2 生成测验题

- **接口**：`/api/ai/quiz/generate`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "chapterId": "string",
  "types": ["single", "multiple", "short", "discussion"],
  "difficulty": "easy|medium|hard",
  "count": 5,
  "keywords": ["string"]
}
```
- **响应**：
```json
{
  "code": 200,
  "data": {
    "questions": [
      {
        "id": "string",
        "type": "single|multiple|short|discussion",
        "content": "string",
        "options": ["string"],
        "answer": "string",
        "explanation": "string"
      }
    ]
  }
}
```

## 10. 注意事项

1. PPTist是一个独立的应用，通过iframe嵌入，需要确保PPTist服务正常运行（端口5173）
2. 所有接口都需要通过 `Authorization` 头部传递令牌进行认证，除了登录接口
3. 数据上传应使用 `multipart/form-data` 格式
4. 返回的时间格式统一为 ISO 8601 标准: `YYYY-MM-DDThh:mm:ss.sssZ`
5. 分页接口默认每页 20 条数据，可通过 `pageSize` 参数调整 