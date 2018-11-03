import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    default: false,
  })
  isFull: boolean;

  @ManyToMany(type => User, user => user.groups, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: User[];
}
