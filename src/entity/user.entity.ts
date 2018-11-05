import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as crypto from 'crypto';
import { Group } from './group.entity';
import { Post } from './post.entity';
import { Vote } from './vote.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 500, unique: true })
  username: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @ManyToMany(type => Group, group => group.users, {
    cascade: true,
  })
  groups: Group[];

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @OneToMany(type => Post, post => post.user)
  posts: Post[];

  @OneToMany(type => Vote, vote => vote.user)
  votes: Vote[];

  @OneToMany(type => Comment, comment => comment.user)
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column('simple-array')
  subscription: string[];

  @Column({
    default: '',
  })
  image: string;
}
