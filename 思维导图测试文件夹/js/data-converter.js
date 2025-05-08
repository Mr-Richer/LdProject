/**
 * 数据转换器
 * 将数据库数据转换为思维导图格式
 */

class DataConverter {
    /**
     * 将数据库思维导图数据转换为ECharts树形格式
     * @param {Object} dbMindmap 数据库思维导图对象
     * @param {Array} dbNodes 数据库节点数组
     * @returns {Object} 转换后的树形结构
     */
    static convertDbMindmapToTree(dbMindmap, dbNodes) {
        if (!dbMindmap || !dbNodes || !Array.isArray(dbNodes)) {
            console.error('无效的数据库数据');
            return null;
        }
        
        // 创建根节点
        const rootNode = {
            name: dbMindmap.central_topic || dbMindmap.title,
            children: []
        };
        
        // 创建节点映射，用于快速查找
        const nodeMap = new Map();
        
        // 所有节点添加到映射
        dbNodes.forEach(node => {
            if (!node.is_deleted) {
                nodeMap.set(node.id, {
                    id: node.id,
                    name: node.name,
                    value: node.value,
                    parentId: node.parent_id,
                    level: node.level,
                    position: node.position,
                    children: []
                });
            }
        });
        
        // 构建树形结构
        nodeMap.forEach(node => {
            // 如果有父节点，添加到父节点的children中
            if (node.parentId && nodeMap.has(node.parentId)) {
                const parent = nodeMap.get(node.parentId);
                parent.children.push(node);
            } 
            // 如果是一级节点(父节点为null)，添加到根节点
            else if (node.parentId === null) {
                rootNode.children.push(node);
            }
        });
        
        // 递归移除内部ID等属性，只保留ECharts需要的属性
        return this._cleanupProperties(rootNode);
    }
    
    /**
     * 将知识点数据关联到思维导图
     * @param {Object} mindmapTree 思维导图树形结构
     * @param {Array} knowledgePoints 知识点数据数组
     * @returns {Object} 带知识点内容的思维导图
     */
    static enrichWithKnowledgePoints(mindmapTree, knowledgePoints) {
        if (!mindmapTree || !knowledgePoints || !Array.isArray(knowledgePoints)) {
            return mindmapTree;
        }
        
        // 递归处理节点
        const processNode = (node) => {
            if (!node) return;
            
            // 尝试匹配知识点
            const matchedKnowledge = this._findMatchingKnowledgePoint(node.name, knowledgePoints);
            
            // 如果找到匹配的知识点，添加相关信息
            if (matchedKnowledge) {
                node.knowledge = {
                    id: matchedKnowledge.id,
                    category: matchedKnowledge.category,
                    description: matchedKnowledge.description
                };
            }
            
            // 递归处理子节点
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => processNode(child));
            }
        };
        
        // 从根节点开始处理
        processNode(mindmapTree);
        
        return mindmapTree;
    }
    
    /**
     * 将知识点列表转换为思维导图格式
     * @param {Array} knowledgePoints 知识点数组
     * @param {string} centralTopic 中心主题
     * @returns {Object} 思维导图树形结构
     */
    static convertKnowledgePointsToTree(knowledgePoints, centralTopic) {
        if (!knowledgePoints || !Array.isArray(knowledgePoints)) {
            return null;
        }
        
        // 创建根节点
        const root = {
            name: centralTopic || '知识点集合',
            children: []
        };
        
        // 按类别分组
        const categories = {};
        
        knowledgePoints.forEach(kp => {
            if (!kp.is_deleted) {
                if (!categories[kp.category]) {
                    categories[kp.category] = [];
                }
                categories[kp.category].push(kp);
            }
        });
        
        // 为每个类别创建一个节点
        Object.keys(categories).forEach(category => {
            const categoryNode = {
                name: this._formatCategoryName(category),
                children: []
            };
            
            // 将该类别的所有知识点添加为子节点
            categories[category].forEach(kp => {
                const node = {
                    name: kp.title,
                    description: kp.description
                };
                
                // 如果有关键词，进一步拆分
                if (kp.keywords) {
                    node.children = [];
                    const keywords = kp.keywords.split(',').map(k => k.trim());
                    keywords.forEach(keyword => {
                        if (keyword) {
                            node.children.push({
                                name: keyword
                            });
                        }
                    });
                }
                
                categoryNode.children.push(node);
            });
            
            root.children.push(categoryNode);
        });
        
        return root;
    }
    
    /**
     * 清理节点属性，只保留必要属性
     * @param {Object} node 节点对象
     * @returns {Object} 清理后的节点
     * @private
     */
    static _cleanupProperties(node) {
        if (!node) return null;
        
        const cleanNode = {
            name: node.name
        };
        
        // 保留value属性(如果存在)
        if (node.value) {
            cleanNode.value = node.value;
        }
        
        // 保留knowledge属性(如果存在)
        if (node.knowledge) {
            cleanNode.knowledge = node.knowledge;
        }
        
        // 递归处理子节点
        if (node.children && node.children.length > 0) {
            cleanNode.children = node.children.map(child => this._cleanupProperties(child));
        }
        
        return cleanNode;
    }
    
    /**
     * 查找与节点名称匹配的知识点
     * @param {string} nodeName 节点名称
     * @param {Array} knowledgePoints 知识点数组
     * @returns {Object|null} 匹配的知识点或null
     * @private
     */
    static _findMatchingKnowledgePoint(nodeName, knowledgePoints) {
        if (!nodeName || !knowledgePoints) return null;
        
        // 首先查找完全匹配的标题
        const exactMatch = knowledgePoints.find(kp => 
            kp.title.toLowerCase() === nodeName.toLowerCase()
        );
        
        if (exactMatch) return exactMatch;
        
        // 然后查找部分匹配的标题
        const partialMatch = knowledgePoints.find(kp => 
            kp.title.toLowerCase().includes(nodeName.toLowerCase()) ||
            nodeName.toLowerCase().includes(kp.title.toLowerCase())
        );
        
        if (partialMatch) return partialMatch;
        
        // 最后查找关键词匹配
        return knowledgePoints.find(kp => 
            kp.keywords && 
            kp.keywords.toLowerCase().includes(nodeName.toLowerCase())
        );
    }
    
    /**
     * 格式化类别名称为更友好的显示
     * @param {string} category 类别名
     * @returns {string} 格式化后的类别名
     * @private
     */
    static _formatCategoryName(category) {
        // 类别名映射表
        const categoryMapping = {
            'history': '历史',
            'art': '艺术',
            'literature': '文学',
            'science': '科学',
            'geography': '地理',
            'philosophy': '哲学',
            'culture': '文化',
            'education': '教育'
        };
        
        return categoryMapping[category] || category;
    }
}

// 导出模块
window.DataConverter = DataConverter; 