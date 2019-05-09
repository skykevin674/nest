import { Controller, Post, Body, Logger, HttpCode, Get, Param, UseGuards } from '@nestjs/common';
import { User } from 'src/model/user.entity';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { UserService } from './user.service';
import { JWT_EXPIRE } from 'src/constants';
import { convertToPlainObject } from 'src/util';
import { JwtService } from '@nestjs/jwt';
import { AES_KEY } from '../../constants';
import * as aes from 'crypto-js/aes';
import * as CryptoJS from 'crypto-js/crypto-js';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/auth.guard';

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
      Logger.debug(reason);
      return null;
    });
    return { valid: flag ? true : false };
  }

  @UseGuards(new JwtAuthGuard())
  @Get('get/:ticket')
  async get(@Param('ticket') ticket: string) {
    const bytes  = aes.decrypt(ticket, AES_KEY);
    const id = bytes.toString(CryptoJS.enc.Utf8);
    const u = await this.userService.get({id});
    if (u) {
      return {valid: true, user: {
        id: u.id, username: u.username,
      }};
    }
    return {valid: false, info: '用户不存在'};
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() userDto: any) {
    const filter = { username: userDto.username };
    const u = await this.userService.get(filter);
    if (u && compareSync(userDto.password, u.passwordDigest)) {
      return {
        valid: true, data: {
          expire: JWT_EXPIRE, token: this.jwtService.sign(convertToPlainObject(u)),
          ticket: aes.encrypt(u.id + '', AES_KEY).toString(),
        },
      };
    }
    return { valid: false };
  }
}
