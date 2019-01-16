import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '../entity/post.entity';
import { User } from '../entity/user.entity';
import { Vote } from '../entity/vote.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '../entity/comment.entity';
import { MicroLink } from '../entity/microlink.entity';
import * as getUrls from 'get-urls';
import * as rp from 'request-promise';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(MicroLink)
    private readonly microLinkRepository: Repository<MicroLink>,
  ) {}
  async create(dto: CreatePostDto, user: User) {
    const post = new Post();
    post.text = dto.text;
    post.category = dto.category;
    post.user = user;
    post.category = dto.category;

    const urls = Array.from(getUrls(dto.text));
    const links = [];

    if (dto.image) {
      post.image = dto.image;
    } else if (urls.length > 0) {
      for (const url of urls) {
        let response = await rp(`https://api.microlink.io/?url=${url}&video`);
        let data = JSON.parse(response).data;

        console.log(data.video !== null);

        let link = new MicroLink();

        link.title = data.title;
        if (data.image !== null) link.image = data.image.url;
        link.description = data.description;
        link.logo = data.logo.url;
        link.url = data.url;
        links.push(await this.microLinkRepository.save(link));
      }
    }

    post.links = links;

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
    user.subscription =
      user.subscription.length > 0 ? user.subscription : ['General'];

    return this.postRepository
      .createQueryBuilder('post')
      .where('post.category IN (:subscriptions)', {
        subscriptions: user.subscription,
      })
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.links', 'links')
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

  async findByGroup(user, category) {
    user.subscription =
      user.subscription.length > 0 ? user.subscription : ['General'];

    return this.postRepository
      .createQueryBuilder('post')
      .where('post.category = :category', {
        category,
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
