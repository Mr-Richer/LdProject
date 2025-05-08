import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // 添加自定义认证逻辑
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // 处理用户认证信息
    if (err || !user) {
      throw err || new UnauthorizedException('认证失败');
    }
    return user;
  }
} 