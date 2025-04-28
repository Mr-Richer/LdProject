# 语言模型API测试

本目录包含用于测试语言模型API连接及其与中国文化课程平台集成的测试脚本。

## 文件说明

- `模型api.txt` - 语言模型API访问信息
- `direct_api_test.js` - 直接API连接测试脚本
- `ai_integration_test.js` - 项目集成测试脚本
- `package.json` - 项目依赖配置

## 测试内容

### 直接API连接测试

测试直接连接OpenRouter和Chutes平台的API，验证API密钥有效性和响应情况。包括:

1. OpenRouter API基础连接
2. Chutes API基础连接
3. 教学内容生成
4. 测验题目生成

### 项目集成测试

测试语言模型与中国文化课程平台的集成，验证系统各AI功能是否能正确调用语言模型。包括:

1. 系统登录认证
2. 章节管理
3. AI课件生成
4. AI测验生成
5. AI知识拓展

## 使用方法

### 安装依赖

```bash
npm install
```

### 运行直接API测试

```bash
npm run test:direct
```

### 运行项目集成测试

> 注意：需要先启动中国文化课程平台的后端服务

```bash
npm test
```

## 配置说明

如需更改API密钥或测试参数，请修改相应测试脚本中的配置部分:

- 在`direct_api_test.js`中修改直接API测试配置
- 在`ai_integration_test.js`中修改项目集成测试配置

## 安全注意事项

- API密钥仅用于测试，请勿在生产环境中使用
- 测试完成后请移除或更新API密钥
- 不要将包含API密钥的文件提交到公共代码库 