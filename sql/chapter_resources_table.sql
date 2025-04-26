-- 创建章节资源表
CREATE TABLE `chapter_resources` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chapter_id` INT NOT NULL,
  `resource_type` ENUM('document', 'ppt', 'video', 'exercise', 'quiz', 'reference') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NULL,
  `url` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `is_downloadable` TINYINT(1) NULL DEFAULT 1,
  `sort_order` INT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_chapter_id` (`chapter_id` ASC),
  INDEX `idx_resource_type` (`resource_type` ASC),
  CONSTRAINT `fk_resources_chapter_id`
    FOREIGN KEY (`chapter_id`)
    REFERENCES `chapters` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 