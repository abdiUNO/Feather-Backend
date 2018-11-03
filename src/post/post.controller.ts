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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostByIdPipe } from './postbyid.pipe';
@Controller('post')
@UseGuards(AuthGuard())
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(@Req() request) {
    return this.postService.findAll(request.user);
  }

  @Get(':id/comments')
  async getComments(@Param('id') postId: any) {
    return this.postService.getComments(postId);
  }

  @Post(':id/comment')
  async createComment(
    @Param('id', PostByIdPipe) post: any,
    @Body() data: CreateCommentDto,
    @Req() request,
  ) {
    const comment = await this.postService.createComment(
      data,
      post,
      request.user,
    );

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
  async vote(@Req() request, @Param('id') id, @Query('dir') dir: string) {
    const saved = await this.postService.createVote(
      parseInt(dir, 2),
      request.user,
      id,
    );

    if (saved)
      return {
        id: saved.id,
        postId: saved.postId,
        userId: saved.userId,
        dir: saved.dir,
      };
    else throw new HttpException({ message: 'Could not save vote' }, 401);
  }
}
