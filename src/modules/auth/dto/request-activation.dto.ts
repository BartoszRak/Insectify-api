import { IsEmail, IsNotEmpty } from 'class-validator'
import { RequestActivationInput } from '../../../graphql.schema'

export class RequestActivationDto extends RequestActivationInput {
  @IsEmail()
  @IsNotEmpty()
  email: string
}