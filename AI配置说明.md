# AI模型配置说明

本文档提供了如何配置中国文化课程平台中AI语言模型的指南。系统支持两种AI模型提供商：OpenRouter和Chutes。

## 环境变量配置

要使AI功能正常工作，您需要在后端项目的`.env`文件中添加以下环境变量：

```
# OpenRouter配置
AI_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
AI_OPENROUTER_MODEL_ID=deepseek/deepseek-chat-v3-0324:free
AI_OPENROUTER_API_KEY=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

# Chutes配置
AI_CHUTES_API_URL=https://llm.chutes.ai/v1/chat/completions
AI_CHUTES_MODEL_ID=deepseek-ai/DeepSeek-V3-0324
AI_CHUTES_API_KEY=cpk_4e6c011db10249f0bdc7b8f8df40cf9f.096169649b4d5c67b42bc5b83b11e149.KcltcWhOps9qvpqYOyoiSjG1JQOAkl33

# AI默认配置
AI_DEFAULT_MODEL_TYPE=openrouter
AI_DEFAULT_TEMPERATURE=0.7
AI_DEFAULT_MAX_TOKENS=1000

# 课前小测配置
AI_QUIZ_DEFAULT_COUNT=5
AI_QUIZ_DEFAULT_DIFFICULTY=medium
AI_QUIZ_MAX_QUESTIONS=10
```

## 参数说明

### OpenRouter配置
- `AI_OPENROUTER_API_URL`: OpenRouter API的URL
- `AI_OPENROUTER_MODEL_ID`: 使用的模型ID
- `AI_OPENROUTER_API_KEY`: 您的OpenRouter API密钥

### Chutes配置
- `AI_CHUTES_API_URL`: Chutes API的URL
- `AI_CHUTES_MODEL_ID`: 使用的模型ID
- `AI_CHUTES_API_KEY`: 您的Chutes API密钥

### 默认配置
- `AI_DEFAULT_MODEL_TYPE`: 默认使用的模型类型 (`openrouter` 或 `chutes`)
- `AI_DEFAULT_TEMPERATURE`: 生成结果的随机性 (0-1)
- `AI_DEFAULT_MAX_TOKENS`: 生成的最大令牌数

### 课前小测配置
- `AI_QUIZ_DEFAULT_COUNT`: 默认生成的题目数量
- `AI_QUIZ_DEFAULT_DIFFICULTY`: 默认题目难度 (`easy`, `medium`, 或 `hard`)
- `AI_QUIZ_MAX_QUESTIONS`: 单次可生成的最大题目数量

## 注意事项

1. API密钥为敏感信息，请确保不要将其提交到公共代码库
2. 环境变量文件(.env)已在`.gitignore`中排除，以防止意外提交
3. 如果需要更换API密钥，只需在.env文件中更新相应的值 