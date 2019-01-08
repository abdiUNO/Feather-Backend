import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class MicroLink {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  image: string;

  @ManyToOne(type => Post, { cascade: true })
  post: Post;

  @Column({
    type: 'longtext',
  })
  description: string;

  @Column({
    type: 'longtext',
  })
  logo: string;

  @Column({
    type: 'longtext',
  })
  url: string;
}
