/**
 * 自动思维导图生成器
 * 从文本内容自动解析并生成思维导图数据结构
 */

// 自动思维导图生成器
class AutoMindmapGenerator {
    constructor() {
        this.keywords = {
            // 章节和层级标识符
            sections: ['第一章', '第二章', '第三章', '第四章', '第五章', '章节', '单元'],
            levels: ['一、', '二、', '三、', '四、', '五、', '1.', '2.', '3.', '4.', '5.'],
            sublevels: ['(1)', '(2)', '(3)', '(4)', '(5)', '1)', '2)', '3)', '4)', '5)'],
            
            // 关系标识符
            relations: ['包括', '包含', '有', '是', '分为', '可分为', '主要有'],
            
            // 重要性标识符
            importance: ['重要', '核心', '关键', '主要', '基本', '必须', '特点']
        };
    }
    
    /**
     * 从文本生成思维导图数据
     * @param {string} text 输入文本
     * @param {string} mainTopic 主题名称
     * @returns {Object} 思维导图数据结构
     */
    generateFromText(text, mainTopic) {
        // 预处理文本
        const cleanText = this._preprocessText(text);
        
        // 识别主要段落
        const paragraphs = this._splitIntoParagraphs(cleanText);
        
        // 处理段落并提取主题结构
        const topics = this._extractTopics(paragraphs, mainTopic);
        
        // 构建树形结构
        return this._buildTreeStructure(topics, mainTopic);
    }
    
    /**
     * 预处理文本，移除不必要的特殊字符和格式
     * @param {string} text 原始文本
     * @returns {string} 处理后的文本
     */
    _preprocessText(text) {
        // 移除多余空格和特殊字符
        let cleanText = text.replace(/\s+/g, ' ').trim();
        
        // 替换全角标点为半角
        cleanText = cleanText.replace(/：/g, ':').replace(/，/g, ',').replace(/。/g, '.');
        
        return cleanText;
    }
    
    /**
     * 将文本分割为有意义的段落
     * @param {string} text 预处理后的文本
     * @returns {string[]} 段落数组
     */
    _splitIntoParagraphs(text) {
        // 按句号、感叹号、问号、分号分割
        const sentences = text.split(/[.!?;。！？；]/);
        
        // 过滤空白句子
        return sentences.filter(sentence => sentence.trim().length > 0);
    }
    
    /**
     * 从段落中提取主题
     * @param {string[]} paragraphs 段落数组
     * @param {string} mainTopic 主题
     * @returns {Object[]} 主题数组
     */
    _extractTopics(paragraphs, mainTopic) {
        const topics = [];
        const mainTopicLower = mainTopic.toLowerCase();
        
        paragraphs.forEach(paragraph => {
            // 寻找可能的主题
            const possibleTopics = this._findPossibleTopics(paragraph, mainTopicLower);
            topics.push(...possibleTopics);
        });
        
        // 合并相似主题，移除重复
        return this._mergeSimilarTopics(topics);
    }
    
    /**
     * 从段落中寻找可能的主题
     * @param {string} paragraph 段落文本
     * @param {string} mainTopicLower 小写主题名
     * @returns {Object[]} 可能的主题数组
     */
    _findPossibleTopics(paragraph, mainTopicLower) {
        const result = [];
        const paragraphLower = paragraph.toLowerCase();
        
        // 如果包含主题关键词
        if (paragraphLower.includes(mainTopicLower)) {
            // 寻找关系词后的内容
            for (const relation of this.keywords.relations) {
                const index = paragraphLower.indexOf(relation);
                if (index > 0) {
                    const afterRelation = paragraph.substring(index + relation.length).trim();
                    // 按逗号分隔可能的主题
                    const parts = afterRelation.split(/[,，、]/);
                    
                    parts.forEach(part => {
                        const topicName = part.trim();
                        if (topicName.length > 0 && topicName.length < 20) { // 过滤太长的文本
                            result.push({
                                name: topicName,
                                level: 1,
                                importance: this._calculateImportance(part)
                            });
                        }
                    });
                }
            }
        }
        
        // 按节标识符处理
        for (let i = 0; i < this.keywords.levels.length; i++) {
            const level = this.keywords.levels[i];
            if (paragraph.startsWith(level)) {
                const content = paragraph.substring(level.length).trim();
                result.push({
                    name: content,
                    level: 1,
                    importance: this._calculateImportance(content) + 1 // 给标题增加权重
                });
            }
        }
        
        return result;
    }
    
    /**
     * 计算主题的重要性分数
     * @param {string} text 主题文本
     * @returns {number} 重要性分数
     */
    _calculateImportance(text) {
        let score = 0;
        const textLower = text.toLowerCase();
        
        // 检查是否包含重要性关键词
        this.keywords.importance.forEach(keyword => {
            if (textLower.includes(keyword)) {
                score += 1;
            }
        });
        
        // 加权短主题(可能更重要)
        if (text.length < 10) {
            score += 1;
        }
        
        return score;
    }
    
    /**
     * 合并相似主题
     * @param {Object[]} topics 主题数组
     * @returns {Object[]} 合并后的主题数组
     */
    _mergeSimilarTopics(topics) {
        const merged = [];
        const seen = new Set();
        
        topics.forEach(topic => {
            // 简化比较的名称
            const simpleName = topic.name.toLowerCase().replace(/[.,;:，。；：]/g, '');
            
            // 如果没有看到类似主题
            if (!seen.has(simpleName)) {
                seen.add(simpleName);
                merged.push(topic);
            } else {
                // 更新现有主题的重要性
                const existing = merged.find(t => {
                    const otherSimpleName = t.name.toLowerCase().replace(/[.,;:，。；：]/g, '');
                    return otherSimpleName === simpleName;
                });
                
                if (existing) {
                    existing.importance = Math.max(existing.importance, topic.importance);
                }
            }
        });
        
        // 按重要性排序
        return merged.sort((a, b) => b.importance - a.importance);
    }
    
    /**
     * 构建思维导图树形结构
     * @param {Object[]} topics 主题数组
     * @param {string} mainTopic 主主题
     * @returns {Object} 树形结构
     */
    _buildTreeStructure(topics, mainTopic) {
        // 根节点
        const root = {
            name: mainTopic,
            children: []
        };
        
        // 选择前8个最重要的主题作为一级节点
        const mainTopics = topics.slice(0, Math.min(8, topics.length));
        
        // 从剩余主题中选择子主题
        const subTopics = topics.slice(Math.min(8, topics.length));
        
        // 添加一级主题
        mainTopics.forEach(topic => {
            const node = {
                name: topic.name,
                children: []
            };
            
            // 为每个一级主题分配2-3个子主题
            const numChildren = Math.floor(Math.random() * 2) + 2; // 2-3个
            
            // 如果有足够的子主题
            if (subTopics.length > 0) {
                for (let i = 0; i < numChildren && subTopics.length > 0; i++) {
                    // 从子主题数组中取出一个
                    const subTopic = subTopics.shift();
                    node.children.push({
                        name: subTopic.name
                    });
                }
            }
            
            // 如果没有分配任何子主题，生成示例子主题
            if (node.children.length === 0) {
                // 根据主题名生成相关子主题
                const exampleSubtopics = this._generateExampleSubtopics(topic.name);
                exampleSubtopics.forEach(subtopic => {
                    node.children.push({
                        name: subtopic
                    });
                });
            }
            
            root.children.push(node);
        });
        
        return root;
    }
    
    /**
     * 根据主题名生成示例子主题
     * @param {string} topicName 主题名
     * @returns {string[]} 示例子主题数组
     */
    _generateExampleSubtopics(topicName) {
        // 常见中国传统文化相关的子主题映射
        const subtopicsMap = {
            '哲学思想': ['儒家', '道家', '法家', '墨家', '兵家'],
            '传统艺术': ['书法', '国画', '戏曲', '民乐', '园林'],
            '文学': ['诗词', '散文', '小说', '戏剧', '经典著作'],
            '节日': ['春节', '元宵', '清明', '端午', '中秋', '重阳'],
            '习俗': ['婚俗', '丧俗', '祭祀', '生辰', '节庆'],
            '饮食': ['八大菜系', '茶文化', '酒文化', '食疗养生', '烹饪技艺'],
            '服饰': ['汉服', '旗袍', '唐装', '蜀锦', '云锦', '刺绣'],
            '建筑': ['宫殿', '园林', '寺庙', '民居', '塔楼', '桥梁'],
            '医药': ['中医理论', '针灸', '草药', '养生', '医道哲学'],
            '武术': ['太极', '少林', '武当', '八卦', '形意', '气功'],
            '工艺': ['陶瓷', '漆器', '玉雕', '丝绸', '剪纸', '年画'],
            '教育': ['科举', '私塾', '学术', '师道', '经典诵读']
        };
        
        // 查找最匹配的主题
        let bestMatch = '';
        let maxScore = 0;
        
        for (const key in subtopicsMap) {
            if (topicName.includes(key)) {
                return this._getRandomElements(subtopicsMap[key], 3);
            }
            
            // 计算匹配分数
            let score = 0;
            const keyWords = key.split('');
            keyWords.forEach(word => {
                if (topicName.includes(word)) {
                    score++;
                }
            });
            
            if (score > maxScore) {
                maxScore = score;
                bestMatch = key;
            }
        }
        
        // 如果找到相似匹配，使用它
        if (maxScore >= 2 && bestMatch) {
            return this._getRandomElements(subtopicsMap[bestMatch], 3);
        }
        
        // 默认子主题
        return ['起源', '发展', '特点', '影响', '现代价值'].slice(0, 3);
    }
    
    /**
     * 从数组中随机获取n个元素
     * @param {Array} array 源数组
     * @param {number} n 要获取的元素个数
     * @returns {Array} 随机n个元素组成的数组
     */
    _getRandomElements(array, n) {
        const result = [...array];
        // 洗牌算法
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result.slice(0, Math.min(n, result.length));
    }
}

// 导出模块
window.AutoMindmapGenerator = AutoMindmapGenerator; 