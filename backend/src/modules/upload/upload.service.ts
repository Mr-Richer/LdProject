import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor() {}

  getFileUrl(filename: string, type: 'image' | 'ppt' | 'resource' = 'resource'): string {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    const path = `/uploads/${type}s/${filename}`;
    return `${baseUrl}${path}`;
  }
} 