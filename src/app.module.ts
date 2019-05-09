import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { TestMiddle } from './test.middle';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { PushModule } from './modules/push/push.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, PushModule],
controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TestMiddle)
      .forRoutes('*');
  }
}
