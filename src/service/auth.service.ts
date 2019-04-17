import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../model/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(user: any) {
    const u: User = {
      id: null,
      userName: user.userName,
      passwordDigest: this.jwtService.sign(user),
    };
    return u;
  }

  async validateUser(payload: any): Promise<any> {
    // put some validation logic here
    // for example query user by id/email/username
    return {};
  }
}
