import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

export interface JwtPayload {
    sub: number;
    username: string;
    type: 'access' | 'refresh' | 'action';
}

@Injectable()
export class AuthService {
    async hashPassword(password: string): Promise<string> {
        try {
            return await argon2.hash(password)
        } catch (error) {
            this.customLogger.error(this.create.name, error.message);
            throw new InternalServerErrorException(error);
        }
    }

    private async validateUser(email: string, password: string): Promise<User> {
        try {
            const user = await this.userService.findOneByEmail(email);
            if (user && (await argon2.verify(user.result.password, password))) {
                return user.result;
            }

            throw new UnauthorizedException();
        } catch (error) {
            this.customLogger.error(this.create.name, error.message);
            throw new InternalServerErrorException(error);
        }
    }

    async register(username: string, email: string, password: string): Promise<ResponseDto<Auth>> {
        try {

            const newUser = await this.userService.create({ username, email, password });

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

    async login(email: string, password: string): Promise<ResponseDto<Auth>> {
        try {
            const user = await this.validateUser(email, password);
            const result = await this.create(user);

            return await this.customResponse.generateResponse(
                HttpStatus.OK,
                result,
                'login'
            );
        } catch (error) {
            this.customLogger.error(this.create.name, error.message);
            throw new InternalServerErrorException(error);
        }
    }

    private generateToken(user: User, type: 'access' | 'refresh' | 'action' = 'access', secret: string): string {
        try {
            const payload: JwtPayload = { sub: user.id, username: user.username, type };
            const expiresIn = type === 'access' ? '1h' : type === 'refresh' ? '7d' : '15m';

            return this.jwtService.sign(payload, { expiresIn, secret });
        } catch (error) {
            this.customLogger.error(this.create.name, error.message);
            throw new InternalServerErrorException(error);
        }
    }
}
