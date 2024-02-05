import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CustomResponse, ResponseDto } from '../middlewares/responseMiddleware';
import { CustomLogger } from '../middlewares/loggerMiddleware';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly customLogger: CustomLogger;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly customResponse: CustomResponse,

  ) {
    this.customLogger = new CustomLogger(UsersService.name);
  }

  async create(user: CreateUserDto): Promise<ResponseDto<User>> {
    try {
      const savedUser = await this.userRepository.save(user);
      return await this.customResponse.generateResponse(
        HttpStatus.CREATED,
        savedUser,
        'created'
      );
    } catch (error) {
      this.customLogger.error(this.create.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async findByUsername(username: string): Promise<ResponseDto<User>> {
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      if (!user) {
        this.customLogger.error(this.findByUsername.name, `User not found {username: ${username}}`);
        throw new NotFoundException('User not found');
      }
      return await this.customResponse.generateResponse(
        HttpStatus.OK,
        user,
        'finded'
      );
    } catch (error) {
      this.customLogger.error(this.findByUsername.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByEmail(email: string): Promise<ResponseDto<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      return await this.customResponse.generateResponse(
        HttpStatus.OK,
        user,
        'finded'
      );
    } catch (error) {
      this.customLogger.error(this.findOneByEmail.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }
}
