-- 思政案例表
CREATE TABLE IF NOT EXISTS `ideology_cases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '案例标题',
  `content` text NOT NULL COMMENT '案例内容',
  `chapter_id` int(11) NOT NULL COMMENT '关联章节ID',
  `user_id` int(11) NOT NULL COMMENT '创建用户ID',
  `case_type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '案例类型: 1=故事型案例, 2=辩论型案例, 3=历史事件型案例, 4=价值观分析型案例',
  `case_length` tinyint(4) NOT NULL DEFAULT '2' COMMENT '案例长度: 1=简短, 2=中等, 3=详细',
  `is_ai_generated` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否AI生成: 0=否, 1=是',
  `theme` varchar(255) DEFAULT NULL COMMENT '案例主题',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_chapter_id` (`chapter_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='思政案例表';

-- 思政案例资源表
CREATE TABLE IF NOT EXISTS `ideology_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_id` int(11) NOT NULL COMMENT '关联案例ID',
  `resource_type` tinyint(4) NOT NULL COMMENT '资源类型: 1=图片, 2=视频, 3=链接',
  `resource_url` varchar(255) NOT NULL COMMENT '资源URL',
  `resource_name` varchar(255) DEFAULT NULL COMMENT '资源名称',
  `file_size` int(11) DEFAULT NULL COMMENT '文件大小(KB)',
  `file_extension` varchar(10) DEFAULT NULL COMMENT '文件扩展名',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_case_id` (`case_id`),
  CONSTRAINT `fk_resource_case` FOREIGN KEY (`case_id`) REFERENCES `ideology_cases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='思政案例资源表';

-- 思政案例标签表
CREATE TABLE IF NOT EXISTS `ideology_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(50) NOT NULL COMMENT '标签名称',
  `tag_type` tinyint(4) DEFAULT '1' COMMENT '标签类型: 1=主题, 2=内容, 3=教学目标',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_tag_name` (`tag_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='思政案例标签表';

-- 案例标签关联表
CREATE TABLE IF NOT EXISTS `ideology_case_tags` (
  `case_id` int(11) NOT NULL COMMENT '案例ID',
  `tag_id` int(11) NOT NULL COMMENT '标签ID',
  PRIMARY KEY (`case_id`,`tag_id`),
  KEY `idx_tag_id` (`tag_id`),
  CONSTRAINT `fk_casetags_case` FOREIGN KEY (`case_id`) REFERENCES `ideology_cases` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_casetags_tag` FOREIGN KEY (`tag_id`) REFERENCES `ideology_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='案例-标签关联表';

-- 讨论题表
CREATE TABLE IF NOT EXISTS `ideology_discussions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chapter_id` int(11) NOT NULL COMMENT '关联章节ID',
  `user_id` int(11) NOT NULL COMMENT '创建用户ID',
  `discussion_theme` varchar(255) NOT NULL COMMENT '讨论主题',
  `content` text NOT NULL COMMENT '讨论题内容',
  `discussion_type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '讨论类型: 1=文化基因, 2=文化传承, 3=文化创新, 4=当代中国',
  `is_ai_generated` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否AI生成: 0=否, 1=是',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_chapter_id` (`chapter_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='思政讨论题表'; 