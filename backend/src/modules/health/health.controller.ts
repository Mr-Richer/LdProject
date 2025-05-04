import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('健康检查')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: '系统状态检查' })
  @ApiResponse({ status: 200, description: '系统正常运行' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: '系统正常运行'
    };
  }
  
  @Get('config')
  @ApiOperation({ summary: '配置状态检查' })
  @ApiResponse({ status: 200, description: '配置正常加载' })
  configCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: '配置正常加载',
      environment: process.env.NODE_ENV || 'development'
    };
  }
}
