import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpException,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { UserByIdPipe } from './userbyid.pipe';
import { AuthService } from '../auth/auth.service';
import { GroupByIdPipe } from '../group/groupbyid.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get(':id/groups')
  @UseGuards(AuthGuard())
  async getGroups(@Param('id', UserByIdPipe) user) {
    return user.groups;
  }

  @Post()
  async create(@Body() userData: CreateUserDto) {
    const user = await this.userService.create(userData);
    const token = await this.authService.createToken(user);

    return { ...user, token };
  }

  @Put(':id/group')
  @UseGuards(AuthGuard())
  async joinGroup(@Param('id', UserByIdPipe) user) {
    return this.userService.joinGroup(user);
  }

  @Delete(':id/group/:group')
  @UseGuards(AuthGuard())
  async leaveGroup(
    @Param('id', UserByIdPipe) user,
    @Param('group', GroupByIdPipe) group,
  ) {
    const updated = this.userService.leaveGroup(user, group);
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

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = { User: ' not found' };
    if (!_user)
      throw new HttpException({ message: 'User login failed', errors }, 401);

    const token = await this.authService.createToken(_user);

    return { ..._user, token };
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async delete(@Param('id', UserByIdPipe) user: any) {
    await this.userService.delete(user);
    return {
      status: 200,
      message: `Deleted user ${user.id}`,
    };
  }
}
