import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { CustomLogger } from 'src/middlewares/loggerMiddleware';
import { CustomResponse } from 'src/middlewares/responseMiddleware';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from './strategies/jwtAccess.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtService,
    JwtAccessStrategy,
    CustomLogger,
    CustomResponse
  ],
  exports: [AuthService]
})
export class AuthModule { }
