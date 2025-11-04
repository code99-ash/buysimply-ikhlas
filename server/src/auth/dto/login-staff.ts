import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginStaffDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsBoolean()
    rememberMe: boolean;
}