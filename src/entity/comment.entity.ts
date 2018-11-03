import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  AfterLoad,
  AfterInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Vote } from './vote.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  text: string;

  @Column()
  postId: string;

  @ManyToOne(type => Post, post => post.comments, { cascade: true })
  post: Post;

  @ManyToOne(type => User, user => user.comments, { cascade: true })
  user: User;

  @OneToMany(type => Vote, vote => vote.user)
  votes: Vote[];

  @CreateDateColumn({
    // transformer: {
    //   from: () => value,
    //   to: () => randomDate('01/01/2018', '10/22/2018'),
    // },
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({
    default: '',
  })
  time: string;

  @Column({
    default: 0,
  })
  votesCount: number;

  @AfterLoad()
  @AfterInsert()
  updateTime() {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const tTime: any = new Date(this.createdAt);
    const cTime: any = new Date();
    const sinceMin = Math.round((cTime - tTime) / 60000);
    let since: any = 0;
    let sinceHr: any = 0;

    if (sinceMin < 2) {
      const sinceSec = Math.round((cTime - tTime) / 1000);
      since = sinceSec + 's';
    } else if (sinceMin < 60) since = sinceMin + 'm';
    else if (sinceMin < 1440) {
      sinceHr = Math.round(sinceMin / 60);
      since = sinceHr + 'h';
    } else if (sinceMin > 1439 && sinceMin < 2880) since = '1 day ago';
    else {
      since = monthNames[tTime.getMonth()] + ' ' + tTime.getDate();
    }

    this.time = since;
  }
}
