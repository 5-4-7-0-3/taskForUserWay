import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CustomLogger } from '../middlewares/loggerMiddleware';
import { CustomResponse } from '../middlewares/responseMiddleware';
import { User } from './entities/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CustomLogger,
    CustomResponse,
    JwtService,
    JwtStrategy
  ],
  exports: [UsersService]
})
export class UsersModule { }
