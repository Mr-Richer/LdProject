# 中国文化人工智能课程平台数据库文档

## 目录

- [1. 用户表 (users)](#1-用户表-users)
- [2. 章节表 (chapters)](#2-章节表-chapters)
- [3. 章节部分表 (sections)](#3-章节部分表-sections)
- [4. 课件表 (courseware)](#4-课件表-courseware)
- [5. 课件幻灯片表 (slides)](#5-课件幻灯片表-slides)
- [6. 测验表 (quizzes)](#6-测验表-quizzes)
- [7. 测验题目表 (quiz_questions)](#7-测验题目表-quiz_questions)
- [8. 题目选项表 (question_options)](#8-题目选项表-question_options)
- [9. 课堂表 (classrooms)](#9-课堂表-classrooms)
- [10. 通知表 (notifications)](#10-通知表-notifications)
- [11. 学生作业表 (student_works)](#11-学生作业表-student_works)
- [12. 知识图谱节点表 (knowledge_nodes)](#12-知识图谱节点表-knowledge_nodes)
- [13. 知识图谱连接表 (knowledge_links)](#13-知识图谱连接表-knowledge_links)
- [常用查询示例](#常用查询示例)

## 1. 用户表 (users)

存储系统用户信息，包括教师和学生。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 用户ID | 主键 |
| username | VARCHAR(50) | 用户名 | 非空，唯一 |
| password | VARCHAR(255) | 密码（加密存储） | 非空 |
| name | VARCHAR(50) | 真实姓名 | 非空 |
| role | VARCHAR(20) | 角色（教师/学生） | 非空 |
| department | VARCHAR(100) | 所属部门 | 可空 |
| avatar | VARCHAR(255) | 头像URL | 可空 |
| created_at | DATETIME | 创建时间 | 默认当前时间 |
| updated_at | DATETIME | 更新时间 | 自动更新 |

```sql
SELECT * FROM users WHERE role = '教师';
```

## 2. 章节表 (chapters)

存储课程章节基本信息。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 章节ID | 主键 |
| title | VARCHAR(100) | 章节标题 | 非空 |
| description | TEXT | 章节描述 | 可空 |
| cover_image | VARCHAR(255) | 封面图片URL | 可空 |
| duration | INT | 学习时长（分钟） | 可空 |
| created_by | VARCHAR(36) | 创建者ID | 外键users(id) |
| created_at | DATETIME | 创建时间 | 默认当前时间 |
| updated_at | DATETIME | 更新时间 | 自动更新 |

```sql
SELECT id, title, cover_image FROM chapters ORDER BY created_at DESC;
```

## 3. 章节部分表 (sections)

存储章节下的各个部分内容。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 部分ID | 主键 |
| chapter_id | VARCHAR(36) | 所属章节ID | 外键chapters(id) |
| title | VARCHAR(100) | 部分标题 | 非空 |
| type | ENUM | 类型(courseware/quiz/knowledge/ideology/practice) | 非空 |
| sort_order | INT | 排序顺序 | 非空 |
| created_at | DATETIME | 创建时间 | 默认当前时间 |
| updated_at | DATETIME | 更新时间 | 自动更新 |

```sql
SELECT * FROM sections WHERE chapter_id = 'chapter_id' ORDER BY sort_order;
```

## 4. 课件表 (courseware)

存储课件相关信息。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 课件ID | 主键 |
| section_id | VARCHAR(36) | 所属部分ID | 外键sections(id) |
| title | VARCHAR(100) | 课件标题 | 非空 |
| created_by | VARCHAR(36) | 创建者ID | 外键users(id) |
| created_at | DATETIME | 创建时间 | 默认当前时间 |
| updated_at | DATETIME | 更新时间 | 自动更新 |

```sql
SELECT * FROM courseware WHERE section_id = 'section_id';
```

## 5. 课件幻灯片表 (slides)

存储课件中的幻灯片内容。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 幻灯片ID | 主键 |
| courseware_id | VARCHAR(36) | 所属课件ID | 外键courseware(id) |
| title | VARCHAR(100) | 幻灯片标题 | 非空 |
| content | TEXT | 幻灯片内容 | 可空 |
| image_url | VARCHAR(255) | 图片URL | 可空 |
| type | ENUM | 类型(title/content/image/two-column) | 非空 |
| sort_order | INT | 排序顺序 | 非空 |

```sql
SELECT * FROM slides WHERE courseware_id = 'courseware_id' ORDER BY sort_order;
```

## 6. 测验表 (quizzes)

存储测验基本信息。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 测验ID | 主键 |
| section_id | VARCHAR(36) | 所属部分ID | 外键sections(id) |
| title | VARCHAR(100) | 测验标题 | 非空 |
| created_by | VARCHAR(36) | 创建者ID | 外键users(id) |
| created_at | DATETIME | 创建时间 | 默认当前时间 |

```sql
SELECT * FROM quizzes WHERE section_id = 'section_id';
```

## 7. 测验题目表 (quiz_questions)

存储测验中的题目信息。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 题目ID | 主键 |
| quiz_id | VARCHAR(36) | 所属测验ID | 外键quizzes(id) |
| type | ENUM | 题目类型(single/multiple/short/discussion) | 非空 |
| content | TEXT | 题目内容 | 非空 |
| answer | TEXT | 参考答案 | 可空 |
| explanation | TEXT | 解析说明 | 可空 |
| sort_order | INT | 排序顺序 | 非空 |

```sql
SELECT * FROM quiz_questions WHERE quiz_id = 'quiz_id' ORDER BY sort_order;
```

## 8. 题目选项表 (question_options)

存储选择题的选项信息。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 选项ID | 主键 |
| question_id | VARCHAR(36) | 所属题目ID | 外键quiz_questions(id) |
| content | TEXT | 选项内容 | 非空 |
| is_correct | BOOLEAN | 是否正确选项 | 非空 |
| sort_order | INT | 排序顺序 | 非空 |

```sql
SELECT * FROM question_options WHERE question_id = 'question_id' ORDER BY sort_order;
```

## 9. 课堂表 (classrooms)

存储课堂会话信息。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 课堂ID | 主键 |
| chapter_id | VARCHAR(36) | 所属章节ID | 外键chapters(id) |
| courseware_id | VARCHAR(36) | 所用课件ID | 外键courseware(id) |
| title | VARCHAR(100) | 课堂标题 | 非空 |
| start_time | DATETIME | 开始时间 | 非空 |
| end_time | DATETIME | 结束时间 | 可空 |
| status | ENUM | 状态(active/ended) | 非空 |
| created_by | VARCHAR(36) | 创建者ID | 外键users(id) |

```sql
SELECT * FROM classrooms WHERE created_by = 'teacher_id' AND status = 'active';
```

## 10. 通知表 (notifications)

存储系统通知信息。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 通知ID | 主键 |
| user_id | VARCHAR(36) | 接收用户ID | 外键users(id) |
| type | ENUM | 类型(system/assignment/reminder/feedback) | 非空 |
| title | VARCHAR(100) | 通知标题 | 非空 |
| content | TEXT | 通知内容 | 非空 |
| read | BOOLEAN | 是否已读 | 默认false |
| timestamp | DATETIME | 发送时间 | 默认当前时间 |

```sql
SELECT * FROM notifications WHERE user_id = 'user_id' AND read = 0 ORDER BY timestamp DESC;
```

## 11. 学生作业表 (student_works)

存储学生提交的作业。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 作业ID | 主键 |
| student_id | VARCHAR(36) | 学生ID | 外键users(id) |
| classroom_id | VARCHAR(36) | 所属课堂ID | 外键classrooms(id) |
| type | ENUM | 类型(essay/presentation/project) | 非空 |
| title | VARCHAR(100) | 作业标题 | 非空 |
| content | TEXT | 作业内容 | 可空 |
| file_url | VARCHAR(255) | 文件URL | 可空 |
| status | ENUM | 状态(excellent/good/needHelp) | 可空 |
| score | INT | 分数 | 可空 |
| feedback | TEXT | 教师反馈 | 可空 |
| submission_time | DATETIME | 提交时间 | 默认当前时间 |

```sql
SELECT * FROM student_works WHERE classroom_id = 'classroom_id' ORDER BY submission_time DESC;
```

## 12. 知识图谱节点表 (knowledge_nodes)

存储知识图谱中的节点。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| id | VARCHAR(36) | 节点ID | 主键 |
| name | VARCHAR(100) | 节点名称 | 非空 |
| name_en | VARCHAR(100) | 英文名称 | 可空 |
| type | ENUM | 类型(concept/courseware/quiz/resource/keyword) | 非空 |
| description | TEXT | 描述信息 | 可空 |
| related_content_id | VARCHAR(36) | 关联内容ID | 可空 |
| created_at | DATETIME | 创建时间 | 默认当前时间 |

```sql
SELECT * FROM knowledge_nodes WHERE type = 'concept';
```

## 13. 知识图谱连接表 (knowledge_links)

存储知识图谱中的节点连接。

| 字段名 | 类型 | 说明 | 约束 |
|-------|------|-----|------|
| source_id | VARCHAR(36) | 源节点ID | 外键knowledge_nodes(id) |
| target_id | VARCHAR(36) | 目标节点ID | 外键knowledge_nodes(id) |
| strength | ENUM | 强度(high/medium/low) | 非空 |
| type | ENUM | 类型(related/prerequisite/includes) | 非空 |
| created_at | DATETIME | 创建时间 | 默认当前时间 |

```sql
SELECT * FROM knowledge_links WHERE source_id = 'node_id';
```

## 常用查询示例

### 获取学生课程进度
```sql
SELECT u.name, c.title, 
  COUNT(DISTINCT s.id) AS total_sections,
  COUNT(DISTINCT sp.section_id) AS completed_sections
FROM users u
JOIN student_progress sp ON u.id = sp.student_id
JOIN sections s ON s.chapter_id = sp.chapter_id
JOIN chapters c ON c.id = s.chapter_id
WHERE u.id = 'student_id'
GROUP BY c.id;
```

### 获取课堂参与度统计
```sql
SELECT cr.title, COUNT(DISTINCT sa.student_id) AS attendance_count,
  COUNT(DISTINCT dm.student_id) AS participation_count
FROM classrooms cr
LEFT JOIN student_attendance sa ON cr.id = sa.classroom_id
LEFT JOIN danmaku_messages dm ON cr.id = dm.classroom_id
WHERE cr.id = 'classroom_id'
GROUP BY cr.id;
```

### 获取学生学习统计
```sql
SELECT u.name, 
  AVG(sw.score) AS average_score,
  COUNT(DISTINCT sa.classroom_id) / (SELECT COUNT(*) FROM classrooms) * 100 AS attendance_percentage,
  COUNT(DISTINCT sw.id) / (SELECT COUNT(*) FROM assignments) * 100 AS task_completion_percentage
FROM users u
LEFT JOIN student_attendance sa ON u.id = sa.student_id
LEFT JOIN student_works sw ON u.id = sw.student_id
WHERE u.role = '学生'
GROUP BY u.id;
``` 