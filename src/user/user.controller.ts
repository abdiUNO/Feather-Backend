import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { UserByIdPipe } from './userbyid.pipe';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post()
  async create(@Body() userData: CreateUserDto) {
    const user = await this.userService.create(userData);
    return await this.authService.createToken(user);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = { User: ' not found' };
    if (!_user)
      throw new HttpException({ message: 'User login failed', errors }, 401);

    const token = await this.authService.createToken(_user);

    const { email, username } = _user;
    const user = { email, token, username };
    return { user };
  }

  @Delete(':id')
  async delete(@Param('id', UserByIdPipe) user: any) {
    await this.userService.delete(user);
    return {
      status: 200,
      message: `Deleted user ${user.id}`,
    };
  }
}
