import { HealthModule } from './modules/health/health.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ChaptersModule } from './modules/chapters/chapters.module';
import { UploadModule } from './modules/upload/upload.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { QuizModule } from './modules/quiz/quiz.module';
import aiConfig from './config/ai.config';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [aiConfig], // 加载AI配置
    }),
    
    // 数据库连接
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'ruichen'),
        database: configService.get('DB_DATABASE', 'db_test'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
      }),
    }),
    
    // 功能模块
    AuthModule,
    ChaptersModule,
    UploadModule,
    AdminModule,
    AiModule,     // AI功能模块
    QuizModule,   // Quiz功能模块
    HealthModule, // 健康检查模块
  ],
})
export class AppModule {} 