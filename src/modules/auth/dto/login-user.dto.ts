import { IsEmail, IsString, IsDefined } from 'class-validator'

export class LoginUserDto {
  @IsEmail()
  @IsDefined()
  email: string

  @IsString()
  @IsDefined()
  password: string
}