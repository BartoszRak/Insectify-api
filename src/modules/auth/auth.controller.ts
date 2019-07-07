import { Controller, Injectable, Inject, Post, Body } from '@nestjs/common'

import { AuthService } from './auth.service'
import { RegisterUserDto, LoginUserDto, ActivationDto, RequestActivationDto } from './dto'
import { User } from '../../graphql.schema'
import { AuthorizationToken } from '../../graphql.schema'

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthService') private readonly auth: AuthService,
  ) {}

  @Post('/register')
  public async register(@Body() registerUser: RegisterUserDto): Promise<User> {
    return this.auth.register(registerUser)
  }

  @Post('/login')
  public async login(@Body() loginUser: LoginUserDto): Promise<AuthorizationToken> {
    return this.auth.login(loginUser)
  }

  @Post('/activate')
  public async activate(@Body() activation: ActivationDto): Promise<User> {
    return this.auth.activate(activation)
  }

  @Post('/requestActivation')
  public async requestActivation(@Body() requestActivation: RequestActivationDto): Promise<User> {
    return this.auth.requestActivation(requestActivation)
  }
}
