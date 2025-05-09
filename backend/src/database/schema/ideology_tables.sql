-- 思政案例表
CREATE TABLE IF NOT EXISTS ideology_cases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL COMMENT '案例标题',
  content TEXT NOT NULL COMMENT '案例内容',
  theme VARCHAR(100) NOT NULL COMMENT '案例主题',
  chapter_id INT NOT NULL COMMENT '关联章节ID',
  user_id INT NOT NULL COMMENT '创建用户ID',
  case_type TINYINT NOT NULL DEFAULT 1 COMMENT '案例类型: 1=故事型, 2=辩论型, 3=历史型, 4=价值观分析型',
  case_length TINYINT NOT NULL DEFAULT 2 COMMENT '案例长度: 1=简短, 2=中等, 3=详细',
  is_ai_generated TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否由AI生成',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_chapter (chapter_id),
  INDEX idx_user (user_id),
  INDEX idx_theme (theme)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程思政案例';

-- 思政案例资源表
CREATE TABLE IF NOT EXISTS ideology_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL COMMENT '关联案例ID',
  resource_name VARCHAR(255) COMMENT '资源名称',
  resource_url VARCHAR(500) NOT NULL COMMENT '资源URL',
  resource_type TINYINT NOT NULL DEFAULT 1 COMMENT '资源类型: 1=图片, 2=视频, 3=链接',
  file_size INT COMMENT '文件大小(字节)',
  file_ext VARCHAR(20) COMMENT '文件扩展名',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_case (case_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程思政案例资源';

-- 思政讨论题表
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