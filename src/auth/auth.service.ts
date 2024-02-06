import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import * as IORedis from 'ioredis';
import { CustomResponse, ResponseDto } from '../middlewares/responseMiddleware';
import { CustomLogger } from '../middlewares/loggerMiddleware';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthDto } from './dto/auth.dto';


dotenv.config();

export interface JwtPayload {
    sub: number;
    username: string;
    type: 'access' | 'refresh' | 'action';
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    private readonly customLogger: CustomLogger;
    private readonly redisClient: IORedis.Redis;
    constructor(
        private readonly customResponse: CustomResponse,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {
        this.customLogger = new CustomLogger(AuthService.name);
        this.redisClient = new IORedis.Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        });
    }


    async register({ username, email, password }: AuthDto): Promise<ResponseDto<AuthTokens>> {
        try {
            const existUser = await this.usersService.findOneByEmail(email);

            if (existUser.result) {
                this.customLogger.error(this.create.name, `User already exists: ${existUser.result.email}`);
                throw new ConflictException('This email already exists!');
            };

            const hashPassword = await this.hashPassword(password);
            const newUser = await this.usersService.create({ username, email, password: hashPassword });
            const result = await this.create(newUser.result);


            return this.customResponse.generateResponse(
                HttpStatus.CREATED,
                result,
                'register'
            );
        } catch (error) {
            this.customLogger.error(this.register.name, error.message);
            throw new InternalServerErrorException(error);
        }
    }

    async login(user: User): Promise<ResponseDto<AuthTokens>> {
        try {

            const result = await this.create(user);

            return await this.customResponse.generateResponse(
                HttpStatus.OK,
                result,
                'login'
            );
        } catch (error) {
            this.customLogger.error(this.login.name, error.message);
            throw new InternalServerErrorException(error);
        }
    }

    async hashPassword(password: string): Promise<string> {
        try {
            return await argon2.hash(password)
        } catch (error) {
            this.customLogger.error(this.hashPassword.name, error.message);
            throw new InternalServerErrorException(error);
        }
    }

    async validateUser({ email, password }: AuthDto): Promise<User> {
        try {


            const user = await this.usersService.findOneByEmail(email);
            if (!user.result) {
                this.customLogger.error(this.validateUser.name, `User not found {email: ${email}}`);
                throw new NotFoundException('User not found');
            }

            if (user && (await argon2.verify(user.result.password, password))) {
                return user.result;
            }

            throw new UnauthorizedException();
        } catch (error) {
            this.customLogger.error(this.validateUser.name, error.message);
            throw new InternalServerErrorException(error);
        }
    }

    async create(user: User): Promise<AuthTokens> {
        try {
            const accessToken = this.generateToken(user, 'access', process.env.JWT_ACCESS_SECRET);
            const refreshToken = this.generateToken(user, 'refresh', process.env.JWT_REFRESH_SECRET);

            await this.saveRefreshTokenToRedis(user.id, refreshToken);

            return { accessToken, refreshToken };
        } catch (error) {
            this.customLogger.error(this.create.name, error.message);
            throw new InternalServerErrorException(error);
        }
    }

    generateToken(user: User, type: 'access' | 'refresh', secret: string): string {
        try {
            const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
            const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
            const payload: JwtPayload = { sub: user.id, username: user.username, type };
            const expiresIn = type === 'access' ? accessExpiresIn : type === 'refresh' ? refreshExpiresIn : '15m';

            return this.jwtService.sign(payload, { expiresIn, secret });
        } catch (error) {
            this.customLogger.error(this.generateToken.name, error.message);
            throw new InternalServerErrorException(error);
        }
    }

    async saveRefreshTokenToRedis(userId: number, refreshToken: string): Promise<void> {
        try {
            await this.redisClient.set(`user:${userId}:refresh-token`, refreshToken);
        } catch (error) {
            this.customLogger.error('saveRefreshTokenToRedis', error.message);
            throw new InternalServerErrorException(error);
        }
    }

    async onModuleDestroy() {
        await this.redisClient.quit();
    }
}
