-- 创建章节表
CREATE TABLE `chapters` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chapter_number` INT NOT NULL,
  `title_zh` VARCHAR(100) NOT NULL,
  `title_en` VARCHAR(100) NOT NULL,
  `description_zh` TEXT NULL,
  `description_en` TEXT NULL,
  `cover_image` VARCHAR(255) NULL,
  `ppt_file` VARCHAR(255) NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `order_index` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 