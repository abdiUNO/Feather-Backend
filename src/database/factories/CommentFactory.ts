import { define } from 'typeorm-seeding';
import Faker from 'faker';
import { Comment } from '../../entity/comment.entity';

define(Comment, (faker: typeof Faker, settings: { userId; postId }) => {
  const comment = new Comment();
  comment.text = faker.lorem.words(Math.floor(Math.random() * 20 + 5));
  comment.post = settings.postId;
  comment.user = settings.userId;

  return comment;
});
