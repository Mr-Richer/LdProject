-- 修改mindmaps表，更新expansion_type字段的注释以支持6种拓展类型
ALTER TABLE mindmaps 
MODIFY COLUMN expansion_type TINYINT DEFAULT 1 COMMENT '拓展类型: 1=文化渊源, 2=文化发展, 3=文化创新, 4=区域文化, 5=跨学科知识, 6=中西文化对比';

-- 如果数据库中尚未添加expansion_type字段，请使用以下语句添加
-- ALTER TABLE mindmaps 
-- ADD COLUMN expansion_type TINYINT DEFAULT 1 COMMENT '拓展类型: 1=文化渊源, 2=文化发展, 3=文化创新, 4=区域文化, 5=跨学科知识, 6=中西文化对比',
-- ADD INDEX idx_expansion_type (expansion_type);

-- 使用具体数据库名称的版本（请替换db_name为您的实际数据库名）
-- ALTER TABLE db_name.mindmaps 
-- MODIFY COLUMN expansion_type TINYINT DEFAULT 1 COMMENT '拓展类型: 1=文化渊源, 2=文化发展, 3=文化创新, 4=区域文化, 5=跨学科知识, 6=中西文化对比'; 