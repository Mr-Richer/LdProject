/**
 * 用户实体
 * 系统用户信息
 */
export class User {
  /**
   * 用户ID
   */
  id: number;

  /**
   * 用户名
   */
  username: string;

  /**
   * 昵称
   */
  nickname?: string;

  /**
   * 邮箱
   */
  email?: string;

  /**
   * 角色
   */
  role: 'admin' | 'teacher' | 'student' = 'student';

  /**
   * 创建时间
   */
  created_at: Date;

  /**
   * 更新时间
   */
  updated_at: Date;
} 