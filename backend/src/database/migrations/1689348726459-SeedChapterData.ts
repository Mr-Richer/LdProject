import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedChapterData1689348726459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 插入章节数据
    await queryRunner.query(`
      INSERT INTO \`chapters\` (\`chapter_number\`, \`title_zh\`, \`title_en\`, \`description_zh\`, \`description_en\`, \`cover_image\`, \`ppt_file\`, \`is_published\`, \`order_index\`) VALUES
      (1, '中国文化概述', 'Overview of Chinese Culture', 
      '本章介绍中国文化的基本概念、发展历程及其在世界文化中的地位和影响。通过对中国文化特点的概述，帮助学生建立对中国文化的整体认识。', 
      'This chapter introduces the basic concepts of Chinese culture, its development, and its position and influence in world culture.', 
      '../picture/banner.jpg', '../picture/ppt/1/', 1, 10),
      
      (2, '中国哲学与思想', 'Chinese Philosophy and Thought', 
      '本章探讨中国传统哲学思想体系，包括儒家、道家、法家、墨家等各派学说的核心理念及其对中国社会的深远影响。', 
      'This chapter explores the traditional Chinese philosophical systems including Confucianism, Taoism, Legalism and Mohism.', 
      '../picture/b1.jpg', '../picture/ppt/2/', 1, 20),
      
      (3, '中国文学艺术', 'Chinese Literature and Art', 
      '本章介绍中国古典文学与现代文学的发展，包括诗歌、散文、小说、戏剧等文学形式，以及其艺术特色和文化内涵。', 
      'This chapter introduces the development of classical and modern Chinese literature and various literary forms.', 
      '../picture/b2.jpg', '../picture/ppt/3/', 1, 30);
    `);
    
    // 插入章节内容数据
    await queryRunner.query(`
      INSERT INTO \`chapter_contents\` (\`chapter_id\`, \`content_type\`, \`title\`, \`content\`, \`sort_order\`) VALUES
      (1, 'text', '中国文化的定义', '中国文化是世界上历史最悠久的文化之一，有着五千多年的文明历史。', 1),
      (1, 'text', '中国文化的特点', '中国文化的主要特点包括：重视家庭、尊老爱幼、追求和谐、重视教育等。', 2),
      (1, 'image', '中国地图', '../picture/china_map.jpg', 3),
      (2, 'text', '儒家思想简介', '儒家思想是由孔子创立的一种哲学思想，强调仁义礼智信和家国情怀。', 1),
      (2, 'text', '道家思想简介', '道家思想由老子创立，主张无为而治，顺应自然。', 2);
    `);
    
    // 插入章节资源数据
    await queryRunner.query(`
      INSERT INTO \`chapter_resources\` (\`chapter_id\`, \`resource_type\`, \`title\`, \`file_path\`, \`description\`, \`sort_order\`) VALUES
      (1, 'document', '中国文化导论', '../resources/intro_to_chinese_culture.pdf', '中国文化基本概念导读文档', 1),
      (1, 'ppt', '中国文化概述课件', '../picture/ppt/1/overview.ppt', '第一章课件', 2),
      (2, 'video', '儒家思想讲解', '../resources/videos/confucianism.mp4', '儒家思想核心理念视频讲解', 1),
      (2, 'quiz', '中国哲学知识测试', null, '关于中国哲学的小测验', 2);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`chapter_resources\``);
    await queryRunner.query(`DELETE FROM \`chapter_contents\``);
    await queryRunner.query(`DELETE FROM \`chapters\``);
  }
} 