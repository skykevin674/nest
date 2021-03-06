import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../model/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async save(user: User) {
    return await this.userRepository.save(user);
  }

  async query() {
    return await this.userRepository.createQueryBuilder('u').select(['u.id', 'u.username']).getMany();
  }

  async get(filter: any) {
    return await this.userRepository.findOne(filter);
  }

}
