# 中国文化课程平台前端源码

## 文件结构重组说明

本目录包含了从`index01`目录重组和迁移的前端源码，按照更清晰的目录结构进行了组织。

## 目录结构

```
src/
├── assets/           # 静态资源文件
├── components/       # 可复用组件
├── config/           # 配置文件
├── js/               # JavaScript文件
│   ├── core/         # 核心功能和初始化
│   ├── modules/      # 功能模块
│   └── components/   # 组件脚本
├── styles/           # 样式文件
│   ├── main.css      # 主样式 (原styles.css)
│   └── supplementary.css # 补充样式 (原style.css)
├── utils/            # 工具函数
└── views/            # 页面视图
    └── main/         # 主页面
        └── index.html # 主HTML文件
```

## 文件迁移对照表

以下是原`index01`目录中文件与新目录结构的对应关系：

| 原文件 | 新位置 | 说明 |
|--------|--------|------|
| index.html | src/views/main/index.html | 主HTML文件 |
| styles.css | src/styles/main.css | 主样式文件，重命名为更有意义的名称 |
| style.css | src/styles/supplementary.css | 补充样式文件 |
| script_fixed.js | 拆分为多个模块 | 核心功能和模块被拆分 |
| script_new.js | 不使用 | 替换为更模块化的代码 |
| chapter-navigation.js | src/js/components/chapter-navigation.js | 章节导航组件 |

## 重构后的JS文件结构

原`script_fixed.js`被拆分为以下模块：

1. `js/core/app.js` - 核心配置和全局函数
2. `js/modules/navigation.js` - 导航功能
3. `js/modules/chapters.js` - 章节管理
4. `js/modules/ai-assistant.js` - AI助手功能

## 路径修改

在迁移过程中，所有资源引用路径已更新：

- 样式文件引用路径更新为指向`styles/`目录
- 脚本文件引用路径更新为指向`js/`下对应目录
- 图片等资源路径已相应调整

## 使用说明

使用新的文件结构时，请从`src/views/main/index.html`开始访问应用，该文件已经引用了所有必要的样式和脚本文件。 