import { Controller, Post, Body } from '@nestjs/common';
import { User } from 'src/model/user.entity';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { UserService } from './user.service';
import { JWT_EXPIRE } from 'src/constants';
import { convertToPlainObject } from 'src/util';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

  @Post('register')
  async register(@Body() userDto: any) {
    const salt = genSaltSync(10);
    const user: User = {
      id: undefined, salt,
      username: userDto.username,
      passwordDigest: hashSync(userDto.password, salt),
    };
    const flag = await this.userService.save(user).catch((reason: any) => {
      return null;
    });
    return { valid: flag ? true : false };
  }

  @Post('login')
  async login(@Body() userDto: any) {
    const filter = {username: userDto.username};
    const u = await this.userService.get(filter);
    if (u && compareSync(userDto.password, u.passwordDigest)) {
      return {valid: true, data: {
        expire: JWT_EXPIRE, token: this.jwtService.sign(convertToPlainObject(u)),
      }};
    }
    return {valid: false};
  }
}
