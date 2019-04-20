import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/model/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_KEY, JWT_EXPIRE } from 'src/constants';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({
    secretOrPrivateKey: JWT_KEY,
    signOptions: {
      expiresIn: JWT_EXPIRE,
    },
  })],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, JwtModule],
})
export class UserModule { }
