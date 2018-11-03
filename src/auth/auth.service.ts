import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './payload.interface';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
//import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(user: User) {
    const accessToken = this.jwtService.sign({ ...user });
    return {
      expiresIn: 3600,
      accessToken,
    };
  }

  async validateUser(payload: any): Promise<any> {
    return await this.userRepository.findOne(payload.id);
  }
}
