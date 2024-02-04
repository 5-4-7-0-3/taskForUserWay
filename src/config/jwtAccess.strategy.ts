// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AuthService, JwtPayload } from '../../modules/auth/auth.service';

// @Injectable()
// export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
//     constructor(private readonly authService: AuthService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: process.env.JWT_ACCESS_SECRET,
//         });
//     }

//     async validate(payload: JwtPayload) {
//         return { userId: payload.sub, username: payload.username };
//     }
// }
