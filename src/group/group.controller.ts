import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { UserByIdPipe } from '../user/userbyid.pipe';
import { GroupByIdPipe } from './groupbyid.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('group')
@UseGuards(AuthGuard())
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  async getGroups(@Req() request) {
    return request.user.groups;
    //const groups = await this.groupService.findAll(request.user);
    //return groups;
  }

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
