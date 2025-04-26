/**
 * 数据库连接修复脚本
 * 用于检查和修复数据库连接问题
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('数据库连接修复工具启动...');

// 检查环境变量文件是否存在
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('未找到 .env 文件，正在创建默认配置...');
    
    // 创建默认的环境变量文件
    const defaultEnvContent = `
# 数据库配置
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=chinese_culture_course
DB_SYNCHRONIZE=true

# 服务器配置
PORT=3000
API_PREFIX=api
GLOBAL_PREFIX=

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION_TIME=3600

# 上传文件配置
UPLOAD_DIR=uploads
`;

    fs.writeFileSync(envPath, defaultEnvContent);
    console.log('.env 文件已创建');
}

// 检查数据库连接
console.log('正在检查数据库连接...');

// 创建健康检查路由
const healthCheckPath = path.join(__dirname, 'src/modules/health');
if (!fs.existsSync(healthCheckPath)) {
    console.log('创建健康检查模块...');
    fs.mkdirSync(healthCheckPath, { recursive: true });
    
    // 创建健康检查控制器
    const controllerContent = `
import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async checkHealth() {
    return this.healthService.checkHealth();
  }
}
`;
    
    // 创建健康检查服务
    const serviceContent = `
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
`;
    
    // 创建健康检查模块
    const moduleContent = `
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
`;
    
    fs.writeFileSync(path.join(healthCheckPath, 'health.controller.ts'), controllerContent);
    fs.writeFileSync(path.join(healthCheckPath, 'health.service.ts'), serviceContent);
    fs.writeFileSync(path.join(healthCheckPath, 'health.module.ts'), moduleContent);
    console.log('健康检查模块已创建');
    
    // 更新app.module.ts以包含健康检查模块
    const appModulePath = path.join(__dirname, 'src/app.module.ts');
    if (fs.existsSync(appModulePath)) {
        let appModuleContent = fs.readFileSync(appModulePath, 'utf8');
        
        // 检查是否已导入HealthModule
        if (!appModuleContent.includes('HealthModule')) {
            // 添加导入语句
            appModuleContent = appModuleContent.replace(
                'import { Module }',
                'import { HealthModule } from \'./modules/health/health.module\';\nimport { Module }'
            );
            
            // 添加到模块数组
            appModuleContent = appModuleContent.replace(
                /imports: \[([\s\S]*?)\]/,
                (match, imports) => {
                    return `imports: [${imports}HealthModule,]`;
                }
            );
            
            fs.writeFileSync(appModulePath, appModuleContent);
            console.log('已将健康检查模块添加到AppModule');
        }
    }
}

// 简单的服务器启动脚本
function startServer() {
    console.log('尝试启动服务器...');
    
    try {
        // 检查是否已编译
        if (!fs.existsSync(path.join(__dirname, 'dist'))) {
            console.log('正在编译项目...');
            execSync('npm run build', { cwd: __dirname, stdio: 'inherit' });
        }
        
        // 启动服务器
        console.log('正在启动服务器...');
        const server = spawn('node', ['dist/main.js'], { cwd: __dirname, stdio: 'inherit' });
        
        server.on('error', (error) => {
            console.error('服务器启动错误:', error);
        });
        
        server.on('exit', (code, signal) => {
            if (code !== 0) {
                console.error(`服务器已退出，代码: ${code}, 信号: ${signal}`);
            } else {
                console.log('服务器已正常关闭');
            }
        });
        
        // 捕获SIGINT信号，优雅关闭服务器
        process.on('SIGINT', () => {
            console.log('收到关闭信号，正在关闭服务器...');
            server.kill('SIGINT');
        });
        
        console.log('服务器启动成功，请访问 http://localhost:3000/api/health 检查状态');
    } catch (error) {
        console.error('启动服务器失败:', error);
    }
}

// 执行自动修复
console.log('正在执行数据库修复...');

// 尝试确保数据库存在
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const dbConfigMatch = {
        host: envContent.match(/DB_HOST=(.+)/)?.[1] || 'localhost',
        user: envContent.match(/DB_USERNAME=(.+)/)?.[1] || 'root',
        password: envContent.match(/DB_PASSWORD=(.+)/)?.[1] || 'root',
        database: envContent.match(/DB_DATABASE=(.+)/)?.[1] || 'chinese_culture_course',
    };
    
    // 创建MySQL数据库创建脚本
    const createDbScript = `
CREATE DATABASE IF NOT EXISTS ${dbConfigMatch.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ${dbConfigMatch.database};

-- 可以在这里添加必要的基础表结构
`;
    
    const scriptPath = path.join(__dirname, 'create_db.sql');
    fs.writeFileSync(scriptPath, createDbScript);
    
    console.log('已生成数据库创建脚本，路径:', scriptPath);
    console.log('请手动运行此脚本或执行以下命令创建数据库:');
    console.log(`mysql -u${dbConfigMatch.user} -p${dbConfigMatch.password} < ${scriptPath}`);
    
    // 提示用户执行后续步骤
    console.log('\n数据库修复完成。请按照以下步骤操作:');
    console.log('1. 确保 MySQL 服务正在运行');
    console.log('2. 手动运行数据库创建脚本 (如果需要)');
    console.log('3. 使用 npm run start:dev 或 node db-fix.js --start 启动服务器');
    
    // 如果有--start参数，则启动服务器
    if (process.argv.includes('--start')) {
        startServer();
    }
} catch (error) {
    console.error('修复数据库时发生错误:', error);
} 