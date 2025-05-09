/**
 * 章节创建与文件上传模块
 * 处理新建章节、封面图片上传和课件上传功能
 */

// 章节创建模块的初始化函数
function initChapterUpload() {
    console.log('初始化章节上传功能...');
    
    // 新建章节按钮点击事件
    const newChapterBtn = document.getElementById('newChapterBtn');
    if (newChapterBtn) {
        newChapterBtn.addEventListener('click', () => {
            document.getElementById('newChapterModal').classList.add('active');
        });
    }
    
    // 关闭模态框按钮点击事件
    const closeModalBtn = document.getElementById('closeNewChapterModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('newChapterModal').classList.remove('active');
        });
    }
    
    // 取消按钮点击事件
    const cancelBtn = document.getElementById('cancelNewChapter');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('newChapterModal').classList.remove('active');
        });
    }
    
    // 提交表单事件
    const submitBtn = document.getElementById('submitNewChapter');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            submitNewChapter();
        });
    }
    
    // 封面图片上传预览
    const coverImageInput = document.getElementById('coverImage');
    if (coverImageInput) {
        coverImageInput.addEventListener('change', (e) => {
            handleFilePreview(e.target, 'image');
        });
    }
    
    // 课件文件上传预览
    const coursewareInput = document.getElementById('coursewareFile');
    if (coursewareInput) {
        coursewareInput.addEventListener('click', () => {
            console.log('课件上传控件被点击');
        });
        
        coursewareInput.addEventListener('change', (e) => {
            handleFilePreview(e.target, 'courseware');
        });
    }
    
    console.log('章节上传功能初始化完成');
}

/**
 * 处理文件预览
 * @param {HTMLElement} fileInput - 文件输入元素
 * @param {string} type - 文件类型 (image/courseware)
 */
function handleFilePreview(fileInput, type) {
    const filePreview = fileInput.parentElement.querySelector('.file-preview');
    
    if (!fileInput.files || !fileInput.files[0]) {
        return;
    }
    
    const file = fileInput.files[0];
    console.log(`处理${type}文件预览:`, file.name, `大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    
    // 获取配置
    const config = window.APP_CONFIG || {};
    const uploadConfig = config.UPLOAD_CONFIG || {};
    
    // 检查文件大小
    if (type === 'image' && uploadConfig.image?.maxSize && file.size > uploadConfig.image.maxSize) {
        const maxSizeMB = (uploadConfig.image.maxSize / 1024 / 1024).toFixed(2);
        showNotification('error', `图片大小超过限制 (${maxSizeMB}MB)`, `Image size exceeds the limit (${maxSizeMB}MB)`);
        fileInput.value = ''; // 清空文件输入
        return;
    }
    
    if (type === 'courseware' && uploadConfig.courseware?.maxSize && file.size > uploadConfig.courseware.maxSize) {
        const maxSizeMB = (uploadConfig.courseware.maxSize / 1024 / 1024).toFixed(2);
        showNotification('error', `课件大小超过限制 (${maxSizeMB}MB)`, `Courseware size exceeds the limit (${maxSizeMB}MB)`);
        fileInput.value = ''; // 清空文件输入
        return;
    }
    
    if (type === 'image') {
        const reader = new FileReader();
        reader.onload = function(e) {
            filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    } else if (type === 'courseware') {
        // 显示文件名和大小
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // 转换为MB并保留两位小数
        filePreview.innerHTML = `<div class="file-name"><i class="fas fa-file-powerpoint"></i> ${fileName} (${fileSize}MB)</div>`;
    }
}

/**
 * 提交新建章节
 * 处理表单数据、文件上传和章节创建
 */
async function submitNewChapter() {
    // 获取配置
    const config = window.APP_CONFIG || {};
    const apiBaseUrl = config.API_BASE_URL || 'http://localhost:3000';
    const uploadConfig = config.UPLOAD_CONFIG || {};
    const chapterApi = config.CHAPTER_API || {};
    
    console.log('开始提交新章节，使用API地址:', apiBaseUrl);
    
    // 获取表单按钮并显示加载状态
    const submitBtn = document.getElementById('submitNewChapter');
    let originalBtnText = '';
    
    if (submitBtn) {
        originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
    }
    
    const form = document.getElementById('newChapterForm');
    if (!form) {
        console.error('找不到表单元素 #newChapterForm');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        showNotification('error', '系统错误：找不到表单', 'System error: Form not found');
        return;
    }
    
    const formData = new FormData(form);
    
    // 验证必填字段
    const titleZh = formData.get('title_zh');
    const titleEn = formData.get('title_en');
    
    if (!titleZh || !titleEn) {
        showNotification('error', '请填写必填字段', 'Please fill in required fields');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        return;
    }
    
    try {
        // 处理图片上传
        let coverImagePath = '';
        const coverImageFile = document.getElementById('coverImage').files[0];
        
        if (coverImageFile) {
            // 上传图片
            try {
                const imageFormData = new FormData();
                imageFormData.append('file', coverImageFile);
                
                console.log('尝试上传图片...');
                
                // 上传图片 - 使用配置的URL
                const imageUploadUrl = uploadConfig.image?.url || `${apiBaseUrl}/api/upload/image`;
                const imageUploadResponse = await fetch(imageUploadUrl, {
                    method: 'POST',
                    body: imageFormData
                });
                
                console.log('图片上传响应状态:', imageUploadResponse.status);
                
                if (!imageUploadResponse.ok) {
                    const errorText = await imageUploadResponse.text();
                    console.error('图片上传失败:', imageUploadResponse.status, errorText);
                    
                    // 使用默认图片，继续章节创建流程
                    showNotification('warning', '图片上传失败，将使用默认图片', 'Image upload failed, using default image');
                    coverImagePath = uploadConfig.image?.defaultImage || '../picture/banner.jpg';
                } else {
                    // 上传成功
                    const imageResult = await imageUploadResponse.json();
                    console.log('图片上传成功, 响应:', imageResult);
                    
                    // 返回的URL会是/uploads/images/xxxx.jpg格式，
                    // 但我们需要存储为../picture/xxxx.jpg格式以保持一致性
                    if (imageResult.data && imageResult.data.url) {
                        // 获取文件名
                        const fileName = imageResult.data.url.split('/').pop();
                        // 转换为与已有数据相同的格式
                        coverImagePath = `../picture/${fileName}`;
                        console.log('转换后的图片URL:', coverImagePath);
                        
                        // 复制上传的图片到admin/picture目录
                        try {
                            const copyImageUrl = chapterApi.copyImage || `${apiBaseUrl}/api/admin/copy-image`;
                            const copyResponse = await fetch(copyImageUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    sourceFileName: fileName
                                })
                            });
                            
                            if (!copyResponse.ok) {
                                console.warn('复制图片到admin/picture目录失败，但章节创建将继续');
                            }
                        } catch (copyError) {
                            console.error('复制图片时出错:', copyError);
                        }
                    } else if (imageResult.url) {
                        const fileName = imageResult.url.split('/').pop();
                        coverImagePath = `../picture/${fileName}`;
                        console.log('转换后的图片URL:', coverImagePath);
                    } else {
                        // 使用默认图片
                        coverImagePath = uploadConfig.image?.defaultImage || '../picture/banner.jpg';
                    }
                }
            } catch (error) {
                console.error('图片上传过程中出错:', error);
                // 使用默认图片但继续创建章节
                coverImagePath = uploadConfig.image?.defaultImage || '../picture/banner.jpg';
            }
        }
        
        // 处理课件上传
        let pptFilePath = '';
        const coursewareFile = document.getElementById('coursewareFile').files[0];
        
        if (coursewareFile) {
            // 上传课件文件
            try {
                const pptFormData = new FormData();
                pptFormData.append('file', coursewareFile);
                
                console.log('尝试上传课件文件...');
                
                // 上传课件 - 使用配置的URL
                const coursewareUploadUrl = uploadConfig.courseware?.url || `${apiBaseUrl}/api/upload/ppt`;
                const pptUploadResponse = await fetch(coursewareUploadUrl, {
                    method: 'POST',
                    body: pptFormData,
                    // 不设置Content-Type，让浏览器自动设置为multipart/form-data并添加正确的boundary
                    headers: {
                        // 移除默认的Content-Type设置
                    }
                });
                
                console.log('课件上传响应状态:', pptUploadResponse.status);
                
                if (!pptUploadResponse.ok) {
                    const errorText = await pptUploadResponse.text();
                    console.error('课件上传失败:', pptUploadResponse.status, errorText);
                    
                    showNotification('warning', '课件上传失败，将创建无课件的章节', 'Courseware upload failed, creating chapter without courseware');
                } else {
                    // 上传成功
                    const pptResult = await pptUploadResponse.json();
                    console.log('课件上传成功, 响应:', pptResult);
                    
                    if (pptResult.data && pptResult.data.url) {
                        // 获取文件名
                        const fileName = pptResult.data.url.split('/').pop();
                        // 使用配置中的客户端访问路径
                        const clientPath = uploadConfig.courseware?.clientPath || '/uploads/ppt/';
                        pptFilePath = `${clientPath}${fileName}`;
                        console.log('转换后的课件URL:', pptFilePath);
                    }
                }
            } catch (error) {
                console.error('课件上传过程中出错:', error);
                showNotification('warning', '课件上传过程中出错，将创建无课件的章节', 'Error during courseware upload, creating chapter without courseware');
            }
        }
        
        // 获取已有章节以确定序号
        const chaptersListUrl = chapterApi.list || `${apiBaseUrl}/api/chapters`;
        const chaptersResponse = await fetch(chaptersListUrl);
        const chaptersResult = await chaptersResponse.json();
        
        // 确定新章节序号
        let maxChapterNumber = 0;
        if (chaptersResult.code === 200 && chaptersResult.data && chaptersResult.data.chapters) {
            maxChapterNumber = chaptersResult.data.chapters.reduce((max, chapter) => 
                Math.max(max, chapter.chapter_number || 0), 0);
        }
        
        // 构建请求数据
        const chapterData = {
            chapter_number: parseInt(formData.get('chapter_number')) || maxChapterNumber + 1,
            title_zh: formData.get('title_zh'),
            title_en: formData.get('title_en'),
            description_zh: formData.get('description_zh') || '',
            description_en: formData.get('description_en') || '',
            cover_image: coverImagePath, // 使用上传后的图片路径
            ppt_file: pptFilePath, // 使用上传后的课件路径
            is_published: document.getElementById('isPublished') ? document.getElementById('isPublished').checked : true
        };
        
        console.log('提交章节数据:', chapterData);
        
        // 发送请求创建章节
        const createChapterUrl = chapterApi.create || `${apiBaseUrl}/api/chapters`;
        const response = await fetch(createChapterUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chapterData)
        });
        
        // 检查响应状态
        if (!response.ok) {
            const errorText = await response.text();
            console.error('创建章节失败:', response.status, errorText);
            throw new Error(`创建章节失败: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.code === 201 || result.code === 200) {
            // 创建成功
            showNotification('success', '章节创建成功', 'Chapter created successfully');
            
            // 保存最后创建的章节信息
            lastCreatedChapter = {
                chapter_number: chapterData.chapter_number,
                title_zh: chapterData.title_zh,
                title_en: chapterData.title_en,
                id: result.data?.id || result.data?.chapter_id || null,
                cover_image: chapterData.cover_image,
                ppt_file: chapterData.ppt_file
            };
            
            // 关闭模态框并重置表单
            document.getElementById('newChapterModal').classList.remove('active');
            form.reset();
            
            // 重置文件预览
            resetFilePreview();
            
            // 统一处理所有刷新操作
            await refreshAllSelectors();
            
            // 等待章节加载和DOM更新完成后，滚动到最后一个章节
            setTimeout(() => {
                const chaptersContainer = document.getElementById('chaptersContainer');
                if (chaptersContainer) {
                    const lastChapter = chaptersContainer.lastElementChild;
                    if (lastChapter) {
                        // 滚动到最后一个章节
                        chaptersContainer.scrollLeft = chaptersContainer.scrollWidth;
                        
                        // 高亮显示最后一个章节
                        lastChapter.classList.add('highlight-new');
                        // 2秒后移除高亮
                        setTimeout(() => {
                            lastChapter.classList.remove('highlight-new');
                        }, 2000);
                    }
                }
            }, 500);
        } else {
            throw new Error(result.message || '创建章节失败，服务器返回未知状态');
        }
    } catch (error) {
        console.error('创建章节失败:', error);
        showNotification('error', '创建章节失败: ' + error.message, 'Failed to create chapter: ' + error.message);
    } finally {
        // 恢复按钮状态
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}

/**
 * 重置文件预览
 */
function resetFilePreview() {
    // 重置封面图片预览
    const coverPreview = document.querySelector('#coverImage')?.parentElement?.querySelector('.file-preview');
    if (coverPreview) {
        coverPreview.innerHTML = '<i class="fas fa-image"></i>';
    }
    
    // 重置课件文件预览
    const coursewarePreview = document.querySelector('#coursewareFile')?.parentElement?.querySelector('.file-preview');
    if (coursewarePreview) {
        coursewarePreview.innerHTML = '<i class="fas fa-file-powerpoint"></i>';
    }
}

/**
 * 显示通知消息
 * @param {string} type - 通知类型: success, error, warning, info
 * @param {string} messageZh - 中文消息内容
 * @param {string} messageEn - 英文消息内容
 */
function showNotification(type, messageZh, messageEn) {
    // 如果全局通知函数存在，则使用全局函数
    if (typeof window.showNotification === 'function') {
        window.showNotification(type, messageZh, messageEn);
        return;
    }
    
    // 否则使用内部实现
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-circle'}"></i>
        <span class="zh">${messageZh}</span>
        <span class="en">${messageEn}</span>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动关闭通知
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // 关闭按钮点击事件
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// 保存最后创建的章节信息
let lastCreatedChapter = null;

// 添加统一的刷新方法
async function refreshAllSelectors() {
    try {
        // 1. 刷新章节卡片
        if (typeof loadChapters === 'function') {
            await loadChapters();
        }

        // 2. 更新章节统计数据
        if (typeof updateChapterStats === 'function') {
            updateChapterStats();
        }

        // 3. 刷新课前章节选择器
        if (typeof initChapterSelector === 'function') {
            await initChapterSelector();
        }

        // 4. 刷新课中章节选择器
        if (typeof initInClassChapterSelector === 'function') {
            await initInClassChapterSelector();
        }

        console.log('所有章节相关UI已刷新');
    } catch (error) {
        console.error('刷新章节相关UI时出错:', error);
    }
}

// 暴露公共方法和变量
window.ChapterUpload = {
    init: initChapterUpload,
    submitNewChapter: submitNewChapter,
    showNotification: showNotification,
    getLastCreatedChapter: () => lastCreatedChapter,
    refreshAllSelectors: refreshAllSelectors  // 添加刷新方法到公共接口
};

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，准备初始化章节上传功能');
    // 初始化章节上传功能
    initChapterUpload();
}); 