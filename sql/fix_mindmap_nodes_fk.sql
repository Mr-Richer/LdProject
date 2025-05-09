-- 修复mindmap_nodes表的自引用外键约束

-- 1. 找出当前外键约束的名称
-- 请先执行以下查询，找出约束名称：
/*
SELECT CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'mindmap_nodes' 
AND COLUMN_NAME = 'parent_id' 
AND REFERENCED_TABLE_NAME = 'mindmap_nodes'
AND REFERENCED_COLUMN_NAME = 'id'
AND CONSTRAINT_SCHEMA = 'db_test';
*/

-- 根据查询结果替换下面的FK_CONSTRAINT_NAME

-- 2. 删除现有约束
ALTER TABLE mindmap_nodes 
DROP FOREIGN KEY FK_361a2d3ff3ba62761a108f4e4c1;

-- 3. 重新添加带有ON DELETE CASCADE的约束
ALTER TABLE mindmap_nodes
ADD CONSTRAINT FK_mindmap_nodes_parent_id
FOREIGN KEY (parent_id) REFERENCES mindmap_nodes(id)
ON DELETE CASCADE;

-- 完成后，mindmap_nodes表中的自引用外键约束会自动级联删除子节点 