-- 创建章节内容表
CREATE TABLE `chapter_contents` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chapter_id` INT NOT NULL,
  `content_type` ENUM('text', 'image', 'video', 'audio', 'link') NOT NULL,
  `title` VARCHAR(255) NULL,
  `content` TEXT NULL,
  `media_url` VARCHAR(255) NULL,
  `sort_order` INT NULL DEFAULT 0,
  `is_required` TINYINT(1) NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_chapter_id` (`chapter_id` ASC),
  INDEX `idx_sort_order` (`sort_order` ASC),
  CONSTRAINT `fk_contents_chapter_id`
    FOREIGN KEY (`chapter_id`)
    REFERENCES `chapters` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 