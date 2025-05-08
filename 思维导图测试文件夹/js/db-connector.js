/**
 * 数据库连接器模块
 * 负责与MySQL数据库交互，获取思维导图数据
 */

class DbConnector {
    constructor() {
        // 默认API端点
        this.apiEndpoint = '/api/mindmap';
        this.isConnected = false;
    }

    /**
     * 初始化数据库连接
     * @param {string} apiEndpoint API端点URL
     * @returns {Promise<boolean>} 连接是否成功
     */
    async initialize(apiEndpoint) {
        if (apiEndpoint) {
            this.apiEndpoint = apiEndpoint;
        }
        
        try {
            // 尝试连接测试
            const response = await this.testConnection();
            this.isConnected = response.success;
            return this.isConnected;
        } catch (error) {
            console.error('数据库连接初始化失败:', error);
            this.isConnected = false;
            throw error;
        }
    }

    /**
     * 测试数据库连接
     * @returns {Promise<Object>} 响应对象
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.apiEndpoint}/test-connection`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            return await response.json();
        } catch (error) {
            console.error('测试连接失败:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * 获取所有思维导图列表
     * @returns {Promise<Array>} 思维导图列表
     */
    async getMindmaps() {
        try {
            const response = await fetch(`${this.apiEndpoint}/mindmaps`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            return data.success ? data.mindmaps : [];
        } catch (error) {
            console.error('获取思维导图列表失败:', error);
            return [];
        }
    }

    /**
     * 根据ID获取思维导图及其节点
     * @param {number} id 思维导图ID
     * @returns {Promise<Object>} 思维导图数据
     */
    async getMindmapById(id) {
        try {
            const response = await fetch(`${this.apiEndpoint}/mindmap/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            return data.success ? data.mindmap : null;
        } catch (error) {
            console.error(`获取思维导图(ID:${id})失败:`, error);
            return null;
        }
    }

    /**
     * 获取知识点列表
     * @param {string} category 可选类别过滤
     * @returns {Promise<Array>} 知识点列表
     */
    async getKnowledgePoints(category) {
        try {
            let url = `${this.apiEndpoint}/knowledge-points`;
            if (category) {
                url += `?category=${encodeURIComponent(category)}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            return data.success ? data.knowledgePoints : [];
        } catch (error) {
            console.error('获取知识点列表失败:', error);
            return [];
        }
    }
}

// 导出模块
window.DbConnector = DbConnector; 