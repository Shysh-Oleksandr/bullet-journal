/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseAuthService } from './firebase-auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(firebaseToken: string) {
    const decodedToken =
      await this.firebaseAuthService.verifyToken(firebaseToken);

    let user = await this.usersService.findByUid(decodedToken.uid);

    if (!user) {
      user = await this.usersService.create({
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || '',
      });
    } else {
      await this.usersService.update(user.uid, {
        email: decodedToken.email,
        name: decodedToken.name || '',
      });
    }

    return this.generateJwt(user);
  }

  generateJwt(user: any) {
    const payload = { email: user.email, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
