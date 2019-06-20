import { Controller, Injectable, Inject, Post, Body } from '@nestjs/common'

import { NotificationsService } from './notifications.service'
import { ActivationService } from './activation.service'
import { AuthService } from './auth.service'
import { StorageService } from '../storage/storage.service'
import { RegisterUserDto, LoginUserDto, ActivationDto, RequestActivationDto } from './dto'
import { User } from '../../graphql.schema'
import { AuthorizationToken } from '../../graphql.schema'

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('NotificationsService') private readonly notification: NotificationsService,
    @Inject('ActivationService') private readonly activation: ActivationService,
    @Inject('StorageService') private readonly storage: StorageService,
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
