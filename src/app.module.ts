import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import * as fs from 'fs';

const envConfig = (this.envConfig = dotenv.parse(fs.readFileSync('.env')));

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envConfig.DATABASE_HOST,
      port: envConfig.DATABASE_PORT,
      username: envConfig.DATABASE_USER,
      password: envConfig.DATABASE_PASSWORD,
      database: envConfig.DATABASE_DB,
      entities: ['src/**/**.entity{.ts,.js}'],
      synchronize: true,
      cli: {
        entitiesDir: 'src/entity',
      },
    }),
    AuthModule,
    UserModule,
    GroupModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
