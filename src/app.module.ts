import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestMiddle } from './test.middle';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { User } from './model/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_KEY, JWT_EXPIRE } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './service/jwt-strategy';
import { AuthService } from './service/auth.service';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([User]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secretOrPrivateKey: JWT_KEY,
    signOptions: {
      expiresIn: JWT_EXPIRE,
    },
  })],
  controllers: [AppController],
  providers: [AppService, UserService, AuthService, JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TestMiddle)
      .forRoutes('*');
  }
}
