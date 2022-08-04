import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsString()
    password: string;
}