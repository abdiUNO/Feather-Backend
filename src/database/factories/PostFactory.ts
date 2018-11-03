import { define } from 'typeorm-seeding';
import { Post } from '../../entity/post.entity';
import Faker from 'faker';
import { User } from '../../entity/user.entity';

declare global {
  interface Date {
    subHours: any;
    subMinutes: any;
    subDate: any;
  }
}

define(Post, (faker: typeof Faker, settings: { userId }) => {
  const CATEGORIES = ['Music', 'Gaming', 'Movies'];

  const post = new Post();
  post.text = faker.lorem.words(Math.floor(Math.random() * 20 + 5));
  post.category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  post.userId = settings.userId;
  post.votesCount = Math.floor(Math.random() * 100) + 1;
  post.commentsCount = Math.floor(Math.random() * 100) + 1;
  return post;
});
