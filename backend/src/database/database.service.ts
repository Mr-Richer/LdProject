import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: mysql.Pool;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.logger.log('初始化数据库连接池');
    const dbConfig = {
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 3306),
      user: this.configService.get('DB_USER', 'root'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: this.configService.get('DB_DATABASE', 'cultural_learning'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: '+08:00'
    };

    try {
      this.pool = mysql.createPool(dbConfig);
      this.logger.log('数据库连接池创建成功');
      
      // 测试连接
      const connection = await this.pool.getConnection();
      connection.release();
      this.logger.log('数据库连接测试成功');
    } catch (error) {
      this.logger.error(`数据库连接池创建失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      this.logger.log('关闭数据库连接池');
      await this.pool.end();
    }
  }

  /**
   * 获取数据库连接
   * @returns 数据库连接
   */
  async getConnection(): Promise<mysql.PoolConnection> {
    try {
      return await this.pool.getConnection();
    } catch (error) {
      this.logger.error(`获取数据库连接失败: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  /**
   * 执行查询
   * @param query SQL查询
   * @param params 查询参数
   * @returns 查询结果
   */
  async query(query: string, params: any[] = []): Promise<any> {
    const connection = await this.getConnection();
    try {
      const [results] = await connection.execute(query, params);
      return results;
    } catch (error) {
      this.logger.error(`执行查询失败: ${error.message}`, error.stack);
      throw error;
    } finally {
      connection.release();
    }
  }
  
  /**
   * 在事务中执行多个查询
   * @param callback 包含查询的回调函数
   * @returns 执行结果
   */
  async transaction<T>(
    callback: (connection: mysql.PoolConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      this.logger.error(`事务执行失败: ${error.message}`, error.stack);
      throw error;
    } finally {
      connection.release();
    }
  }
} 