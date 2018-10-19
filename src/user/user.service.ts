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
import { CreateUserDto, LoginUserDto } from './dto/index';
import { UserData } from './user.interface';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  private users: UserData[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id });
  }

  async findOne(loginUserDto: LoginUserDto): Promise<User> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto
        .createHmac('sha256', loginUserDto.password)
        .digest('hex'),
    };

    return await this.userRepository.findOne(findOneOptions);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
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

    const user = new User();
    user.username = data.username;
    user.password = data.password;
    user.email = data.email;

    return await this.userRepository.save(user);
  }

  async delete(user: User): Promise<any> {
    return await this.userRepository.delete(user);
  }
}
