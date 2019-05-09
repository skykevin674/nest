import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Client } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RoomService } from './room.service';
import { RedisQueue } from '../redis/redis.queue';

@WebSocketGateway(4970, { transports: ['websocket'], pingTimeout: 3, pingInterval: 1 })
export class PushGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private sets = new Set();

  constructor(private readonly room: RoomService, private queue: RedisQueue) {}

  @SubscribeMessage('create')
  onCreate(client: any, data: any): any {
    return 1;
  }

  @SubscribeMessage('test')
  onEvent(client: any, data: any) {
    const id = this.room.findRoom(client);
    this.queue.publish(id, data);
    // this.sets.forEach(value => {
    //   value.send('123');
    // });
    // client.send('123');
    // return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data })));
  }

  handleDisconnect(client: any) {
    Logger.debug('disconnect');
    this.room.unregisterUser(client);
  }

  handleConnection(client: any, ...args: any[]) {
    const userKey = args[0].url.slice(2);
    this.room.registerUser(userKey, client);
  }
}
