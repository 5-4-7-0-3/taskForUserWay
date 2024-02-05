import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomLogger } from '../middlewares/loggerMiddleware';
import { CustomResponse } from '../middlewares/responseMiddleware';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { User } from './entities/user.entity';
import { HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
    let service: UsersService;
    let controller: UsersController;
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
                CustomResponse,
                JwtService,
                UsersController,
                JwtAuthGuard,
                JwtStrategy
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        controller = module.get<UsersController>(UsersController);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('findByUsername', () => {
        it('should return the user with the given username', async () => {
            const username = 'test';
            const req = { body: { username: 'test' } };

            const foundUser: User = {
                id: 1,
                username: 'test',
                email: 'testuser@example.com',
                password: 'password123',
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(foundUser);
            const result = await controller.findByUsername(req);

            expect(result).toBeDefined();
            expect(result).toEqual({
                status_code: HttpStatus.OK,
                result: foundUser,
                message: 'finded',
            }
            );
        });
    });
});
