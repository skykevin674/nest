import { Module, Logger } from '@nestjs/common';
import { PushGateway } from './push.gateway';
import { RoomService } from './room.service';
import { generate } from 'randomstring';
import { RoomController } from './room.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [RoomService, PushGateway],
  controllers: [RoomController],
})
export class PushModule {

}
