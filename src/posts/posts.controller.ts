import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpStatus,
  HttpException,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { Post as _Post } from './interfaces/post.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createPostDto: CreatePostDto) {
    this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(): Promise<_Post[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param() params) {
    return `This action returns a #${params.id} cat`;
  }
}
