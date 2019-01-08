import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { Post } from '../entity/post.entity';
import { Vote } from '../entity/vote.entity';
import { MicroLink } from '../entity/microlink.entity';
import { Comment } from '../entity/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Vote, Comment, MicroLink]),
    AuthModule,
    HttpModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
