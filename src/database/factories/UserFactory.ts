import { define } from 'typeorm-seeding';
import { User } from '../../entity/user.entity';
import Faker from 'faker';

define(User, (faker: typeof Faker, settings) => {
  const user = new User();
  user.username = faker.internet.userName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();

  return user;
});
