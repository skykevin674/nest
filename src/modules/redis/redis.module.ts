import { Module } from '@nestjs/common';
import { RedisQueue } from './redis.queue';

@Module({
  providers: [RedisQueue],
  exports: [RedisQueue],
})
export class RedisModule {}
