import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

interface JwtPayload {
  email: string;
  sub: string;
  iat: number;
  exp: number;
}

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
  refreshToken(@Body('token') token: string) {
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = this.jwtService.verify<JwtPayload>(token, {
      ignoreExpiration: true,
    });
    return this.authService.generateJwt({
      email: decoded.email,
      _id: decoded.sub,
    });
  }
}
