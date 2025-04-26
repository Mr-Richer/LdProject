import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChapterTables1689348726458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建章节表
    await queryRunner.query(`
      CREATE TABLE \`chapters\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`chapter_number\` INT NOT NULL,
        \`title_zh\` VARCHAR(100) NOT NULL,
        \`title_en\` VARCHAR(100) NOT NULL,
        \`description_zh\` TEXT NULL,
        \`description_en\` TEXT NULL,
        \`cover_image\` VARCHAR(255) NULL,
        \`ppt_file\` VARCHAR(255) NULL,
        \`is_published\` TINYINT(1) DEFAULT 1,
        \`order_index\` INT DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    // 创建章节内容表
    await queryRunner.query(`
      CREATE TABLE \`chapter_contents\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`chapter_id\` INT NOT NULL,
        \`content_type\` ENUM('text', 'image', 'video', 'audio', 'link') NOT NULL,
        \`title\` VARCHAR(255) NULL,
        \`content\` TEXT NULL,
        \`media_url\` VARCHAR(255) NULL,
        \`sort_order\` INT NULL DEFAULT 0,
        \`is_required\` TINYINT(1) NULL DEFAULT 0,
        \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_chapter_id\` (\`chapter_id\` ASC),
        INDEX \`idx_sort_order\` (\`sort_order\` ASC),
        CONSTRAINT \`fk_contents_chapter_id\`
          FOREIGN KEY (\`chapter_id\`)
          REFERENCES \`chapters\` (\`id\`)
          ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    // 创建章节资源表
    await queryRunner.query(`
      CREATE TABLE \`chapter_resources\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`chapter_id\` INT NOT NULL,
        \`resource_type\` ENUM('document', 'ppt', 'video', 'exercise', 'quiz', 'reference') NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`file_path\` VARCHAR(255) NULL,
        \`url\` VARCHAR(255) NULL,
        \`description\` TEXT NULL,
        \`is_downloadable\` TINYINT(1) NULL DEFAULT 1,
        \`sort_order\` INT NULL DEFAULT 0,
        \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_chapter_id\` (\`chapter_id\` ASC),
        INDEX \`idx_resource_type\` (\`resource_type\` ASC),
        CONSTRAINT \`fk_resources_chapter_id\`
          FOREIGN KEY (\`chapter_id\`)
          REFERENCES \`chapters\` (\`id\`)
          ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`chapter_resources\``);
    await queryRunner.query(`DROP TABLE \`chapter_contents\``);
    await queryRunner.query(`DROP TABLE \`chapters\``);
  }
} 