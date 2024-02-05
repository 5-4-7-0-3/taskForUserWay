import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { CustomLogger } from '../middlewares/loggerMiddleware';
import { CustomResponse } from '../middlewares/responseMiddleware';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtService,
    JwtStrategy,
    LocalStrategy,
    CustomLogger,
    CustomResponse
  ],
  exports: [AuthService]
})
export class AuthModule { }
