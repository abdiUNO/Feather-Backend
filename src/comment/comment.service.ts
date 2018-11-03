import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../entity/user.entity';
import { Comment } from '../entity/comment.entity';
import { Post } from '../entity/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(dto: CreateCommentDto, post: Post, user: User) {
    const comment = new Comment();
    comment.text = dto.text;
    comment.post = post;
    comment.user = user;

    return this.commentRepository.save(comment);
  }
}
