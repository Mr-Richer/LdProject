/**
 * PPTist服务 - 负责PPT数据的获取和处理
 */

// 定义服务对象
const PptistService = {
    /**
     * 获取章节PPT数据
     * @param {number} chapterId 章节ID
     * @returns {Promise} 返回Promise对象
     */
    getChapterPPT: async function(chapterId) {
        if (!chapterId) {
            return {
                code: 400,
                message: '参数错误：缺少章节ID',
                data: null
            };
        }
        
        try {
            // 检查API地址是否已定义
            if (!window.API_BASE_URL) {
                console.warn('API_BASE_URL未定义，使用默认值');
                window.API_BASE_URL = 'http://localhost:3000';
            }
            
            // 构建API URL
            const url = `${window.API_BASE_URL}/api/chapters/${chapterId}/ppt`;
            
            console.log(`尝试从 ${url} 获取PPT数据`);
            
            // 尝试发送请求
            let timeoutId;
            const timeoutPromise = new Promise((_, reject) => {
                timeoutId = setTimeout(() => {
                    reject(new Error('请求超时，使用演示数据'));
                }, 5000); // 5秒超时
            });
            
            // 真实请求
            const fetchPromise = fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            // 使用Promise.race来实现超时
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            
            // 清除超时定时器
            clearTimeout(timeoutId);
            
            // 检查响应状态
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // 解析响应结果
            const result = await response.json();
            
            // 处理结果
            if (result.code === 200 && result.data) {
                return {
                    code: 200,
                    message: 'PPT获取成功',
                    data: result.data
                };
            } else {
                console.warn('API返回了成功状态码，但数据无效，使用演示数据');
                // 返回演示数据
                return this.getDemoPPT();
            }
        } catch (error) {
            console.error('获取章节PPT数据失败:', error);
            console.log('切换到演示模式，使用预设PPT数据');
            
            // 出错时使用演示数据
            return this.getDemoPPT();
        }
    },
    
    /**
     * 将PPT数据转换为PPTist可用的格式
     * @param {Object} pptData 原始PPT数据
     * @returns {Object} PPTist格式的数据
     */
    convertToPptistFormat: function(pptData) {
        // 如果没有PPT数据，返回空对象
        if (!pptData) {
            return {
                slides: [],
                thumbnails: []
            };
        }
        
        try {
            // 处理幻灯片数据
            const slides = Array.isArray(pptData.slides) ? pptData.slides : [];
            
            // 生成缩略图数据
            const thumbnails = slides.map((slide, index) => {
                // 如果有缩略图URL，直接使用
                if (slide.thumbnail) {
                    return slide.thumbnail;
                }
                
                // 否则使用幻灯片图片
                return slide.background?.image || `../picture/ppt/1/h${index + 1}.jpg`;
            });
            
            return {
                slides: slides,
                thumbnails: thumbnails
            };
        } catch (error) {
            console.error('PPT数据转换失败:', error);
            
            return {
                slides: [],
                thumbnails: []
            };
        }
    },
    
    /**
     * 获取演示用的测试PPT数据
     * 在实际PPT接口完成前使用
     * @returns {Object} PPT演示数据
     */
    getDemoPPT: function() {
        console.log('生成演示PPT数据');
        
        // 构建演示用的幻灯片数据
        const slides = [];
        const thumbnails = [];
        
        // 生成10张幻灯片
        for (let i = 1; i <= 10; i++) {
            const slideId = i.toString();
            const imagePath = `../picture/ppt/1/h${i}.jpg`;
            
            // 添加幻灯片
            slides.push({
                id: slideId,
                elements: [
                    // 添加标题文本
                    {
                        type: 'text',
                        id: `title-${slideId}`,
                        content: `演示幻灯片 ${i}`,
                        position: { x: 100, y: 50 },
                        width: 600,
                        height: 80,
                        style: {
                            fontSize: 32,
                            fontWeight: 'bold',
                            color: '#333333',
                            textAlign: 'center'
                        }
                    },
                    // 简单的说明文本
                    {
                        type: 'text',
                        id: `desc-${slideId}`,
                        content: `这是演示幻灯片的内容。当API不可用时，系统会自动加载这些演示数据。`,
                        position: { x: 100, y: 150 },
                        width: 600,
                        height: 150,
                        style: {
                            fontSize: 18,
                            color: '#666666',
                            textAlign: 'left'
                        }
                    }
                ],
                background: {
                    type: 'image',
                    image: imagePath,
                    color: '#ffffff'
                }
            });
            
            // 添加缩略图
            thumbnails.push(imagePath);
        }
        
        return {
            code: 200,
            message: '演示PPT获取成功',
            data: {
                title: '演示PPT',
                slides: slides,
                thumbnails: thumbnails
            }
        };
    },
    
    /**
     * 用户PPT播放记录
     * @param {number} chapterId 章节ID
     * @param {Object} recordData 记录数据
     * @returns {Promise} 返回Promise对象
     */
    recordPPTView: async function(chapterId, recordData) {
        if (!chapterId) {
            console.error('参数错误：缺少章节ID');
            return false;
        }
        
        try {
            // 构建API URL
            const url = `${window.API_BASE_URL}/api/chapters/${chapterId}/record`;
            
            // 准备请求数据
            const requestData = {
                chapterId: chapterId,
                slideProgress: recordData.progress || 0,
                duration: recordData.duration || 0,
                timestamp: new Date().toISOString()
            };
            
            // 发送请求
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            // 检查响应状态
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // 记录成功
            console.log('PPT浏览记录已保存');
            return true;
        } catch (error) {
            console.error('保存PPT浏览记录失败:', error);
            return false;
        }
    }
};

// 将服务挂载到window对象，使其可以作为全局函数访问
window.PptistService = PptistService;

// 如果支持模块化，也支持export导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PptistService;
} 