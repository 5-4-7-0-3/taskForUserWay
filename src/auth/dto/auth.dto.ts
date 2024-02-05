import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class AuthDto {

    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    email: string;

    @IsString({ message: 'Password should be a string' })
    @MinLength(6, { message: 'Password should be at least 6 characters long' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    password: string;

    @IsString({ message: 'Username should be a string' })
    @IsOptional()
    username?: string;
}