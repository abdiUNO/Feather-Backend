import { Injectable } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  private readonly posts: Post[] = [];

  create(post: Post) {
    this.posts.push(post);
  }

  findAll(): Post[] {
    return this.posts;
  }
}
