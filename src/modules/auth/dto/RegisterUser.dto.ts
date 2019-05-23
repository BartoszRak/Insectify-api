import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}