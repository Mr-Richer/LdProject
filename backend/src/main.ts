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
  
  // 配置CORS，支持所有来源，包括file://协议
  app.enableCors({
    origin: '*', // 允许所有来源访问
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    maxAge: 600, // 预检请求缓存时间
  });
  
  // 配置请求体大小限制
  app.use(bodyParser.json({ limit: process.env.MAX_FILE_SIZE || '100mb' }));
  app.use(bodyParser.urlencoded({ limit: process.env.MAX_FILE_SIZE || '100mb', extended: true }));
  
  // 配置静态文件服务
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  
  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true
      }
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