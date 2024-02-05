import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CustomLogger } from '../middlewares/loggerMiddleware';
import { CustomResponse } from '../middlewares/responseMiddleware';
import { HttpStatus } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
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

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('login', () => {
        it('should call authService.login and return the result', async () => {
            const user: User = {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
              }
            const expectedResult = { 
                "status_code": HttpStatus.OK,
                "result": {
                  "accessToken": "mockedAccessToken",
                  "refreshToken": "mockedRefreshToken",
                },
                "message": "logined",
              };
            jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

            const result = await controller.login({user});

            expect(authService.login).toHaveBeenCalledWith(user);
            expect(result).toBe(expectedResult);
        });
    });

    describe('register', () => {
        it('should call authService.register and return the result', async () => {
            const authDto: AuthDto = {
                username: 'testuser',
                email: 'test@gmail.com',
                password: 'password'
                }
            const expectedResult = { 
                "status_code": HttpStatus.CREATED,
                "result": {
                  "accessToken": "mockedAccessToken",
                  "refreshToken": "mockedRefreshToken",
                },
                "message": "register",
              };
              
            jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

            const result = await controller.register(authDto);

            expect(authService.register).toHaveBeenCalledWith(authDto);
            expect(result).toBe(expectedResult);
        });
    });
});
