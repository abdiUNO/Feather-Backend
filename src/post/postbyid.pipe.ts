import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { Post } from '../entity/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostByIdPipe implements PipeTransform {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const post = await this.postRepository.findOne(value);

    if (!post)
      throw new NotFoundException(`Could not find post by id ${value}`);
    else return post;
  }
}
