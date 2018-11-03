import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from '../repositories/group.repository';
import { User } from '../entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, GroupRepository])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
