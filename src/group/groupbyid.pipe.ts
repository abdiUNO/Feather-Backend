import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '../repositories/group.repository';

@Injectable()
export class GroupByIdPipe implements PipeTransform {
  constructor(
    @InjectRepository(GroupRepository)
    private readonly groupRepository: GroupRepository,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const group = await this.groupRepository.findOne({
      where: { id: value },
      relations: ['users'],
    });

    if (!group) throw new NotFoundException(`Could not find group ${value}`);
    else return group;
  }
}
