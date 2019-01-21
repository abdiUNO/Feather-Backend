import {
  Post,
  Req,
  UseGuards,
  Controller,
  Body,
  Get,
  Query,
  Param,
  Put,
  HttpException,
  HttpService,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostByIdPipe } from './postbyid.pipe';

@Controller('post')
@UseGuards(AuthGuard())
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  findAll(@Req() request) {
    return this.postService.findAll(request.user);
  }

  @Get('category/:id')
  findByGroup(@Req() request, @Param('id') category: any) {
    return this.postService.findByGroup(request.user, category);
  }

  @Get(':id/comments')
  async getComments(@Req() request, @Param('id') postId: any) {
    return this.postService.getComments(postId, request.user);
  }

  @Post(':id/comment')
  async createComment(
    @Param('id', PostByIdPipe) post: any,
    @Body() data: CreateCommentDto,
    @Req() request,
  ) {
    console.log('Creating comment');

    const comment = await this.postService.createComment(
      data,
      post,
      request.user,
    );

    this.postService.sendNotification(data.text, post, request.user);

    return {
      id: comment.id,
      postId: comment.postId,
      text: comment.text,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      time: comment.time,
      user: comment.user,
      votesCount: comment.votesCount,
    };
  }

  @Post()
  async create(@Req() request, @Body() postData: CreatePostDto) {
    return this.postService.create(postData, request.user);
  }

  @Put(':id/vote')
  async vote(
    @Req() request,
    @Param('id', PostByIdPipe) post,
    @Query('dir') dir: string,
  ) {
    const saved = await this.postService.createVote(
      parseInt(dir, 2),
      request.user,
      post,
    );

    if (saved)
      return {
        id: saved.id,
        postId: saved.postId,
        userId: saved.userId,
        dir: saved.dir,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      };
    else throw new HttpException({ message: 'Could not save vote' }, 401);
  }
}
