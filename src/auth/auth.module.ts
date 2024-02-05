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
import { PassportModule } from '@nestjs/passport';
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
