import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 设置全局前缀
  app.setGlobalPrefix(process.env.API_PREFIX || '/api');
  
  // 配置CORS，允许前端访问
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    [process.env.FRONTEND_URL || 'http://localhost:80', 'http://localhost', 'http://localhost:80'];
  
  app.enableCors({
    origin: (origin, callback) => {
      // 允许没有origin的请求（如移动应用或Postman）
      if (!origin) {
        return callback(null, true);
      }
      
      // 检查origin是否在允许的列表中
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      
      // 在开发环境中允许所有域名访问
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // 配置请求体大小限制
  app.use(bodyParser.json({ limit: process.env.MAX_FILE_SIZE || '100mb' }));
  app.use(bodyParser.urlencoded({ limit: process.env.MAX_FILE_SIZE || '100mb', extended: true }));
  
  // 配置静态文件服务
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  
  // 全局验证管道 - 修改配置允许任何属性
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false, // 不使用白名单检查，允许任何属性存在
      forbidNonWhitelisted: false, // 不禁止未知属性
      forbidUnknownValues: false, // 不禁止未知值
      validationError: {
        target: false, // 不在错误中包含目标对象
        value: false, // 不在错误中包含值 
      },
    }),
  );
  
  // Swagger文档配置
  const config = new DocumentBuilder()
    .setTitle('中国文化课程平台 API')
    .setDescription('中国文化课程平台的API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // 启动应用
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`应用已启动: ${await app.getUrl()}`);
  console.log(`API文档: http://localhost:${port}/api/docs`);
}

bootstrap(); 