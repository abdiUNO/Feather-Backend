import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { UserModule } from './user/user.module';
import {TypeOrm}
@Module({
  imports: [UserModule],
  controllers: [AppController, PostsController],
  providers: [AppService, PostsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
