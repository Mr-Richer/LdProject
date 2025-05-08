# 思维导图数据库设计文档

## 概述

本文档详细描述了中国文化人工智能课程平台中思维导图功能的数据库设计。数据库设计旨在支持思维导图的创建、存储、检索和管理等核心功能。

## 数据库基本信息

- **数据库类型**: PostgreSQL
- **字符集**: UTF-8
- **排序规则**: Unicode

## 表结构设计

### 1. mindmap 表（思维导图）

用于存储思维导图的基础信息。

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 思维导图唯一标识符 |
| title | VARCHAR(255) | NOT NULL | 思维导图标题 |
| central_topic | VARCHAR(255) | NOT NULL | 中心主题名称 |
| description | TEXT | | 思维导图描述 |
| max_levels | INTEGER | DEFAULT 4 | 最大层级数 |
| style | VARCHAR(50) | DEFAULT 'standard' | 样式类型 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 最后更新时间 |
| user_id | INTEGER | FOREIGN KEY | 创建者ID，关联users表 |

```sql
CREATE TABLE mindmap (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    central_topic VARCHAR(255) NOT NULL,
    description TEXT,
    max_levels INTEGER DEFAULT 4,
    style VARCHAR(50) DEFAULT 'standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);
```

### 2. mindmap_node 表（思维导图节点）

存储思维导图的所有节点，包括中心主题节点和分支节点。

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 节点唯一标识符 |
| mindmap_id | INTEGER | FOREIGN KEY, NOT NULL | 所属思维导图ID |
| name | VARCHAR(255) | NOT NULL | 节点名称 |
| value | TEXT | | 节点值/内容 |
| level | INTEGER | NOT NULL | 节点层级，0表示中心主题 |
| position | INTEGER | NOT NULL | 同级节点的位置顺序 |
| parent_id | INTEGER | FOREIGN KEY | 父节点ID，中心主题为NULL |
| color | VARCHAR(50) | | 节点颜色 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 最后更新时间 |
| style | JSONB | | 节点额外样式属性 |

```sql
CREATE TABLE mindmap_node (
    id SERIAL PRIMARY KEY,
    mindmap_id INTEGER NOT NULL REFERENCES mindmap(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    value TEXT,
    level INTEGER NOT NULL,
    position INTEGER NOT NULL,
    parent_id INTEGER REFERENCES mindmap_node(id) ON DELETE CASCADE,
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    style JSONB
);
```

### 3. knowledge_point 表（知识点）

存储可供选择和引用的知识点数据。

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 知识点唯一标识符 |
| title | VARCHAR(255) | NOT NULL | 知识点标题 |
| category | VARCHAR(100) | NOT NULL | 知识点分类 |
| description | TEXT | | 知识点描述 |
| keywords | TEXT | | 相关关键词，逗号分隔 |
| content | TEXT | | 知识点详细内容 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 最后更新时间 |

```sql
CREATE TABLE knowledge_point (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    keywords TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. mindmap_knowledge 表（思维导图-知识点关联）

记录思维导图与知识点之间的多对多关系。

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 关联记录唯一标识符 |
| mindmap_id | INTEGER | FOREIGN KEY, NOT NULL | 思维导图ID |
| knowledge_point_id | INTEGER | FOREIGN KEY, NOT NULL | 知识点ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

```sql
CREATE TABLE mindmap_knowledge (
    id SERIAL PRIMARY KEY,
    mindmap_id INTEGER NOT NULL REFERENCES mindmap(id) ON DELETE CASCADE,
    knowledge_point_id INTEGER NOT NULL REFERENCES knowledge_point(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mindmap_id, knowledge_point_id)
);
```

### 5. ai_generation_log 表（AI生成记录）

记录AI生成思维导图的请求和响应信息。

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | SERIAL | PRIMARY KEY | 记录唯一标识符 |
| mindmap_id | INTEGER | FOREIGN KEY | 关联的思维导图ID |
| prompt | TEXT | NOT NULL | 发送给AI的提示文本 |
| response | JSONB | | AI返回的原始响应 |
| status | VARCHAR(50) | NOT NULL | 状态：success, failed, pending |
| model | VARCHAR(100) | | 使用的AI模型名称 |
| tokens_used | INTEGER | | 消耗的令牌数 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| completed_at | TIMESTAMP | | 完成时间 |
| user_id | INTEGER | FOREIGN KEY | 用户ID |

```sql
CREATE TABLE ai_generation_log (
    id SERIAL PRIMARY KEY,
    mindmap_id INTEGER REFERENCES mindmap(id) ON DELETE SET NULL,
    prompt TEXT NOT NULL,
    response JSONB,
    status VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    tokens_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);
```

## 索引设计

为提高查询性能，建立以下索引：

```sql
-- 思维导图表索引
CREATE INDEX idx_mindmap_user_id ON mindmap(user_id);
CREATE INDEX idx_mindmap_created_at ON mindmap(created_at);

-- 思维导图节点表索引
CREATE INDEX idx_mindmap_node_mindmap_id ON mindmap_node(mindmap_id);
CREATE INDEX idx_mindmap_node_parent_id ON mindmap_node(parent_id);
CREATE INDEX idx_mindmap_node_level ON mindmap_node(level);

-- 知识点表索引
CREATE INDEX idx_knowledge_point_category ON knowledge_point(category);
CREATE INDEX idx_knowledge_point_keywords ON knowledge_point USING GIN(to_tsvector('zhcfg', keywords));

-- AI生成记录表索引
CREATE INDEX idx_ai_generation_log_mindmap_id ON ai_generation_log(mindmap_id);
CREATE INDEX idx_ai_generation_log_user_id ON ai_generation_log(user_id);
CREATE INDEX idx_ai_generation_log_status ON ai_generation_log(status);
CREATE INDEX idx_ai_generation_log_created_at ON ai_generation_log(created_at);
```

## 视图定义

### 1. mindmap_with_stats 视图

包含思维导图及其节点数量、层级等统计信息的视图。

```sql
CREATE VIEW mindmap_with_stats AS
SELECT 
    m.id,
    m.title,
    m.central_topic,
    m.created_at,
    m.user_id,
    COUNT(DISTINCT n.id) AS node_count,
    MAX(n.level) AS max_level,
    COUNT(DISTINCT mk.knowledge_point_id) AS knowledge_points_count
FROM 
    mindmap m
LEFT JOIN 
    mindmap_node n ON m.id = n.mindmap_id
LEFT JOIN 
    mindmap_knowledge mk ON m.id = mk.mindmap_id
GROUP BY 
    m.id;
```

### 2. knowledge_mindmap_usage 视图

展示知识点在思维导图中的使用情况。

```sql
CREATE VIEW knowledge_mindmap_usage AS
SELECT 
    kp.id AS knowledge_point_id,
    kp.title AS knowledge_point_title,
    kp.category,
    COUNT(DISTINCT mk.mindmap_id) AS used_in_mindmaps,
    ARRAY_AGG(DISTINCT m.title) AS mindmap_titles
FROM 
    knowledge_point kp
LEFT JOIN 
    mindmap_knowledge mk ON kp.id = mk.knowledge_point_id
LEFT JOIN 
    mindmap m ON mk.mindmap_id = m.id
GROUP BY 
    kp.id, kp.title, kp.category;
```

## 触发器

### 1. 更新时间戳触发器

自动更新 updated_at 字段。

```sql
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mindmap_timestamp
BEFORE UPDATE ON mindmap
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_mindmap_node_timestamp
BEFORE UPDATE ON mindmap_node
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_knowledge_point_timestamp
BEFORE UPDATE ON knowledge_point
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
```

### 2. 删除思维导图节点清理触发器

删除节点时处理子节点。

```sql
CREATE OR REPLACE FUNCTION clean_orphaned_nodes() RETURNS TRIGGER AS $$
BEGIN
    -- 将所有直接子节点关联到被删除节点的父节点
    UPDATE mindmap_node
    SET parent_id = OLD.parent_id
    WHERE parent_id = OLD.id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mindmap_node_before_delete
BEFORE DELETE ON mindmap_node
FOR EACH ROW EXECUTE PROCEDURE clean_orphaned_nodes();
```

## 存储过程/函数

### 1. 获取完整思维导图

递归获取思维导图的完整节点树。

```sql
CREATE OR REPLACE FUNCTION get_complete_mindmap(p_mindmap_id INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    WITH RECURSIVE node_tree AS (
        -- 起始节点（中心节点）
        SELECT 
            n.id, n.name, n.value, n.level, n.position, n.parent_id, n.color, n.style
        FROM 
            mindmap_node n
        WHERE 
            n.mindmap_id = p_mindmap_id AND n.level = 0
        
        UNION ALL
        
        -- 递归获取子节点
        SELECT 
            c.id, c.name, c.value, c.level, c.position, c.parent_id, c.color, c.style
        FROM 
            mindmap_node c
        JOIN 
            node_tree p ON c.parent_id = p.id
        WHERE 
            c.mindmap_id = p_mindmap_id
    )
    SELECT 
        json_build_object(
            'id', m.id,
            'title', m.title,
            'central_topic', m.central_topic,
            'tree', to_json(
                WITH root_nodes AS (
                    SELECT * FROM node_tree WHERE level = 0
                )
                SELECT 
                    json_build_object(
                        'id', r.id,
                        'name', r.name,
                        'value', r.value,
                        'children', COALESCE(
                            (SELECT 
                                json_agg(
                                    build_child_tree(c.id, p_mindmap_id)
                                )
                             FROM node_tree c
                             WHERE c.parent_id = r.id
                             ORDER BY c.position
                            ), '[]'::json
                        )
                    )
                FROM root_nodes r
            )
        ) INTO result
    FROM mindmap m
    WHERE m.id = p_mindmap_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 辅助递归函数构建子树
CREATE OR REPLACE FUNCTION build_child_tree(p_node_id INTEGER, p_mindmap_id INTEGER)
RETURNS JSON AS $$
DECLARE
    node_result JSON;
BEGIN
    SELECT 
        json_build_object(
            'id', n.id,
            'name', n.name,
            'value', n.value,
            'level', n.level,
            'color', n.color,
            'style', n.style,
            'children', COALESCE(
                (SELECT 
                    json_agg(
                        build_child_tree(c.id, p_mindmap_id)
                    )
                 FROM mindmap_node c
                 WHERE c.parent_id = n.id AND c.mindmap_id = p_mindmap_id
                 ORDER BY c.position
                ), '[]'::json
            )
        ) INTO node_result
    FROM mindmap_node n
    WHERE n.id = p_node_id AND n.mindmap_id = p_mindmap_id;
    
    RETURN node_result;
END;
$$ LANGUAGE plpgsql;
```

### 2. 克隆思维导图

创建思维导图及其节点的完整副本。

```sql
CREATE OR REPLACE FUNCTION clone_mindmap(
    p_source_mindmap_id INTEGER, 
    p_new_title VARCHAR(255), 
    p_user_id INTEGER
) RETURNS INTEGER AS $$
DECLARE
    new_mindmap_id INTEGER;
    mapping HSTORE := ''::HSTORE;
BEGIN
    -- 创建新的思维导图
    INSERT INTO mindmap (
        title, 
        central_topic, 
        description, 
        max_levels, 
        style, 
        user_id
    )
    SELECT 
        p_new_title, 
        central_topic, 
        description, 
        max_levels, 
        style, 
        p_user_id
    FROM 
        mindmap
    WHERE 
        id = p_source_mindmap_id
    RETURNING id INTO new_mindmap_id;
    
    -- 复制中心节点
    WITH center_node AS (
        SELECT * FROM mindmap_node 
        WHERE mindmap_id = p_source_mindmap_id AND level = 0
    ),
    inserted_center AS (
        INSERT INTO mindmap_node (
            mindmap_id, 
            name, 
            value, 
            level, 
            position, 
            parent_id, 
            color, 
            style
        )
        SELECT 
            new_mindmap_id,
            name,
            value,
            level,
            position,
            NULL,
            color,
            style
        FROM 
            center_node
        RETURNING id
    )
    SELECT 'original_' || center_node.id::text || '=>' || inserted_center.id::text
    INTO mapping
    FROM center_node, inserted_center;
    
    -- 递归复制其他节点
    FOR i IN 1..10 LOOP -- 最多支持10层
        WITH source_nodes AS (
            SELECT * FROM mindmap_node 
            WHERE mindmap_id = p_source_mindmap_id AND level = i
        ),
        inserted_nodes AS (
            INSERT INTO mindmap_node (
                mindmap_id, 
                name, 
                value, 
                level, 
                position, 
                parent_id, 
                color, 
                style
            )
            SELECT 
                new_mindmap_id,
                n.name,
                n.value,
                n.level,
                n.position,
                (mapping -> ('original_' || n.parent_id::text))::integer,
                n.color,
                n.style
            FROM 
                source_nodes n
            WHERE 
                ('original_' || n.parent_id::text) IN (SELECT skeys(mapping))
            RETURNING id, 'original_' || n.id::text AS original_id
        )
        SELECT mapping || hstore(array_agg(original_id), array_agg(id::text))
        INTO mapping
        FROM inserted_nodes;
        
        EXIT WHEN NOT FOUND;
    END LOOP;
    
    -- 复制知识点关联
    INSERT INTO mindmap_knowledge (
        mindmap_id,
        knowledge_point_id
    )
    SELECT 
        new_mindmap_id,
        knowledge_point_id
    FROM 
        mindmap_knowledge
    WHERE 
        mindmap_id = p_source_mindmap_id;
    
    RETURN new_mindmap_id;
END;
$$ LANGUAGE plpgsql;
```

## 示例查询

### 1. 获取用户的所有思维导图

```sql
SELECT id, title, central_topic, created_at, style
FROM mindmap
WHERE user_id = ?
ORDER BY created_at DESC;
```

### 2. 获取特定思维导图的中心主题和一级节点

```sql
SELECT 
    p.id AS parent_id, 
    p.name AS parent_name,
    c.id AS child_id,
    c.name AS child_name,
    c.level,
    c.position
FROM 
    mindmap_node p
LEFT JOIN 
    mindmap_node c ON p.id = c.parent_id
WHERE 
    p.mindmap_id = ? AND p.level = 0
ORDER BY 
    c.position;
```

### 3. 按类别统计知识点数量

```sql
SELECT 
    category, 
    COUNT(*) AS count
FROM 
    knowledge_point
GROUP BY 
    category
ORDER BY 
    count DESC;
```

### 4. 获取特定思维导图使用的所有知识点

```sql
SELECT 
    kp.id,
    kp.title,
    kp.category,
    kp.description
FROM 
    knowledge_point kp
JOIN 
    mindmap_knowledge mk ON kp.id = mk.knowledge_point_id
WHERE 
    mk.mindmap_id = ?
ORDER BY 
    kp.category, kp.title;
```

## 数据库权限管理

```sql
-- 创建应用用户角色
CREATE ROLE mindmap_app WITH LOGIN PASSWORD 'your_password';

-- 授予基本权限
GRANT CONNECT ON DATABASE mindmap_db TO mindmap_app;

-- 读取权限
GRANT SELECT ON ALL TABLES IN SCHEMA public TO mindmap_app;

-- 写入权限
GRANT INSERT, UPDATE, DELETE ON mindmap, mindmap_node, mindmap_knowledge, ai_generation_log TO mindmap_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO mindmap_app;

-- 只读用户
CREATE ROLE mindmap_readonly WITH LOGIN PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE mindmap_db TO mindmap_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO mindmap_readonly;
```

## 注意事项

1. 删除思维导图时，相关节点通过 CASCADE 约束自动删除
2. 一个思维导图可以关联多个知识点，反之亦然
3. mindmap_node 表使用 parent_id 实现树状结构
4. 核心表都有 created_at 和 updated_at 字段记录时间
5. 性能考量：可能需要根据数据量调整索引策略
6. 安全考量：敏感操作需要通过应用层权限管理控制
7. 建议定期备份数据库，特别是知识点表的内容 