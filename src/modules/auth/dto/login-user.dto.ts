import { IsEmail, IsString, IsDefined } from 'class-validator'
import { LoginInput } from '../../../graphql.schema'

export class LoginUserDto extends LoginInput{
  @IsEmail()
  @IsDefined()
  email: string

  @IsString()
  @IsDefined()
  password: string
}