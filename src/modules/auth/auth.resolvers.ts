import { Inject } from '@nestjs/common'
import { Mutation, Args, Resolver } from '@nestjs/graphql'

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
    return this.auth.register(args)
  }

  @Mutation('login')
  async login(
    @Args('loginInput') args: LoginUserDto,
  ): Promise<AuthorizationToken> {
    return this.auth.login(args)
  }

  @Mutation('activate')
  async activate(
    @Args('activationInput') args: ActivationDto,
  ): Promise<User> {
    return this.auth.activate(args)
  }

  @Mutation('requestActivation')
  async requestActivation(
    @Args('requestActivationInput') args: RequestActivationDto,
  ): Promise<User> {
    return this.auth.requestActivation(args)
  }
}