import { Controller, UseGuards, Post, Body, Logger, Get, Query, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RoomService } from './room.service';

@Controller('room')
@UseGuards(new JwtAuthGuard())
export class RoomController {

  constructor(private room: RoomService) { }

  @Get('test/:channel')
  test(@Param('channel') channel: string) {
    // this.pub.publish(channel, 'I am sending a message.');
    return 1;
  }

  @Post('create')
  create(@Body() dto: any) {
    const roomId = this.room.create(dto.id + '');
    if (roomId) {
      return { valid: true, data: roomId };
    }
    return { valid: false, info: '创建失败' };
  }

  @Post('quit')
  quit(@Body() dto: any) {
    this.room.quit(dto.id + '');
    return { valid: true };
  }

  @Get('query')
  query() {
    return { valid: true, data: this.room.getAllRooms() };
  }

  @Post('join')
  join(@Body() dto: any) {
    const id = this.room.join(dto.roomId, dto.id + '');
    if (id) {
      return { valid: true, data: id };
    }
    return { valid: false, info: '加入失败' };
  }
}
