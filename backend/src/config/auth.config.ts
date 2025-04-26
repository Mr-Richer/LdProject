import { registerAs } from '@nestjs/config';
 
export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_it_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
})); 