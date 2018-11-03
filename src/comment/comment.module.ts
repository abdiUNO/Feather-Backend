import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from '../entity/comment.entity';
import { Post } from '../entity/post.entity';
import { Vote } from '../entity/vote.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, Vote]), AuthModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
