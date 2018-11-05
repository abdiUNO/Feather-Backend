import { Module, MulterModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { Group } from '../entity/group.entity';
import { GroupRepository } from '../repositories/group.repository';
import { JwtStrategy } from '../auth/jwt.strategy';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, GroupRepository]),
    MulterModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
