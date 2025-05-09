# 思维导图 API 接口文档

## 概述

本文档详细描述了中国文化人工智能课程平台中思维导图功能的 API 接口规范。这些接口用于创建、检索和管理思维导图及其相关数据。

## 基础信息

- **基础URL**: `http://localhost:3000`
- **接口路径前缀**: `/api/api`（注意：当前系统实现使用了双重前缀）
- **认证方式**: JWT Token (Authorization Header)
- **响应格式**: JSON
- **字符编码**: UTF-8

## 接口列表

### 1. 创建思维导图

使用 AI 生成思维导图结构。

- **URL**: `/api/api/mindmap`
- **方法**: `POST`
- **认证**: 需要
- **请求体**:

```json
{
  "title": "中国传统园林艺术",
  "central_topic": "中国园林",
  "selectedKnowledgePoints": [1, 2, 3],
  "keywords": "造园,设计,园林类型,山水",
  "max_levels": 4,
  "style": "standard",
  "user_id": 1
}
```

| 参数 | 类型 | 必须 | 说明 |
|------|------|------|------|
| title | String | 是 | 思维导图标题 |
| central_topic | String | 是 | 中心主题 |
| selectedKnowledgePoints | Array<Number> | 是 | 选中的知识点ID数组 |
| keywords | String | 否 | 用逗号分隔的关键词 |
| max_levels | Number | 否 | 最大层级数，2-5之间，默认为4 |
| style | String | 否 | 样式类型：standard(标准)、colorful(多彩)、simple(简洁) |
| user_id | Number | 否 | 用户ID |

- **成功响应** (200):

```json
{
  "id": 42,
  "title": "中国传统园林艺术",
  "central_topic": "中国园林",
  "message": "思维导图创建成功"
}
```

- **错误响应** (400, 401, 500)

### 2. 获取思维导图列表

获取所有思维导图或指定用户的思维导图。

- **URL**: `/api/api/mindmap`
- **方法**: `GET`
- **认证**: 不需要
- **查询参数**:

| 参数 | 类型 | 必须 | 说明 |
|------|------|------|------|
| userId | Number | 否 | 用户ID，如不提供则返回所有思维导图 |

- **成功响应** (200):

```json
{
  "data": [
    {
      "id": 42,
      "title": "中国传统园林艺术",
      "central_topic": "中国园林",
      "created_at": "2023-10-15T08:30:00.000Z",
      "user_id": 1,
      "max_levels": 4,
      "style": "standard"
    }
  ],
  "message": "获取思维导图列表成功"
}
```

### 3. 获取思维导图详情

获取特定ID的思维导图及其节点数据。

- **URL**: `/api/api/mindmap/:id`
- **方法**: `GET`
- **认证**: 不需要
- **路径参数**:

| 参数 | 类型 | 必须 | 说明 |
|------|------|------|------|
| id | Number | 是 | 思维导图ID |

- **成功响应** (200):

```json
{
  "mindmap": {
    "id": 42,
    "title": "中国传统园林艺术",
    "central_topic": "中国园林",
    "created_at": "2023-10-15T08:30:00.000Z",
    "user_id": 1,
    "max_levels": 4,
    "style": "standard"
  },
  "nodes": [
    {
      "id": 1,
      "mindmap_id": 42,
      "name": "中国园林",
      "value": "中国园林",
      "level": 0,
      "position": 0,
      "parent_id": null,
      "children": [
        {
          "id": 2,
          "mindmap_id": 42,
          "name": "园林历史",
          "value": "园林历史",
          "level": 1,
          "position": 0,
          "parent_id": 1,
          "children": []
        }
      ]
    }
  ],
  "message": "获取思维导图成功"
}
```

- **错误响应** (404, 500)

### 4. 删除思维导图

删除特定ID的思维导图及其关联节点。

- **URL**: `/api/api/mindmap/:id`
- **方法**: `DELETE`
- **认证**: 需要
- **路径参数**:

| 参数 | 类型 | 必须 | 说明 |
|------|------|------|------|
| id | Number | 是 | 思维导图ID |

- **成功响应** (200):

```json
{
  "message": "思维导图删除成功"
}
```

- **错误响应** (401, 404, 500)

### 5. 获取知识点列表

获取所有知识点或按类别筛选的知识点。

- **URL**: `/api/api/mindmap/knowledge-points`
- **方法**: `GET`
- **认证**: 不需要
- **查询参数**:

| 参数 | 类型 | 必须 | 说明 |
|------|------|------|------|
| category | String | 否 | 知识点类别，如不提供则返回所有类别 |

- **成功响应** (200):

```json
{
  "data": [
    {
      "id": 1,
      "title": "发展历程",
      "category": "history",
      "description": "中国园林艺术的发展历程与演变",
      "keywords": "秦汉,魏晋,唐宋,明清,近代",
      "created_at": "2023-09-20T10:00:00.000Z"
    }
  ],
  "message": "获取知识点列表成功"
}
```

### 6. 获取知识点详情

获取特定ID的知识点详细信息。

- **URL**: `/api/api/mindmap/knowledge-point/:id`
- **方法**: `GET`
- **认证**: 不需要
- **路径参数**:

| 参数 | 类型 | 必须 | 说明 |
|------|------|------|------|
| id | Number | 是 | 知识点ID |

- **成功响应** (200):

```json
{
  "data": {
    "id": 1,
    "title": "发展历程",
    "category": "history",
    "description": "中国园林艺术的发展历程与演变",
    "keywords": "秦汉,魏晋,唐宋,明清,近代",
    "created_at": "2023-09-20T10:00:00.000Z"
  },
  "message": "获取知识点成功"
}
```

- **错误响应** (404, 500)

### 7. 获取章节相关思维导图

获取指定章节关联的思维导图列表。

- **URL**: `/api/api/mindmaps/chapter/:chapterId`
- **方法**: `GET`
- **认证**: 不需要
- **路径参数**:

| 参数 | 类型 | 必须 | 说明 |
|------|------|------|------|
| chapterId | Number | 是 | 章节ID |

- **成功响应** (200):

```json
{
  "code": 200,
  "message": "获取思维导图列表成功",
  "data": [
    {
      "id": 14,
      "title": "中秋思维导图",
      "central_topic": "中秋",
      "created_at": "2025-05-08T10:00:17.673Z",
      "updated_at": "2025-05-08T10:00:17.673Z",
      "type": "mindmap"
    }
  ]
}
```

- **错误响应** (404, 500)

### 8. 生成思维导图

使用AI根据主题生成思维导图结构，不保存到数据库。

- **URL**: `/api/api/generate-mindmap`
- **方法**: `POST`
- **认证**: 不需要
- **请求体**:

```json
{
  "topic": "中国传统文化",
  "depth": 3,
  "language": "zh",
  "saveToDatabase": false
}
```

| 参数 | 类型 | 必须 | 说明 |
|------|------|------|------|
| topic | String | 是 | 思维导图主题 |
| depth | Number | 否 | 生成深度，默认为3 |
| language | String | 否 | 语言，默认为中文(zh) |
| saveToDatabase | Boolean | 否 | 是否保存到数据库，默认为false |

- **成功响应** (201):

```json
{
  "code": 200,
  "message": "思维导图生成成功",
  "data": {
    "name": "中国传统文化",
    "value": "中国传统文化",
    "children": [
      { 
        "name": "哲学思想体系",
        "value": "哲学思想体系",
        "children": [...]
      },
      // 更多子节点...
    ]
  }
}
```

- **错误响应** (400, 500)

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 注意事项

1. 所有请求和响应均使用 JSON 格式
2. 需要身份验证的端点请在请求头中添加 `Authorization: Bearer <token>`
3. 思维导图生成可能需要较长处理时间，前端应提供适当的等待提示
4. `selectedKnowledgePoints` 非空时，会基于知识点进行内容扩充
5. `max_levels` 过大会导致思维导图层级过多，影响可读性
6. **重要**: 当前系统实现使用了双重API前缀路径(`/api/api/`)，请确保在构建请求URL时使用正确的路径前缀
7. 前端调用时，应当使用 `${API_BASE_URL}/api/api/路径` 的格式，而不是 `${API_BASE_URL}/api/路径` 