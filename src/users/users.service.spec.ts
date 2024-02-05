import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CustomResponse } from '../middlewares/responseMiddleware';
import { CustomLogger } from '../middlewares/loggerMiddleware';


describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        CustomLogger,
        CustomResponse
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const createdUser: User = {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(userRepository, 'save').mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual({
        status_code: HttpStatus.CREATED,
        result: createdUser,
        message: 'created',
      });
    });
    it('should throw InternalServerErrorException if an error occurs', async () => {
      const username = "test";
      jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error('Internal Server Error'));

      await expect(service.findByUsername(username)).rejects.toThrowError(InternalServerErrorException);
    });

    describe('findByUsername', () => {
      it('should find a user by username', async () => {
        const username = 'testuser';

        const foundUser: User = {
          id: 1,
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password123',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        };

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(foundUser);

        const result = await service.findByUsername(username);

        expect(result).toEqual({
          status_code: HttpStatus.OK,
          result: foundUser,
          message: 'finded',
        });
      });

      it('should throw InternalServerErrorException if user is not found', async () => {
        const username = 'nonexistentuser';

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

        await expect(service.findByUsername(username)).rejects.toThrowError(InternalServerErrorException);
      });
    });

    describe('findOneByEmail', () => {
      it('should find a user by email', async () => {
        const email = 'test@example.com';

        const foundUser: User = {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        };

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(foundUser);

        const result = await service.findOneByEmail(email);

        expect(result).toEqual({
          status_code: HttpStatus.OK,
          result: foundUser,
          message: 'finded',
        });
      });

      it('should throw InternalServerErrorException if user is not found', async () => {
        const email = 'nonexistenttest@example.com';
        jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
          throw new InternalServerErrorException();
        });

        await expect(service.findOneByEmail(email)).rejects.toThrowError(InternalServerErrorException);
      });
    });
  });
});
