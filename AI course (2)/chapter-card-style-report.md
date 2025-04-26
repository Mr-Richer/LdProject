# 首页课程章节卡片样式详细报告

## 章节区域整体结构

### 章节标题栏
```html
<div class="section-title">
    <div>
        <h2 class="zh">课程章节</h2>
        <h2 class="en">Course Chapters</h2>
    </div>
    <button id="newChapterBtn" class="btn-add">
        <i class="fas fa-plus"></i>
        <span class="zh">新建章节</span>
        <span class="en">New Chapter</span>
    </button>
</div>
```

### 章节容器
```html
<div class="chapters-section">
    <button class="chapter-nav-btn prev-btn">
        <i class="fas fa-chevron-left"></i>
    </button>
    
    <div class="chapters-container">
        <!-- 章节卡片在这里 -->
    </div>
    
    <button class="chapter-nav-btn next-btn">
        <i class="fas fa-chevron-right"></i>
    </button>
</div>
```

## 章节卡片HTML结构

```html
<div class="chapter-card">
    <div class="chapter-cover">
        <img src="image-path.jpg" alt="章节封面" class="chapter-img">
        <div class="chapter-actions">
            <button class="chapter-action-btn edit" title="编辑章节">
                <i class="fas fa-edit"></i>
            </button>
            <button class="chapter-action-btn prepare" title="备课">
                <i class="fas fa-magic"></i>
            </button>
            <button class="chapter-action-btn teach" title="上课">
                <i class="fas fa-chalkboard-teacher"></i>
            </button>
        </div>
    </div>
    <div class="chapter-info">
        <h3 class="chapter-title zh">第X章：标题中文</h3>
        <h3 class="chapter-title en">Chapter X: Title English</h3>
        <p class="chapter-desc zh">中文描述内容</p>
        <p class="chapter-desc en">English description content</p>
        <div class="chapter-meta">
            <div class="meta-item">
                <i class="far fa-clock"></i>
                <span class="zh">更新于 X天前</span>
                <span class="en">Updated X days ago</span>
            </div>
            <div class="meta-item">
                <i class="far fa-file-alt"></i>
                <span>XX 文件</span>
            </div>
        </div>
    </div>
</div>
```

## 章节卡片CSS样式

### 章节区域布局

```css
/* 章节区域样式 */
.chapters-section {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.chapters-container {
    display: flex;
    overflow-x: hidden;
    scroll-behavior: smooth;
    gap: 24px;
    padding: 10px 0;
    width: 100%;
}
```

### 章节卡片基础样式

```css
.chapter-card {
    flex: 0 0 calc(33.33% - 16px);
    min-width: 280px;
    background-color: var(--apple-bg-light);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 4px 12px var(--shadow-color);
    transition: var(--transition);
}

.chapter-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px var(--shadow-color);
}
```

### 章节封面样式

```css
.chapter-cover {
    position: relative;
    height: 180px;
    overflow: hidden;
}

.chapter-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
}

.chapter-card:hover .chapter-cover img {
    transform: scale(1.05);
}
```

### 章节操作按钮区样式

```css
.chapter-actions {
    position: absolute;
    bottom: -40px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 10px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    transition: var(--transition);
}

.chapter-card:hover .chapter-actions {
    bottom: 0;
}

.chapter-action-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background-color: white;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
}

.chapter-action-btn:hover {
    transform: translateY(-3px);
}

.chapter-action-btn.edit {
    color: var(--info-color);
}

.chapter-action-btn.prepare {
    color: var(--warning-color);
}

.chapter-action-btn.teach {
    color: var(--success-color);
}
```

### 章节信息区样式

```css
.chapter-info {
    padding: 20px;
}

.chapter-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-color);
}

.chapter-desc {
    font-size: 14px;
    color: var(--text-light);
    margin-bottom: 15px;
    line-height: 1.5;
    height: 63px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.chapter-meta {
    display: flex;
    color: var(--text-light);
    font-size: 12px;
    border-top: 1px solid var(--border-color);
    padding-top: 12px;
}

.meta-item {
    display: flex;
    align-items: center;
    margin-right: 15px;
}

.meta-item i {
    margin-right: 6px;
    font-size: 14px;
}
```

### 导航按钮样式

```css
.chapter-nav-btn {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 52px;
    height: 52px;
    background-color: white;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    cursor: pointer;
    z-index: 5;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.chapter-nav-btn i {
    font-size: 20px;
}

.chapter-nav-btn:hover {
    background-color: var(--apple-blue);
    color: white;
    transform: scale(1.1);
}

.prev-btn {
    left: -26px;
}

.next-btn {
    right: -26px;
}
```

## 设计特点总结

1. **布局特点**:
   - 采用响应式设计，默认每行显示3个卡片
   - 最小宽度280px确保在小屏幕设备上有合适显示
   - 使用水平滚动容器和导航按钮浏览更多章节

2. **视觉设计**:
   - 采用苹果风格UI，干净简洁
   - 使用卡片阴影增强层次感
   - 圆角设计增加现代感
   - 悬停时的微动效提升交互体验

3. **交互设计**:
   - 卡片悬停时上移效果增强用户反馈
   - 封面图片轻微放大创造活跃感
   - 操作按钮从底部滑入，减少视觉干扰
   - 按钮悬停时有微上移效果强化可点击性

4. **内容展示**:
   - 多语言支持（中英文）
   - 章节描述限制为3行，超出显示省略号
   - 底部元数据区显示更新时间和文件数量

5. **色彩系统**:
   - 使用变量控制颜色主题
   - 不同操作按钮使用不同颜色区分功能
   - 渐变背景增强视觉层次

6. **其他**:
   - 良好的过渡动画增强用户体验
   - 清晰的信息层次，便于快速浏览和理解 