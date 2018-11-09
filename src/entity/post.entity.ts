import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  BeforeInsert,
  AfterInsert,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Vote } from './vote.entity';
import { Comment } from './comment.entity';

function getRandomColor() {
  const color = [
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#c0392b',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#0097e6',
    '#44bd32',
    '#40739e',
    '#c23616',
    '#1289A7',
    '#B53471',
    '#3d3d3d',
    '#34ace0',
    '#AD1457',
    '#00796B',
    '#d32f2f',
  ];

  return color[Math.floor(Math.random() * color.length)];
}

function randomDate(date1, date2) {
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  var date1 = date1 || '01-01-1970';
  var date2 = date2 || new Date().toLocaleDateString();
  date1 = new Date(date1).getTime();
  date2 = new Date(date2).getTime();
  if (date1 > date2) {
    return new Date(getRandomArbitrary(date2, date1))
      .toJSON()
      .slice(0, 19)
      .replace('T', ' ');
  } else {
    return new Date(getRandomArbitrary(date1, date2))
      .toJSON()
      .slice(0, 19)
      .replace('T', ' ');
  }
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  text: string;

  @Column({
    name: 'category',
    type: 'enum',
    enum: [
      'Gaming',
      'Fitness',
      'Sports',
      'Music',
      'Movies',
      'News',
      'Conservative',
      'Liberal',
      'Business',
      'Art',
      'Science and Engineering',
      'Stories',
      'Anonymous',
    ],
  })
  category;

  @Column({
    default: 0,
  })
  votesCount: number;

  @OneToMany(type => Comment, comment => comment.post)
  comments: Comment[];

  @Column({
    default: 0,
  })
  commentsCount: number;

  @OneToMany(type => Vote, vote => vote.post)
  votes: Vote[];

  @Column()
  userId: string;

  @Column({
    default: '',
  })
  time: string;

  @ManyToOne(type => User, user => user.posts, {
    eager: true,
  })
  user: User;

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
    default: getRandomColor(),
  })
  color: string;

  @AfterInsert()
  updateCounters() {
    this.color = getRandomColor();
  }

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
