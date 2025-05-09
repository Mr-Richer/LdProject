import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as mime from 'mime-types';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadsDir: string;

  constructor() {
    this.uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
    // 确保上传目录存在
    this.ensureDirectoryExists(this.uploadsDir);
    this.ensureDirectoryExists(path.join(this.uploadsDir, 'images'));
    this.ensureDirectoryExists(path.join(this.uploadsDir, 'resources'));
    this.ensureDirectoryExists(path.join(this.uploadsDir, 'ppts'));
  }

  getFileUrl(filename: string, type: 'image' | 'ppt' | 'resource' = 'resource'): string {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    const path = `/uploads/${type}s/${filename}`;
    return `${baseUrl}${path}`;
  }
  
  /**
   * 上传文件
   * @param file 文件对象
   * @param uploadDir 上传目录 (相对于uploads目录)
   * @returns 上传后的文件信息
   */
  async uploadFile(file: Express.Multer.File, uploadDir: string = 'resources'): Promise<{ filename: string, url: string, mime_type: string }> {
    if (!file) {
      throw new BadRequestException('未提供文件');
    }
    
    try {
      // 确保上传目录存在
      const targetDir = path.join(this.uploadsDir, uploadDir);
      this.ensureDirectoryExists(targetDir);
      
      // 生成唯一文件名
      const fileExt = path.extname(file.originalname);
      const randomName = crypto.randomBytes(16).toString('hex');
      const safeName = this.getSafeFilename(file.originalname);
      const newFilename = `${randomName}-${safeName}`;
      
      // 写入文件
      const filePath = path.join(targetDir, newFilename);
      await fs.promises.writeFile(filePath, file.buffer);
      
      // 确定MIME类型
      const mimeType = file.mimetype || mime.lookup(fileExt) || 'application/octet-stream';
      
      // 确定URL路径
      let urlType: 'image' | 'ppt' | 'resource' = 'resource';
      if (uploadDir === 'images') urlType = 'image';
      if (uploadDir === 'ppts') urlType = 'ppt';
      
      return {
        filename: newFilename,
        url: this.getFileUrl(newFilename, urlType),
        mime_type: mimeType
      };
    } catch (error) {
      this.logger.error(`文件上传失败: ${error.message}`, error.stack);
      throw new BadRequestException(`文件上传失败: ${error.message}`);
    }
  }
  
  /**
   * 删除单个文件
   * @param resource 资源对象，包含文件名和资源类型
   * @returns 删除结果
   */
  async deleteFile(resource: { filename?: string, resource_url?: string }): Promise<boolean> {
    try {
      let filename = resource.filename;
      
      // 如果只提供了URL，从URL中提取文件名
      if (!filename && resource.resource_url) {
        const urlParts = resource.resource_url.split('/');
        filename = urlParts[urlParts.length - 1];
      }
      
      if (!filename) {
        throw new BadRequestException('未提供文件名');
      }
      
      // 尝试在不同目录中查找文件
      const possiblePaths = [
        path.join(this.uploadsDir, 'resources', filename),
        path.join(this.uploadsDir, 'images', filename),
        path.join(this.uploadsDir, 'ppts', filename)
      ];
      
      let deleted = false;
      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
          deleted = true;
          break;
        }
      }
      
      if (!deleted) {
        this.logger.warn(`文件不存在，无法删除: ${filename}`);
      }
      
      return deleted;
    } catch (error) {
      this.logger.error(`文件删除失败: ${error.message}`, error.stack);
      throw new BadRequestException(`文件删除失败: ${error.message}`);
    }
  }
  
  /**
   * 批量删除文件
   * @param fileUrls 文件URL数组
   * @returns 删除结果
   */
  async deleteFiles(fileUrls: string[]): Promise<{ success: string[], failed: string[] }> {
    const results = {
      success: [],
      failed: []
    };
    
    if (!fileUrls || fileUrls.length === 0) {
      return results;
    }
    
    for (const url of fileUrls) {
      try {
        // 从URL中提取文件名
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        const deleted = await this.deleteFile({ filename });
        if (deleted) {
          results.success.push(url);
        } else {
          results.failed.push(url);
        }
      } catch (error) {
        this.logger.error(`删除文件失败: ${url}, ${error.message}`);
        results.failed.push(url);
      }
    }
    
    return results;
  }
  
  /**
   * 确保目录存在
   * @param dirPath 目录路径
   */
  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
  
  /**
   * 获取安全的文件名
   * @param originalName 原始文件名
   * @returns 安全的文件名
   */
  private getSafeFilename(originalName: string): string {
    const name = path.basename(originalName, path.extname(originalName));
    const ext = path.extname(originalName);
    
    // 移除不安全字符
    const safeName = name
      .replace(/[^\w\s.-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    return safeName.substring(0, 100) + ext; // 限制文件名长度
  }
} 