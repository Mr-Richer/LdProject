
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async checkHealth() {
    try {
      // 尝试执行简单查询以检查数据库连接
      await this.connection.query('SELECT 1');
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          status: 'connected',
          type: this.connection.options.type,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: {
          status: 'disconnected',
          error: error.message,
        },
      };
    }
  }
}
