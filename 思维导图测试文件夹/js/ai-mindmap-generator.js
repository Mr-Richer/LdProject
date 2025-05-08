/**
 * AI思维导图生成器
 * 通过AI API生成思维导图数据结构
 */

class AiMindmapGenerator {
    constructor() {
        // OpenRouter API默认配置
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.apiKey = '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';
        this.model = 'deepseek/deepseek-chat-v3-0324:free';
        
        // 知识库关联状态
        this.knowledgePoints = [];
        this.isKnowledgeLoaded = false;
    }
    
    /**
     * 设置API参数
     * @param {object} config 配置对象
     */
    setConfig(config) {
        if (config.apiUrl) this.apiUrl = config.apiUrl;
        if (config.apiKey) this.apiKey = config.apiKey;
        if (config.model) this.model = config.model;
    }
    
    /**
     * 加载知识点数据
     * @param {Array} knowledgePoints 知识点数组
     */
    loadKnowledgePoints(knowledgePoints) {
        this.knowledgePoints = knowledgePoints || [];
        this.isKnowledgeLoaded = this.knowledgePoints.length > 0;
    }
    
    /**
     * 根据主题和可选文本内容生成思维导图
     * @param {string} topic 主题
     * @param {string} textContent 可选的文本内容
     * @returns {Promise<Object>} 思维导图数据结构
     */
    async generateMindmap(topic, textContent = '') {
        try {
            // 构建提示信息
            const prompt = this._buildPrompt(topic, textContent);
            
            // 调用AI API
            const response = await this._callAiApi(prompt);
            
            // 解析AI响应成思维导图数据结构
            return this._parseAiResponse(response, topic);
        } catch (error) {
            console.error('AI生成思维导图失败:', error);
            throw error;
        }
    }
    
    /**
     * 构建AI提示
     * @param {string} topic 主题
     * @param {string} textContent 文本内容
     * @returns {string} 提示文本
     * @private
     */
    _buildPrompt(topic, textContent) {
        let prompt = `请为主题"${topic}"创建一个详细的思维导图结构，包含多个层级的内容。`;
        
        // 如果有文本内容，添加到提示中
        if (textContent && textContent.trim()) {
            prompt += `\n\n参考以下文本内容:\n${textContent}`;
        }
        
        // 如果已加载知识点，添加相关知识
        if (this.isKnowledgeLoaded) {
            // 过滤出与主题相关的知识点
            const relatedKnowledge = this._findRelatedKnowledge(topic);
            
            if (relatedKnowledge.length > 0) {
                prompt += '\n\n参考以下知识点:';
                relatedKnowledge.forEach(k => {
                    prompt += `\n- ${k.title}: ${k.description}`;
                });
            }
        }
        
        // 添加输出格式说明
        prompt += `\n\n请以JSON格式返回思维导图结构，格式如下:
{
  "name": "主题名",
  "children": [
    {
      "name": "一级节点1",
      "children": [
        { "name": "二级节点1" },
        { "name": "二级节点2", "children": [
          { "name": "三级节点1" }
        ]}
      ]
    },
    {
      "name": "一级节点2",
      "children": [...]
    }
  ]
}

确保返回的是有效的JSON格式，并且结构具有教育意义和层次清晰。`;

        return prompt;
    }
    
    /**
     * 调用AI API
     * @param {string} prompt 提示文本
     * @returns {Promise<string>} AI响应
     * @private
     */
    async _callAiApi(prompt) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个专注于教育领域的AI助手，擅长生成结构化的思维导图内容。请提供准确、有教育意义的内容，并确保结构层次分明。'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    response_format: { type: 'json_object' }
                })
            });
            
            const data = await response.json();
            console.log('AI API响应:', data);
            
            if (data.error) {
                throw new Error(data.error.message || 'AI API调用失败');
            }
            
            return data.choices[0].message.content;
        } catch (error) {
            console.error('AI API调用失败:', error);
            throw new Error(`AI API调用失败: ${error.message}`);
        }
    }
    
    /**
     * 解析AI响应为思维导图数据结构
     * @param {string} response AI响应文本
     * @param {string} topic 原始主题
     * @returns {Object} 思维导图数据结构
     * @private
     */
    _parseAiResponse(response, topic) {
        try {
            // 尝试从响应中提取JSON部分
            let jsonStr = response;
            
            // 如果响应中包含多余的文本，尝试提取JSON部分
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }
            
            const mindmapData = JSON.parse(jsonStr);
            
            // 确保数据有正确的根节点
            if (!mindmapData.name) {
                mindmapData.name = topic;
            }
            
            // 确保有children属性，即使为空
            if (!mindmapData.children) {
                mindmapData.children = [];
            }
            
            return mindmapData;
        } catch (error) {
            console.error('解析AI响应失败:', error);
            
            // 返回基本结构
            return {
                name: topic,
                children: [
                    {
                        name: 'AI生成失败',
                        children: [
                            { name: '请重试或检查API配置' }
                        ]
                    }
                ]
            };
        }
    }
    
    /**
     * 查找与主题相关的知识点
     * @param {string} topic 主题
     * @returns {Array} 相关知识点
     * @private
     */
    _findRelatedKnowledge(topic) {
        if (!this.isKnowledgeLoaded) {
            return [];
        }
        
        // 匹配与主题关键词相关的知识点
        return this.knowledgePoints.filter(k => {
            // 检查标题、关键词或描述是否包含主题词
            const titleMatch = k.title.toLowerCase().includes(topic.toLowerCase());
            const descMatch = k.description && k.description.toLowerCase().includes(topic.toLowerCase());
            const keywordsMatch = k.keywords && k.keywords.toLowerCase().includes(topic.toLowerCase());
            
            return titleMatch || descMatch || keywordsMatch;
        }).slice(0, 5); // 最多返回5个相关知识点
    }
}

// 导出模块
window.AiMindmapGenerator = AiMindmapGenerator; 