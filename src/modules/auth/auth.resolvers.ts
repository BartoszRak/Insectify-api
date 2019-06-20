import { Inject } from '@nestjs/common'
import { Mutation, Args, Query, Resolver } from '@nestjs/graphql'

import { RegisterUserDto, LoginUserDto, ActivationDto, RequestActivationDto } from './dto'
import { AuthService } from './auth.service'
import { User, AuthorizationToken } from '../../graphql.schema'

@Resolver()
export class AuthResolvers {
  constructor(
    @Inject('AuthService') private readonly auth: AuthService,
  ) {}

  @Mutation('register')
  async register(
    @Args('registerInput') args: RegisterUserDto,
  ): Promise<User> {
    const user: User = await this.auth.register(args)
    return user
  }

  @Mutation('login')
  async login(
    @Args('loginInput') args: LoginUserDto,
  ): Promise<AuthorizationToken> {
    const authorization: AuthorizationToken = await this.auth.login(args)
    return authorization
  }

  @Mutation('activate')
  async activate(
    @Args('activationInput') args: ActivationDto,
  ): Promise<User> {
    const activatedUser: User = await this.auth.activate(args)
    return activatedUser
  }

  @Mutation('requestActivation')
  async requestActivation(
    @Args('requestActivationInput') args: RequestActivationDto,
  ): Promise<User> {
    const requestActivationUser: User = await this.auth.requestActivation(args)
    return requestActivationUser
  }
}