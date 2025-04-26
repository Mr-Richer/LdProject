# 中国文化人工智能课程平台 API 文档

## 目录

- [用户认证](#1-用户认证)
- [首页数据](#2-首页数据)
- [章节管理](#3-章节管理)
- [AI助教-课前](#4-ai助教-课前)
- [AI助教-课中](#5-ai助教-课中)
- [AI助教-课后](#6-ai助教-课后)
- [学情画像](#7-学情画像)
- [知识图谱](#8-知识图谱)
- [文件上传](#9-文件上传)
- [通知](#10-通知)
- [错误码说明](#错误码说明)

## 1. 用户认证

### 1.1 登录

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

### 1.2 登出

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

## 2. 首页数据

### 2.1 获取统计数据

- **接口**：`/api/statistics/summary`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "chapters": {
      "count": 12,
      "change": 2
    },
    "students": {
      "count": 128,
      "change": 5
    },
    "aigcUses": {
      "count": 347,
      "change": 24
    },
    "engagement": {
      "percentage": 87,
      "change": 3
    }
  }
}
```

### 2.2 获取最新活动

- **接口**：`/api/activities/recent`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：`type=all|preparation|class|homework|practice`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "activities": [
      {
        "id": "string",
        "type": "preparation|class|homework|practice",
        "title": "string",
        "description": "string",
        "timestamp": "datetime",
        "actions": ["view", "prepare", "grade"]
      }
    ]
  }
}
```

## 3. 章节管理

### 3.1 获取章节列表

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

### 3.2 创建章节

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

### 3.3 获取章节详情

- **接口**：`/api/chapters/{id}`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "coverImage": "string",
    "sections": [
      {
        "id": "string",
        "title": "string",
        "type": "courseware|quiz|knowledge|ideology|practice"
      }
    ]
  }
}
```

### 3.4 更新章节

- **接口**：`/api/chapters/{id}`
- **方法**：PUT
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
  "message": "章节更新成功"
}
```

### 3.5 删除章节

- **接口**：`/api/chapters/{id}`
- **方法**：DELETE
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "message": "章节删除成功"
}
```

## 4. AI助教-课前

### 4.1 生成课件

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

### 4.2 保存课件

- **接口**：`/api/courseware`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "chapterId": "string",
  "title": "string",
  "slides": [
    {
      "title": "string",
      "content": "string",
      "imageUrl": "string",
      "type": "title|content|image|two-column"
    }
  ]
}
```
- **响应**：
```json
{
  "code": 200,
  "message": "课件保存成功",
  "data": {
    "id": "string"
  }
}
```

### 4.3 生成测验题

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

### 4.4 保存测验

- **接口**：`/api/quiz`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "chapterId": "string",
  "title": "string",
  "questions": [
    {
      "type": "single|multiple|short|discussion",
      "content": "string",
      "options": ["string"],
      "answer": "string",
      "explanation": "string"
    }
  ]
}
```
- **响应**：
```json
{
  "code": 200,
  "message": "测验保存成功",
  "data": {
    "id": "string"
  }
}
```

### 4.5 生成知识拓展

- **接口**：`/api/ai/knowledge/generate`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "chapterId": "string",
  "cultureConcept": "string",
  "expansionType": "regional|school|interdisciplinary|comparative"
}
```
- **响应**：
```json
{
  "code": 200,
  "data": {
    "mindmap": {
      "imageUrl": "string",
      "concepts": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "type": "regional|school|interdisciplinary|comparative"
        }
      ]
    }
  }
}
```

## 5. AI助教-课中

### 5.1 创建课堂

- **接口**：`/api/classroom/create`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "chapterId": "string",
  "coursewareId": "string",
  "title": "string",
  "startTime": "datetime"
}
```
- **响应**：
```json
{
  "code": 200,
  "data": {
    "classroomId": "string",
    "qrCode": "string",
    "expiryTime": "datetime"
  }
}
```

### 5.2 课堂签到统计

- **接口**：`/api/classroom/{id}/attendance`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "total": 128,
    "present": 116,
    "absent": 12,
    "percentage": 90.6
  }
}
```

### 5.3 自动分组

- **接口**：`/api/classroom/{id}/groups/auto`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "groupCount": 5,
  "peoplePerGroup": 6,
  "method": "random|balanced|proficiency"
}
```
- **响应**：
```json
{
  "code": 200,
  "data": {
    "groups": [
      {
        "id": "string",
        "name": "第1组",
        "students": [
          {
            "id": "string",
            "name": "string",
            "avatar": "string"
          }
        ]
      }
    ]
  }
}
```

### 5.4 获取弹幕数据

- **接口**：`/api/classroom/{id}/danmaku`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "opinions": {
      "agree": 68,
      "neutral": 35,
      "disagree": 15
    },
    "participation": {
      "active": 85,
      "total": 128
    },
    "messages": [
      {
        "id": "string",
        "content": "string",
        "sentiment": "agree|neutral|disagree",
        "studentId": "string",
        "timestamp": "datetime"
      }
    ]
  }
}
```

### 5.5 提交互动问题

- **接口**：`/api/classroom/{id}/interaction`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "type": "quiz|knowledge|ideology",
  "question": {
    "content": "string",
    "options": ["string"],
    "answer": "string",
    "explanation": "string"
  }
}
```
- **响应**：
```json
{
  "code": 200,
  "message": "互动问题发送成功",
  "data": {
    "id": "string"
  }
}
```

### 5.6 获取互动数据分析

- **接口**：`/api/classroom/{id}/analytics`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "engagement": {
      "average": 87,
      "timeline": [
        {
          "time": "string",
          "value": 85
        }
      ]
    },
    "understanding": [
      {
        "point": "string",
        "percentage": 75,
        "status": "good|warning|alert"
      }
    ],
    "recommendations": [
      {
        "type": "review|explanation|example",
        "content": "string",
        "point": "string"
      }
    ]
  }
}
```

## 6. AI助教-课后

### 6.1 生成课程总结

- **接口**：`/api/ai/summary/generate`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "classroomId": "string",
  "options": {
    "includeEngagement": true,
    "includeKeyPoints": true,
    "includeQuestions": true,
    "includeRecommendations": true
  }
}
```
- **响应**：
```json
{
  "code": 200,
  "data": {
    "summary": {
      "text": "string",
      "keyPoints": ["string"],
      "engagement": {
        "average": 87,
        "peak": 92,
        "low": 75
      },
      "questions": [
        {
          "content": "string",
          "correctRate": 85
        }
      ],
      "recommendations": ["string"]
    }
  }
}
```

### 6.2 获取学生作业

- **接口**：`/api/classroom/{id}/works`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：`filter=all|excellent|good|needHelp`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "works": [
      {
        "id": "string",
        "type": "essay|presentation|project",
        "title": "string",
        "preview": "string",
        "student": {
          "id": "string",
          "name": "string",
          "avatar": "string"
        },
        "submissionTime": "datetime",
        "status": "excellent|good|needHelp",
        "score": 95
      }
    ]
  }
}
```

### 6.3 AI评分建议

- **接口**：`/api/ai/grade/suggest`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "workId": "string"
}
```
- **响应**：
```json
{
  "code": 200,
  "data": {
    "suggestedScore": 92,
    "feedback": "string",
    "strengths": ["string"],
    "improvements": ["string"]
  }
}
```

### 6.4 提交批改结果

- **接口**：`/api/works/{id}/grade`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "score": 95,
  "feedback": "string",
  "status": "excellent|good|needHelp"
}
```
- **响应**：
```json
{
  "code": 200,
  "message": "批改成功"
}
```

## 7. 学情画像

### 7.1 获取学生列表

- **接口**：`/api/students`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：`filter=all&class=CS101&searchTerm=张&sortBy=name&page=1&pageSize=20`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "total": 128,
    "pages": 7,
    "currentPage": 1,
    "students": [
      {
        "id": "string",
        "name": "string",
        "studentId": "string",
        "avatar": "string",
        "class": "string",
        "attendance": 95,
        "taskCompletion": 88,
        "participation": 76,
        "averageScore": 85,
        "status": "excellent|good|warning|alert"
      }
    ]
  }
}
```

### 7.2 获取学生详情

- **接口**：`/api/students/{id}`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "id": "string",
    "name": "string",
    "studentId": "string",
    "avatar": "string",
    "class": "string",
    "contact": "string",
    "attendance": {
      "percentage": 95,
      "history": [
        {
          "date": "date",
          "status": "present|absent|late"
        }
      ]
    },
    "tasks": {
      "completed": 22,
      "total": 25,
      "percentage": 88,
      "history": [
        {
          "id": "string",
          "title": "string",
          "type": "essay|quiz|project",
          "submissionDate": "date",
          "score": 92,
          "status": "excellent|good|warning|alert"
        }
      ]
    },
    "participation": {
      "percentage": 76,
      "activities": [
        {
          "date": "date",
          "type": "question|discussion|danmaku",
          "count": 5
        }
      ]
    },
    "scores": {
      "average": 85,
      "distribution": {
        "excellent": 8,
        "good": 12,
        "fair": 4,
        "needImprovement": 1
      },
      "timeline": [
        {
          "date": "date",
          "score": 88
        }
      ]
    }
  }
}
```

## 8. 知识图谱

### 8.1 获取知识图谱

- **接口**：`/api/knowledge-graph`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：`filter=all|concept|courseware|quiz|resource|keyword`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "nodes": [
      {
        "id": "string",
        "name": "string",
        "nameEn": "string",
        "type": "concept|courseware|quiz|resource|keyword",
        "description": "string",
        "x": 0.5,
        "y": 0.3,
        "size": 20
      }
    ],
    "links": [
      {
        "source": "string",
        "target": "string",
        "strength": "high|medium|low",
        "type": "related|prerequisite|includes"
      }
    ]
  }
}
```

### 8.2 获取节点详情

- **接口**：`/api/knowledge-graph/nodes/{id}`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "id": "string",
    "name": "string",
    "nameEn": "string",
    "type": "concept|courseware|quiz|resource|keyword",
    "description": "string",
    "relatedContent": {
      "type": "courseware|quiz|resource",
      "id": "string",
      "title": "string",
      "thumbnail": "string"
    },
    "connections": [
      {
        "nodeId": "string",
        "nodeName": "string",
        "nodeType": "concept|courseware|quiz|resource|keyword",
        "strength": "high|medium|low",
        "type": "related|prerequisite|includes"
      }
    ]
  }
}
```

### 8.3 创建或更新节点

- **接口**：`/api/knowledge-graph/nodes`
- **方法**：POST/PUT
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "id": "string", // 更新时提供
  "name": "string",
  "nameEn": "string",
  "type": "concept|courseware|quiz|resource|keyword",
  "description": "string",
  "relatedContentId": "string"
}
```
- **响应**：
```json
{
  "code": 200,
  "message": "节点创建/更新成功",
  "data": {
    "id": "string"
  }
}
```

### 8.4 创建或更新连接

- **接口**：`/api/knowledge-graph/links`
- **方法**：POST/PUT
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：
```json
{
  "sourceId": "string",
  "targetId": "string",
  "strength": "high|medium|low",
  "type": "related|prerequisite|includes"
}
```
- **响应**：
```json
{
  "code": 200,
  "message": "连接创建/更新成功"
}
```

### 8.5 删除节点或连接

- **接口**：`/api/knowledge-graph/nodes/{id}` 或 `/api/knowledge-graph/links/{sourceId}/{targetId}`
- **方法**：DELETE
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "message": "节点/连接删除成功"
}
```

## 9. 文件上传

### 9.1 上传文件

- **接口**：`/api/upload`
- **方法**：POST
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：`FormData` 包含 `file` 和 `type=image|document|video|audio`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "url": "string",
    "filename": "string",
    "size": 1024,
    "type": "image|document|video|audio"
  }
}
```

## 10. 通知

### 10.1 获取通知列表

- **接口**：`/api/notifications`
- **方法**：GET
- **请求头**：`Authorization: Bearer {token}`
- **请求参数**：`read=all|unread|read`
- **响应**：
```json
{
  "code": 200,
  "data": {
    "unreadCount": 3,
    "notifications": [
      {
        "id": "string",
        "type": "system|assignment|reminder|feedback",
        "title": "string",
        "content": "string",
        "timestamp": "datetime",
        "read": false
      }
    ]
  }
}
```

### 10.2 标记通知已读

- **接口**：`/api/notifications/{id}/read`
- **方法**：PUT
- **请求头**：`Authorization: Bearer {token}`
- **响应**：
```json
{
  "code": 200,
  "message": "通知已标记为已读"
}
```

## 错误码说明

- 200: 成功
- 400: 请求参数错误
- 401: 未授权/登录过期
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误

## 注意事项

1. 所有接口都需要通过 `Authorization` 头部传递令牌进行认证，除了登录接口
2. 数据上传应使用 `multipart/form-data` 格式
3. 返回的时间格式统一为 ISO 8601 标准: `YYYY-MM-DDThh:mm:ss.sssZ`
4. 分页接口默认每页 20 条数据，可通过 `pageSize` 参数调整 