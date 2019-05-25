import { IsEmail, IsString, IsDefined } from 'class-validator'

export class EmailActivationDto {
  @IsString()
  @IsDefined()
  activationToken: string

  @IsEmail()
  @IsDefined()
  email: string
}