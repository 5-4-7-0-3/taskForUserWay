import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService, AuthTokens } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { CustomLogger } from '../middlewares/loggerMiddleware';
import { CustomResponse, ResponseDto } from '../middlewares/responseMiddleware';
import { User } from '../users/entities/user.entity';
import { HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        UsersService,
        AuthService,
        UsersService,
        JwtService,
        CustomLogger,
        CustomResponse
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const authDto: AuthDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const createdUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(userRepository, 'save').mockResolvedValue(createdUser);

      const result = await usersService.create(createdUser);

      jest.spyOn(authService, 'create').mockResolvedValue({
        accessToken: 'mockedAccessToken',
        refreshToken: 'mockedRefreshToken',
      });

      const response = await authService.register(authDto);

      expect(response).toEqual({
        "status_code": HttpStatus.CREATED,
        "result": {
          "accessToken": "mockedAccessToken",
          "refreshToken": "mockedRefreshToken",
        },
        "message": "register",
      });
    });
  });


  describe('login', () => {
    it('should log in a user', async () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(authService, 'create').mockResolvedValue({
        accessToken: 'mockedAccessToken',
        refreshToken: 'mockedRefreshToken',
      });

      const response = await authService.login(user);

      expect(response).toBeDefined();
      expect(response.result.accessToken).toBeDefined();
      expect(response.result.refreshToken).toBeDefined();
    });
  });
});
