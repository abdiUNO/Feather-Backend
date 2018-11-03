import { EntityRepository, Repository } from 'typeorm';
import { Group } from '../entity/group.entity';
import { Not, In } from 'typeorm';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  async findOrCreate(excludeIds?) {
    let whereQuery: any = {};

    let group = await this.findOne({
      where: { id: !excludeIds, isFull: false },
      relations: ['users'],
    });

    if (group) {
      group.isFull = group.users.length === 2;
      return group;
    } else {
      group = new Group();
      group.users = [];
      return group;
    }
  }
}
