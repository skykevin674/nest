import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { Subject } from 'rxjs';

@Injectable()
export class RedisQueue {
  private pub = createClient();
  private sub = createClient();

  private subject = new Subject();

  onMessage = this.subject.asObservable();

  constructor() {
    this.sub.on('message', (channel, message) => {
      this.subject.next({
        channel, message,
      });
    });
  }

  registerRoom(roomId: string) {
    this.sub.subscribe(roomId);
  }

  unregisterRoom(roomId: string) {
    this.sub.unsubscribe(roomId);
  }

  publish(roomId: string, message: any) {
    this.pub.publish(roomId, JSON.stringify(message));
  }

}
