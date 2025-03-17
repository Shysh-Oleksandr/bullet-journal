/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body('token') token: string) {
    return this.authService.login(token);
  }

  @Post('refresh')
  refreshToken(@Req() req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = this.jwtService.verify(token, { ignoreExpiration: true });
    return this.authService.generateJwt({
      email: decoded.email,
      sub: decoded.sub,
    });
  }
}
