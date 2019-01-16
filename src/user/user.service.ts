import {
  Injectable,
  Inject,
  NotFoundException,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Group } from '../entity/group.entity';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { UserData } from './user.interface';
import * as crypto from 'crypto';
import { GroupRepository } from '../repositories/group.repository';
import * as multer from 'multer';
import * as aws from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { extname } from 'path';

const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new aws.S3({
  region: 'sfo2',
  endpoint: 'https://sfo2.digitaloceanspaces.com',
  accessKeyId: '6F7TJUERMUWIKSK5ECE6',
  secretAccessKey: 'lsVOQLkasuCIM3vltBe1b1XVnJeFHJfdt9brklP6zUU',
});

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(GroupRepository)
    private readonly groupRepository: GroupRepository,
  ) {}

  async findOne(loginUserDto: LoginUserDto): Promise<User> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto
        .createHmac('sha256', loginUserDto.password)
        .digest('hex'),
    };

    return await this.userRepository.findOne({
      where: findOneOptions,
      relations: ['groups'],
    });
  }

  async joinGroup(user: User) {
    const errors = { groups: 'joined max groups' };

    if (user.groups.length >= 3) {
      throw new HttpException(
        { message: 'User already joined max amount of groups(3)', errors },
        HttpStatus.FORBIDDEN,
      );
    }

    const ids = user.groups.map(g => g.id);
    const group = await this.groupRepository.findOrCreate(ids);

    delete user.groups;
    group.users.push(user);

    return this.groupRepository.save(group);
  }

  async leaveGroup(user, group) {
    group.users = group.users.filter(u => u.id !== user.id);
    return this.groupRepository.save(group);
  }

  async create(data: CreateUserDto): Promise<User> {
    const emailExists = await this.userRepository.findOne({
      email: data.email,
    });

    if (emailExists) {
      const errors = { username: 'Username and email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    const group = await this.groupRepository.findOrCreate([]);
    console.log(group);
    const user = new User();
    user.username = data.username;
    user.password = data.password;
    user.email = data.email;
    user.groups = [group];
    user.subscription = [];

    return await this.userRepository.save(user);
  }

  async delete(user: User): Promise<any> {
    return await this.userRepository.delete(user);
  }

  async subscribeToGroup(user: User, group: string) {
    user.subscription.push(group);
    return this.userRepository.save(user);
  }

  async unsubscribeToGroup(user: User, group: string) {
    user.subscription = user.subscription.filter(
      category => category !== group,
    );
    return this.userRepository.save(user);
  }

  async saveImage(@Req() req, @Res() res, user: User) {
    try {
      this.upload(req, res, error => {
        if (error) {
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        const image = req.files[0].key;
        user.image = image;
        this.userRepository.save(user);
        return res.status(201).json({
          image,
          user: user.id,
        });
      });
    } catch (error) {
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  async uploadImage(@Req() req, @Res() res) {
    try {
      this.upload(req, res, error => {
        if (error) {
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        const image = req.files[0].key;
        return res.status(201).json({
          image,
        });
      });
    } catch (error) {
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3,
      bucket: 'feather',
      acl: 'public-read',
      key: (request, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');

        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }).array('file', 1);
}
