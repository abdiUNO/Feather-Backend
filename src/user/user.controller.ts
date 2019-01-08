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
  Query,
  UseInterceptors,
  FileInterceptor,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { UserByIdPipe } from './userbyid.pipe';
import { AuthService } from '../auth/auth.service';
import { GroupByIdPipe } from '../group/groupbyid.pipe';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { join } from 'path';

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

  @Put('subscribe')
  @UseGuards(AuthGuard())
  async subscribeToGroup(@Req() request, @Query('category') group) {
    const user = request.user;
    return this.userService.subscribeToGroup(user, group);
  }

  @Put('unsubscribe')
  @UseGuards(AuthGuard())
  async unsubscribeToGroup(@Req() request, @Query('category') group) {
    const user = request.user;
    return this.userService.unsubscribeToGroup(user, group);
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
      throw new HttpException(
        { message: 'Incorrect email or password.', errors },
        401,
      );

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

  @Put('image')
  @UseGuards(AuthGuard())
  async uploadFile(@Req() request, @Res() response) {
    try {
      await this.userService.saveImage(request, response, request.user);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }

  @Get('images/:imgId')
  getImage(@Req() request, @Param('imgId') imgId, @Res() res) {
    const imgPath = join(__dirname, '..', `uploads/${request.user.image}`);
    return res.sendFile(imgPath);
  }
}
