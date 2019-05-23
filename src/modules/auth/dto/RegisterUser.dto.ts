import { IsEmail, IsString, IsDefined } from 'class-validator'

export class RegisterUserDto {
  @IsEmail()
  @IsDefined()
  email: string

  @IsString()
  @IsDefined()
  password: string
}