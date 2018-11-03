import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  dir: number;

  @Column()
  postId: string;

  @ManyToOne(type => Post, { cascade: true })
  post: Post;

  @Column()
  userId: string;

  @ManyToOne(type => User, { cascade: true })
  user: User;
}
