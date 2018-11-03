import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '../repositories/group.repository';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupRepository)
    private readonly groupRepository: GroupRepository,
  ) {}

  findById(id) {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  leaveGroup(group, user) {
    group.users = group.users.filter(u => u.id !== user.id);
    return this.groupRepository.save(group);
  }
}
