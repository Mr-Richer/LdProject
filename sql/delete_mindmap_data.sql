-- 解决思维导图节点自引用外键约束问题的数据删除脚本

-- 1. 临时禁用外键约束检查
SET FOREIGN_KEY_CHECKS = 0;

-- 2. 删除特定思维导图的所有节点数据
-- 请替换 mindmap_id_to_delete 为你要删除的思维导图ID
DELETE FROM mindmap_nodes WHERE mindmap_id = mindmap_id_to_delete;

-- 3. 删除思维导图主表中的对应记录
DELETE FROM mindmaps WHERE id = mindmap_id_to_delete;

-- 4. 删除与知识点的关联记录
DELETE FROM mindmap_knowledge_relations WHERE mindmap_id = mindmap_id_to_delete;

-- 5. 重新启用外键约束检查
SET FOREIGN_KEY_CHECKS = 1;

-- 如果需要清空整个表（谨慎使用）
-- TRUNCATE TABLE mindmap_nodes;
-- TRUNCATE TABLE mindmaps;
-- TRUNCATE TABLE mindmap_knowledge_relations;

-- 如果需要删除特定章节的所有思维导图（假设有chapter_id字段）
/*
SET FOREIGN_KEY_CHECKS = 0;
DELETE mn FROM mindmap_nodes mn 
INNER JOIN mindmaps m ON mn.mindmap_id = m.id 
WHERE m.chapter_id = chapter_id_to_delete;

DELETE FROM mindmaps WHERE chapter_id = chapter_id_to_delete;
SET FOREIGN_KEY_CHECKS = 1;
*/ 