import { Injectable } from '@nestjs/common';
import { UserData } from './user.interface';
import { Post } from '../posts/interfaces/post.interface';

@Injectable()
export class UserService {
  private users: UserData[] = [];

  create(user: UserData) {
    this.users.push(user);
  }

  findAll(): UserData[] {
    return this.users;
  }
}
