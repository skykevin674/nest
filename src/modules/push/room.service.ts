import { Injectable, Logger } from '@nestjs/common';
import { generate } from 'randomstring';
import { scheduleJob } from 'node-schedule';
import { RedisQueue } from '../redis/redis.queue';

interface Room {
  id: string;
  users: Map<string, Set<any>>;
  stack: any[];
}

@Injectable()
export class RoomService {

  private rooms: Room[] = [];

  private looseUsers = new Map<string, Set<any>>();

  constructor(private queue: RedisQueue) {
    scheduleJob('*/10 * * * * *', () => {
      this.clearZombies();
    });
    this.queue.onMessage.subscribe((evt: any) => {
      const arr = this.findClients(evt.channel);
      if (arr) {
        arr.forEach(c => c.send(evt.message));
      }
    });
  }

  private removeDeadClient(collection: Map<string, Set<any>>) {
    for (const kv of collection) {
      for (const client of kv[1]) {
        if (client.readyState === 3) {
          kv[1].delete(client);
        }
      }
      if (!kv[1].size) {
        collection.delete(kv[0]);
      }
    }
  }

  clearZombies() {
    this.removeDeadClient(this.looseUsers);
    for (const room of this.rooms) {
      this.removeDeadClient(room.users);
    }
  }

  test() {
    for (const v of this.looseUsers) {
      for (const c of v[1]) {
        Logger.debug(c.readyState);
      }
    }
  }

  registerUser(userKey: string, client: any) {
    const index = this.prevRoomIndex(userKey);
    if (index >= 0) {
      const room = this.rooms[index];
      client.send(JSON.stringify({ event: 'join', data: room.id }));
      room.users.get(userKey).add(client);
      return;
    }
    let set = this.looseUsers.get(userKey);
    if (!set) {
      set = new Set();
      this.looseUsers.set(userKey, set);
    }
    set.add(client);
  }

  unregisterUser(client: any) {
    for (const v of this.looseUsers) {
      if (v[1].has(client)) {
        v[1].delete(client);
        if (!v[1].size) {
          this.looseUsers.delete(v[0]);
        }
      }
    }
  }

  prevRoomIndex(userKey: string): number {
    return this.rooms.findIndex(r => r.users.has(userKey));
  }

  create(userKey: string): string {
    const prev = this.prevRoomIndex(userKey);
    if (prev >= 0) {
      return this.rooms[prev].id;
    }
    Logger.debug(this.looseUsers.has(userKey));
    Logger.debug(this.looseUsers.size);
    if (this.looseUsers.has(userKey)) {
      const id = generate();
      const map = new Map();
      map.set(userKey, this.looseUsers.get(userKey));
      this.looseUsers.delete(userKey);
      this.rooms.push({
        id, stack: [], users: map,
      });
      this.queue.registerRoom(id);
      return id;
    }
    return null;
  }

  join(roomId: string, userKey: string): string {
    const prev = this.prevRoomIndex(userKey);
    if (prev >= 0) {
      return this.rooms[prev].id;
    }
    if (this.looseUsers.has(userKey)) {
      const room = this.rooms.find(r => r.id === roomId);
      if (room) {
        room.users.set(userKey, this.looseUsers.get(userKey));
        this.looseUsers.delete(userKey);
        return roomId;
      } else {
        return this.create(userKey);
      }
    }
    return null;
  }

  quit(userKey: string) {
    const roomIndex = this.rooms.findIndex(r => r.users.has(userKey));
    if (roomIndex >= 0) {
      this.looseUsers.set(userKey, this.rooms[roomIndex].users.get(userKey));
      this.rooms[roomIndex].users.delete(userKey);
      if (!this.rooms[roomIndex].users.size) {
        this.queue.unregisterRoom(this.rooms[roomIndex].id);
        this.rooms.splice(roomIndex, 1);
      }
    }
  }

  getAllRooms() {
    return this.rooms.map(r => r.id);
  }

  findRoom(client: any) {
    const room = this.rooms.find(r => {
      for (const k of r.users) {
        if (k[1].has(client)) {
          return true;
        }
      }
      return false;
    });
    if (room) {
      return room.id;
    }
    return null;
  }

  findClients(roomId: string) {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      const arr = [];
      for (const u of room.users) {
        for (const c of u[1]) {
          arr.push(c);
        }
      }
      return arr;
    }
    return null;
  }
}
