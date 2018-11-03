import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const user = await this.userRepository.findOne({
      where: { id: value },
      relations: ['groups', 'groups.users'],
    });

    if (!user) throw new NotFoundException(`Could not find user ${value}`);
    else return user;
  }
}
