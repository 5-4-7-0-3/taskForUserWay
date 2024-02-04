import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CustomLogger } from 'src/middlewares/loggerMiddleware';
import { CustomResponse } from 'src/middlewares/responseMiddleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, CustomLogger, CustomResponse],
})
export class UsersModule { }
