import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/model/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_KEY, JWT_EXPIRE } from 'src/constants';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({
    secretOrPrivateKey: JWT_KEY,
    signOptions: {
      expiresIn: JWT_EXPIRE,
    },
  }), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, JwtModule],
})
export class UserModule { }
