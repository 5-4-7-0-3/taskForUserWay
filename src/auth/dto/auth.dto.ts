import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}