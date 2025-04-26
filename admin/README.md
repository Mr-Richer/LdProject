# 中国文化人工智能课程平台 - 前端

## 图片资源目录结构

项目中的图片资源按照以下结构组织：

```
src/
├── assets/               # 静态资源（全局共用）
│   ├── images/           # 图片文件（如logo、背景图）
│   │   ├── logo.png
│   │   ├── bg-home.jpg
│   │   └── icons/        # 图标类图片
│   │       ├── arrow.svg
│   │       └── user.png
│   └── styles/           # 全局样式（可引用图片）
│
├── components/           # 组件
│   └── Header/
│       ├── Header.vue    # 组件文件（未创建）
│       └── images/       # 组件专用图片（如按钮图标）
│           ├── menu.png
│           └── search.svg
│
├── views/                # 页面级组件
│   └── Home/
│       ├── Home.vue      # 页面组件（未创建）
│       └── images/       # 页面专用图片（如Banner）
│           └── banner.jpg
│
public/                   # 无需构建的静态文件（直接拷贝到dist）
│   ├── favicon.ico
│   └── static-images/    # 第三方库要求的固定路径图片
│       └── vendor-logo.png
```

## 图片使用规范

### 1. 全局通用图片

放置在 `src/assets/images/` 目录下，适用于整个应用程序多处共用的图片，如：
- 网站logo
- 通用背景图
- 全局使用的图标

### 2. 组件专用图片

放置在对应组件文件夹下的 `images/` 目录中，如 `src/components/Header/images/`。
这些图片仅在特定组件中使用，与组件紧密关联。

### 3. 页面专用图片

放置在对应页面视图文件夹下的 `images/` 目录中，如 `src/views/Home/images/`。
这些图片仅在特定页面中使用，与页面内容紧密关联。

### 4. 公共静态图片

放置在 `public/static-images/` 目录下，这些图片：
- 不会被webpack处理
- 需要以完整路径引用
- 适用于一些第三方库需要固定路径的情况

## 图片引用方式

1. 在JavaScript/Vue文件中：
   ```js
   // 引用全局图片
   import logo from '@/assets/images/logo.png';
   
   // 引用组件内图片
   import menuIcon from './images/menu.png';
   ```

2. 在CSS/SCSS中：
   ```css
   /* 引用全局图片 */
   .logo {
     background-image: url('~@/assets/images/logo.png');
   }
   
   /* 引用组件内图片 */
   .menu-icon {
     background-image: url('./images/menu.png');
   }
   ```

3. 引用公共目录图片：
   ```html
   <img src="/static-images/vendor-logo.png">
   ``` 