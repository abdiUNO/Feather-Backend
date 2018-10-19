import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const user = await this.userService.findById(value);

    if (!user) throw new NotFoundException(`Could not find user ${value}`);
    else return user;
  }
}
