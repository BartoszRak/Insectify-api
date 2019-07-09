import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

import { NotificationsService } from './notifications.service'
import { ActivationService } from './activation.service'
import { StorageService } from '../storage/storage.service'
import { hashPasswordAsync, checkPasswordAsync } from '../../common/helpers/PasswordHelper'
import { User, AuthorizationToken, Session } from '../../graphql.schema'
import { RegisterUserDto, LoginUserDto, ActivationDto, RequestActivationDto } from './dto'
import { jwtSecret } from '../../config'

@Injectable()
export class AuthService {
  constructor(
    @Inject('NotificationsService') private readonly notification: NotificationsService,
    @Inject('ActivationService') private readonly activation: ActivationService,
    @Inject('StorageService') private readonly storage: StorageService,
  ) {}

  public async register(user: RegisterUserDto): Promise<User> {
    const { email, password, firstName, lastName, postCode, city, region, country, houseNumber, flatNumber, street } = user
    const res: User[] = await this.storage.users.getList({
      limit: 1,
      where: [
        { field: 'email', by: '==', value: email }
      ]
    })
    if (res.length !== 0) {
      throw new InternalServerErrorException('User with that email already exists.')
    }

    try {
      const { hash: passwordHash, salt: passwordSalt }: { hash: string, salt: string } = await hashPasswordAsync(password, 40)
      const createdUser: User = await this.storage.users.insertOne({
        firstName,
        lastName,
        email,
        passwordSalt,
        passwordHash,
        activationSalt: null,
        isEmailConfirmed: false,
        roles: ['user'],
        adress: {
          postCode,
          city,
          region,
          country,
          houseNumber,
          flatNumber,
          street,
        }
      } as User)
      await this.notification.sendRegistrationEmail(email)
      await this.activation.requestActivation(email)

      return createdUser
    } catch(err) {
      throw new InternalServerErrorException(`Creating user went wrong. ${err.message}`)
    }
  }

  public async login(user: LoginUserDto): Promise<AuthorizationToken> {
    const { email, password } = user

    const queryRes = await this.storage.users.getList({
      limit: 1,
      where: [
        { field: 'email', by: '==', value: email },
      ]
    })
    
    if (queryRes.length === 0) {
      throw new BadRequestException('There is no user with that email assigned.')
    }

    const fetchedUser: User = { ...queryRes[0] }
    const { passwordHash, passwordSalt, isEmailConfirmed } = fetchedUser
    if (!isEmailConfirmed) {
      throw new InternalServerErrorException('Account has not been activated.')
    }

    const isPasswordValid: boolean = await checkPasswordAsync(password, passwordSalt, passwordHash)
    if (!isPasswordValid) {
      throw new InternalServerErrorException('Password or email is invalid')
    }
  
    const expireTime: number = 3600
    const session: Session = {
      user: fetchedUser,
    }
    const token: string = await jwt.sign({
      data: session,
    }, jwtSecret, {
      algorithm: 'HS256',
      expiresIn: expireTime,
    })
  
    return {
      token,
      expireTime,
    }
  }

  public async activate(activation: ActivationDto): Promise<User> {
    const { activationToken, email } = activation

    const queryRes: any = await this.storage.users.getList({
      limit: 1,
      where: [
        { field: 'email', by: '==', value: email }
      ]
    })

    if (queryRes.length === 0) {
      throw new BadRequestException('Activation failed. There is no user with that email assigned.')
    }
    const user: User = { ...queryRes[0] } as User
    const { activationSalt, isEmailConfirmed } = user
    if (isEmailConfirmed) {
      throw new InternalServerErrorException('Account is already active.')
    }
    const isTokenValid: boolean = await checkPasswordAsync(email, activationSalt, activationToken)
    if(!isTokenValid) {
      throw new InternalServerErrorException('Activation token is invalid or outdated.')
    }
    try {
      const activatedUser: User = await this.storage.users.updateOne({
        ...user,
        isEmailConfirmed: true,
        activationSalt: null,
      })
      return activatedUser
    } catch(err) {
      throw new InternalServerErrorException('Activation process failed.')
    }
  }

  public async requestActivation(request: RequestActivationDto): Promise<User> {
    const { email } = request
    try {
      const user: User = await this.activation.requestActivation(email)
      return user
    } catch(err) {
      throw new InternalServerErrorException('Requesting new activation process failed.')
    }
  }
}