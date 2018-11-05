import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '../entity/post.entity';
import { User } from '../entity/user.entity';
import { Vote } from '../entity/vote.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '../entity/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async create(dto: CreatePostDto, user: User) {
    const post = new Post();
    post.text = dto.text;
    post.category = dto.category;
    post.user = user;
    post.category = dto.category;

    return this.postRepository.save(post);
  }

  async createVote(dir: number, user: User, post: Post) {
    const voteExists = await this.voteRepository.findOne({
      where: { userId: user.id, postId: post.id },
    });

    let vote = null;

    if (voteExists) {
      vote = voteExists;
      if (dir !== voteExists.dir) post.votesCount += dir;
    } else {
      vote = new Vote();

      post.votesCount += dir;
    }

    vote.post = post;
    vote.user = user;
    vote.dir = dir;

    return await this.voteRepository.save(vote);
  }

  async findAll(user) {
    return this.postRepository
      .createQueryBuilder('post')
      .where('post.category IN (:subscriptions)', {
        subscriptions: user.subscription,
      })
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndMapOne(
        'post.voted',
        'post.votes',
        'vote',
        `vote.userId = "${user.id}"`,
      )
      .orderBy(
        `LOG10(ABS(post.votesCount) + 1) * SIGN(post.votesCount) + (UNIX_TIMESTAMP(post.createdAt)/300000)`,
        'DESC',
      )
      .limit(100)
      .getMany();
  }

  async getComments(postId: any, user) {
    return this.commentRepository
      .createQueryBuilder('comment')
      .where('postId = :postId', { postId })
      .leftJoinAndSelect('comment.user', 'user')
      .getMany();

    // return this.postRepository
    //   .createQueryBuilder('post')
    //   .where('post.id = :postId', { postId })
    //   .leftJoinAndSelect('post.user', 'user')
    //   .leftJoinAndSelect('post.comments', 'comments')
    //   .leftJoinAndSelect('comments.user', 'comments.user')
    //   .leftJoinAndMapOne(
    //     'post.voted',
    //     'post.votes',
    //     'vote',
    //     `vote.userId = "${user.id}"`,
    //   )
    //   .getOne();
  }

  async createComment(dto: CreateCommentDto, post: Post, user: User) {
    post.commentsCount += 1;
    const comment = new Comment();
    comment.text = dto.text;
    comment.post = post;
    comment.user = user;

    return this.commentRepository.save(comment);
  }
}
