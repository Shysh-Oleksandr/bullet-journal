import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseAuthService } from './firebase-auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';

interface JwtUser {
  email: string;
  _id?: string;
  sub?: string;
}

interface JwtPayload {
  email: string;
  sub: string;
}

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

    const token = this.generateJwt(user);

    return {
      ...token,
      user: {
        ...user,
        access_token: token.access_token,
      },
    };
  }

  generateJwt(user: User | JwtUser) {
    let userId = '';

    if (user._id) {
      userId = user._id.toString();
    } else if ('sub' in user && user.sub) {
      userId = user.sub;
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: userId,
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}
