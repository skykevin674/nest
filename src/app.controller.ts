import { Controller, Get, Param, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import * as NodeRsa from 'node-rsa';
import { User } from './model/user.entity';
import { UserService } from './modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JWT_KEY, JWT_EXPIRE } from 'src/constants';
import { convertToPlainObject } from './util';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @Get('hello/:id')
  @UseGuards(AuthGuard())
  getHello(@Param('id') id): string {
    // return this.appService.getHello();
    // const privatePem = fs.readFileSync(path.join(__dirname, '../pkcs8_rsa_private_key.pem'));
    // const privateStr = privatePem.toString();
    // const privateKey = new NodeRsa(privateStr);

    const publicPem = fs.readFileSync(path.join(__dirname, '../rsa_public_key.pem'));
    const publicStr = publicPem.toString();
    const publicKey = new NodeRsa(publicStr);

    const test = JSON.stringify({
      username: '123', password: '456',
    });

    // const u = new User();
    // u.userName = 'test';
    // u.passwordDigest = 'dd';

    // const dg = this.jwtService.sign({
    //   userName: '123', password: '456',
    // });
    // Logger.debug(dg);

    // this.userService.query().then(v => Logger.debug(v));

    // this.userService.save(u);

    // const p = publicKey.encrypt(test, 'base64', 'utf8');
    // Logger.debug(p);

    // const d = privateKey.decrypt(p, 'utf8');
    // Logger.debug(d);

    return publicKey.encrypt(test, 'base64', 'utf8');
    // return id;
  }

  @Post('submit')
  submit(@Body() body: any): string {
    Logger.debug(body);
    return '123';
  }
}
