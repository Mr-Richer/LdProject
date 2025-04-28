import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            let uploadPath = configService.get('UPLOAD_DEST', './uploads');
            
            // 根据不同文件类型存储到不同目录
            if (file.mimetype.includes('image')) {
              uploadPath += '/images';
            } else if (file.originalname.endsWith('.ppt') || file.originalname.endsWith('.pptx')) {
              uploadPath += '/ppt';
            } else {
              uploadPath += '/resources';
            }
            
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix = uuidv4();
            const ext = extname(file.originalname);
            cb(null, `${uniqueSuffix}${ext}`);
          },
        }),
        limits: {
          fileSize: 1024 * 1024 * 100, // 100MB
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {} 