import { IsEmail, IsString, IsNotEmpty } from 'class-validator'
import { ActivationInput } from '../../../graphql.schema'

export class ActivationDto extends ActivationInput {
  @IsNotEmpty()
  @IsString()
  activationToken: string

  @IsNotEmpty()
  @IsEmail()
  email: string
}