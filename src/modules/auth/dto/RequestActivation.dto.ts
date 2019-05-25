import { IsEmail, IsDefined } from 'class-validator'

export class RequestActivationDto {
  @IsEmail()
  @IsDefined()
  email: string
}