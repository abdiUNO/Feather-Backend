import { EntityRepository, Repository } from 'typeorm';
import { Group } from '../entity/group.entity';
import { Not, In } from 'typeorm';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  async findOrCreate(excludeIds?) {
    let whereQuery: any = {};

    console.log(excludeIds.join());

    if (excludeIds.length === 0) excludeIds.push('');

    let group = await this.createQueryBuilder('group')
      .where('group.id NOT IN (:exclude_ids) AND group.isFull = false', {
        exclude_ids: excludeIds,
      })
      .leftJoinAndSelect('group.users', 'users')
      .getOne();

    console.log(group);

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
