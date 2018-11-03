import {
  Injectable,
  Inject,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Group } from '../entity/group.entity';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { UserData } from './user.interface';
import * as crypto from 'crypto';
import { GroupRepository } from '../repositories/group.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(GroupRepository)
    private readonly groupRepository: GroupRepository,
  ) {}

  async findOne(loginUserDto: LoginUserDto): Promise<User> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto
        .createHmac('sha256', loginUserDto.password)
        .digest('hex'),
    };

    return await this.userRepository.findOne({
      where: findOneOptions,
      relations: ['groups'],
    });
  }

  async joinGroup(user: User) {
    const errors = { groups: 'joined max groups' };

    if (user.groups.length >= 3) {
      throw new HttpException(
        { message: 'User already joined max amount of groups(3)', errors },
        HttpStatus.FORBIDDEN,
      );
    }

    const ids = user.groups.map(g => g.id);
    const group = await this.groupRepository.findOrCreate(ids);

    delete user.groups;
    group.users.push(user);

    return this.groupRepository.save(group);
  }

  async leaveGroup(user, group) {
    group.users = group.users.filter(u => u.id !== user.id);
    return this.groupRepository.save(group);
  }

  async create(data: UserData): Promise<User> {
    const emailExists = await this.userRepository.findOne({
      email: data.email,
    });

    if (emailExists) {
      const errors = { username: 'Username and email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    const group = await this.groupRepository.findOrCreate([]);

    const user = new User();
    user.username = data.username;
    user.password = data.password;
    user.email = data.email;
    user.groups = [group];

    return await this.userRepository.save(user);
  }

  async delete(user: User): Promise<any> {
    return await this.userRepository.delete(user);
  }
}
