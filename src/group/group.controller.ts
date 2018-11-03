import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  HttpException,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { UserByIdPipe } from '../user/userbyid.pipe';
import { GroupByIdPipe } from './groupbyid.pipe';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get(':id')
  findOne(@Param('id') id) {
    return this.groupService.findById(id);
  }

  @Post(':id/leave-group')
  leaveGroup(
    @Param('id', GroupByIdPipe) group,
    @Body('user', UserByIdPipe) user: any,
  ) {
    const updated = this.groupService.leaveGroup(group, user);
    if (updated)
      return {
        message: 'Left group',
      };
    else
      throw new HttpException(
        {
          message: 'Failed to remove group',
          errors: { Group: 'Could not remove user from group' },
        },
        401,
      );
  }
}
