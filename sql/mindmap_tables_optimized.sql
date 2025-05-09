-- 优化版思维导图表结构 - 包含正确的外键约束

-- 思维导图主表
CREATE TABLE IF NOT EXISTS mindmaps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL COMMENT '思维导图标题',
    central_topic VARCHAR(100) NOT NULL COMMENT '中心主题',
    user_id INT COMMENT '创建用户ID',
    style VARCHAR(50) DEFAULT 'standard' COMMENT '样式: standard, colorful, simple',
    max_levels INT DEFAULT 4 COMMENT '最大层级数',
    expansion_type TINYINT DEFAULT 1 COMMENT '拓展类型: 1=文化渊源, 2=文化发展, 3=文化创新, 4=区域文化, 5=跨学科知识, 6=中西文化对比',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_expansion_type (expansion_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='思维导图主表';

-- 节点表 - 优化外键约束
CREATE TABLE IF NOT EXISTS mindmap_nodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mindmap_id INT NOT NULL COMMENT '所属思维导图ID',
    name VARCHAR(100) NOT NULL COMMENT '节点名称',
    value VARCHAR(255) COMMENT '节点值',
    parent_id INT COMMENT '父节点ID，NULL表示根节点',
    level INT NOT NULL COMMENT '节点层级',
    position INT DEFAULT 0 COMMENT '同级节点中的位置顺序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    INDEX idx_mindmap_id (mindmap_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_deleted (is_deleted),
    FOREIGN KEY (mindmap_id) REFERENCES mindmaps(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES mindmap_nodes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='思维导图节点表';

-- 知识点表
CREATE TABLE IF NOT EXISTS knowledge_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL COMMENT '知识点标题',
    category VARCHAR(50) NOT NULL COMMENT '类别: history, art, literature, science, geography等',
    description TEXT COMMENT '知识点描述',
    keywords TEXT COMMENT '关键词，以逗号分隔',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    INDEX idx_category (category),
    INDEX idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识点表';

-- 思维导图与知识点关联表
CREATE TABLE IF NOT EXISTS mindmap_knowledge_relations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mindmap_id INT NOT NULL COMMENT '思维导图ID',
    knowledge_id INT NOT NULL COMMENT '知识点ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mindmap_id (mindmap_id),
    INDEX idx_knowledge_id (knowledge_id),
    FOREIGN KEY (mindmap_id) REFERENCES mindmaps(id) ON DELETE CASCADE,
    FOREIGN KEY (knowledge_id) REFERENCES knowledge_points(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='思维导图与知识点关联表'; 