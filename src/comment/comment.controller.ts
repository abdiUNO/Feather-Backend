import { Post, UseGuards, Body, Controller, Req } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { PostByIdPipe } from '../post/postbyid.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('comment')
@UseGuards(AuthGuard())
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @Body() data: CreateCommentDto,
    @Body('postId', PostByIdPipe) post,
    @Req() request,
  ) {
    const comment = await this.commentService.create(data, post, request.user);
    return {
      id: comment.id,
      postId: comment.postId,
      text: comment.text,
    };
  }
}
