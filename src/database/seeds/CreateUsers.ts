import { User } from '../../entity/user.entity';
import { Post } from '../../entity/post.entity';
import { Seed, Factory, getConnection, times } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { GroupRepository } from '../../repositories/group.repository';
import * as faker from 'faker';

import { Comment } from '../../entity/comment.entity';

export class CreateUsers implements Seed {
  constructor() {}

  public async seed(factory: Factory, connection: Connection): Promise<any> {
    const myConnection = await getConnection();
    const em = myConnection.createEntityManager();
    const groupRepository = myConnection.getCustomRepository(GroupRepository);

    const users = await times(Math.floor(Math.random() * 10) + 5, async n => {
      const user = await factory(User)().seed();
      const _group = await groupRepository.findOrCreate([]);
      _group.users.push(user);
      await connection.createEntityManager().save(_group);

      return user;
    });

    await times(users.length, async n => {
      const posts = await factory(Post)({ userId: users[n].id }).seedMany(
        Math.floor(Math.random() * 15) + 5,
      );

      await times(posts.length, async n => {
        for (var i = 0; i < Math.floor(Math.random() * 15) + 5; i++) {
          const comment = new Comment();
          comment.text = faker.lorem.words(Math.floor(Math.random() * 20 + 5));
          comment.post = posts[n];
          comment.user = users[Math.floor(Math.random() * users.length)];

          em.save(comment);
        }
      });
    });
  }
}
