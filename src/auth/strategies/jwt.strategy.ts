import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomLogger } from '../../middlewares/loggerMiddleware';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly customLogger: CustomLogger;

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        });
        this.customLogger = new CustomLogger(JwtStrategy.name);
    }

    async validate(payload) {
        try {
            return { userId: payload.sub, username: payload.username };
        } catch (error) {
            this.customLogger.error(this.validate.name, error.message);
            throw new UnauthorizedException(error);
        }
    }

}