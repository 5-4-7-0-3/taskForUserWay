import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CustomLogger } from 'src/middlewares/loggerMiddleware';
import { CustomResponse } from 'src/middlewares/responseMiddleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

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
