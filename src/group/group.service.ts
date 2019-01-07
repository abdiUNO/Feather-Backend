import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '../repositories/group.repository';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupRepository)
    private readonly groupRepository: GroupRepository,
  ) {}

  findAll(user) {
    console.log(user.groups);
    return this.groupRepository
      .createQueryBuilder('group')
      .innerJoinAndSelect('group.users', 'user', 'user.id = :userId', {
        userId: user.id,
      })
      .getMany();
    // return this.groupRepository.find({
    //   where: { userId: user.id },
    //   relations: ['users'],
    // });
  }

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
