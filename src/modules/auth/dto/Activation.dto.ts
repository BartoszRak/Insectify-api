import { IsEmail, IsString, IsDefined } from 'class-validator'

export class ActivationDto {
  @IsString()
  @IsDefined()
  activationToken: string

  @IsEmail()
  @IsDefined()
  email: string
}