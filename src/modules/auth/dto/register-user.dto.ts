import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string
  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  firstName: string
  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsNotEmpty()
  @IsString()
  postCode: string
  @IsNotEmpty()
  @IsString()
  city: string
  @IsNotEmpty()
  @IsString()
  region: string
  @IsNotEmpty()
  @IsString()
  country: string
  @IsNotEmpty()
  @IsString()
  houseNumber: string
  @IsNotEmpty()
  @IsString()
  flatNumber: string
  @IsNotEmpty()
  @IsString()
  street: string

}