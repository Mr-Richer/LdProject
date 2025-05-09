-- 添加思政讨论题表
CREATE TABLE IF NOT EXISTS ideology_topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic_content TEXT NOT NULL COMMENT '讨论题内容',
  theme VARCHAR(100) NOT NULL COMMENT '讨论主题',
  chapter_id INT NOT NULL COMMENT '关联章节ID',
  user_id INT NOT NULL COMMENT '创建用户ID',
  topic_type VARCHAR(20) NOT NULL DEFAULT 'basic' COMMENT '讨论题类型: basic=基础, critical=批判性, creative=创造性, applied=应用型',
  is_ai_generated TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否由AI生成',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_chapter (chapter_id),
  INDEX idx_user (user_id),
  INDEX idx_theme (theme)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程思政讨论题';

-- 创建执行记录
INSERT INTO db_migrations (migration_name, executed_at) 
VALUES ('add_ideology_topics_table', NOW())
ON DUPLICATE KEY UPDATE executed_at = NOW(); 